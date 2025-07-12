"use client";

import React from "react";
import { motion } from "framer-motion";

const PortfolioGalleryHeading = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 !pb-0 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl text-center md:text-4xl font-rubik font-bold mb-2">
                            Check Out Our Latest Events Portfolio
                        </h2>
                        <div className="flex justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PortfolioGalleryHeading;
