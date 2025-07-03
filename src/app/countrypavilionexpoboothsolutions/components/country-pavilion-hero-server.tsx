"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExpoPavilionHero } from "@/services/country-pavilion-page.service";

interface CountryPavilionHeroServerProps {
    heroData: ExpoPavilionHero | null;
}

const CountryPavilionHeroServer = ({ heroData }: CountryPavilionHeroServerProps) => {
    // Don't render if no data exists
    if (!heroData) {
        return null;
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
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-wide">
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

export default CountryPavilionHeroServer;
