"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegacyCity } from "@/types/cities";
import { RequestQuotationDialog } from "@/components/ui/request-quotation-dialog";

interface CityDetailHeroProps {
    city: LegacyCity;
}

const CityDetailHero = ({ city }: CityDetailHeroProps) => {
    // Get hero section data from admin - check for hero content section first
    const heroSection = city.contentSections?.find(
        section => section.section_type === "hero" && section.is_active,
    );

    // Only render if we have hero section data from admin
    if (!heroSection || !heroSection.title?.trim()) {
        return null;
    }

    // Extract dynamic data from admin - replace [CITY] placeholder with actual city name
    const heroTitle = heroSection.title
        .trim()
        .replace(/\[CITY\]/g, city.name.toUpperCase());
    const heroSubtitle = heroSection.subtitle?.trim() || "";
    const heroDescription =
        heroSection.content?.trim().replace(/\[CITY\]/g, city.name) || "";
    const heroImage =
        heroSection.image_url?.trim() ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

    // Don't render if no image is available
    if (!heroImage) {
        return null;
    }
    return (
        <section className="hero w-full bg-white">
            {/* Full width hero container with background image */}
            <div className="relative w-full h-[75vh] 2xl:h-[60vh] overflow-hidden flex items-center justify-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={heroImage}
                        alt={
                            heroSubtitle ||
                            heroTitle ||
                            `Exhibition services in ${city.name}`
                        }
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Content - vertically centered with margin-top */}
                <div className="relative z-10 flex items-center justify-center h-full px-4 text-center text-white w-full">
                    <div className="max-w-6xl mx-auto mt-0 md:mt-20">
                        <div className="max-w-4xl mx-auto">
                            {/* Dynamic Main Heading from Admin - Reduced font size */}
                            <motion.h1
                                className="text-3xl sm:text-4xl md:text-5xl font-rubik font-bold mb-4 sm:mb-6 leading-tight"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                {heroTitle}
                            </motion.h1>

                            {/* Dynamic Subtitle if available - Reduced font size */}
                            {heroSubtitle && (
                                <motion.h2
                                    className="text-lg sm:text-xl md:text-2xl font-rubik font-normal text-white/95 mb-4 max-w-3xl mx-auto leading-relaxed"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1 }}
                                >
                                    {heroSubtitle}
                                </motion.h2>
                            )}

                            {/* Dynamic Description Text from Admin - Reduced font size */}
                            <motion.h3
                                className="text-base sm:text-lg font-markazi-text font-medium text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                {heroDescription
                                    .split("\n\n")
                                    .map((paragraph, index) => (
                                        <span key={`hero-desc-${index}`}>
                                            {paragraph.includes(
                                                "Chronicle Exhibition",
                                            ) ||
                                            paragraph.includes(
                                                "Chronicle Exhibits",
                                            ) ? (
                                                <>
                                                    {paragraph
                                                        .split(
                                                            /(Chronicle Exhibition[^.]*|Chronicle Exhibits[^.]*)/g,
                                                        )
                                                        .map(
                                                            (part, partIndex) =>
                                                                part.includes(
                                                                    "Chronicle",
                                                                ) ? (
                                                                    <span
                                                                        key={
                                                                            partIndex
                                                                        }
                                                                        className="text-[#a5cd39] font-medium"
                                                                    >
                                                                        {part}
                                                                    </span>
                                                                ) : (
                                                                    part
                                                                ),
                                                        )}
                                                </>
                                            ) : (
                                                paragraph
                                            )}
                                            {index <
                                                heroDescription.split("\n\n")
                                                    .length -
                                                    1 && <br />}
                                        </span>
                                    ))}
                            </motion.h3>

                            {/* Call-to-Action Button - matching the reference image */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <RequestQuotationDialog
                                    trigger={
                                        <Button className="bg-[#a5cd39] text-white px-6 py-2 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 font-noto-kufi-arabic text-sm">
                                            Request For Quotation
                                        </Button>
                                    }
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CityDetailHero;
