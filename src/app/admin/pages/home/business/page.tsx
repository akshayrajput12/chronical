"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, Plus, Trash, BarChart, Info } from "lucide-react";
import { toast } from "sonner";
import {
    getBusinessSection,
    saveBusinessSection,
} from "@/services/business.service";
import { BusinessSectionWithDetails } from "@/types/business";
import { revalidatePathAction } from "@/services/revalidate.action";

const BusinessSectionEditor = () => {
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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    // State for business section data
    const [businessData, setBusinessData] =
        useState<BusinessSectionWithDetails>({
            heading: "A progressive business hub",
            subheading: "where companies can thrive",
            paragraphs: [
                {
                    content:
                        "Dubai World Trade Centre stands at the centre of commerce, laying the foundation for Dubai's ascent as a global hub and future economy enabler. We are your business gateway to the region, and beyond.",
                    display_order: 1,
                },
                {
                    content:
                        "A highly sought-after global business address and a vibrant destination, featuring premium commercial offices, co-working communities, the region's leading exhibition and convention centre, in addition to hospitality and retail options Dubai World Trade Centre is where the world comes to meet and do business.",
                    display_order: 2,
                },
                {
                    content:
                        "With attractive benefits, facilities and tailored services for companies looking to shape the future of business, we offer a well-regulated and supportive environment, empowering startups, SMEs and multinationals to succeed.",
                    display_order: 3,
                },
            ],
        });

    // State for loading, saving, and business section ID
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [businessId, setBusinessId] = useState<string | undefined>(undefined);

    // Fetch business section data on component mount
    useEffect(() => {
        const fetchBusinessData = async () => {
            setLoading(true);
            try {
                const data = await getBusinessSection();
                if (data) {
                    setBusinessId(data.id);
                    setBusinessData({
                        heading: data.heading,
                        subheading: data.subheading,
                        paragraphs: data.paragraphs.map(paragraph => ({
                            content: paragraph.content,
                            display_order: paragraph.display_order,
                        })),
                    });
                }
            } catch (error) {
                console.error("Error fetching business data:", error);
                toast.error("Failed to load business section data");
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessData();
    }, []);

    // Save business section data
    const saveBusinessSectionData = async () => {
        setSaving(true);

        // Validate data before saving
        if (!businessData.heading.trim()) {
            toast.error("Heading cannot be empty");
            setSaving(false);
            return;
        }

        if (businessData.paragraphs.length === 0) {
            toast.error("At least one paragraph is required");
            setSaving(false);
            return;
        }

        try {
            // Save the business section data
            const result = await saveBusinessSection(businessData, businessId);

            if (result.success) {
                if (result.id && !businessId) {
                    setBusinessId(result.id);
                }
                toast.success("Business section saved successfully");
            } else {
                toast.error(
                    `Failed to save: ${result.error || "Unknown error"}`,
                );
            }
        } catch (error) {
            console.error("Error saving business section:", error);
            toast.error("An error occurred while saving");
        } finally {
            revalidatePathAction('/');
            setSaving(false);
        }
    };

    // Handle input changes
    const handleInputChange = (
        field: keyof BusinessSectionWithDetails,
        value: string,
    ) => {
        setBusinessData({
            ...businessData,
            [field]: value,
        });
    };

    // Handle paragraph changes
    const handleParagraphChange = (index: number, value: string) => {
        const updatedParagraphs = [...businessData.paragraphs];
        updatedParagraphs[index] = {
            ...updatedParagraphs[index],
            content: value,
        };
        setBusinessData({
            ...businessData,
            paragraphs: updatedParagraphs,
        });
    };

    // Add new paragraph
    const addParagraph = () => {
        const newOrder =
            businessData.paragraphs.length > 0
                ? Math.max(
                      ...businessData.paragraphs.map(p => p.display_order),
                  ) + 1
                : 1;

        setBusinessData({
            ...businessData,
            paragraphs: [
                ...businessData.paragraphs,
                {
                    content: "New paragraph text here.",
                    display_order: newOrder,
                },
            ],
        });
    };

    // Remove paragraph
    const removeParagraph = (index: number) => {
        const updatedParagraphs = [...businessData.paragraphs];
        updatedParagraphs.splice(index, 1);

        // Reorder the remaining paragraphs
        const reorderedParagraphs = updatedParagraphs.map((paragraph, idx) => ({
            ...paragraph,
            display_order: idx + 1,
        }));

        setBusinessData({
            ...businessData,
            paragraphs: reorderedParagraphs,
        });
    };

    // Show loading state while fetching data
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="animate-spin h-10 w-10 border-4 border-[#a5cd39] border-t-transparent rounded-full"></div>
                <p className="text-gray-600">
                    Loading business section data...
                </p>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
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
                        About the Business Hub Section
                    </h3>
                    <p className="text-blue-600 text-sm">
                        You can edit the heading, subheading, and description
                        paragraphs for the business hub section. All changes
                        will be reflected on the website after saving.
                    </p>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={itemVariants} className="flex justify-end">
                <div className="flex gap-2">
                    <button
                        className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => window.open("/#business-hub", "_blank")}
                    >
                        <Eye size={16} />
                        <span>Preview</span>
                    </button>
                    <button
                        onClick={saveBusinessSectionData}
                        disabled={saving}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-[#a5cd39] rounded-md text-white hover:bg-[#94b933] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Editor Form */}
            <motion.div variants={itemVariants}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    {/* Content Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Content
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Heading
                            </label>
                            <input
                                type="text"
                                value={businessData.heading}
                                onChange={e =>
                                    handleInputChange("heading", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subheading
                            </label>
                            <input
                                type="text"
                                value={businessData.subheading}
                                onChange={e =>
                                    handleInputChange(
                                        "subheading",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description Paragraphs
                                </label>
                                <button
                                    onClick={addParagraph}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                                >
                                    <Plus size={14} />
                                    <span>Add Paragraph</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {businessData.paragraphs.map(
                                    (paragraph, index) => (
                                        <div key={index} className="flex gap-2">
                                            <div className="flex-1 flex gap-2">
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md w-8 text-center self-start mt-2">
                                                    {index + 1}
                                                </span>
                                                <textarea
                                                    value={paragraph.content}
                                                    onChange={e =>
                                                        handleParagraphChange(
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={4}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                                                    placeholder="Enter paragraph text"
                                                />
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeParagraph(index)
                                                }
                                                className="p-2 border border-gray-300 rounded-md text-red-500 hover:bg-red-50 transition-colors self-start"
                                                disabled={
                                                    businessData.paragraphs
                                                        .length <= 1
                                                }
                                                title={
                                                    businessData.paragraphs
                                                        .length <= 1
                                                        ? "At least one paragraph is required"
                                                        : "Remove this paragraph"
                                                }
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Preview Section */}
            <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Preview
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {businessData.heading}
                            </h2>
                            <p className="text-lg text-gray-600">
                                {businessData.subheading}
                            </p>
                            <div className="w-16 h-[3px] bg-[#a5cd39] mt-2"></div>
                        </div>

                        <div className="space-y-4">
                            {businessData.paragraphs.map((paragraph, index) => (
                                <p key={index} className="text-gray-700">
                                    {paragraph.content}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BusinessSectionEditor;
