"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
    getWhySection,
    WhySection as WhySectionType,
} from "@/services/why-section.service";

const WhySection = () => {
    const ref = useRef(null);
    const [whyData, setWhyData] = useState<WhySectionType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch why section data
    useEffect(() => {
        const fetchWhySection = async () => {
            try {
                console.log("Fetching why section data for frontend component");
                const data = await getWhySection();
                if (data) {
                    console.log("Why section data received in frontend:", data);
                    console.log("Media type:", data.media_type);
                    console.log("Video URL:", data.video_url);
                    console.log("Image URL:", data.image_url);
                    setWhyData(data);
                }
            } catch (error) {
                console.error("Error fetching why section data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWhySection();
    }, []);

    // Show loading state or fallback if data is not available
    if (isLoading) {
        return (
            <section
                className="relative overflow-hidden w-full py-8 md:py-12 lg:py-20 z-10"
                id="why-section"
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6 md:p-10 lg:p-16 animate-pulse">
                        <div className="h-6 md:h-8 bg-gray-200 rounded w-1/2 md:w-1/3 mx-auto mb-6 md:mb-8"></div>
                        <div className="h-1 md:h-2 bg-gray-200 rounded w-12 md:w-16 mx-auto mb-6 md:mb-8"></div>
                        <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4 md:w-2/3 mx-auto mb-8 md:mb-12 lg:mb-16"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16">
                            <div className="order-2 lg:order-1">
                                <div className="h-3 md:h-4 bg-gray-200 rounded w-full mb-3 md:mb-4"></div>
                                <div className="h-3 md:h-4 bg-gray-200 rounded w-full mb-3 md:mb-4"></div>
                                <div className="h-3 md:h-4 bg-gray-200 rounded w-full mb-3 md:mb-4"></div>
                                <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="h-3 md:h-4 bg-gray-200 rounded w-full mb-4 md:mb-8"></div>
                                <div className="h-48 md:h-56 lg:h-64 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="relative overflow-hidden w-full py-8 md:py-12 lg:py-20 -mt-32 md:-mt-48 lg:-mt-64 z-10"
            id="why-section"
            ref={ref}
        >
            <div className="container mx-auto px-4">
                {/* Main content container */}
                <div className="max-w-7xl mx-auto bg-white shadow-xl p-6 md:p-10 lg:p-16 opacity-100 transition-opacity duration-500">
                    {/* Heading */}
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-rubik font-bold text-[#222] mb-3 md:mb-4">
                            {whyData?.heading || "Why DWTC Free Zone"}
                        </h2>

                        {/* Underline with dynamic color */}
                        <div
                            className="w-12 md:w-16 h-[2px] md:h-[3px] mb-6 md:mb-8 mx-auto hover:w-16 md:hover:w-24 transition-all duration-300"
                            style={{
                                backgroundColor:
                                    whyData?.underline_color || "#a5cd39",
                            }}
                        ></div>

                        {/* Subtitle */}
                        <p
                            className="font-markazi-text hover:translate-x-1 hover:text-[#222] transition-all duration-200 text-[#444] max-w-3xl mx-auto mb-8 md:mb-12 lg:mb-16 text-lg md:text-xl lg:text-2xl px-4"
                            style={{ fontWeight: "0" }}
                        >
                            {whyData?.subtitle ||
                                "Building on a 45 year legacy, DWTC Free Zone connects businesses and communities propelling their potential for success."}
                        </p>
                    </div>

                    {/* Mobile: Single column layout, Desktop: Two-column layout */}
                    <div className="block lg:grid lg:grid-cols-2 lg:gap-16">
                        {/* Mobile: All text content stacked */}
                        <div className="lg:hidden space-y-4 mb-6">
                            <p className="text-[#444] font-noto-kufi-arabic text-sm leading-relaxed text-center">
                                {whyData?.left_column_text_1 ||
                                    "DWTC Free Zone provides a unique and highly desirable proposition for businesses seeking a competitive and well-regulated ecosystem to operate in regional and global markets. Offering a range of benefits such as 100% foreign ownership, 0% taxes and customs duties, and streamlined procedures for visas and permits, the DWTC free zone is a future-focused ecosystem designed for transformative business growth."}
                            </p>

                            <p className="text-[#444] font-noto-kufi-arabic text-sm leading-relaxed text-center">
                                {whyData?.left_column_text_2 ||
                                    "We are a progressive and welcoming free zone, open to all businesses. Anchored by world-class infrastructure and flexible company formation, licensing and setup solutions, DWTC Free Zone offers an ideal environment, nurturing a sustainable economy from Dubai."}
                            </p>

                            <p className="text-[#444] font-noto-kufi-arabic text-sm leading-relaxed text-center">
                                {whyData?.right_column_text ||
                                    "Spanning from the iconic Sheikh Rashid Tower to the neighboring One Central, DWTC Free Zone offers a diverse range of 1,200+ licensed business activities and is home to more than 1,800 small and medium businesses."}
                            </p>
                        </div>

                        {/* Desktop: Left column */}
                        <div className="hidden lg:block">
                            <p className="text-[#444] mb-6 font-noto-kufi-arabic text-sm leading-relaxed">
                                {whyData?.left_column_text_1 ||
                                    "DWTC Free Zone provides a unique and highly desirable proposition for businesses seeking a competitive and well-regulated ecosystem to operate in regional and global markets. Offering a range of benefits such as 100% foreign ownership, 0% taxes and customs duties, and streamlined procedures for visas and permits, the DWTC free zone is a future-focused ecosystem designed for transformative business growth."}
                            </p>

                            <p className="text-[#444] font-noto-kufi-arabic text-sm leading-relaxed">
                                {whyData?.left_column_text_2 ||
                                    "We are a progressive and welcoming free zone, open to all businesses. Anchored by world-class infrastructure and flexible company formation, licensing and setup solutions, DWTC Free Zone offers an ideal environment, nurturing a sustainable economy from Dubai."}
                            </p>
                        </div>

                        {/* Desktop: Right column */}
                        <div className="hidden lg:block relative">
                            <p className="text-[#444] mb-6 font-noto-kufi-arabic text-sm leading-relaxed">
                                {whyData?.right_column_text ||
                                    "Spanning from the iconic Sheikh Rashid Tower to the neighboring One Central, DWTC Free Zone offers a diverse range of 1,200+ licensed business activities and is home to more than 1,800 small and medium businesses."}
                            </p>
                            {/* Desktop Media with text overlay */}
                            <div className="absolute -bottom-24 bg-amber-800 w-[48vw] h-[400px]">
                                <div className="relative mt-8 w-[48vw] h-[400px] overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                                    {/* Check media type and display accordingly */}
                                    {whyData?.media_type === "video" &&
                                    whyData?.video_url ? (
                                        <video
                                            src={whyData.video_url}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover"
                                            onError={e => {
                                                console.error(
                                                    "Video failed to load:",
                                                    e,
                                                );
                                                console.log(
                                                    "Video URL that failed:",
                                                    whyData.video_url,
                                                );
                                            }}
                                            onLoadStart={() => {
                                                console.log(
                                                    "Video started loading:",
                                                    whyData.video_url,
                                                );
                                            }}
                                            onCanPlay={() => {
                                                console.log(
                                                    "Video can play:",
                                                    whyData.video_url,
                                                );
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            src={
                                                whyData?.image_url ||
                                                "/images/office-space.jpg"
                                            }
                                            alt={
                                                whyData?.image_alt ||
                                                "Premium Commercial Offices"
                                            }
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000cc] to-transparent flex items-end p-6">
                                        <div className="text-white">
                                            <h3 className="text-3xl font-rubik font-bold mb-1">
                                                {whyData?.image_overlay_heading ||
                                                    "2 MILLION+ SQ FT. OF"}
                                            </h3>
                                            <p className="text-2xl font-markazi-text font-bold">
                                                {whyData?.image_overlay_subheading ||
                                                    "PREMIUM COMMERCIAL OFFICES"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Media at bottom - Full width outside container */}
            <div className="lg:hidden">
                <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    {/* Check media type and display accordingly */}
                    {whyData?.media_type === "video" && whyData?.video_url ? (
                        <video
                            src={whyData.video_url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            onError={e => {
                                console.error("Video failed to load:", e);
                                console.log(
                                    "Video URL that failed:",
                                    whyData.video_url,
                                );
                            }}
                            onLoadStart={() => {
                                console.log(
                                    "Video started loading:",
                                    whyData.video_url,
                                );
                            }}
                            onCanPlay={() => {
                                console.log(
                                    "Video can play:",
                                    whyData.video_url,
                                );
                            }}
                        />
                    ) : (
                        <Image
                            src={
                                whyData?.image_url || "/images/office-space.jpg"
                            }
                            alt={
                                whyData?.image_alt ||
                                "Premium Commercial Offices"
                            }
                            fill
                            className="object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000cc] to-transparent flex items-end p-4">
                        <div className="text-white">
                            <h3 className="text-xl md:text-2xl font-rubik font-bold mb-1">
                                {whyData?.image_overlay_heading ||
                                    "2 MILLION+ SQ FT. OF"}
                            </h3>
                            <p className="text-lg md:text-xl font-markazi-text font-bold">
                                {whyData?.image_overlay_subheading ||
                                    "PREMIUM COMMERCIAL OFFICES"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhySection;
