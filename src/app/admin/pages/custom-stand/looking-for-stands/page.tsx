"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, ArrowLeft, Phone } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
    getCustomExhibitionLookingForStands,
    saveCustomExhibitionLookingForStands,
    CustomExhibitionLookingForStands,
} from "@/services/custom-exhibition-stands.service";

const CustomStandLookingForStandsEditor = () => {
    const [data, setData] = useState<CustomExhibitionLookingForStands>({
        title: "LOOKING FOR CUSTOM EXHIBITION STANDS IN DUBAI",
        phone_number: "+971543474645",
        phone_display: "Call +971 (543) 47-4645",
        cta_text: "or submit enquiry form below",
        background_color: "#a5cd39",
        is_active: true,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await getCustomExhibitionLookingForStands();
            if (result) {
                setData(result);
            }
        } catch (error) {
            console.error("Error loading looking for stands data:", error);
            toast.error("Failed to load looking for stands section data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const success = await saveCustomExhibitionLookingForStands(data);
            if (success) {
                toast.success("Looking for stands section saved successfully!");
            } else {
                toast.error("Failed to save looking for stands section");
            }
        } catch (error) {
            console.error("Error saving looking for stands data:", error);
            toast.error("Failed to save looking for stands section");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (
        field: keyof CustomExhibitionLookingForStands,
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
                        Loading looking for stands section...
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
                                    Looking for Stands Section
                                </h1>
                                <p className="text-gray-600">
                                    Manage the call-to-action section with
                                    contact information
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

                        {/* Phone Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number (for tel: link)
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone_number}
                                    onChange={e =>
                                        handleInputChange(
                                            "phone_number",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., +971543474645"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Format: +countrycode followed by number (no
                                    spaces)
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Display Text
                                </label>
                                <input
                                    type="text"
                                    value={data.phone_display}
                                    onChange={e =>
                                        handleInputChange(
                                            "phone_display",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Call +971 (543) 47-4645"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    This is what users will see on the button
                                </p>
                            </div>
                        </div>

                        {/* CTA Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Call-to-Action Text
                            </label>
                            <input
                                type="text"
                                value={data.cta_text}
                                onChange={e =>
                                    handleInputChange(
                                        "cta_text",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter call-to-action text"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Text that appears next to the phone button
                            </p>
                        </div>

                        {/* Background Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Background Color
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="color"
                                    value={data.background_color}
                                    onChange={e =>
                                        handleInputChange(
                                            "background_color",
                                            e.target.value,
                                        )
                                    }
                                    className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={data.background_color}
                                    onChange={e =>
                                        handleInputChange(
                                            "background_color",
                                            e.target.value,
                                        )
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter hex color code"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Choose the background color for this section
                            </p>
                        </div>
                    </div>

                    {/* Preview */}
                    <div
                        className="mt-8 p-6 rounded-lg"
                        style={{ backgroundColor: data.background_color }}
                    >
                        <h3 className="text-lg font-semibold text-black mb-4">
                            Preview
                        </h3>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">
                                {data.title}
                            </h2>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-black">
                                <div className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md font-semibold shadow-md">
                                    <Phone className="w-4 h-4" />
                                    {data.phone_display}
                                </div>
                                <span className="text-lg">{data.cta_text}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CustomStandLookingForStandsEditor;
