"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const VirtualEventsSection = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            className="order-1 lg:order-1"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-6">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide">
                                    TROUBLE-FREE VIRTUAL EVENTS
                                </h2>

                                <div className="space-y-4 text-gray-700">
                                    <p className="text-base leading-relaxed text-justify">
                                        Looking for eleventh-hour virtual
                                        meeting & conference solutions? Connect
                                        with us. The pandemic situation made
                                        online events really popular.
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        We being a notable name in the event
                                        management sector, create an impressive
                                        virtual environment allowing you to have
                                        a meaningful interaction.
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        We pay attention to everything including
                                        software, streaming, & participant
                                        support to ensure you a hassle-free
                                        experience.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Image with Colored Background */}
                        <motion.div
                            className="order-2 lg:order-2 relative"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* Green Background */}
                            <div
                                className="absolute -bottom-6 -right-6 w-full h-full z-0"
                                style={{ backgroundColor: "#a5cd39" }}
                            ></div>

                            {/* Image Container */}
                            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                                <Image
                                    src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                    alt="Virtual conference and online meeting"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VirtualEventsSection;
