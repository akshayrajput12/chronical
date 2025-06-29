"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LegacyCity } from "@/types/cities";

interface CityBoothDesignSectionProps {
    city: LegacyCity;
}

const CityBoothDesignSection = ({ city }: CityBoothDesignSectionProps) => {
    // Get booth design section data
    const boothDesignSection = city.contentSections?.find(section => section.section_type === 'booth_design');

    // Fallback to default content if no dynamic content is available
    const title = boothDesignSection?.title || "WHAT IS AN EXHIBITION BOOTH DESIGN?";
    const content = boothDesignSection?.content || "An exhibition stand design puts forward the central idea of your brand & expresses the motto of your company in an influential way. A well-designed exhibition stand or booth helps you reach your business goals & brings the maximum public to your booth.";
    const imageUrl = boothDesignSection?.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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

                                {/* Content Paragraph */}
                                <div className="text-gray-700">
                                    <p className="text-base md:text-lg leading-relaxed text-justify">
                                        {content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Image with Green Background */}
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
                                    alt="Exhibition Booth Design Example"
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

export default CityBoothDesignSection;
