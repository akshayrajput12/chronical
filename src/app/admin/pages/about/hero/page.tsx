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
    Palette,
    Monitor,
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
    AboutHeroSection,
    AboutHeroSectionInput,
    AboutHeroImage,
    AboutHeroImageInput,
    AboutHeroNotification,
} from "@/types/about";

const AboutHeroEditor = () => {
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

    // State for about hero data
    const [sectionData, setSectionData] = useState<AboutHeroSectionInput>({
        hero_heading: "",
        hero_subheading: "",
        background_image_id: undefined,
        fallback_image_url: "",
        overlay_opacity: 0.3,
        overlay_color: "black",
        text_color: "white",
        height_class: "h-[80vh]",
        show_scroll_indicator: true,
        is_active: true,
    });

    const [images, setImages] = useState<AboutHeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Notification state
    const [notification, setNotification] = useState<AboutHeroNotification>({
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
        loadAboutHeroData();
        loadAboutHeroImages();
    }, []);

    const loadAboutHeroData = async () => {
        try {
            setLoading(true);

            // Use the database function to get about hero data
            const { data, error } = await supabase.rpc(
                "get_about_hero_section",
            );

            if (error) {
                console.error("Error fetching about hero data:", error);
                return;
            }

            if (data && data.length > 0) {
                const heroSection = data[0];

                setSectionData({
                    hero_heading: heroSection.hero_heading,
                    hero_subheading: heroSection.hero_subheading,
                    background_image_id: heroSection.background_image_id,
                    fallback_image_url: heroSection.fallback_image_url || "",
                    overlay_opacity: heroSection.overlay_opacity || 0.3,
                    overlay_color: heroSection.overlay_color || "black",
                    text_color: heroSection.text_color || "white",
                    height_class: heroSection.height_class || "h-[80vh]",
                    show_scroll_indicator:
                        heroSection.show_scroll_indicator !== false,
                    is_active: heroSection.is_active,
                });
            } else {
                // Fallback to default data if no data found
                setSectionData({
                    hero_heading: "About Us",
                    hero_subheading:
                        "Discover the story behind our passion for creating unforgettable exhibition experiences.",
                    background_image_id: undefined,
                    fallback_image_url:
                        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    overlay_opacity: 0.3,
                    overlay_color: "black",
                    text_color: "white",
                    height_class: "h-[80vh]",
                    show_scroll_indicator: true,
                    is_active: true,
                });
            }
        } catch (error) {
            console.error("Error loading about hero data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to load about hero data",
            );
        } finally {
            setLoading(false);
        }
    };

    const loadAboutHeroImages = async () => {
        try {
            // Use the database function to get images
            const { data, error } = await supabase.rpc("get_about_hero_images");

            if (error) {
                console.error("Error fetching about hero images:", error);
                return;
            }

            if (data) {
                // Construct proper image URLs for each image
                const imagesWithUrls = data.map((image: AboutHeroImage) => {
                    const { data: urlData } = supabase.storage
                        .from("about-hero")
                        .getPublicUrl(image.file_path);

                    return {
                        ...image,
                        file_url: urlData.publicUrl,
                    };
                });

                setImages(imagesWithUrls);
            }
        } catch (error) {
            console.error("Error loading about hero images:", error);
        }
    };

    const saveAboutHeroData = async () => {
        setSaving(true);
        try {
            // Validate required fields
            if (!sectionData.hero_heading.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Hero heading is required",
                );
                return;
            }

            if (!sectionData.hero_subheading.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Hero subheading is required",
                );
                return;
            }

            // Prepare data for database
            const dataToSave = {
                hero_heading: sectionData.hero_heading.trim(),
                hero_subheading: sectionData.hero_subheading.trim(),
                background_image_id: sectionData.background_image_id || null,
                fallback_image_url:
                    sectionData.fallback_image_url?.trim() || null,
                overlay_opacity: sectionData.overlay_opacity || 0.3,
                overlay_color: sectionData.overlay_color || "black",
                text_color: sectionData.text_color || "white",
                height_class: sectionData.height_class || "h-[80vh]",
                show_scroll_indicator:
                    sectionData.show_scroll_indicator !== false,
                is_active: sectionData.is_active,
            };

            // Check if record exists (get the most recent one)
            const { data: existingData, error: fetchError } = await supabase
                .from("about_hero_sections")
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
                    .from("about_hero_sections")
                    .update(dataToSave)
                    .eq("id", existingData[0].id);

                if (error) {
                    console.error("Error updating data:", error);
                    throw error;
                }
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("about_hero_sections")
                    .insert([dataToSave]);

                if (error) {
                    console.error("Error inserting data:", error);
                    throw error;
                }
            }

            showNotification(
                "success",
                "Success!",
                "About hero section saved successfully!",
            );
        } catch (error) {
            console.error("Error saving about hero data:", error);

            let errorMessage = "Unknown error";
            if (error && typeof error === "object" && "message" in error) {
                errorMessage = (error as Error).message;

                // Check for common database issues
                if (
                    errorMessage.includes(
                        'relation "about_hero_sections" does not exist',
                    )
                ) {
                    errorMessage =
                        "Database table not found. Please run the about hero schema script first.";
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
                `Failed to save about hero section: ${errorMessage}`,
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
                        .from("about-hero")
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
                    const imageData: AboutHeroImageInput = {
                        file_name: file.name,
                        file_path: filePath,
                        file_size: file.size,
                        mime_type: file.type,
                        alt_text: `About hero image - ${file.name}`,
                        display_order: images.length,
                        is_active: true,
                    };

                    const { data: newImage, error: dbError } = await supabase
                        .from("about_hero_images")
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
                        .from("about-hero")
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
                .from("about-hero")
                .remove([imageToDelete.file_path]);

            if (storageError) {
                console.error("Storage deletion error:", storageError);
            }

            // Delete from database
            const { error: dbError } = await supabase
                .from("about_hero_images")
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

            // Clear background image if it was deleted
            if (sectionData.background_image_id === imageId) {
                setSectionData(prev => ({
                    ...prev,
                    background_image_id: undefined,
                }));
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
                        About Hero Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the hero section of the about page
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
                        onClick={saveAboutHeroData}
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
                        {/* Hero Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Content</CardTitle>
                                <CardDescription>
                                    Configure the main heading and subheading
                                    for the about hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="hero_heading">
                                        Hero Heading
                                    </Label>
                                    <Input
                                        id="hero_heading"
                                        value={sectionData.hero_heading}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                hero_heading: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the hero heading"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hero_subheading">
                                        Hero Subheading
                                    </Label>
                                    <Textarea
                                        id="hero_subheading"
                                        value={sectionData.hero_subheading}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                hero_subheading: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the hero subheading"
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

                        {/* Background Image Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Background Image</CardTitle>
                                <CardDescription>
                                    Select the background image for the hero
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
                                                    sectionData.background_image_id ===
                                                    image.id
                                                        ? "border-[#a5cd39] ring-2 ring-[#a5cd39]/20"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        background_image_id:
                                                            image.id,
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
                                                    {sectionData.background_image_id ===
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

                                <div className="space-y-2">
                                    <Label htmlFor="fallback_image_url">
                                        Fallback Image URL
                                    </Label>
                                    <Input
                                        id="fallback_image_url"
                                        value={
                                            sectionData.fallback_image_url || ""
                                        }
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                fallback_image_url:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="https://example.com/fallback-image.jpg"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Used when no background image is
                                        selected
                                    </p>
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
                                    Upload and manage background images for the
                                    about hero section
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
                                    Manage your uploaded background images
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
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded-full ${
                                                                sectionData.background_image_id ===
                                                                image.id
                                                                    ? "bg-[#a5cd39]/20 text-[#a5cd39]"
                                                                    : "bg-gray-100 text-gray-600"
                                                            }`}
                                                        >
                                                            {sectionData.background_image_id ===
                                                            image.id
                                                                ? "Selected"
                                                                : "Available"}
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
                                    Preview how the about hero section will
                                    appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.hero_heading ? (
                                    <div
                                        className={`relative ${sectionData.height_class} flex items-center justify-center overflow-hidden rounded-lg`}
                                        style={{
                                            backgroundImage:
                                                sectionData.background_image_id
                                                    ? `url(${
                                                          images.find(
                                                              img =>
                                                                  img.id ===
                                                                  sectionData.background_image_id,
                                                          )?.file_url
                                                      })`
                                                    : `url(${sectionData.fallback_image_url})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                        }}
                                    >
                                        {/* Overlay */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                backgroundColor:
                                                    sectionData.overlay_color,
                                                opacity:
                                                    sectionData.overlay_opacity,
                                            }}
                                        />

                                        {/* Content */}
                                        <div
                                            className="relative z-10 text-center w-full px-4 sm:px-6 md:px-8 lg:px-12"
                                            style={{
                                                color: sectionData.text_color,
                                            }}
                                        >
                                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-rubik font-bold mb-4 sm:mb-6 leading-tight">
                                                {sectionData.hero_heading}
                                            </h1>
                                            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-markazi-text max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light tracking-wide opacity-90">
                                                {sectionData.hero_subheading}
                                            </h3>
                                        </div>

                                        {/* Scroll Indicator */}
                                        {sectionData.show_scroll_indicator && (
                                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                                                <div
                                                    className="w-8 h-8 animate-bounce"
                                                    style={{
                                                        color: sectionData.text_color,
                                                    }}
                                                >
                                                    <svg
                                                        className="w-full h-full"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Enter hero content to see the
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

export default AboutHeroEditor;
