"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const KioskContent = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* First Section - CUSTOM KIOSK */}
                    <div className="mb-16">
                        {/* Section Title */}
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333333]">
                                CUSTOM KIOSK
                            </h2>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            className="max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <p className="text-gray-700 text-center">
                                When it comes to taking part in trade shows
                                exhibitors are nowadays looking for digital,
                                interactive & cost-efficient solutions to
                                represent their brand. Customer satisfaction is
                                the main concern of every exhibitor for a
                                successful trade show experience. This is why
                                their interest is shifting towards customized,
                                self-service & engaging{" "}
                                <span className="font-semibold text-[#a5cd39]">
                                    custom Kiosk manufacturers in Dubai
                                </span>{" "}
                                solutions to offer convenience to visitors &
                                address the needs of the customers better.
                            </p>
                        </motion.div>
                    </div>

                    {/* Second Section - WHAT ARE CUSTOM KIOSKS? */}
                    <div>
                        {/* Section Title */}
                        <motion.div
                            className="mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl font-bold mb-4 text-[#333333]">
                                WHAT ARE CUSTOM KIOSKS?
                            </h2>
                        </motion.div>

                        {/* Content Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Left Column - Text */}
                            <motion.div
                                className="flex flex-col justify-center"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-gray-700 mb-6">
                                    Kiosks are non-permanent display booths used
                                    for demonstrating information & advertising
                                    products offered by different brands or
                                    companies. You can easily find them in
                                    public areas that are visited by huge
                                    mob-like shopping malls, museums, movie
                                    theatres, and large-scale trade shows.
                                    Kiosks are a brilliant way to develop a
                                    strong connection with the visitors at the
                                    trade show as they are packed with digital &
                                    interactive features.
                                </p>
                                <p className="text-gray-700">
                                    Custom kiosks are the best as they are
                                    manufactured after an analysis of your
                                    business purposes & needs, unlike standard
                                    kiosks, customized kiosks are cost-effective
                                    as you would pay only for things you need.
                                    These kiosks have a lasting impact on the
                                    visitors & allow them to interact with your
                                    brand.
                                </p>
                            </motion.div>

                            {/* Right Column - Image */}
                            <motion.div
                                className="relative h-[400px] rounded-md overflow-hidden"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop"
                                    alt="Custom Kiosk Solutions"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KioskContent;
