"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useComponentLoading } from "@/hooks/use-minimal-loading";
import type {
    ConferenceManagementSection,
    ConferenceManagementService,
} from "@/types/conference-management-services";

const ConferenceManagementServices = () => {
    const [sectionData, setSectionData] =
        useState<ConferenceManagementSection | null>(null);
    const [services, setServices] = useState<ConferenceManagementService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use minimal loading hook
    useComponentLoading(loading);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch section data (get the most recent one)
                const { data: sections, error: sectionError } = await supabase
                    .from("conference_management_sections")
                    .select("*")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(1);

                if (sectionError) {
                    setError(
                        "Failed to load conference management section data",
                    );
                    return;
                }

                if (sections && sections.length > 0) {
                    const section = sections[0];

                    // If there's a main_image_id, get the active image
                    let finalImageUrl = section.main_image_url;

                    if (section.main_image_id) {
                        const { data: imageData, error: imageError } =
                            await supabase
                                .from("conference_management_images")
                                .select("file_path")
                                .eq("id", section.main_image_id)
                                .eq("is_active", true)
                                .single();

                        if (imageData && !imageError) {
                            const { data: publicUrlData } = supabase.storage
                                .from("conference-management-images")
                                .getPublicUrl(imageData.file_path);
                            finalImageUrl = publicUrlData.publicUrl;
                        }
                    }

                    setSectionData({
                        ...section,
                        main_image_url: finalImageUrl,
                    });
                }

                // Fetch services data
                const { data: servicesData, error: servicesError } =
                    await supabase
                        .from("conference_management_services")
                        .select("*")
                        .eq("is_active", true)
                        .order("display_order", { ascending: true });

                if (servicesError) {
                    setError("Failed to load conference management services");
                    return;
                }

                if (servicesData) {
                    setServices(servicesData);
                }
            } catch (err) {
                setError("Failed to load conference management data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Don't render anything if no data is available
    if (!sectionData && !loading) {
        return null;
    }

    // Show loading state
    if (loading || !sectionData) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 rounded mb-4 mx-auto max-w-2xl"></div>
                            <div className="h-4 bg-gray-300 rounded mb-8 mx-auto max-w-4xl"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="h-6 bg-gray-300 rounded"></div>
                                        <div className="h-4 bg-gray-300 rounded"></div>
                                        <div className="h-4 bg-gray-300 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl text-center md:text-4xl font-rubik font-bold mb-2">
                            {sectionData.main_heading}
                        </h2>
                        <div className="flex justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                        </div>
                        <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
                            {sectionData.main_description}
                        </p>
                    </motion.div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                className="bg-gray-50 p-8 text-left border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-xl !font-bold mb-6 tracking-wide text-[#a5cd39]">
                                    {service.title}
                                </h3>
                                <p className="text-gray-700 text-base leading-relaxed">
                                    {service.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

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
    );
};

export default ConferenceManagementServices;
