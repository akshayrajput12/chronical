import React from "react";
import { Metadata } from "next";
import KioskMain from "./components/kiosk-main";
import KioskContent from "./components/kiosk-content";
import KioskBenefits from "./components/kiosk-benefits";
import KioskManufacturers from "./components/kiosk-manufacturers";
import KioskConsultancy from "./components/kiosk-consultancy";
import BoothRequirementsForm from "../home/components/booth-requirements-form";
import { getKioskPageData } from "@/services/kiosk-page.service";

// Enable ISR - revalidate every 4 hours (14400 seconds)
export const revalidate = 14400;

export const metadata: Metadata = {
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
