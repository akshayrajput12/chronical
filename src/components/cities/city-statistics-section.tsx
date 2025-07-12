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

    const IconComponent = iconName
        ? iconMap[iconName as keyof typeof iconMap]
        : Users;
    return IconComponent || Users;
};

const CityStatisticsSection = ({ city }: CityStatisticsSectionProps) => {
    // Get statistics from admin - no static fallbacks
    const statistics =
        city.statistics
            ?.filter(
                stat =>
                    stat.is_active && stat.title?.trim() && stat.value?.trim(),
            )
            .sort((a, b) => a.sort_order - b.sort_order) || [];

    // Only render if we have statistics from admin
    if (statistics.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-20 lg:py-24 bg-white relative">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/images/stats-bg.jpg')",
                }}
            />
            <div className="absolute inset-0 bg-black/60" />{" "}
            {/* Dark overlay */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {statistics.map((statistic, index) => {
                        const IconComponent = getStatisticIcon(
                            statistic.icon_name,
                        );

                        return (
                            <motion.div
                                key={statistic.id}
                                className="text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.1 * index,
                                }}
                                viewport={{ once: true }}
                            >
                                {/* Statistic Value */}
                                <div className="mb-2">
                                    <h2 className="text-xl text-[#a5cd39] font-rubik! md:text-2xl lg:text-3xl xl:text-4xl ml-1 font-medium">
                                        {statistic.value}
                                    </h2>
                                </div>

                                <h3
                                    className={
                                        "text-base sm:text-lg md:text-xl lg:text-2xl mt-2 hover:-translate-y-0.5 transition-transform duration-200 font-medium font-markazi-text text-white"
                                    }
                                >
                                    {statistic.title}
                                </h3>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CityStatisticsSection;
