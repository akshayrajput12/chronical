"use client";

import React from "react";
import Image from "next/image";
import { AboutDedicationSectionData, AboutDedicationItemData } from "@/types/about";

interface DedicationSectionServerProps {
    dedicationSectionData: any | null; // Using any for now since the service returns any
}

interface FeatureCardProps {
    title: string;
    description: string;
    image: string;
    index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, image, index }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="relative h-48 w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

const DedicationSectionServer = ({ dedicationSectionData }: DedicationSectionServerProps) => {
    // Default fallback data for when server data is not available
    const defaultSectionData: AboutDedicationSectionData = {
        id: "",
        section_heading: "Dedication To Quality And Precision",
        section_description: undefined,
        is_active: true,
        created_at: "",
        updated_at: "",
    };

    const defaultItems: AboutDedicationItemData[] = [
        {
            id: "1",
            section_id: "",
            title: "Quality Assurance",
            description: "We maintain the highest standards of quality in all our services and products.",
            image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            image_alt: "Quality Assurance",
            display_order: 1,
            is_active: true,
            created_at: "",
            updated_at: "",
        },
        {
            id: "2",
            section_id: "",
            title: "Precision Engineering",
            description: "Our team focuses on precision and attention to detail in every project.",
            image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            image_alt: "Precision Engineering",
            display_order: 2,
            is_active: true,
            created_at: "",
            updated_at: "",
        },
        {
            id: "3",
            section_id: "",
            title: "Innovation",
            description: "We continuously innovate to provide cutting-edge solutions for our clients.",
            image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            image_alt: "Innovation",
            display_order: 3,
            is_active: true,
            created_at: "",
            updated_at: "",
        },
    ];

    // Use server data if available, otherwise use default data
    const sectionData = dedicationSectionData || defaultSectionData;
    const items = dedicationSectionData?.items || defaultItems;

    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        {sectionData.section_heading}
                    </h2>
                    {sectionData.section_description && (
                        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                            {sectionData.section_description}
                        </p>
                    )}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item: AboutDedicationItemData, index: number) => (
                        <FeatureCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            image={item.image_url || ""}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DedicationSectionServer;
