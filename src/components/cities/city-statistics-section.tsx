"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, Headphones, Trophy } from "lucide-react";
import { LegacyCity } from "@/types/cities";

interface CityStatisticsSectionProps {
    city: LegacyCity;
}

// Icon mapping for different statistic types
const getStatisticIcon = (iconName?: string) => {
    const iconMap = {
        users: Users,
        briefcase: Briefcase,
        headphones: Headphones,
        trophy: Trophy,
    };
    
    const IconComponent = iconName ? iconMap[iconName as keyof typeof iconMap] : Users;
    return IconComponent || Users;
};

const CityStatisticsSection = ({ city }: CityStatisticsSectionProps) => {
    // Get statistics from admin - no static fallbacks
    const statistics = city.statistics?.filter(stat =>
        stat.is_active &&
        stat.title?.trim() &&
        stat.value?.trim()
    ).sort((a, b) => a.sort_order - b.sort_order) || [];

    // Only render if we have statistics from admin
    if (statistics.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-20 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {statistics.map((statistic, index) => {
                        const IconComponent = getStatisticIcon(statistic.icon_name);

                        return (
                            <motion.div
                                key={statistic.id}
                                className="text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 * index }}
                                viewport={{ once: true }}
                            >
                                {/* Icon Container */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center bg-[#a5cd39]">
                                        <IconComponent
                                            className="w-8 h-8 md:w-10 md:h-10 text-white"
                                        />
                                    </div>
                                </div>

                                {/* Statistic Value */}
                                <div className="mb-2">
                                    <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                                        {statistic.value}
                                    </span>
                                </div>

                                {/* Statistic Title */}
                                <div>
                                    <span className="text-sm md:text-base lg:text-lg text-gray-600 font-medium">
                                        {statistic.title}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CityStatisticsSection;
