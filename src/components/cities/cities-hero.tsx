"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const CitiesHero = () => {
    return (
        <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image - Modern Architecture */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Global cities and locations"
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
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Our Global Locations
                </motion.h1>
                <motion.p
                    className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto font-light leading-relaxed tracking-wide"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Discover our presence across the Middle East and beyond, delivering exceptional exhibition solutions worldwide.
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                onClick={() => {
                    const citiesSection = document.getElementById('cities-grid');
                    citiesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                <ChevronDown className="w-8 h-8 animate-bounce hover:text-[#a5cd39] transition-colors" />
            </motion.div>
        </section>
    );
};

export default CitiesHero;
