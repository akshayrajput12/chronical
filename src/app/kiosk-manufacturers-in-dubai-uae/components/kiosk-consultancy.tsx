"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { KioskConsultancySectionData } from "@/types/kiosk";

const KioskConsultancy = () => {
    const [consultancyData, setConsultancyData] =
        useState<KioskConsultancySectionData>({
            id: "",
            section_heading: "FREE KIOSK DESIGN CONSULTANCY NOW",
            phone_number: "+971 54 347 4645",
            phone_display_text: "Call +971 54 347 4645",
            phone_href: "tel:+971554974645",
            additional_text: "or submit inquiry form below",
            button_bg_color: "black",
            button_text_color: "white",
            section_bg_color: "#a5cd39",
            section_text_color: "black",
            is_active: true,
            created_at: "",
            updated_at: "",
        });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadKioskConsultancyData();
    }, []);

    const loadKioskConsultancyData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use the database function to get consultancy data
            const { data, error } = await supabase.rpc(
                "get_kiosk_consultancy_section",
            );

            if (error) {
                console.error("Error fetching kiosk consultancy data:", error);
                setError("Failed to load consultancy section data");
                return;
            }

            if (data && data.length > 0) {
                const consultancySection = data[0];
                setConsultancyData(consultancySection);
            } else {
                // Fallback to default data if no data found
                setConsultancyData({
                    id: "",
                    section_heading: "FREE KIOSK DESIGN CONSULTANCY NOW",
                    phone_number: "+971 54 347 4645",
                    phone_display_text: "Call +971 54 347 4645",
                    phone_href: "tel:+971554974645",
                    additional_text: "or submit inquiry form below",
                    button_bg_color: "black",
                    button_text_color: "white",
                    section_bg_color: "#a5cd39",
                    section_text_color: "black",
                    is_active: true,
                    created_at: "",
                    updated_at: "",
                });
            }
        } catch (error) {
            console.error("Error loading kiosk consultancy data:", error);
            setError("Failed to load consultancy section data");
            // Fallback to default data on error
            setConsultancyData({
                id: "",
                section_heading: "FREE KIOSK DESIGN CONSULTANCY NOW",
                phone_number: "+971 54 347 4645",
                phone_display_text: "Call +971 54 347 4645",
                phone_href: "tel:+971554974645",
                additional_text: "or submit inquiry form below",
                button_bg_color: "black",
                button_text_color: "white",
                section_bg_color: "#a5cd39",
                section_text_color: "black",
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
            <section className="py-8 md:py-12 lg:py-16 bg-[#a5cd39] text-black">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-black/20 rounded mb-6 mx-auto max-w-md"></div>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                <div className="h-12 bg-black/20 rounded w-48"></div>
                                <div className="h-6 bg-black/20 rounded w-40"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Don't render if section is not active
    if (!consultancyData.is_active) {
        return null;
    }

    return (
        <section
            className="py-8 md:py-12 lg:py-16"
            style={{
                backgroundColor: consultancyData.section_bg_color,
                color: consultancyData.section_text_color,
            }}
        >
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h2
                        className="text-2xl md:text-3xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {consultancyData.section_heading}
                    </motion.h2>

                    <motion.div
                        className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <a
                            href={consultancyData.phone_href}
                            className="flex items-center justify-center px-6 py-3 rounded-md font-medium hover:opacity-80 transition-all duration-300"
                            style={{
                                backgroundColor:
                                    consultancyData.button_bg_color,
                                color: consultancyData.button_text_color,
                            }}
                        >
                            <Phone className="mr-2 h-5 w-5" />
                            {consultancyData.phone_display_text}
                        </a>
                        <span className="font-medium">
                            {consultancyData.additional_text}
                        </span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default KioskConsultancy;
