"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface EventGalleryProps {
    eventId?: string;
}

const EventGallery: React.FC<EventGalleryProps> = ({ eventId }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    // Gallery images data - this would eventually come from database
    const galleryImages = [
        {
            id: 1,
            src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Exhibition Hall with Visitors",
        },
        {
            id: 2,
            src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Auto Show Exhibition",
        },
        {
            id: 3,
            src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Trade Show Event",
        },
        {
            id: 4,
            src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Business Conference",
        },
        {
            id: 5,
            src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Fashion Event",
        },
        {
            id: 6,
            src: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Technology Exhibition",
        },
        {
            id: 7,
            src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Corporate Event",
        },
        {
            id: 8,
            src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Product Launch",
        },
    ];

    // Auto-slide functionality
    useEffect(() => {
        if (!isDragging) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % galleryImages.length);
            }, 4000); // Change slide every 4 seconds

            return () => clearInterval(interval);
        }
    }, [galleryImages.length, isDragging]);

    // Mouse drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
        setScrollLeft(sliderRef.current?.scrollLeft || 0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - (sliderRef.current.offsetLeft || 0);
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0));
        setScrollLeft(sliderRef.current?.scrollLeft || 0);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !sliderRef.current) return;
        const x = e.touches[0].pageX - (sliderRef.current.offsetLeft || 0);
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Click handler for dots
    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        if (sliderRef.current) {
            const slideWidth =
                sliderRef.current.scrollWidth / galleryImages.length;
            sliderRef.current.scrollTo({
                left: slideWidth * index,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section Title */}
                    <motion.div
                        className="text-center mb-8 md:mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                            Event Gallery
                        </h2>
                        <div className="w-16 h-1 bg-[#a5cd39] mx-auto"></div>
                    </motion.div>

                    {/* Gallery Carousel */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Slider Container */}
                        <div
                            ref={sliderRef}
                            className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-4 scroll-smooth"
                            style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {galleryImages.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    className="flex-none relative overflow-hidden group cursor-pointer select-none shadow-md hover:shadow-xl"
                                    style={{
                                        width: "280px",
                                        height: "280px",
                                        minWidth: "280px",
                                    }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover transition-all duration-300 group-hover:brightness-110"
                                        sizes="280px"
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Image overlay with title */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-sm font-medium drop-shadow-lg">
                                            {image.alt}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Scroll Indicator Dots */}
                        <div className="flex justify-center mt-6 gap-2">
                            {galleryImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                                        Math.floor(currentIndex) === index
                                            ? "bg-[#a5cd39] scale-110"
                                            : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                    onClick={() => goToSlide(index)}
                                />
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-1 max-w-md mx-auto">
                            <div
                                className="bg-[#a5cd39] h-1 rounded-full transition-all duration-300"
                                style={{
                                    width: `${
                                        ((currentIndex + 1) /
                                            galleryImages.length) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        </div>

                        {/* View All Button */}
                        <motion.div
                            className="flex justify-center mt-8 md:mt-10 lg:mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Button
                                className="bg-[#a5cd39] hover:bg-[#8fb32a] text-white px-8 py-3 text-sm font-medium uppercase tracking-wider border-0 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                style={{ border: "none" }}
                            >
                                VIEW ALL GALLERY
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default EventGallery;
