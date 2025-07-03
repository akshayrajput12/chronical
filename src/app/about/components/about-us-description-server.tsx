"use client";

import React from "react";
import Image from "next/image";
import { AboutDescriptionSectionData } from "@/types/about";

interface AboutUsDescriptionServerProps {
    descriptionSectionData: AboutDescriptionSectionData | null;
}

const AboutUsDescriptionServer = ({ descriptionSectionData }: AboutUsDescriptionServerProps) => {
    // Default fallback data for when server data is not available
    const defaultData: AboutDescriptionSectionData = {
        id: "",
        section_heading: "Computer Software and ITES:",
        section_description: "ESC has emerged as a prime institution spearheading interest of Electronics and IT industry in the country. The Council proactively engages with the Government, both at the Centre and in States, to create a policy and regulatory environment conducive to growth of industry. Council also works in close coordination with India's Diplomatic Missions in various countries and Missions of various countries in India. ESC has an extensive network of like-minded organizations world over that helps in linking member companies with their counterparts in these economies. Significantly, ESC acts as the implementing agency for Government schemes to promote electronics and IT exports from India. Sectors covered by the Council include:",
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
    };

    // Use server data if available, otherwise use default data
    const sectionData = descriptionSectionData || defaultData;

    return (
        <section
            className="py-16 px-4 md:px-8 lg:px-16"
            style={{ backgroundColor: sectionData.background_color }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        {sectionData.section_heading}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
                        {sectionData.section_description}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {/* Service 1 */}
                    <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-gray-50 rounded-full">
                            <Image
                                src={sectionData.service_1_icon_url}
                                alt={sectionData.service_1_title}
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            {sectionData.service_1_title}
                        </h3>
                        {sectionData.service_1_description && (
                            <p className="text-gray-600 leading-relaxed">
                                {sectionData.service_1_description}
                            </p>
                        )}
                    </div>

                    {/* Service 2 */}
                    <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-gray-50 rounded-full">
                            <Image
                                src={sectionData.service_2_icon_url}
                                alt={sectionData.service_2_title}
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            {sectionData.service_2_title}
                        </h3>
                        {sectionData.service_2_description && (
                            <p className="text-gray-600 leading-relaxed">
                                {sectionData.service_2_description}
                            </p>
                        )}
                    </div>

                    {/* Service 3 */}
                    <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-gray-50 rounded-full">
                            <Image
                                src={sectionData.service_3_icon_url}
                                alt={sectionData.service_3_title}
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            {sectionData.service_3_title}
                        </h3>
                        {sectionData.service_3_description && (
                            <p className="text-gray-600 leading-relaxed">
                                {sectionData.service_3_description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsDescriptionServer;
