"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Save,
    Eye,
    Upload,
    Image as ImageIcon,
    Trash2,
    Info,
    CheckCircle,
    XCircle,
    AlertCircle,
    X,
} from "lucide-react";
import type {
    CommunicateSectionInput,
    CommunicateImage,
    CommunicateNotification,
} from "@/types/communicate-section";

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
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

const CommunicateSectionEditor = () => {
    // State management
    const [sectionData, setSectionData] = useState<CommunicateSectionInput>({
        main_heading: "COMMUNICATE TO PROFICIENT MEETING & CONFERENCE PLANNERS",
        company_name: "Chronicle Exhibition Organizing LLC",
        first_paragraph:
            "is one of the most well-liked event organizing & management companies in Dubai & UAE. We as conference organizers in Dubai, UAE have a close-knit & active team of dedicated professionals capable of planning & executing corporate meetings & events successfully.",
        second_paragraph:
            "Our event management experts are packed with innovative ideas & are there for your continuous support.",
        main_image_url: "",
        main_image_alt: "Professional conference presentation",
        is_active: true,
    });

    const [images, setImages] = useState<CommunicateImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Notification state
    const [notification, setNotification] = useState<CommunicateNotification>({
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
        loadCommunicateData();
        loadImages();
    }, []);

    const loadCommunicateData = async () => {
        try {
            // Get the section data (get the most recent one)
            const { data: sections, error: sectionError } = await supabase
                .from("communicate_sections")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (sectionError) {
                return;
            }

            if (sections && sections.length > 0) {
                const section = sections[0];

                // If there's a main_image_id, get its public URL
                let finalImageUrl = section.main_image_url;
                if (section.main_image_id) {
                    const { data: imageData, error: imageError } =
                        await supabase
                            .from("communicate_images")
                            .select("file_path")
                            .eq("id", section.main_image_id)
                            .eq("is_active", true)
                            .single();

                    if (imageData && !imageError) {
                        const { data: publicUrlData } = supabase.storage
                            .from("communicate-section-images")
                            .getPublicUrl(imageData.file_path);
                        finalImageUrl = publicUrlData.publicUrl;
                    }
                }

                setSectionData({
                    main_heading: section.main_heading,
                    company_name: section.company_name,
                    first_paragraph: section.first_paragraph,
                    second_paragraph: section.second_paragraph,
                    main_image_url: finalImageUrl || "",
                    main_image_alt: section.main_image_alt,
                    main_image_id: section.main_image_id,
                    is_active: section.is_active,
                });
            }
        } catch (error) {
            console.error("Error loading communicate data:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadImages = async () => {
        try {
            const { data, error } = await supabase
                .from("communicate_images")
                .select("*")
                .order("created_at", { ascending: false });

            if (data && !error) {
                setImages(data);
            }
        } catch (error) {
            console.error("Error loading images:", error);
        }
    };

    const saveCommunicateData = async () => {
        setSaving(true);
        try {
            // Check if record exists (get the most recent one)
            const { data: existingData } = await supabase
                .from("communicate_sections")
                .select("id")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (existingData && existingData.length > 0) {
                // Update existing record
                const { error } = await supabase
                    .from("communicate_sections")
                    .update(sectionData)
                    .eq("id", existingData[0].id);

                if (error) throw error;
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("communicate_sections")
                    .insert([sectionData]);

                if (error) throw error;
            }

            showNotification(
                "success",
                "Success!",
                "Communicate section saved successfully!",
            );
        } catch (error) {
            console.error("Error saving communicate data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to save data. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (
        field: keyof CommunicateSectionInput,
        value: string,
    ) => {
        setSectionData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Image management functions
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
            const filePath = `communicate-section/${fileName}`;

            // Upload file to Supabase storage
            const { error: uploadError } = await supabase.storage
                .from("communicate-section-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Save image metadata to database and make it active
            const { data: insertedImage, error: dbError } = await supabase
                .from("communicate_images")
                .insert([
                    {
                        filename: fileName,
                        original_filename: file.name,
                        file_path: filePath,
                        file_size: file.size,
                        mime_type: file.type,
                        alt_text: "Professional conference presentation",
                        is_active: true,
                    },
                ])
                .select()
                .single();

            if (dbError) throw dbError;

            // Deactivate all other images
            await supabase
                .from("communicate_images")
                .update({ is_active: false })
                .neq("id", insertedImage.id);

            // Update section data with new active image
            const { data: imageData } = supabase.storage
                .from("communicate-section-images")
                .getPublicUrl(filePath);

            setSectionData(prev => ({
                ...prev,
                main_image_id: insertedImage.id,
                main_image_url: imageData.publicUrl,
            }));

            // Update the section in database with the new image ID
            const { data: existingSection } = await supabase
                .from("communicate_sections")
                .select("id")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (existingSection && existingSection.length > 0) {
                await supabase
                    .from("communicate_sections")
                    .update({
                        main_image_id: insertedImage.id,
                        main_image_url: imageData.publicUrl,
                    })
                    .eq("id", existingSection[0].id);
            }

            // Reload images and section data
            await loadImages();
            await loadCommunicateData();

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
                .from("communicate_images")
                .update({ is_active: false });

            if (deactivateError) throw deactivateError;

            // Then activate the selected image
            const { error: activateError } = await supabase
                .from("communicate_images")
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
                    .from("communicate-section-images")
                    .getPublicUrl(activeImage.file_path);

                setSectionData(prev => ({
                    ...prev,
                    main_image_id: imageId,
                    main_image_url: data.publicUrl,
                }));

                // Update the section in database with the new image ID
                const { data: existingSection } = await supabase
                    .from("communicate_sections")
                    .select("id")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(1);

                if (existingSection && existingSection.length > 0) {
                    await supabase
                        .from("communicate_sections")
                        .update({
                            main_image_id: imageId,
                            main_image_url: data.publicUrl,
                        })
                        .eq("id", existingSection[0].id);
                }
            }

            // Reload the section data to get the updated information
            await loadCommunicateData();

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
                .from("communicate-section-images")
                .remove([filePath]);

            if (storageError) throw storageError;

            // Delete from database
            const { error: dbError } = await supabase
                .from("communicate_images")
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
                        Communicate Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the communicate section of the conference page
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
                        onClick={saveCommunicateData}
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
                        About the Communicate Section
                    </h3>
                    <p className="text-blue-600 text-sm">
                        This section appears on the conference page and
                        showcases your company's expertise in conference
                        planning. You can edit the main content, company name,
                        and description paragraphs. All changes will be
                        reflected on the website after saving.
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
                            Image Management
                        </TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    {/* Content Settings Tab */}
                    <TabsContent value="content" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Content</CardTitle>
                                <CardDescription>
                                    Configure the main content for the
                                    communicate section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Main Heading */}
                                <div className="space-y-2">
                                    <Label htmlFor="main_heading">
                                        Main Heading *
                                    </Label>
                                    <Input
                                        id="main_heading"
                                        value={sectionData.main_heading}
                                        onChange={e =>
                                            handleInputChange(
                                                "main_heading",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter main heading"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                {/* Company Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="company_name">
                                        Company Name *
                                    </Label>
                                    <Input
                                        id="company_name"
                                        value={sectionData.company_name}
                                        onChange={e =>
                                            handleInputChange(
                                                "company_name",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter company name"
                                        className="font-medium"
                                    />
                                </div>

                                {/* First Paragraph */}
                                <div className="space-y-2">
                                    <Label htmlFor="first_paragraph">
                                        First Paragraph *
                                    </Label>
                                    <Textarea
                                        id="first_paragraph"
                                        value={sectionData.first_paragraph}
                                        onChange={e =>
                                            handleInputChange(
                                                "first_paragraph",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter first paragraph content"
                                        rows={4}
                                    />
                                    <p className="text-xs text-gray-500">
                                        This text will appear after the company
                                        name in the first paragraph.
                                    </p>
                                </div>

                                {/* Second Paragraph */}
                                <div className="space-y-2">
                                    <Label htmlFor="second_paragraph">
                                        Second Paragraph *
                                    </Label>
                                    <Textarea
                                        id="second_paragraph"
                                        value={sectionData.second_paragraph}
                                        onChange={e =>
                                            handleInputChange(
                                                "second_paragraph",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter second paragraph content"
                                        rows={3}
                                    />
                                </div>

                                {/* Image Alt Text */}
                                <div className="space-y-2">
                                    <Label htmlFor="main_image_alt">
                                        Image Alt Text
                                    </Label>
                                    <Input
                                        id="main_image_alt"
                                        value={sectionData.main_image_alt}
                                        onChange={e =>
                                            handleInputChange(
                                                "main_image_alt",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter image alt text for accessibility"
                                    />
                                </div>

                                {/* Main Image URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="main_image_url">
                                        Main Image URL
                                    </Label>
                                    <Input
                                        id="main_image_url"
                                        value={sectionData.main_image_url || ""}
                                        onChange={e =>
                                            handleInputChange(
                                                "main_image_url",
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
                                <CardTitle>Image Management</CardTitle>
                                <CardDescription>
                                    Upload and manage images for the communicate
                                    section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Upload Section */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            Upload a new image for the
                                            communicate section
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
                                                .from(
                                                    "communicate-section-images",
                                                )
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
                                    Preview how the communicate section will
                                    appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.main_heading &&
                                sectionData.company_name ? (
                                    <div className="bg-white border rounded-lg overflow-hidden p-6">
                                        {/* Preview Container */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                            {/* Left Image with Colored Background */}
                                            <div className="order-2 lg:order-1 relative">
                                                <div
                                                    className="absolute -bottom-6 -left-6 w-full h-full z-0"
                                                    style={{
                                                        backgroundColor:
                                                            "#a5cd39",
                                                    }}
                                                ></div>

                                                {/* Image Container */}
                                                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[300px] overflow-hidden z-10">
                                                    <img
                                                        src={
                                                            sectionData.main_image_url ||
                                                            "https://images.unsplash.com/photo-1559223607-b4d0555ae227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                                        }
                                                        alt={
                                                            sectionData.main_image_alt
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            {/* Right Content */}
                                            <div className="order-1 lg:order-2">
                                                <div className="space-y-6">
                                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide text-center">
                                                        {
                                                            sectionData.main_heading
                                                        }
                                                    </h2>

                                                    <div className="space-y-4 text-gray-700">
                                                        <p className="text-sm leading-relaxed text-justify">
                                                            <span
                                                                className="font-semibold"
                                                                style={{
                                                                    color: "#a5cd39",
                                                                }}
                                                            >
                                                                {
                                                                    sectionData.company_name
                                                                }
                                                            </span>{" "}
                                                            {
                                                                sectionData.first_paragraph
                                                            }
                                                        </p>

                                                        <p className="text-sm leading-relaxed text-justify">
                                                            {
                                                                sectionData.second_paragraph
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <h3 className="text-lg font-medium mb-2">
                                                No Content Available
                                            </h3>
                                            <p className="text-sm">
                                                Add content in the Content
                                                Settings tab to see the preview
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        This is a preview of how your
                                        communicate section will appear. Save
                                        your changes and visit the conference
                                        page to see the live version.
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

export default CommunicateSectionEditor;
