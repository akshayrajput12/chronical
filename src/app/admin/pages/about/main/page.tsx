"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
    Video,
    Palette,
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
    AboutMainSection,
    AboutMainSectionInput,
    AboutMainImage,
    AboutMainImageInput,
    AboutMainNotification,
} from "@/types/about";

const AboutMainEditor = () => {
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

    // State for main data
    const [sectionData, setSectionData] = useState<AboutMainSectionInput>({
        section_label: "",
        main_heading: "",
        description: "",
        cta_text: "",
        cta_url: "",
        video_url: "",
        video_title: "",
        logo_image_id: undefined,
        logo_fallback_url: "",
        esc_main_text: "",
        esc_sub_text: "",
        primary_color: "#a5cd39",
        secondary_color: "#f0c419",
        is_active: true,
    });

    const [images, setImages] = useState<AboutMainImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Notification state
    const [notification, setNotification] = useState<AboutMainNotification>({
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
        loadMainData();
        loadMainImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMainData = async () => {
        try {
            setLoading(true);

            // Use the database function to get main data
            const { data, error } = await supabase.rpc(
                "get_about_main_section",
            );

            if (error) {
                console.error("Error fetching main data:", error);
                return;
            }

            if (data && data.length > 0) {
                const mainSection = data[0];

                setSectionData({
                    section_label: mainSection.section_label,
                    main_heading: mainSection.main_heading,
                    description: mainSection.description,
                    cta_text: mainSection.cta_text,
                    cta_url: mainSection.cta_url,
                    video_url: mainSection.video_url || "",
                    video_title: mainSection.video_title || "",
                    logo_image_id: mainSection.logo_image_id,
                    logo_fallback_url: mainSection.logo_fallback_url || "",
                    esc_main_text: mainSection.esc_main_text,
                    esc_sub_text: mainSection.esc_sub_text,
                    primary_color: mainSection.primary_color,
                    secondary_color: mainSection.secondary_color,
                    is_active: mainSection.is_active,
                });
            }
        } catch (error) {
            console.error("Error loading main data:", error);
            showNotification("error", "Error", "Failed to load main data");
        } finally {
            setLoading(false);
        }
    };

    const loadMainImages = async () => {
        try {
            // Use the database function to get images
            const { data, error } = await supabase.rpc("get_about_main_images");

            if (error) {
                console.error("Error fetching main images:", error);
                return;
            }

            if (data) {
                // Construct proper image URLs for each image
                const imagesWithUrls = data.map((image: AboutMainImage) => {
                    const { data: urlData } = supabase.storage
                        .from("about-main")
                        .getPublicUrl(image.file_path);

                    return {
                        ...image,
                        file_url: urlData.publicUrl,
                    };
                });

                setImages(imagesWithUrls);
            }
        } catch (error) {
            console.error("Error loading main images:", error);
        }
    };

    const saveMainData = async () => {
        setSaving(true);
        try {
            // Validate required fields
            if (!sectionData.section_label.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Section label is required",
                );
                return;
            }

            if (!sectionData.main_heading.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Main heading is required",
                );
                return;
            }

            if (!sectionData.description.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Description is required",
                );
                return;
            }

            // Prepare data for database
            const dataToSave = {
                section_label: sectionData.section_label.trim(),
                main_heading: sectionData.main_heading.trim(),
                description: sectionData.description.trim(),
                cta_text: sectionData.cta_text.trim(),
                cta_url: sectionData.cta_url.trim(),
                video_url: sectionData.video_url?.trim() || null,
                video_title: sectionData.video_title?.trim() || null,
                logo_image_id: sectionData.logo_image_id || null,
                logo_fallback_url:
                    sectionData.logo_fallback_url?.trim() || null,
                esc_main_text: sectionData.esc_main_text.trim(),
                esc_sub_text: sectionData.esc_sub_text.trim(),
                primary_color: sectionData.primary_color,
                secondary_color: sectionData.secondary_color,
                is_active: sectionData.is_active,
            };

            // Check if record exists (get the most recent one)
            const { data: existingData, error: fetchError } = await supabase
                .from("about_main_sections")
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
                    .from("about_main_sections")
                    .update(dataToSave)
                    .eq("id", existingData[0].id);

                if (error) {
                    console.error("Error updating data:", error);
                    throw error;
                }
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("about_main_sections")
                    .insert([dataToSave]);

                if (error) {
                    console.error("Error inserting data:", error);
                    throw error;
                }
            }

            showNotification(
                "success",
                "Success!",
                "Main section saved successfully!",
            );
        } catch (error) {
            console.error("Error saving main data:", error);

            let errorMessage = "Unknown error";
            if (error && typeof error === "object" && "message" in error) {
                errorMessage = (error as Error).message;

                // Check for common database issues
                if (
                    errorMessage.includes(
                        'relation "about_main_sections" does not exist',
                    )
                ) {
                    errorMessage =
                        "Database table not found. Please run the main schema script first.";
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
                `Failed to save main section: ${errorMessage}`,
            );
        } finally {
            setSaving(false);
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
                        About Main Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the main content section of the about page
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open("/about-us", "_blank")}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={saveMainData}
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
                        {/* Basic Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Content</CardTitle>
                                <CardDescription>
                                    Configure the main content for the about
                                    section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="section_label">
                                            Section Label
                                        </Label>
                                        <Input
                                            id="section_label"
                                            value={sectionData.section_label}
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    section_label:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="ABOUT US"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cta_text">
                                            CTA Button Text
                                        </Label>
                                        <Input
                                            id="cta_text"
                                            value={sectionData.cta_text}
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    cta_text: e.target.value,
                                                }))
                                            }
                                            placeholder="Official website"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="main_heading">
                                        Main Heading
                                    </Label>
                                    <Input
                                        id="main_heading"
                                        value={sectionData.main_heading}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                main_heading: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the main heading"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={sectionData.description}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the main description"
                                        rows={6}
                                        className="resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cta_url">
                                        CTA Button URL
                                    </Label>
                                    <Input
                                        id="cta_url"
                                        value={sectionData.cta_url}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                cta_url: e.target.value,
                                            }))
                                        }
                                        placeholder="https://example.com"
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

                        {/* Video Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <Video className="w-5 h-5 inline mr-2" />
                                    Video Settings
                                </CardTitle>
                                <CardDescription>
                                    Configure the embedded video content
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="video_url">Video URL</Label>
                                    <Input
                                        id="video_url"
                                        value={sectionData.video_url || ""}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                video_url: e.target.value,
                                            }))
                                        }
                                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="video_title">
                                        Video Title
                                    </Label>
                                    <Input
                                        id="video_title"
                                        value={sectionData.video_title || ""}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                video_title: e.target.value,
                                            }))
                                        }
                                        placeholder="ESC India Video"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Branding Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <Palette className="w-5 h-5 inline mr-2" />
                                    Branding Settings
                                </CardTitle>
                                <CardDescription>
                                    Configure ESC branding text and colors
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="esc_main_text">
                                            ESC Main Text
                                        </Label>
                                        <Input
                                            id="esc_main_text"
                                            value={sectionData.esc_main_text}
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    esc_main_text:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="ESC"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="esc_sub_text">
                                            ESC Sub Text
                                        </Label>
                                        <Input
                                            id="esc_sub_text"
                                            value={sectionData.esc_sub_text}
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    esc_sub_text:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="INDIA"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="primary_color">
                                            Primary Color
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="primary_color"
                                                type="color"
                                                value={
                                                    sectionData.primary_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        primary_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-16 h-10 p-1 border rounded"
                                            />
                                            <Input
                                                value={
                                                    sectionData.primary_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        primary_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="#a5cd39"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="secondary_color">
                                            Secondary Color
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="secondary_color"
                                                type="color"
                                                value={
                                                    sectionData.secondary_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        secondary_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-16 h-10 p-1 border rounded"
                                            />
                                            <Input
                                                value={
                                                    sectionData.secondary_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        secondary_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="#f0c419"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="logo_fallback_url">
                                        Logo Fallback URL
                                    </Label>
                                    <Input
                                        id="logo_fallback_url"
                                        value={
                                            sectionData.logo_fallback_url || ""
                                        }
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                logo_fallback_url:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Media Management Tab */}
                    <TabsContent value="media" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <ImageIcon className="w-5 h-5 inline mr-2" />
                                    Logo Image Management
                                </CardTitle>
                                <CardDescription>
                                    Upload and manage logo images for the about
                                    main section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">
                                        Drag and drop logo images here, or click
                                        to browse
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Supports JPG, PNG, WebP, GIF (max 50MB
                                        each)
                                    </p>
                                    <Button
                                        variant="outline"
                                        disabled={uploading}
                                        className="relative"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Choose Files
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Current Images */}
                                {images.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">
                                            Uploaded Images ({images.length})
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {images.map(image => (
                                                <div
                                                    key={image.id}
                                                    className={`relative group border-2 rounded-lg p-2 cursor-pointer transition-colors ${
                                                        sectionData.logo_image_id ===
                                                        image.id
                                                            ? "border-[#a5cd39] bg-green-50"
                                                            : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                    onClick={() =>
                                                        setSectionData(
                                                            prev => ({
                                                                ...prev,
                                                                logo_image_id:
                                                                    image.id,
                                                            }),
                                                        )
                                                    }
                                                >
                                                    <div className="aspect-square relative">
                                                        {image.file_url && (
                                                            <Image
                                                                src={
                                                                    image.file_url
                                                                }
                                                                alt={
                                                                    image.alt_text ||
                                                                    "Logo image"
                                                                }
                                                                fill
                                                                className="object-cover rounded"
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-2 truncate">
                                                        {image.file_name}
                                                    </p>
                                                    {sectionData.logo_image_id ===
                                                        image.id && (
                                                        <div className="absolute top-1 right-1 bg-[#a5cd39] text-white rounded-full p-1">
                                                            <CheckCircle className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                    <button
                                                        className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            // Add delete functionality here
                                                        }}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {images.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p>No images uploaded yet</p>
                                        <p className="text-sm">
                                            Upload your first logo image to get
                                            started
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preview Tab */}
                    <TabsContent value="preview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <Eye className="w-5 h-5 inline mr-2" />
                                    Live Preview
                                </CardTitle>
                                <CardDescription>
                                    Preview how your changes will appear on the
                                    website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg p-6 bg-gray-50">
                                    <div className="bg-white rounded-lg p-8 shadow-sm">
                                        {/* Preview Content */}
                                        <div className="flex flex-wrap md:flex-nowrap gap-8 items-center">
                                            {/* Left side - Video preview */}
                                            <div className="relative w-full md:w-1/2">
                                                <div
                                                    className="absolute -left-8 -top-8 w-32 h-24 z-0 rounded"
                                                    style={{
                                                        backgroundColor:
                                                            sectionData.primary_color,
                                                    }}
                                                ></div>
                                                <div className="relative z-10 bg-black rounded aspect-video">
                                                    {sectionData.video_url ? (
                                                        <iframe
                                                            src={
                                                                sectionData.video_url
                                                            }
                                                            title={
                                                                sectionData.video_title ||
                                                                "Video"
                                                            }
                                                            className="w-full h-full rounded"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white">
                                                            <Video className="w-12 h-12" />
                                                        </div>
                                                    )}

                                                    {/* ESC Text Preview */}
                                                    <div className="absolute left-0 bottom-0 z-20">
                                                        <div className="flex flex-col">
                                                            <div className="bg-transparent px-4 py-1">
                                                                <h3 className="text-white text-2xl font-bold leading-tight">
                                                                    {
                                                                        sectionData.esc_main_text
                                                                    }
                                                                </h3>
                                                            </div>
                                                            <div className="bg-transparent px-4 py-1">
                                                                <h4
                                                                    className="text-xl font-bold leading-tight"
                                                                    style={{
                                                                        color: sectionData.secondary_color,
                                                                    }}
                                                                >
                                                                    {
                                                                        sectionData.esc_sub_text
                                                                    }
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="absolute -right-8 top-16 w-32 h-20 z-0 rounded"
                                                    style={{
                                                        backgroundColor:
                                                            sectionData.secondary_color,
                                                    }}
                                                ></div>
                                            </div>

                                            {/* Right side - Text content preview */}
                                            <div className="w-full md:w-1/2 space-y-4">
                                                <div
                                                    className="text-sm font-medium  tracking-wider"
                                                    style={{
                                                        color: sectionData.primary_color,
                                                    }}
                                                >
                                                    {sectionData.section_label}
                                                </div>
                                                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                                    {sectionData.main_heading}
                                                </h2>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {sectionData.description
                                                        .length > 200
                                                        ? `${sectionData.description.substring(
                                                              0,
                                                              200,
                                                          )}...`
                                                        : sectionData.description}
                                                </p>
                                                <a
                                                    href={sectionData.cta_url}
                                                    className="inline-block text-white px-6 py-2 rounded text-sm font-medium"
                                                    style={{
                                                        backgroundColor:
                                                            sectionData.primary_color,
                                                    }}
                                                >
                                                    {sectionData.cta_text}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        This is a simplified preview. Visit the
                                        live page for the full experience.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            window.open("/about-us", "_blank")
                                        }
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View Live Page
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
};

export default AboutMainEditor;
