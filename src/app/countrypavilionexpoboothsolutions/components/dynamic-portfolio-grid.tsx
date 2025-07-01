"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Easing, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface ExpoPavilionPortfolioSection {
    id: string;
    main_heading: string;
    sub_heading: string;
    description: string;
    cta_button_text: string;
    cta_button_url: string;
    is_active: boolean;
}

interface PortfolioItem {
    id: string;
    title: string;
    description?: string;
    image_url: string;
    image_alt: string;
    project_url?: string;
    display_order: number;
    is_featured: boolean;
    is_active: boolean;
}

const DynamicPortfolioGrid = () => {
    const [sectionData, setSectionData] =
        useState<ExpoPavilionPortfolioSection | null>(null);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    const loadData = useCallback(async () => {
        try {
            // Load portfolio section data
            const { data: sectionData, error: sectionError } = await supabase
                .from("expo_pavilion_portfolio_sections")
                .select("*")
                .eq("is_active", true)
                .single();

            if (sectionError && sectionError.code !== "PGRST116") {
                console.error("Error loading section data:", sectionError);
            } else if (sectionData) {
                setSectionData(sectionData);
            }

            // Load portfolio items
            const { data: itemsData, error: itemsError } = await supabase
                .from("expo_pavilion_portfolio_items")
                .select("*")
                .eq("is_active", true)
                .order("display_order")
                .limit(6); // Limit to 6 items to match original design

            if (itemsError) {
                console.error("Error loading portfolio items:", itemsError);
            } else if (itemsData) {
                setPortfolioItems(itemsData);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Return null if no data is loaded
    if (!sectionData) {
        return null;
    }

    // Animation variants (same as original)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94] as Easing | Easing[] | undefined,
            },
        },
    };

    const headerVariants = {
        hidden: {
            opacity: 0,
            y: -30,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut" as Easing | Easing[] | undefined,
            },
        },
    };

    const textVariants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut" as Easing | Easing[] | undefined,
            },
        },
    };

    const buttonVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 0.8,
                ease: "easeOut" as Easing | Easing[] | undefined,
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeInOut" as Easing | Easing[] | undefined,
            },
        },
        tap: {
            scale: 0.95,
        },
    };

    if (isLoading) {
        return (
            <div className="relative">
                <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <div className="h-[65%] bg-gray-200 w-full animate-pulse" />
                    <div className="h-[35%] bg-gray-100 w-full animate-pulse" />
                </div>
                <div className="relative z-10 px-4 max-w-7xl mx-auto pt-12 pb-12">
                    <div className="text-center mb-12">
                        <div className="h-6 bg-gray-300 rounded mb-4 animate-pulse"></div>
                        <div className="h-8 bg-gray-300 rounded mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={`portfolio-skeleton-${index}`}
                                className="h-52 bg-gray-300 rounded-lg animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Split background: top black, bottom white */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <div className="h-[65%] bg-black/60 w-full" />
                <div className="h-[35%] bg-white w-full" />
            </div>
            <div className="relative z-10 px-4 max-w-7xl mx-auto pt-12 pb-12">
                {/* Animated Header Section */}
                <div className="text-center mb-12">
                    <motion.h2
                        className="text-white text-3xl md:text-4xl font-rubik font-bold mb-4"
                        variants={headerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                    >
                        {sectionData.main_heading}
                    </motion.h2>
                    <div className="flex justify-center">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                    </div>

                    <motion.p
                        className="text-white font-markazi-text! !text-2xl max-w-3xl mx-auto"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {sectionData.description}
                    </motion.p>
                </div>

                {/* Animated Portfolio Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {portfolioItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="group"
                            variants={itemVariants}
                        >
                            <motion.div
                                className="relative overflow-hidden rounded-lg border-2 border-gray-600 cursor-pointer bg-white"
                                whileHover={{
                                    scale: 1.02,
                                    borderColor: "#60a5fa",
                                    transition: { duration: 0.3 },
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.img
                                    src={item.image_url}
                                    alt={item.image_alt}
                                    className="w-full h-52 object-cover"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.4 }}
                                />
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0"
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Animated Call to Action */}
                <div className="text-center mt-12">
                    <motion.a
                        href={sectionData.cta_button_url}
                        className="bg-[#a5cd39] text-white px-6 py-1 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 font-noto-kufi-arabic text-sm"
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        {sectionData.cta_button_text}
                    </motion.a>
                </div>
            </div>
        </div>
    );
};

export default DynamicPortfolioGrid;
