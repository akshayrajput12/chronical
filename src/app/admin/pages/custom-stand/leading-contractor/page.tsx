"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
    getCustomExhibitionLeadingContractor,
    saveCustomExhibitionLeadingContractor,
    CustomExhibitionLeadingContractor,
} from "@/services/custom-exhibition-stands.service";

const CustomStandLeadingContractorEditor = () => {
    const [data, setData] = useState<CustomExhibitionLeadingContractor>({
        title: "LEADING CONTRACTOR FOR CUSTOM EXHIBITION STANDS",
        paragraph_1:
            "The ultimate destination for bespoke, eye-catching, and innovative custom exhibition stands in Dubai that catapult your brand presence to new heights. Chronicle Exhibits is the leading provider of customized exhibition solutions in Dubai, we excel in crafting unforgettable experiences that catch the audiences and leave a lasting impression.",
        paragraph_2:
            "At Custom Exhibition Stands, we recognize the uniqueness of every brand and commit ourselves to transforming your vision into reality. Whether you're gearing up for a trade show, conference, or any other event, our team actively collaborate with you to conceive and construct tailor-made exhibition stands that mirror your brand identity and objectives.",
        is_active: true,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await getCustomExhibitionLeadingContractor();
            if (result) {
                setData(result);
            }
        } catch (error) {
            console.error("Error loading leading contractor data:", error);
            toast.error("Failed to load leading contractor section data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const success = await saveCustomExhibitionLeadingContractor(data);
            if (success) {
                toast.success("Leading contractor section saved successfully!");
            } else {
                toast.error("Failed to save leading contractor section");
            }
        } catch (error) {
            console.error("Error saving leading contractor data:", error);
            toast.error("Failed to save leading contractor section");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (
        field: keyof CustomExhibitionLeadingContractor,
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
                        Loading leading contractor section...
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
                                    Leading Contractor Section
                                </h1>
                                <p className="text-gray-600">
                                    Manage the leading contractor introduction
                                    content
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
                            <p className="text-sm text-gray-500 mt-1">
                                This paragraph introduces Chronicle Exhibits as
                                a leading provider.
                            </p>
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
                            <p className="text-sm text-gray-500 mt-1">
                                This paragraph explains the company's commitment
                                to transforming client visions.
                            </p>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Preview
                        </h3>
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide text-center">
                                {data.title}
                            </h2>
                            <div className="space-y-4 text-gray-700 max-w-5xl mx-auto">
                                <p className="text-base leading-relaxed text-justify">
                                    {data.paragraph_1}
                                </p>
                                <p className="text-base leading-relaxed text-justify">
                                    {data.paragraph_2}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CustomStandLeadingContractorEditor;
