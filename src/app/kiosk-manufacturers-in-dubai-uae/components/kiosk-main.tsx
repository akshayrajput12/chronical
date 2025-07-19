"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { KioskHeroSectionWithImageData } from "@/types/kiosk";

const KioskMain = () => {
    const [heroData, setHeroData] =
        useState<KioskHeroSectionWithImageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadKioskHeroData();
    }, []);

    const loadKioskHeroData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use the database function to get hero data with image
            const { data, error } = await supabase.rpc(
                "get_kiosk_hero_section_with_image",
            );

            if (error) {
                console.error("Error fetching kiosk hero data:", error);
                setError("Failed to load hero section data");
                return;
            }

            if (data && data.length > 0) {
                const heroSection = data[0];

                // If there's an active image, get its public URL
                let finalImageUrl = heroSection.background_image_url;
                if (heroSection.image_file_path) {
                    const { data: imageData } = supabase.storage
                        .from("kiosk-hero-images")
                        .getPublicUrl(heroSection.image_file_path);
                    finalImageUrl = imageData.publicUrl;
                }

                setHeroData({
                    ...heroSection,
                    background_image_url: finalImageUrl,
                });
            } else {
                // Fallback to default data if no data found
                setHeroData({
                    id: "",
                    heading: "KIOSK MANUFACTURERS IN DUBAI",
                    background_image_url:
                        "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2069&auto=format&fit=crop",
                    is_active: true,
                    created_at: "",
                    updated_at: "",
                });
            }
        } catch (error) {
            console.error("Error loading kiosk hero data:", error);
            setError("Failed to load hero section data");
            // Fallback to default data on error
            setHeroData({
                id: "",
                heading: "KIOSK MANUFACTURERS IN DUBAI",
                background_image_url:
                    "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2069&auto=format&fit=crop",
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
            <section className="relative w-full h-[75vh] 2xl:h-[60vh] flex items-center justify-center overflow-hidden bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </section>
        );
    }

    // Show error state with fallback
    if (error && !heroData) {
        return (
            <section className="relative w-full h-[75vh] 2xl:h-[60vh] flex items-center justify-center overflow-hidden bg-gray-100">
                <div className="text-center">
                    <p className="text-red-600 mb-2">
                        Error loading hero section
                    </p>
                    <p className="text-gray-600 text-sm">{error}</p>
                </div>
            </section>
        );
    }

    // Don't render if section is not active
    if (!heroData?.is_active) {
        return null;
    }

    return (
        <section className="relative w-full h-[75vh] 2xl:h-[60vh] flex items-center justify-center overflow-hidden">
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
            </div>

            {/* Content */}
            <div className="container md:mt-20 mt-0 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10 text-center">
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {heroData.heading}
                </motion.h1>
            </div>
        </section>
    );
};

export default KioskMain;
