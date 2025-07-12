"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EventsHero as EventsHeroType } from "@/types/events";

const EventsHero = () => {
    const [heroData, setHeroData] = useState<EventsHeroType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        try {
            const response = await fetch("/api/events/hero");
            const data = await response.json();

            if (data.hero) {
                setHeroData(data.hero);
            }
        } catch (error) {
            console.error("Error fetching hero data:", error);
            // Use default data on error
            setHeroData({
                id: "default",
                main_heading: "Welcome to Dubai World Trade Centre",
                sub_heading:
                    "Dubai's epicentre for events and business in the heart of the city",
                background_image_url:
                    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                background_overlay_opacity: 0.3,
                background_overlay_color: "#000000",
                text_color: "#ffffff",
                heading_font_size: "responsive",
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="relative h-[75vh] 2xl:h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-gray-900">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-96 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
                </div>
            </section>
        );
    }

    if (!heroData) {
        return null;
    }

    const backgroundStyle = heroData.background_image_url
        ? { backgroundImage: `url('${heroData.background_image_url}')` }
        : { backgroundColor: "#1f2937" }; // Default gray background

    const overlayStyle = {
        backgroundColor: "#000000", // Fixed black overlay
        opacity: 0.3, // Fixed 30% opacity
    };

    return (
        <section className="relative h-[75vh] 2xl:h-[60vh] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={backgroundStyle}
            />

            {/* Overlay */}
            <div className="absolute inset-0" style={overlayStyle} />

            {/* Content */}
            <div
                className="relative z-10 mt-12 flex flex-col justify-center w-full px-4 sm:px-6 md:px-8 lg:px-12 text-center"
                style={{ color: "#ffffff" }}
            >
                <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-rubik font-bold leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {heroData.main_heading}
                </motion.h1>

                {heroData.sub_heading && (
                    <motion.h3
                        className="text-base md:text-lg font-markazi-text opacity-90 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light tracking-wide mt-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ color: "#ffffff" }}
                    >
                        {heroData.sub_heading}
                    </motion.h3>
                )}
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: 5 }}
            >
                <ChevronDown className="w-8 h-8 animate-bounce text-white" />
            </motion.div>
        </section>
    );
};

export default EventsHero;
