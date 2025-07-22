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
    const [cardSize, setCardSize] = useState(280); // Using single value for square cards
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Handle responsive cards display and card dimensions
    React.useEffect(() => {
        const handleResize = () => {
            const viewportWidth = window.innerWidth;
            let newCardsToShow = 5;

            // Set responsive card count
            if (viewportWidth < 640) {
                // Mobile
                newCardsToShow = 2;
            } else if (viewportWidth < 1024) {
                // Tablet
                newCardsToShow = 3;
            } else {
                // Desktop
                newCardsToShow = 5;
            }

            setCardsToShow(newCardsToShow);
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
        if (!isAutoPlaying || portfolioItems.length <= cardsToShow) return;

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
                    className="flex flex-col sm:flex-row items-center justify-between mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center sm:text-left flex-1 mb-4 sm:mb-0">
                        <h2 className="font-rubik mx-auto text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Portfolio in {city.name}
                        </h2>
                        <div className="flex justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Portfolio Carousel Container */}
                {portfolioItems.length > 0 ? (
                    <div
                        className="relative w-full"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Navigation Buttons - Only show if there are more items than visible */}
                        {portfolioItems.length > cardsToShow && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={prevSlide}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-600 hover:text-gray-900"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={nextSlide}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-600 hover:text-gray-900"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </>
                        )}

                        {/* Portfolio Cards Container with Smooth Sliding */}
                        <div className="overflow-hidden">
                            <motion.div
                                className="flex"
                                animate={{
                                    transform: `translateX(-${
                                        currentIndex * (100 / cardsToShow)
                                    }%)`,
                                }}
                                transition={{
                                    type: "spring" as
                                        | AnimationGeneratorType
                                        | undefined,
                                    stiffness: 300,
                                    damping: 30,
                                    duration: 0.8,
                                }}
                                style={{
                                    width: `${
                                        (portfolioItems.length / cardsToShow) *
                                        100
                                    }%`,
                                }}
                            >
                                {portfolioItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        className="flex-none"
                                        style={{
                                            flexBasis: `${100 / cardsToShow}%`,
                                            aspectRatio: "1 / 1", // Square aspect ratio
                                            padding: "0 8px", // Half gap on each side
                                        }}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="w-full h-full">
                                            <div
                                                className="w-full h-full bg-white cursor-pointer transition-all duration-500 hover:shadow-xl overflow-hidden group relative"
                                                onClick={() =>
                                                    handlePortfolioClick(
                                                        item.id,
                                                    )
                                                }
                                            >
                                                {/* Green accent bar */}
                                                <div className="absolute top-0 left-0 w-12 h-1 bg-[#22c55e] z-10"></div>

                                                {/* Image Container - Square */}
                                                <div className="relative w-full h-full overflow-hidden">
                                                    <img
                                                        src={item.src}
                                                        alt={item.alt}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Pagination Dots - Only show if there are multiple pages */}
                        {portfolioItems.length > cardsToShow && (
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
                                                setCurrentIndex(
                                                    Math.min(
                                                        i * cardsToShow,
                                                        maxIndex,
                                                    ),
                                                )
                                            }
                                            className={`w-2 h-2 transition-all duration-300 ${
                                                Math.floor(
                                                    currentIndex / cardsToShow,
                                                ) === i
                                                    ? "bg-[#a5cd39] w-6"
                                                    : "bg-gray-300 hover:bg-gray-400"
                                            }`}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No portfolio items found
                        </p>
                    </div>
                )}

                {/* View All Button */}
                <motion.div
                    className="flex justify-center mt-8 sm:mt-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <Button
                        variant="ghost"
                        className="text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm sm:text-base font-medium"
                    >
                        VIEW ALL PORTFOLIO
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default CityPortfolioSection;
