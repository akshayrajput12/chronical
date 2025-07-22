import React from "react";
import { MotionDiv, MotionH2 } from "./motion-wrapper";
import {
    Calendar,
    MapPin,
    Building2,
    ChevronDown,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EventGallery from "./event-gallery";
import { EventsForm } from "./events-form";
import EventContent from "@/components/events/event-content";
import {
    incrementEventViews,
    getAllEventSlugs,
    EventDetailPageData,
} from "@/services/event-page.service";
import RelatedEventsClient from "./related-events-client";
import Head from "next/head";

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

export default async function EventDetailPage({
    eventData,
}: {
    eventData: EventDetailPageData;
}) {
    const { event, relatedEvents, galleryImages, blogPosts } = eventData;

    // Increment view count (fire and forget)
    incrementEventViews(event.id);

    return (
        <>
            <Head>
                <title>
                    {event.meta_title || `${event.title} | Chronicle Exhibits`}
                </title>
                <meta
                    name="description"
                    content={
                        event.meta_description ||
                        event.short_description ||
                        event.description ||
                        `Join us for ${event.title} at Chronicle Exhibits.`
                    }
                />
                {event.meta_keywords && (
                    <meta name="keywords" content={event.meta_keywords} />
                )}

                {/* Open Graph */}
                <meta
                    property="og:title"
                    content={event.meta_title || event.title}
                />
                <meta
                    property="og:description"
                    content={
                        event.meta_description ||
                        event.short_description ||
                        event.description ||
                        `Join us for ${event.title}`
                    }
                />
                <meta property="og:type" content="article" />
                <meta
                    property="og:url"
                    content={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/${
                        event.slug
                    }`}
                />

                <meta property="og:image" content={event.featured_image_url} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={event.meta_title || event.title}
                />
                <meta
                    name="twitter:description"
                    content={
                        event.meta_description ||
                        event.short_description ||
                        event.description ||
                        `Join us for ${event.title}`
                    }
                />

                <meta name="twitter:image" content={event.featured_image_url} />
            </Head>
            <div className="min-h-screen bg-gray-100">
                {/* Hero Section - Full Width */}
                <section className="hero relative h-[75vh] 2xl:h-[60vh] flex items-center justify-center overflow-hidden">
                    {/* Background Image - Hero Image */}
                    <div className="absolute inset-0 z-0">
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
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 md:mt-20 text-center text-white px-4 max-w-4xl mx-auto">
                        <MotionDiv
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-rubik font-bold leading-tight mb-4 sm:mb-6">
                                {event.short_description}
                            </h1>
                        </MotionDiv>
                    </div>

                    {/* Scroll Indicator */}
                    <MotionDiv
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <ChevronDown className="w-8 h-8 animate-bounce hover:text-[#a5cd39] transition-colors" />
                    </MotionDiv>

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
                                href="/top-trade-shows-in-uae-saudi-arabia-middle-east"
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
                                            event.logo_image_url.trim() !==
                                                "" && (
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
                            <RelatedEventsClient
                                relatedEvents={relatedEvents}
                            />
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
        </>
    );
}
