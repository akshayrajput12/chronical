"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCustomExhibitionLeadingContractor, CustomExhibitionLeadingContractor } from "@/services/custom-exhibition-stands.service";

const LeadingContractorSection = () => {
    const [data, setData] = useState<CustomExhibitionLeadingContractor | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await getCustomExhibitionLeadingContractor();
            setData(result);
        } catch (error) {
            console.error('Error loading leading contractor data:', error);
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
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center animate-pulse">
                            <div className="h-8 bg-gray-300 rounded mb-8 max-w-2xl mx-auto"></div>
                            <div className="space-y-4 max-w-5xl mx-auto">
                                <div className="h-4 bg-gray-300 rounded"></div>
                                <div className="h-4 bg-gray-300 rounded"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            </div>
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
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 uppercase tracking-wide">
                            {data?.title}
                        </h2>

                        <div className="space-y-6 text-gray-700 max-w-5xl mx-auto">
                            <p className="text-base leading-relaxed text-justify">
                                {data?.paragraph_1}
                            </p>

                            <p className="text-base leading-relaxed text-justify">
                                {data?.paragraph_2}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LeadingContractorSection;
