import React from "react";
import { getAboutPageData } from "@/services/about-page.service";
import AboutHero from "./components/about-hero";
import AboutUsMainServer from "./components/about-us-main-server";
import AboutUsDescriptionServer from "./components/about-us-description-server";
import DedicationSectionServer from "./components/dedication-section-server";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/client";
import { PageName } from "../admin/constants/pages";

// Enable ISR - revalidate every 2 hours (7200 seconds)
export const revalidate = 7200;

export async function generateMetadata(): Promise<Metadata> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("static_page_seo_data")
            .select("*")
            .eq("page_name", PageName.ABOUT_US);
        if (error) {
            console.error("Error fetching seo data:", error);
            return {
                title: "About Us | Chronicle Exhibits - Exhibition Stand Design Dubai",
                description:
                    "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai. Our team of experts has years of experience in the industry and can help you create a stunning exhibition stand that will leave a lasting impression on your visitors.",
                keywords:
                    "about us, chronicle exhibits, exhibition stand design, trade show services, exhibition company dubai, dubai exhibition stands, dubai trade shows, dubai exhibitions, dubai trade show design, dubai trade show services",
                openGraph: {
                    title: "About Us | Chronicle Exhibits",
                    description:
                        "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai.",
                    type: "website",
                },
            };
        }
        return {
            title:
                data[0].meta_title ||
                "About Us | Chronicle Exhibits - Exhibition Stand Design Dubai",
            description:
                data[0].meta_description ||
                "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai. Our team of experts has years of experience in the industry and can help you create a stunning exhibition stand that will leave a lasting impression on your visitors.",
            keywords:
                data[0].meta_keywords ||
                "about us, chronicle exhibits, exhibition stand design, trade show services, exhibition company dubai, dubai exhibition stands, dubai trade shows, dubai exhibitions, dubai trade show design, dubai trade show services",
            openGraph: {
                title: data[0].meta_title || "About Us | Chronicle Exhibits",
                description:
                    data[0].meta_description ||
                    "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai.",
                type: "website",
            },
        };
    } catch (error) {
        return {
            title: "About Us | Chronicle Exhibits - Exhibition Stand Design Dubai",
            description:
                "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai. Our team of experts has years of experience in the industry and can help you create a stunning exhibition stand that will leave a lasting impression on your visitors.",
            keywords:
                "about us, chronicle exhibits, exhibition stand design, trade show services, exhibition company dubai, dubai exhibition stands, dubai trade shows, dubai exhibitions, dubai trade show design, dubai trade show services",
            openGraph: {
                title: "About Us | Chronicle Exhibits",
                description:
                    "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai.",
                type: "website",
            },
        };
    }
}

// Server component that fetches data at build/request time for better SEO
async function AboutPage() {
    // Fetch all about page data server-side for SEO optimization
    const aboutPageData = await getAboutPageData();

    return (
        <div className="flex flex-col relative">
            <AboutHero />
            <AboutUsMainServer mainSectionData={aboutPageData.mainSection} />
            <AboutUsDescriptionServer
                descriptionSectionData={aboutPageData.descriptionSection}
            />
            <DedicationSectionServer
                dedicationSectionData={aboutPageData.dedicationSection}
            />
        </div>
    );
}

export default AboutPage;
