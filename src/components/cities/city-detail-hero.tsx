"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface CityDetailHeroProps {
    title: string;
    subtitle: string;
    heroImage: string;
}

const CityDetailHero = ({
    title,
    subtitle,
    heroImage,
}: CityDetailHeroProps) => {
    return (
        <section className="w-full bg-white">
            {/* Full width hero container with background image */}
            <div className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] overflow-hidden flex items-center justify-center">
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

                {/* Back Button */}
                <motion.div
                    className="absolute top-8 left-8 z-20"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Link
                        href="/cities"
                        className="flex items-center gap-2 text-white hover:text-[#a5cd39] transition-colors duration-300 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-black/30"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Cities</span>
                    </Link>
                </motion.div>

                {/* Content Container */}
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto font-light leading-relaxed tracking-wide"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {subtitle}
                    </motion.p>
                </div>
            </div>
        </section>
    );
};

export default CityDetailHero;
