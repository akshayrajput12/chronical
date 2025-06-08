"use client";

import React from "react";
import { motion } from "framer-motion";

const UniqueQualitySection = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Heading */}
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide mb-8">
                            UNIQUE EXCELLENT QUALITY DOUBLE STOREY EXHIBITION
                            BOOTHS
                        </h2>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-base leading-relaxed text-justify">
                            Welcome to Double Decker Exhibition Stands in Dubai
                            – your premier destination for innovative exhibition
                            solutions that elevate your brand presence. As
                            Dubai&apos;s leading provider of double-decker
                            stands, we specialize in creating impactful spaces
                            that leave lasting impressions on your audience.
                        </p>

                        <p className="text-base leading-relaxed text-justify">
                            Our stands offer versatility and sophistication,
                            providing the perfect platform for showcasing your
                            products. Whether it&apos;s a trade show or
                            conference, our team collaborates closely with you
                            to{" "}
                            <span className="text-[#a5cd39] font-medium">
                                design customized stands
                            </span>{" "}
                            reflecting your brand identity. Every element of
                            these stands is manufactured to upgrade your brand
                            image & meet your specific business requirements.
                            These stands help you achieve your objectives and
                            catch the convinced attention of the visitors.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default UniqueQualitySection;
