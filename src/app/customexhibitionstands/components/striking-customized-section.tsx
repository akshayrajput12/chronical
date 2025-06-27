"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getCustomExhibitionStrikingCustomized, CustomExhibitionStrikingCustomized } from "@/services/custom-exhibition-stands.service";

const StrikingCustomizedSection = () => {
    const [data, setData] = useState<CustomExhibitionStrikingCustomized | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await getCustomExhibitionStrikingCustomized();
            setData(result);
        } catch (error) {
            console.error('Error loading striking customized data:', error);
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start animate-pulse">
                            <div className="order-1 lg:order-1">
                                <div className="h-64 sm:h-80 md:h-96 lg:h-[400px] bg-gray-300 rounded"></div>
                            </div>
                            <div className="order-2 lg:order-2 space-y-6">
                                <div className="h-8 bg-gray-300 rounded"></div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                                </div>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Left Image with Colored Background */}
                        <motion.div
                            className="order-1 lg:order-1 relative"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div
                                className="absolute -bottom-6 -left-6 w-full h-full z-0"
                                style={{ backgroundColor: "#a5cd39" }}
                            ></div>

                            {/* Image Container */}
                            {data?.image_url && (
                                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                                    <Image
                                        src={data.image_url}
                                        alt={data.image_alt || 'Striking customized exhibition stands'}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                                    />
                                </div>
                            )}
                        </motion.div>

                        {/* Right Content */}
                        <motion.div
                            className="order-2 lg:order-2"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-6">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-wide text-center">
                                    {data?.title}
                                </h3>

                                <div className="space-y-4 text-gray-700">
                                    <p className="text-base leading-relaxed text-justify">
                                        {data?.paragraph_1}
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        {data?.paragraph_2}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StrikingCustomizedSection;
