"use client";

import React from "react";
import { notFound } from "next/navigation";
import CityDetailHero from "@/components/cities/city-detail-hero";
import CityContentSection from "@/components/cities/city-content-section";
import CityRoleSection from "@/components/cities/city-role-section";
import CityComponentsSection from "@/components/cities/city-components-section";
import CityPortfolioSection from "@/components/cities/city-portfolio-section";
import CityWhyBestSection from "@/components/cities/city-why-best-section";
import { useCity } from "@/hooks/use-cities";
import { useComponentLoading } from "@/hooks/use-minimal-loading";
import { ServicesGrid } from "./services-grid";
import BoothRequirementsForm from "@/app/home/components/booth-requirements-form";

interface CityDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const CityDetailPage = ({ params }: CityDetailPageProps) => {
    const resolvedParams = React.use(params);
    const { city, isLoading, error } = useCity(resolvedParams.slug);

    // Use the component loading hook for consistent loading states
    useComponentLoading(isLoading, `Loading ${resolvedParams.slug} details...`);

    // Handle city not found
    if (!isLoading && !city && !error) {
        notFound();
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-white mt-16 md:mt-20 lg:mt-24 flex items-center justify-center">
                <div className="text-center py-8 md:py-12 lg:py-16">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Error Loading City
                    </h1>
                    <p className="text-gray-600 mb-6">{error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white px-6 py-2 rounded-full transition-colors duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Show loading state (handled by useComponentLoading hook)
    if (isLoading || !city) {
        return (
            <div className="min-h-screen bg-white mt-16 md:mt-20 lg:mt-24">
                {/* Skeleton loading state */}
                <div className="w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] bg-gray-200 animate-pulse"></div>
                <div className="py-8 md:py-12 lg:py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </div>
                    </div>
                </div>
                <div className="py-8 md:py-12 lg:py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="h-8 bg-gray-200 rounded animate-pulse mb-8"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-8 max-w-4xl mx-auto"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="aspect-[4/3] bg-gray-200 rounded animate-pulse"></div>
                                <div className="aspect-[4/3] bg-gray-200 rounded animate-pulse"></div>
                                <div className="aspect-[4/3] bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white mt-16 md:mt-20 lg:mt-24">
            <CityDetailHero city={city} />
            <ServicesGrid city={city} />
            <CityContentSection city={city} />
            <CityComponentsSection city={city} />
            <CityPortfolioSection city={city} />
            <CityWhyBestSection city={city} />
            <BoothRequirementsForm />
        </div>
    );
};

export default CityDetailPage;
