"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Event } from "@/app/whats-on/data/events";
import EventCard from "./event-card";

interface EventCarouselProps {
  events: Event[];
  onEventClick: (eventId: string) => void;
}

const EventCarousel = ({ events, onEventClick }: EventCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [cardWidth, setCardWidth] = useState(320);

  // Handle responsive cards display and card width - Always show 3 cards
  React.useEffect(() => {
    const handleResize = () => {
      setCardsToShow(3); // Always show 3 cards

      // Calculate card width to fit 3 cards with gaps
      const containerPadding = window.innerWidth < 640 ? 16 : window.innerWidth < 1024 ? 32 : 64;
      const totalGaps = 2 * 16; // 2 gaps between 3 cards (16px each)
      const availableWidth = window.innerWidth - (containerPadding * 2) - totalGaps;
      const calculatedCardWidth = Math.floor(availableWidth / 3);

      // Set minimum and maximum card widths
      const minCardWidth = 250;
      const maxCardWidth = 350;

      setCardWidth(Math.max(minCardWidth, Math.min(maxCardWidth, calculatedCardWidth)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate max index
  const maxIndex = Math.max(0, events.length - cardsToShow);

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
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
      setCurrentIndex(maxIndex);
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No events available</p>
      </div>
    );
  }

  return (
    <div className="relative mx-2 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-16">
      {/* Visible area for exactly 3 cards */}
      <div
        className="overflow-hidden"
        style={{
          width: `${3 * cardWidth + 2 * 16}px`, // 3 cards + 2 gaps
          margin: '0 auto' // Center the container
        }}
      >
        {/* Navigation Buttons */}
        {events.length > cardsToShow && (
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
            width: `${events.length * (cardWidth + 16)}px`, // cardWidth + gap
            transform: `translateX(-${currentIndex * (cardWidth + 16)}px)`
          }}
          animate={{
            transform: `translateX(-${currentIndex * (cardWidth + 16)}px)`
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.8
          }}
        >
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              onClick={onEventClick}
              style={{ width: `${cardWidth}px` }}
            />
          ))}
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventCarousel;
