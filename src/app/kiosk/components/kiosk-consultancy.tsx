"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const KioskConsultancy = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-[#a5cd39] text-black">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h2
                        className="text-2xl md:text-3xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        FREE KIOSK DESIGN CONSULTANCY NOW
                    </motion.h2>

                    <motion.div
                        className="flex flex-col md:flex-row items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <a
                            href="tel:+971554974645"
                            className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-black/80 transition-all duration-300"
                        >
                            <Phone className="mr-2 h-5 w-5" />
                            Call +971 (543) 47-6649
                        </a>
                        <span className="text-black font-medium">
                            or submit inquiry form below
                        </span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default KioskConsultancy;
