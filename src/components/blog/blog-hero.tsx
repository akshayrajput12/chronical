"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const BlogHero = () => {
    return (
        <section className=" hero relative h-[75vh] 2xl:h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Background Image - Modern Architecture */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Modern architecture and glass buildings"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 md:mt-20 text-center text-white px-4 max-w-4xl mx-auto">
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl font-rubik font-bold mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    News & Press Releases
                </motion.h1>
                <motion.h3
                    className="text-lg sm:text-2xl font-markazi-text font-medium mb-8 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed tracking-wide"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Stay up to date with the latest news and press releases.
                </motion.h3>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                onClick={() => {
                    const blogSection = document.getElementById("blog-posts");
                    blogSection?.scrollIntoView({ behavior: "smooth" });
                }}
            >
                <ChevronDown className="w-8 h-8 animate-bounce hover:text-[#a5cd39] transition-colors" />
            </motion.div>
        </section>
    );
};

export default BlogHero;
