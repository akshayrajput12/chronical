import React from "react";
import { Metadata } from "next";
import DoubleDeckerHero from "./components/double-decker-hero";
import UniqueQualitySection from "./components/unique-quality-section";
import EffectiveCommunicationSection from "./components/effective-communication-section";
import BoothRequirementsForm from "../home/components/booth-requirements-form";
import DoubleDeckersPortfolio from "./components/double-decker-portfolio";
import DoubleDeckerParagraphSection from "./components/double-decker-paragraph-section";
import { getDoubleDeckerPageData } from "@/services/double-decker-page.service";
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
            .eq("page_name", PageName.DOUBLE_DECKER_STAND);
        if (error) {
            console.error("Error fetching seo data:", error);
            return {
                title: "Double Decker Exhibition Stands Dubai | Chronicle Exhibits",
                description:
                    "Make your exhibit stand out and step up with our smartly created Double Decker Exhibition Stands. Engage your visitors with our stunning and innovative double-decker booths.",
                keywords:
                    "double decker exhibition stands dubai, double storey exhibition booths, two level exhibition stands, multi level exhibition displays",
                openGraph: {
                    title: "Double Decker Exhibition Stands Dubai | Chronicle Exhibits",
                    description:
                        "Stunning and innovative double-decker exhibition booths in Dubai.",
                    type: "website",
                },
            };
        }
        return {
            title:
                data[0].meta_title ||
                "Double Decker Exhibition Stands Dubai | Chronicle Exhibits",
            description:
                data[0].meta_description ||
                "Make your exhibit stand out and step up with our smartly created Double Decker Exhibition Stands. Engage your visitors with our stunning and innovative double-decker booths.",
            keywords:
                data[0].meta_keywords ||
                "double decker exhibition stands dubai, double storey exhibition booths, two level exhibition stands, multi level exhibition displays",
            openGraph: {
                title:
                    data[0].meta_title ||
                    "Double Decker Exhibition Stands Dubai | Chronicle Exhibits",
                description:
                    data[0].meta_description ||
                    "Stunning and innovative double-decker exhibition booths in Dubai.",
                type: "website",
            },
        };
    } catch (error) {
        return {
            title: "Double Decker Exhibition Stands Dubai | Chronicle Exhibits",
            description:
                "Make your exhibit stand out and step up with our smartly created Double Decker Exhibition Stands. Engage your visitors with our stunning and innovative double-decker booths.",
            keywords:
                "double decker exhibition stands dubai, double storey exhibition booths, two level exhibition stands, multi level exhibition displays",
            openGraph: {
                title: "Double Decker Exhibition Stands Dubai | Chronicle Exhibits",
                description:
                    "Stunning and innovative double-decker exhibition booths in Dubai.",
                type: "website",
            },
        };
    }
}

// Server component that fetches data at build/request time for better SEO
async function DoubleDeckerExhibitionStandsPage() {
    // Fetch all double decker page data server-side for SEO optimization
    const doubleDeckerPageData = await getDoubleDeckerPageData();

    return (
        <div className="flex flex-col relative">
            <DoubleDeckerHero />
            <UniqueQualitySection />
            <EffectiveCommunicationSection />
            <DoubleDeckersPortfolio />
            <DoubleDeckerParagraphSection />
            <BoothRequirementsForm />
        </div>
    );
}

export default DoubleDeckerExhibitionStandsPage;
