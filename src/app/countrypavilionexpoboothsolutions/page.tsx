import React from "react";
import { Metadata } from "next";
import { getCountryPavilionPageData } from "@/services/country-pavilion-page.service";
import CountryPavilionHeroServer from "./components/country-pavilion-hero-server";
import CountryPavilionIntroSectionServer from "./components/country-pavilion-intro-section-server";
import ExceptionalDesignSectionServer from "./components/exceptional-design-section-server";
import PortfolioGridServer from "./components/portfolio-grid-server";
import BoothRequirementsForm from "../home/components/booth-requirements-form";
import ExpoPavilionParagraphSectionServer from "./components/expo-pavilion-paragraph-section-server";

// Enable ISR - revalidate every 6 hours (21600 seconds)
export const revalidate = 21600;

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

// Server component that fetches data at build/request time for better SEO
async function CountryPavilionExpoBoothSolutionsPage() {
    // Fetch all country pavilion page data server-side for SEO optimization
    const countryPavilionPageData = await getCountryPavilionPageData();

    return (
        <div className="flex flex-col relative">
            <CountryPavilionHeroServer heroData={countryPavilionPageData.hero} />
            <CountryPavilionIntroSectionServer introData={countryPavilionPageData.intro} />
            <ExceptionalDesignSectionServer
                exceptionalDesignData={countryPavilionPageData.exceptionalDesign}
                designBenefitsData={countryPavilionPageData.designBenefits}
            />
            <PortfolioGridServer
                portfolioSectionData={countryPavilionPageData.portfolioSection}
                portfolioItemsData={countryPavilionPageData.portfolioItems}
            />
            <ExpoPavilionParagraphSectionServer paragraphSectionData={countryPavilionPageData.paragraphSection} />
            <BoothRequirementsForm />
        </div>
    );
}

export default CountryPavilionExpoBoothSolutionsPage;
