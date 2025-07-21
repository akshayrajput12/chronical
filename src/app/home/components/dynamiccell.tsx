"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, Easing } from "framer-motion";

import { DynamicCellDisplayData } from "@/types/dynamic-cell";
import { getImageUrlForBucket } from "@/utils/image-url";

const defaultImage = {
    src: "/images/home.jpg", // Fallback image
    alt: "Dubai Business District",
};

// Hardcoded fallback image for database issues
const hardcodedFallbackImage = {
    src: "/images/home.jpg", // Hardcoded fallback when database fails (using existing image)
    alt: "Dubai Business District - DWTC Free Zone",
};

// Hardcoded fallback business data for database issues
const hardcodedBusinessData: BusinessSection = {
    id: "fallback-business-section",
    heading: "DWTC Free Zone",
    subheading: "Your Gateway to Global Business Success",
    paragraphs: [],
    stats: [
        {
            id: "fallback-stat-1",
            value: 5786,
            label: "Projects",
            sublabel: "Successful Projects",
            display_order: 1,
        },
        {
            id: "fallback-stat-2",
            value: 824,
            label: "Events and Conferences",
            sublabel: "Annual Events",
            display_order: 2,
        },
        {
            id: "fallback-stat-3",
            value: 50,
            label: "Countries",
            sublabel: "Global Reach",
            display_order: 3,
        },
        {
            id: "fallback-stat-4",
            value: 415,
            label: "Clients",
            sublabel: "Satisfied Clients",
            display_order: 4,
        },
    ],
};

// Odometer counter effect for numbers
const NumberDisplay = ({ value, label }: { value: number; label?: string }) => {
    const [displayValue, setDisplayValue] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState(false);
    const elementRef = React.useRef<HTMLDivElement>(null);

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
        if (isVisible) {
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
        }
    }, [isVisible, value]);

    const formatNumber = (num: number) => {
        return (
            <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl ml-1">
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

interface DynamicCellProps {
    dynamicCellData: DynamicCellDisplayData | null;
    businessData: BusinessSection | null;
}

const DynamicCell: React.FC<DynamicCellProps> = ({
    dynamicCellData: propDynamicCellData,
    businessData: propBusinessData,
}) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    const [imageError, setImageError] = useState(false);

    // Handle case where no data is provided
    const businessData = propBusinessData || hardcodedBusinessData;
    const dynamicCellData = propDynamicCellData;

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
            transition: {
                duration: 1.2,
                ease: "easeOut" as Easing | Easing[] | undefined as
                    | Easing
                    | Easing[]
                    | undefined,
            },
        },
    };

    return (
        <section
            className="relative lg:pt-0 pt-24 bg-white overflow-hidden w-full min-h-[70vh] md:min-h-screen h-auto md:h-screen"
            id="dynamic-central"
            ref={ref}
        >
            {/* Background Image - Full width and height, positioned behind content */}
            <motion.div
                className="absolute inset-0 w-full h-[50vh] md:h-[85%] lg:h-[90%] z-0"
                variants={imageVariants}
                initial="hidden"
                animate={controls}
            >
                <Image
                    src={
                        imageError
                            ? hardcodedFallbackImage.src
                            : getImageUrlForBucket.dynamicCell(
                                  dynamicCellData?.background_image_url,
                              ) || defaultImage.src
                    }
                    alt={
                        imageError
                            ? hardcodedFallbackImage.alt
                            : dynamicCellData?.title || defaultImage.alt
                    }
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                    quality={100}
                    onError={() => {
                        console.log(
                            "Image failed to load, using hardcoded fallback",
                        );
                        setImageError(true);
                    }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-[#1a1a1a]/60 z-10" />
            </motion.div>
            {/* Content overlay - Centered horizontally but at the top of the section */}
            <motion.div
                className="relative z-10 h-full w-full flex flex-col items-center justify-center md:justify-start text-center px-0 md:px-4 py-4 md:py-8 md:pt-32 lg:pt-40"
                variants={containerVariants}
                initial="hidden"
                animate={controls}
            >
                {/* Stats */}
                <div className="mt-2 md:mt-8 lg:mt-24 mx-0 sm:mx-4 md:mx-12 lg:mx-20 xl:mx-28 2xl:mx-36 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-8 lg:gap-12 xl:gap-16 pt-2 sm:pt-4 md:pt-8 lg:pt-10">
                    {businessData?.stats.map(stat => (
                        <div
                            key={stat.id}
                            className="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 px-2"
                        >
                            {/* Stat number */}
                            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium text-[#a5cd39] leading-none hover:scale-105 transition-transform duration-300">
                                <NumberDisplay
                                    value={stat.value}
                                    label={stat.label}
                                />
                            </div>

                            {/* Label */}
                            <div
                                className={
                                    "text-[#ffffff] text-base sm:text-lg md:text-xl lg:text-2xl mt-2 hover:-translate-y-0.5 transition-transform duration-200 font-medium font-markazi-text"
                                }
                            >
                                {stat.label}
                            </div>

                            {/* Decorative line */}
                            <div className="w-8 sm:w-10 md:w-12 h-[1px] md:h-[2px] bg-gray-200 mt-2 md:mt-4" />
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default DynamicCell;
