"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
    AboutDedicationSectionData,
    AboutDedicationItemData,
} from "@/types/about";

interface FeatureCardProps {
    title: string;
    description: string;
    image: string;
    index: number;
}

const DedicationSection = () => {
    // State for dynamic data
    const [sectionData, setSectionData] = useState<AboutDedicationSectionData>({
        id: "",
        section_heading: "Dedication To Quality And Precision",
        section_description: undefined,
        is_active: true,
        created_at: "",
        updated_at: "",
    });

    const [items, setItems] = useState<AboutDedicationItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load data on component mount
    useEffect(() => {
        loadDedicationData();
    }, []);

    const loadDedicationData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("Frontend: Loading dedication data...");

            // First check if tables exist
            const { data: tableCheck, error: tableError } = await supabase
                .from("about_dedication_sections")
                .select("*")
                .limit(1);

            console.log("Frontend: Table check result:", {
                tableCheck,
                tableError,
            });

            if (tableError) {
                console.warn(
                    "Frontend: Database tables not found, no data will be shown:",
                    tableError,
                );
                setLoading(false);
                return;
            }

            // Try to load section data
            const { data: sectionResponse, error: sectionError } =
                await supabase.rpc("get_about_dedication_section");

            console.log("Frontend: Section RPC result:", {
                sectionResponse,
                sectionError,
            });

            if (sectionError) {
                console.warn(
                    "Frontend: Database function not found, no data will be shown:",
                    sectionError,
                );
                // Don't show any data if database function doesn't exist
                setLoading(false);
                return;
            }

            if (sectionResponse && sectionResponse.length > 0) {
                console.log(
                    "Frontend: Found section data:",
                    sectionResponse[0],
                );
                setSectionData(sectionResponse[0]);
            } else {
                console.log("Frontend: No section data found");
            }

            // Try to load items data
            const { data: itemsResponse, error: itemsError } =
                await supabase.rpc("get_about_dedication_items");

            console.log("Frontend: Items RPC result:", {
                itemsResponse,
                itemsError,
            });

            if (itemsError) {
                console.warn(
                    "Frontend: Database function not found for items:",
                    itemsError,
                );
                setLoading(false);
                return;
            }

            if (itemsResponse) {
                console.log("Frontend: Found items data:", itemsResponse);
                // Construct proper image URLs for each item
                const itemsWithUrls = itemsResponse.map(
                    (item: AboutDedicationItemData) => {
                        let imageUrl = null;
                        if (item.image_url) {
                            const { data: urlData } = supabase.storage
                                .from("about-dedication")
                                .getPublicUrl(item.image_url);
                            imageUrl = urlData.publicUrl;
                        }

                        return {
                            ...item,
                            image_url: imageUrl,
                        };
                    },
                );

                setItems(itemsWithUrls);
                console.log("Frontend: Set items:", itemsWithUrls);
            } else {
                console.log("Frontend: No items data found");
            }
        } catch (error) {
            console.warn(
                "Frontend: Error loading dedication data, no data will be shown:",
                error,
            );
            // Don't show any data on error - only dynamic data
        } finally {
            setLoading(false);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white text-black overflow-hidden relative">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="animate-pulse">
                            <div className="text-center mb-12">
                                <div className="h-8 bg-gray-300 rounded mb-4 mx-auto max-w-md"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className="border rounded-lg p-4"
                                    >
                                        <div className="h-48 bg-gray-300 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-20 bg-gray-300 rounded"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map(i => (
                                    <div
                                        key={i}
                                        className="border rounded-lg p-4"
                                    >
                                        <div className="h-48 bg-gray-300 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-20 bg-gray-300 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Don't render if section is not active
    if (!sectionData.is_active) {
        return null;
    }

    // Don't render if no items are loaded from database - only show dynamic data
    if (items.length === 0) {
        return null;
    }

    return (
        <section
            className="py-8 md:py-12 lg:py-16 bg-white text-black overflow-hidden relative"
            aria-label="Our Core Values"
        >
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Section Title */}
                    <div className="text-center mb-4">
                        <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-2">
                            {sectionData.section_heading}
                        </h2>
                        {sectionData.section_description && (
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                {sectionData.section_description}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-4"></div>
                    </div>
                    {/* Dynamic Layout Based on Item Count */}
                    {items.length <= 3 ? (
                        // Single row for 3 or fewer items
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {items.map((item, index) => (
                                <FeatureCard
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    image={
                                        item.image_url ||
                                        item.fallback_image_url ||
                                        "https://via.placeholder.com/400x300"
                                    }
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : items.length === 4 ? (
                        // 2x2 grid for 4 items
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {items.map((item, index) => (
                                <FeatureCard
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    image={
                                        item.image_url ||
                                        item.fallback_image_url ||
                                        "https://via.placeholder.com/400x300"
                                    }
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : items.length === 5 ? (
                        // Original layout: 3 on top, 2 on bottom
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {items.slice(0, 3).map((item, index) => (
                                    <FeatureCard
                                        key={item.id}
                                        title={item.title}
                                        description={item.description}
                                        image={
                                            item.image_url ||
                                            item.fallback_image_url ||
                                            "https://via.placeholder.com/400x300"
                                        }
                                        index={index}
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
                                {items.slice(3, 5).map((item, index) => (
                                    <FeatureCard
                                        key={item.id}
                                        title={item.title}
                                        description={item.description}
                                        image={
                                            item.image_url ||
                                            item.fallback_image_url ||
                                            "https://via.placeholder.com/400x300"
                                        }
                                        index={index + 3}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        // Grid layout for 6+ items
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((item, index) => (
                                <FeatureCard
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    image={
                                        item.image_url ||
                                        item.fallback_image_url ||
                                        "https://via.placeholder.com/400x300"
                                    }
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({
    title,
    description,
    image,
    index,
}: FeatureCardProps) => {
    return (
        <div className="flex flex-col h-full group border border-transparent hover:border-[#a5cd39] p-3 rounded-sm transition-all duration-300">
            {/* Image */}
            <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden mb-3 rounded-sm shadow-sm group-hover:shadow-md transition-all duration-300">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Content */}
            <div className="p-0">
                <h3 className="text-base font-markazi !font-bold mb-2 text-[#a5cd39]">
                    {title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed font-nunito">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default DedicationSection;
