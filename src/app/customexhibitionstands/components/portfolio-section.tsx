"use client";

import React, { useState, useEffect } from "react";
import { Easing, motion } from "framer-motion";
import {
    getCustomExhibitionPortfolioData,
    type CustomExhibitionPortfolioData,
} from "@/services/custom-exhibition-portfolio.service";

const PortfolioSection = () => {
    const [portfolioData, setPortfolioData] =
        useState<CustomExhibitionPortfolioData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPortfolioData();
    }, []);

    const loadPortfolioData = async () => {
        try {
            const data = await getCustomExhibitionPortfolioData();
            setPortfolioData(data);
        } catch (error) {
            console.error("Error loading portfolio data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render if no data exists and not loading
    if (!portfolioData?.section && !isLoading) {
        return null;
    }

    // Use database data or fallback to defaults
    const sectionTitle = portfolioData?.section?.section_title || "PORTFOLIO";
    const mainTitle = portfolioData?.section?.main_title || "OUR RECENT WORK";
    const description =
        portfolioData?.section?.description ||
        "Check out our portfolio for the success stories of brands that trusted us as their custom exhibition stand contractor. Our recent work includes a diverse range of custom stand designs.";
    const ctaText = portfolioData?.section?.cta_text || "View All Projects";
    const ctaUrl = portfolioData?.section?.cta_url || "#";

    // Use portfolio images from database or fallback to sample images
    const portfolioImages =
        portfolioData?.items && portfolioData.items.length > 0
            ? portfolioData.items.map(item => item.image_url).slice(0, 6)
            : [
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s",
              ];

    // Animation variants (exact same as original)
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
                        {mainTitle}
                    </motion.h2>
                    <div className="flex justify-center">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                    </div>

                    <motion.span
                        className="text-white font-markazi-text! !text-2xl inline-block max-w-3xl mx-auto"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {description}
                    </motion.span>
                </div>

                {/* Animated Portfolio Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {portfolioImages.map((image, index) => (
                        <motion.div
                            key={index}
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
                                    src={image}
                                    alt={`Portfolio item ${index + 1}`}
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
                            if (ctaUrl && ctaUrl !== "#") {
                                window.open(ctaUrl, "_blank");
                            }
                        }}
                    >
                        {ctaText}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default PortfolioSection;
