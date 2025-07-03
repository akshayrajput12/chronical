"use client";
import React from "react";
import { BusinessSection } from "@/types/business";

interface BusinessHubSectionProps {
    businessData: BusinessSection | null;
}

const BusinessHubSection: React.FC<BusinessHubSectionProps> = ({ businessData }) => {
    // Handle case where no data is provided
    if (!businessData) {
        return (
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600">Business section data is not available.</p>
                </div>
            </div>
        );
    }



    return (
        <section
            id="business-hub"
            className="bg-white py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-x-2 sm:gap-x-3 md:gap-x-4 items-start px-4 md:px-6 lg:px-8">
                {/* Headings */}
                <div className="w-full">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-rubik font-bold text-[#222] leading-tight">
                        <span className="text-[#222] font-rubik! block hover:translate-x-1 transition-transform duration-300">
                            {businessData.heading}
                        </span>
                    </h2>
                    <p className="text-xl sm:text-2xl md:text-4xl mt-2 font-rubik! text-[#222] font-normal">
                        {businessData.subheading}
                    </p>
                    <div className="w-24 h-[3px] bg-[#a5cd39] mt-6 hover:w-32 transition-all duration-300" />
                </div>

                {/* Paragraphs */}
                <div className="text-[#444] space-y-6 w-full">
                    {businessData.paragraphs.map((paragraph, index) => (
                        <p
                            key={paragraph.id}
                            className={`${
                                index === 0
                                    ? "font-markazi-text! text-lg sm:text-xl md:text-[22px] leading-[28px]"
                                    : "font-noto-kufi-arabic text-xs sm:text-sm md:text-[13px] lg:text-[14px] leading-[24px]"
                            } hover:translate-x-1 hover:text-[#222] transition-all duration-200`}
                            style={index === 0 ? { fontWeight: "0" } : {}}
                        >
                            {paragraph.content}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BusinessHubSection;
