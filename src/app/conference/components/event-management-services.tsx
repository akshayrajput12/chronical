"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useComponentLoading } from "@/hooks/use-minimal-loading";
import type { EventManagementSection } from "@/types/event-management-services";

const EventManagementServices = () => {
    const [sectionData, setSectionData] =
        useState<EventManagementSection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use minimal loading hook
    useComponentLoading(loading);

    useEffect(() => {
        const fetchSectionData = async () => {
            try {
                // First, get the section data (get the most recent one)
                const { data: sections, error: sectionError } = await supabase
                    .from("event_management_sections")
                    .select("*")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(1);

                if (sectionError) {
                    console.error(
                        "Error fetching event management section data:",
                        sectionError,
                    );
                    setError("Failed to load event management section data");
                    return;
                }

                if (!sections || sections.length === 0) {
                    return;
                }

                const section = sections[0]; // Get the first (most recent) result

                // If there's a main_image_id, get the active image
                let finalImageUrl = section.main_image_url;

                if (section.main_image_id) {
                    const { data: imageData, error: imageError } =
                        await supabase
                            .from("event_management_images")
                            .select("file_path")
                            .eq("id", section.main_image_id)
                            .eq("is_active", true)
                            .single();

                    if (imageData && !imageError) {
                        const { data: publicUrlData } = supabase.storage
                            .from("event-management-images")
                            .getPublicUrl(imageData.file_path);
                        finalImageUrl = publicUrlData.publicUrl;
                    }
                } else {
                    // If no main_image_id, check for any active image
                    const { data: activeImage, error: activeImageError } =
                        await supabase
                            .from("event_management_images")
                            .select("file_path")
                            .eq("is_active", true)
                            .single();

                    if (activeImage && !activeImageError) {
                        const { data: publicUrlData } = supabase.storage
                            .from("event-management-images")
                            .getPublicUrl(activeImage.file_path);
                        finalImageUrl = publicUrlData.publicUrl;
                    }
                }

                setSectionData({
                    ...section,
                    main_image_url: finalImageUrl,
                });
            } catch (err) {
                console.error("Error in fetchSectionData:", err);
                setError("Failed to load event management section data");
            } finally {
                setLoading(false);
            }
        };

        fetchSectionData();
    }, []);

    // Don't render anything if no data is available
    if (!sectionData && !loading) {
        return null;
    }

    // Show loading state
    if (loading || !sectionData) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 rounded mb-4 mx-auto max-w-2xl"></div>
                            <div className="h-4 bg-gray-300 rounded mb-8 mx-auto max-w-4xl"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                <div className="space-y-4">
                                    <div className="h-6 bg-gray-300 rounded"></div>
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </div>
                                <div className="h-64 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Top Section - EVENT MANAGEMENT SERVICES IN DUBAI, UAE */}
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-2">
                                {sectionData.main_heading}
                            </h2>
                            <div className="flex justify-center">
                                <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                            </div>
                            <p className="text-base text-gray-700 leading-relaxed text-justify max-w-4xl mx-auto">
                                {sectionData.main_description}
                            </p>
                        </motion.div>

                        {error && (
                            <motion.div
                                className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>
            {/* Bottom Section - Two Column Layout */}
            <section className="py-20 bg-gray-100 overflow-hidden relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto lg:gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        className="order-2 lg:order-1"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl text-center font-rubik font-bold mb-2">
                                {sectionData.secondary_heading}
                            </h2>
                            <div className="flex !mb-0 justify-center">
                                <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                            </div>
                            <div className="space-y-4 text-gray-700">
                                <p className="text-base leading-relaxed text-justify">
                                    {sectionData.first_paragraph}
                                </p>

                                <p className="text-base leading-relaxed text-justify">
                                    {sectionData.second_paragraph}
                                </p>
                            </div>
                            <button className="bg-[#a5cd39] mt-4 text-white px-6 py-2 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 uppercase w-max font-noto-kufi-arabic text-sm">
                                Request Quotation
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Image with Colored Background */}
                    <motion.div
                        className="order-1 lg:order-2 relative"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Image Container */}
                        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                            <Image
                                src={
                                    sectionData.main_image_url ||
                                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                }
                                alt={sectionData.main_image_alt}
                                fill
                                className="object-cover rounded-lg"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default EventManagementServices;
