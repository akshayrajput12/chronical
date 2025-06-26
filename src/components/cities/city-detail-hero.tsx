"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CityDetailHeroProps {
    cityName: string;
    heroImage: string;
}

const CityDetailHero = ({ cityName, heroImage }: CityDetailHeroProps) => {
    return (
        <section className="w-full bg-white">
            {/* Full width hero container with background image */}
            <div className="relative w-full 2xl:h-[50vh] h-[65vh] overflow-hidden flex items-center justify-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={heroImage}
                        alt={`Exhibition services in ${cityName}`}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Content - matching the reference image design */}
                <div className="relative z-10 md:mt-20  mt-0 px-4 sm:px-6 md:px-8 lg:px-12 text-center text-white w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-5xl mx-auto">
                            {/* Main Heading - exactly matching the reference image */}
                            <motion.h1
                                className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight uppercase tracking-wide"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                EXHIBITION STAND DESIGN BUILDER <br />
                                IN {cityName.toUpperCase()}, UAE.
                            </motion.h1>

                            {/* Description Text - matching the reference image */}
                            <motion.h3
                                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed font-markazi-text"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                Chronicle Exhibition Organizing LLC is one of
                                the most reputable exhibition stand design
                                manufacturers, and contractors located in{" "}
                                {cityName} offering an exhaustive array of
                                stand-up services for exhibitions. We provide
                                complete display stand solutions, including
                                designing, planning, fabricating and erecting
                                and putting up.
                            </motion.h3>

                            {/* Call-to-Action Button - matching the reference image */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <Button
                                    className="bg-gray-600/80 hover:bg-gray-700/90 text-white px-8 py-3 text-sm font-medium uppercase tracking-wider rounded-none border-0 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                                    size="lg"
                                >
                                    Request For Quotation
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Cities Link */}
            <div className="bg-white py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Link
                                href="/cities"
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium uppercase tracking-wide transition-colors duration-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                BACK TO CITIES
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CityDetailHero;
