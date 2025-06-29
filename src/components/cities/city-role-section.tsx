"use client";

import React from "react";
import { motion } from "framer-motion";
import { LegacyCity } from "@/types/cities";

interface CityRoleSectionProps {
    city: LegacyCity;
}

const CityRoleSection = ({ city }: CityRoleSectionProps) => {
    // Get role section data
    const roleSection = city.contentSections?.find(section => section.section_type === 'role');

    // Fallback to default content if no dynamic content is available
    const title = roleSection?.title || `ROLE OF EXHIBITION BOOTH DESIGN ${city.name.toUpperCase()}`;
    const content = roleSection?.content || `Today most business entrepreneurs around the world take part in trade shows for their brand expansion. Exhibitions are an ideal platform for taking businesses on the path to success. Trade shows provide you with an opportunity to build long-term business connections & also to influence future clients. So it is more than necessary to have an impressive booth design as it works as the face of your brand at the show.

The Exhibition booth design should be such that it prompts the visitors to notice your products & services. The booth should be visually charming to catch the hopeful attention of the customers. It should be spacious to accommodate all your business activities.`;

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Section Title */}
                    <motion.h2
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide leading-tight mb-8 md:mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {title}
                    </motion.h2>

                    {/* Content Paragraphs */}
                    <motion.div
                        className="space-y-6 text-gray-700"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-base md:text-lg leading-relaxed text-justify">
                                {paragraph.includes('Exhibition booth design') ? (
                                    <>
                                        {paragraph.split('Exhibition booth design')[0]}
                                        <span className="font-semibold">
                                            Exhibition booth design
                                        </span>
                                        {paragraph.split('Exhibition booth design')[1]}
                                    </>
                                ) : (
                                    paragraph
                                )}
                            </p>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CityRoleSection;
