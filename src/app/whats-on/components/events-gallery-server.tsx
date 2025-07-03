"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimationGeneratorType } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Event } from "@/types/events";

interface EventsGalleryServerProps {
    events: Event[];
    totalCount: number;
    hasMore: boolean;
}

const EventsGalleryServer = ({ events, totalCount, hasMore }: EventsGalleryServerProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [cardsToShow, setCardsToShow] = useState(3);
    const [cardWidth, setCardWidth] = useState(320);
    const router = useRouter();

    // Handle responsive cards display and card width - Always show 3 cards
    useEffect(() => {
        const handleResize = () => {
            setCardsToShow(3); // Always show 3 cards

            // Calculate card width to fit 3 cards with gaps
            const containerPadding =
                window.innerWidth < 640
                    ? 16
                    : window.innerWidth < 1024
                    ? 32
                    : 64;
            const totalGaps = 2 * 16; // 2 gaps between 3 cards (16px each)
            const availableWidth =
                window.innerWidth - containerPadding * 2 - totalGaps;
            const calculatedCardWidth = Math.floor(availableWidth / 3);

            // Set minimum and maximum card widths
            const minCardWidth = 250;
            const maxCardWidth = 350;

            setCardWidth(
                Math.max(
                    minCardWidth,
                    Math.min(maxCardWidth, calculatedCardWidth),
                ),
            );
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Generate predefined filter options from May 2025 to February 2026
    const filterOptions = [
        "All",
        "May 2025",
        "June 2025",
        "July 2025",
        "August 2025",
        "September 2025",
        "October 2025",
        "November 2025",
        "December 2025",
        "January 2026",
        "February 2026"
    ];

    // Filter events based on selected date-month
    const getFilteredEvents = () => {
        if (selectedFilter === "All") {
            return events;
        }

        return events.filter(event => {
            if (!event.start_date) return false;

            const eventDate = new Date(event.start_date);
            const eventMonthYear = eventDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });

            return eventMonthYear === selectedFilter;
        });
    };

    const filteredEvents = getFilteredEvents();

    // Reset carousel index when filter changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedFilter]);

    // Calculate max index
    const maxIndex = Math.max(0, filteredEvents.length - cardsToShow);

    const nextSlide = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Loop back to beginning for infinite scroll
            setCurrentIndex(0);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            // Loop to end for infinite scroll
            setCurrentIndex(maxIndex);
        }
    };

    const handleEventClick = (eventSlug: string) => {
        router.push(`/whats-on/${eventSlug}`);
    };

    // Empty state
    if (!events || events.length === 0) {
        return (
            <section
                className="py-12 sm:py-16 lg:py-20"
                style={{ backgroundColor: "rgb(248, 248, 248)" }}
            >
                <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            No Events Available
                        </h2>
                        <p className="text-gray-600">
                            Check back soon for upcoming events and exhibitions.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="py-12 sm:py-16 lg:py-20"
            style={{ backgroundColor: "rgb(248, 248, 248)" }}
        >
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                {/* Header */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 lg:mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center sm:text-left flex-1 mb-4 sm:mb-0">
                        <h2 className=".whatson-heading font-rubik text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Explore DWTC Events
                        </h2>
                    </div>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    className="mb-8 sm:mb-10 lg:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                        {filterOptions.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded ${
                                    selectedFilter === filter
                                        ? "bg-black text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Events Carousel Container */}
                {filteredEvents.length > 0 ? (
                    <div className="relative mx-2 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-16">
                        {/* Visible area for exactly 3 cards */}
                        <div
                            className="overflow-hidden"
                            style={{
                                width: `${3 * cardWidth + 2 * 16}px`, // 3 cards + 2 gaps
                                margin: "0 auto", // Center the container
                            }}
                        >
                            {/* Navigation Buttons */}
                            {filteredEvents.length > cardsToShow && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={prevSlide}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-100/80 hover:bg-gray-200/80 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-500 hover:text-gray-600"
                                    >
                                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={nextSlide}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-100/80 hover:bg-gray-200/80 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-500 hover:text-gray-600"
                                    >
                                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                    </Button>
                                </>
                            )}

                            {/* Events Cards Container with Smooth Sliding */}
                            <div className="overflow-hidden">
                                <motion.div
                                    className="flex gap-4"
                                    style={{
                                        width: `${
                                            filteredEvents.length * (cardWidth + 16)
                                        }px`, // cardWidth + gap
                                        transform: `translateX(-${
                                            currentIndex * (cardWidth + 16)
                                        }px)`,
                                    }}
                                    animate={{
                                        transform: `translateX(-${
                                            currentIndex * (cardWidth + 16)
                                        }px)`,
                                    }}
                                    transition={{
                                        type: "spring" as
                                            | AnimationGeneratorType
                                            | undefined,
                                        stiffness: 300,
                                        damping: 30,
                                        duration: 0.8,
                                    }}
                                >
                                    {filteredEvents.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            className="flex-none"
                                            style={{ width: `${cardWidth}px` }}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.6,
                                                delay: index * 0.1,
                                            }}
                                            viewport={{ once: true }}
                                        >
                                            <div
                                                className="bg-white cursor-pointer mb-8 sm:mb-12 md:mb-16 lg:mb-20  transition-all duration-500 hover:shadow-lg rounded-lg"
                                                onClick={() =>
                                                    handleEventClick(event.slug)
                                                }
                                                style={{
                                                    width: "100%",
                                                    height: "auto",
                                                    border: "0px",
                                                    backgroundColor:
                                                        "rgb(255, 255, 255)",
                                                    position: "relative",
                                                    fontFamily:
                                                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                                }}
                                            >
                                                {/* Green accent bar - positioned at very top of card */}
                                                <div
                                                    className="absolute top-0 left-0 w-8 sm:w-12 md:w-16 h-1"
                                                    style={{
                                                        backgroundColor:
                                                            event.category_color || "#22c55e",
                                                        zIndex: 10,
                                                    }}
                                                ></div>

                                                {/* Image */}
                                                <div className="relative flex-1 overflow-hidden h-48 sm:h-56 md:h-64 lg:h-72">
                                                    <Image
                                                        src={event.featured_image_url || '/placeholder-event.jpg'}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    />
                                                </div>
                                                {/* Card Header */}
                                                <div
                                                    className="relative px-3 sm:px-4 md:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-10 lg:pb-12"
                                                    style={{
                                                        minHeight: "180px",
                                                    }}
                                                >
                                                    {/* Date */}
                                                    <div
                                                        className="text-xs sm:text-xs md:text-xs text-gray-700 mb-3 sm:mb-4 md:mb-5 mt-2 sm:mt-3 md:mt-4 font-medium"
                                                        style={{
                                                            letterSpacing:
                                                                "1px",
                                                        }}
                                                    >
                                                        {event.date_range || 'Date TBD'}
                                                    </div>

                                                    {/* Title */}
                                                    <h2 className="text-base whatson-heading font-rubik font-normal sm:text-lg md:text-xl text-gray-900 mb-3 sm:mb-4 md:mb-5 leading-tight">
                                                        {event.title}
                                                    </h2>

                                                    {/* Category */}
                                                    <p
                                                        className="text-xs sm:text-xs md:text-xs text-gray-700 font-medium"
                                                        style={{
                                                            letterSpacing:
                                                                "1px",
                                                        }}
                                                    >
                                                        {event.category_name || 'Uncategorized'}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No events found for {selectedFilter}
                        </p>
                    </div>
                )}

                {/* Mobile/Tablet View All Button */}
                <motion.div
                    className="flex lg:hidden justify-center mt-6 sm:mt-8 md:mt-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <Button
                        variant="ghost"
                        className="text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm sm:text-base"
                    >
                        VIEW ALL EVENTS
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default EventsGalleryServer;
