"use client";

import React from "react";
import { motion } from "framer-motion";

const PortfolioGalleryHeading = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide">
                            CHECK OUT OUR LATEST EVENTS
                        </h2>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PortfolioGalleryHeading;
