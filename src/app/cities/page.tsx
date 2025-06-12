"use client";

import React from "react";
import CitiesHero from "@/components/cities/cities-hero";
import CitiesGrid from "@/components/cities/cities-grid";
import { useCities } from "@/hooks/use-cities";
import { useComponentLoading } from "@/hooks/use-minimal-loading";

const CitiesPage = () => {
    const { cities, isLoading, error } = useCities();

    // Use the component loading hook for consistent loading states
    useComponentLoading(isLoading, "Loading cities...");

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center py-8 md:py-12 lg:py-16">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Error Loading Cities
                    </h1>
                    <p className="text-gray-600 mb-6">{error?.message}</p>
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

    // Transform cities data for the grid component (maintaining backward compatibility)
    const citiesForGrid = cities.map(city => ({
        id: city.id,
        name: city.name,
        slug: city.slug,
        image: city.heroImage,
    }));

    return (
        <div className="min-h-screen bg-white">
            <CitiesHero />
            {isLoading ? (
                <div className="py-8 md:py-12 lg:py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-200 h-64 rounded-lg animate-pulse"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <CitiesGrid cities={citiesForGrid} />
            )}
        </div>
    );
};

export default CitiesPage;
