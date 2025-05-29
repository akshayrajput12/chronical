"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface BlogDetailHeroProps {
    title: string;
    subtitle: string;
    date: string;
    heroImage: string;
}

const BlogDetailHero = ({ title, subtitle, date, heroImage }: BlogDetailHeroProps) => {
    return (
        <section className="w-full bg-white">
            {/* Full width hero container with background image */}
            <div className="relative w-full overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={heroImage}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Press Release Label */}
                            <motion.div
                                className="mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-wider px-4 py-2 rounded-full border border-white/30">
                                    Press Release
                                </span>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                className="text-white font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal leading-tight mb-8"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                {title}
                            </motion.h1>

                            {/* Date */}
                            <motion.div
                                className="mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <span className="text-white/90 text-sm font-medium uppercase tracking-wider">
                                    {date}
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to News Link - Outside the hero container */}
            <div className="bg-white py-8 md:py-12">
                <div className="w-full px-24 md:px-32 lg:px-48">
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

            {/* Subtitle Section */}
            <div className="bg-white pb-8 md:pb-12">
                <div className="w-full px-24 md:px-32 lg:px-48">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <h2 className="text-gray-800 font-serif text-xl md:text-2xl lg:text-3xl font-normal leading-relaxed text-center">
                            {subtitle}
                        </h2>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BlogDetailHero;
