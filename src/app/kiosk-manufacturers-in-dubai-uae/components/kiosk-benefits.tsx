"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { KioskBenefitsSectionData, KioskBenefitItem } from "@/types/kiosk";

const KioskBenefits = () => {
    const [benefitsData, setBenefitsData] =
        useState<KioskBenefitsSectionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadKioskBenefitsData();
    }, []);

    const loadKioskBenefitsData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use the database function to get benefits data
            const { data, error } = await supabase.rpc(
                "get_kiosk_benefits_section",
            );

            if (error) {
                console.error("Error fetching kiosk benefits data:", error);
                setError("Failed to load benefits section data");
                return;
            }

            if (data && data.length > 0) {
                const benefitsSection = data[0];

                // Parse benefit items from JSONB
                let benefitItems: KioskBenefitItem[] = [];
                if (benefitsSection.benefit_items) {
                    try {
                        const parsedItems =
                            typeof benefitsSection.benefit_items === "string"
                                ? JSON.parse(benefitsSection.benefit_items)
                                : benefitsSection.benefit_items;

                        benefitItems = Array.isArray(parsedItems)
                            ? parsedItems.sort((a, b) => a.order - b.order)
                            : [];
                    } catch (parseError) {
                        console.error(
                            "Error parsing benefit items:",
                            parseError,
                        );
                        benefitItems = [];
                    }
                }

                setBenefitsData({
                    ...benefitsSection,
                    benefit_items: benefitItems,
                });
            } else {
                // Fallback to default data if no data found
                setBenefitsData({
                    id: "",
                    section_heading: "SURE BENEFITS OF CUSTOM KIOSK",
                    section_description:
                        "Nowadays people admire innovation. Anything that is handy & unique appeals to them. Customized kiosk solutions are big thumbs up if you wish to impress visitors coming to the show. Let's have a quick look at the key benefits:",
                    benefit_items: [
                        {
                            id: "1",
                            title: "GOOD FOR ENGAGING CONSUMERS",
                            description:
                                "Talking about trade shows the most important factor is the involvement of the visitors. Custom kiosks are greatly interactive displays that come with a clear & well-organized customer interaction system to ensure better customer engagement.",
                            order: 1,
                        },
                        {
                            id: "2",
                            title: "ENSURE HIGHER EFFICIENCY",
                            description:
                                "Besides better consumer experience, custom kiosks enhance the efficiency of any brand or business group. Customized kiosks are digital & digitalization surely improves the rate of efficiency.",
                            order: 2,
                        },
                        {
                            id: "3",
                            title: "HIGHLY FLEXIBLE CUSTOM KIOSKS",
                            description:
                                "As customized kiosks are technology-based & manufactured keeping in view your dynamic business needs they are adaptable. You can easily change the information on the KIOSK's wing touch screens as the business needs change.",
                            order: 3,
                        },
                    ],
                    is_active: true,
                    created_at: "",
                    updated_at: "",
                });
            }
        } catch (error) {
            console.error("Error loading kiosk benefits data:", error);
            setError("Failed to load benefits section data");
            // Fallback to default data on error
            setBenefitsData({
                id: "",
                section_heading: "SURE BENEFITS OF CUSTOM KIOSK",
                section_description:
                    "Nowadays people admire innovation. Anything that is handy & unique appeals to them. Customized kiosk solutions are big thumbs up if you wish to impress visitors coming to the show. Let's have a quick look at the key benefits:",
                benefit_items: [
                    {
                        id: "1",
                        title: "GOOD FOR ENGAGING CONSUMERS",
                        description:
                            "Talking about trade shows the most important factor is the involvement of the visitors. Custom kiosks are greatly interactive displays that come with a clear & well-organized customer interaction system to ensure better customer engagement.",
                        order: 1,
                    },
                    {
                        id: "2",
                        title: "ENSURE HIGHER EFFICIENCY",
                        description:
                            "Besides better consumer experience, custom kiosks enhance the efficiency of any brand or business group. Customized kiosks are digital & digitalization surely improves the rate of efficiency.",
                        order: 2,
                    },
                    {
                        id: "3",
                        title: "HIGHLY FLEXIBLE CUSTOM KIOSKS",
                        description:
                            "As customized kiosks are technology-based & manufactured keeping in view your dynamic business needs they are adaptable. You can easily change the information on the KIOSK's wing touch screens as the business needs change.",
                        order: 3,
                    },
                ],
                is_active: true,
                created_at: "",
                updated_at: "",
            });
        } finally {
            setLoading(false);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading benefits...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Show error state with fallback
    if (error && !benefitsData) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <p className="text-red-600 mb-2">
                            Error loading benefits section
                        </p>
                        <p className="text-gray-600 text-sm">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    // Don't render if section is not active
    if (!benefitsData?.is_active) {
        return null;
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section Title */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-4">
                            {benefitsData.section_heading}
                        </h2>
                        <div className="w-24 h-1 bg-[#a5cd39] mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            {benefitsData.section_description}
                        </p>
                    </motion.div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
                        {benefitsData.benefit_items.map((benefit, index) => (
                            <motion.div
                                key={benefit.id || index}
                                className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:border-[#a5cd39] transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                            >
                                <h3 className="text-xl  mb-4 font-bold text-[#333333] text-center">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-700">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KioskBenefits;
