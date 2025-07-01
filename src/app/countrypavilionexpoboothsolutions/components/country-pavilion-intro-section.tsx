"use client";

import React from "react";
import { motion } from "framer-motion";

const CountryPavilionIntroSection = () => {
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
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-wide mb-8 text-center">
                            COUNTRY PAVILION EXPO BOOTH
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
                            Top choice for showcasing national excellence on a
                            global stage. As the premier provider of{" "}
                            <span className="text-[#a5cd39] font-medium">
                                country pavilion expo booth in Dubai
                            </span>
                            , we specialize in creating immersive and impactful
                            spaces that highlight the unique offerings of your
                            nation. Our booths offer unparalleled visibility and
                            serve as powerful platforms for promoting your
                            country&apos;s culture, industry, and innovation.
                        </p>

                        <p className="text-base leading-relaxed text-justify">
                            With{" "}
                            <span className="text-[#a5cd39] font-medium">
                                Chronicle Exhibits Dubai
                            </span>{" "}
                            comprehensive services and attention to detail, you
                            can trust us to elevate your country&apos;s presence
                            at any event. Whether you&apos;re promoting trade,
                            tourism, investment opportunities, our country
                            pavilion exhibition booths provide the perfect
                            platform for showcasing the best of what your nation
                            has to offer.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CountryPavilionIntroSection;
