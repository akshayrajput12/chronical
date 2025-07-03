"use client";

import React from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioItemWithImage } from "@/types/portfolio-gallery";

interface PortfolioGalleryProps {
    portfolioItems: PortfolioItemWithImage[];
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ portfolioItems }) => {
    const supabase = createClient();

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

    // Empty state
    if (!portfolioItems || portfolioItems.length === 0) {
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
            <div className="mx-auto">
                <div className="mx-auto px-4">
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
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
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
