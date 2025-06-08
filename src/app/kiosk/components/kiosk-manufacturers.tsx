"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const KioskManufacturers = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333333]">
                            LOOKING FOR CUSTOM KIOSK MANUFACTURERS IN DUBAI?
                        </h2>
                        <div className="w-24 h-1 bg-[#a5cd39] mx-auto mb-6"></div>
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
                                We are one of the topmost companies involved in
                                custom kiosk manufacturing in Dubai & UAE,
                                offering a broad range of kiosks including mall
                                kiosks, jewelry showcases, and museums,
                                cosmetics, Watch, perfume, electronic displays &
                                much more. Have kiosks in different sizes &
                                styles for you to choose from. Chronicle has
                                showcased our top technology products. Consider
                                all the factors such as floor position, the
                                height of kiosk, safety, security & durability
                                while designing the kiosk.
                            </p>
                            <p className="text-gray-700 mb-6">
                                Chronicle as{" "}
                                <Link
                                    href="/about"
                                    className="text-[#a5cd39] hover:underline"
                                >
                                    Exhibition Stand Builders in UAE
                                </Link>{" "}
                                has years of experience & expertise as a custom
                                kiosk manufacturers in Dubai. A proficient team
                                of kiosk designers & engineers who have the
                                caliber to build creative & innovative kiosks
                                for your specific requirements. Also, deal in
                                the manufacture of retail window exhibits, kiosk
                                stands, exhibition stands & graphic displays.
                                Reach out if you need performance-oriented &
                                advanced custom kiosk solutions for trade shows
                                & any of your business requirements.
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
                            <Image
                                src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2069&auto=format&fit=crop"
                                alt="Custom Kiosk Manufacturers in Dubai"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KioskManufacturers;
