"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface UniqueQualityData {
    main_heading: string;
    paragraph_1: string;
    paragraph_2: string;
    highlighted_text: string | null;
}

const UniqueQualitySection = () => {
    const [sectionData, setSectionData] = useState<UniqueQualityData | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const loadSectionData = async () => {
            try {
                const { data, error } = await supabase.rpc(
                    "get_double_decker_unique_quality_section",
                );

                if (error) {
                    console.error("Error loading unique quality data:", error);
                    return;
                }

                if (data) {
                    setSectionData(data);
                }
            } catch (error) {
                console.error("Error loading unique quality data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSectionData();
    }, [supabase]);

    if (loading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="animate-pulse space-y-6">
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
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
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl text-center md:text-4xl font-rubik font-bold mb-2">
                            {sectionData.main_heading}
                        </h2>
                    </motion.div>
                    <div className="flex !mb-3 justify-center">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-1 mb-0"></div>
                    </div>
                    {/* Content */}
                    <motion.div
                        className="space-y-6 text-gray-700"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-base text-gray-700 leading-relaxed text-justify">
                            {sectionData.paragraph_1}
                        </p>

                        <p className="text-base text-gray-700 leading-relaxed text-justify">
                            {sectionData.highlighted_text ? (
                                <>
                                    {sectionData.paragraph_2
                                        .split(sectionData.highlighted_text)
                                        .map((part, index, array) => (
                                            <React.Fragment key={index}>
                                                {part}
                                                {index < array.length - 1 && (
                                                    <span className="text-[#a5cd39] font-medium">
                                                        {
                                                            sectionData.highlighted_text
                                                        }
                                                    </span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                </>
                            ) : (
                                sectionData.paragraph_2
                            )}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default UniqueQualitySection;
