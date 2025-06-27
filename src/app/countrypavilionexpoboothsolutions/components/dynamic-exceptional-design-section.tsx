"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ExpoPavilionExceptionalDesign {
    id: string;
    heading: string;
    paragraph_1: string;
    paragraph_2: string;
    image_url: string;
    image_alt: string;
    is_active: boolean;
}

interface DesignBenefit {
    id: string;
    benefit_text: string;
    display_order: number;
    is_active: boolean;
}

const DynamicExceptionalDesignSection = () => {
    const [designData, setDesignData] = useState<ExpoPavilionExceptionalDesign | null>(null);
    const [benefits, setBenefits] = useState<DesignBenefit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load design section data
            const { data: designSection, error: designError } = await supabase
                .from("expo_pavilion_exceptional_design")
                .select("*")
                .eq("is_active", true)
                .single();

            if (designError && designError.code !== 'PGRST116') {
                console.error("Error loading design data:", designError);
                return;
            }

            if (designSection) {
                setDesignData(designSection);

                // Load benefits for this section
                const { data: benefitsData, error: benefitsError } = await supabase
                    .from("expo_pavilion_design_benefits")
                    .select("*")
                    .eq("design_section_id", designSection.id)
                    .eq("is_active", true)
                    .order("display_order");

                if (benefitsError) {
                    console.error("Error loading benefits data:", benefitsError);
                } else if (benefitsData) {
                    setBenefits(benefitsData);
                }
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Return null if no data is loaded
    if (!designData) {
        return null;
    }

    if (isLoading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                            <div className="order-1 lg:order-1">
                                <div className="space-y-6">
                                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-2 lg:order-2">
                                <div className="h-64 sm:h-80 md:h-96 lg:h-[400px] bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                            {/* Left Content */}
                            <motion.div
                                className="order-1 lg:order-1"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div className="space-y-6">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-wide text-center">
                                        {designData.heading}
                                    </h3>

                                    <div className="space-y-4 text-gray-700">
                                        <p className="text-base leading-relaxed text-justify">
                                            {designData.paragraph_1.split('Country Pavilion Expo Booth').map((part, index, array) => (
                                                <React.Fragment key={index}>
                                                    {part}
                                                    {index < array.length - 1 && (
                                                        <span className="text-[#a5cd39] font-medium">
                                                            Country Pavilion Expo Booth
                                                        </span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </p>

                                        <p className="text-base leading-relaxed text-justify">
                                            {designData.paragraph_2.split('quickly look into its pros').map((part, index, array) => (
                                                <React.Fragment key={index}>
                                                    {part}
                                                    {index < array.length - 1 && (
                                                        <span className="text-[#a5cd39] font-medium">
                                                            quickly look into its pros
                                                        </span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </p>

                                        <ul className="space-y-3 ml-6">
                                            {benefits.map((benefit) => (
                                                <li key={benefit.id} className="flex items-start">
                                                    <span className="text-[#a5cd39] mr-2">
                                                        •
                                                    </span>
                                                    <span>
                                                        {benefit.benefit_text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Image with Green Background */}
                            <motion.div
                                className="order-2 lg:order-2 relative"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                {/* Image Container */}
                                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                                    <Image
                                        src={designData.image_url}
                                        alt={designData.image_alt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DynamicExceptionalDesignSection;
