"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ContactHeroSection } from "@/types/contact";
import { contactPageService } from "@/lib/services/contact";

const ContactHero = () => {
    const [heroData, setHeroData] = useState<ContactHeroSection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const data = await contactPageService.getHeroSection();
                setHeroData(data);
            } catch (error) {
                console.error("Error fetching hero data:", error);
                setError("Failed to load page content. Please refresh the page.");
                setHeroData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroData();
    }, []);

    if (loading) {
        return (
            <section className="relative 2xl:h-[60vh] h-[75vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4">Loading...</p>
                </div>
            </section>
        );
    }

    if (error || !heroData) {
        return (
            <section className="relative 2xl:h-[60vh] h-[75vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="text-white text-center">
                    <p className="text-red-400 mb-4">{error || "Failed to load page content"}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#a5cd39] hover:bg-[#8fb32a] text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="relative 2xl:h-[60vh] h-[75vh] flex items-center justify-center overflow-hidden">
            {/* Background Image - Dynamic */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('${heroData.background_image_url}')`,
                }}
            />

            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content - Dynamic */}
            <div className="relative z-10 md:mt-20 mt-0 text-center text-white w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-rubik font-bold mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {heroData.title}
                </motion.h1>

                <motion.h3
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-markazi-text text-white/90 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {heroData.subtitle}
                </motion.h3>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: 5 }}
            >
                <ChevronDown className="w-8 h-8 text-white animate-bounce" />
            </motion.div>
        </section>
    );
};

export default ContactHero;
