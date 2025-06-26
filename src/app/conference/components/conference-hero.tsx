"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ConferenceHeroSection } from "@/types/conference";
import { useComponentLoading } from "@/hooks/use-minimal-loading";

const ConferenceHero = () => {
    const [heroData, setHeroData] = useState<ConferenceHeroSection | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use minimal loading hook
    useComponentLoading(loading);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                // First, get the hero section data (get the most recent one)
                const { data: heroSections, error: heroError } = await supabase
                    .from("conference_hero_sections")
                    .select("*")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(1);

                if (heroError) {
                    console.error(
                        "Error fetching conference hero data:",
                        heroError,
                    );
                    setError("Failed to load conference hero data");
                    return;
                }

                if (!heroSections || heroSections.length === 0) {
                    console.log("No active conference hero section found");
                    return;
                }

                const heroSection = heroSections[0]; // Get the first (most recent) result

                // If there's a background_image_id, get the active image
                let finalImageUrl = heroSection.background_image_url;

                if (heroSection.background_image_id) {
                    const { data: imageData, error: imageError } =
                        await supabase
                            .from("conference_hero_images")
                            .select("file_path")
                            .eq("id", heroSection.background_image_id)
                            .eq("is_active", true)
                            .single();

                    if (imageData && !imageError) {
                        const { data: publicUrlData } = supabase.storage
                            .from("conference-hero-images")
                            .getPublicUrl(imageData.file_path);
                        finalImageUrl = publicUrlData.publicUrl;
                    }
                } else {
                    // If no background_image_id, check for any active image
                    const { data: activeImage, error: activeImageError } =
                        await supabase
                            .from("conference_hero_images")
                            .select("file_path")
                            .eq("is_active", true)
                            .single();

                    if (activeImage && !activeImageError) {
                        const { data: publicUrlData } = supabase.storage
                            .from("conference-hero-images")
                            .getPublicUrl(activeImage.file_path);
                        finalImageUrl = publicUrlData.publicUrl;
                    }
                }

                setHeroData({
                    ...heroSection,
                    background_image_url: finalImageUrl,
                });

                console.log("Conference hero data loaded:", {
                    heading: heroSection.heading,
                    background_image_url: finalImageUrl,
                    background_image_id: heroSection.background_image_id,
                });
            } catch (err) {
                console.error("Error in fetchHeroData:", err);
                setError("Failed to load conference hero data");
            } finally {
                setLoading(false);
            }
        };

        fetchHeroData();
    }, []);

    // Don't render anything if no data is available
    if (!heroData && !loading) {
        return null;
    }

    // Show loading state
    if (loading || !heroData) {
        return (
            <section className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="container mx-auto px-4 z-10 text-center">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-700 rounded mb-4 mx-auto max-w-2xl"></div>
                        <div className="w-24 h-1 bg-gray-700 mx-auto"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative w-full 2xl:h-[60vh] h-[75vh] flex items-center flex-col justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: heroData.background_image_url
                            ? `url('${heroData.background_image_url}')`
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        backgroundPosition: "center",
                        filter: "brightness(0.5)",
                    }}
                />
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === "development" && (
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
                        Image URL:{" "}
                        {heroData.background_image_url || "No image URL"}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="container flex flex-col md:mt-20 mt-0 justify-center mx-auto px-4 z-10 text-center">
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {heroData.heading}
                </motion.h1>

                <motion.div
                    className="w-24 h-1 bg-[#a5cd39] mx-auto"
                    initial={{ width: 0 }}
                    animate={{ width: 96 }}
                    transition={{ duration: 1, delay: 0.5 }}
                />

                {error && (
                    <motion.div
                        className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-200 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {error}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default ConferenceHero;
