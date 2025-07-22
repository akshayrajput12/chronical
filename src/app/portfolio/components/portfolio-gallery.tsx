"use client";

import React from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioItemWithImage } from "@/types/portfolio-gallery";

interface PortfolioGalleryProps {
    portfolioItems: PortfolioItemWithImage[];
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
    portfolioItems,
}) => {
    const supabase = createClient();

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
            },
        },
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
                    {/* Gallery Grid - Card Style Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {portfolioItems.map(item => {
                            const imageUrl = getImageUrl(item);
                            const altText =
                                item.image_alt_text || item.alt_text;

                            return (
                                <motion.div
                                    key={item.id}
                                    className="group bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                    variants={itemVariants}
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={altText}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="text-white text-center">
                                                <div className="text-sm font-medium">
                                                    View Project
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PortfolioGallery;
