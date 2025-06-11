"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface City {
    id: number;
    name: string;
    slug: string;
    image: string;
}

interface CityCardProps {
    city: City;
    index: number;
}

const CityCard = ({ city, index }: CityCardProps) => {
    return (
        <motion.div
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-gray-100 hover:border-[#a5cd39]/20 group relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Location Pin Icon with circular background */}
            <div className="flex justify-center mb-6 relative z-10">
                <div className="relative">
                    {/* Outer ring */}
                    <div className="w-16 h-16 bg-[#a5cd39]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {/* Inner circle with icon */}
                        <div className="w-12 h-12 bg-[#a5cd39] rounded-full flex items-center justify-center shadow-lg">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* City Name */}
            <h3 className="text-2xl font-bold text-[#a5cd39] mb-8 group-hover:text-[#8fb82e] transition-colors duration-300 relative z-10">
                {city.name}
            </h3>

            {/* View More Button */}
            <div className="relative z-10">
                <Link href={`/cities/${city.slug}`}>
                    <Button className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 min-w-[120px] uppercase tracking-wide">
                        View More
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
};

export default CityCard;
