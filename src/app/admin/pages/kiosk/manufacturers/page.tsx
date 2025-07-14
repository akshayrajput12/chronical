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
    Link as LinkIcon,
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
    KioskManufacturersSection,
    KioskManufacturersSectionInput,
    KioskManufacturersImage,
    KioskManufacturersImageInput,
    KioskManufacturersNotification,
} from "@/types/kiosk";
import { revalidatePathAction } from "@/services/revalidate.action";

const KioskManufacturersEditor = () => {
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

    // State for kiosk manufacturers data
    const [sectionData, setSectionData] =
        useState<KioskManufacturersSectionInput>({
            section_heading: "",
            content_paragraph_1: "",
            content_paragraph_2: "",
            link_text: "",
            link_url: "",
            main_image_id: undefined,
            is_active: true,
        });

    const [images, setImages] = useState<KioskManufacturersImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Notification state
    const [notification, setNotification] =
        useState<KioskManufacturersNotification>({
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

    const loadKioskManufacturersData = useCallback(async () => {
        try {
            setLoading(true);

            // Use the database function to get manufacturers data
            const { data, error } = await supabase.rpc(
                "get_kiosk_manufacturers_section",
            );

            if (error) {
                console.error(
                    "Error fetching kiosk manufacturers data:",
                    error,
                );
                return;
            }

            if (data && data.length > 0) {
                const manufacturersSection = data[0];

                setSectionData({
                    section_heading: manufacturersSection.section_heading,
                    content_paragraph_1:
                        manufacturersSection.content_paragraph_1,
                    content_paragraph_2:
                        manufacturersSection.content_paragraph_2,
                    link_text: manufacturersSection.link_text || "",
                    link_url: manufacturersSection.link_url || "",
                    main_image_id:
                        manufacturersSection.main_image_id || undefined,
                    is_active: manufacturersSection.is_active,
                });
            } else {
                // Fallback to default data if no data found
                setSectionData({
                    section_heading:
                        "LOOKING FOR CUSTOM KIOSK MANUFACTURERS IN DUBAI?",
                    content_paragraph_1:
                        "We are one of the topmost companies involved in custom kiosk manufacturing in Dubai & UAE, offering a broad range of kiosks including mall kiosks, jewelry showcases, and museums, cosmetics, Watch, perfume, electronic displays & much more. Have kiosks in different sizes & styles for you to choose from. Chronicle has showcased our top technology products. Consider all the factors such as floor position, the height of kiosk, safety, security & durability while designing the kiosk.",
                    content_paragraph_2:
                        "Chronicle as Exhibition Stand Builders in UAE has years of experience & expertise as a custom kiosk manufacturers in Dubai. A proficient team of kiosk designers & engineers who have the caliber to build creative & innovative kiosks for your specific requirements. Also, deal in the manufacture of retail window exhibits, kiosk stands, exhibition stands & graphic displays. Reach out if you need performance-oriented & advanced custom kiosk solutions for trade shows & any of your business requirements.",
                    link_text: "Exhibition Stand Builders in UAE",
                    link_url: "/about-us",
                    main_image_id: undefined,
                    is_active: true,
                });
            }
        } catch (error) {
            console.error("Error loading kiosk manufacturers data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to load kiosk manufacturers data",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const loadKioskManufacturersImages = useCallback(async () => {
        try {
            // Use the database function to get images
            const { data, error } = await supabase.rpc(
                "get_kiosk_manufacturers_images",
            );

            if (error) {
                console.error(
                    "Error fetching kiosk manufacturers images:",
                    error,
                );
                return;
            }

            if (data) {
                // Construct proper image URLs for each image
                const imagesWithUrls = data.map(
                    (image: KioskManufacturersImage) => {
                        const { data: urlData } = supabase.storage
                            .from("kiosk-manufacturers")
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
            console.error("Error loading kiosk manufacturers images:", error);
        }
    }, []);

    // Load existing data
    useEffect(() => {
        loadKioskManufacturersData();
        loadKioskManufacturersImages();
    }, [loadKioskManufacturersData, loadKioskManufacturersImages]);

    const saveKioskManufacturersData = async () => {
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

            if (!sectionData.content_paragraph_1.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "First content paragraph is required",
                );
                return;
            }

            if (!sectionData.content_paragraph_2.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Second content paragraph is required",
                );
                return;
            }

            // Prepare data for database
            const dataToSave = {
                section_heading: sectionData.section_heading.trim(),
                content_paragraph_1: sectionData.content_paragraph_1.trim(),
                content_paragraph_2: sectionData.content_paragraph_2.trim(),
                link_text: sectionData.link_text?.trim() || null,
                link_url: sectionData.link_url?.trim() || null,
                main_image_id: sectionData.main_image_id || null,
                is_active: sectionData.is_active,
            };

            // Check if record exists (get the most recent one)
            const { data: existingData, error: fetchError } = await supabase
                .from("kiosk_manufacturers_sections")
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
                    .from("kiosk_manufacturers_sections")
                    .update(dataToSave)
                    .eq("id", existingData[0].id);

                if (error) {
                    console.error("Error updating data:", error);
                    throw error;
                }
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("kiosk_manufacturers_sections")
                    .insert([dataToSave]);

                if (error) {
                    console.error("Error inserting data:", error);
                    throw error;
                }
            }

            showNotification(
                "success",
                "Success!",
                "Kiosk manufacturers section saved successfully!",
            );
        } catch (error) {
            console.error("Error saving kiosk manufacturers data:", error);

            let errorMessage = "Unknown error";
            if (error && typeof error === "object" && "message" in error) {
                errorMessage = (error as Error).message;

                // Check for common database issues
                if (
                    errorMessage.includes(
                        'relation "kiosk_manufacturers_sections" does not exist',
                    )
                ) {
                    errorMessage =
                        "Database table not found. Please run the kiosk manufacturers schema script first.";
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
                `Failed to save kiosk manufacturers section: ${errorMessage}`,
            );
        } finally {
            revalidatePathAction("/kiosk-manufacturers-in-dubai-uae");
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
                        .from("kiosk-manufacturers")
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
                    const imageData: KioskManufacturersImageInput = {
                        file_name: file.name,
                        file_path: filePath,
                        file_size: file.size,
                        mime_type: file.type,
                        alt_text: `Kiosk manufacturers image - ${file.name}`,
                        display_order: images.length,
                        is_active: true,
                    };

                    const { data: newImage, error: dbError } = await supabase
                        .from("kiosk_manufacturers_images")
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
                        .from("kiosk-manufacturers")
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
                .from("kiosk-manufacturers")
                .remove([imageToDelete.file_path]);

            if (storageError) {
                console.error("Storage deletion error:", storageError);
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from("kiosk_manufacturers_images")
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

            // Clear main image if it was deleted
            if (sectionData.main_image_id === imageId) {
                setSectionData(prev => ({ ...prev, main_image_id: undefined }));
            }

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
                        Kiosk Manufacturers Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the manufacturers section of the kiosk page
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open("/kiosk", "_blank")}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={saveKioskManufacturersData}
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
                                    manufacturers section
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

                        {/* Content Paragraphs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Paragraphs</CardTitle>
                                <CardDescription>
                                    Manage the main content paragraphs for the
                                    manufacturers section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="content_paragraph_1">
                                        First Paragraph
                                    </Label>
                                    <Textarea
                                        id="content_paragraph_1"
                                        value={sectionData.content_paragraph_1}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                content_paragraph_1:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the first content paragraph"
                                        rows={4}
                                        className="resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content_paragraph_2">
                                        Second Paragraph
                                    </Label>
                                    <Textarea
                                        id="content_paragraph_2"
                                        value={sectionData.content_paragraph_2}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                content_paragraph_2:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the second content paragraph"
                                        rows={4}
                                        className="resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Link Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Link Configuration</CardTitle>
                                <CardDescription>
                                    Configure the embedded link within the
                                    content
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="link_text">
                                            Link Text
                                        </Label>
                                        <Input
                                            id="link_text"
                                            value={sectionData.link_text || ""}
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    link_text: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter link text"
                                            className="flex items-center"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="link_url">
                                            Link URL
                                        </Label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                id="link_url"
                                                value={
                                                    sectionData.link_url || ""
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        link_url:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="/about-us"
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Main Image Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Main Image</CardTitle>
                                <CardDescription>
                                    Select the main image for the manufacturers
                                    section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {images.length === 0 ? (
                                    <div className="text-center py-8">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            No images available
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Upload images in the Media
                                            Management tab first
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {images.map(image => (
                                            <div
                                                key={image.id}
                                                className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                                    sectionData.main_image_id ===
                                                    image.id
                                                        ? "border-[#a5cd39] ring-2 ring-[#a5cd39]/20"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        main_image_id: image.id,
                                                    }))
                                                }
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
                                                    {sectionData.main_image_id ===
                                                        image.id && (
                                                        <div className="absolute inset-0 bg-[#a5cd39]/20 flex items-center justify-center">
                                                            <CheckCircle className="w-8 h-8 text-[#a5cd39]" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-2">
                                                    <p className="text-xs text-gray-600 truncate">
                                                        {image.file_name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {sectionData.main_image_id && (
                                    <div className="flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    main_image_id: undefined,
                                                }))
                                            }
                                        >
                                            Clear Selection
                                        </Button>
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
                                    Upload and manage images for the
                                    manufacturers section
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Upload Area */}
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                                        onDrop={e => {
                                            e.preventDefault();
                                            const files = e.dataTransfer.files;
                                            if (files) handleImageUpload(files);
                                        }}
                                        onDragOver={e => e.preventDefault()}
                                        onDragEnter={e => e.preventDefault()}
                                    >
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-lg font-medium text-gray-900 mb-2">
                                            Drop images here or click to upload
                                        </p>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Supports: JPG, PNG, WebP, GIF (Max
                                            50MB each)
                                        </p>
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
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "image-upload",
                                                    )
                                                    ?.click()
                                            }
                                            disabled={uploading}
                                        >
                                            {uploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Choose Images
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Images Grid */}
                                    {images.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">
                                                Uploaded Images
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {images.map(image => (
                                                    <div
                                                        key={image.id}
                                                        className="border rounded-lg overflow-hidden bg-white shadow-sm"
                                                    >
                                                        <div className="aspect-video relative">
                                                            <img
                                                                src={
                                                                    image.file_url
                                                                }
                                                                alt={
                                                                    image.alt_text ||
                                                                    image.file_name
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="p-3">
                                                            <p className="font-medium text-sm text-gray-900 truncate">
                                                                {
                                                                    image.file_name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {image.file_size
                                                                    ? `${(
                                                                          image.file_size /
                                                                          1024 /
                                                                          1024
                                                                      ).toFixed(
                                                                          2,
                                                                      )} MB`
                                                                    : "Unknown size"}
                                                            </p>
                                                            <div className="flex justify-between items-center mt-3">
                                                                <span
                                                                    className={`text-xs px-2 py-1 rounded ${
                                                                        sectionData.main_image_id ===
                                                                        image.id
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-gray-100 text-gray-800"
                                                                    }`}
                                                                >
                                                                    {sectionData.main_image_id ===
                                                                    image.id
                                                                        ? "Main Image"
                                                                        : "Available"}
                                                                </span>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleImageDelete(
                                                                            image.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preview Tab */}
                    <TabsContent value="preview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    Preview how the kiosk manufacturers section
                                    will appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.section_heading ? (
                                    <div className="space-y-8 p-6 bg-white rounded-lg border">
                                        {/* Section Header Preview */}
                                        <div className="text-center">
                                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333333]">
                                                {sectionData.section_heading}
                                            </h2>
                                            <div className="w-24 h-1 bg-[#a5cd39] mx-auto mb-6"></div>
                                        </div>

                                        {/* Content Preview */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            {/* Left Column - Text */}
                                            <div className="flex flex-col justify-center">
                                                <p className="text-gray-700 mb-6">
                                                    {
                                                        sectionData.content_paragraph_1
                                                    }
                                                </p>
                                                <p className="text-gray-700">
                                                    {sectionData.content_paragraph_2
                                                        .split(
                                                            sectionData.link_text ||
                                                                "",
                                                        )
                                                        .map(
                                                            (
                                                                part,
                                                                index,
                                                                array,
                                                            ) => (
                                                                <span
                                                                    key={index}
                                                                >
                                                                    {part}
                                                                    {index <
                                                                        array.length -
                                                                            1 &&
                                                                        sectionData.link_text && (
                                                                            <span className="text-[#a5cd39] hover:underline cursor-pointer">
                                                                                {
                                                                                    sectionData.link_text
                                                                                }
                                                                            </span>
                                                                        )}
                                                                </span>
                                                            ),
                                                        )}
                                                </p>
                                            </div>

                                            {/* Right Column - Image */}
                                            <div className="relative h-[400px] rounded-md overflow-hidden bg-gray-100">
                                                {sectionData.main_image_id ? (
                                                    (() => {
                                                        const mainImage =
                                                            images.find(
                                                                img =>
                                                                    img.id ===
                                                                    sectionData.main_image_id,
                                                            );
                                                        return mainImage ? (
                                                            <img
                                                                src={
                                                                    mainImage.file_url
                                                                }
                                                                alt={
                                                                    mainImage.alt_text ||
                                                                    "Custom Kiosk Manufacturers in Dubai"
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                                    <p className="text-gray-500">
                                                                        Selected
                                                                        image
                                                                        not
                                                                        found
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <div className="text-center">
                                                            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                            <p className="text-gray-500">
                                                                No main image
                                                                selected
                                                            </p>
                                                            <p className="text-sm text-gray-400">
                                                                Select an image
                                                                in Content
                                                                Settings
                                                            </p>
                                                        </div>
                                                    </div>
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
                                    View the actual kiosk page to see your
                                    changes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        window.open("/kiosk", "_blank")
                                    }
                                    className="w-full"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open Kiosk Page in New Tab
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
};

export default KioskManufacturersEditor;
