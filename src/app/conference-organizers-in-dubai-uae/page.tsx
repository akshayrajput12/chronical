import React from "react";
import { Metadata } from "next";
import ConferenceHero from "./components/conference-hero";
import EventManagementServices from "./components/event-management-services";
import ConferenceManagementServices from "./components/conference-management-services";
import CommunicateSection from "./components/communicate-section";
import VirtualEventsSection from "./components/virtual-events-section";
import ConferenceSolutionSection from "./components/conference-solution-section";
import BoothRequirementsForm from "../home/components/booth-requirements-form";
import ConferenceEventsPortfolio from "@/components/sections/conference-events-portfolio";
import { getConferencePageData } from "@/services/conference-page.service";
import { createClient } from "@/lib/supabase/client";
import { PageName } from "../admin/constants/pages";

// Enable ISR - revalidate every 4 hours (14400 seconds)
export const revalidate = 14400;

export async function generateMetadata(): Promise<Metadata> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("static_page_seo_data")
            .select("*")
            .eq("page_name", PageName.CONFERENCE);
        if (error) {
            console.error("Error fetching seo data:", error);
            return {
                title: "Conference Organizers in Dubai | Chronicle Exhibits - Event Management Services",
                description:
                    "Professional conference organizers in Dubai. We are licensed & skilled meeting & conference organizers providing comprehensive event management services.",
                keywords:
                    "conference organizers dubai, event management services, meeting organizers, conference planning dubai, virtual events",
                openGraph: {
                    title: "Conference Organizers in Dubai | Chronicle Exhibits",
                    description:
                        "Professional conference organizers in Dubai providing comprehensive event management services.",
                    type: "website",
                },
            };
        }
        return {
            title:
                data[0].meta_title ||
                "Conference Organizers in Dubai | Chronicle Exhibits - Event Management Services",
            description:
                data[0].meta_description ||
                "Professional conference organizers in Dubai. We are licensed & skilled meeting & conference organizers providing comprehensive event management services.",
            keywords:
                data[0].meta_keywords ||
                "conference organizers dubai, event management services, meeting organizers, conference planning dubai, virtual events",
            openGraph: {
                title:
                    data[0].meta_title ||
                    "Conference Organizers in Dubai | Chronicle Exhibits",
                description:
                    data[0].meta_description ||
                    "Professional conference organizers in Dubai providing comprehensive event management services.",
                type: "website",
            },
        };
    } catch (error) {
        return {
            title: "Conference Organizers in Dubai | Chronicle Exhibits - Event Management Services",
            description:
                "Professional conference organizers in Dubai. We are licensed & skilled meeting & conference organizers providing comprehensive event management services.",
            keywords:
                "conference organizers dubai, event management services, meeting organizers, conference planning dubai, virtual events",
            openGraph: {
                title: "Conference Organizers in Dubai | Chronicle Exhibits",
                description:
                    "Professional conference organizers in Dubai providing comprehensive event management services.",
                type: "website",
            },
        };
    }
}

// Server component that fetches data at build/request time for better SEO
async function ConferencePage() {
    // Fetch conference page data server-side for SEO optimization
    const conferencePageData = await getConferencePageData();

    return (
        <div className="flex flex-col relative ">
            <ConferenceHero />
            <EventManagementServices />
            <ConferenceManagementServices />
            <CommunicateSection />
            <VirtualEventsSection />
            <ConferenceSolutionSection />
            <ConferenceEventsPortfolio
                title="Check Out Our Latest Conference Portfolio"
                showFeaturedOnly={false}
                limit={20}
                className="bg-white"
            />
            <BoothRequirementsForm />
        </div>
    );
}

export default ConferencePage;
