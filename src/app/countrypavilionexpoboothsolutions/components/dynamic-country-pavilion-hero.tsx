"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ExpoPavilionHero {
    id: string;
    title: string;
    subtitle: string;
    background_image_url: string;
    background_image_alt: string;
    is_active: boolean;
}

const DynamicCountryPavilionHero = () => {
    const [heroData, setHeroData] = useState<ExpoPavilionHero | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    const loadHeroData = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("expo_pavilion_hero")
                .select("*")
                .eq("is_active", true)
                .single();

            if (error && error.code !== "PGRST116") {
                console.error("Error loading hero data:", error);
                return;
            }

            if (data) {
                setHeroData(data);
            }
        } catch (error) {
            console.error("Error loading hero data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadHeroData();
    }, [loadHeroData]);

    // Return null if no data is loaded
    if (!heroData) {
        return null;
    }

    if (isLoading) {
        return (
            <section className="relative 2xl:h-[60vh] h-[75vh] overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                <div className="relative z-10 h-full flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto text-center">
                            <div className="h-8 bg-gray-300 rounded mb-6 animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded mb-4 animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative 2xl:h-[60vh] h-[75vh] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={heroData.background_image_url}
                    alt={heroData.background_image_alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative md:mt-12 mt-0 z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase tracking-wide">
                                {heroData.title}
                            </h1>
                            <h3 className="text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-markazi-text tracking-wide">
                                {heroData.subtitle}
                            </h3>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DynamicCountryPavilionHero;
