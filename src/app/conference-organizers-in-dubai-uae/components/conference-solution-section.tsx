"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useComponentLoading } from "@/hooks/use-minimal-loading";
import type { ConferenceSolutionSection } from "@/types/conference-solution-section";

const ConferenceSolutionSection = () => {
    const [sectionData, setSectionData] =
        useState<ConferenceSolutionSection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use minimal loading hook
    useComponentLoading(loading);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch section data (get the most recent one)
                const { data: sections, error: sectionError } = await supabase
                    .from("conference_solution_sections")
                    .select("*")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(1);

                if (sectionError) {
                    setError("Failed to load conference solution section data");
                    return;
                }

                if (sections && sections.length > 0) {
                    const section = sections[0];

                    // If there's a main_image_id, get the active image
                    let finalImageUrl = section.main_image_url;

                    if (section.main_image_id) {
                        const { data: imageData, error: imageError } =
                            await supabase
                                .from("conference_solution_images")
                                .select("file_path")
                                .eq("id", section.main_image_id)
                                .eq("is_active", true)
                                .single();

                        if (imageData && !imageError) {
                            const { data: publicUrlData } = supabase.storage
                                .from("conference-solution-section-images")
                                .getPublicUrl(imageData.file_path);
                            finalImageUrl = publicUrlData.publicUrl;
                        }
                    }

                    setSectionData({
                        ...section,
                        main_image_url: finalImageUrl,
                    });
                }
            } catch (err) {
                setError("Failed to load conference solution section data");
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
            <section
                className="py-8 md:py-12 lg:py-16"
                style={{ backgroundColor: "#a5cd39" }}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center animate-pulse">
                            <div className="h-8 bg-black/20 rounded mb-6 max-w-md mx-auto"></div>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <div className="h-12 bg-black/20 rounded-lg w-48"></div>
                                <div className="h-6 bg-black/20 rounded w-40"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section
            className="py-8 md:py-12 lg:py-16"
            style={{ backgroundColor: sectionData.background_color }}
        >
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 tracking-wide">
                            {sectionData.main_heading}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <div className="bg-black text-white px-6 py-3 rounded-lg inline-block">
                                <span className="text-base sm:text-lg font-semibold">
                                    Call {sectionData.phone_number}
                                </span>
                            </div>
                            <span className="text-black text-base sm:text-lg">
                                {sectionData.call_to_action_text}
                            </span>
                        </div>
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
    );
};

export default ConferenceSolutionSection;
