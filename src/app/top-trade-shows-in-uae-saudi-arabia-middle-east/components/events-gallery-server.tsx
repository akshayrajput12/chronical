"use client";

import React, { useState, useEffect, useRef } from "react";
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

const EventsGalleryServer = ({
    events,
    totalCount,
    hasMore,
}: EventsGalleryServerProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();
    const [showAll, setShowAll] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

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
        "February 2026",
    ];

    const getCurrentMonthIndex = () => {
        const now = new Date();
        // filterOptions[0] is 'All', so start from 1
        for (let i = 1; i < filterOptions.length; i++) {
            const [month, year] = filterOptions[i].split(" ");
            if (
                now.getFullYear() === parseInt(year) &&
                now.toLocaleString("en-US", { month: "long" }).toLowerCase() ===
                    month.toLowerCase()
            ) {
                return i;
            }
        }
        return 1; // fallback to first month if not found
    };
    const [currentMonthIndex, setCurrentMonthIndex] = useState(
        getCurrentMonthIndex(),
    );

    // Filter events based on selected date-month
    const getFilteredEvents = () => {
        if (filterOptions[currentMonthIndex] === "All") {
            return events;
        }

        return events.filter(event => {
            if (!event.start_date) return false;

            // Parse the selected filter (e.g., "July 2025")
            const [selectedMonth, selectedYear] =
                filterOptions[currentMonthIndex].split(" ");
            const selectedDate = new Date(
                `${selectedMonth} 1, ${selectedYear}`,
            );
            const selectedMonthStart = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                1,
            );
            const selectedMonthEnd = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth() + 1,
                0,
                23,
                59,
                59,
            );

            // Parse event dates
            const eventStartDate = new Date(event.start_date);
            const eventEndDate = event.end_date
                ? new Date(event.end_date)
                : eventStartDate;

            // Event matches if:
            // 1. Event starts in the selected month
            // 2. Event ends in the selected month
            // 3. Event spans across the selected month (starts before and ends after)
            const startsInMonth =
                eventStartDate >= selectedMonthStart &&
                eventStartDate <= selectedMonthEnd;
            const endsInMonth =
                eventEndDate >= selectedMonthStart &&
                eventEndDate <= selectedMonthEnd;
            const spansMonth =
                eventStartDate < selectedMonthStart &&
                eventEndDate > selectedMonthEnd;

            return startsInMonth || endsInMonth || spansMonth;
        });
    };

    const allEvents = events; // all events, unfiltered
    const filteredEvents = getFilteredEvents();

    // Reset carousel index when events change
    useEffect(() => {
        setCurrentIndex(0);
    }, [allEvents.length]);

    const carouselEvents = allEvents; // always use all events for carousel
    const cardsToShow = 3;
    const carouselMaxIndex = Math.max(0, carouselEvents.length - cardsToShow);

    const nextSlide = () => {
        if (currentIndex < carouselMaxIndex) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            setCurrentIndex(carouselMaxIndex);
        }
    };

    const handleEventClick = (eventSlug: string) => {
        router.push(
            `/top-trade-shows-in-uae-saudi-arabia-middle-east/${eventSlug}`,
        );
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
                {/* Title and View All Button Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 lg:mb-12 gap-4">
                    <h2 className="font-rubik text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center">
                        Upcoming Exhibitions in Middle East
                    </h2>

                    <Button
                        variant="ghost"
                        className="text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm sm:text-base"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? "Show All" : "Show Monthly"}
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                    </Button>
                </div>

                {/* Show Carousel of all events */}
                {!showAll && (
                    <>
                        {/* Carousel */}
                        <div className="relative mb-8">
                            {/* Navigation Buttons */}
                            {allEvents.length > cardsToShow && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={prevSlide}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-600 hover:text-gray-900"
                                        style={{
                                            transform:
                                                "translateY(-50%) translateX(-50%)",
                                        }}
                                    >
                                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={nextSlide}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-600 hover:text-gray-900"
                                        style={{
                                            transform:
                                                "translateY(-50%) translateX(50%)",
                                        }}
                                    >
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                                    </Button>
                                </>
                            )}

                            {/* Carousel Container */}
                            <div className="overflow-hidden mx-8 md:mx-16">
                                <motion.div
                                    className="flex"
                                    animate={{
                                        x: `${
                                            -currentIndex * (100 / cardsToShow)
                                        }%`,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    {allEvents.map((event, index) => (
                                        <div
                                            key={event.id}
                                            className="flex-shrink-0 px-2"
                                            style={{
                                                width: `${100 / cardsToShow}%`,
                                            }}
                                        >
                                            <div
                                                className="bg-white cursor-pointer transition-all duration-500 hover:shadow-xl overflow-hidden h-full group relative"
                                                onClick={() =>
                                                    handleEventClick(event.slug)
                                                }
                                            >
                                                {/* Green accent bar */}
                                                <div
                                                    className="absolute top-0 left-0 w-8 sm:w-12 md:w-16 h-1"
                                                    style={{
                                                        backgroundColor:
                                                            event.category_color ||
                                                            "#22c55e",
                                                        zIndex: 10,
                                                    }}
                                                ></div>

                                                {/* Image */}
                                                <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
                                                    <Image
                                                        src={
                                                            event.featured_image_url ||
                                                            "/placeholder-event.jpg"
                                                        }
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    />
                                                </div>

                                                {/* Card Content */}
                                                <div className="p-4 sm:p-5 md:p-6">
                                                    {/* Date */}
                                                    <div className="text-xs text-gray-600 mb-3 font-medium tracking-wide uppercase">
                                                        {event.date_range ||
                                                            "Date TBD"}
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="font-rubik text-lg sm:text-xl font-semibold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors">
                                                        {event.title}
                                                    </h3>

                                                    {/* Category */}
                                                    <p className="text-xs text-gray-600 font-medium tracking-wide uppercase">
                                                        {event.category_name ||
                                                            "Uncategorized"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Dots Indicator */}
                            {allEvents.length > cardsToShow && (
                                <div className="flex justify-center mt-6 gap-2">
                                    {Array.from(
                                        { length: carouselMaxIndex + 1 },
                                        (_, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setCurrentIndex(index)
                                                }
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    index === currentIndex
                                                        ? "bg-gray-800 w-6"
                                                        : "bg-gray-300 hover:bg-gray-400"
                                                }`}
                                            />
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Show Month Filter and Grid */}
                {showAll && (
                    <>
                        {/* Month Filter UI */}
                        <div
                            className="relative flex items-center justify-between mb-8"
                            style={{ minHeight: 80 }}
                        >
                            {/* Left Arrow & Previous Month */}
                            <button
                                onClick={() =>
                                    setCurrentMonthIndex(i =>
                                        Math.max(1, i - 1),
                                    )
                                }
                                disabled={currentMonthIndex === 1}
                                className="flex flex-col items-center text-gray-500 hover:text-black transition disabled:opacity-30"
                                style={{ minWidth: 80 }}
                                aria-label="Previous Month"
                            >
                                <span className="text-xs font-medium mb-1">
                                    {currentMonthIndex > 1
                                        ? filterOptions[currentMonthIndex - 1]
                                              .split(" ")[0]
                                              .toUpperCase()
                                        : ""}
                                </span>
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            {/* Centered Current Month/Year */}
                            <div className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center w-full pointer-events-none">
                                <span className="text-3xl font-bold text-gray-900">
                                    {filterOptions[currentMonthIndex]}
                                </span>
                                <span className="text-gray-500 text-base mt-1 font-medium">
                                    ({filteredEvents.length}{" "}
                                    {filteredEvents.length === 1
                                        ? "Event"
                                        : "Events"}
                                    )
                                </span>
                            </div>

                            {/* Right Arrow & Next Month */}
                            <button
                                onClick={() =>
                                    setCurrentMonthIndex(i =>
                                        Math.min(
                                            filterOptions.length - 1,
                                            i + 1,
                                        ),
                                    )
                                }
                                disabled={
                                    currentMonthIndex ===
                                    filterOptions.length - 1
                                }
                                className="flex flex-col items-center text-gray-500 hover:text-black transition disabled:opacity-30"
                                style={{ minWidth: 80 }}
                                aria-label="Next Month"
                            >
                                <span className="text-xs font-medium mb-1">
                                    {currentMonthIndex <
                                    filterOptions.length - 1
                                        ? filterOptions[currentMonthIndex + 1]
                                              .split(" ")[0]
                                              .toUpperCase()
                                        : ""}
                                </span>
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Responsive Grid of Events */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden group"
                                        onClick={() =>
                                            handleEventClick(event.slug)
                                        }
                                    >
                                        {/* Green accent bar */}
                                        <div
                                            className="absolute top-0 left-0 w-8 sm:w-12 md:w-16 h-1"
                                            style={{
                                                backgroundColor:
                                                    event.category_color ||
                                                    "#22c55e",
                                                zIndex: 10,
                                            }}
                                        ></div>

                                        {/* Image */}
                                        <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
                                            <Image
                                                src={
                                                    event.featured_image_url ||
                                                    "/placeholder-event.jpg"
                                                }
                                                alt={event.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-4 sm:p-5 md:p-6">
                                            {/* Date */}
                                            <div className="text-xs text-gray-600 mb-3 font-medium tracking-wide uppercase">
                                                {event.date_range || "Date TBD"}
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-rubik text-lg sm:text-xl font-semibold text-gray-900 mb-3 leading-tight">
                                                {event.title}
                                            </h3>

                                            {/* Category */}
                                            <p className="text-xs text-gray-600 font-medium tracking-wide uppercase">
                                                {event.category_name ||
                                                    "Uncategorized"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500 py-12">
                                    No events found for{" "}
                                    {filterOptions[currentMonthIndex]}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default EventsGalleryServer;
