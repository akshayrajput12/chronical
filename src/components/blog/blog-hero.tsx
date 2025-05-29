"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const BlogHero = () => {
    return (
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
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
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    News & Press Releases
                </motion.h1>
                <motion.p
                    className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto font-light"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Stay up to date with the latest news and press releases.
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                onClick={() => {
                    const blogSection = document.getElementById('blog-posts');
                    blogSection?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                <ChevronDown className="w-8 h-8 animate-bounce hover:text-[#a5cd39] transition-colors" />
            </motion.div>
        </section>
    );
};

export default BlogHero;
