"use client";

import React from "react";
import { notFound } from "next/navigation";
import CityDetailHero from "@/components/cities/city-detail-hero";
import CityDetailContent from "@/components/cities/city-detail-content";

// Cities data - this would typically come from a CMS or API
const cities = [
    {
        id: 1,
        name: "Saudi Arabia",
        slug: "saudi-arabia",
        subtitle: "Leading exhibition solutions across the Kingdom",
        heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Discover our comprehensive exhibition services in Saudi Arabia, where we deliver world-class solutions for major trade shows and events across the Kingdom.",
    },
    {
        id: 2,
        name: "Abu Dhabi",
        slug: "abu-dhabi",
        subtitle: "Premium exhibition experiences in the UAE capital",
        heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Experience our exceptional exhibition services in Abu Dhabi, delivering innovative solutions for prestigious events and exhibitions in the UAE capital.",
    },
    {
        id: 3,
        name: "Qatar",
        slug: "qatar",
        subtitle: "Excellence in exhibition design and execution",
        heroImage: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Our Qatar operations showcase cutting-edge exhibition solutions, supporting major international events and trade shows throughout the country.",
    },
    {
        id: 4,
        name: "Turkey",
        slug: "turkey",
        subtitle: "Bridging Europe and Asia with exceptional exhibitions",
        heroImage: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Explore our Turkish operations where we deliver innovative exhibition solutions at the crossroads of Europe and Asia.",
    },
    {
        id: 5,
        name: "Kuwait",
        slug: "kuwait",
        subtitle: "Innovative exhibition solutions in Kuwait",
        heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Our Kuwait services provide comprehensive exhibition solutions for major trade shows and corporate events throughout the region.",
    },
    {
        id: 6,
        name: "Jordan",
        slug: "jordan",
        subtitle: "Strategic exhibition services in the Levant",
        heroImage: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Discover our Jordan operations, delivering exceptional exhibition experiences and supporting regional business growth.",
    },
];

interface CityDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const CityDetailPage = ({ params }: CityDetailPageProps) => {
    const resolvedParams = React.use(params);
    const city = cities.find(c => c.slug === resolvedParams.slug);

    if (!city) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white mt-16 md:mt-20 lg:mt-24">
            <CityDetailHero
                title={city.name}
                subtitle={city.subtitle}
                heroImage={city.heroImage}
            />
            <CityDetailContent 
                cityName={city.name}
                description={city.description}
            />
        </div>
    );
};

export default CityDetailPage;
