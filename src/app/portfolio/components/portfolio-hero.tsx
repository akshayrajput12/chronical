"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AboutHeroSectionData } from "@/types/about";

interface PortfolioHeroProps {
    heroData: AboutHeroSectionData | null;
}

const PortfolioHero: React.FC<PortfolioHeroProps> = ({ heroData }) => {
    // Default fallback data for portfolio hero
    const defaultHeroData: AboutHeroSectionData = {
        id: "",
        hero_heading: "Portfolio",
        hero_subheading:
            "Explore our stunning collection of exhibition stands and trade show designs that showcase our creativity and expertise.",
        background_image_id: undefined,
        background_image_url: undefined,
        background_image_alt: undefined,
        fallback_image_url:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        overlay_opacity: 0.3,
        overlay_color: "black",
        text_color: "white",
        height_class: "h-[60vh]",
        show_scroll_indicator: true,
        is_active: true,
        created_at: "",
        updated_at: "",
    };

    // Use provided data or fallback to default
    const displayData = heroData || defaultHeroData;

    // Don't render if section is not active
    if (!displayData.is_active) {
        return null;
    }

    // Determine background image URL
    const backgroundImageUrl =
        displayData.background_image_url || displayData.fallback_image_url;

    return (
        <section
            className={`relative h-[59vh] 2xl:h-[49vh] flex items-center justify-center overflow-hidden`}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('${backgroundImageUrl}')`,
                }}
            />

            {/* Dynamic Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: displayData.overlay_color,
                    opacity: displayData.overlay_opacity,
                }}
            />

            {/* Content */}
            <div
                className="relative z-10 text-center w-full mt-16 px-4 sm:px-6 md:px-8 lg:px-12"
                style={{ color: displayData.text_color }}
            >
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-rubik font-bold mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {displayData.hero_heading}
                </motion.h1>

                <motion.h3
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-markazi-text max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light tracking-wide opacity-90"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {displayData.hero_subheading}
                </motion.h3>
            </div>

            {/* Scroll Down Indicator */}
            {displayData.show_scroll_indicator && (
                <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    whileHover={{ y: 5 }}
                >
                    <ChevronDown
                        className="w-8 h-8 animate-bounce"
                        style={{ color: displayData.text_color }}
                    />
                </motion.div>
            )}
        </section>
    );
};

export default PortfolioHero;
