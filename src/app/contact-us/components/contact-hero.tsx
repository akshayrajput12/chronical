"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ContactHero = () => {
    return (
        <section className="relative 2xl:h-[60vh] h-[75vh] flex items-center justify-center overflow-hidden">
            {/* Background Image - Glass/Metal Structure */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
                }}
            />

            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="relative z-10 md:mt-20 mt-0 text-center text-white w-full px-4 sm:px-6 md:px-8 lg:px-12">
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-rubik font-bold mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Contact Us
                </motion.h1>

                <motion.h3
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-markazi-text text-white/90 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Our team is standing by to answer your questions and direct
                    you to the expertise you need for your next event
                </motion.h3>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: 5 }}
            >
                <ChevronDown className="w-8 h-8 text-white animate-bounce" />
            </motion.div>
        </section>
    );
};

export default ContactHero;
