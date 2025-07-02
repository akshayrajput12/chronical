"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ContactMapSettings } from "@/types/contact";
import { contactPageService } from "@/lib/services/contact";

const ContactMap = () => {
    const [mapSettings, setMapSettings] = useState<ContactMapSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchMapSettings = async () => {
            try {
                const settings = await contactPageService.getMapSettings();
                setMapSettings(settings);
            } catch (error) {
                console.error("Error fetching map settings:", error);
                setError("Failed to load map settings. Please refresh the page.");
                setMapSettings(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMapSettings();
    }, []);

    if (loading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 !pb-0 bg-white">
                <div className="mx-auto">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5cd39] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading map...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !mapSettings) {
        return (
            <section className="py-8 md:py-12 lg:py-16 !pb-0 bg-white">
                <div className="mx-auto">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error || "Error loading map settings. Please refresh the page."}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#a5cd39] hover:bg-[#8fb32a] text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 !pb-0 bg-white">
            <div className="mx-auto">
                <div className="mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-full" style={{ height: `${mapSettings.map_height}px` }}>
                            <iframe
                                src={mapSettings.map_embed_url}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={mapSettings.map_title}
                            ></iframe>
                        </div>
                        {mapSettings.google_maps_url && (
                            <div className="text-center mt-4">
                                <a
                                    href={mapSettings.google_maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-[#a5cd39] hover:bg-[#8fb32a] text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                                >
                                    Get Directions
                                </a>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactMap;
