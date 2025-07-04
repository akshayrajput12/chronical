"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Event } from "@/types/events";

interface EventCardProps {
    event: Event;
    index: number;
    onClick: (eventSlug: string) => void;
    className?: string;
    style?: React.CSSProperties;
}

const EventCard = ({
    event,
    index,
    onClick,
    className = "",
    style,
}: EventCardProps) => {
    return (
        <motion.div
            className={`flex-none ${className}`}
            style={style}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            <div
                className="bg-white cursor-pointer mb-8 sm:mb-12 md:mb-16 lg:mb-20 pt-6 sm:pt-8 md:pt-10 lg:pt-12 transition-all duration-500 hover:shadow-lg group rounded-lg flex flex-col"
                onClick={() => onClick(event.slug)}
                style={{
                    width: "100%",
                    // Responsive height maintaining 380:520 aspect ratio
                    height: style?.width
                        ? `${(parseInt(style.width.toString()) * 520) / 380}px`
                        : "520px",
                    border: "0px",
                    backgroundColor: "rgb(255, 255, 255)",
                    position: "relative",
                    fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
            >
                {/* Green accent bar - positioned at very top of card */}
                <div
                    className="absolute top-0 left-0 w-8 sm:w-12 md:w-16 h-1 transition-all duration-300 group-hover:w-12 sm:group-hover:w-16 md:group-hover:w-20"
                    style={{ backgroundColor: "#22c55e", zIndex: 10 }}
                ></div>

                {/* Card Header */}
                <div
                    className="relative px-3 sm:px-4 md:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-10 lg:pb-12"
                    style={{ minHeight: "150px" }}
                >
                    {/* Date */}
                    <div
                        className="text-xs sm:text-xs md:text-xs text-gray-700 mb-3 sm:mb-4 md:mb-5 mt-2 sm:mt-3 md:mt-4 font-medium transition-colors duration-300 group-hover:text-[#22c55e]"
                        style={{ letterSpacing: "1px" }}
                    >
                        {event.date_range}
                    </div>

                    {/* Title */}
                    <h3
                        className="text-base sm:text-lg md:text-xl font-normal text-gray-900 mb-3 sm:mb-4 md:mb-5 leading-tight transition-colors duration-300 group-hover:text-gray-700"
                        style={{ fontFamily: "serif" }}
                    >
                        {event.title}
                    </h3>

                    {/* Category */}
                    <p
                        className="text-xs sm:text-xs md:text-xs text-gray-700 font-medium transition-colors duration-300 group-hover:text-[#22c55e]"
                        style={{ letterSpacing: "1px" }}
                    >
                        {event.category?.name || event.category_name}
                    </p>
                </div>

                {/* Image */}
                <div className="relative flex-1 overflow-hidden">
                    <Image
                        src={event.featured_image_url || '/placeholder-image.jpg'}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;
