"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { KioskManufacturersSectionData } from "@/types/kiosk";

const KioskManufacturers = () => {
    const [manufacturersData, setManufacturersData] =
        useState<KioskManufacturersSectionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadKioskManufacturersData();
    }, []);

    const loadKioskManufacturersData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use the database function to get manufacturers data
            const { data, error } = await supabase.rpc(
                "get_kiosk_manufacturers_section",
            );

            if (error) {
                console.error(
                    "Error fetching kiosk manufacturers data:",
                    error,
                );
                setError("Failed to load manufacturers section data");
                return;
            }

            if (data && data.length > 0) {
                const manufacturersSection = data[0];

                // Construct proper image URL if file path exists
                let imageUrl = null;
                if (manufacturersSection.main_image_url) {
                    // Get the public URL from Supabase storage
                    const { data: urlData } = supabase.storage
                        .from("kiosk-manufacturers")
                        .getPublicUrl(manufacturersSection.main_image_url);
                    imageUrl = urlData.publicUrl;
                }

                setManufacturersData({
                    ...manufacturersSection,
                    main_image_url: imageUrl,
                });
            } else {
                // Fallback to default data if no data found
                setManufacturersData({
                    id: "",
                    section_heading:
                        "LOOKING FOR CUSTOM KIOSK MANUFACTURERS IN DUBAI?",
                    content_paragraph_1:
                        "We are one of the topmost companies involved in custom kiosk manufacturing in Dubai & UAE, offering a broad range of kiosks including mall kiosks, jewelry showcases, and museums, cosmetics, Watch, perfume, electronic displays & much more. Have kiosks in different sizes & styles for you to choose from. Chronicle has showcased our top technology products. Consider all the factors such as floor position, the height of kiosk, safety, security & durability while designing the kiosk.",
                    content_paragraph_2:
                        "Chronicle as Exhibition Stand Builders in UAE has years of experience & expertise as a custom kiosk manufacturers in Dubai. A proficient team of kiosk designers & engineers who have the caliber to build creative & innovative kiosks for your specific requirements. Also, deal in the manufacture of retail window exhibits, kiosk stands, exhibition stands & graphic displays. Reach out if you need performance-oriented & advanced custom kiosk solutions for trade shows & any of your business requirements.",
                    link_text: "Exhibition Stand Builders in UAE",
                    link_url: "/about",
                    main_image_url:
                        "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2069&auto=format&fit=crop",
                    main_image_alt: "Custom Kiosk Manufacturers in Dubai",
                    is_active: true,
                    created_at: "",
                    updated_at: "",
                });
            }
        } catch (error) {
            console.error("Error loading kiosk manufacturers data:", error);
            setError("Failed to load manufacturers section data");
            // Fallback to default data on error
            setManufacturersData({
                id: "",
                section_heading:
                    "LOOKING FOR CUSTOM KIOSK MANUFACTURERS IN DUBAI?",
                content_paragraph_1:
                    "We are one of the topmost companies involved in custom kiosk manufacturing in Dubai & UAE, offering a broad range of kiosks including mall kiosks, jewelry showcases, and museums, cosmetics, Watch, perfume, electronic displays & much more. Have kiosks in different sizes & styles for you to choose from. Chronicle has showcased our top technology products. Consider all the factors such as floor position, the height of kiosk, safety, security & durability while designing the kiosk.",
                content_paragraph_2:
                    "Chronicle as Exhibition Stand Builders in UAE has years of experience & expertise as a custom kiosk manufacturers in Dubai. A proficient team of kiosk designers & engineers who have the caliber to build creative & innovative kiosks for your specific requirements. Also, deal in the manufacture of retail window exhibits, kiosk stands, exhibition stands & graphic displays. Reach out if you need performance-oriented & advanced custom kiosk solutions for trade shows & any of your business requirements.",
                link_text: "Exhibition Stand Builders in UAE",
                link_url: "/about",
                main_image_url:
                    "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2069&auto=format&fit=crop",
                main_image_alt: "Custom Kiosk Manufacturers in Dubai",
                is_active: true,
                created_at: "",
                updated_at: "",
            });
        } finally {
            setLoading(false);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39] mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            Loading manufacturers section...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Show error state with fallback
    if (error && !manufacturersData) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <p className="text-red-600 mb-2">
                            Error loading manufacturers section
                        </p>
                        <p className="text-gray-600 text-sm">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    // Don't render if section is not active
    if (!manufacturersData?.is_active) {
        return null;
    }

    // Helper function to render content with embedded link
    const renderContentWithLink = (
        content: string,
        linkText?: string,
        linkUrl?: string,
    ) => {
        if (!linkText || !linkUrl) {
            return content;
        }

        const parts = content.split(linkText);
        return parts.map((part, index) => (
            <span key={index}>
                {part}
                {index < parts.length - 1 && (
                    <Link
                        href={linkUrl}
                        className="text-[#a5cd39] hover:underline"
                    >
                        {linkText}
                    </Link>
                )}
            </span>
        ));
    };

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section Title */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-6">
                            {manufacturersData.section_heading}
                        </h2>
                        <div className="w-24 h-1 bg-[#a5cd39] mx-auto mb-4"></div>
                    </motion.div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                        {/* Left Column - Text */}
                        <motion.div
                            className="flex flex-col justify-center"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-gray-700 mb-6">
                                {manufacturersData.content_paragraph_1}
                            </p>
                            <p className="text-gray-700 mb-6">
                                {renderContentWithLink(
                                    manufacturersData.content_paragraph_2,
                                    manufacturersData.link_text,
                                    manufacturersData.link_url,
                                )}
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
                            {manufacturersData.main_image_url ? (
                                <Image
                                    src={manufacturersData.main_image_url}
                                    alt={
                                        manufacturersData.main_image_alt ||
                                        "Custom Kiosk Manufacturers in Dubai"
                                    }
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <p className="text-gray-500">
                                        No image available
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KioskManufacturers;
