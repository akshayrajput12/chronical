"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimationGeneratorType } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { City } from "@/types/cities";

interface CityPortfolioSectionProps {
    city: City;
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
            const minCardWidth = 200;
            const maxCardWidth = 400;

            const calculatedCardWidth = Math.floor(availableWidth / 5);
            setCardWidth(
                Math.max(
                    minCardWidth,
                    Math.min(maxCardWidth, calculatedCardWidth),
                ),
            );

            // Set card height proportionally
            setCardHeight(Math.floor(calculatedCardWidth * 1.2));
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
    }, [isAutoPlaying, cardsToShow]);

    // Pause auto-play on hover
    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    // Portfolio items data
    const portfolioItems = [
        {
            id: 1,
            src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop",
            alt: "Modern tech exhibition booth with purple lighting and interactive displays",
            title: "Tech Innovation Pavilion",
            category: "Technology",
        },
        {
            id: 2,
            src: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=300&fit=crop",
            alt: "Colorful triangular booth design with red and blue elements",
            title: "Creative Design Studio",
            category: "Design",
        },
        {
            id: 3,
            src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=500&fit=crop",
            alt: "Professional booth with circular ceiling design and attendees",
            title: "Corporate Excellence",
            category: "Corporate",
        },
        {
            id: 4,
            src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=500&fit=crop",
            alt: "Wooden and modern booth design with clean lines",
            title: "Sustainable Solutions",
            category: "Sustainability",
        },
        {
            id: 5,
            src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=400&fit=crop",
            alt: "Red and white booth with multiple display screens",
            title: "Digital Experience",
            category: "Digital",
        },
        {
            id: 6,
            src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
            alt: "White minimalist booth with green accents",
            title: "Minimalist Approach",
            category: "Minimalist",
        },
        {
            id: 7,
            src: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
            alt: "Exhibition hall with golden lighting",
            title: "Luxury Pavilion",
            category: "Luxury",
        },
        {
            id: 8,
            src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
            alt: "Modern exhibition space with attendees",
            title: "Modern Architecture",
            category: "Architecture",
        },
        {
            id: 9,
            src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=400&fit=crop",
            alt: "Trade show booth with interactive displays",
            title: "Interactive Experience",
            category: "Interactive",
        },
        {
            id: 10,
            src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop",
            alt: "Corporate exhibition stand",
            title: "Business Solutions",
            category: "Business",
        },
        {
            id: 11,
            src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=500&fit=crop",
            alt: "Large scale exhibition with multiple booths",
            title: "Large Scale Projects",
            category: "Large Scale",
        },
        {
            id: 12,
            src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop",
            alt: "Professional conference and exhibition setup",
            title: "Conference Setup",
            category: "Conference",
        },
    ];

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

    const handlePortfolioClick = (itemId: number) => {
        // Handle portfolio item click - you can add navigation logic here
        console.log(`Portfolio item ${itemId} clicked`);
    };

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
