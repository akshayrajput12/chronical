"use client";

import React, { useState, useEffect } from "react";
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
    ConferenceHeroSection,
    ConferenceHeroSectionInput,
    ConferenceHeroImage,
} from "@/types/conference";
import { revalidatePathAction } from "@/services/revalidate.action";

const ConferenceHeroEditor = () => {
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

    // State for conference hero data
    const [sectionData, setSectionData] = useState<ConferenceHeroSectionInput>({
        heading: "",
        background_image_url: "",
        is_active: true,
    });

    const [images, setImages] = useState<ConferenceHeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Notification state
    const [notification, setNotification] = useState<{
        show: boolean;
        type: "success" | "error" | "info";
        title: string;
        message: string;
    }>({
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
        loadConferenceHeroData();
        loadImages();
    }, []);

    const loadConferenceHeroData = async () => {
        try {
            // Use the database function to get hero data with image
            const { data, error } = await supabase.rpc(
                "get_conference_hero_section_with_image",
            );

            if (error) {
                console.error("Error fetching conference hero data:", error);
                return;
            }

            if (data && data.length > 0) {
                const heroSection = data[0];

                // If there's an active image, get its public URL
                let finalImageUrl = heroSection.background_image_url;
                if (heroSection.image_file_path) {
                    const { data: imageData } = supabase.storage
                        .from("conference-hero-images")
                        .getPublicUrl(heroSection.image_file_path);
                    finalImageUrl = imageData.publicUrl;
                }

                setSectionData({
                    heading: heroSection.heading,
                    background_image_url: finalImageUrl || "",
                    background_image_id: heroSection.background_image_id,
                    is_active: heroSection.is_active,
                });
            } else {
                // If no data found, try direct query
                const { data: directData, error: directError } = await supabase
                    .from("conference_hero_sections")
                    .select("*")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(1);

                if (directData && directData.length > 0 && !directError) {
                    setSectionData({
                        heading: directData[0].heading,
                        background_image_url:
                            directData[0].background_image_url || "",
                        background_image_id: directData[0].background_image_id,
                        is_active: directData[0].is_active,
                    });
                }
            }
        } catch (error) {
            console.error("Error loading conference hero data:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadImages = async () => {
        try {
            const { data, error } = await supabase
                .from("conference_hero_images")
                .select("*")
                .order("created_at", { ascending: false });

            if (data && !error) {
                setImages(data);
            }
        } catch (error) {
            console.error("Error loading images:", error);
        }
    };

    const saveConferenceHeroData = async () => {
        setSaving(true);
        try {
            // Check if record exists (get the most recent one)
            const { data: existingData } = await supabase
                .from("conference_hero_sections")
                .select("id")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (existingData && existingData.length > 0) {
                // Update existing record
                const { error } = await supabase
                    .from("conference_hero_sections")
                    .update(sectionData)
                    .eq("id", existingData[0].id);

                if (error) throw error;
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("conference_hero_sections")
                    .insert([sectionData]);

                if (error) throw error;
            }

            showNotification(
                "success",
                "Success!",
                "Conference hero section saved successfully!",
            );
        } catch (error) {
            console.error("Error saving conference hero data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to save data. Please try again.",
            );
        } finally {
            revalidatePathAction("/conference-organizers-in-dubai-uae");
            setSaving(false);
        }
    };

    const handleInputChange = (
        field: keyof ConferenceHeroSectionInput,
        value: string,
    ) => {
        setSectionData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Generate unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `conference-hero/${fileName}`;

            // Upload file to Supabase storage
            const { error: uploadError } = await supabase.storage
                .from("conference-hero-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Save image metadata to database and make it active
            const { data: insertedImage, error: dbError } = await supabase
                .from("conference_hero_images")
                .insert([
                    {
                        filename: fileName,
                        original_filename: file.name,
                        file_path: filePath,
                        file_size: file.size,
                        mime_type: file.type,
                        alt_text: "Conference hero background image",
                        is_active: true, // Make uploaded image active immediately
                    },
                ])
                .select()
                .single();

            if (dbError) throw dbError;

            // Deactivate all other images
            await supabase
                .from("conference_hero_images")
                .update({ is_active: false })
                .neq("id", insertedImage.id);

            // Update section data with new active image
            const { data: imageData } = supabase.storage
                .from("conference-hero-images")
                .getPublicUrl(filePath);

            setSectionData(prev => ({
                ...prev,
                background_image_id: insertedImage.id,
                background_image_url: imageData.publicUrl,
            }));

            // Update the hero section in database with the new image ID
            const { data: existingHero } = await supabase
                .from("conference_hero_sections")
                .select("id")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (existingHero && existingHero.length > 0) {
                await supabase
                    .from("conference_hero_sections")
                    .update({
                        background_image_id: insertedImage.id,
                        background_image_url: imageData.publicUrl,
                    })
                    .eq("id", existingHero[0].id);
            }

            // Reload images and hero data
            await loadImages();
            await loadConferenceHeroData();

            showNotification(
                "success",
                "Success!",
                "Image uploaded and activated successfully!",
            );
        } catch (error) {
            console.error("Error uploading image:", error);
            showNotification(
                "error",
                "Upload Failed",
                "Error uploading image. Please try again.",
            );
        } finally {
            setUploading(false);
        }
    };

    const activateImage = async (imageId: string) => {
        try {
            // First, deactivate all images
            const { error: deactivateError } = await supabase
                .from("conference_hero_images")
                .update({ is_active: false });

            if (deactivateError) throw deactivateError;

            // Then activate the selected image
            const { error: activateError } = await supabase
                .from("conference_hero_images")
                .update({ is_active: true })
                .eq("id", imageId);

            if (activateError) throw activateError;

            // Update local state
            setImages(prev =>
                prev.map(img => ({
                    ...img,
                    is_active: img.id === imageId,
                })),
            );

            // Update section data with new image
            const activeImage = images.find(img => img.id === imageId);
            if (activeImage) {
                const { data } = supabase.storage
                    .from("conference-hero-images")
                    .getPublicUrl(activeImage.file_path);

                setSectionData(prev => ({
                    ...prev,
                    background_image_id: imageId,
                    background_image_url: data.publicUrl,
                }));

                // Update the hero section in database with the new image ID
                const { data: existingHero } = await supabase
                    .from("conference_hero_sections")
                    .select("id")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(1);

                if (existingHero && existingHero.length > 0) {
                    await supabase
                        .from("conference_hero_sections")
                        .update({
                            background_image_id: imageId,
                            background_image_url: data.publicUrl,
                        })
                        .eq("id", existingHero[0].id);
                }
            }

            // Reload the hero data to get the updated information
            await loadConferenceHeroData();

            showNotification(
                "success",
                "Success!",
                "Image activated successfully!",
            );
        } catch (error) {
            console.error("Error activating image:", error);
            showNotification(
                "error",
                "Activation Failed",
                "Error activating image. Please try again.",
            );
        }
    };

    const deleteImage = async (imageId: string, filePath: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from("conference-hero-images")
                .remove([filePath]);

            if (storageError) throw storageError;

            // Delete from database
            const { error: dbError } = await supabase
                .from("conference_hero_images")
                .delete()
                .eq("id", imageId);

            if (dbError) throw dbError;

            // Reload images
            await loadImages();
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
                "Error deleting image. Please try again.",
            );
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
            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Conference Hero Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the main hero section of the conference page
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open("/conference", "_blank")}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={saveConferenceHeroData}
                        disabled={saving}
                        className="bg-[#a5cd39] hover:bg-[#94b933]"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
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

            {/* Info Banner */}
            <motion.div
                variants={itemVariants}
                className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-start gap-3"
            >
                <Info
                    className="text-blue-500 mt-0.5 flex-shrink-0"
                    size={18}
                />
                <div>
                    <h3 className="font-medium text-blue-700 mb-1">
                        About the Conference Hero Section
                    </h3>
                    <p className="text-blue-600 text-sm">
                        This section appears at the top of the conference page.
                        You can edit the main heading and background image. All
                        changes will be reflected on the website after saving.
                    </p>
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
                                    Configure the main content for the
                                    conference hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Heading */}
                                <div className="space-y-2">
                                    <Label htmlFor="heading">
                                        Main Heading *
                                    </Label>
                                    <Input
                                        id="heading"
                                        value={sectionData.heading}
                                        onChange={e =>
                                            handleInputChange(
                                                "heading",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter main heading"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                {/* Background Image URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="background_image_url">
                                        Background Image URL
                                    </Label>
                                    <Input
                                        id="background_image_url"
                                        value={
                                            sectionData.background_image_url ||
                                            ""
                                        }
                                        onChange={e =>
                                            handleInputChange(
                                                "background_image_url",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter image URL or upload an image in the Images tab"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Images Tab */}
                    <TabsContent value="images" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Background Images</CardTitle>
                                <CardDescription>
                                    Upload and manage background images for the
                                    conference hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Upload Section */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            Upload a new background image
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Supported formats: JPG, PNG, WebP
                                            (Max 10MB)
                                        </p>
                                    </div>
                                    <div className="mt-4">
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
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#a5cd39] hover:bg-[#94b933] cursor-pointer ${
                                                uploading
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            {uploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Upload Image
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Images Grid */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {images.map(image => {
                                            const { data } = supabase.storage
                                                .from("conference-hero-images")
                                                .getPublicUrl(image.file_path);

                                            return (
                                                <div
                                                    key={image.id}
                                                    className={`relative border-2 rounded-lg overflow-hidden ${
                                                        image.is_active
                                                            ? "border-[#a5cd39] ring-2 ring-[#a5cd39]/20"
                                                            : "border-gray-200"
                                                    }`}
                                                >
                                                    <div className="aspect-video relative">
                                                        <img
                                                            src={data.publicUrl}
                                                            alt={image.alt_text}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {image.is_active && (
                                                            <div className="absolute top-2 left-2 bg-[#a5cd39] text-white px-2 py-1 rounded text-xs font-medium">
                                                                Active
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3 bg-white">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {
                                                                image.original_filename
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {(
                                                                image.file_size /
                                                                1024 /
                                                                1024
                                                            ).toFixed(2)}{" "}
                                                            MB
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-3">
                                                            {!image.is_active && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        activateImage(
                                                                            image.id,
                                                                        )
                                                                    }
                                                                    className="bg-[#a5cd39] hover:bg-[#94b933] text-xs"
                                                                >
                                                                    Use Image
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    deleteImage(
                                                                        image.id,
                                                                        image.file_path,
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-700 text-xs"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {images.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                                        <p>No images uploaded yet</p>
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
                                    Preview how the conference hero section will
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

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-white px-4">
                                                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                                                    {sectionData.heading}
                                                </h1>
                                                <div className="w-16 h-1 bg-[#a5cd39] mx-auto" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <h3 className="text-lg font-medium mb-2">
                                                No Content Available
                                            </h3>
                                            <p className="text-sm">
                                                Add a heading and background
                                                image to see the preview
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        This is a preview of how your conference
                                        hero section will appear. Save your
                                        changes and visit the conference page to
                                        see the live version.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* Notification Popup */}
            {notification.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    className="fixed top-4 right-4 z-50 max-w-sm w-full"
                >
                    <div
                        className={`rounded-lg shadow-lg border p-4 ${
                            notification.type === "success"
                                ? "bg-green-50 border-green-200"
                                : notification.type === "error"
                                ? "bg-red-50 border-red-200"
                                : "bg-blue-50 border-blue-200"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                {notification.type === "success" && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                {notification.type === "error" && (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                {notification.type === "info" && (
                                    <AlertCircle className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4
                                    className={`text-sm font-medium ${
                                        notification.type === "success"
                                            ? "text-green-800"
                                            : notification.type === "error"
                                            ? "text-red-800"
                                            : "text-blue-800"
                                    }`}
                                >
                                    {notification.title}
                                </h4>
                                <p
                                    className={`text-sm mt-1 ${
                                        notification.type === "success"
                                            ? "text-green-700"
                                            : notification.type === "error"
                                            ? "text-red-700"
                                            : "text-blue-700"
                                    }`}
                                >
                                    {notification.message}
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    setNotification(prev => ({
                                        ...prev,
                                        show: false,
                                    }))
                                }
                                className={`flex-shrink-0 rounded-md p-1.5 inline-flex ${
                                    notification.type === "success"
                                        ? "text-green-500 hover:bg-green-100"
                                        : notification.type === "error"
                                        ? "text-red-500 hover:bg-red-100"
                                        : "text-blue-500 hover:bg-blue-100"
                                }`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ConferenceHeroEditor;
