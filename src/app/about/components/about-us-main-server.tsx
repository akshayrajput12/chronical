"use client";

import React from "react";
import Image from "next/image";
import { AboutMainSectionData } from "@/types/about";

interface AboutUsMainServerProps {
    mainSectionData: AboutMainSectionData | null;
}

const AboutUsMainServer = ({ mainSectionData }: AboutUsMainServerProps) => {
    // Default fallback data for when server data is not available
    const defaultData: AboutMainSectionData = {
        id: "",
        section_label: "ABOUT US",
        main_heading: "Electronics And Computer Software Export Promotion Council",
        description: "Electronics & Computer Software Export Promotion Council or ESC, is India's apex trade promotion organization mandated to promote international cooperation in the field of electronics, telecom, and IT. Established with the support of Ministry of Commerce in the year 1989, Council has over 2300 members spread all over the country.",
        cta_text: "Official website",
        cta_url: "#",
        video_url: "https://www.youtube.com/embed/02tEkxgRE2c",
        video_title: "ESC India Video",
        logo_image_id: undefined,
        logo_image_url: undefined,
        logo_image_alt: undefined,
        logo_fallback_url: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80",
        esc_main_text: "ESC",
        esc_sub_text: "INDIA",
        primary_color: "#a5cd39",
        secondary_color: "#f0c419",
        is_active: true,
        created_at: "",
        updated_at: "",
    };

    // Use server data if available, otherwise use default data
    const sectionData = mainSectionData || defaultData;

    return (
        <section
            className="py-16 px-4 md:px-8 lg:px-16"
            style={{ backgroundColor: "#f9f7f7" }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-6">
                        {/* Section Label */}
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-12 h-0.5"
                                style={{
                                    backgroundColor: sectionData.primary_color,
                                }}
                            ></div>
                            <span
                                className="text-sm font-medium tracking-wider uppercase"
                                style={{ color: sectionData.primary_color }}
                            >
                                {sectionData.section_label}
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            {sectionData.main_heading}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 text-lg leading-relaxed">
                            {sectionData.description}
                        </p>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <a
                                href={sectionData.cta_url}
                                className="inline-flex items-center px-6 py-3 text-white font-medium rounded-lg transition-colors duration-200"
                                style={{
                                    backgroundColor: sectionData.primary_color,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = sectionData.secondary_color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = sectionData.primary_color;
                                }}
                            >
                                {sectionData.cta_text}
                                <svg
                                    className="ml-2 w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Video and Logo */}
                    <div className="space-y-8">
                        {/* Video Embed */}
                        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                src={sectionData.video_url}
                                title={sectionData.video_title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Logo Section */}
                        <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-lg shadow-sm">
                            {/* Logo Image */}
                            <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                <Image
                                    src={sectionData.logo_image_url || sectionData.logo_fallback_url || "/placeholder-logo.png"}
                                    alt={sectionData.logo_image_alt || "Company Logo"}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* ESC Text */}
                            <div className="text-center">
                                <div
                                    className="text-2xl font-bold"
                                    style={{ color: sectionData.primary_color }}
                                >
                                    {sectionData.esc_main_text}
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: sectionData.secondary_color }}
                                >
                                    {sectionData.esc_sub_text}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsMainServer;
