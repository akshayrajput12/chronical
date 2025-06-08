"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ContactParking = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Top Button */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            className="bg-white border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-6 py-2 text-sm font-medium transition-all duration-300 rounded-md shadow-sm"
                            onClick={() =>
                                window.open("https://maps.google.com", "_blank")
                            }
                        >
                            OPEN IN GOOGLE MAP
                        </Button>
                    </motion.div>

                    {/* Main Parking Section */}
                    <motion.div
                        className="relative h-48 bg-cover bg-center overflow-hidden rounded-lg shadow-lg border border-gray-200"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
                        }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/60"></div>

                        {/* Bokeh effect overlay */}
                        <div className="absolute inset-0">
                            {/* Simulated bokeh circles - more prominent */}
                            <div className="absolute top-2 left-6 w-8 h-8 bg-white/30 rounded-full blur-sm"></div>
                            <div className="absolute top-6 left-16 w-6 h-6 bg-white/25 rounded-full blur-sm"></div>
                            <div className="absolute top-8 left-28 w-10 h-10 bg-white/20 rounded-full blur-md"></div>
                            <div className="absolute top-4 right-12 w-7 h-7 bg-white/35 rounded-full blur-sm"></div>
                            <div className="absolute top-10 right-24 w-9 h-9 bg-white/25 rounded-full blur-md"></div>
                            <div className="absolute top-12 right-6 w-5 h-5 bg-white/40 rounded-full blur-sm"></div>
                            <div className="absolute bottom-6 left-12 w-8 h-8 bg-white/30 rounded-full blur-sm"></div>
                            <div className="absolute bottom-8 left-24 w-6 h-6 bg-white/35 rounded-full blur-sm"></div>
                            <div className="absolute bottom-4 right-16 w-7 h-7 bg-white/25 rounded-full blur-md"></div>
                            <div className="absolute bottom-10 right-32 w-10 h-10 bg-white/20 rounded-full blur-lg"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center">
                            <div className="w-full max-w-7xl mx-auto px-8 flex justify-between items-center">
                                <div className="text-white flex-1">
                                    <h2 className="text-xl md:text-2xl font-normal mb-1 leading-tight">
                                        On-site parking at Dubai World
                                        <br />
                                        Trade Centre
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-300 uppercase tracking-wider font-light">
                                        PLAN YOUR ARRIVAL BY EXPLORING OUR
                                        USEFUL PARKING AND
                                        <br />
                                        ACCESSIBILITY MAPS.
                                    </p>
                                </div>

                                <div className="hidden md:block flex-shrink-0 ml-8">
                                    <Button
                                        className="bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-6 py-2 text-xs font-normal transition-all duration-300 rounded-full uppercase tracking-wider"
                                        onClick={() =>
                                            window.open("#", "_blank")
                                        }
                                    >
                                        DOWNLOAD THE MAPS
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile button */}
                        <div className="md:hidden absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
                            <Button
                                className="bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-4 py-1 text-xs font-normal transition-all duration-300 rounded-full uppercase tracking-wider"
                                onClick={() => window.open("#", "_blank")}
                            >
                                DOWNLOAD THE MAPS
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactParking;
