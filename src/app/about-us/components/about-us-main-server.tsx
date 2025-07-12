"use client";

import React from "react";
import Image from "next/image";
import { AboutMainSectionData } from "@/types/about";

interface AboutUsMainServerProps {
    mainSectionData: AboutMainSectionData | null;
}

const AboutUsMainServer = ({ mainSectionData }: AboutUsMainServerProps) => {
    // Use only the provided data, no static fallback
    if (!mainSectionData) {
        return null;
    }

    const sectionData = mainSectionData;

    // Don't render if section is not active
    if (!sectionData.is_active) {
        return null;
    }

    // Determine logo image URL - only use if it's a valid non-empty string
    const logoImageUrl = sectionData.logo_image_url && sectionData.logo_image_url.trim() !== ''
        ? sectionData.logo_image_url
        : (sectionData.logo_fallback_url && sectionData.logo_fallback_url.trim() !== ''
            ? sectionData.logo_fallback_url
            : null);

    return (
        <section className="pt-36 md:pt-32 lg:pt-42 pb-8 md:pb-12 lg:pb-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="relative">
                        {/* Main content container */}
                        <div className="relative z-20 flex flex-wrap md:flex-nowrap gap-10 md:gap-16">
                            {/* Left side - Video with ESC INDIA text */}
                            <div className="relative ml-0 sm:ml-[-40px] md:ml-[-60px] lg:ml-[-80px] w-full md:w-[500px] lg:w-[550px]">
                                {/* Top left colored box */}
                                <div
                                    className="absolute -left-16 -top-16 w-[270px] h-[240px] z-0"
                                    style={{
                                        backgroundColor:
                                            sectionData.primary_color,
                                    }}
                                ></div>

                                {/* Video container */}
                                <div className="relative z-10">
                                    <div className="relative bg-black">
                                        {/* YouTube Video Embed */}
                                        <div className="relative w-full h-[340px] bg-black">
                                            {sectionData.video_url && sectionData.video_url.trim() !== '' ? (
                                                <iframe
                                                    src={sectionData.video_url}
                                                    title={sectionData.video_title || "Video"}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                ></iframe>
                                            ) : (
                                                <div className="absolute inset-0 w-full h-full flex items-center justify-center text-white">
                                                    <p>No video available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* ESC Logo overlay */}
                                        {logoImageUrl && (
                                            <div className="absolute top-6 right-6 z-20">
                                                <Image
                                                    src={logoImageUrl}
                                                    alt={
                                                        sectionData.logo_image_alt ||
                                                        "ESC Logo"
                                                    }
                                                    width={40}
                                                    height={40}
                                                    className="object-contain"
                                                />
                                            </div>
                                        )}

                                        {/* ESC INDIA text */}
                                        <div className="absolute left-0 bottom-0 z-20">
                                            <div className="flex flex-col">
                                                <div className="bg-transparent px-8 py-1">
                                                    <h3 className="text-white text-7xl font-bold leading-tight">
                                                        {
                                                            sectionData.esc_main_text
                                                        }
                                                    </h3>
                                                </div>
                                                <div className="bg-transparent px-8 py-1">
                                                    <h4
                                                        className="text-6xl font-bold leading-tight"
                                                        style={{
                                                            color: sectionData.secondary_color,
                                                        }}
                                                    >
                                                        {
                                                            sectionData.esc_sub_text
                                                        }
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom right colored box */}
                                <div
                                    className="absolute -right-24 top-[200px] sm:top-[200px] md:top-[200px] lg:top-[200px] w-[280px] h-[180px] z-0"
                                    style={{
                                        backgroundColor:
                                            sectionData.secondary_color,
                                    }}
                                ></div>
                            </div>

                            {/* Right side - Text content */}
                            <div className="w-full ml-0 sm:ml-[40px] md:ml-[60px] lg:ml-[80px] md:w-[500px] lg:w-[550px] pt-8 md:pt-0">
                                <div>
                                    <h2 className="text-3xl text-center md:text-4xl font-rubik font-bold mb-2">
                                        {sectionData.main_heading}
                                    </h2>
                                    <div className="flex justify-center">
                                        <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-6 leading-relaxed text-base font-nunito">
                                    {sectionData.description}
                                </p>

                                {sectionData.cta_url && sectionData.cta_url.trim() !== '' && sectionData.cta_text && (
                                    <div className="mt-8">
                                        <a
                                            href={sectionData.cta_url}
                                            className="bg-[#a5cd39] text-white px-6 py-1 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 font-noto-kufi-arabic text-sm"
                                            style={{
                                                backgroundColor:
                                                    sectionData.primary_color,
                                            }}
                                        >
                                            {sectionData.cta_text}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsMainServer;
