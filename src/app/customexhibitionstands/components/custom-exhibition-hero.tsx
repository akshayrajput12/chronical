"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getCustomExhibitionHero, type CustomExhibitionHero } from "@/services/custom-exhibition-stands.service";

const CustomExhibitionHero = () => {
    const [heroData, setHeroData] = useState<CustomExhibitionHero | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadHeroData();
    }, []);

    const loadHeroData = async () => {
        try {
            const data = await getCustomExhibitionHero();
            setHeroData(data);
        } catch (error) {
            console.error('Error loading hero data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render if no data exists
    if (!heroData && !isLoading) {
        return null;
    }

    if (isLoading) {
        return (
            <section className="relative 2xl:h-[60vh] h-[75vh] overflow-hidden bg-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-gray-300"></div>
                <div className="relative z-10 h-full flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto text-center">
                            <div className="h-16 bg-gray-400 rounded mb-6"></div>
                            <div className="h-24 bg-gray-400 rounded"></div>
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
                    src={heroData?.background_image_url || ''}
                    alt={heroData?.background_image_alt || 'Custom Exhibition Stands'}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 md:mt-20  mt-0 h-full flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-6 uppercase tracking-wide leading-tight">
                                {heroData?.title}
                            </h1>
                            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-markazi-text tracking-wide">
                                {heroData?.subtitle}
                            </h3>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomExhibitionHero;
