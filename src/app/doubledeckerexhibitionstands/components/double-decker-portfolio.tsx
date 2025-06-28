"use client";

import React, { useState, useEffect } from "react";
import { Easing, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface PortfolioData {
    section: {
        main_heading: string;
        description: string | null;
        cta_button_text: string;
        cta_button_url: string;
    } | null;
    items: Array<{
        id: string;
        title: string | null;
        description: string | null;
        alt_text: string;
        image_url: string;
        display_order: number;
    }> | null;
}

const DoubleDeckersPortfolio = () => {
    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const loadPortfolioData = async () => {
            try {
                const { data, error } = await supabase.rpc(
                    "get_double_decker_portfolio_data",
                );

                if (error) {
                    console.error("Error loading portfolio data:", error);
                    return;
                }

                if (data) {
                    setPortfolioData(data);
                }
            } catch (error) {
                console.error("Error loading portfolio data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPortfolioData();
    }, [supabase]);

    if (loading) {
        return (
            <div className="relative">
                {/* Split background: top black, bottom white */}
                <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <div className="h-[65%] bg-black w-full" />
                    <div className="h-[35%] bg-white w-full" />
                </div>
                <div className="relative z-10 px-4 max-w-7xl mx-auto pt-12 pb-12">
                    <div className="text-center mb-12">
                        <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="h-52 bg-gray-700 rounded-lg animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!portfolioData || !portfolioData.section) {
        return null;
    }

    // Animation variants (exact same as custom stand)
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
                        {portfolioData.section.main_heading}
                    </motion.h2>
                    <div className="flex justify-center">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                    </div>
                    {portfolioData.section.description && (
                        <motion.span
                            className="text-white font-markazi-text! !text-2xl inline-block max-w-3xl mx-auto"
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {portfolioData.section.description}
                        </motion.span>
                    )}
                </div>

                {/* Animated Portfolio Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {portfolioData.items?.map((item, index) => (
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
                                    alt={item.alt_text}
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
                    <motion.button
                        className="bg-[#a5cd39] text-white px-6 py-1 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 uppercase font-noto-kufi-arabic text-sm"
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => {
                            if (
                                portfolioData.section?.cta_button_url &&
                                portfolioData.section.cta_button_url !== "#"
                            ) {
                                window.open(
                                    portfolioData.section.cta_button_url,
                                    "_blank",
                                );
                            }
                        }}
                    >
                        {portfolioData.section?.cta_button_text}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default DoubleDeckersPortfolio;
