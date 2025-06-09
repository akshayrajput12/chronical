"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { getHeroSection } from "@/services/hero.service";
import { HeroSection as HeroSectionType } from "@/types/hero";

// Static video path
const staticVideoPath = "/videos/hero-background.mp4";

// Default data in case the database fetch fails
const defaultData: HeroSectionType = {
    id: "default",
    heading: "Turn Heads at Your Next Exhibition with Stands That Wow",
    subheading: "Elegant . Functional . Memorable",
    description:
        "Delivering elegance, precision, and premium craftsmanship — Chronicle Exhibition Organizing LLC curates high-end exhibition experiences for elite brands across Dubai and the Middle East.",
    cta_primary_text: "GET STARTED",
    cta_primary_url: "#",
    cta_secondary_text: "LEARN MORE",
    cta_secondary_url: "#",
    typing_texts: [
        { id: "1", text: "Exhibition Stands", display_order: 1 },
        { id: "2", text: "Congress Services", display_order: 2 },
        { id: "3", text: "Kiosk Solutions", display_order: 3 },
        { id: "4", text: "Custom Designs", display_order: 4 },
        { id: "5", text: "Event Management", display_order: 5 },
    ],
};

const HeroSection: React.FC = () => {
    // State for hero data
    const [heroData, setHeroData] = useState<HeroSectionType>(defaultData);
    const [loading, setLoading] = useState(true);
    const [typingIndex, setTypingIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch hero data from the database
    useEffect(() => {
        const fetchHeroData = async () => {
            setLoading(true);
            try {
                const data = await getHeroSection();
                if (data) {
                    setHeroData(data);
                }
            } catch (error) {
                console.error("Error fetching hero data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroData();
    }, []);

    // Get typing texts from hero data
    const typingTexts = heroData.typing_texts.map(item => item.text);

    // Typing animation effect
    useEffect(() => {
        if (typingTexts.length === 0) return;

        const currentText = typingTexts[typingIndex];

        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    setDisplayText(
                        currentText.substring(0, displayText.length + 1),
                    );

                    if (displayText.length === currentText.length) {
                        // Wait before starting to delete
                        setTimeout(() => setIsDeleting(true), 1500);
                    }
                } else {
                    setDisplayText(
                        currentText.substring(0, displayText.length - 1),
                    );

                    if (displayText.length === 0) {
                        setIsDeleting(false);
                        setTypingIndex((typingIndex + 1) % typingTexts.length);
                    }
                }
            },
            isDeleting ? 50 : 100,
        );

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, typingIndex, typingTexts]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin h-12 w-12 border-4 border-[#a5cd39] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <section id="hero" className="relative w-full h-[90vh] overflow-hidden">
            {/* Background Video */}
            <motion.video
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10 }}
                autoPlay
                loop
                muted
                playsInline
                poster="/images/home.jpg"
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src={staticVideoPath} type="video/mp4" />
                Your browser does not support the video tag.
            </motion.video>

            {/* Greyish Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#1a1a1a]/60 z-10" />

            {/* Content */}
            <div className="relative z-20 flex items-center justify-center h-full px-4 text-center text-white pt-16 md:pt-20">
                <motion.div
                    className="max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="overflow-hidden mb-0">
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl font-rubik font-bold whitespace-normal md:whitespace-nowrap leading-tight tracking-tight"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.4,
                                type: "spring",
                                stiffness: 100,
                            }}
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className="inline-block font-rubik"
                            >
                                Launch,
                            </motion.span>{" "}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.7 }}
                                className="inline-block font-rubik"
                            >
                                Grow
                            </motion.span>{" "}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.9 }}
                                className="inline-block font-rubik"
                            >
                                and
                            </motion.span>{" "}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 1.1 }}
                                className="inline-block text-[#a5cd39] font-rubik"
                                whileHover={{ scale: 1.05 }}
                            >
                                Thrive
                            </motion.span>{" "}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 1.3 }}
                                className="inline-block font-rubik"
                            >
                                in the Free Zone
                            </motion.span>
                        </motion.h1>
                    </div>

                    <motion.h2
                        className="text-xl sm:text-2xl font-markazi font-semibold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                    >
                        {heroData.subheading}
                    </motion.h2>

                    <motion.p
                        className="text-base sm:text-lg font-noto-kufi-arabic font-medium pt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        {heroData.description}
                    </motion.p>

                    <motion.div
                        className="mt-8 flex justify-center space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                    >
                        <motion.a
                            href={heroData.cta_primary_url}
                            className="px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base bg-[#a5cd39] text-white font-noto-kufi-arabic font-medium rounded-md hover:bg-[#94b933] transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {heroData.cta_primary_text}
                        </motion.a>

                        <motion.a
                            href={heroData.cta_secondary_url}
                            className="px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base border border-white text-white font-noto-kufi-arabic font-medium rounded-md hover:bg-white/10 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {heroData.cta_secondary_text}
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Down Arrow Button */}
            <motion.div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    delay: 1.4,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            >
                <motion.button
                    onClick={() => {
                        const businessSection =
                            document.getElementById("business-hub");
                        if (businessSection)
                            businessSection.scrollIntoView({
                                behavior: "smooth",
                            });
                    }}
                    className="p-3 rounded-full bg-white/20 hover:bg-white/40 transition duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronDown className="text-white w-6 h-6" />
                </motion.button>
            </motion.div>
        </section>
    );
};

export default HeroSection;
