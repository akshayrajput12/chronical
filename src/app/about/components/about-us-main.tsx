"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { AboutMainSectionData } from "@/types/about";

const AboutUsMain = () => {
    // State for dynamic data
    const [sectionData, setSectionData] = useState<AboutMainSectionData>({
        id: "",
        section_label: "ABOUT US",
        main_heading:
            "Electronics And Computer Software Export Promotion Council",
        description:
            "Electronics & Computer Software Export Promotion Council or ESC, is India's apex trade promotion organization mandated to promote international cooperation in the field of electronics, telecom, and IT. Established with the support of Ministry of Commerce in the year 1989, Council has over 2300 members spread all over the country.",
        cta_text: "Official website",
        cta_url: "#",
        video_url: "https://www.youtube.com/embed/02tEkxgRE2c",
        video_title: "ESC India Video",
        logo_image_id: undefined,
        logo_image_url: undefined,
        logo_image_alt: undefined,
        logo_fallback_url:
            "https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80",
        esc_main_text: "ESC",
        esc_sub_text: "INDIA",
        primary_color: "#a5cd39",
        secondary_color: "#f0c419",
        is_active: true,
        created_at: "",
        updated_at: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load data on component mount
    useEffect(() => {
        loadMainData();
    }, []);

    const loadMainData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try to use the database function to get main data
            const { data, error } = await supabase.rpc(
                "get_about_main_section",
            );

            if (error) {
                console.warn(
                    "Database function not found, using default data:",
                    error,
                );
                // Use default data if database function doesn't exist
                setLoading(false);
                return;
            }

            if (data && data.length > 0) {
                const mainSection = data[0];

                // Construct proper image URL if file path exists
                let logoImageUrl = null;
                if (mainSection.logo_image_url) {
                    // Get the public URL from Supabase storage
                    const { data: urlData } = supabase.storage
                        .from("about-main")
                        .getPublicUrl(mainSection.logo_image_url);
                    logoImageUrl = urlData.publicUrl;
                }

                setSectionData({
                    ...mainSection,
                    logo_image_url: logoImageUrl,
                });
            }
        } catch (error) {
            console.warn("Error loading main data, using defaults:", error);
            // Use default data on any error
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                                    <div className="h-8 bg-gray-300 rounded"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-300 rounded"></div>
                                        <div className="h-4 bg-gray-300 rounded"></div>
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    </div>
                                    <div className="h-10 bg-gray-300 rounded w-32"></div>
                                </div>
                                <div className="h-64 bg-gray-300 rounded"></div>
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

    // Determine logo image URL
    const logoImageUrl =
        sectionData.logo_image_url || sectionData.logo_fallback_url;

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
                                            <iframe
                                                src={
                                                    sectionData.video_url ||
                                                    "https://www.youtube.com/embed/02tEkxgRE2c"
                                                }
                                                title={
                                                    sectionData.video_title ||
                                                    "ESC India Video"
                                                }
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="absolute inset-0 w-full h-full"
                                            ></iframe>
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
                                    <div
                                        className="uppercase tracking-wider mb-3 font-medium font-markazi"
                                        style={{
                                            color: sectionData.primary_color,
                                        }}
                                    >
                                        {sectionData.section_label}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-rubik font-bold text-gray-900 mb-6 leading-tight">
                                        {sectionData.main_heading}
                                    </h2>
                                </div>

                                <p className="text-gray-600 mb-6 leading-relaxed text-base font-nunito">
                                    {sectionData.description}
                                </p>

                                <div className="mt-8">
                                    <a
                                        href={sectionData.cta_url}
                                        className="inline-block text-white py-3 px-8 rounded-md hover:opacity-90 transition-opacity"
                                        style={{
                                            backgroundColor:
                                                sectionData.primary_color,
                                        }}
                                    >
                                        {sectionData.cta_text}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsMain;
