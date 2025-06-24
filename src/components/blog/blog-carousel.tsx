"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard from "./blog-card";
import { useRouter } from "next/navigation";
import { BlogPostSummary } from "@/types/blog";

interface BlogCarouselProps {
    posts: BlogPostSummary[];
}

const BlogCarousel = ({ posts }: BlogCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(3);
    const [cardWidth, setCardWidth] = useState(320);
    const router = useRouter();

    // Handle responsive card sizing
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const padding = 32; // Account for container padding (px-4 = 16px each side, doubled for safety)

            if (width < 640) {
                // Mobile - single card with proper viewport constraint
                setCardsToShow(1);
                const availableWidth = width - padding - 32; // Extra margin for mobile
                setCardWidth(Math.min(280, Math.max(240, availableWidth)));
            } else if (width < 1024) {
                // Tablet - two cards with gap
                setCardsToShow(2);
                const availableWidth = (width - padding - 16) / 2; // Account for gap between cards
                setCardWidth(Math.min(320, Math.max(260, availableWidth)));
            } else {
                // Desktop - three cards with gaps
                setCardsToShow(3);
                const availableWidth = (width - padding - 32) / 3; // Account for gaps between cards
                setCardWidth(Math.min(340, Math.max(280, availableWidth)));
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Calculate max index
    const maxIndex = Math.max(0, posts.length - cardsToShow);

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

    const handlePostClick = (slug: string) => {
        router.push(`/blog/${slug}`);
    };

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts available</p>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Responsive visible area container */}
            <div
                className="overflow-hidden w-full"
                style={{
                    maxWidth: `${
                        cardsToShow * cardWidth + (cardsToShow - 1) * 16
                    }px`, // Dynamic cards + gaps
                    margin: "0 auto", // Center the container
                }}
            >
                {/* Navigation Buttons */}
                {posts.length > cardsToShow && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={prevSlide}
                            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-10 bg-gray-100/80 hover:bg-gray-200/80 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-500 hover:text-gray-600"
                        >
                            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={nextSlide}
                            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-10 bg-gray-100/80 hover:bg-gray-200/80 shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-all duration-300 text-gray-500 hover:text-gray-600"
                        >
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        </Button>
                    </>
                )}

                {/* Blog Posts Cards Container with Smooth Sliding */}
                <div className="overflow-hidden">
                    <motion.div
                        className="flex gap-4"
                        style={{
                            width: `${posts.length * (cardWidth + 16)}px`, // cardWidth + gap
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
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            duration: 0.8,
                        }}
                    >
                        {posts.map((post, index) => (
                            <BlogCard
                                key={post.id}
                                post={post}
                                index={index}
                                onClick={handlePostClick}
                                style={{ width: `${cardWidth}px` }}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BlogCarousel;
