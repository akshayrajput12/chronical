"use client";

import React from "react";
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

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    // Get event data dynamically
    const event = getEventById(eventId);
    const otherEvents = getOtherEvents(eventId);

    // Sample blog posts data - this would typically come from a CMS or API
    const blogPosts = [
        {
            id: 1,
            date: "21 MAY 2025",
            title: "DWTC Hospitality Division Achieves Strong Performance in 2024, Catering to Nearly 1 Million Guests Across 2,400 Events",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            excerpt: "HOSPITALITY, EVENTS, BUSINESS",
        },
        {
            id: 2,
            date: "27 APR 2025",
            title: "DWTC delivers AED22.35 billion in economic output in 2024, driven by record increase in large scale events",
            image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            excerpt: "ECONOMICS, TRADE, DUBAI",
        },
        {
            id: 3,
            date: "25 APR 2025",
            title: "Capacity Crowds Mark Monumental Opening of GITEX ASIA x Ai Everything Singapore",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            excerpt: "TECHNOLOGY, AI, SINGAPORE",
        },
        {
            id: 4,
            date: "20 APR 2025",
            title: "Innovation Summit 2025 Brings Together Global Tech Leaders",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            excerpt: "INNOVATION, TECHNOLOGY, LEADERSHIP",
        },
        {
            id: 5,
            date: "15 APR 2025",
            title: "Sustainable Technology Expo Showcases Green Innovation",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
            excerpt: "SUSTAINABILITY, GREEN TECH, ENVIRONMENT",
        },
    ];

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
            <section className="relative h-[80vh] w-full overflow-hidden">
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
                <div className="relative z-20 flex items-center justify-center h-full text-center text-white px-4 sm:px-6 md:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight mb-4 sm:mb-6">
                            {event.title}
                        </h1>
                        <div className="mt-4 sm:mt-8">
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
                                        <h2 className="text-6xl font-bold text-gray-800 mb-2">
                                            {event.logoText || "CBBC"}
                                        </h2>
                                        <p className="text-sm text-gray-600 uppercase tracking-wider font-medium">
                                            {event.logoSubtext ||
                                                "CONCEPT BIG BRANDS CARNIVAL"}
                                        </p>
                                    </div>

                                    {/* Organizer Info */}
                                    <div className="border-t border-gray-300 pt-6">
                                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                                            Organised By
                                        </p>
                                        <p className="font-semibold text-gray-800 text-base">
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
                                className="w-full lg:w-[70%]"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div>
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

            {/* Action Buttons Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="flex flex-col md:flex-row items-center justify-between gap-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            {/* Left Side - Add to Calendar Button */}
                            <div className="flex-shrink-0">
                                <Button className="bg-[#a5cd39] hover:bg-[#8fb32a] text-white px-6 py-3 text-sm font-medium uppercase tracking-wider rounded-full">
                                    ADD TO MY CALENDAR
                                </Button>
                            </div>

                            {/* Right Side - Visit Website Button and Social Icons */}
                            <div className="flex items-center gap-6">
                                {/* Visit Event Website Button */}
                                <Button
                                    variant="outline"
                                    className="border-2 border-[#a5cd39] text-[#a5cd39] hover:border-[#8fb32a] hover:text-[#8fb32a] px-6 py-3 text-sm font-medium uppercase tracking-wider rounded-full bg-white"
                                >
                                    VISIT EVENT WEBSITE
                                </Button>

                                {/* Follow Event Text and Social Icons */}
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-600 text-sm font-medium uppercase tracking-wider">
                                        FOLLOW EVENT
                                    </span>

                                    {/* Social Media Icons */}
                                    <div className="flex items-center gap-2">
                                        {/* Facebook */}
                                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </div>

                                        {/* Instagram */}
                                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-colors">
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        </div>

                                        {/* YouTube */}
                                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Event Gallery Section */}
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <EventGallery eventId={eventId} />
            </section>

            {/* Related Blog Articles Section */}
            <section
                className="py-8 md:py-12 lg:py-16"
                style={{ backgroundColor: "rgb(235, 235, 235)" }}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.h2
                            className="text-2xl font-medium text-center text-gray-700 mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            Related Articles
                        </motion.h2>

                        <BlogCarousel posts={blogPosts} />
                    </div>
                </div>
            </section>

            {/* Other Events Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.h2
                            className="text-2xl font-medium text-center text-gray-700 mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            Other events happening in Dubai
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
        </div>
    );
}
