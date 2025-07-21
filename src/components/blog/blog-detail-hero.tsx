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
        <section className="hero relative h-[75vh] 2xl:h-[60vh] flex items-center justify-center overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 md:mt-20 text-center text-white px-4 max-w-4xl mx-auto">
                {/* Title */}
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl font-rubik font-bold mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {title}
                </motion.h1>

                {/* Metadata */}
                <motion.div
                    className="mb-4 flex flex-wrap justify-center items-center gap-4 text-white/90"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
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

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <ChevronDown className="w-8 h-8 animate-bounce hover:text-[#a5cd39] transition-colors" />
            </motion.div>
        </section>
    );
};

export default BlogDetailHero;
