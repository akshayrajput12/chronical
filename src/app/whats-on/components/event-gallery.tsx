"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface EventGalleryProps {
    eventId?: string;
    images?: any[];
    title?: string;
    showNavigation?: boolean;
    className?: string;
}

const EventGallery: React.FC<EventGalleryProps> = ({
    eventId,
    images: propImages,
    title = "Event Gallery",
    showNavigation = true,
    className = ""
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    // Fetch gallery images if eventId is provided and no images prop
    useEffect(() => {
        let isCancelled = false;

        if (propImages) {
            setGalleryImages(propImages);
            return;
        }

        if (!eventId) return;

        const fetchEventImages = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/events/${eventId}/images?type=gallery`);
                if (isCancelled) return;

                const data = await response.json();

                if (response.ok) {
                    if (!isCancelled) setGalleryImages(data.images.gallery || []);
                } else {
                    if (!isCancelled) setError(data.error || 'Failed to load gallery images');
                }
            } catch (error) {
                if (isCancelled) return;
                console.error('Error fetching gallery images:', error);
                setError('Failed to load gallery images');
            } finally {
                if (!isCancelled) setLoading(false);
            }
        };

        fetchEventImages();

        return () => {
            isCancelled = true;
        };
    }, [eventId, propImages]);

    // Retry function for error handling
    const retryFetch = () => {
        if (eventId && !propImages) {
            setError(null);
            setLoading(true);

            const fetchEventImages = async () => {
                try {
                    const response = await fetch(`/api/events/${eventId}/images?type=gallery`);
                    const data = await response.json();

                    if (response.ok) {
                        setGalleryImages(data.images.gallery || []);
                    } else {
                        setError(data.error || 'Failed to load gallery images');
                    }
                } catch (error) {
                    console.error('Error fetching gallery images:', error);
                    setError('Failed to load gallery images');
                } finally {
                    setLoading(false);
                }
            };

            fetchEventImages();
        }
    };

    // Use prop images or fetched images
    const rawImages = propImages || galleryImages;

    // Transform images to consistent format and filter out invalid images
    const formattedImages = rawImages
        .filter((image: any) => {
            // Ensure image has a valid src
            const src = image.large_url || image.medium_url || image.file_path;
            return src && src.trim() !== '';
        })
        .map((image: any) => ({
            id: image.id || image.relation_id,
            src: image.large_url || image.medium_url || image.file_path,
            thumbnail: image.thumbnail_url || image.file_path,
            alt: image.alt_text || image.title || 'Event gallery image',
            title: image.title || image.filename,
            caption: image.caption,
            width: image.width,
            height: image.height,
        }));

    // Use formatted images or fallback to empty array
    const displayImages = formattedImages.length > 0 ? formattedImages : [];

    // Auto-slide functionality
    useEffect(() => {
        if (!isDragging && displayImages.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % displayImages.length);
            }, 4000); // Change slide every 4 seconds

            return () => clearInterval(interval);
        }
    }, [displayImages.length, isDragging]);

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
                sliderRef.current.scrollWidth / displayImages.length;
            sliderRef.current.scrollTo({
                left: slideWidth * index,
                behavior: "smooth",
            });
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={`py-16 ${className}`}>
                <motion.div
                    className="text-center mb-8 md:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-rubik font-bold text-center mb-4">
                        {title}
                    </h2>
                    <div className="w-16 h-1 bg-[#a5cd39] mx-auto"></div>
                </motion.div>
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5cd39]"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`py-16 ${className}`}>
                <motion.div
                    className="text-center mb-8 md:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-rubik font-bold text-center mb-4">
                        {title}
                    </h2>
                    <div className="w-16 h-1 bg-[#a5cd39] mx-auto"></div>
                </motion.div>
                <div className="text-center">
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={retryFetch} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // No images state
    if (displayImages.length === 0) {
        return (
            <div className={`py-16 ${className}`}>
                <motion.div
                    className="text-center mb-8 md:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-rubik font-bold text-center mb-4">
                        {title}
                    </h2>
                    <div className="w-16 h-1 bg-[#a5cd39] mx-auto"></div>
                </motion.div>
                <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No gallery images available for this event.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`py-16 ${className}`}>
            {/* Section Title */}
            <motion.div
                className="text-center mb-8 md:mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl sm:text-4xl font-rubik font-bold text-center mb-4">
                    {title}
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
                    className="flex gap-2 md:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-4 scroll-smooth"
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
                    {displayImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            className="flex-none relative overflow-hidden group cursor-pointer select-none shadow-md hover:shadow-xl w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[306px] lg:h-[306px]"
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
                                sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 306px"
                                draggable={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Scroll Indicator Dots */}
                <div className="flex justify-center mt-6 gap-1">
                    {displayImages.map((_, index) => (
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
                                ((currentIndex + 1) / displayImages.length) *
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
                        className="bg-[#a5cd39] text-white px-6 py-2 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 uppercase font-noto-kufi-arabic text-sm"
                        style={{ border: "none" }}
                    >
                        VIEW ALL GALLERY
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default EventGallery;
