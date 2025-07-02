"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ContactMapSettings } from "@/types/contact";
import { contactPageService } from "@/lib/services/contact";

const ContactParking = () => {
    const [mapSettings, setMapSettings] = useState<ContactMapSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMapSettings = async () => {
            try {
                const settings = await contactPageService.getMapSettings();
                setMapSettings(settings);
            } catch (error) {
                console.error("Error fetching map settings:", error);
                // Use default settings on error
                setMapSettings({
                    id: "default",
                    map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5139890547107!2d55.38061577600814!3d25.28692967765328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f42e5a9ddaf97%3A0x563a582dbda7f14c!2sChronicle%20Exhibition%20Organizing%20L.L.C%20%7C%20Exhibition%20Stand%20Builder%20in%20Dubai%2C%20UAE%20-%20Middle%20East!5e0!3m2!1sen!2sin!4v1750325309116!5m2!1sen!2sin",
                    map_title: "Dubai World Trade Centre Location",
                    map_height: 400,
                    parking_title: "On-site parking at Dubai World Trade Centre",
                    parking_description: "PLAN YOUR ARRIVAL BY EXPLORING OUR USEFUL PARKING AND ACCESSIBILITY MAPS.",
                    parking_background_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    parking_maps_download_url: "#",
                    google_maps_url: "https://maps.google.com",
                    show_parking_section: true,
                    show_map_section: true,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMapSettings();
    }, []);

    if (loading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5cd39] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading parking information...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!mapSettings) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <p className="text-red-600">Error loading parking information. Please refresh the page.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Top Button */}
                    {mapSettings.google_maps_url && (
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
                                    window.open(mapSettings.google_maps_url, "_blank")
                                }
                            >
                                OPEN IN GOOGLE MAP
                            </Button>
                        </motion.div>
                    )}

                    {/* Main Parking Section */}
                    <motion.div
                        className="relative h-48 bg-cover bg-center overflow-hidden rounded-lg shadow-lg border border-gray-200"
                        style={{
                            backgroundImage: `url('${mapSettings.parking_background_image}')`,
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
                                        {mapSettings.parking_title?.split(' ').map((word, index, array) => {
                                            // Split title into lines for better display
                                            const midPoint = Math.ceil(array.length / 2);
                                            if (index === midPoint) {
                                                return (
                                                    <span key={index}>
                                                        <br />
                                                        {word}
                                                    </span>
                                                );
                                            }
                                            return index === array.length - 1 ? word : word + ' ';
                                        })}
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-300 tracking-wider font-light">
                                        {mapSettings.parking_description?.split(' ').map((word, index, array) => {
                                            // Add line break for better formatting
                                            const midPoint = Math.ceil(array.length / 2);
                                            if (index === midPoint) {
                                                return (
                                                    <span key={index}>
                                                        <br />
                                                        {word}
                                                    </span>
                                                );
                                            }
                                            return index === array.length - 1 ? word : word + ' ';
                                        })}
                                    </p>
                                </div>

                                {mapSettings.parking_maps_download_url && (
                                    <div className="hidden md:block flex-shrink-0 ml-8">
                                        <Button
                                            className="bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-6 py-2 text-xs font-normal transition-all duration-300 rounded-full tracking-wider"
                                            onClick={() =>
                                                window.open(mapSettings.parking_maps_download_url, "_blank")
                                            }
                                        >
                                            DOWNLOAD THE MAPS
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile button */}
                        {mapSettings.parking_maps_download_url && (
                            <div className="md:hidden absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
                                <Button
                                    className="bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-4 py-1 text-xs font-normal transition-all duration-300 rounded-full tracking-wider"
                                    onClick={() => window.open(mapSettings.parking_maps_download_url, "_blank")}
                                >
                                    DOWNLOAD THE MAPS
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactParking;
