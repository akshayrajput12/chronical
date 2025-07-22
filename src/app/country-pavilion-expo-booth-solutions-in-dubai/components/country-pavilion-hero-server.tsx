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
        <section className="hero relative 2xl:h-[60vh] h-[75vh] overflow-hidden">
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
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-rubik font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
                                {heroData.title}
                            </h1>
                            <p className="text-lg sm:text-2xl font-markazi-text font-medium max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
                                {heroData.subtitle}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CountryPavilionHeroServer;
