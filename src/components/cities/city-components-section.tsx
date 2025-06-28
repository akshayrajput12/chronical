"use client";

import React from "react";
import { motion } from "framer-motion";
import { LegacyCity } from "@/types/cities";

interface CityComponentsSectionProps {
    city: LegacyCity;
}

const CityComponentsSection = ({ city }: CityComponentsSectionProps) => {
    // Get components from database or fallback to default
    const components = city.components || [
        {
            id: "1",
            title: "STUDY THE LATEST TRENDS",
            description: "Stay ahead of the curve by researching and implementing the latest exhibition design trends and technologies to create cutting-edge displays.",
            color: "#a5cd39",
            sort_order: 1
        },
        {
            id: "2",
            title: "CREATIVE DESIGN SOLUTIONS",
            description: "Develop innovative and creative design concepts that capture attention and effectively communicate your brand message to visitors.",
            color: "#a5cd39",
            sort_order: 2
        },
        {
            id: "3",
            title: "QUALITY CONSTRUCTION",
            description: "Ensure superior build quality using premium materials and expert craftsmanship for durable and impressive exhibition stands.",
            color: "#a5cd39",
            sort_order: 3
        },
        {
            id: "4",
            title: "PROJECT MANAGEMENT",
            description: "Comprehensive project management from concept to completion, ensuring timely delivery and seamless execution of your exhibition.",
            color: "#a5cd39",
            sort_order: 4
        },
        {
            id: "5",
            title: "TECHNICAL SUPPORT",
            description: "Professional technical support and maintenance services to ensure your exhibition stand operates flawlessly throughout the event.",
            color: "#a5cd39",
            sort_order: 5
        },
        {
            id: "6",
            title: "POST-EVENT SERVICES",
            description: "Complete post-event services including dismantling, storage, and preparation for future exhibitions to maximize your investment.",
            color: "#a5cd39",
            sort_order: 6
        }
    ];

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
                            COMPONENTS THAT WE KEEP IN MIND FOR DESIGNING PRODUCTIVE EXHIBITION STAND
                        </h2>
                    </motion.div>

                    {/* Introduction Paragraph */}
                    <motion.div
                        className="text-center mb-12 md:mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-5xl mx-auto">
                            A large number of <strong>exhibition stand design companies in {city.name}</strong> are active around us but professional brands look for skilled <strong>exhibition stand builders</strong> like Chronicle Exhibits (Chronicle Exhibition Organizing LLC), for functional & quality booth design ideas. Being in this field for years, we suggest the right trade show booth design fulfilling your business objectives. Let's go through the factors we take into account:
                        </p>
                    </motion.div>

                    {/* Six Components Grid */}
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
                                {/* Component Number Circle */}
                                <div className="flex justify-center mb-6">
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                                        style={{ backgroundColor: component.color || "#a5cd39" }}
                                    >
                                        {component.sort_order || index + 1}
                                    </div>
                                </div>

                                {/* Component Title */}
                                <h3 className="text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wide mb-4 leading-tight">
                                    {component.title}
                                </h3>

                                {/* Component Description */}
                                <p className="text-base text-gray-600 leading-relaxed">
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
