"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface CommunicationData {
    main_heading: string;
    paragraph_1: string;
    paragraph_2: string;
    section_image_url: string | null;
    section_image_alt: string | null;
}

const EffectiveCommunicationSection = () => {
    const [sectionData, setSectionData] = useState<CommunicationData | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const loadSectionData = async () => {
            try {
                const { data, error } = await supabase.rpc('get_double_decker_communication_section');

                if (error) {
                    console.error('Error loading communication data:', error);
                    return;
                }

                if (data) {
                    setSectionData(data);
                }
            } catch (error) {
                console.error('Error loading communication data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSectionData();
    }, [supabase]);

    if (loading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            <div className="animate-pulse space-y-6">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                                </div>
                            </div>
                            <div className="animate-pulse">
                                <div className="h-64 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!sectionData) {
        return null;
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Left Column - Content */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
                                {sectionData.main_heading}
                            </h2>

                            <p className="text-base leading-relaxed text-justify">
                                {sectionData.paragraph_1}
                            </p>

                            <p className="text-base leading-relaxed text-justify">
                                {sectionData.paragraph_2}
                            </p>

                            <p className="text-base leading-relaxed text-justify">
                                Whether it&apos;s a trade show or corporate
                                event, Double Storey Exhibition Stands in Dubai
                                is here to help. Contact us today to discuss
                                your requirements and elevate your exhibition
                                presence with our exceptional double-decker
                                stands.
                            </p>
                        </motion.div>

                        {/* Right Column - Image with Green Background */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* Image Container */}
                            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                                <Image
                                    src={sectionData.section_image_url || "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
                                    alt={sectionData.section_image_alt || "Exhibition Communication"}
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
    );
};

export default EffectiveCommunicationSection;
