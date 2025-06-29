"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LegacyCity } from "@/types/cities";

interface CityContentSectionProps {
    city: LegacyCity;
}

const CityContentSection = ({ city }: CityContentSectionProps) => {
    // Get content section data from admin - no static fallbacks
    const contentSection = city.contentSections?.find(
        section => section.section_type === "content" && section.is_active
    );

    // Only render if we have content section data from admin
    if (!contentSection || !contentSection.title?.trim() || !contentSection.content?.trim()) {
        return null;
    }

    const title = contentSection.title.trim();
    const subtitle = contentSection.subtitle?.trim();
    const content = contentSection.content.trim();
    const imageUrl = contentSection.image_url?.trim();

    // Don't render if no image is provided
    if (!imageUrl) {
        return null;
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Left Content */}
                        <motion.div
                            className="order-2 lg:order-1"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-6">
                                {/* Dynamic Heading from Admin */}
                                <h2 className="text-3xl text-center md:text-4xl font-rubik font-bold mb-2">
                                    {title}
                                </h2>
                                <div className="flex justify-center">
                                    <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-0"></div>
                                </div>

                                {/* Dynamic Subtitle if available */}
                                {subtitle && (
                                    <h3 className="text-xl text-center md:text-2xl font-rubik font-medium text-gray-600 mb-4">
                                        {subtitle}
                                    </h3>
                                )}
                                {/* Dynamic Content Paragraphs from Admin */}
                                <div className="space-y-4 text-gray-700">
                                    {content
                                        .split("\n\n")
                                        .filter(paragraph => paragraph.trim())
                                        .map((paragraph, index) => (
                                            <p
                                                key={`content-paragraph-${index}-${paragraph.slice(0, 20)}`}
                                                className="text-base leading-relaxed text-justify"
                                            >
                                                {/* Highlight company name if present */}
                                                {paragraph.includes("Chronicle Exhibition") ||
                                                 paragraph.includes("Chronicle Exhibits") ? (
                                                    <>
                                                        {paragraph.split(/(Chronicle Exhibition[^.]*|Chronicle Exhibits[^.]*)/g).map((part, partIndex) => (
                                                            part.includes("Chronicle") ? (
                                                                <span key={partIndex} className="text-[#a5cd39] font-medium">
                                                                    {part}
                                                                </span>
                                                            ) : (
                                                                part
                                                            )
                                                        ))}
                                                    </>
                                                ) : (
                                                    paragraph
                                                )}
                                            </p>
                                        ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Image with Colored Background */}
                        <motion.div
                            className="order-1 lg:order-2 relative"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* Dynamic Image Container from Admin */}
                            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                                <Image
                                    src={imageUrl}
                                    alt={subtitle || title || `Exhibition Stand in ${city.name}`}
                                    fill
                                    className="object-cover rounded-lg"
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

export default CityContentSection;
