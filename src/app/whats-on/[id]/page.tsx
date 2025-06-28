"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    Building2,
    ChevronDown,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getEventById, getOtherEvents } from "../data/events";
import EventGallery from "../components/event-gallery";
import BlogCarousel from "@/components/blog/blog-carousel";
import BlogPostsSection from "@/components/blog/blog-posts-section";
import { EventsForm } from "../components/events-form";

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    // Get event data dynamically
    const event = getEventById(eventId);
    const otherEvents = getOtherEvents(eventId);

    // Dynamic blog posts state
    const [blogPosts, setBlogPosts] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoadingBlogs(true);
            try {
                const res = await fetch("/api/blog/posts");
                const data = await res.json();
                setBlogPosts(data.posts || []);
            } catch (err) {
                setBlogPosts([]);
            } finally {
                setLoadingBlogs(false);
            }
        };
        fetchBlogs();
    }, []);

    const handleOtherEventClick = (otherEventId: string) => {
        router.push(`/whats-on/${otherEventId}`);
    };

    if (!event) {
        return <div>Event not found</div>;
    }

    // Debug log
    console.log("Current event:", event);
    console.log("Event image URL:", event.image);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section - Full Width */}
            <section className="relative h-[75vh] 2xl:h-[60vh] flex flex-col items-center justify-center w-full overflow-hidden">
                {/* Background Image - Same as Event Card */}
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                    onError={e => {
                        console.error("Image failed to load:", event.image);
                        console.error("Error details:", e);
                    }}
                    onLoad={() => {
                        console.log("Image loaded successfully:", event.image);
                    }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 z-5"></div>

                {/* Centered Title */}
                <div className="relative z-20 md:mt-20 mt-0 flex flex-col items-center justify-center h-full text-center text-white px-4 sm:px-6 md:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight mb-4 sm:mb-6">
                            {event.title}
                        </h1>
                        <div className="mt-4 absolute bottom-0 left-[50%] sm:mt-8">
                            <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mx-auto animate-bounce opacity-70" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Back to Event List */}
            <section className="bg-white py-4 border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <Link
                            href="/whats-on"
                            className="inline-flex items-center text-gray-600 hover:text-[#a5cd39] transition-colors duration-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium uppercase tracking-wide">
                                BACK TO EVENT LIST
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Event Info Cards Section */}
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-6 xl:gap-8 flex-wrap lg:flex-nowrap">
                            {/* TIME & DATE */}
                            <motion.div
                                className="flex items-center gap-2 md:gap-4 lg:gap-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-center px-1 md:px-2 lg:px-3">
                                    <div className="text-2xl md:text-3xl lg:text-4xl text-[#a5cd39] mb-2 md:mb-3 lg:mb-4">
                                        <Calendar className="w-6 h-6 md:w-8 h-8 lg:w-10 h-10 mx-auto" />
                                    </div>
                                    <div className="text-[#a5cd39] font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider">
                                        TIME & DATE
                                    </div>
                                    <div className="h-0.5 md:h-1 w-8 md:w-10 lg:w-12 mx-auto bg-gray-200 my-1 md:my-2 lg:my-3"></div>
                                    <div className="text-black text-xs md:text-xs lg:text-sm font-medium">
                                        {event.dateRange}
                                    </div>
                                </div>
                                <div className="border-l h-16 md:h-20 lg:h-24 border-gray-300"></div>
                            </motion.div>

                            {/* LOCATION */}
                            <motion.div
                                className="flex items-center gap-2 md:gap-4 lg:gap-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-center px-1 md:px-2 lg:px-3">
                                    <div className="text-2xl md:text-3xl lg:text-4xl text-[#a5cd39] mb-2 md:mb-3 lg:mb-4">
                                        <MapPin className="w-6 h-6 md:w-8 h-8 lg:w-10 h-10 mx-auto" />
                                    </div>
                                    <div className="text-[#a5cd39] font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider">
                                        LOCATION
                                    </div>
                                    <div className="h-0.5 md:h-1 w-8 md:w-10 lg:w-12 mx-auto bg-gray-200 my-1 md:my-2 lg:my-3"></div>
                                    <div className="text-black text-xs md:text-xs lg:text-sm font-medium">
                                        {event.venue}
                                    </div>
                                </div>
                                <div className="border-l h-16 md:h-20 lg:h-24 border-gray-300"></div>
                            </motion.div>

                            {/* INDUSTRY */}
                            <motion.div
                                className="flex items-center gap-2 md:gap-4 lg:gap-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-center px-1 md:px-2 lg:px-3">
                                    <div className="text-2xl md:text-3xl lg:text-4xl text-[#a5cd39] mb-2 md:mb-3 lg:mb-4">
                                        <Building2 className="w-6 h-6 md:w-8 h-8 lg:w-10 h-10 mx-auto" />
                                    </div>
                                    <div className="text-[#a5cd39] font-bold text-xs md:text-xs lg:text-sm uppercase tracking-wider">
                                        INDUSTRY
                                    </div>
                                    <div className="h-0.5 md:h-1 w-8 md:w-10 lg:w-12 mx-auto bg-gray-200 my-1 md:my-2 lg:my-3"></div>
                                    <div className="text-black text-xs md:text-xs lg:text-sm font-medium">
                                        {event.industry}
                                    </div>
                                </div>
                                <div className="border-l h-16 md:h-20 lg:h-24 border-gray-300"></div>
                            </motion.div>

                            {/* Share Icon */}
                            <motion.div
                                className="text-center px-1 md:px-2 lg:px-3"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-xl md:text-2xl lg:text-3xl border border-[#a5cd39] md:border-2 rounded-full p-2 md:p-3 lg:p-4 w-10 h-10 md:w-12 h-12 lg:w-16 h-16 flex items-center justify-center cursor-pointer hover:bg-[#a5cd39] hover:text-white transition-colors duration-300 text-[#a5cd39]">
                                    <svg
                                        className="w-4 h-4 md:w-5 h-5 lg:w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                    </svg>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-12 items-start">
                            {/* Left Column - Event Logo (30%) */}
                            <motion.div
                                className="w-full lg:w-[30%]"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-center">
                                    {/* Event Logo */}
                                    <div className="mb-6">
                                        <img
                                            src={event.logoImage}
                                            alt={event.logoText}
                                        />
                                    </div>

                                    {/* Organizer Info */}
                                    <div className="border-t border-gray-300 pt-6">
                                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                                            Organised By
                                        </p>
                                        <p className="font-semibold text-base">
                                            {event.organizer ||
                                                "EXCELLENT BRANDS & U"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {event.organizedBy ||
                                                "GENERAL TRADING"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Column - Description (70%) */}
                            <motion.div
                                className="w-full lg:w-[70%] self-center flex flex-col justify-center"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div className=" flex flex-col justify-center my-auto">
                                    <p className="text-gray-700 leading-relaxed text-base">
                                        {event.description ||
                                            "The CBBC brand sale brings exclusive deals, showcasing over 300 fashion and luxury brands with discounts of up to 75%."}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            <EventsForm />

            {/* Event Gallery Section */}
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <EventGallery eventId={eventId} />
            </section>

            {/* Other Events Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.h2
                            className="text-3xl sm:text-4xl font-rubik font-bold text-center mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            Other events happening in Dubai
                            <div className="w-16 h-1 mt-6 bg-[#a5cd39] mx-auto"></div>
                        </motion.h2>

                        {/* Horizontal Carousel */}
                        <div className="relative">
                            {/* Navigation Arrows */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 text-gray-600 hover:text-gray-900"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 text-gray-600 hover:text-gray-900"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>

                            {/* Events Container */}
                            <div className="overflow-hidden mx-12">
                                <div className="flex gap-6">
                                    {otherEvents.map((otherEvent, index) => (
                                        <motion.div
                                            key={otherEvent.id}
                                            className="flex-none w-48 cursor-pointer group"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.6,
                                                delay: index * 0.1,
                                            }}
                                            viewport={{ once: true }}
                                            onClick={() =>
                                                handleOtherEventClick(
                                                    otherEvent.id,
                                                )
                                            }
                                        >
                                            {/* Perfect Square Image - No Rounded Borders */}
                                            <div className="relative w-48 h-48 mb-3 overflow-hidden">
                                                <Image
                                                    src={otherEvent.image}
                                                    alt={otherEvent.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="text-center">
                                                <h3 className="font-medium text-sm mb-1 text-gray-800 leading-tight">
                                                    {otherEvent.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                                    {otherEvent.category}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Related Blog Articles Section */}
            <section
                className="py-8 md:py-12 lg:py-16"
                style={{ backgroundColor: "rgb(235, 235, 235)" }}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.h2
                            className="text-3xl sm:text-4xl font-rubik font-bold text-center mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            Related Articles
                            <div className="w-16 h-1 mt-6 bg-[#a5cd39] mx-auto"></div>
                        </motion.h2>

                        <BlogCarousel posts={blogPosts} />
                    </div>
                </div>
            </section>
        </div>
    );
}
