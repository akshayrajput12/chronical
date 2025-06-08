"use client";

import React from "react";
import { motion } from "framer-motion";

const ConferenceSolutionSection = () => {
    return (
        <section
            className="py-8 md:py-12 lg:py-16"
            style={{ backgroundColor: "#a5cd39" }}
        >
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 uppercase tracking-wide">
                            NEED CONFERENCE SOLUTION?
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <div className="bg-black text-white px-6 py-3 rounded-lg inline-block">
                                <span className="text-base sm:text-lg font-semibold">
                                    Call +971 (543) 47-4645
                                </span>
                            </div>
                            <span className="text-black text-base sm:text-lg">
                                or submit enquiry form below
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ConferenceSolutionSection;
