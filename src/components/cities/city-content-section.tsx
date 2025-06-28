"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LegacyCity } from "@/types/cities";

interface CityContentSectionProps {
    city: LegacyCity;
}

const CityContentSection = ({ city }: CityContentSectionProps) => {
    // Get content section data
    const contentSection = city.contentSections?.find(section => section.section_type === 'content');

    // Fallback to default content if no dynamic content is available
    const title = contentSection?.title || `PREMIER EXHIBITION STANDS DESIGN, AND BOOTH BUILD PARTNER IN ${city.name.toUpperCase()}`;
    const content = contentSection?.content || `${city.name} offers you a wide range of exhibiting opportunities, as it hosts countless trade shows and exhibitions each year. Chronicle Exhibition Organizing LLC can help you make the most out of these events with an exhibition stand.

We are one the most reputable exhibition stand builders and contractors in ${city.name}. Chronicle Exhibits Company offer end-to-end services for domestic and international clients.

Our manufacturing unit in ${city.name} is known for providing every type of exhibition stand including Custom trade show stands, modular exhibition stands and double-decker stands.`;

    const imageUrl = contentSection?.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

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
                                {/* Main Heading */}
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide leading-tight">
                                    {title}
                                </h2>

                                {/* Content Paragraphs */}
                                <div className="space-y-4 text-gray-700">
                                    {content.split('\n\n').map((paragraph, index) => (
                                        <p key={index} className="text-base leading-relaxed text-justify">
                                            {paragraph.includes('Chronicle Exhibition Organizing LLC') ? (
                                                <>
                                                    {paragraph.split('Chronicle Exhibition Organizing LLC')[0]}
                                                    <span className="text-[#a5cd39] font-medium">
                                                        Chronicle Exhibition Organizing LLC
                                                    </span>
                                                    {paragraph.split('Chronicle Exhibition Organizing LLC')[1]}
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
                            {/* Image Container */}
                            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                                <Image
                                    src={imageUrl}
                                    alt={`Exhibition Stand in ${city.name}`}
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

export default CityContentSection;
