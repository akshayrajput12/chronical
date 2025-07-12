"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
    getCustomExhibitionStrikingCustomized,
    saveCustomExhibitionStrikingCustomized,
    uploadCustomExhibitionImage,
    CustomExhibitionStrikingCustomized,
} from "@/services/custom-exhibition-stands.service";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const CustomStandStrikingCustomizedEditor = () => {
    const [data, setData] = useState<CustomExhibitionStrikingCustomized>({
        title: "STRIKING CUSTOMIZED EXHIBITION STANDS",
        paragraph_1:
            "Interactive displays and eye-catching designs will help you communicate your company's message effectively and convincingly. From materials and colors, to dimensions, shapes and design, your display is completely tailored to your brand and business which allows you to present your services and products in the most effective and appealing manner possible.",
        paragraph_2:
            "You can use our custom exhibit stands for various branding and exhibit needs, such as portable fitting rooms, entry spaces, custom workspaces, and pop-up stores. The distinctive stand designed by Chronicle creates an unforgettable impression on the people who visit your stand. As more than 50% of business decision makers would like sales representatives to visit their business following the event, you'll need a stand to showcase your product in the best way possible. Our stand is distinct and appealing design which is sure to draw attention.",
        image_url:
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        image_alt: "Striking customized exhibition stands",
        is_active: true,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await getCustomExhibitionStrikingCustomized();
            if (result) {
                setData(result);
            }
        } catch (error) {
            console.error("Error loading striking customized data:", error);
            toast.error("Failed to load striking customized section data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const success = await saveCustomExhibitionStrikingCustomized(data);
            if (success) {
                toast.success(
                    "Striking customized section saved successfully!",
                );
            } else {
                toast.error("Failed to save striking customized section");
            }
        } catch (error) {
            console.error("Error saving striking customized data:", error);
            toast.error("Failed to save striking customized section");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size must be less than 10MB");
            return;
        }

        setIsUploading(true);
        try {
            const uploadedImage = await uploadCustomExhibitionImage(
                file,
                "striking_customized",
                data.image_alt || "Striking customized exhibition stands",
            );

            if (uploadedImage) {
                const {
                    data: { publicUrl },
                } = supabase.storage
                    .from("custom-exhibition-images")
                    .getPublicUrl(uploadedImage.file_path);

                setData(prev => ({
                    ...prev,
                    image_id: uploadedImage.id,
                    image_url: publicUrl,
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
        field: keyof CustomExhibitionStrikingCustomized,
        value: string,
    ) => {
        setData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Loading striking customized section...
                    </p>
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
                                    Striking Customized Section
                                </h1>
                                <p className="text-gray-600">
                                    Manage the striking customized exhibition
                                    stands content
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
                                Section Title
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e =>
                                    handleInputChange("title", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter section title"
                            />
                        </div>

                        {/* First Paragraph */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Paragraph
                            </label>
                            <textarea
                                value={data.paragraph_1}
                                onChange={e =>
                                    handleInputChange(
                                        "paragraph_1",
                                        e.target.value,
                                    )
                                }
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter first paragraph content"
                            />
                        </div>

                        {/* Second Paragraph */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Second Paragraph
                            </label>
                            <textarea
                                value={data.paragraph_2}
                                onChange={e =>
                                    handleInputChange(
                                        "paragraph_2",
                                        e.target.value,
                                    )
                                }
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter second paragraph content"
                            />
                        </div>

                        {/* Image Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section Image
                            </label>

                            {/* Current Image Preview */}
                            {data.image_url && (
                                <div className="mb-4">
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={data.image_url}
                                            alt={
                                                data.image_alt ||
                                                "Section image"
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

                                <div className="flex-1">
                                    <input
                                        type="url"
                                        value={data.image_url || ""}
                                        onChange={e =>
                                            handleInputChange(
                                                "image_url",
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
                                value={data.image_alt || ""}
                                onChange={e =>
                                    handleInputChange(
                                        "image_alt",
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

export default CustomStandStrikingCustomizedEditor;
