"use client";

import React from "react";
import { motion } from "framer-motion";
import { LegacyCity } from "@/types/cities";

interface CityWhyBestSectionProps {
    city: LegacyCity;
}

const CityWhyBestSection = ({ city }: CityWhyBestSectionProps) => {
    // Get why best section data from admin
    const whyBestSection = city.contentSections?.find(
        section => section.section_type === "why_best",
    );

    // Only render if we have dynamic content from admin
    if (
        !whyBestSection ||
        !whyBestSection.title?.trim() ||
        !whyBestSection.content?.trim()
    ) {
        return null;
    }

    // Use only dynamic content from admin - no static fallbacks
    const title = whyBestSection.title.trim();
    const content = whyBestSection.content.trim();

    // Split content into paragraphs for better rendering
    const contentParagraphs = content
        .split("\n\n")
        .filter(paragraph => paragraph.trim().length > 0);

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Main Title */}
                    <motion.div
                        className="text-center mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl capitalize md:text-4xl font-rubik font-bold mb-2">
                            {title}
                        </h2>
                        <div className="flex justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-4 mb-4"></div>
                        </div>
                    </motion.div>

                    {/* Content Paragraphs */}
                    <motion.div
                        className="space-y-6 md:space-y-8 text-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {contentParagraphs.map((paragraph, index) => (
                            <p
                                key={index}
                                className="text-base md:text-lg text-justify leading-relaxed max-w-5xl mx-auto"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CityWhyBestSection;
