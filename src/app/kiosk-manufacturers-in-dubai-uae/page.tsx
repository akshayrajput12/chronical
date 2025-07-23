import React from "react";
import { Metadata } from "next";
import KioskMain from "./components/kiosk-main";
import KioskContent from "./components/kiosk-content";
import KioskBenefits from "./components/kiosk-benefits";
import KioskManufacturers from "./components/kiosk-manufacturers";
import KioskConsultancy from "./components/kiosk-consultancy";
import BoothRequirementsForm from "../home/components/booth-requirements-form";
import { getKioskPageData } from "@/services/kiosk-page.service";
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
            .eq("page_name", PageName.KIOSK);
        if (error) {
            console.error("Error fetching seo data:", error);
            return {
                title: "Kiosk Manufacturers in Dubai UAE | Chronicle Exhibits - Custom Kiosk Solutions",
                description:
                    "Leading kiosk manufacturers in Dubai UAE. We design and manufacture custom kiosks, interactive kiosks, and digital display solutions for exhibitions and events.",
                keywords:
                    "kiosk manufacturers dubai, custom kiosk solutions, interactive kiosks, digital display kiosks, exhibition kiosks dubai",
                openGraph: {
                    title: "Kiosk Manufacturers in Dubai UAE | Chronicle Exhibits",
                    description:
                        "Leading kiosk manufacturers in Dubai UAE providing custom kiosk solutions.",
                    type: "website",
                },
            };
        }
        return {
            title:
                data[0].meta_title ||
                "Kiosk Manufacturers in Dubai UAE | Chronicle Exhibits - Custom Kiosk Solutions",
            description:
                data[0].meta_description ||
                "Leading kiosk manufacturers in Dubai UAE. We design and manufacture custom kiosks, interactive kiosks, and digital display solutions for exhibitions and events.",
            keywords:
                data[0].meta_keywords ||
                "kiosk manufacturers dubai, custom kiosk solutions, interactive kiosks, digital display kiosks, exhibition kiosks dubai",
            openGraph: {
                title:
                    data[0].meta_title ||
                    "Kiosk Manufacturers in Dubai UAE | Chronicle Exhibits",
                description:
                    data[0].meta_description ||
                    "Leading kiosk manufacturers in Dubai UAE providing custom kiosk solutions.",
                type: "website",
            },
        };
    } catch (error) {
        return {
            title: "Kiosk Manufacturers in Dubai UAE | Chronicle Exhibits - Custom Kiosk Solutions",
            description:
                "Leading kiosk manufacturers in Dubai UAE. We design and manufacture custom kiosks, interactive kiosks, and digital display solutions for exhibitions and events.",
            keywords:
                "kiosk manufacturers dubai, custom kiosk solutions, interactive kiosks, digital display kiosks, exhibition kiosks dubai",
            openGraph: {
                title: "Kiosk Manufacturers in Dubai UAE | Chronicle Exhibits",
                description:
                    "Leading kiosk manufacturers in Dubai UAE providing custom kiosk solutions.",
                type: "website",
            },
        };
    }
}

// Server component that fetches data at build/request time for better SEO
async function KioskPage() {
    // Fetch all kiosk page data server-side for SEO optimization
    const kioskPageData = await getKioskPageData();

    return (
        <div className="flex flex-col relative">
            <KioskMain />
            <KioskContent />
            <KioskBenefits />
            <KioskManufacturers />
            <KioskConsultancy />
            <BoothRequirementsForm />
        </div>
    );
}

export default KioskPage;
