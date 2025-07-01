"use client";

import React from "react";
import { motion } from "framer-motion";
import { LegacyCity } from "@/types/cities";

interface CityLookingForContractorsSectionProps {
    city: LegacyCity;
}

const CityLookingForContractorsSection = ({
    city,
}: CityLookingForContractorsSectionProps) => {
    // Get contractors section data
    const contractorsSection = city.contentSections?.find(
        section => section.section_type === "contractors",
    );

    // Get primary phone contact
    const primaryPhone = city.contactDetails?.find(
        contact => contact.contact_type === "phone" && contact.is_primary,
    );

    // Fallback to default content if no dynamic content is available
    const title =
        contractorsSection?.title ||
        `LOOKING FOR EXHIBITION STAND CONTRACTORS IN ${city.name.toUpperCase()}`;
    const content =
        contractorsSection?.content ||
        "Call our team or submit enquiry form below";
    const phoneNumber = primaryPhone?.contact_value || "+971 (543) 47-4645";
    const phoneDisplay = primaryPhone?.display_text || phoneNumber;

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Main Heading */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-wide leading-tight mb-6 md:mb-8">
                            {title}
                        </h2>

                        {/* Call to Action Text */}
                        <div className="text-base md:text-lg text-gray-700 leading-relaxed">
                            <p>
                                {content.includes("Call") ? (
                                    <>
                                        Call{" "}
                                        <a
                                            href={`tel:${phoneNumber.replace(
                                                /[^+\d]/g,
                                                "",
                                            )}`}
                                            className="font-bold hover:underline transition-colors duration-300"
                                            style={{ color: "#a5cd39" }}
                                        >
                                            {phoneDisplay}
                                        </a>{" "}
                                        {content
                                            .split("Call")[1]
                                            ?.replace(phoneDisplay, "")
                                            .trim() ||
                                            "or submit enquiry form below"}
                                    </>
                                ) : (
                                    content
                                )}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CityLookingForContractorsSection;
