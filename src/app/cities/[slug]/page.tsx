import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CityDetailHero from "@/components/cities/city-detail-hero";
import CityContentSection from "@/components/cities/city-content-section";
import CityRoleSection from "@/components/cities/city-role-section";
import CityComponentsSection from "@/components/cities/city-components-section";
import CityPortfolioSection from "@/components/cities/city-portfolio-section";
import CityWhyBestSection from "@/components/cities/city-why-best-section";
import CityStatisticsSection from "@/components/cities/city-statistics-section";
import { getCityBySlug } from "@/services/cities-page.service";
import { ServicesGrid } from "./services-grid";
import BoothRequirementsForm from "@/app/home/components/booth-requirements-form";

interface CityDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CityDetailPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const city = await getCityBySlug(resolvedParams.slug);

    if (!city) {
        return {
            title: "City Not Found | Chronicle Exhibits",
            description: "The requested city page could not be found.",
        };
    }

    return {
        title: city.meta_title || `${city.name} | Chronicle Exhibits`,
        description: city.meta_description || city.description || `Discover our exhibition services in ${city.name}`,
        keywords: city.meta_keywords,
        openGraph: {
            title: city.meta_title || `${city.name} | Chronicle Exhibits`,
            description: city.meta_description || city.description || `Discover our exhibition services in ${city.name}`,
            type: "website",
        },
    };
}

// Server component that fetches data at build/request time for better SEO
async function CityDetailPage({ params }: CityDetailPageProps) {
    const resolvedParams = await params;

    // Fetch city data server-side for SEO optimization
    const city = await getCityBySlug(resolvedParams.slug);

    // Handle city not found
    if (!city) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white mt-16 md:mt-20 lg:mt-24">
            <CityDetailHero city={city} />
            <ServicesGrid city={city} />
            <CityContentSection city={city} />
            <CityComponentsSection city={city} />
            <CityStatisticsSection city={city} />
            <CityPortfolioSection city={city} />
            <CityWhyBestSection city={city} />
            <BoothRequirementsForm />
        </div>
    );
};

export default CityDetailPage;
