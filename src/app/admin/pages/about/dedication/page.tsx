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
    Plus,
    GripVertical,
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
    AboutDedicationSection,
    AboutDedicationSectionInput,
    AboutDedicationItem,
    AboutDedicationItemInput,
    AboutDedicationImage,
    AboutDedicationImageInput,
    AboutDedicationNotification,
} from "@/types/about";

const AboutDedicationEditor = () => {
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

    // State for dedication data
    const [sectionData, setSectionData] = useState<AboutDedicationSectionInput>(
        {
            section_heading: "",
            section_description: "",
            is_active: true,
        },
    );

    const [items, setItems] = useState<AboutDedicationItem[]>([]);
    const [images, setImages] = useState<AboutDedicationImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Notification state
    const [notification, setNotification] =
        useState<AboutDedicationNotification>({
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
        loadDedicationData();
        loadDedicationItems();
        loadDedicationImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDedicationData = async () => {
        try {
            setLoading(true);

            console.log("Loading dedication data...");

            // First, let's try to check if the table exists by querying directly
            const { data: tableCheck, error: tableError } = await supabase
                .from("about_dedication_sections")
                .select("*")
                .limit(1);

            console.log("Table check result:", { tableCheck, tableError });

            if (tableError) {
                console.error(
                    "Table doesn't exist or access denied:",
                    tableError,
                );
                showNotification(
                    "error",
                    "Database Error",
                    "Database tables not found. Please run the dedication schema script first.",
                );
                return;
            }

            // Use the database function to get dedication data
            const { data, error } = await supabase.rpc(
                "get_about_dedication_section",
            );

            console.log("RPC function result:", { data, error });

            if (error) {
                console.error("Error fetching dedication data:", error);
                showNotification(
                    "error",
                    "Database Error",
                    `Failed to load dedication data: ${error.message}`,
                );
                return;
            }

            if (data && data.length > 0) {
                const dedicationSection = data[0];
                console.log("Found dedication section:", dedicationSection);

                setSectionData({
                    section_heading: dedicationSection.section_heading,
                    section_description:
                        dedicationSection.section_description || "",
                    is_active: dedicationSection.is_active,
                });
            } else {
                console.log("No dedication section found, using default data");
                // Fallback to default data if no data found
                setSectionData({
                    section_heading: "DEDICATION TO QUALITY AND PRECISION",
                    section_description: "",
                    is_active: true,
                });
            }
        } catch (error) {
            console.error("Error loading dedication data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to load dedication data",
            );
        } finally {
            setLoading(false);
        }
    };

    const loadDedicationItems = async () => {
        try {
            console.log("Loading dedication items...");

            // First check if items table exists
            const { data: itemsTableCheck, error: itemsTableError } =
                await supabase
                    .from("about_dedication_items")
                    .select("*")
                    .limit(1);

            console.log("Items table check:", {
                itemsTableCheck,
                itemsTableError,
            });

            if (itemsTableError) {
                console.error("Items table doesn't exist:", itemsTableError);
                return;
            }

            // Use the database function to get dedication items
            const { data, error } = await supabase.rpc(
                "get_about_dedication_items",
            );

            console.log("Items RPC result:", { data, error });

            if (error) {
                console.error("Error fetching dedication items:", error);
                return;
            }

            if (data) {
                console.log("Found dedication items:", data);
                // Construct proper image URLs for each item
                const itemsWithUrls = data.map((item: AboutDedicationItem) => {
                    let imageUrl = null;
                    if (item.image_url) {
                        const { data: urlData } = supabase.storage
                            .from("about-dedication")
                            .getPublicUrl(item.image_url);
                        imageUrl = urlData.publicUrl;
                    }

                    return {
                        ...item,
                        image_url: imageUrl,
                    };
                });

                setItems(itemsWithUrls);
                console.log("Set items:", itemsWithUrls);
            } else {
                console.log("No dedication items found");
            }
        } catch (error) {
            console.error("Error loading dedication items:", error);
        }
    };

    const loadDedicationImages = async () => {
        try {
            // Use the database function to get images
            const { data, error } = await supabase.rpc(
                "get_about_dedication_images",
            );

            if (error) {
                console.error("Error fetching dedication images:", error);
                return;
            }

            if (data) {
                // Construct proper image URLs for each image
                const imagesWithUrls = data.map(
                    (image: AboutDedicationImage) => {
                        const { data: urlData } = supabase.storage
                            .from("about-dedication")
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
            console.error("Error loading dedication images:", error);
        }
    };

    const saveDedicationData = async () => {
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

            // Validate items
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (!item.title.trim()) {
                    showNotification(
                        "error",
                        "Validation Error",
                        `Item ${i + 1}: Title is required`,
                    );
                    return;
                }
                if (!item.description.trim()) {
                    showNotification(
                        "error",
                        "Validation Error",
                        `Item ${i + 1}: Description is required`,
                    );
                    return;
                }
            }

            // Prepare section data for database
            const sectionDataToSave = {
                section_heading: sectionData.section_heading.trim(),
                section_description:
                    sectionData.section_description?.trim() || null,
                is_active: sectionData.is_active,
            };

            // Check if section record exists (get the most recent one)
            const { data: existingData, error: fetchError } = await supabase
                .from("about_dedication_sections")
                .select("id")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (fetchError) {
                console.error("Error fetching existing data:", fetchError);
                throw fetchError;
            }

            let sectionId: string;

            if (existingData && existingData.length > 0) {
                // Update existing section record
                const { error } = await supabase
                    .from("about_dedication_sections")
                    .update(sectionDataToSave)
                    .eq("id", existingData[0].id);

                if (error) {
                    console.error("Error updating section data:", error);
                    throw error;
                }
                sectionId = existingData[0].id;
            } else {
                // Insert new section record
                const { data: newSection, error } = await supabase
                    .from("about_dedication_sections")
                    .insert([sectionDataToSave])
                    .select()
                    .single();

                if (error) {
                    console.error("Error inserting section data:", error);
                    throw error;
                }
                sectionId = newSection.id;
            }

            // Now save the dedication items
            if (items.length > 0) {
                // First, delete existing items for this section
                const { error: deleteError } = await supabase
                    .from("about_dedication_items")
                    .delete()
                    .eq("section_id", sectionId);

                if (deleteError) {
                    console.error(
                        "Error deleting existing items:",
                        deleteError,
                    );
                    throw deleteError;
                }

                // Prepare items data for database
                const itemsToSave = items.map((item, index) => ({
                    section_id: sectionId,
                    title: item.title.trim(),
                    description: item.description.trim(),
                    image_id: item.image_id || null,
                    fallback_image_url: item.fallback_image_url?.trim() || null,
                    display_order: index + 1,
                    is_active: true,
                }));

                // Insert new items
                const { error: itemsError } = await supabase
                    .from("about_dedication_items")
                    .insert(itemsToSave);

                if (itemsError) {
                    console.error("Error inserting items:", itemsError);
                    throw itemsError;
                }
            }

            showNotification(
                "success",
                "Success!",
                "Dedication section and items saved successfully!",
            );

            // Reload data to get the latest from database
            await loadDedicationData();
            await loadDedicationItems();
        } catch (error) {
            console.error("Error saving dedication data:", error);

            let errorMessage = "Unknown error";
            if (error && typeof error === "object" && "message" in error) {
                errorMessage = (error as Error).message;

                // Check for common database issues
                if (
                    errorMessage.includes(
                        'relation "about_dedication_sections" does not exist',
                    )
                ) {
                    errorMessage =
                        "Database table not found. Please run the dedication schema script first.";
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
                `Failed to save dedication section: ${errorMessage}`,
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
                        .from("about-dedication")
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
                    const imageData: AboutDedicationImageInput = {
                        file_name: file.name,
                        file_path: filePath,
                        file_size: file.size,
                        mime_type: file.type,
                        alt_text: `Dedication image - ${file.name}`,
                        display_order: images.length,
                        is_active: true,
                    };

                    const { data: newImage, error: dbError } = await supabase
                        .from("about_dedication_images")
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
                        .from("about-dedication")
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
                .from("about-dedication")
                .remove([imageToDelete.file_path]);

            if (storageError) {
                console.error("Storage deletion error:", storageError);
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from("about_dedication_images")
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

            // Clear image from items if it was being used
            setItems(prev =>
                prev.map(item =>
                    item.image_id === imageId
                        ? { ...item, image_id: undefined, image_url: undefined }
                        : item,
                ),
            );

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

    // Add new dedication item
    const addDedicationItem = () => {
        const newItem: AboutDedicationItem = {
            id: `temp-${Date.now()}`, // Temporary ID
            title: "",
            description: "",
            image_id: undefined,
            image_url: undefined,
            image_alt: undefined,
            fallback_image_url: "",
            display_order: items.length + 1,
            is_active: true,
            section_id: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setItems(prev => [...prev, newItem]);
    };

    // Remove dedication item
    const removeDedicationItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    // Update dedication item
    const updateDedicationItem = (
        index: number,
        field: string,
        value: string | boolean | undefined,
    ) => {
        setItems(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        );
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
                        About Dedication Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the dedication section of the about page
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
                        onClick={saveDedicationData}
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
                                    Configure the main heading for the
                                    dedication section
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
                                        Section Description (Optional)
                                    </Label>
                                    <Textarea
                                        id="section_description"
                                        value={
                                            sectionData.section_description ||
                                            ""
                                        }
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                section_description:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter an optional section description"
                                        rows={3}
                                        className="resize-none"
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

                        {/* Dedication Items */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Dedication Items</CardTitle>
                                        <CardDescription>
                                            Manage the individual dedication
                                            cards
                                        </CardDescription>
                                    </div>
                                    <Button
                                        onClick={addDedicationItem}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Item
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {items.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            No dedication items yet
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Click "Add Item" to create your
                                            first dedication card
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="border rounded-lg p-4 space-y-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Item {index + 1}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            removeDedicationItem(
                                                                index,
                                                            )
                                                        }
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Title</Label>
                                                        <Input
                                                            value={item.title}
                                                            onChange={e =>
                                                                updateDedicationItem(
                                                                    index,
                                                                    "title",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Enter item title"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Image</Label>
                                                        <select
                                                            value={
                                                                item.image_id ||
                                                                ""
                                                            }
                                                            onChange={e => {
                                                                const imageId =
                                                                    e.target
                                                                        .value ||
                                                                    undefined;
                                                                const selectedImage =
                                                                    images.find(
                                                                        img =>
                                                                            img.id ===
                                                                            imageId,
                                                                    );
                                                                updateDedicationItem(
                                                                    index,
                                                                    "image_id",
                                                                    imageId,
                                                                );
                                                                updateDedicationItem(
                                                                    index,
                                                                    "image_url",
                                                                    selectedImage?.file_url,
                                                                );
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39]"
                                                        >
                                                            <option value="">
                                                                Select an image
                                                            </option>
                                                            {images.map(
                                                                image => (
                                                                    <option
                                                                        key={
                                                                            image.id
                                                                        }
                                                                        value={
                                                                            image.id
                                                                        }
                                                                    >
                                                                        {
                                                                            image.file_name
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Description</Label>
                                                    <Textarea
                                                        value={item.description}
                                                        onChange={e =>
                                                            updateDedicationItem(
                                                                index,
                                                                "description",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter item description"
                                                        rows={3}
                                                        className="resize-none"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Fallback Image URL
                                                    </Label>
                                                    <Input
                                                        value={
                                                            item.fallback_image_url ||
                                                            ""
                                                        }
                                                        onChange={e =>
                                                            updateDedicationItem(
                                                                index,
                                                                "fallback_image_url",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="https://example.com/fallback-image.jpg"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Media Management Tab */}
                    <TabsContent value="media" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Image Upload</CardTitle>
                                <CardDescription>
                                    Upload and manage images for dedication
                                    items
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
                                    Manage your uploaded dedication images
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
                                    Preview how the dedication section will
                                    appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.section_heading ? (
                                    <div className="space-y-8">
                                        {/* Section Header Preview */}
                                        <div className="text-center">
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                                {sectionData.section_heading}
                                            </h2>
                                            {sectionData.section_description && (
                                                <p className="text-gray-600 max-w-2xl mx-auto">
                                                    {
                                                        sectionData.section_description
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Items Preview */}
                                        {items.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-white rounded-lg shadow-md overflow-hidden"
                                                    >
                                                        <div className="aspect-video relative">
                                                            <img
                                                                src={
                                                                    item.image_url ||
                                                                    item.fallback_image_url ||
                                                                    "https://via.placeholder.com/400x300"
                                                                }
                                                                alt={
                                                                    item.image_alt ||
                                                                    item.title
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="p-6">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                                {item.title ||
                                                                    "Item Title"}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                                {item.description ||
                                                                    "Item description will appear here..."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">
                                                    No dedication items to
                                                    preview
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Add some dedication items to
                                                    see the preview
                                                </p>
                                            </div>
                                        )}
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

export default AboutDedicationEditor;
