"use client";

import React from "react";
import { motion } from "framer-motion";
import { LegacyCity } from "@/types/cities";
import { Check } from "lucide-react";

interface CityPreferredChoiceSectionProps {
    city: LegacyCity;
}

const CityPreferredChoiceSection = ({
    city,
}: CityPreferredChoiceSectionProps) => {
    // Get preferred choice section data
    const preferredChoiceSection = city.contentSections?.find(section => section.section_type === 'preferred_choice');

    // Get services from database or fallback to default
    const services = city.preferredServices?.map(service => service.service_text) || [
        "Take care of stand fabrication, assembling & installing stands.",
        "Offer all services related to booth production under a single roof.",
        "On-site support",
        "Provide you with post-show clean-up services.",
        "We design and create small booths within days whereas larger ones take a couple of weeks.",
        "Ensure timely delivery of the exhibition stands on the show floor.",
        "Provide you with sufficient storage facility for your products.",
    ];

    // Fallback to default content if no dynamic content is available
    const title = preferredChoiceSection?.title || `WHY WE ARE A PREFERRED CHOICE AS EXHIBITION COMPANY IN ${city.name.toUpperCase()}?`;
    const content = preferredChoiceSection?.content || `Chronicle Exhibits makes every effort to create and design exceptional booths. Our goal as one of the best exhibition stands contractors in ${city.name}, UAE is to create 3D custom stands that meet your business needs.

We provide a complete range of stand building and designing services.`;

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
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-wide leading-tight">
                                    {title}
                                </h2>

                                {/* Content Paragraphs */}
                                <div className="space-y-4 text-gray-700">
                                    {content.split('\n\n').map((paragraph, index) => (
                                        <p key={index} className="text-base leading-relaxed text-justify">
                                            {paragraph.includes('exhibition stands contractors') ? (
                                                <>
                                                    {paragraph.split('exhibition stands contractors')[0]}
                                                    <strong>
                                                        exhibition stands contractors
                                                    </strong>
                                                    {paragraph.split('exhibition stands contractors')[1]}
                                                </>
                                            ) : (
                                                paragraph
                                            )}
                                        </p>
                                    ))}
                                </div>

                                {/* Exhibition Support Button */}
                                <div className="pt-4">
                                    <button
                                        className="px-8 py-3 text-white font-medium uppercase tracking-wider transition-colors duration-300 hover:opacity-90"
                                        style={{ backgroundColor: "#a5cd39" }}
                                    >
                                        EXHIBITION SUPPORT
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Content - Services List */}
                        <motion.div
                            className="order-1 lg:order-2"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-4">
                                {services.map((service, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start gap-3"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                    >
                                        {/* Green Tick Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                                style={{
                                                    backgroundColor: "#a5cd39",
                                                }}
                                            >
                                                <Check
                                                    className="w-3 h-3 text-white"
                                                    strokeWidth={3}
                                                />
                                            </div>
                                        </div>

                                        {/* Service Text */}
                                        <p className="text-base text-gray-700 leading-relaxed">
                                            {service}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CityPreferredChoiceSection;
