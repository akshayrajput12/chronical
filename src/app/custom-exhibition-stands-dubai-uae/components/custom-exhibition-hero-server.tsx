"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CustomExhibitionHero } from "@/services/custom-exhibition-stands.service";

interface CustomExhibitionHeroServerProps {
    heroData: CustomExhibitionHero | null;
}

const CustomExhibitionHeroServer = ({ heroData }: CustomExhibitionHeroServerProps) => {
    // Don't render if no data exists
    if (!heroData) {
        return null;
    }

    return (
        <section className="hero relative 2xl:h-[60vh] h-[75vh] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={heroData?.background_image_url || ""}
                    alt={
                        heroData?.background_image_alt ||
                        "Custom Exhibition Stands"
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
            <div className="relative z-10 md:mt-12 mt-0 h-full flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-rubik font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
                                {heroData?.title}
                            </h1>
                            <p className="text-lg sm:text-2xl font-markazi-text font-medium opacity-90 max-w-4xl mx-auto leading-relaxed">
                                {heroData?.subtitle}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomExhibitionHeroServer;
