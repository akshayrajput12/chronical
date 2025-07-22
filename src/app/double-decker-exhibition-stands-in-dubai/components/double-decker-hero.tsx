"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface HeroData {
    main_heading: string;
    description: string;
    background_image_url: string | null;
    background_image_alt: string | null;
}

const DoubleDeckerHero = () => {
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const loadHeroData = async () => {
            try {
                const { data, error } = await supabase.rpc(
                    "get_double_decker_hero_section",
                );

                if (error) {
                    console.error("Error loading hero data:", error);
                    return;
                }

                if (data) {
                    setHeroData(data);
                }
            } catch (error) {
                console.error("Error loading hero data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadHeroData();
    }, [supabase]);

    if (loading) {
        return (
            <section className="relative 2xl:h-[60vh] h-[75vh] overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            </section>
        );
    }

    if (!heroData) {
        return null;
    }

    return (
        <section className="hero relative 2xl:h-[60vh] h-[75vh] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={
                        heroData.background_image_url ||
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    }
                    alt={
                        heroData.background_image_alt ||
                        "Double Decker Exhibition Stands"
                    }
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative mt-0 md:mt-12 z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-rubik font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
                                {heroData.main_heading}
                            </h1>
                            <p className="text-lg sm:text-2xl font-markazi-text font-medium max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
                                {heroData.description} Make the most of your
                                space, and do not compromise in design. Impress
                                your guests during trade shows and special
                                events by incorporating these.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoubleDeckerHero;
