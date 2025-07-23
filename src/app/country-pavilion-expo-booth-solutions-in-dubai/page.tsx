import React from "react";
import { Metadata } from "next";
import { getCountryPavilionPageData } from "@/services/country-pavilion-page.service";
import CountryPavilionHeroServer from "./components/country-pavilion-hero-server";
import CountryPavilionIntroSectionServer from "./components/country-pavilion-intro-section-server";
import ExceptionalDesignSectionServer from "./components/exceptional-design-section-server";
import PortfolioGridServer from "./components/portfolio-grid-server";
import BoothRequirementsForm from "../home/components/booth-requirements-form";
import ExpoPavilionParagraphSectionServer from "./components/expo-pavilion-paragraph-section-server";
import { createClient } from "@/lib/supabase/client";
import { PageName } from "../admin/constants/pages";

// Enable ISR - revalidate every 6 hours (21600 seconds)
export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("static_page_seo_data")
            .select("*")
            .eq("page_name", PageName.EXPO_PAVILION_STANDS);
        if (error) {
            console.error("Error fetching seo data:", error);
            return {
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
        }
        return {
            title:
                data[0].meta_title ||
                "Country Pavilion Expo Booth Design UAE | Chronicle Exhibits",
            keywords:
                data[0].meta_keywords ||
                "country pavilion expo booth, country pavilion expo booths, country pavilion expo stands, country pavilion expo stand, expo pavilion stands, expo pavilion stand, expo pavilion booth, expo pavilion booths, expo pavilion stand, expo pavilion stands, expo pavilion booth design, expo pavilion booths design, expo pavilion stand design, expo pavilion stands design, country pavilion expo design, country pavilion expo designs, country pavilion expo stand design, country pavilion expo stand designs, expo pavilion design, expo pavilion designs, expo pavilion stand design, expo pavilion stand designs",
            description:
                data[0].meta_description ||
                "Chronicle Exhibition Organizing LLC masters the art of designing for country pavilion expo booth. Let your brand shine at international events by using our unique country pavilion exhibition stands.",
            openGraph: {
                title:
                    data[0].meta_title ||
                    "Country Pavilion Expo Booth Design UAE | Chronicle Exhibits",
                description:
                    data[0].meta_description ||
                    "Chronicle Exhibition Organizing LLC masters the art of designing for country pavilion expo booth. Let your brand shine at international events by using our unique country pavilion exhibition stands.",
                type: "website",
            },
        };
    } catch (error) {
        return {
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
    }
}

// Server component that fetches data at build/request time for better SEO
async function CountryPavilionExpoBoothSolutionsPage() {
    // Fetch all country pavilion page data server-side for SEO optimization
    const countryPavilionPageData = await getCountryPavilionPageData();

    return (
        <div className="flex flex-col relative">
            <CountryPavilionHeroServer
                heroData={countryPavilionPageData.hero}
            />
            <CountryPavilionIntroSectionServer
                introData={countryPavilionPageData.intro}
            />
            <ExceptionalDesignSectionServer
                exceptionalDesignData={
                    countryPavilionPageData.exceptionalDesign
                }
                designBenefitsData={countryPavilionPageData.designBenefits}
            />
            <PortfolioGridServer
                portfolioSectionData={countryPavilionPageData.portfolioSection}
                portfolioItemsData={countryPavilionPageData.portfolioItems}
            />
            <ExpoPavilionParagraphSectionServer
                paragraphSectionData={countryPavilionPageData.paragraphSection}
            />
            <BoothRequirementsForm />
        </div>
    );
}

export default CountryPavilionExpoBoothSolutionsPage;
