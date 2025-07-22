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
    const [cardsToShow, setCardsToShow] = useState(3);
    const [cardWidth, setCardWidth] = useState(320);
    const router = useRouter();
    const [showAll, setShowAll] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

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

    // Reset carousel index if number of all events or cardsToShow changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [allEvents.length, cardsToShow]);

    const carouselEvents = allEvents; // always use all events for carousel
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

    const scrollByCard = (direction: "left" | "right") => {
        if (carouselRef.current) {
            const scrollAmount = cardWidth + 16; // card + gap
            carouselRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
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
                        {/* Carousel (no month filter UI above) */}
                        <div className="relative mx-2 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-16 mb-8">
                            {/* Navigation Buttons (always visible) */}
                            {allEvents.length > cardsToShow && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => scrollByCard("left")}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-100/80 hover:bg-gray-200/80 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-500 hover:text-gray-600"
                                    >
                                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => scrollByCard("right")}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-100/80 hover:bg-gray-200/80 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-500 hover:text-gray-600"
                                    >
                                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                    </Button>
                                </>
                            )}
                            {/* Horizontally scrollable carousel */}
                            <div
                                ref={carouselRef}
                                className="overflow-x-auto w-full scrollbar-hide"
                                style={{ WebkitOverflowScrolling: "touch" }}
                            >
                                <div className="flex gap-4 flex-nowrap">
                                    {allEvents.map((event, index) => (
                                        <div
                                            key={event.id}
                                            className="flex-none min-w-[250px] max-w-[350px] w-[90vw] sm:w-[300px] md:w-[320px] lg:w-[340px] xl:w-[350px]"
                                            style={{
                                                height: "auto",
                                            }}
                                        >
                                            <div
                                                className="bg-white cursor-pointer mb-8 sm:mb-12 md:mb-16 lg:mb-20 transition-all duration-500 hover:shadow-lg rounded-lg"
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
                                                            event.category_color ||
                                                            "#22c55e",
                                                        zIndex: 10,
                                                    }}
                                                ></div>
                                                {/* Image */}
                                                <div className="relative flex-1 overflow-hidden h-48 sm:h-56 md:h-64 lg:h-72">
                                                    <Image
                                                        src={
                                                            event.featured_image_url ||
                                                            "/placeholder-event.jpg"
                                                        }
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
                                                        {event.date_range ||
                                                            "Date TBD"}
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
                                                        {event.category_name ||
                                                            "Uncategorized"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Show Month Filter and Grid */}
                {showAll && (
                    <>
                        {/* Month Filter UI (arrows + month + event count) */}
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
                                        className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer relative"
                                        onClick={() =>
                                            handleEventClick(event.slug)
                                        }
                                    >
                                        {/* Green accent bar - positioned at very top of card (not absolute in grid) */}
                                        <div
                                            className="w-8 sm:w-12 md:w-16 h-1 rounded-t"
                                            style={{
                                                backgroundColor:
                                                    event.category_color ||
                                                    "#22c55e",
                                                zIndex: 10,
                                            }}
                                        ></div>
                                        {/* Image */}
                                        <div className="relative flex-1 overflow-hidden h-48 sm:h-56 md:h-64 lg:h-72">
                                            <Image
                                                src={
                                                    event.featured_image_url ||
                                                    "/placeholder-event.jpg"
                                                }
                                                alt={event.title}
                                                fill
                                                className="object-cover transition-transform duration-300 hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        </div>
                                        {/* Card Header */}
                                        <div
                                            className="relative px-3 sm:px-4 md:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-10 lg:pb-12"
                                            style={{ minHeight: "180px" }}
                                        >
                                            {/* Date */}
                                            <div
                                                className="text-xs sm:text-xs md:text-xs text-gray-700 mb-3 sm:mb-4 md:mb-5 mt-2 sm:mt-3 md:mt-4 font-medium"
                                                style={{ letterSpacing: "1px" }}
                                            >
                                                {event.date_range || "Date TBD"}
                                            </div>
                                            {/* Title */}
                                            <h2 className="text-base whatson-heading font-rubik font-normal sm:text-lg md:text-xl text-gray-900 mb-3 sm:mb-4 md:mb-5 leading-tight">
                                                {event.title}
                                            </h2>
                                            {/* Category */}
                                            <p
                                                className="text-xs sm:text-xs md:text-xs text-gray-700 font-medium"
                                                style={{ letterSpacing: "1px" }}
                                            >
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
