"use client";

import React from "react";
import { motion } from "framer-motion";
import { City } from "@/types/cities";

interface CityLookingForContractorsSectionProps {
    city: City;
}

const CityLookingForContractorsSection = ({ city }: CityLookingForContractorsSectionProps) => {
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
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide leading-tight mb-6 md:mb-8">
                            LOOKING FOR EXHIBITION STAND CONTRACTORS IN ABU DHABI
                        </h2>

                        {/* Call to Action Text */}
                        <div className="text-base md:text-lg text-gray-700 leading-relaxed">
                            <p>
                                Call{" "}
                                <a 
                                    href="tel:+971543474645" 
                                    className="font-bold hover:underline transition-colors duration-300"
                                    style={{ color: "#a5cd39" }}
                                >
                                    +971 (543) 47-4645
                                </a>{" "}
                                or submit enquiry form below
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CityLookingForContractorsSection;
