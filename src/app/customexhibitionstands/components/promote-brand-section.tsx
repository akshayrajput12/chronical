"use client";

import React, { useState, useEffect } from "react";
import {
    AnimationGeneratorType,
    Easing,
    motion,
    Variants,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    getCustomExhibitionPromoteBrand,
    CustomExhibitionPromoteBrand,
} from "@/services/custom-exhibition-stands.service";

const PromoteBrandSection = () => {
    const [data, setData] = useState<CustomExhibitionPromoteBrand | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await getCustomExhibitionPromoteBrand();
            setData(result);
        } catch (error) {
            console.error("Error loading promote brand data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const buttonVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as Easing | Easing[] | undefined,
                delay: 0.2,
            },
        },
        hover: {
            scale: 1.05,
            backgroundColor: "#8aaa30",
            boxShadow: "0px 5px 15px rgba(165,205,57,0.4)",
            transition: {
                duration: 0.3,
                type: "spring" as AnimationGeneratorType | undefined,
                stiffness: 300,
            },
        },
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
                            <div className="order-2 lg:order-1 space-y-6">
                                <div className="h-8 bg-gray-300 rounded"></div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                                </div>
                                <div className="h-10 bg-gray-300 rounded w-32"></div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="h-64 sm:h-80 md:h-96 lg:h-[400px] bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Left Content */}
                        <motion.div
                            className="order-2 lg:order-1"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-6">
                                <h3 className="!text-3xl md:!text-4xl !font-rubik text-center !font-bold mb-2">
                                    {data?.title}
                                </h3>
                                <div className="flex !mb-3 justify-center">
                                    <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-0"></div>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <p className="text-base leading-relaxed text-justify">
                                        {data?.paragraph_1}
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        {data?.paragraph_2}
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        {data?.paragraph_3}
                                    </p>
                                    <Link href={data?.cta_url || "#"}>
                                        <motion.button
                                            className="bg-[#a5cd39] text-white px-6 py-2 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 uppercase font-noto-kufi-arabic text-sm"
                                            variants={buttonVariants}
                                            whileHover="hover"
                                        >
                                            {data?.cta_text}
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Image with Colored Background */}
                        <motion.div
                            className="order-1 lg:order-2 relative"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* Image Container */}
                            {data?.image_url && (
                                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                                    <Image
                                        src={data.image_url}
                                        alt={
                                            data.image_alt ||
                                            "Promote your brand exhibition stand"
                                        }
                                        fill
                                        className="object-cover rounded-lg"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                                    />
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoteBrandSection;
