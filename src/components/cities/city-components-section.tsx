"use client";

import React from "react";
import { motion } from "framer-motion";
import { LegacyCity } from "@/types/cities";

interface CityComponentsSectionProps {
    city: LegacyCity;
}

const CityComponentsSection = ({ city }: CityComponentsSectionProps) => {
    // Get booth design section data from admin for header content (will be renamed to Component Section in admin)
    const componentSection = city.contentSections?.find(
        section => section.section_type === "booth_design",
    );

    // Get components from admin - no static fallbacks
    const components = city.components?.filter(component =>
        component.is_active &&
        component.title?.trim() &&
        component.description?.trim()
    ).sort((a, b) => a.sort_order - b.sort_order) || [];

    // Only render if we have both component section content and components from admin
    if (!componentSection || !componentSection.title?.trim() || !componentSection.content?.trim() || components.length === 0) {
        return null;
    }

    // Use only dynamic content from admin - no static fallbacks
    const headerTitle = componentSection.title.trim();
    const headerContent = componentSection.content.trim();

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Main Title - Dynamic from Component Section (booth_design) */}
                    <motion.div
                        className="text-center mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl capitalize md:text-4xl font-rubik font-bold mb-2">
                            {headerTitle}
                        </h2>
                    </motion.div>
                    <div className="flex justify-center">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                    </div>

                    {/* Introduction Paragraph - Dynamic from Component Section (booth_design) */}
                    <motion.div
                        className="text-center mb-12 md:mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {headerContent.split('\n\n').map((paragraph, index) => (
                            <p
                                key={index}
                                className="text-base md:text-lg text-gray-700 leading-relaxed max-w-5xl mx-auto mb-4 last:mb-0"
                            >
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

                    {/* Dynamic Components Grid from Admin */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
                        {components.map((component, index) => (
                            <motion.div
                                key={component.id}
                                className="text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
                                viewport={{ once: true }}
                            >
                                <h3
                                    className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-wide"
                                    style={{ color: component.color || "#a5cd39" }}
                                >
                                    {component.title}
                                </h3>
                                <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                                    {component.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CityComponentsSection;
