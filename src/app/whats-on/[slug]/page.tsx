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
import { Event } from "@/types/events";
import EventGallery from "../components/event-gallery";
import BlogCarousel from "@/components/blog/blog-carousel";
import BlogPostsSection from "@/components/blog/blog-posts-section";
import { EventsForm } from "../components/events-form";
import EventContent from "@/components/events/event-content";

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventSlug = params.slug as string;

    // State for event data
    const [event, setEvent] = useState<Event | null>(null);
    const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dynamic blog posts state
    const [blogPosts, setBlogPosts] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);

    // Fetch event data and blog posts
    useEffect(() => {
        let isCancelled = false;

        const fetchData = async () => {
            if (!eventSlug) return;

            setLoading(true);
            setError(null);

            try {
                // Fetch event data
                const eventResponse = await fetch(`/api/events/${eventSlug}`);
                if (isCancelled) return;

                if (!eventResponse.ok) {
                    if (eventResponse.status === 404) {
                        setError("Event not found");
                    } else {
                        setError("Failed to load event");
                    }
                    return;
                }

                const eventData = await eventResponse.json();
                if (isCancelled) return;

                setEvent(eventData.event);
                setRelatedEvents(eventData.related_events || []);

                // Fetch blog posts
                const blogResponse = await fetch("/api/blog/posts");
                if (isCancelled) return;

                const blogData = await blogResponse.json();
                setBlogPosts(blogData.posts || []);
            } catch (error) {
                if (isCancelled) return;
                console.error("Error fetching data:", error);
                setError("Failed to load event. Please try again later.");
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                    setLoadingBlogs(false);
                }
            }
        };

        fetchData();

        return () => {
            isCancelled = true;
        };
    }, [eventSlug]);

    const handleOtherEventClick = (otherEventSlug: string) => {
        router.push(`/whats-on/${otherEventSlug}`);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#a5cd39] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading event...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {error || "Event not found"}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        The event you're looking for doesn't exist or has been
                        removed.
                    </p>
                    <div className="space-x-4">
                        <Button onClick={() => router.back()} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                        <Link href="/whats-on">
                            <Button className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white">
                                View All Events
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section - Full Width */}
            <section className="relative h-[75vh] 2xl:h-[60vh] flex flex-col items-center justify-center w-full overflow-hidden">
                {/* Background Image - Hero Image */}
                <Image
                    src={
                        event.hero_image_url ||
                        event.featured_image_url ||
                        "/placeholder-event.jpg"
                    }
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
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
                            <span className="text-sm font-medium tracking-wide">
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
                                    <div className="text-[#a5cd39] font-bold text-xs md:text-xs lg:text-sm tracking-wider">
                                        TIME & DATE
                                    </div>
                                    <div className="h-0.5 md:h-1 w-8 md:w-10 lg:w-12 mx-auto bg-gray-200 my-1 md:my-2 lg:my-3"></div>
                                    <div className="text-black text-xs md:text-xs lg:text-sm font-medium">
                                        {event.date_range || "Date TBD"}
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
                                    <div className="text-[#a5cd39] font-bold text-xs md:text-xs lg:text-sm tracking-wider">
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
                                    <div className="text-[#a5cd39] font-bold text-xs md:text-xs lg:text-sm tracking-wider">
                                        INDUSTRY
                                    </div>
                                    <div className="h-0.5 md:h-1 w-8 md:w-10 lg:w-12 mx-auto bg-gray-200 my-1 md:my-2 lg:my-3"></div>
                                    <div className="text-black text-xs md:text-xs lg:text-sm font-medium">
                                        {event.industry}
                                    </div>
                                </div>
                                <div className="border-l h-16 md:h-20 lg:h-24 border-gray-300"></div>
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
                                    {event.logo_image_url &&
                                        event.logo_image_url.trim() !== "" && (
                                            <div className="mb-6">
                                                <div className="relative">
                                                    <Image
                                                        src={
                                                            event.logo_image_url
                                                        }
                                                        alt={
                                                            event.logo_text ||
                                                            event.title
                                                        }
                                                        width={200}
                                                        height={100}
                                                        className="mx-auto object-contain"
                                                        unoptimized={event.logo_image_url.startsWith(
                                                            "/",
                                                        )}
                                                        onError={() => {
                                                            console.error(
                                                                "Logo image failed to load:",
                                                                event.logo_image_url,
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                    {/* Logo Text */}
                                    {(event.logo_text ||
                                        event.logo_subtext) && (
                                        <div className="mb-6 text-center">
                                            {event.logo_text && (
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {event.logo_text}
                                                </h3>
                                            )}
                                            {event.logo_subtext && (
                                                <p className="text-gray-600">
                                                    {event.logo_subtext}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Organizer Info */}
                                    <div className="border-t border-gray-300 pt-6">
                                        <p className="text-xs text-gray-500 mb-2 tracking-wider">
                                            Organised By
                                        </p>
                                        <p className="font-semibold text-base">
                                            {event.organizer ||
                                                "Event Organizer"}
                                        </p>
                                        {event.organized_by && (
                                            <p className="text-sm text-gray-600">
                                                {event.organized_by}
                                            </p>
                                        )}
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
                                <div className="flex flex-col justify-center my-auto">
                                    {event.short_description && (
                                        <p className="text-lg text-gray-800 font-medium mb-4 leading-relaxed">
                                            {event.short_description}
                                        </p>
                                    )}
                                    <EventContent
                                        content={
                                            event.description ||
                                            "Event description will be available soon."
                                        }
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            <EventsForm eventId={event.id} />

            {/* Event Gallery Section */}
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <EventGallery eventId={event.id} />
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
                                {relatedEvents.length > 0 ? (
                                    <div className="flex gap-6">
                                        {relatedEvents.map(
                                            (relatedEvent, index) => (
                                                <motion.div
                                                    key={relatedEvent.id}
                                                    className="flex-none w-48 cursor-pointer group"
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
                                                        handleOtherEventClick(
                                                            relatedEvent.slug,
                                                        )
                                                    }
                                                >
                                                    {/* Perfect Square Image - No Rounded Borders */}
                                                    <div className="relative w-48 h-48 mb-3 overflow-hidden">
                                                        {/* Category color accent bar */}
                                                        <div
                                                            className="absolute top-0 left-0 w-8 h-1 z-10"
                                                            style={{
                                                                backgroundColor:
                                                                    relatedEvent.category_color || "#22c55e",
                                                            }}
                                                        ></div>
                                                        <Image
                                                            src={
                                                                relatedEvent.featured_image_url ||
                                                                "/placeholder-event.jpg"
                                                            }
                                                            alt={
                                                                relatedEvent.title
                                                            }
                                                            fill
                                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="text-center">
                                                        <h3 className="font-medium text-sm mb-1 text-gray-800 leading-tight">
                                                            {relatedEvent.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                                            {relatedEvent.category_name ||
                                                                "Event"}
                                                        </p>
                                                        {relatedEvent.date_range && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {
                                                                    relatedEvent.date_range
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">
                                            No related events found.
                                        </p>
                                        <Link
                                            href="/whats-on"
                                            className="text-[#a5cd39] hover:underline mt-2 inline-block"
                                        >
                                            View all events
                                        </Link>
                                    </div>
                                )}
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
