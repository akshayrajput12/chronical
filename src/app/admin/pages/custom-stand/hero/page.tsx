"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Upload,
    Trash2,
    Eye,
    ArrowLeft,
    Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
    getCustomExhibitionHero,
    saveCustomExhibitionHero,
    uploadCustomExhibitionImage,
    deleteCustomExhibitionImage,
    CustomExhibitionHero,
} from "@/services/custom-exhibition-stands.service";
import { createClient } from "@/lib/supabase/client";
import { revalidatePathAction } from "@/services/revalidate.action";

const supabase = createClient();

const CustomStandHeroEditor = () => {
    const [heroData, setHeroData] = useState<CustomExhibitionHero>({
        title: "CUSTOM EXHIBITION STANDS",
        subtitle:
            "Increase the value of your brand with Chronicle Exhibition Organizing LLC, the leading source for custom-designed exhibit stand solutions in the UAE. We create visually compelling exhibition displays. Our team of skilled designers work to custom exhibition stands that transform your appearance at exhibitions.",
        background_image_url:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        background_image_alt: "Custom Exhibition Stands",
        is_active: true,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadHeroData();
    }, []);

    const loadHeroData = async () => {
        try {
            const data = await getCustomExhibitionHero();
            if (data) {
                setHeroData(data);
            }
        } catch (error) {
            console.error("Error loading hero data:", error);
            toast.error("Failed to load hero section data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const success = await saveCustomExhibitionHero(heroData);
            if (success) {
                toast.success("Hero section saved successfully!");
            } else {
                toast.error("Failed to save hero section");
            }
        } catch (error) {
            console.error("Error saving hero data:", error);
            toast.error("Failed to save hero section");
        } finally {
            revalidatePathAction("/custom-exhibition-stands-dubai-uae");
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size must be less than 10MB");
            return;
        }

        setIsUploading(true);
        try {
            const uploadedImage = await uploadCustomExhibitionImage(
                file,
                "hero",
                heroData.background_image_alt || "Custom Exhibition Stands",
            );

            if (uploadedImage) {
                // Get the public URL for the uploaded image
                const {
                    data: { publicUrl },
                } = supabase.storage
                    .from("custom-exhibition-images")
                    .getPublicUrl(uploadedImage.file_path);

                setHeroData(prev => ({
                    ...prev,
                    background_image_id: uploadedImage.id,
                    background_image_url: publicUrl,
                }));

                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleInputChange = (
        field: keyof CustomExhibitionHero,
        value: string,
    ) => {
        setHeroData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading hero section...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/admin/pages/custom-stand"
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Hero Section
                                </h1>
                                <p className="text-gray-600">
                                    Manage the main banner section
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/custom-exhibition-stands-dubai-uae"
                                target="_blank"
                                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Link>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={heroData.title}
                                onChange={e =>
                                    handleInputChange("title", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter hero title"
                            />
                        </div>

                        {/* Subtitle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtitle
                            </label>
                            <textarea
                                value={heroData.subtitle}
                                onChange={e =>
                                    handleInputChange(
                                        "subtitle",
                                        e.target.value,
                                    )
                                }
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter hero subtitle"
                            />
                        </div>

                        {/* Background Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Background Image
                            </label>

                            {/* Current Image Preview */}
                            {heroData.background_image_url && (
                                <div className="mb-4">
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={heroData.background_image_url}
                                            alt={
                                                heroData.background_image_alt ||
                                                "Hero background"
                                            }
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Image Upload */}
                            <div className="flex items-center space-x-4">
                                <label className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                                    <Upload className="w-4 h-4 mr-2" />
                                    {isUploading
                                        ? "Uploading..."
                                        : "Upload New Image"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </label>

                                {/* Image URL Input */}
                                <div className="flex-1">
                                    <input
                                        type="url"
                                        value={
                                            heroData.background_image_url || ""
                                        }
                                        onChange={e =>
                                            handleInputChange(
                                                "background_image_url",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Or enter image URL"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Alt Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image Alt Text
                            </label>
                            <input
                                type="text"
                                value={heroData.background_image_alt || ""}
                                onChange={e =>
                                    handleInputChange(
                                        "background_image_alt",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter image alt text for accessibility"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CustomStandHeroEditor;
