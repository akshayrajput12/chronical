"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Eye,
    Upload,
    Image as ImageIcon,
    Trash2,
    Info,
    Calendar,
    ExternalLink,
    CheckCircle,
    XCircle,
    AlertCircle,
    X,
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
    KioskContentSection,
    KioskContentSectionInput,
    KioskContentImage,
    KioskContentNotification,
} from "@/types/kiosk";

const KioskContentEditor = () => {
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

    // State for kiosk content data
    const [sectionData, setSectionData] = useState<KioskContentSectionInput>({
        first_section_heading: "",
        first_section_content: "",
        first_section_highlight_text: "",
        second_section_heading: "",
        second_section_paragraph_1: "",
        second_section_paragraph_2: "",
        main_image_url: "",
        main_image_alt: "",
        is_active: true,
    });

    const [images, setImages] = useState<KioskContentImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Notification state
    const [notification, setNotification] = useState<KioskContentNotification>({
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

    const loadKioskContentData = useCallback(async () => {
        try {
            // Use the database function to get content data with image
            const { data, error } = await supabase.rpc(
                "get_kiosk_content_section_with_image",
            );

            if (error) {
                console.error("Error fetching kiosk content data:", error);
                return;
            }

            if (data && data.length > 0) {
                const contentSection = data[0];

                // If there's an active image, get its public URL
                let finalImageUrl = contentSection.main_image_url;
                if (contentSection.image_file_path) {
                    const { data: imageData } = supabase.storage
                        .from("kiosk-content-images")
                        .getPublicUrl(contentSection.image_file_path);
                    finalImageUrl = imageData.publicUrl;
                }

                setSectionData({
                    first_section_heading: contentSection.first_section_heading,
                    first_section_content: contentSection.first_section_content,
                    first_section_highlight_text:
                        contentSection.first_section_highlight_text || "",
                    second_section_heading:
                        contentSection.second_section_heading,
                    second_section_paragraph_1:
                        contentSection.second_section_paragraph_1,
                    second_section_paragraph_2:
                        contentSection.second_section_paragraph_2,
                    main_image_id: contentSection.main_image_id,
                    main_image_url: finalImageUrl || "",
                    main_image_alt: contentSection.main_image_alt || "",
                    is_active: contentSection.is_active,
                });
            }
        } catch (error) {
            console.error("Error loading kiosk content data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to load kiosk content data",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const loadImages = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("kiosk_content_images")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            setImages(data || []);
        } catch (error) {
            console.error("Error loading images:", error);
            showNotification("error", "Error", "Failed to load images");
        }
    }, []);

    // Load existing data
    useEffect(() => {
        loadKioskContentData();
        loadImages();
    }, [loadKioskContentData, loadImages]);

    const saveKioskContentData = async () => {
        setSaving(true);
        try {
            // Check if record exists (get the most recent one)
            const { data: existingData } = await supabase
                .from("kiosk_content_sections")
                .select("id")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (existingData && existingData.length > 0) {
                // Update existing record
                const { error } = await supabase
                    .from("kiosk_content_sections")
                    .update(sectionData)
                    .eq("id", existingData[0].id);

                if (error) throw error;
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("kiosk_content_sections")
                    .insert([sectionData]);

                if (error) throw error;
            }

            showNotification(
                "success",
                "Success!",
                "Kiosk content section saved successfully!",
            );
        } catch (error) {
            console.error("Error saving kiosk content data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to save kiosk content section",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
            showNotification(
                "error",
                "Invalid File Type",
                "Please upload a valid image file (JPEG, PNG, WebP, or GIF)",
            );
            return;
        }

        // Validate file size (50MB limit)
        if (file.size > 52428800) {
            showNotification(
                "error",
                "File Too Large",
                "Please upload an image smaller than 50MB",
            );
            return;
        }

        setUploading(true);
        try {
            // Generate unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2)}.${fileExt}`;
            const filePath = `kiosk-content/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("kiosk-content-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Save image metadata to database
            const { data: imageData, error: dbError } = await supabase
                .from("kiosk_content_images")
                .insert([
                    {
                        filename: fileName,
                        original_filename: file.name,
                        file_path: filePath,
                        file_size: file.size,
                        mime_type: file.type,
                        alt_text: "Kiosk content image",
                        is_active: true,
                    },
                ])
                .select()
                .single();

            if (dbError) throw dbError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("kiosk-content-images")
                .getPublicUrl(filePath);

            // Update section data with new image
            setSectionData(prev => ({
                ...prev,
                main_image_url: urlData.publicUrl,
                main_image_id: imageData.id,
                main_image_alt: imageData.alt_text,
            }));

            // Reload images list
            loadImages();

            showNotification(
                "success",
                "Success!",
                "Image uploaded successfully!",
            );
        } catch (error) {
            console.error("Error uploading image:", error);
            showNotification(
                "error",
                "Upload Failed",
                "Failed to upload image. Please try again.",
            );
        } finally {
            setUploading(false);
        }
    };

    const deleteImage = async (imageId: string) => {
        try {
            // Get image data first
            const { data: imageData, error: fetchError } = await supabase
                .from("kiosk_content_images")
                .select("file_path")
                .eq("id", imageId)
                .single();

            if (fetchError) throw fetchError;

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from("kiosk-content-images")
                .remove([imageData.file_path]);

            if (storageError) throw storageError;

            // Delete from database
            const { error: dbError } = await supabase
                .from("kiosk_content_images")
                .delete()
                .eq("id", imageId);

            if (dbError) throw dbError;

            // If this was the active image, clear it from section data
            if (sectionData.main_image_id === imageId) {
                setSectionData(prev => ({
                    ...prev,
                    main_image_url: "",
                    main_image_id: undefined,
                    main_image_alt: "",
                }));
            }

            // Reload images list
            loadImages();

            showNotification(
                "success",
                "Success!",
                "Image deleted successfully!",
            );
        } catch (error) {
            console.error("Error deleting image:", error);
            showNotification(
                "error",
                "Delete Failed",
                "Failed to delete image. Please try again.",
            );
        }
    };

    const selectImage = (image: KioskContentImage) => {
        const { data: urlData } = supabase.storage
            .from("kiosk-content-images")
            .getPublicUrl(image.file_path);

        setSectionData(prev => ({
            ...prev,
            main_image_url: urlData.publicUrl,
            main_image_id: image.id,
            main_image_alt: image.alt_text,
        }));

        showNotification(
            "success",
            "Image Selected",
            "Content image updated successfully!",
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
                        Kiosk Content Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the content sections of the kiosk page
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
                        onClick={saveKioskContentData}
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
                        <TabsTrigger value="images">
                            Media Management
                        </TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    {/* Content Settings Tab */}
                    <TabsContent value="content" className="space-y-6">
                        {/* First Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    First Section - Custom Kiosk
                                </CardTitle>
                                <CardDescription>
                                    Configure the first section content
                                    including heading and description
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_heading">
                                        Section Heading
                                    </Label>
                                    <Input
                                        id="first_heading"
                                        value={
                                            sectionData.first_section_heading
                                        }
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                first_section_heading:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the first section heading"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="first_content">
                                        Section Content
                                    </Label>
                                    <Textarea
                                        id="first_content"
                                        value={
                                            sectionData.first_section_content
                                        }
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                first_section_content:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the first section content"
                                        rows={6}
                                        className="resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="first_highlight">
                                        Highlight Text (Optional)
                                    </Label>
                                    <Input
                                        id="first_highlight"
                                        value={
                                            sectionData.first_section_highlight_text ||
                                            ""
                                        }
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                first_section_highlight_text:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Text to highlight in green (e.g., 'custom Kiosk manufacturers in Dubai')"
                                    />
                                    <p className="text-sm text-gray-500">
                                        This text will be highlighted in green
                                        within the content
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Second Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Second Section - What Are Custom Kiosks?
                                </CardTitle>
                                <CardDescription>
                                    Configure the second section content
                                    including heading and paragraphs
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="second_heading">
                                        Section Heading
                                    </Label>
                                    <Input
                                        id="second_heading"
                                        value={
                                            sectionData.second_section_heading
                                        }
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                second_section_heading:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the second section heading"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="second_paragraph_1">
                                        First Paragraph
                                    </Label>
                                    <Textarea
                                        id="second_paragraph_1"
                                        value={
                                            sectionData.second_section_paragraph_1
                                        }
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                second_section_paragraph_1:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the first paragraph content"
                                        rows={5}
                                        className="resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="second_paragraph_2">
                                        Second Paragraph
                                    </Label>
                                    <Textarea
                                        id="second_paragraph_2"
                                        value={
                                            sectionData.second_section_paragraph_2
                                        }
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                second_section_paragraph_2:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the second paragraph content"
                                        rows={5}
                                        className="resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Image Configuration</CardTitle>
                                <CardDescription>
                                    Configure the main image for the content
                                    section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image_url">
                                        Image URL (Optional)
                                    </Label>
                                    <Input
                                        id="image_url"
                                        value={sectionData.main_image_url || ""}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                main_image_url: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter a direct URL for the image"
                                    />
                                    <p className="text-sm text-gray-500">
                                        You can either upload an image in the
                                        Media Management tab or enter a direct
                                        URL here
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image_alt">
                                        Image Alt Text
                                    </Label>
                                    <Input
                                        id="image_alt"
                                        value={sectionData.main_image_alt || ""}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                main_image_alt: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter alt text for accessibility"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Alt text helps screen readers and
                                        improves SEO
                                    </p>
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
                    </TabsContent>

                    {/* Media Management Tab */}
                    <TabsContent value="images" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload New Image</CardTitle>
                                <CardDescription>
                                    Upload a new image for the kiosk content
                                    section
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer"
                                        >
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">
                                                {uploading
                                                    ? "Uploading..."
                                                    : "Click to upload or drag and drop"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG, WebP or GIF (max 50MB)
                                            </p>
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Uploaded Images</CardTitle>
                                <CardDescription>
                                    Select an image to use in the kiosk content
                                    section
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
                                            Upload your first image using the
                                            form above
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {images.map(image => {
                                            const { data: urlData } =
                                                supabase.storage
                                                    .from(
                                                        "kiosk-content-images",
                                                    )
                                                    .getPublicUrl(
                                                        image.file_path,
                                                    );

                                            const isSelected =
                                                sectionData.main_image_id ===
                                                image.id;

                                            return (
                                                <div
                                                    key={image.id}
                                                    className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                                        isSelected
                                                            ? "border-[#a5cd39] ring-2 ring-[#a5cd39]/20"
                                                            : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                    onClick={() =>
                                                        selectImage(image)
                                                    }
                                                >
                                                    <div className="aspect-video bg-gray-100">
                                                        <img
                                                            src={
                                                                urlData.publicUrl
                                                            }
                                                            alt={image.alt_text}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-sm font-medium truncate">
                                                            {
                                                                image.original_filename
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {(
                                                                image.file_size /
                                                                1024 /
                                                                1024
                                                            ).toFixed(2)}{" "}
                                                            MB
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2">
                                                            <div className="bg-[#a5cd39] text-white rounded-full p-1">
                                                                <CheckCircle className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                deleteImage(
                                                                    image.id,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                                    Preview how the kiosk content section will
                                    appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.first_section_heading &&
                                sectionData.second_section_heading ? (
                                    <div className="space-y-16 p-6 bg-white rounded-lg border">
                                        {/* First Section Preview */}
                                        <div className="text-center">
                                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333333]">
                                                {
                                                    sectionData.first_section_heading
                                                }
                                            </h2>
                                            <div className="max-w-4xl mx-auto">
                                                <p className="text-gray-700">
                                                    {sectionData.first_section_content
                                                        .split(
                                                            sectionData.first_section_highlight_text ||
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
                                                                        sectionData.first_section_highlight_text && (
                                                                            <span className="font-semibold text-[#a5cd39]">
                                                                                {
                                                                                    sectionData.first_section_highlight_text
                                                                                }
                                                                            </span>
                                                                        )}
                                                                </span>
                                                            ),
                                                        )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Second Section Preview */}
                                        <div>
                                            <h2 className="text-3xl font-bold mb-8 text-[#333333]">
                                                {
                                                    sectionData.second_section_heading
                                                }
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                {/* Left Column - Text */}
                                                <div className="flex flex-col justify-center">
                                                    <p className="text-gray-700 mb-6">
                                                        {
                                                            sectionData.second_section_paragraph_1
                                                        }
                                                    </p>
                                                    <p className="text-gray-700">
                                                        {
                                                            sectionData.second_section_paragraph_2
                                                        }
                                                    </p>
                                                </div>
                                                {/* Right Column - Image */}
                                                <div className="relative h-[400px] rounded-md overflow-hidden bg-gray-100">
                                                    {sectionData.main_image_url ? (
                                                        <img
                                                            src={
                                                                sectionData.main_image_url
                                                            }
                                                            alt={
                                                                sectionData.main_image_alt ||
                                                                "Content image"
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            <div className="text-center">
                                                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                                <p className="text-gray-500">
                                                                    No image
                                                                    selected
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Enter content to see the preview
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

export default KioskContentEditor;
