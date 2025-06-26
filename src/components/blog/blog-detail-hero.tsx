"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ChevronDown, Eye, User } from "lucide-react";
import { BlogTag } from "@/types/blog";

interface BlogDetailHeroProps {
    title: string;
    subtitle?: string;
    date: string;
    heroImage?: string;
    category?: {
        name: string;
        color: string;
        slug: string;
    };
    tags?: BlogTag[];
    viewCount?: number;
    author?: string;
}

const BlogDetailHero = ({
    title,
    subtitle,
    date,
    heroImage,
    category,
    tags = [],
    viewCount = 0,
    author,
}: BlogDetailHeroProps) => {
    // Default hero image if none provided
    const defaultHeroImage =
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80";
    return (
        <section className="w-full bg-white">
            {/* Full width hero container with background image */}
            <div className="relative w-full 2xl:h-[50vh] h-[65vh] overflow-hidden flex items-center justify-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={heroImage || defaultHeroImage}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 text-center text-white w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-4xl mx-auto">


                            {/* Title */}
                            <motion.h1
                                className="text-3xl md:mt-12  mt-0 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                {title}
                            </motion.h1>

                            {/* Metadata */}
                            <motion.div
                                className="mb-4 flex flex-wrap justify-center items-center gap-4 text-white/90"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm sm:text-base">
                                        {date}
                                    </span>
                                </div>
                                {viewCount > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span className="text-sm sm:text-base">
                                            {viewCount} views
                                        </span>
                                    </div>
                                )}
                                {author && (
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span className="text-sm sm:text-base">
                                            {author}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
                {/* Scroll Down Indicator */}
                <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 cursor-pointer"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    whileHover={{ y: 5 }}
                >
                    <ChevronDown className="w-8 h-8 text-white animate-bounce" />
                </motion.div>
            </div>

            {/* Back to News Link - Outside the hero container */}
            <div className="bg-white py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium uppercase tracking-wide transition-colors duration-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                BACK TO OUR NEWS
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogDetailHero;
