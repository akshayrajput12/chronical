import { LegacyCity } from "@/types/cities";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

interface ServicesGridProps {
    city: LegacyCity;
}

export const ServicesGrid = ({ city }: ServicesGridProps) => {
    // Get role section data from admin for header content
    const roleSection = city.contentSections?.find(
        section => section.section_type === "role",
    );

    // Get services from admin - no static fallbacks
    const services = city.services?.filter(service =>
        service.isActive &&
        service.name?.trim()
    ) || [];

    // Only render if we have role section content and services from admin
    if (!roleSection || !roleSection.title?.trim() || !roleSection.content?.trim() || services.length === 0) {
        return null;
    }
    return (
        <>
            <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        {/* Section Title - Dynamic from Role Section */}
                        <motion.h2
                            className="text-3xl md:text-4xl font-rubik font-bold mb-4"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {roleSection.title.trim()}
                        </motion.h2>
                        <div className="flex justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                        </div>

                        {/* Content Paragraphs - Dynamic from Role Section */}
                        <motion.div
                            className="space-y-6 text-gray-700"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            {roleSection.content.trim().split('\n\n').map((paragraph, index) => (
                                <p key={`paragraph-${index}-${paragraph.slice(0, 20)}`} className="text-base md:text-lg leading-relaxed text-justify">
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
            <section className="bg-gray-100 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto  gap-8">
                    {services.map((service, index) => {
                        // Static icons array - same as original implementation
                        const staticIcons = [
                            "/icons/code.svg",
                            "/icons/computer.svg",
                            "/icons/gear.svg"
                        ];

                        // Use static icon based on index, cycle through if more services
                        const iconUrl = staticIcons[index % staticIcons.length];

                        return (
                            <div
                                key={service.id || `service-${index}`}
                                className="bg-white p-8 text-center rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#a5cd39]/30 group"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 flex items-center justify-center bg-[#f9f7f7] rounded-full p-3 group-hover:bg-[#a5cd39]/10 transition-colors duration-300">
                                        <Image
                                            src={iconUrl}
                                            alt={service.name}
                                            width={48}
                                            height={48}
                                            className="object-contain"
                                            loading="lazy"
                                            priority={false}
                                        />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#a5cd39] transition-colors duration-300">
                                    {service.name}
                                </h3>
                                {service.description && (
                                    <p className="text-gray-600 text-sm mt-2">
                                        {service.description}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
};
