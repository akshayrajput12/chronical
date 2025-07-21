"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { WhySection as WhySectionType } from "@/services/why-section.service";

interface WhySectionProps {
    whyData: WhySectionType | null;
}

const WhySection: React.FC<WhySectionProps> = ({ whyData: propWhyData }) => {
    const ref = useRef(null);

    // Handle case where no data is provided
    if (!propWhyData) {
        return (
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto  text-center">
                    <p className="text-gray-600">
                        Why section data is not available.
                    </p>
                </div>
            </div>
        );
    }

    const whyData = propWhyData;

    return (
        <section
            className="relative overflow-hidden w-full py-16 md:py-24 lg:py-40 -mt-48 md:-mt-74 lg:-mt-[400px] xl:-mt-[450px] 2xl:-mt-[550px] z-10"
            id="why-section"
            ref={ref}
        >
            <div className="container mx-auto h-full">
                {/* Main content container */}
                <div className="max-w-7xl mx-auto bg-white shadow-xl  sm: md: lg: opacity-100 transition-opacity duration-500 p-6">
                    {/* Heading */}
                    <div className="text-center mb-0 md:mb-8">
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
                        <div className="lg:hidden space-y-4 mb-0">
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
                            <div className="absolute w-[48vw] h-[400px] md:h-[500px] lg:h-[600px]">
                                <div className="relative w-full h-full overflow-hidden hover:scale-[1.02] transition-transform duration-300">
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
                                    {/* <div className="absolute inset-0 bg-gradient-to-t from-[#000000cc] to-transparent flex items-end p-6">
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
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Media at bottom - Full width outside container */}
            <div className="lg:hidden">
                <div className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden hover:scale-[1.02] transition-transform duration-300">
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
