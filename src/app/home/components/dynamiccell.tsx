"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { supabase } from "@/lib/supabase";

const buildingImage = {
    src: "/images/home.jpg", // Using the existing image
    alt: "Dubai Business District",
};

// Odometer counter effect for numbers
const NumberDisplay = ({ value, label }: { value: number; label?: string }) => {
    const [displayValue, setDisplayValue] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState(false);
    const elementRef = React.useRef<HTMLDivElement>(null);

    // Special case for countries stat - show "50+" format
    const isCountriesStat =
        label?.toLowerCase().includes("countries") ||
        label?.toLowerCase().includes("country");

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 },
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    React.useEffect(() => {
        if (isVisible && !isCountriesStat) {
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = value / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
                step++;
                current = Math.min(value, Math.floor(increment * step));
                setDisplayValue(current);

                if (step >= steps) {
                    clearInterval(timer);
                    setDisplayValue(value);
                }
            }, duration / steps);

            return () => clearInterval(timer);
        } else if (isVisible && isCountriesStat) {
            // For countries, just set the display value immediately
            setDisplayValue(value);
        }
    }, [isVisible, value, isCountriesStat]);

    const formatNumber = (num: number) => {
        return (
            <div style={{ fontSize: "40px" }} className="text-2xl ml-1">
                {num.toLocaleString()}+
            </div>
        );
    };

    return (
        <div className="font-rubik!" ref={elementRef}>
            {formatNumber(displayValue)}
        </div>
    );
};

interface BusinessParagraph {
    id: string;
    content: string;
    display_order: number;
}

interface BusinessStat {
    id: string;
    value: number;
    label: string;
    sublabel: string;
    display_order: number;
}

interface BusinessSection {
    id: string;
    heading: string;
    subheading: string;
    paragraphs: BusinessParagraph[];
    stats: BusinessStat[];
}

const DynamicCell = () => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    const [businessData, setBusinessData] = useState<BusinessSection | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [controls, isInView]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6 },
        },
    };

    const imageVariants = {
        hidden: { scale: 1.05, opacity: 0.9 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 1.2, ease: "easeOut" },
        },
    };

    useEffect(() => {
        const fetchBusinessData = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log("Fetching business section data...");

                // Get active business section
                const { data: sectionData, error: sectionError } =
                    await supabase
                        .from("business_sections")
                        .select("id, heading, subheading")
                        .eq("is_active", true)
                        .order("created_at", { ascending: false })
                        .limit(1)
                        .single();

                if (sectionError) {
                    console.error(
                        "Error fetching business section:",
                        sectionError,
                    );
                    setError(
                        `Failed to fetch business section: ${sectionError.message}`,
                    );
                    setLoading(false);
                    return;
                }

                console.log("Business section data:", sectionData);

                if (!sectionData) {
                    setError("No active business section found");
                    setLoading(false);
                    return;
                }

                // Get paragraphs for this section
                const { data: paragraphsData, error: paragraphsError } =
                    await supabase
                        .from("business_paragraphs")
                        .select("id, content, display_order")
                        .eq("business_section_id", sectionData.id)
                        .order("display_order", { ascending: true });

                if (paragraphsError) {
                    console.error(
                        "Error fetching business paragraphs:",
                        paragraphsError,
                    );
                    setError(
                        `Failed to fetch paragraphs: ${paragraphsError.message}`,
                    );
                    setLoading(false);
                    return;
                }

                console.log("Business paragraphs data:", paragraphsData);

                // Get stats for this section
                const { data: statsData, error: statsError } = await supabase
                    .from("business_stats")
                    .select("id, value, label, sublabel, display_order")
                    .eq("business_section_id", sectionData.id)
                    .order("display_order", { ascending: true });

                if (statsError) {
                    console.error("Error fetching business stats:", statsError);
                    setError(`Failed to fetch stats: ${statsError.message}`);
                    setLoading(false);
                    return;
                }

                console.log("Business stats data:", statsData);

                // Combine all data
                const combinedData = {
                    id: sectionData.id,
                    heading: sectionData.heading,
                    subheading: sectionData.subheading,
                    paragraphs: paragraphsData || [],
                    stats: statsData || [],
                };

                console.log("Combined business data:", combinedData);
                setBusinessData(combinedData);
            } catch (error) {
                console.error("Unexpected error in fetchBusinessData:", error);
                setError("An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessData();
    }, []);

    return (
        <section
            className="relative bg-white overflow-hidden w-full h-screen"
            id="dynamic-central"
            ref={ref}
        >
            {/* Background Image - Full width and height, positioned behind content */}
            <motion.div
                className="absolute inset-0 w-full h-full z-0"
                variants={imageVariants}
                initial="hidden"
                animate={controls}
            >
                <Image
                    src={buildingImage.src}
                    alt={buildingImage.alt}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                    quality={100}
                />
            </motion.div>

            {/* Content overlay - Centered horizontally but at the top of the section */}
            <motion.div
                className="relative z-10 h-full w-full flex flex-col items-center justify-start text-center px-4 pt-32 md:pt-40"
                variants={containerVariants}
                initial="hidden"
                animate={controls}
            >
                {/* Stats */}
                <div className="mt-8 sm:mt-8 md:mt-24 mx-12 md:mx-20 lg:mx-28 xl:mx-36 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 lg:gap-16 pt-6 sm:pt-8 md:pt-10">
                    {businessData?.stats.map(stat => (
                        <div
                            key={stat.id}
                            className="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300"
                        >
                            {/* Stat number */}
                            <div className="text-2xl md:text-3xl lg:text-4xl font-medium text-[#a5cd39] leading-none hover:scale-105 transition-transform duration-300">
                                <NumberDisplay
                                    value={stat.value}
                                    label={stat.label}
                                />
                            </div>

                            {/* Label */}
                            <div
                                className={
                                    "text-[#333] text-2xl mt-2 hover:-translate-y-0.5 transition-transform duration-200 font-medium font-markazi-text"
                                }
                            >
                                {stat.label}
                            </div>

                            {/* Decorative line */}
                            <div className="w-12 h-[2px] bg-gray-200 mt-4" />
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default DynamicCell;
