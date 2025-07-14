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
    KioskHeroSection,
    KioskHeroSectionInput,
    KioskHeroImage,
    KioskHeroNotification,
} from "@/types/kiosk";
import { revalidatePathAction } from "@/services/revalidate.action";

const KioskHeroEditor = () => {
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

    // State for kiosk hero data
    const [sectionData, setSectionData] = useState<KioskHeroSectionInput>({
        heading: "",
        background_image_url: "",
        is_active: true,
    });

    const [images, setImages] = useState<KioskHeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Notification state
    const [notification, setNotification] = useState<KioskHeroNotification>({
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

    const loadKioskHeroData = useCallback(async () => {
        try {
            // Use the database function to get hero data with image
            const { data, error } = await supabase.rpc(
                "get_kiosk_hero_section_with_image",
            );

            if (error) {
                console.error("Error fetching kiosk hero data:", error);
                return;
            }

            if (data && data.length > 0) {
                const heroSection = data[0];

                // If there's an active image, get its public URL
                let finalImageUrl = heroSection.background_image_url;
                if (heroSection.image_file_path) {
                    const { data: imageData } = supabase.storage
                        .from("kiosk-hero-images")
                        .getPublicUrl(heroSection.image_file_path);
                    finalImageUrl = imageData.publicUrl;
                }

                setSectionData({
                    heading: heroSection.heading,
                    background_image_url: finalImageUrl || "",
                    background_image_id: heroSection.background_image_id,
                    is_active: heroSection.is_active,
                });
            }
        } catch (error) {
            console.error("Error loading kiosk hero data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to load kiosk hero data",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const loadImages = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("kiosk_hero_images")
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
        loadKioskHeroData();
        loadImages();
    }, [loadKioskHeroData, loadImages]);

    const saveKioskHeroData = async () => {
        setSaving(true);
        try {
            // Check if record exists (get the most recent one)
            const { data: existingData } = await supabase
                .from("kiosk_hero_sections")
                .select("id")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (existingData && existingData.length > 0) {
                // Update existing record
                const { error } = await supabase
                    .from("kiosk_hero_sections")
                    .update(sectionData)
                    .eq("id", existingData[0].id);

                if (error) throw error;
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("kiosk_hero_sections")
                    .insert([sectionData]);

                if (error) throw error;
            }

            showNotification(
                "success",
                "Success!",
                "Kiosk hero section saved successfully!",
            );
        } catch (error) {
            console.error("Error saving kiosk hero data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to save kiosk hero section",
            );
        } finally {
            revalidatePathAction("/kiosk-manufacturers-in-dubai-uae");
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
            const filePath = `kiosk-hero/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("kiosk-hero-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Save image metadata to database
            const { data: imageData, error: dbError } = await supabase
                .from("kiosk_hero_images")
                .insert([
                    {
                        filename: fileName,
                        original_filename: file.name,
                        file_path: filePath,
                        file_size: file.size,
                        mime_type: file.type,
                        alt_text: "Kiosk hero background image",
                        is_active: true,
                    },
                ])
                .select()
                .single();

            if (dbError) throw dbError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("kiosk-hero-images")
                .getPublicUrl(filePath);

            // Update section data with new image
            setSectionData(prev => ({
                ...prev,
                background_image_url: urlData.publicUrl,
                background_image_id: imageData.id,
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
                .from("kiosk_hero_images")
                .select("file_path")
                .eq("id", imageId)
                .single();

            if (fetchError) throw fetchError;

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from("kiosk-hero-images")
                .remove([imageData.file_path]);

            if (storageError) throw storageError;

            // Delete from database
            const { error: dbError } = await supabase
                .from("kiosk_hero_images")
                .delete()
                .eq("id", imageId);

            if (dbError) throw dbError;

            // If this was the active image, clear it from section data
            if (sectionData.background_image_id === imageId) {
                setSectionData(prev => ({
                    ...prev,
                    background_image_url: "",
                    background_image_id: undefined,
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

    const selectImage = (image: KioskHeroImage) => {
        const { data: urlData } = supabase.storage
            .from("kiosk-hero-images")
            .getPublicUrl(image.file_path);

        setSectionData(prev => ({
            ...prev,
            background_image_url: urlData.publicUrl,
            background_image_id: image.id,
        }));

        showNotification(
            "success",
            "Image Selected",
            "Background image updated successfully!",
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
                        Kiosk Hero Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the main hero section of the kiosk page
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
                        onClick={saveKioskHeroData}
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
                            Background Images
                        </TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    {/* Content Settings Tab */}
                    <TabsContent value="content" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Content</CardTitle>
                                <CardDescription>
                                    Configure the main heading and content for
                                    the kiosk hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="heading">
                                        Main Heading
                                    </Label>
                                    <Input
                                        id="heading"
                                        value={sectionData.heading}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                heading: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the main heading for the kiosk hero section"
                                        className="text-lg"
                                    />
                                    <p className="text-sm text-gray-500">
                                        This will be displayed as the main
                                        heading on the kiosk page
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="background_url">
                                        Background Image URL (Optional)
                                    </Label>
                                    <Input
                                        id="background_url"
                                        value={
                                            sectionData.background_image_url ||
                                            ""
                                        }
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                background_image_url:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter a direct URL for the background image"
                                    />
                                    <p className="text-sm text-gray-500">
                                        You can either upload an image in the
                                        Background Images tab or enter a direct
                                        URL here
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

                    {/* Background Images Tab */}
                    <TabsContent value="images" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload New Image</CardTitle>
                                <CardDescription>
                                    Upload a new background image for the kiosk
                                    hero section
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
                                    Select an image to use as the background for
                                    the kiosk hero section
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
                                                    .from("kiosk-hero-images")
                                                    .getPublicUrl(
                                                        image.file_path,
                                                    );

                                            const isSelected =
                                                sectionData.background_image_id ===
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
                                    Preview how the kiosk hero section will
                                    appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.heading ? (
                                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                                        {/* Background Image */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{
                                                backgroundImage:
                                                    sectionData.background_image_url
                                                        ? `url('${sectionData.background_image_url}')`
                                                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                filter: "brightness(0.5)",
                                            }}
                                        />

                                        {/* Content */}
                                        <div className="relative z-10 flex items-center justify-center h-full">
                                            <div className="text-center text-white px-4">
                                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                                    {sectionData.heading}
                                                </h1>
                                                <div className="w-24 h-1 bg-[#a5cd39] mx-auto"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Enter a heading to see the preview
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

export default KioskHeroEditor;
