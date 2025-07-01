"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { getCustomExhibitionLookingForStands, CustomExhibitionLookingForStands } from "@/services/custom-exhibition-stands.service";

const LookingForStandsSection = () => {
    const [data, setData] = useState<CustomExhibitionLookingForStands | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await getCustomExhibitionLookingForStands();
            setData(result);
        } catch (error) {
            console.error('Error loading looking for stands data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render if no data exists
    if (!data && !isLoading) {
        return null;
    }

    if (isLoading) {
        return (
            <section
                className="py-8 md:py-12 lg:py-16"
                style={{ backgroundColor: "#a5cd39" }}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center animate-pulse">
                        <div className="h-8 bg-black/20 rounded mb-6 max-w-md mx-auto"></div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="h-12 bg-white/50 rounded w-48"></div>
                            <div className="h-6 bg-black/20 rounded w-32"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="py-8 md:py-12 lg:py-16"
            style={{ backgroundColor: data?.background_color || '#a5cd39' }}
        >
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-wide">
                            {data?.title}
                        </h2>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-black">
                            <motion.a
                                href={`tel:${data?.phone_number}`}
                                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Phone className="w-4 h-4" />
                                {data?.phone_display}
                            </motion.a>

                            <span className="text-lg">
                                {data?.cta_text}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LookingForStandsSection;
