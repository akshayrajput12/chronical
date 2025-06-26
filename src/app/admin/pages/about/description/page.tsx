"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Eye,
    Info,
    ExternalLink,
    CheckCircle,
    XCircle,
    AlertCircle,
    X,
    Upload,
    Trash2,
    Image as ImageIcon,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import {
    AboutDescriptionSection,
    AboutDescriptionSectionInput,
    AboutDescriptionImage,
    AboutDescriptionImageInput,
    AboutDescriptionNotification,
} from "@/types/about";

const AboutDescriptionEditor = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // State for description data
    const [sectionData, setSectionData] =
        useState<AboutDescriptionSectionInput>({
            section_heading: "",
            section_description: "",
            background_color: "#f9f7f7",
            service_1_title: "",
            service_1_icon_url: "",
            service_1_description: "",
            service_2_title: "",
            service_2_icon_url: "",
            service_2_description: "",
            service_3_title: "",
            service_3_icon_url: "",
            service_3_description: "",
            is_active: true,
        });

    const [images, setImages] = useState<AboutDescriptionImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Notification state
    const [notification, setNotification] =
        useState<AboutDescriptionNotification>({
            show: false,
            type: "info",
            title: "",
            message: "",
        });

    // Notification helper function
    const showNotification = (
        type: "success" | "error" | "info",
        title: string,
        message: string,
    ) => {
        setNotification({
            show: true,
            type,
            title,
            message,
        });

        // Auto-hide after 5 seconds
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    // Load existing data
    useEffect(() => {
        loadDescriptionData();
        loadDescriptionImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDescriptionData = async () => {
        try {
            setLoading(true);

            // First, let's try to check if the table exists by querying directly
            const { data: tableCheck, error: tableError } = await supabase
                .from("about_description_sections")
                .select("*")
                .limit(1);

            if (tableError) {
                console.error(
                    "Table doesn't exist or access denied:",
                    tableError,
                );
                showNotification(
                    "error",
                    "Database Error",
                    "Database tables not found. Please run the description schema script first.",
                );
                return;
            }

            // Use the database function to get description data
            const { data, error } = await supabase.rpc(
                "get_about_description_section",
            );

            if (error) {
                console.error("Error fetching description data:", error);
                showNotification(
                    "error",
                    "Database Error",
                    `Failed to load description data: ${error.message}`,
                );
                return;
            }

            if (data && data.length > 0) {
                const descriptionSection = data[0];

                setSectionData({
                    section_heading: descriptionSection.section_heading,
                    section_description: descriptionSection.section_description,
                    background_color:
                        descriptionSection.background_color || "#f9f7f7",
                    service_1_title: descriptionSection.service_1_title,
                    service_1_icon_url: descriptionSection.service_1_icon_url,
                    service_1_description:
                        descriptionSection.service_1_description || "",
                    service_2_title: descriptionSection.service_2_title,
                    service_2_icon_url: descriptionSection.service_2_icon_url,
                    service_2_description:
                        descriptionSection.service_2_description || "",
                    service_3_title: descriptionSection.service_3_title,
                    service_3_icon_url: descriptionSection.service_3_icon_url,
                    service_3_description:
                        descriptionSection.service_3_description || "",
                    is_active: descriptionSection.is_active,
                });
            } else {
                // Fallback to default data if no data found
                setSectionData({
                    section_heading: "Computer Software and ITES:",
                    section_description:
                        "ESC has emerged as a prime institution spearheading interest of Electronics and IT industry in the country.",
                    background_color: "#f9f7f7",
                    service_1_title: "Customised Software Development",
                    service_1_icon_url: "/icons/code.svg",
                    service_1_description: "",
                    service_2_title: "Software Products",
                    service_2_icon_url: "/icons/computer.svg",
                    service_2_description: "",
                    service_3_title: "IT Enabled Services",
                    service_3_icon_url: "/icons/gear.svg",
                    service_3_description: "",
                    is_active: true,
                });
            }
        } catch (error) {
            console.error("Error loading description data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to load description data",
            );
        } finally {
            setLoading(false);
        }
    };

    const loadDescriptionImages = async () => {
        try {
            // Use the database function to get images
            const { data, error } = await supabase.rpc(
                "get_about_description_images",
            );

            if (error) {
                console.error("Error fetching description images:", error);
                return;
            }

            if (data) {
                // Construct proper image URLs for each image
                const imagesWithUrls = data.map(
                    (image: AboutDescriptionImage) => {
                        const { data: urlData } = supabase.storage
                            .from("about-description")
                            .getPublicUrl(image.file_path);

                        return {
                            ...image,
                            file_url: urlData.publicUrl,
                        };
                    },
                );

                setImages(imagesWithUrls);
            }
        } catch (error) {
            console.error("Error loading description images:", error);
        }
    };

    const saveDescriptionData = async () => {
        setSaving(true);
        try {
            // Validate required fields
            if (!sectionData.section_heading.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Section heading is required",
                );
                return;
            }

            if (!sectionData.section_description.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Section description is required",
                );
                return;
            }

            // Validate service titles
            if (!sectionData.service_1_title.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Service 1 title is required",
                );
                return;
            }

            if (!sectionData.service_2_title.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Service 2 title is required",
                );
                return;
            }

            if (!sectionData.service_3_title.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Service 3 title is required",
                );
                return;
            }

            // Prepare data for database
            const dataToSave = {
                section_heading: sectionData.section_heading.trim(),
                section_description: sectionData.section_description.trim(),
                background_color: sectionData.background_color || "#f9f7f7",
                service_1_title: sectionData.service_1_title.trim(),
                service_1_icon_url: sectionData.service_1_icon_url.trim(),
                service_1_description:
                    sectionData.service_1_description?.trim() || "",
                service_2_title: sectionData.service_2_title.trim(),
                service_2_icon_url: sectionData.service_2_icon_url.trim(),
                service_2_description:
                    sectionData.service_2_description?.trim() || "",
                service_3_title: sectionData.service_3_title.trim(),
                service_3_icon_url: sectionData.service_3_icon_url.trim(),
                service_3_description:
                    sectionData.service_3_description?.trim() || "",
                is_active: sectionData.is_active,
            };

            // Check if record exists (get the most recent one)
            const { data: existingData, error: fetchError } = await supabase
                .from("about_description_sections")
                .select("id")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (fetchError) {
                console.error("Error fetching existing data:", fetchError);
                throw fetchError;
            }

            if (existingData && existingData.length > 0) {
                // Update existing record
                const { error } = await supabase
                    .from("about_description_sections")
                    .update(dataToSave)
                    .eq("id", existingData[0].id);

                if (error) {
                    console.error("Error updating data:", error);
                    throw error;
                }
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("about_description_sections")
                    .insert([dataToSave]);

                if (error) {
                    console.error("Error inserting data:", error);
                    throw error;
                }
            }

            showNotification(
                "success",
                "Success!",
                "Description section saved successfully!",
            );

            // Reload data to get the latest from database
            await loadDescriptionData();
        } catch (error) {
            console.error("Error saving description data:", error);

            let errorMessage = "Unknown error";
            if (error && typeof error === "object" && "message" in error) {
                errorMessage = (error as Error).message;

                // Check for common database issues
                if (
                    errorMessage.includes(
                        'relation "about_description_sections" does not exist',
                    )
                ) {
                    errorMessage =
                        "Database table not found. Please run the description schema script first.";
                } else if (errorMessage.includes("violates check constraint")) {
                    errorMessage =
                        "Data validation failed. Please check your input and try again.";
                } else if (errorMessage.includes("permission denied")) {
                    errorMessage =
                        "Permission denied. Please check your authentication.";
                }
            }

            showNotification(
                "error",
                "Error",
                `Failed to save description section: ${errorMessage}`,
            );
        } finally {
            setSaving(false);
        }
    };

    // Image upload function
    const handleImageUpload = useCallback(
        async (files: FileList) => {
            if (!files || files.length === 0) return;

            setUploading(true);
            try {
                for (const file of Array.from(files)) {
                    // Validate file type
                    if (!file.type.startsWith("image/")) {
                        showNotification(
                            "error",
                            "Invalid File",
                            `${file.name} is not an image file`,
                        );
                        continue;
                    }

                    // Validate file size (50MB limit)
                    if (file.size > 50 * 1024 * 1024) {
                        showNotification(
                            "error",
                            "File Too Large",
                            `${file.name} is larger than 50MB`,
                        );
                        continue;
                    }

                    // Generate unique filename
                    const fileExt = file.name.split(".").pop();
                    const fileName = `${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2)}.${fileExt}`;
                    const filePath = `uploads/${fileName}`;

                    // Upload to Supabase storage
                    const { error: uploadError } = await supabase.storage
                        .from("about-description")
                        .upload(filePath, file);

                    if (uploadError) {
                        console.error("Upload error:", uploadError);
                        showNotification(
                            "error",
                            "Upload Failed",
                            `Failed to upload ${file.name}`,
                        );
                        continue;
                    }

                    // Create image record in database
                    const imageData: AboutDescriptionImageInput = {
                        file_name: file.name,
                        file_path: filePath,
                        file_size: file.size,
                        mime_type: file.type,
                        alt_text: `Description image - ${file.name}`,
                        display_order: images.length,
                        is_active: true,
                    };

                    const { data: newImage, error: dbError } = await supabase
                        .from("about_description_images")
                        .insert([imageData])
                        .select()
                        .single();

                    if (dbError) {
                        console.error("Database error:", dbError);
                        showNotification(
                            "error",
                            "Database Error",
                            `Failed to save ${file.name} to database`,
                        );
                        continue;
                    }

                    // Add proper URL to the new image
                    const { data: urlData } = supabase.storage
                        .from("about-description")
                        .getPublicUrl(newImage.file_path);

                    const imageWithUrl = {
                        ...newImage,
                        file_url: urlData.publicUrl,
                    };

                    // Add to local state
                    setImages(prev => [...prev, imageWithUrl]);
                    showNotification(
                        "success",
                        "Upload Successful",
                        `${file.name} uploaded successfully`,
                    );
                }
            } catch (error) {
                console.error("Error uploading images:", error);
                showNotification(
                    "error",
                    "Upload Error",
                    "Failed to upload images",
                );
            } finally {
                setUploading(false);
            }
        },
        [images.length],
    );

    // Image deletion function
    const handleImageDelete = async (imageId: string) => {
        try {
            const imageToDelete = images.find(img => img.id === imageId);
            if (!imageToDelete) return;

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from("about-description")
                .remove([imageToDelete.file_path]);

            if (storageError) {
                console.error("Storage deletion error:", storageError);
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from("about_description_images")
                .delete()
                .eq("id", imageId);

            if (dbError) {
                console.error("Database deletion error:", dbError);
                showNotification(
                    "error",
                    "Delete Failed",
                    "Failed to delete image from database",
                );
                return;
            }

            // Remove from local state
            setImages(prev => prev.filter(img => img.id !== imageId));

            showNotification(
                "success",
                "Image Deleted",
                "Image deleted successfully",
            );
        } catch (error) {
            console.error("Error deleting image:", error);
            showNotification("error", "Delete Error", "Failed to delete image");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39]"></div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Notification */}
            {notification.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-4 right-4 z-50 max-w-md"
                >
                    <Card
                        className={`border-l-4 ${
                            notification.type === "success"
                                ? "border-l-green-500 bg-green-50"
                                : notification.type === "error"
                                ? "border-l-red-500 bg-red-50"
                                : "border-l-blue-500 bg-blue-50"
                        }`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    {notification.type === "success" && (
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                    )}
                                    {notification.type === "error" && (
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    )}
                                    {notification.type === "info" && (
                                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    )}
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {notification.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        setNotification(prev => ({
                                            ...prev,
                                            show: false,
                                        }))
                                    }
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        About Description Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the description section of the about page
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open("/about", "_blank")}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={saveDescriptionData}
                        disabled={saving}
                        className="bg-[#a5cd39] hover:bg-[#94b933]"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div variants={itemVariants}>
                <Tabs defaultValue="content" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="content">
                            Content Settings
                        </TabsTrigger>
                        <TabsTrigger value="media">
                            Media Management
                        </TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    {/* Content Settings Tab */}
                    <TabsContent value="content" className="space-y-6">
                        {/* Section Header */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Header</CardTitle>
                                <CardDescription>
                                    Configure the main heading and description
                                    for the description section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="section_heading">
                                        Section Heading
                                    </Label>
                                    <Input
                                        id="section_heading"
                                        value={sectionData.section_heading}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                section_heading: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the section heading"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="section_description">
                                        Section Description
                                    </Label>
                                    <Textarea
                                        id="section_description"
                                        value={sectionData.section_description}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                section_description:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the section description"
                                        rows={6}
                                        className="resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="background_color">
                                        Background Color
                                    </Label>
                                    <Input
                                        id="background_color"
                                        type="color"
                                        value={sectionData.background_color}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                background_color:
                                                    e.target.value,
                                            }))
                                        }
                                        className="w-20 h-10"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={sectionData.is_active}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                is_active: e.target.checked,
                                            }))
                                        }
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                    <p className="text-sm text-gray-500">
                                        Uncheck to hide this section from the
                                        website
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Services Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Service Items</CardTitle>
                                <CardDescription>
                                    Configure the three service items displayed
                                    in the section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Service 1 */}
                                <div className="border rounded-lg p-4 space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        Service 1
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                value={
                                                    sectionData.service_1_title
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        service_1_title:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="Enter service 1 title"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Icon URL</Label>
                                            <Input
                                                value={
                                                    sectionData.service_1_icon_url
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        service_1_icon_url:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="/icons/code.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description (Optional)</Label>
                                        <Textarea
                                            value={
                                                sectionData.service_1_description
                                            }
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    service_1_description:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="Enter service 1 description"
                                            rows={2}
                                            className="resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Service 2 */}
                                <div className="border rounded-lg p-4 space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        Service 2
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                value={
                                                    sectionData.service_2_title
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        service_2_title:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="Enter service 2 title"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Icon URL</Label>
                                            <Input
                                                value={
                                                    sectionData.service_2_icon_url
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        service_2_icon_url:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="/icons/computer.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description (Optional)</Label>
                                        <Textarea
                                            value={
                                                sectionData.service_2_description
                                            }
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    service_2_description:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="Enter service 2 description"
                                            rows={2}
                                            className="resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Service 3 */}
                                <div className="border rounded-lg p-4 space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        Service 3
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                value={
                                                    sectionData.service_3_title
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        service_3_title:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="Enter service 3 title"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Icon URL</Label>
                                            <Input
                                                value={
                                                    sectionData.service_3_icon_url
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        service_3_icon_url:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="/icons/gear.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description (Optional)</Label>
                                        <Textarea
                                            value={
                                                sectionData.service_3_description
                                            }
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    service_3_description:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="Enter service 3 description"
                                            rows={2}
                                            className="resize-none"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Media Management Tab */}
                    <TabsContent value="media" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Image Upload</CardTitle>
                                <CardDescription>
                                    Upload and manage images for description
                                    section
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={e => {
                                                if (e.target.files) {
                                                    handleImageUpload(
                                                        e.target.files,
                                                    );
                                                }
                                            }}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                            <p className="text-lg font-medium text-gray-900 mb-2">
                                                Upload Images
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Click to select images or drag
                                                and drop
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Supports: JPG, PNG, WebP, GIF
                                                (Max: 50MB each)
                                            </p>
                                        </label>
                                    </div>

                                    {uploading && (
                                        <div className="flex items-center justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#a5cd39] mr-2"></div>
                                            <span className="text-sm text-gray-600">
                                                Uploading images...
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Uploaded Images</CardTitle>
                                <CardDescription>
                                    Manage your uploaded description images
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {images.length === 0 ? (
                                    <div className="text-center py-8">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            No images uploaded yet
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Upload some images to get started
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {images.map(image => (
                                            <div
                                                key={image.id}
                                                className="border rounded-lg overflow-hidden bg-white shadow-sm"
                                            >
                                                <div className="aspect-video relative">
                                                    <img
                                                        src={image.file_url}
                                                        alt={
                                                            image.alt_text ||
                                                            image.file_name
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {image.file_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {(
                                                            image.file_size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                        MB
                                                    </p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                            Available
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleImageDelete(
                                                                    image.id,
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preview Tab */}
                    <TabsContent value="preview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    Preview how the description section will
                                    appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.section_heading ? (
                                    <div
                                        className="p-8 rounded-lg"
                                        style={{
                                            backgroundColor:
                                                sectionData.background_color,
                                        }}
                                    >
                                        {/* Section Header Preview */}
                                        <div className="text-center mb-12">
                                            <p className="text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
                                                {
                                                    sectionData.section_description
                                                }
                                            </p>
                                            <h2 className="text-3xl font-bold text-gray-900 mb-10 relative inline-block">
                                                {sectionData.section_heading}
                                                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-[#a5cd39] rounded-full w-1/2" />
                                            </h2>
                                        </div>

                                        {/* Services Preview */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {/* Service 1 */}
                                            <div className="bg-white p-8 text-center rounded-lg border border-gray-100 shadow-sm">
                                                <div className="flex justify-center mb-6">
                                                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full p-3">
                                                        {sectionData.service_1_icon_url && (
                                                            <img
                                                                src={
                                                                    sectionData.service_1_icon_url
                                                                }
                                                                alt={
                                                                    sectionData.service_1_title
                                                                }
                                                                className="w-12 h-12 object-contain"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    {
                                                        sectionData.service_1_title
                                                    }
                                                </h3>
                                                {sectionData.service_1_description && (
                                                    <p className="text-gray-600 text-sm">
                                                        {
                                                            sectionData.service_1_description
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Service 2 */}
                                            <div className="bg-white p-8 text-center rounded-lg border border-gray-100 shadow-sm">
                                                <div className="flex justify-center mb-6">
                                                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full p-3">
                                                        {sectionData.service_2_icon_url && (
                                                            <img
                                                                src={
                                                                    sectionData.service_2_icon_url
                                                                }
                                                                alt={
                                                                    sectionData.service_2_title
                                                                }
                                                                className="w-12 h-12 object-contain"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    {
                                                        sectionData.service_2_title
                                                    }
                                                </h3>
                                                {sectionData.service_2_description && (
                                                    <p className="text-gray-600 text-sm">
                                                        {
                                                            sectionData.service_2_description
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Service 3 */}
                                            <div className="bg-white p-8 text-center rounded-lg border border-gray-100 shadow-sm">
                                                <div className="flex justify-center mb-6">
                                                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full p-3">
                                                        {sectionData.service_3_icon_url && (
                                                            <img
                                                                src={
                                                                    sectionData.service_3_icon_url
                                                                }
                                                                alt={
                                                                    sectionData.service_3_title
                                                                }
                                                                className="w-12 h-12 object-contain"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    {
                                                        sectionData.service_3_title
                                                    }
                                                </h3>
                                                {sectionData.service_3_description && (
                                                    <p className="text-gray-600 text-sm">
                                                        {
                                                            sectionData.service_3_description
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Enter section content to see the
                                            preview
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Live Preview</CardTitle>
                                <CardDescription>
                                    View the actual about page to see your
                                    changes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        window.open("/about", "_blank")
                                    }
                                    className="w-full"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open About Page in New Tab
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
};

export default AboutDescriptionEditor;
