"use client";

import React from "react";
import { motion } from "framer-motion";
import CityCard from "./city-card";

interface City {
    id: number;
    name: string;
    slug: string;
    image: string;
}

interface CitiesGridProps {
    cities: City[];
}

const CitiesGrid = ({ cities }: CitiesGridProps) => {
    return (
        <section id="cities-grid" className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-6">
                            Where We Operate
                        </h2>
                        <div className="w-24 h-1 bg-[#a5cd39] mx-auto"></div>
                    </motion.div>

                    {/* Cities Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
                        {cities.map((city, index) => (
                            <CityCard key={city.id} city={city} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CitiesGrid;
