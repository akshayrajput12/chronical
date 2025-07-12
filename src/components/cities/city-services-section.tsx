"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LegacyCity } from "@/types/cities";

interface CityServicesSectionProps {
    city: LegacyCity;
}

const CityServicesSection = ({ city }: CityServicesSectionProps) => {
    const services = [
        {
            title: "CUSTOM STANDS",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            href: "/custom-exhibition-stands-dubai-uae",
            alt: "Custom Exhibition Stands",
        },
        {
            title: "DOUBLE STOREY STANDS",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
            href: "/double-decker-exhibition-stands-in-dubai",
            alt: "Double Decker Exhibition Stands",
        },
        {
            title: "PAVILION STANDS",
            image: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
            href: "/country-pavilion-expo-booth-solutions-dubai",
            alt: "Country Pavilion Expo Booth Solutions",
        },
    ];

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide leading-tight mb-8">
                            EXHIBITION STAND BUILDERS FOR YOUR TRADE SHOW NEEDS
                            IN {city.name.toUpperCase()}
                        </h2>

                        <p className="text-base leading-relaxed text-gray-700 max-w-5xl mx-auto text-center">
                            We Craft exceptional exhibition stands tailored to
                            your brand and trade show needs. Our expert
                            designers and exhibition stand builders create
                            different type of stands like custom, modular,
                            double storey and country pavilion stands that
                            captivate audiences, ensuring your brand shines at
                            every event. Let us design and build your unique
                            exhibition stand, elevating your presence and
                            leaving a lasting impression.
                        </p>
                    </motion.div>

                    {/* Services Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.1 * index,
                                }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    href={service.href}
                                    className="block group relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Image Container - Full Card Height */}
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <Image
                                            src={service.image}
                                            alt={service.alt}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />

                                        {/* Service Label - Positioned at Bottom Center */}
                                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                                            <div
                                                className="px-8 py-3 text-white font-bold text-sm uppercase tracking-wide text-center whitespace-nowrap"
                                                style={{
                                                    backgroundColor: "#a5cd39",
                                                }}
                                            >
                                                {service.title}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CityServicesSection;
