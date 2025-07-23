import React from "react";
import { getHomePageData } from "@/services/home-page.service";
import HeroSection from "./components/hero";
import BusinessHubSection from "./components/buisness";
import DynamicCell from "./components/dynamiccell";
import WhySection from "./components/why-section";
import SetupProcess from "./components/setup-process";
import NewCompany from "./components/new-company";
import EssentialSupport from "./components/essential-support";
import BoothRequirementsForm from "./components/booth-requirements-form";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/client";
import { PageName } from "../admin/constants/pages";

// Enable ISR - revalidate every 1 hour (3600 seconds)
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("static_page_seo_data")
            .select("*")
            .eq("page_name", PageName.HOME);
        if (error) {
            console.error("Error fetching seo data:", error);
            return {
                title: "Home | Chronicle Exhibits - Exhibition Stand Design Dubai",
                description:
                    "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai. Our team of experts has years of experience in the industry and can help you create a stunning exhibition stand that will leave a lasting impression on your visitors.",
                keywords:
                    "home chronicle exhibits, exhibition stand design dubai, trade show services home, exhibition company dubai home",
            };
        }
        return {
            title:
                data[0].meta_title ||
                "Home | Chronicle Exhibits - Exhibition Stand Design Dubai",
            description:
                data[0].meta_description ||
                "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai. Our team of experts has years of experience in the industry and can help you create a stunning exhibition stand that will leave a lasting impression on your visitors.",
            keywords:
                data[0].meta_keywords ||
                "home chronicle exhibits, exhibition stand design dubai, trade show services home, exhibition company dubai home",
        };
    } catch (error) {
        return {
            title: "Home | Chronicle Exhibits - Exhibition Stand Design Dubai",
            description:
                "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai. Our team of experts has years of experience in the industry and can help you create a stunning exhibition stand that will leave a lasting impression on your visitors.",
            keywords:
                "home chronicle exhibits, exhibition stand design dubai, trade show services home, exhibition company dubai home",
        };
    }
}

// Server component that fetches data at build/request time for better SEO
async function page() {
    // Fetch all home page data server-side for SEO optimization
    const homePageData = await getHomePageData();

    return (
        <div className="flex flex-col relative">
            <HeroSection heroData={homePageData.hero} />
            <EssentialSupport
                essentialSupportData={homePageData.essentialSupport}
            />
            <BusinessHubSection businessData={homePageData.business} />
            <DynamicCell
                businessData={homePageData.business}
                dynamicCellData={homePageData.dynamicCell}
            />
            <WhySection whyData={homePageData.whySection} />
            <SetupProcess setupData={homePageData.setupProcess} />
            <NewCompany
                newCompanyData={homePageData.newCompany.section}
                newCompanyImages={homePageData.newCompany.images || {}}
            />
            <BoothRequirementsForm />
        </div>
    );
}

export default page;
