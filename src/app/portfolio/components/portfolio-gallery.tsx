"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { PortfolioItemWithImage } from "@/types/portfolio-gallery";

const PortfolioGallery = () => {
    const [portfolioItems, setPortfolioItems] = useState<
        PortfolioItemWithImage[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load portfolio items from database
    useEffect(() => {
        loadPortfolioItems();
    }, []);

    const loadPortfolioItems = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use the database function to get items with images
            const { data, error } = await supabase.rpc(
                "get_portfolio_items_with_images",
            );

            if (error) {
                throw error;
            }

            if (data) {
                setPortfolioItems(data);
            }
        } catch (error) {
            console.error("Error loading portfolio items:", error);
            setError("Failed to load portfolio items");
        } finally {
            setLoading(false);
        }
    };

    // Get image URL (either from Supabase storage or external URL)
    const getImageUrl = (item: PortfolioItemWithImage): string => {
        // If there's an uploaded image, use Supabase storage URL
        if (item.image_file_path) {
            const { data } = supabase.storage
                .from("portfolio-gallery-images")
                .getPublicUrl(item.image_file_path);
            return data.publicUrl;
        }

        // Otherwise use the external image URL
        return item.image_url || "";
    };

    // Loading state
    if (loading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 auto-rows-[150px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
                            {/* Loading skeleton */}
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`relative overflow-hidden bg-gray-200 animate-pulse ${
                                        index % 3 === 0
                                            ? "row-span-2"
                                            : "row-span-1"
                                    }`}
                                >
                                    <div className="w-full h-full bg-gray-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-red-800 mb-2">
                                Error Loading Portfolio
                            </h3>
                            <p className="text-red-600">
                                {error}. Please try refreshing the page.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Empty state
    if (portfolioItems.length === 0) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                No Portfolio Items
                            </h3>
                            <p className="text-gray-600">
                                Portfolio items will appear here once they are
                                added.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Gallery Grid - Masonry Style with Dynamic Sizes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 auto-rows-[150px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
                        {portfolioItems.map(item => {
                            const imageUrl = getImageUrl(item);
                            const altText =
                                item.image_alt_text || item.alt_text;

                            return (
                                <div
                                    key={item.id}
                                    className={`group relative overflow-hidden ${item.grid_class}`}
                                >
                                    {imageUrl && (
                                        <Image
                                            src={imageUrl}
                                            alt={altText}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    )}

                                    {/* VIEW CASE Full Overlay on Hover - Shows on ALL images */}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-rubik font-bold tracking-wider">
                                            VIEW CASE
                                        </span>
                                    </div>

                                    {/* Optional title overlay */}
                                    {item.title && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                            <h3 className="text-white text-sm font-medium">
                                                {item.title}
                                            </h3>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PortfolioGallery;
