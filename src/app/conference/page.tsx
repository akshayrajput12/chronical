import React from "react";
import { Metadata } from "next";
import ConferenceHero from "./components/conference-hero";
import EventManagementServices from "./components/event-management-services";
import ConferenceManagementServices from "./components/conference-management-services";
import CommunicateSection from "./components/communicate-section";
import VirtualEventsSection from "./components/virtual-events-section";
import PortfolioGalleryHeading from "./components/portfolio-gallery-heading";
import PortfolioGallery from "../portfolio/components/portfolio-gallery";
import ConferenceSolutionSection from "./components/conference-solution-section";
import BoothRequirementsForm from "../home/components/booth-requirements-form";

export const metadata: Metadata = {
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

function ConferencePage() {
    return (
        <div className="flex flex-col relative ">
            <ConferenceHero />
            <EventManagementServices />
            <ConferenceManagementServices />
            <CommunicateSection />
            <VirtualEventsSection />
            <PortfolioGalleryHeading />
            <PortfolioGallery />
            <BoothRequirementsForm />
        </div>
    );
}

export default ConferencePage;
