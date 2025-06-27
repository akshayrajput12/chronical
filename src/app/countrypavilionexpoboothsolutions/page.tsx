import React from "react";
import { Metadata } from "next";
import DynamicCountryPavilionHero from "./components/dynamic-country-pavilion-hero";
import DynamicCountryPavilionIntroSection from "./components/dynamic-country-pavilion-intro-section";
import DynamicExceptionalDesignSection from "./components/dynamic-exceptional-design-section";
import DynamicPortfolioGrid from "./components/dynamic-portfolio-grid";
import BoothRequirementsForm from "../home/components/booth-requirements-form";

export const metadata: Metadata = {
    title: "Country Pavilion Expo Booth Design UAE | Chronicle Exhibits",
    description:
        "Chronicle Exhibition Organizing LLC masters the art of designing for country pavilion expo booth. Let your brand shine at international events by using our unique country pavilion exhibition stands.",
    openGraph: {
        title: "Country Pavilion Expo Booth Design UAE | Chronicle Exhibits",
        description:
            "Chronicle Exhibition Organizing LLC masters the art of designing for country pavilion expo booth. Let your brand shine at international events by using our unique country pavilion exhibition stands.",
        type: "website",
    },
};

function CountryPavilionExpoBoothSolutionsPage() {
    return (
        <div className="flex flex-col relative">
            <DynamicCountryPavilionHero />
            <DynamicCountryPavilionIntroSection />
            <DynamicExceptionalDesignSection />
            <DynamicPortfolioGrid />
            <BoothRequirementsForm />
        </div>
    );
}

export default CountryPavilionExpoBoothSolutionsPage;
