"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimationGeneratorType } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { LegacyCity } from "@/types/cities";

interface CityPortfolioSectionProps {
    city: LegacyCity;
}

const CityPortfolioSection = ({ city }: CityPortfolioSectionProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(5);
    const [cardWidth, setCardWidth] = useState(280);
    const [cardHeight, setCardHeight] = useState(320);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Handle responsive cards display and card dimensions - Show 5 cards
    React.useEffect(() => {
        const handleResize = () => {
            setCardsToShow(5); // Always show 5 cards

            // Calculate card width to use full viewport width
            const viewportWidth = window.innerWidth;
            const totalGaps = 4 * 16; // 4 gaps between 5 cards (16px each)
            const availableWidth = viewportWidth - totalGaps;

            // Set minimum and maximum card widths
            let minCardWidth = 260;
            let maxCardWidth = 420;

            // On mobile, use 90vw (almost full width)
            if (viewportWidth < 640) {
                minCardWidth = Math.max(
                    minCardWidth,
                    Math.floor(viewportWidth * 0.9),
                );
                maxCardWidth = Math.min(
                    maxCardWidth,
                    Math.floor(viewportWidth * 0.98),
                );
            }

            const calculatedCardWidth = Math.floor(availableWidth / 5);
            setCardWidth(
                Math.max(
                    minCardWidth,
                    Math.min(maxCardWidth, calculatedCardWidth),
                ),
            );

            // Set card height proportionally
            setCardHeight(Math.floor(cardWidth * 1.2));
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Pause auto-play on hover
    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    // Get portfolio items from admin - no static fallbacks
    const portfolioItems =
        city.portfolioItems
            ?.filter(item => item.image_url?.trim() && item.title?.trim())
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(item => ({
                id: item.id,
                src: item.image_url,
                alt: item.alt_text || item.title,
                title: item.title,
                category: item.category || "General",
                description: item.description,
                project_year: item.project_year,
                client_name: item.client_name,
                is_featured: item.is_featured,
            })) || [];

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => {
                const maxIndex = Math.max(
                    0,
                    portfolioItems.length - cardsToShow,
                );
                if (prevIndex >= maxIndex) {
                    return 0; // Loop back to beginning
                }
                return prevIndex + 1;
            });
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, cardsToShow, portfolioItems.length]);

    // Calculate max index
    const maxIndex = Math.max(0, portfolioItems.length - cardsToShow);

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

    const handlePortfolioClick = (itemId: string) => {
        // Handle portfolio item click - you can add navigation logic here
        console.log(`Portfolio item ${itemId} clicked`);
    };

    // Only render if we have portfolio items from admin
    if (!portfolioItems || portfolioItems.length === 0) {
        return null;
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                {/* Header */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-between mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center sm:text-left flex-1 mb-4 sm:mb-0">
                        <h2 className="font-rubik mx-auto text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Portfolio in {city.name}
                        </h2>
                        <div className="flex !mb-3 justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-1 mb-0"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Portfolio Carousel Container - Full Width */}
                {portfolioItems.length > 0 ? (
                    <div
                        className="relative w-full"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Navigation Buttons */}
                        {portfolioItems.length > cardsToShow && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-100/80 hover:bg-gray-200/80 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-500 hover:text-gray-600"
                                >
                                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-100/80 hover:bg-gray-200/80 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-500 hover:text-gray-600"
                                >
                                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                </Button>
                            </>
                        )}

                        {/* Portfolio Cards Container with Smooth Sliding */}
                        <div className="overflow-hidden">
                            <motion.div
                                className="flex gap-4"
                                style={{
                                    width: `${
                                        portfolioItems.length * (cardWidth + 16)
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
                                {portfolioItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        className="flex-none"
                                        style={{
                                            width: `${cardWidth}px`,
                                            maxWidth: "98vw",
                                            minHeight: "70px",
                                        }}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                    >
                                        <div
                                            className="bg-white cursor-pointer transition-all duration-500 hover:shadow-lg rounded-lg"
                                            onClick={() =>
                                                handlePortfolioClick(item.id)
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
                                                    backgroundColor: "#22c55e",
                                                    zIndex: 10,
                                                }}
                                            ></div>

                                            {/* Image */}
                                            <div
                                                className="relative flex-1 overflow-hidden"
                                                style={{
                                                    height: `${
                                                        cardHeight * 0.6
                                                    }px`,
                                                }}
                                            >
                                                <img
                                                    src={item.src}
                                                    alt={item.alt}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Auto-play indicator dots */}
                        <div className="flex justify-center mt-6 space-x-2">
                            {Array.from(
                                {
                                    length: Math.ceil(
                                        portfolioItems.length / cardsToShow,
                                    ),
                                },
                                (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            setCurrentIndex(i * cardsToShow)
                                        }
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            Math.floor(
                                                currentIndex / cardsToShow,
                                            ) === i
                                                ? "bg-[#a5cd39] w-6"
                                                : "bg-gray-300"
                                        }`}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No portfolio items found
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
                        VIEW ALL PORTFOLIO
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default CityPortfolioSection;
