"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useComponentLoading } from "@/hooks/use-minimal-loading";

// Define types based on the database schema
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
        // Special formatting for countries stat
        if (isCountriesStat) {
            return <div>{num}+</div>;
        }

        if (num >= 20000) {
            return (
                <div className="inline-flex items-baseline">
                    <span>{(num / 1000000).toFixed(1)}</span>
                    <span className="text-2xl ml-1">M</span>
                </div>
            );
        }
        return <div>{num.toLocaleString()}</div>;
    };

    return (
        <div className="font-rubik!" ref={elementRef}>
            {formatNumber(displayValue)}
        </div>
    );
};

const BusinessHubSection = () => {
    // State for business data
    const [businessData, setBusinessData] = useState<BusinessSection | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use minimal loader - won't block the screen
    useComponentLoading(loading, "Loading business data...");

    // Fetch business data from Supabase
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

    // Don't show loading state - minimal loader handles it
    // Show default content while loading to prevent blank screens

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-[50vh] bg-white">
                <div className="text-center text-gray-500">
                    <p className="text-xl">
                        Error loading business section data
                    </p>
                    <p className="mt-2">{error}</p>
                    <p className="mt-4">
                        Please check the console for more details.
                    </p>
                </div>
            </div>
        );
    }

    // Show error state if no data
    if (!businessData) {
        return (
            <div className="flex items-center justify-center h-[50vh] bg-white">
                <div className="text-center text-gray-500">
                    <p className="text-xl">
                        Could not load business section data.
                    </p>
                    <p>Please check your database connection.</p>
                </div>
            </div>
        );
    }

    return (
        <section
            id="business-hub"
            className="bg-white py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 items-start">
                {/* Headings */}
                <div className="w-full ml-8 md:ml-12 lg:ml-16">
                    <h2 className="text-4xl font-rubik font-semibold text-[#222] leading-tight">
                        <span className="text-[#222] font-rubik! block hover:translate-x-1 transition-transform duration-300">
                            {businessData.heading}
                        </span>
                    </h2>
                    <p className="text-2xl md:text-3xl font-rubik! text-[#222] font-medium">
                        {businessData.subheading}
                    </p>
                    <div className="w-24 h-[3px] bg-[#a5cd39] mt-6 hover:w-32 transition-all duration-300" />
                </div>

                {/* Paragraphs */}
                <div className="text-[#444] space-y-6 w-full">
                    {businessData.paragraphs.map((paragraph, index) => (
                        <p
                            key={paragraph.id}
                            className={`${
                                index === 0
                                    ? "font-markazi-text! text-[22px] leading-[28px]"
                                    : "font-noto-kufi-arabic text-[12px] md:text-[13px] lg:text-[14px]"
                            } hover:translate-x-1 hover:text-[#222] transition-all duration-200`}
                            style={index === 0 ? { fontWeight: "0" } : {}}
                        >
                            {paragraph.content}
                        </p>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 sm:mt-6 md:mt-8 mx-12 md:mx-20 lg:mx-28 xl:mx-36 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 lg:gap-16 border-t border-gray-200 pt-6 sm:pt-8 md:pt-10">
                {businessData.stats.map(stat => (
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
                                "text-[#333] text-lg mt-2 hover:-translate-y-0.5 transition-transform duration-200 font-medium font-noto-kufi-arabic"
                            }
                        >
                            {stat.label}
                        </div>

                        {/* Decorative line */}
                        <div className="w-12 h-[2px] bg-gray-200 mt-4" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BusinessHubSection;
