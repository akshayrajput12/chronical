import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MotionDiv, MotionH2 } from "./components/motion-wrapper";
import {
    Calendar,
    MapPin,
    Building2,
    ChevronDown,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import EventGallery from "../components/event-gallery";
import BlogCarousel from "@/components/blog/blog-carousel";
import { EventsForm } from "../components/events-form";
import EventContent from "@/components/events/event-content";
import {
    getEventDetailPageData,
    incrementEventViews,
    getAllEventSlugs,
} from "@/services/event-page.service";
import RelatedEventsClient from "../components/related-events-client";

interface EventDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Enable ISR - revalidate every 30 minutes (1800 seconds) for events
export const revalidate = 1800;

// Generate static params for all events
export async function generateStaticParams() {
    try {
        const slugs = await getAllEventSlugs();
        return slugs.map(slug => ({
            slug,
        }));
    } catch (error) {
        console.error("Error generating static params for events:", error);
        return [];
    }
}

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: EventDetailPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const eventData = await getEventDetailPageData(resolvedParams.slug);

    if (!eventData) {
        return {
            title: "Event Not Found",
            description: "The requested event could not be found.",
        };
    }

    const { event } = eventData;

    return {
        title: `${event.title} | Chronicle Exhibits`,
        description:
            event.short_description ||
            event.description ||
            `Join us for ${event.title} at Chronicle Exhibits.`,
        keywords: `${event.title}, ${
            event.category_name || "event"
        }, exhibition, Dubai, Chronicle Exhibits`,
        openGraph: {
            title: event.title,
            description:
                event.short_description ||
                event.description ||
                `Join us for ${event.title}`,
            images: event.featured_image_url ? [event.featured_image_url] : [],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: event.title,
            description:
                event.short_description ||
                event.description ||
                `Join us for ${event.title}`,
            images: event.featured_image_url ? [event.featured_image_url] : [],
        },
    };
}

export default async function EventDetailPage({
    params,
}: EventDetailPageProps) {
    // Fetch event data server-side
    const resolvedParams = await params;
    const eventData = await getEventDetailPageData(resolvedParams.slug);

    if (!eventData) {
        notFound();
    }

    const { event, relatedEvents, galleryImages, blogPosts } = eventData;

    // Increment view count (fire and forget)
    incrementEventViews(event.id);

    // Error state component for not found
    if (!event) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Event not found
                    </h1>
                    <p className="text-gray-600 mb-6">
                        The event you're looking for doesn't exist or has been
                        removed.
                    </p>
                    <div className="space-x-4">
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
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight mb-4 sm:mb-6">
                            {event.short_description}
                        </h1>
                        <div className="mt-4 absolute bottom-0 left-[50%] sm:mt-8">
                            <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mx-auto animate-bounce opacity-70" />
                        </div>
                    </MotionDiv>
                </div>

                {/* Image Credit */}
                {event.hero_image_credit && (
                    <div className="absolute bottom-4 right-4 z-30">
                        <p className="text-white text-xs opacity-75 bg-black/30 px-2 py-1 rounded">
                            Image credits: {event.hero_image_credit}
                        </p>
                    </div>
                )}
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
                            <MotionDiv
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
                            </MotionDiv>

                            {/* LOCATION */}
                            <MotionDiv
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
                            </MotionDiv>

                            {/* INDUSTRY */}
                            <MotionDiv
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
                            </MotionDiv>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-8xl mx-auto">
                        <div className="flex flex-col lg:flex-row lg:gap-16 sm:gap-8 gap-6 items-start">
                            {/* Left Column - Event Logo (30%) */}
                            <MotionDiv
                                className="w-full lg:w-[35%]"
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
                                    <EventsForm
                                        className="lg:py-8! py-6!"
                                        eventId={event.id}
                                    />
                                </div>
                            </MotionDiv>

                            {/* Right Column - Description (70%) */}
                            <MotionDiv
                                className="w-full lg:w-[65%] self-center flex flex-col justify-center"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex flex-col justify-center my-auto">
                                    <EventContent
                                        content={
                                            event.description ||
                                            "Event description will be available soon."
                                        }
                                    />
                                </div>
                            </MotionDiv>
                        </div>
                    </div>
                </div>
            </section>

            {/* Event Gallery Section */}
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <EventGallery eventId={event.id} images={galleryImages} />
            </section>

            {/* Other Events Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <MotionH2
                            className="text-3xl sm:text-4xl font-rubik font-bold text-center mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            Other events happening in Dubai
                            <div className="w-16 h-1 mt-6 bg-[#a5cd39] mx-auto"></div>
                        </MotionH2>

                        {/* Horizontal Carousel */}
                        <RelatedEventsClient relatedEvents={relatedEvents} />
                    </div>
                </div>
            </section>
            {/* Related Blog Articles Section */}
            {/* <section
                className="py-8 md:py-12 lg:py-16"
                style={{ backgroundColor: "rgb(235, 235, 235)" }}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <MotionH2
                            className="text-3xl sm:text-4xl font-rubik font-bold text-center mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            Related Articles
                            <div className="w-16 h-1 mt-6 bg-[#a5cd39] mx-auto"></div>
                        </MotionH2>

                        <BlogCarousel posts={blogPosts} />
                    </div>
                </div>
            </section> */}
        </div>
    );
}
