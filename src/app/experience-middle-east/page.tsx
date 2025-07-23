import React from "react";
import { Metadata } from "next";
import CitiesHero from "@/components/cities/cities-hero";
import CitiesGrid from "@/components/cities/cities-grid";
import { getCitiesPageData } from "@/services/cities-page.service";
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
            .eq("page_name", PageName.CITIES);
        if (error) {
            console.error("Error fetching seo data:", error);
            return {
                title: "Our Global Locations | Chronicle Exhibits",
                description:
                    "Discover our presence across the Middle East and beyond, delivering exceptional exhibition solutions worldwide.",
                openGraph: {
                    title: "Our Global Locations | Chronicle Exhibits",
                    description:
                        "Discover our presence across the Middle East and beyond, delivering exceptional exhibition solutions worldwide.",
                    type: "website",
                },
            };
        }
        return {
            title:
                data[0].meta_title ||
                "Our Global Locations | Chronicle Exhibits",
            keywords:
                data[0].meta_keywords ||
                "chronicle exhibits, exhibition stand design, trade show services, exhibition company dubai, dubai exhibition stands, dubai trade shows, dubai exhibitions, dubai trade show design, dubai trade show services",
            description:
                data[0].meta_description ||
                "Discover our presence across the Middle East and beyond, delivering exceptional exhibition solutions worldwide.",
            openGraph: {
                title:
                    data[0].meta_title ||
                    "Our Global Locations | Chronicle Exhibits",
                description:
                    data[0].meta_description ||
                    "Discover our presence across the Middle East and beyond, delivering exceptional exhibition solutions worldwide.",
                type: "website",
            },
        };
    } catch (error) {
        return {
            title: "Our Global Locations | Chronicle Exhibits",
            description:
                "Discover our presence across the Middle East and beyond, delivering exceptional exhibition solutions worldwide.",
            openGraph: {
                title: "Our Global Locations | Chronicle Exhibits",
                description:
                    "Discover our presence across the Middle East and beyond, delivering exceptional exhibition solutions worldwide.",
                type: "website",
            },
        };
    }
}

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
}

export default CitiesPage;
