"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Eye,
    Upload,
    Trash,
    Settings,
    Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

// Types
interface DynamicCellImage {
    id: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    width: number;
    height: number;
    alt_text: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface SectionData {
    title: string;
    description: string;
    fallback_image_url: string;
    is_active: boolean;
}

const DynamicCellEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [sectionData, setSectionData] = useState<SectionData>({
        title: "Business Hub",
        description: "Dynamic business statistics and information center",
        fallback_image_url: "/images/home.jpg",
        is_active: true,
    });

    const [images, setImages] = useState<DynamicCellImage[]>([]);
    const [activeImage, setActiveImage] = useState<DynamicCellImage | null>(
        null,
    );
    const [sectionId, setSectionId] = useState<string | null>(null);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Get section data
                const { data: sectionData, error: sectionError } =
                    await supabase
                        .from("dynamic_cell_section")
                        .select("*")
                        .eq("is_active", true)
                        .single();

                if (sectionData) {
                    setSectionId(sectionData.id);
                    setSectionData({
                        title: sectionData.title,
                        description: sectionData.description,
                        fallback_image_url: sectionData.fallback_image_url,
                        is_active: sectionData.is_active,
                    });
                }

                // Get images
                const { data: imagesData } = await supabase
                    .from("dynamic_cell_images")
                    .select("*")
                    .order("created_at", { ascending: false });

                setImages(imagesData || []);
                const active = imagesData?.find(img => img.is_active);
                setActiveImage(active || null);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle file upload
    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];

        if (
            !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                file.type,
            )
        ) {
            toast.error(
                "Unsupported file format. Please use JPG, PNG, or WebP.",
            );
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size too large. Maximum size is 10MB.");
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2)}.${fileExt}`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from("dynamic-cell-images")
                .upload(fileName, file);

            if (uploadError) {
                toast.error("Failed to upload image");
                return;
            }

            // Save to database with static dimensions
            const { data: imageRecord, error: dbError } = await supabase
                .from("dynamic_cell_images")
                .insert({
                    filename: fileName,
                    original_filename: file.name,
                    file_path: fileName,
                    file_size: file.size,
                    mime_type: file.type,
                    width: 1920, // Static width
                    height: 1080, // Static height
                    alt_text: `Background image - ${file.name}`,
                    is_active: false,
                })
                .select()
                .single();

            if (dbError) {
                toast.error("Failed to save image record");
                return;
            }

            setImages(prev => [imageRecord, ...prev]);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Error uploading:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    // Handle setting active image
    const handleSetActiveImage = async (imageId: string) => {
        try {
            // Update all images to inactive
            await supabase
                .from("dynamic_cell_images")
                .update({ is_active: false })
                .neq("id", "00000000-0000-0000-0000-000000000000");

            // Set selected image as active
            await supabase
                .from("dynamic_cell_images")
                .update({ is_active: true })
                .eq("id", imageId);

            // Update section reference
            await supabase
                .from("dynamic_cell_section")
                .update({ background_image_id: imageId })
                .eq("id", sectionId);

            // Update local state
            setImages(prev =>
                prev.map(img => ({
                    ...img,
                    is_active: img.id === imageId,
                })),
            );

            const newActiveImage = images.find(img => img.id === imageId);
            setActiveImage(newActiveImage || null);

            toast.success("Background image updated successfully");
        } catch (error) {
            console.error("Error setting active image:", error);
            toast.error("Failed to set active image");
        }
    };

    // Handle image deletion
    const handleDeleteImage = async (imageId: string, filePath: string) => {
        try {
            // Delete from storage
            await supabase.storage
                .from("dynamic-cell-images")
                .remove([filePath]);

            // Delete from database
            await supabase
                .from("dynamic_cell_images")
                .delete()
                .eq("id", imageId);

            setImages(prev => prev.filter(img => img.id !== imageId));

            if (activeImage?.id === imageId) {
                setActiveImage(null);
            }

            toast.success("Image deleted successfully");
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image");
        }
    };

    // Handle section save
    const handleSaveSection = async () => {
        if (!sectionId) return;

        setSaving(true);
        try {
            await supabase
                .from("dynamic_cell_section")
                .update({
                    title: sectionData.title,
                    description: sectionData.description,
                    fallback_image_url: sectionData.fallback_image_url,
                })
                .eq("id", sectionId);

            toast.success("Section data saved successfully");
        } catch (error) {
            console.error("Error saving section:", error);
            toast.error("Failed to save section data");
        } finally {
            setSaving(false);
        }
    };

    // Get public URL for image
    const getImageUrl = (filePath: string) => {
        if (!filePath) return "";

        // If it's already a full URL, return as is
        if (filePath.startsWith("http")) {
            return filePath;
        }

        // Otherwise, construct the Supabase URL
        const { data } = supabase.storage
            .from("dynamic-cell-images")
            .getPublicUrl(filePath);
        return data.publicUrl;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a5cd39] mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading dynamic cell data...
                    </p>
                </div>
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
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dynamic Cell Background
                    </h1>
                    <p className="text-gray-600">
                        Manage background images for the dynamic cell section
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            window.open("/#dynamic-central", "_blank")
                        }
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button onClick={handleSaveSection} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </motion.div>

            <Tabs defaultValue="settings" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="settings">Section Settings</TabsTrigger>
                    <TabsTrigger value="images">Manage Images</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                {/* Section Settings Tab */}
                <TabsContent value="settings">
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Configuration</CardTitle>
                                <CardDescription>
                                    Configure the basic settings for the dynamic
                                    cell section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Section Title</Label>
                                    <Input
                                        id="title"
                                        value={sectionData.title}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter section title"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={sectionData.description || ""}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter section description"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="fallback">
                                        Fallback Image URL
                                    </Label>
                                    <Input
                                        id="fallback"
                                        value={sectionData.fallback_image_url}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                fallback_image_url:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter fallback image URL"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Images Management Tab */}
                <TabsContent value="images">
                    <motion.div variants={itemVariants} className="space-y-6">
                        {/* Upload Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload New Image</CardTitle>
                                <CardDescription>
                                    Upload a new background image for the
                                    dynamic cell section
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e =>
                                            handleFileUpload(e.target.files)
                                        }
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer"
                                    >
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-lg font-medium text-gray-700 mb-2">
                                            {uploading
                                                ? "Uploading..."
                                                : "Click to upload or drag and drop"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            PNG, JPG, WebP up to 10MB
                                        </p>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Images Grid */}
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
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {images.map(image => (
                                            <div
                                                key={image.id}
                                                className={`relative border rounded-lg overflow-hidden ${
                                                    image.is_active
                                                        ? "border-green-500 ring-2 ring-green-200"
                                                        : "border-gray-200"
                                                }`}
                                            >
                                                <div className="aspect-video relative">
                                                    <Image
                                                        src={getImageUrl(
                                                            image.file_path,
                                                        )}
                                                        alt={
                                                            image.alt_text ||
                                                            "Background image"
                                                        }
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {image.is_active && (
                                                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                                                            Active
                                                        </div>
                                                    )}
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
                                                    <div className="flex gap-2 mt-2">
                                                        {!image.is_active && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleSetActiveImage(
                                                                        image.id,
                                                                    )
                                                                }
                                                            >
                                                                Set Active
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDeleteImage(
                                                                    image.id,
                                                                    image.file_path,
                                                                )
                                                            }
                                                        >
                                                            <Trash className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Preview Tab */}
                <TabsContent value="preview">
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Live Preview</CardTitle>
                                <CardDescription>
                                    Preview how the dynamic cell section will
                                    appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative h-[400px] rounded-lg overflow-hidden">
                                    <Image
                                        src={
                                            activeImage
                                                ? getImageUrl(
                                                      activeImage.file_path,
                                                  )
                                                : sectionData.fallback_image_url
                                        }
                                        alt="Dynamic cell background preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <h2 className="text-3xl font-bold mb-4">
                                                {sectionData.title}
                                            </h2>
                                            {sectionData.description && (
                                                <p className="text-lg">
                                                    {sectionData.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
};

export default DynamicCellEditor;
