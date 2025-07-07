import React from "react";
import { Metadata } from "next";
import CitiesHero from "@/components/cities/cities-hero";
import CitiesGrid from "@/components/cities/cities-grid";
import { getCitiesPageData } from "@/services/cities-page.service";

// Enable ISR - revalidate every 4 hours (14400 seconds)
export const revalidate = 14400;

export const metadata: Metadata = {
    title: "Our Global Locations | Chronicle Exhibits",
    description: "Discover our presence across the Middle East and beyond, delivering exceptional exhibition solutions worldwide.",
    openGraph: {
        title: "Our Global Locations | Chronicle Exhibits",
        description: "Discover our presence across the Middle East and beyond, delivering exceptional exhibition solutions worldwide.",
        type: "website",
    },
};

// Server component that fetches data at build/request time for better SEO
async function CitiesPage() {
    // Fetch cities data server-side for SEO optimization
    const citiesPageData = await getCitiesPageData();

    // Transform cities data for the grid component (maintaining backward compatibility)
    const citiesForGrid = citiesPageData.cities.map(city => ({
        id: parseInt(city.id) || 0, // Convert UUID to number for legacy compatibility
        name: city.name,
        slug: city.slug,
        image: city.heroImage,
    }));

    return (
        <div className="min-h-screen bg-white">
            <CitiesHero />
            <CitiesGrid cities={citiesForGrid} />
        </div>
    );
};

export default CitiesPage;
