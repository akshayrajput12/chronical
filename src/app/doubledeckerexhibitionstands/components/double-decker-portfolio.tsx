"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const loadPortfolioData = async () => {
            try {
                const { data, error } = await supabase.rpc('get_double_decker_portfolio_data');
                
                if (error) {
                    console.error('Error loading portfolio data:', error);
                    return;
                }

                if (data) {
                    setPortfolioData(data);
                }
            } catch (error) {
                console.error('Error loading portfolio data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPortfolioData();
    }, [supabase]);

    if (loading) {
        return (
            <div className="bg-gray-900 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto animate-pulse"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="h-52 bg-gray-700 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!portfolioData || !portfolioData.section) {
        return null;
    }

    // Animation variants
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
            y: 30,
        },
        visible: {
            opacity: 1,
            y: 0,
        },
    };

    const headerVariants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
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
        },
        hover: {
            scale: 1.05,
        },
        tap: {
            scale: 0.95,
        },
    };

    return (
        <div className="bg-gray-900 py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Animated Header Section */}
                    <div className="text-center mb-12">
                        <motion.h2
                            className="text-[#a5cd39] text-xl font-semibold tracking-wider mb-4"
                            variants={headerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            PORTFOLIO
                        </motion.h2>

                        <motion.h1
                            className="text-white text-3xl md:text-4xl font-bold mb-4"
                            variants={headerVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.1 }}
                        >
                            {portfolioData.section.main_heading}
                        </motion.h1>

                        {portfolioData.section.description && (
                            <motion.p
                                className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed"
                                variants={headerVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.2 }}
                            >
                                {portfolioData.section.description}
                            </motion.p>
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
                                    {item.title && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0"
                                            whileHover={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                                            {item.description && (
                                                <p className="text-xs text-gray-300">{item.description}</p>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Animated Call to Action */}
                    <div className="text-center mt-12">
                        <motion.a
                            href={portfolioData.section.cta_button_url}
                            className="inline-block bg-[#a5cd39] text-white px-8 py-3 rounded-lg font-semibold shadow-lg"
                            variants={buttonVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            {portfolioData.section.cta_button_text}
                        </motion.a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoubleDeckersPortfolio;
