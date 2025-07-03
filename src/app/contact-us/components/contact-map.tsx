"use client";

import React from "react";
import { motion } from "framer-motion";
import { ContactMapSettings } from "@/types/contact";

interface ContactMapProps {
    mapSettings: ContactMapSettings | null;
}

const ContactMap: React.FC<ContactMapProps> = ({ mapSettings }) => {
    // Default fallback data
    const defaultMapSettings: ContactMapSettings = {
        id: "default",
        map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1234567890!2d55.2708!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDEyJzE3LjMiTiA1NcKwMTYnMTQuOSJF!5e0!3m2!1sen!2sae!4v1234567890123",
        map_title: "Chronicle Exhibits Location",
        map_height: 400,
        parking_title: "Parking Information",
        parking_description: "Free parking available on-site",
        parking_background_image: "",
        parking_maps_download_url: "",
        google_maps_url: "https://maps.google.com",
        show_parking_section: false,
        show_map_section: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const displayData = mapSettings || defaultMapSettings;

    if (!displayData.show_map_section) {
        return null;
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
                        <div className="w-full" style={{ height: `${displayData.map_height}px` }}>
                            <iframe
                                src={displayData.map_embed_url}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={displayData.map_title}
                            ></iframe>
                        </div>
                        {displayData.google_maps_url && (
                            <div className="text-center mt-4">
                                <a
                                    href={displayData.google_maps_url}
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
