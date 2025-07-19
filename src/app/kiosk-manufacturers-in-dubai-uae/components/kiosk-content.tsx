"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { KioskContentSectionWithImageData } from "@/types/kiosk";

const KioskContent = () => {
    const [contentData, setContentData] =
        useState<KioskContentSectionWithImageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadKioskContentData();
    }, []);

    const loadKioskContentData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use the database function to get content data with image
            const { data, error } = await supabase.rpc(
                "get_kiosk_content_section_with_image",
            );

            if (error) {
                console.error("Error fetching kiosk content data:", error);
                setError("Failed to load content section data");
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

                setContentData({
                    ...contentSection,
                    main_image_url: finalImageUrl,
                });
            } else {
                // Fallback to default data if no data found
                setContentData({
                    id: "",
                    first_section_heading: "CUSTOM KIOSK",
                    first_section_content:
                        "When it comes to taking part in trade shows exhibitors are nowadays looking for digital, interactive & cost-efficient solutions to represent their brand. Customer satisfaction is the main concern of every exhibitor for a successful trade show experience. This is why their interest is shifting towards customized, self-service & engaging custom Kiosk manufacturers in Dubai solutions to offer convenience to visitors & address the needs of the customers better.",
                    first_section_highlight_text:
                        "custom Kiosk manufacturers in Dubai",
                    second_section_heading: "WHAT ARE CUSTOM KIOSKS?",
                    second_section_paragraph_1:
                        "Kiosks are non-permanent display booths used for demonstrating information & advertising products offered by different brands or companies. You can easily find them in public areas that are visited by huge mob-like shopping malls, museums, movie theatres, and large-scale trade shows. Kiosks are a brilliant way to develop a strong connection with the visitors at the trade show as they are packed with digital & interactive features.",
                    second_section_paragraph_2:
                        "Custom kiosks are the best as they are manufactured after an analysis of your business purposes & needs, unlike standard kiosks, customized kiosks are cost-effective as you would pay only for things you need. These kiosks have a lasting impact on the visitors & allow them to interact with your brand.",
                    main_image_url:
                        "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop",
                    main_image_alt: "Custom Kiosk Solutions",
                    is_active: true,
                    created_at: "",
                    updated_at: "",
                });
            }
        } catch (error) {
            console.error("Error loading kiosk content data:", error);
            setError("Failed to load content section data");
            // Fallback to default data on error
            setContentData({
                id: "",
                first_section_heading: "CUSTOM KIOSK",
                first_section_content:
                    "When it comes to taking part in trade shows exhibitors are nowadays looking for digital, interactive & cost-efficient solutions to represent their brand. Customer satisfaction is the main concern of every exhibitor for a successful trade show experience. This is why their interest is shifting towards customized, self-service & engaging custom Kiosk manufacturers in Dubai solutions to offer convenience to visitors & address the needs of the customers better.",
                first_section_highlight_text:
                    "custom Kiosk manufacturers in Dubai",
                second_section_heading: "WHAT ARE CUSTOM KIOSKS?",
                second_section_paragraph_1:
                    "Kiosks are non-permanent display booths used for demonstrating information & advertising products offered by different brands or companies. You can easily find them in public areas that are visited by huge mob-like shopping malls, museums, movie theatres, and large-scale trade shows. Kiosks are a brilliant way to develop a strong connection with the visitors at the trade show as they are packed with digital & interactive features.",
                second_section_paragraph_2:
                    "Custom kiosks are the best as they are manufactured after an analysis of your business purposes & needs, unlike standard kiosks, customized kiosks are cost-effective as you would pay only for things you need. These kiosks have a lasting impact on the visitors & allow them to interact with your brand.",
                main_image_url:
                    "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop",
                main_image_alt: "Custom Kiosk Solutions",
                is_active: true,
                created_at: "",
                updated_at: "",
            });
        } finally {
            setLoading(false);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading content...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Show error state with fallback
    if (error && !contentData) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <p className="text-red-600 mb-2">
                            Error loading content section
                        </p>
                        <p className="text-gray-600 text-sm">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    // Don't render if section is not active
    if (!contentData?.is_active) {
        return null;
    }

    // Helper function to render content with highlighted text
    const renderContentWithHighlight = (
        content: string,
        highlightText?: string,
    ) => {
        if (!highlightText) {
            return content;
        }

        const parts = content.split(highlightText);
        return parts.map((part, index) => (
            <span key={index}>
                {part}
                {index < parts.length - 1 && (
                    <span className="font-semibold text-[#a5cd39]">
                        {highlightText}
                    </span>
                )}
            </span>
        ));
    };

    return (
        <>
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* First Section - Dynamic Content */}
                        <div className="mb-16">
                            {/* Section Title */}
                            <motion.div
                                className="text-center mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-4">
                                    {contentData.first_section_heading}
                                </h2>
                                <motion.div
                                    className="w-24 h-1 bg-[#a5cd39] mx-auto"
                                    initial={{ width: 0 }}
                                    animate={{ width: 96 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                className="max-w-4xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <p className="text-gray-700 text-center">
                                    {renderContentWithHighlight(
                                        contentData.first_section_content,
                                        contentData.first_section_highlight_text,
                                    )}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Second Section - Dynamic Content */}
            <section className="bg-gray-100 w-full py-8 md:py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    {/* Section Title */}
                    <div className="max-w-6xl mx-auto">
                    <motion.div
                        className=""
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-rubik font-bold mb-2 text-center md:text-left">
                            {contentData.second_section_heading}
                        </h2>
                        <div className="flex justify-center md:justify-start">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                        </div>
                    </motion.div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                        {/* Left Column - Text */}
                        <motion.div
                            className="flex flex-col justify-start"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                                {contentData.second_section_paragraph_1}
                            </p>
                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                {contentData.second_section_paragraph_2}
                            </p>
                            <button className="bg-[#a5cd39] mt-4 sm:mt-6 text-white px-4 sm:px-6 py-2 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 w-max font-noto-kufi-arabic text-xs sm:text-sm">
                                Request Quotation
                            </button>
                        </motion.div>

                        {/* Right Column - Image */}
                        <motion.div
                            className="relative h-[250px] sm:h-[300px] md:h-[400px] rounded-md overflow-hidden"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {contentData.main_image_url ? (
                                <Image
                                    src={contentData.main_image_url}
                                    alt={
                                        contentData.main_image_alt ||
                                        "Custom Kiosk Solutions"
                                    }
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gray-100">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gray-300 rounded mx-auto mb-2"></div>
                                        <p className="text-gray-500 text-sm">
                                            No image available
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default KioskContent;
