"use client";

import React from "react";
import { motion } from "framer-motion";
import { LegacyCity } from "@/types/cities";

interface CityWhyBestSectionProps {
    city: LegacyCity;
}

const CityWhyBestSection = ({ city }: CityWhyBestSectionProps) => {
    // Get why best section data
    const whyBestSection = city.contentSections?.find(section => section.section_type === 'why_best');

    // Fallback to default content if no dynamic content is available
    const title = whyBestSection?.title || "WHY WE ARE THE BEST OF THE BESTS?";
    const content = whyBestSection?.content || `You are in the right place if you're exhibiting in ${city.name}, and looking for a reliable company to design your exhibition stand and build your trade show booth. Chronicle Exhibition Organizing LLC offers turnkey solutions for the design and construction of exhibition stands to major brands and companies in ${city.name} and abroad.

We provide world-class service that is known to increase brand awareness. We are the most suitable choice for the construction of your exhibition booth in ${city.name}, as we are the top exhibition booth contractors and builders across the UAE.

Chronicle Exhibits Company are experts in exhibition management, thanks to our extensive experience and team of Graphic Designers and Visualizers. Our goal as one of ${city.name}'s most experienced exhibition stand builders is to provide our clients with a stress-free experience.

Our exhibition stand designs in ${city.name} help them to achieve their exhibiting goals and provide a high ROI. We follow a standard procedure to deliver quality work at an affordable cost within the specified timeframe. This includes gathering inputs from clients on booth design specifications.

The process begins with a rough design to help clients envision the booth they will have at the tradeshow. Once the design is approved by the client, it's time to transform the design into an exhibition booth that meets your needs, goals and vision.

We will help you with the installation and shipping of the booth. We will also assist with the removal and storage of your exhibition stand in ${city.name}.`;

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Main Title */}
                    <motion.div
                        className="text-center mb-8 md:mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide leading-tight">
                            {title}
                        </h2>
                    </motion.div>

                    {/* Content Paragraphs */}
                    <motion.div
                        className="space-y-6 md:space-y-8 text-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-base md:text-lg leading-relaxed text-center max-w-5xl mx-auto">
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
