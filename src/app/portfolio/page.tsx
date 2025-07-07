import React from "react";
import { Metadata } from "next";
import PortfolioGallery from "./components/portfolio-gallery";
import BoothRequirements from "./components/booth-requirements";
import PortfolioHero from "./components/portfolio-hero";
import { getPortfolioPageData } from "@/services/portfolio-page.service";

// Enable ISR - revalidate every 6 hours (21600 seconds)
export const revalidate = 21600;

export const metadata: Metadata = {
    title: "Portfolio | Chronicle Exhibits - Exhibition Stand Design Gallery",
    description:
        "Explore our portfolio of stunning exhibition stands and trade show designs. See our latest projects and creative solutions for exhibitions in Dubai and worldwide.",
    keywords:
        "exhibition stand portfolio, trade show designs, exhibition gallery, chronicle exhibits projects, dubai exhibition stands",
    openGraph: {
        title: "Portfolio | Chronicle Exhibits",
        description:
            "Explore our portfolio of stunning exhibition stands and trade show designs.",
        type: "website",
    },
};

async function PortfolioPage() {
    // Fetch all portfolio data server-side for SEO optimization
    const portfolioData = await getPortfolioPageData();

    return (
        <div className="flex flex-col relative mt-16 md:mt-20 lg:mt-24">
            <PortfolioHero heroData={portfolioData.hero} />
            <PortfolioGallery portfolioItems={portfolioData.portfolioItems} />
            <BoothRequirements />
        </div>
    );
}

export default PortfolioPage;
