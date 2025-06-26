import React from "react";
import { Metadata } from "next";
import CustomExhibitionHero from "./components/custom-exhibition-hero";
import LeadingContractorSection from "./components/leading-contractor-section";
import PromoteBrandSection from "./components/promote-brand-section";
import StrikingCustomizedSection from "./components/striking-customized-section";
import ReasonsToChooseSection from "./components/reasons-to-choose-section";
import FAQSection from "./components/faq-section";
import LookingForStandsSection from "./components/looking-for-stands-section";
import BoothRequirementsForm from "../home/components/booth-requirements-form";
import PortfolioGrid from "@/components/ui/stands-portfolio";

export const metadata: Metadata = {
    title: "Custom Exhibition Stands Dubai | Chronicle Exhibits - Leading Contractor",
    description:
        "Leading contractor for custom exhibition stands in Dubai. We design and build custom exhibition stands that transform your appearance at exhibitions.",
    keywords:
        "custom exhibition stands dubai, exhibition stand contractor, exhibition booth design, trade show stands dubai",
    openGraph: {
        title: "Custom Exhibition Stands Dubai | Chronicle Exhibits",
        description:
            "Leading contractor for custom exhibition stands in Dubai that exceed your brand.",
        type: "website",
    },
};

function CustomExhibitionStandsPage() {
    return (
        <div className="flex flex-col relative">
            <CustomExhibitionHero />
            <LeadingContractorSection />
            <PromoteBrandSection />
            <FAQSection />
            <PortfolioGrid />
            <BoothRequirementsForm />
        </div>
    );
}

export default CustomExhibitionStandsPage;
