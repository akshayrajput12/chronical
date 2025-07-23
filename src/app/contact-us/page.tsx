import React from "react";
import { Metadata } from "next";
import { getContactPageData } from "@/services/contact-page.service";
import ContactHero from "./components/contact-hero";
import ContactInfo from "./components/contact-info";
import ContactForm from "./components/contact-form";
import ContactMap from "./components/contact-map";
import { createClient } from "@/lib/supabase/client";
import { PageName } from "../admin/constants/pages";

// Enable ISR - revalidate every 4 hours (14400 seconds)
export const revalidate = 14400;

// Generate dynamic metadata based on contact page data
export async function generateMetadata(): Promise<Metadata> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("static_page_seo_data")
            .select("*")
            .eq("page_name", PageName.CONTACT_US);
        if (error) {
            console.error("Error fetching seo data:", error);
            return {
                title: "Contact Us | Chronicle Exhibits - Exhibition Stand Design Dubai",
                description:
                    "Get in touch with Chronicle Exhibits for expert exhibition stand design and construction services in Dubai. Contact our team for consultations and project discussions.",
                keywords:
                    "contact chronicle exhibits, exhibition stand design dubai, trade show services contact, exhibition company dubai contact",
                openGraph: {
                    title: "Contact Us | Chronicle Exhibits",
                    description:
                        "Get in touch with Chronicle Exhibits for expert exhibition stand design and construction services in Dubai.",
                    type: "website",
                },
            };
        }
        return {
            title:
                data[0].meta_title ||
                "Contact Us | Chronicle Exhibits - Exhibition Stand Design Dubai",
            description:
                data[0].meta_description ||
                "Get in touch with Chronicle Exhibits for expert exhibition stand design and construction services in Dubai. Contact our team for consultations and project discussions.",
            keywords:
                data[0].meta_keywords ||
                "contact chronicle exhibits, exhibition stand design dubai, trade show services contact, exhibition company dubai contact",
            openGraph: {
                title: data[0].meta_title || "Contact Us | Chronicle Exhibits",
                description:
                    data[0].meta_description ||
                    "Get in touch with Chronicle Exhibits for expert exhibition stand design and construction services in Dubai.",
                type: "website",
            },
        };
    } catch (error) {
        console.error("Error generating contact page metadata:", error);
        return {
            title: "Contact Us | Chronicle Exhibits - Exhibition Stand Design Dubai",
            description:
                "Get in touch with Chronicle Exhibits for expert exhibition stand design and construction services in Dubai. Contact our team for consultations and project discussions.",
            keywords:
                "contact chronicle exhibits, exhibition stand design dubai, trade show services contact, exhibition company dubai contact",
        };
    }
}

// Server component that fetches data at build/request time for better SEO
async function ContactUsPage() {
    // Fetch all contact page data server-side for SEO optimization
    const contactPageData = await getContactPageData();

    return (
        <div className="flex flex-col relative">
            <ContactHero heroData={contactPageData.hero} />
            <ContactForm formSettings={contactPageData.formSettings} />
            <ContactInfo groupCompanies={contactPageData.groupCompanies} />
            <ContactMap mapSettings={contactPageData.mapSettings} />
        </div>
    );
}

export default ContactUsPage;
