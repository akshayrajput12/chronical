"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    ExpoPavilionPortfolioSection,
    ExpoPavilionPortfolioItem,
} from "@/services/country-pavilion-page.service";

interface PortfolioGridServerProps {
    portfolioSectionData: ExpoPavilionPortfolioSection | null;
    portfolioItemsData: ExpoPavilionPortfolioItem[];
}

const PortfolioGridServer = ({
    portfolioSectionData,
    portfolioItemsData,
}: PortfolioGridServerProps) => {
    // Don't render if no data exists
    if (!portfolioSectionData) {
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
            y: 50,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
            },
        },
    };

    const textVariants = {
        hidden: {
            opacity: 0,
            y: 30,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
            },
        },
    };

    return (
        <div className="relative">
            {/* Background with two sections */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <div className="h-[65%] bg-black/60 w-full" />
                <div className="h-[35%] bg-white w-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-4 max-w-7xl mx-auto pt-12 pb-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        className="text-3xl md:text-4xl font-rubik font-bold text-white mb-4"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {portfolioSectionData.title}
                    </motion.h2>

                    <motion.p
                        className="text-white font-markazi-text! !text-2xl max-w-3xl mx-auto"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {portfolioSectionData.description}
                    </motion.p>
                </div>

                {/* Animated Portfolio Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {portfolioItemsData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="group relative overflow-hidden rounded-lg shadow-lg bg-white"
                            variants={itemVariants}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <div className="relative h-52 overflow-hidden">
                                <Image
                                    src={item.image_url}
                                    alt={item.image_alt || item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Title overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className="text-white font-medium text-lg">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default PortfolioGridServer;
