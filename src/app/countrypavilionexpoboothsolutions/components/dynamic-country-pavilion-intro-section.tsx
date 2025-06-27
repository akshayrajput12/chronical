"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface ExpoPavilionIntro {
    id: string;
    heading: string;
    paragraph_1: string;
    paragraph_2: string;
    is_active: boolean;
}

const DynamicCountryPavilionIntroSection = () => {
    const [introData, setIntroData] = useState<ExpoPavilionIntro | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        loadIntroData();
    }, []);

    const loadIntroData = async () => {
        try {
            const { data, error } = await supabase
                .from("expo_pavilion_intro")
                .select("*")
                .eq("is_active", true)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error("Error loading intro data:", error);
                return;
            }

            if (data) {
                setIntroData(data);
            }
        } catch (error) {
            console.error("Error loading intro data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Return null if no data is loaded
    if (!introData) {
        return null;
    }

    if (isLoading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-12">
                            <div className="h-8 bg-gray-200 rounded mb-8 animate-pulse"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Heading */}
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide mb-8 text-center">
                            {introData.heading}
                        </h2>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-base leading-relaxed text-justify">
                            {introData.paragraph_1.split('country pavilion expo booth in Dubai').map((part, index, array) => (
                                <React.Fragment key={index}>
                                    {part}
                                    {index < array.length - 1 && (
                                        <span className="text-[#a5cd39] font-medium">
                                            country pavilion expo booth in Dubai
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </p>

                        <p className="text-base leading-relaxed text-justify">
                            {introData.paragraph_2.split('Chronicle Exhibits Dubai').map((part, index, array) => (
                                <React.Fragment key={index}>
                                    {part}
                                    {index < array.length - 1 && (
                                        <span className="text-[#a5cd39] font-medium">
                                            Chronicle Exhibits Dubai
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DynamicCountryPavilionIntroSection;
