"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
    AboutDescriptionSectionData,
    AboutDescriptionService,
} from "@/types/about";

const AboutUsDescription = () => {
    // State for dynamic data with default fallback values
    const [sectionData, setSectionData] = useState<AboutDescriptionSectionData>(
        {
            id: "",
            section_heading: "Computer Software and ITES:",
            section_description:
                "ESC has emerged as a prime institution spearheading interest of Electronics and IT industry in the country. The Council proactively engages with the Government, both at the Centre and in States, to create a policy and regulatory environment conducive to growth of industry. Council also works in close coordination with India's Diplomatic Missions in various countries and Missions of various countries in India. ESC has an extensive network of like-minded organizations world over that helps in linking member companies with their counterparts in these economies. Significantly, ESC acts as the implementing agency for Government schemes to promote electronics and IT exports from India. Sectors covered by the Council include:",
            background_color: "#f9f7f7",
            service_1_title: "Customised Software Development",
            service_1_icon_url: "/icons/code.svg",
            service_1_description: "",
            service_2_title: "Software Products",
            service_2_icon_url: "/icons/computer.svg",
            service_2_description: "",
            service_3_title: "IT Enabled Services",
            service_3_icon_url: "/icons/gear.svg",
            service_3_description: "",
            is_active: true,
            created_at: "",
            updated_at: "",
        },
    );

    const [loading, setLoading] = useState(false); // Start with false to show content immediately

    // Load data on component mount (non-blocking)
    useEffect(() => {
        loadDescriptionData();
    }, []);

    const loadDescriptionData = async () => {
        try {
            // Try to load section data from database
            const { data: sectionResponse, error: sectionError } =
                await supabase.rpc("get_about_description_section");

            // If successful and data exists, update the state
            if (
                !sectionError &&
                sectionResponse &&
                sectionResponse.length > 0
            ) {
                console.log(
                    "Frontend: Loaded description data from database:",
                    sectionResponse[0],
                );
                setSectionData(sectionResponse[0]);
            } else {
                console.log("Frontend: Using default description data");
            }
        } catch (error) {
            console.log(
                "Frontend: Using default description data due to error:",
                error,
            );
        }
    };

    // Convert section data to services array for easier mapping
    const services: AboutDescriptionService[] = [
        {
            title: sectionData.service_1_title,
            icon_url: sectionData.service_1_icon_url,
            description: sectionData.service_1_description,
        },
        {
            title: sectionData.service_2_title,
            icon_url: sectionData.service_2_icon_url,
            description: sectionData.service_2_description,
        },
        {
            title: sectionData.service_3_title,
            icon_url: sectionData.service_3_icon_url,
            description: sectionData.service_3_description,
        },
    ];

    // Don't render if section is not active
    if (!sectionData.is_active) {
        return null;
    }

    return (
        <section
            className="py-8 md:py-12 lg:py-16"
            style={{ backgroundColor: sectionData.background_color }}
            aria-label="About ESC Services"
        >
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Main description text */}
                    <div className="text-center mb-6">
                        <p className="text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto text-sm leading-[24px]">
                            {sectionData.section_description}
                        </p>

                        <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-2">
                            {sectionData.section_heading}
                        </h2>
                        <div className="flex justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                        </div>
                    </div>

                    {/* Services grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 text-center rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#a5cd39]/30 group"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 flex items-center justify-center bg-[#f9f7f7] rounded-full p-3 group-hover:bg-[#a5cd39]/10 transition-colors duration-300">
                                        {service.icon_url && (
                                            <Image
                                                src={service.icon_url}
                                                alt={service.title}
                                                width={48}
                                                height={48}
                                                className="object-contain"
                                                loading="lazy"
                                                priority={false}
                                            />
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#a5cd39] transition-colors duration-300">
                                    {service.title}
                                </h3>
                                {service.description && (
                                    <p className="text-gray-600 text-sm mt-2">
                                        {service.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsDescription;
