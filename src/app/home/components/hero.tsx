"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { getHeroSection } from "@/services/hero.service";
import { AnimationGeneratorType, Variants } from "framer-motion";
import { HeroSection as HeroSectionType } from "@/types/hero";
import { useComponentLoading } from "@/hooks/use-minimal-loading";

// Static video path
const staticVideoPath = "/videos/hero-background.mp4";

// Default data in case the database fetch fails
const defaultData: HeroSectionType = {
    id: "default",
    heading: "Turn Heads at Your Next Exhibition with Stands",
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

    // Use minimal loader for this component - won't block the entire screen
    useComponentLoading(loading, "Loading hero section...");

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

    // Show default content while loading - minimal loader will show in corner
    // This prevents blank screens during data loading

    return (
        <section id="hero" className="relative w-full h-[80vh] overflow-hidden">
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
                    <div className="overflow-hidden mb-4">
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl font-rubik font-bold whitespace-normal leading-tight tracking-tight"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.4,
                                type: "spring" as
                                    | AnimationGeneratorType
                                    | undefined,
                                stiffness: 100,
                            }}
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className="inline-block font-rubik!"
                            >
                                {heroData.heading}
                            </motion.span>
                        </motion.h1>
                    </div>

                    <motion.h2
                        className="text-2xl sm:text-3xl md:text-4xl font-rubik! font-normal mb-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                    >
                        {heroData.subheading}
                    </motion.h2>

                    <motion.p
                        className="text-lg sm:text-2xl font-markazi-text font-medium pt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        {heroData.description}
                    </motion.p>
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
