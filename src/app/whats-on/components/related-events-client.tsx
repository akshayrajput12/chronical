"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/types/events";

interface RelatedEventsClientProps {
    relatedEvents: Event[];
}

const RelatedEventsClient = ({ relatedEvents }: RelatedEventsClientProps) => {
    const router = useRouter();

    const handleOtherEventClick = (otherEventSlug: string) => {
        router.push(`/whats-on/${otherEventSlug}`);
    };

    return (
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
                        {relatedEvents.map((relatedEvent, index) => (
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
                                    handleOtherEventClick(relatedEvent.slug)
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
                                        alt={relatedEvent.title}
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
                                        {relatedEvent.category_name}
                                    </p>
                                    {relatedEvent.date_range && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {relatedEvent.date_range}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No related events found.</p>
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
    );
};

export default RelatedEventsClient;
