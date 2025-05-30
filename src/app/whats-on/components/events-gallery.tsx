"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAllEvents, Event } from "../data/events";

const EventsGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const router = useRouter();

  // Get all events from centralized data
  const allEvents: Event[] = getAllEvents();

  // Filter options based on event dates
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

  // Filter events based on selected month
  const getFilteredEvents = () => {
    if (selectedFilter === "All") {
      return allEvents;
    }

    return allEvents.filter(event => {
      const eventDate = event.dateRange.toLowerCase();
      const filterMonth = selectedFilter.toLowerCase();

      if (filterMonth.includes("may")) return eventDate.includes("may");
      if (filterMonth.includes("june") || filterMonth.includes("jun")) return eventDate.includes("jun");
      if (filterMonth.includes("july") || filterMonth.includes("jul")) return eventDate.includes("jul");
      if (filterMonth.includes("august") || filterMonth.includes("aug")) return eventDate.includes("aug");
      if (filterMonth.includes("september") || filterMonth.includes("sep")) return eventDate.includes("sep");
      if (filterMonth.includes("october") || filterMonth.includes("oct")) return eventDate.includes("oct");
      if (filterMonth.includes("november") || filterMonth.includes("nov")) return eventDate.includes("nov");
      if (filterMonth.includes("december") || filterMonth.includes("dec")) return eventDate.includes("dec");
      if (filterMonth.includes("january") || filterMonth.includes("jan")) return eventDate.includes("jan");
      if (filterMonth.includes("february") || filterMonth.includes("feb")) return eventDate.includes("feb");

      return false;
    });
  };

  const events = getFilteredEvents();

  // Reset carousel index when filter changes
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [selectedFilter]);

  const nextSlide = () => {
    if (currentIndex < events.length - 3) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop back to beginning for infinite scroll
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      // Loop to end for infinite scroll
      setCurrentIndex(Math.max(0, events.length - 3));
    }
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/whats-on/${eventId}`);
  };



  return (
    <section className="py-16" style={{ backgroundColor: 'rgb(248, 248, 248)' }}>
      <div className="w-full px-8 md:px-12 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">
              Explore DWTC Events
            </h2>
          </div>
          <Button
            variant="ghost"
            className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm font-medium"
          >
            VIEW ALL
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedFilter === filter
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events Carousel Container */}
        {events.length > 0 ? (
          <div className="relative overflow-hidden mx-24">
            {/* Navigation Buttons */}
            {events.length > 3 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-100/80 hover:bg-gray-200/80 shadow-lg rounded-full w-12 h-12 transition-all duration-300 text-gray-500 hover:text-gray-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-100/80 hover:bg-gray-200/80 shadow-lg rounded-full w-12 h-12 transition-all duration-300 text-gray-500 hover:text-gray-600"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

          {/* Events Cards Container with Smooth Sliding */}
          <div className="mx-12 overflow-hidden">
            <motion.div
              className="flex gap-0"
              style={{ width: `${events.length * (100/3)}%` }}
              animate={{ x: -currentIndex * (100/3) + "%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.8
              }}
            >
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="flex-none"
                  style={{ width: `${100/events.length}%` }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="bg-white cursor-pointer"
                    onClick={() => handleEventClick(event.id)}
                    style={{
                      width: '85%',
                      display: 'inline-block',
                      border: '0px',
                      marginTop: '0px',
                      marginBottom: '68px',
                      backgroundColor: 'rgb(255, 255, 255)',
                      transition: '0.5s',
                      position: 'relative',
                      cursor: 'pointer',
                      marginRight: '2px',
                      marginLeft: '2px',
                      paddingTop: '50px',
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }}
                  >
                    {/* Green accent bar - positioned at very top of card */}
                    <div
                      className="absolute top-0 left-0 w-16 h-1"
                      style={{ backgroundColor: '#22c55e', zIndex: 10 }}
                    ></div>

                    {/* Card Header */}
                    <div className="relative px-8 pb-10" style={{ minHeight: '200px' }}>

                      {/* Date */}
                      <div
                        className="text-xs text-gray-700 uppercase mb-5 mt-4 font-medium"
                        style={{ letterSpacing: '1px' }}
                      >
                        {event.dateRange}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-normal text-gray-900 mb-5 leading-tight" style={{ fontFamily: 'serif' }}>
                        {event.title}
                      </h2>

                      {/* Category */}
                      <p
                        className="text-xs text-gray-700 uppercase font-medium"
                        style={{ letterSpacing: '1px' }}
                      >
                        {event.category}
                      </p>
                    </div>

                    {/* Image */}
                    <div className="relative flex-1 overflow-hidden" style={{ height: '300px' }}>
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found for {selectedFilter}</p>
          </div>
        )}

        {/* Mobile View All Button */}
        <motion.div
          className="flex md:hidden justify-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 transition-all duration-300"
          >
            VIEW ALL EVENTS
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsGallery;
