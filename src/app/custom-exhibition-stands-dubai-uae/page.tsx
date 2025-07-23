import React from "react";
import { Metadata } from "next";
import { getCustomExhibitionPageData } from "@/services/custom-exhibition-page.service";
import CustomExhibitionHeroServer from "./components/custom-exhibition-hero-server";
import LeadingContractorSectionServer from "./components/leading-contractor-section-server";
import PromoteBrandSectionServer from "./components/promote-brand-section-server";

import ReasonsToChooseSectionServer from "./components/reasons-to-choose-section-server";
import FAQSectionServer from "./components/faq-section-server";
import BoothRequirementsForm from "../home/components/booth-requirements-form";
import PortfolioSection from "./components/portfolio-section";
import CustomParagraphSection from "./components/custom-paragraph-section";
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
            .eq("page_name", PageName.CUSTOM_STANDS);
        if (error) {
            console.error("Error fetching seo data:", error);
            return {
                title: "Custom Exhibition Stands in Dubai UAE | Chronicle Exhibits",
                description:
                    "Custom exhibition stands in Dubai UAE. We design and manufacture custom exhibition stands for trade shows and exhibitions.",
                keywords:
                    "custom exhibition stands dubai, custom exhibition stands, custom trade show stands, custom exhibition booths, custom trade show booths, exhibition stands dubai, trade show stands dubai, exhibition booths dubai, trade show booths dubai",
                openGraph: {
                    title: "Custom Exhibition Stands in Dubai UAE | Chronicle Exhibits",
                    description: "Custom exhibition stands in Dubai UAE.",
                    type: "website",
                },
            };
        }
        return {
            title:
                data[0].meta_title ||
                "Custom Exhibition Stands in Dubai UAE | Chronicle Exhibits",
            description:
                data[0].meta_description ||
                "Custom exhibition stands in Dubai UAE. We design and manufacture custom exhibition stands for trade shows and exhibitions.",
            keywords:
                data[0].meta_keywords ||
                "custom exhibition stands dubai, custom exhibition stands, custom trade show stands, custom exhibition booths, custom trade show booths, exhibition stands dubai, trade show stands dubai, exhibition booths dubai, trade show booths dubai",
            openGraph: {
                title:
                    data[0].meta_title ||
                    "Custom Exhibition Stands in Dubai UAE | Chronicle Exhibits",
                description:
                    data[0].meta_description ||
                    "Custom exhibition stands in Dubai UAE.",
                type: "website",
            },
        };
    } catch (error) {
        return {
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
    }
}

// Server component that fetches data at build/request time for better SEO
async function CustomExhibitionStandsPage() {
    // Fetch all custom exhibition stands page data server-side for SEO optimization
    const customExhibitionPageData = await getCustomExhibitionPageData();

    return (
        <div className="flex flex-col relative">
            <CustomExhibitionHeroServer
                heroData={customExhibitionPageData.hero}
            />
            <LeadingContractorSectionServer
                leadingContractorData={
                    customExhibitionPageData.leadingContractor
                }
            />
            <PromoteBrandSectionServer
                promoteBrandData={customExhibitionPageData.promoteBrand}
            />

            <ReasonsToChooseSectionServer
                reasonsToChooseData={customExhibitionPageData.reasonsToChoose}
            />
            <FAQSectionServer
                faqSectionData={customExhibitionPageData.faqSection}
                faqItemsData={customExhibitionPageData.faqItems}
            />
            <PortfolioSection />
            <CustomParagraphSection />
            <BoothRequirementsForm />
        </div>
    );
}

export default CustomExhibitionStandsPage;
