"use client";

import React from "react";
import { motion } from "framer-motion";

const ReasonsToChooseSection = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center space-y-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide">
                            REASONS TO CHOOSE OUR CUSTOM EXHIBITION STAND
                            SERVICES
                        </h2>

                        <div className="space-y-6 text-gray-700 max-w-5xl mx-auto">
                            <p className="text-base sm:text-lg leading-relaxed text-justify">
                                As your dedicated custom exhibition stand
                                builder, we focus on combining creativity and
                                functionality seamlessly. Our expert designers
                                create stands that reflect your brand identity,
                                ensuring a perfect balance of aesthetics and
                                branding.
                            </p>

                            <p className="text-base sm:text-lg leading-relaxed text-justify">
                                Elevate your expo experience with our
                                exceptional craftsmanship and attention to
                                detail. Explore our services to discover why we
                                are the most trusted provider of impressive
                                custom trade show displays in the UAE.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ReasonsToChooseSection;
