import React from "react";
import { Metadata } from "next";
import EventsHeroServer from "./components/events-hero-server";
import EventsGalleryServer from "./components/events-gallery-server";
import { getEventsPageData } from "@/services/event-page.service";
import { createClient } from "@/lib/supabase/client";
import { PageName } from "../admin/constants/pages";

// Enable ISR - revalidate every 30 minutes (1800 seconds) for fresh event content
export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("static_page_seo_data")
            .select("*")
            .eq("page_name", PageName.EVENTS);

        if (error) {
            console.error("Error fetching seo data:", error);
            return {
                title: "What's On | Chronicle Exhibits - Upcoming Exhibitions & Events",
                description:
                    "Discover upcoming exhibitions and events at Chronicle Exhibits. Stay updated with the latest trade shows, conferences, and industry events in Dubai.",
                keywords:
                    "upcoming events, exhibitions dubai, trade shows, conferences, chronicle exhibits events, dubai events",
                openGraph: {
                    title: "What's On | Chronicle Exhibits",
                    description:
                        "Discover upcoming exhibitions and events at Chronicle Exhibits. Stay updated with the latest trade shows and industry events.",
                    type: "website",
                },
            };
        }
        return {
            title:
                data[0].meta_title ||
                "What's On | Chronicle Exhibits - Upcoming Exhibitions & Events",
            description:
                data[0].meta_description ||
                "Discover upcoming exhibitions and events at Chronicle Exhibits. Stay updated with the latest trade shows, conferences, and industry events in Dubai.",
            keywords:
                data[0].meta_keywords ||
                "upcoming events, exhibitions dubai, trade shows, conferences, chronicle exhibits events, dubai events",
            openGraph: {
                title: data[0].meta_title || "What's On | Chronicle Exhibits",
                description:
                    data[0].meta_description ||
                    "Discover upcoming exhibitions and events at Chronicle Exhibits. Stay updated with the latest trade shows and industry events.",
                type: "website",
            },
        };
    } catch (error) {
        console.error("Error fetching seo data:", error);
        return {
            title: "What's On | Chronicle Exhibits - Upcoming Exhibitions & Events",
            description:
                "Discover upcoming exhibitions and events at Chronicle Exhibits. Stay updated with the latest trade shows, conferences, and industry events in Dubai.",
            keywords:
                "upcoming events, exhibitions dubai, trade shows, conferences, chronicle exhibits events, dubai events",
            openGraph: {
                title: "What's On | Chronicle Exhibits",
                description:
                    "Discover upcoming exhibitions and events at Chronicle Exhibits. Stay updated with the latest trade shows and industry events.",
                type: "website",
            },
        };
    }
}

async function WhatsOnPage() {
    // Fetch events page data server-side
    const eventsPageData = await getEventsPageData(50, 0, true);

    return (
        <div className="flex flex-col relative">
            <EventsHeroServer hero={eventsPageData.hero} />
            <EventsGalleryServer
                events={eventsPageData.events}
                totalCount={eventsPageData.totalCount}
                hasMore={eventsPageData.hasMore}
            />
        </div>
    );
}

export default WhatsOnPage;
