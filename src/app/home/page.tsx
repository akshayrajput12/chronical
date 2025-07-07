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

// Enable ISR - revalidate every 1 hour (3600 seconds)
export const revalidate = 3600;

// Server component that fetches data at build/request time for better SEO
async function page() {
    // Fetch all home page data server-side for SEO optimization
    const homePageData = await getHomePageData();

    return (
        <div className="flex flex-col relative">
            <HeroSection heroData={homePageData.hero} />
            <EssentialSupport essentialSupportData={homePageData.essentialSupport} />
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
