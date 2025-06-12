import React from "react";
import HeroSection from "./components/hero";
import BusinessHubSection from "./components/buisness";
import DynamicCell from "./components/dynamiccell";
import WhySection from "./components/why-section";
import SetupProcess from "./components/setup-process";
import NewCompany from "./components/new-company";
import ApplicationCta from "./components/application-cta";
import EssentialSupport from "./components/essential-support";

function page() {
    return (
        <div className="flex flex-col relative">
            <HeroSection />
            <EssentialSupport />
            <BusinessHubSection />
            <DynamicCell />
            <WhySection />
            <NewCompany />
            <SetupProcess />
            <ApplicationCta />
        </div>
    );
}

export default page;
