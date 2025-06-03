"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const EventsHero = () => {
    return (
        <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] w-full flex items-center justify-center overflow-hidden">
            {/* Background Image - Dubai World Trade Centre themed */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
                }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 z-5"></div>

            {/* Main Content */}
            <div className="relative z-10 text-center text-white w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="block">Welcome to</span>
                    <span className="block">Dubai World</span>
                    <span className="block">Trade Centre</span>
                </motion.h1>

                <motion.p
                    className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Dubai&apos;s epicentre for events and business in the heart
                    of the city
                </motion.p>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: 5 }}
            >
                <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white animate-bounce" />
            </motion.div>
        </section>
    );
};

export default EventsHero;
