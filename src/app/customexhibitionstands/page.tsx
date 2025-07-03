import React from "react";
import { Metadata } from "next";
import { getCustomExhibitionPageData } from "@/services/custom-exhibition-page.service";
import CustomExhibitionHeroServer from "./components/custom-exhibition-hero-server";
import LeadingContractorSectionServer from "./components/leading-contractor-section-server";
import PromoteBrandSectionServer from "./components/promote-brand-section-server";
import StrikingCustomizedSectionServer from "./components/striking-customized-section-server";
import ReasonsToChooseSectionServer from "./components/reasons-to-choose-section-server";
import FAQSectionServer from "./components/faq-section-server";
import BoothRequirementsForm from "../home/components/booth-requirements-form";
import PortfolioSection from "./components/portfolio-section";
import CustomParagraphSection from "./components/custom-paragraph-section";

export const metadata: Metadata = {
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

// Server component that fetches data at build/request time for better SEO
async function CustomExhibitionStandsPage() {
    // Fetch all custom exhibition stands page data server-side for SEO optimization
    const customExhibitionPageData = await getCustomExhibitionPageData();

    return (
        <div className="flex flex-col relative">
            <CustomExhibitionHeroServer heroData={customExhibitionPageData.hero} />
            <LeadingContractorSectionServer leadingContractorData={customExhibitionPageData.leadingContractor} />
            <PromoteBrandSectionServer promoteBrandData={customExhibitionPageData.promoteBrand} />
            <StrikingCustomizedSectionServer strikingCustomizedData={customExhibitionPageData.strikingCustomized} />
            <ReasonsToChooseSectionServer reasonsToChooseData={customExhibitionPageData.reasonsToChoose} />
            <FAQSectionServer faqSectionData={customExhibitionPageData.faqSection} faqItemsData={customExhibitionPageData.faqItems} />
            <PortfolioSection />
            <CustomParagraphSection />
            <BoothRequirementsForm />
        </div>
    );
}

export default CustomExhibitionStandsPage;
