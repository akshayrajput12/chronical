"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/types/events";

interface RelatedEventsClientProps {
    relatedEvents: Event[];
}

const RelatedEventsClient = ({ relatedEvents }: RelatedEventsClientProps) => {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(3);
    const [cardWidth, setCardWidth] = useState(280);
    const [gapSize, setGapSize] = useState(24);

    // Handle responsive cards display and card width
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                // Mobile - show 1 card
                setCardsToShow(1);
                setCardWidth(280);
                setGapSize(16);
            } else if (width < 1024) {
                // Tablet - show 2 cards
                setCardsToShow(2);
                setCardWidth(300);
                setGapSize(20);
            } else {
                // Desktop - show 3 cards
                setCardsToShow(3);
                setCardWidth(320);
                setGapSize(24);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleOtherEventClick = (otherEventSlug: string) => {
        router.push(
            `/top-trade-shows-in-uae-saudi-arabia-middle-east/${otherEventSlug}`,
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = Math.max(0, relatedEvents.length - cardsToShow);
            return prevIndex >= maxIndex ? 0 : prevIndex + 1;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = Math.max(0, relatedEvents.length - cardsToShow);
            return prevIndex <= 0 ? maxIndex : prevIndex - 1;
        });
    };

    return (
        <div className="relative">
            {/* Navigation Arrows - Only show if there are more events than can be displayed */}
            {relatedEvents.length > cardsToShow && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 sm:w-10 sm:h-10 text-gray-600 hover:text-gray-900"
                        onClick={prevSlide}
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 sm:w-10 sm:h-10 text-gray-600 hover:text-gray-900"
                        onClick={nextSlide}
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                </>
            )}

            {/* Events Container */}
            <div className="overflow-hidden px-4 sm:px-8 md:px-12">
                {relatedEvents.length > 0 ? (
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * (cardWidth + gapSize)}px)`,
                            gap: `${gapSize}px`,
                        }}
                    >
                        {relatedEvents.map((relatedEvent, index) => (
                            <motion.div
                                key={relatedEvent.id}
                                className="flex-none cursor-pointer group"
                                style={{ width: `${cardWidth}px` }}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                onClick={() =>
                                    handleOtherEventClick(relatedEvent.slug)
                                }
                            >
                                {/* Responsive Square Image */}
                                <div
                                    className="relative mb-3 overflow-hidden"
                                    style={{
                                        width: `${cardWidth}px`,
                                        height: `${cardWidth}px`
                                    }}
                                >
                                    {/* Category color accent bar */}
                                    <div
                                        className="absolute top-0 left-0 w-6 sm:w-8 h-1 z-10"
                                        style={{
                                            backgroundColor:
                                                relatedEvent.category_color ||
                                                "#22c55e",
                                        }}
                                    ></div>
                                    <Image
                                        src={
                                            relatedEvent.featured_image_url ||
                                            "/placeholder-event.jpg"
                                        }
                                        alt={relatedEvent.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>

                                {/* Content */}
                                <div className="text-center px-2">
                                    <h3 className="font-medium text-xs sm:text-sm mb-1 text-gray-800 leading-tight line-clamp-2">
                                        {relatedEvent.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                        {relatedEvent.category_name}
                                    </p>
                                    {relatedEvent.date_range && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {relatedEvent.date_range}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 sm:py-12">
                        <p className="text-gray-500 text-sm sm:text-base">
                            No related events found.
                        </p>
                        <Link
                            href="/top-trade-shows-in-uae-saudi-arabia-middle-east"
                            className="text-[#a5cd39] hover:underline mt-2 inline-block text-sm sm:text-base"
                        >
                            View all events
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RelatedEventsClient;
