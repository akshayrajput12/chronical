"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExpoPavilionIntro } from "@/services/country-pavilion-page.service";

interface CountryPavilionIntroSectionServerProps {
    introData: ExpoPavilionIntro | null;
}

const CountryPavilionIntroSectionServer = ({ introData }: CountryPavilionIntroSectionServerProps) => {
    // Don't render if no data exists
    if (!introData) {
        return null;
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl text-center md:text-4xl font-rubik font-bold mb-2">
                            {introData.heading}
                        </h2>
                    </motion.div>
                    <div className="flex !mb-3 justify-center">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-1 mb-0"></div>
                    </div>
                    {/* Content */}
                    <motion.div
                        className="space-y-6 text-gray-700"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-base leading-relaxed text-justify">
                            {introData.paragraph_1}
                        </p>

                        <p className="text-base leading-relaxed text-justify">
                            {introData.paragraph_2}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CountryPavilionIntroSectionServer;
