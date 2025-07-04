"use client";

import React, { useRef } from "react";
import { EssentialSupportSection } from "@/types/essential-support";

interface EssentialSupportProps {
    essentialSupportData: EssentialSupportSection | null;
}

const EssentialSupport: React.FC<EssentialSupportProps> = ({ essentialSupportData }) => {
    const ref = useRef<HTMLDivElement>(null);

    // Handle case where no data is provided
    if (!essentialSupportData) {
        return (
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600">Essential support section data is not available.</p>
                </div>
            </div>
        );
    }

    // SVG Arrow component
    const ArrowSvg = () => (
        <svg
            className="w-full h-full absolute right-0 top-0"
            width="435"
            height="870"
            viewBox="0 0 435 870"
            fill="#a5cd39"
            opacity="0.8"
        >
            <path
                d="M2.11156e-06 435.078C47.0011 388.077 280.87 154.13 435 0L435 29.3581L34.9961 434.867L435 847.715L435 869.733L2.11156e-06 435.078Z"
                fill="#a5cd39"
            ></path>
            <path
                d="M22.0186 435.078C69.0197 388.077 280.87 183.488 435 29.3581V69.7254L64.3542 434.867L435 800.008L435 847.715L22.0186 435.078Z"
                fill="#a5cd39"
            ></path>
        </svg>
    );



    // Render SVG icon from string
    const renderSvgIcon = (svgString: string) => {
        // Convert JSX-style attributes to HTML attributes
        const processedSvg = svgString
            // Convert strokeWidth={1.5} to stroke-width="1.5"
            .replace(/strokeWidth=\{([^}]+)\}/g, 'stroke-width="$1"')
            // Convert strokeLinecap="round" to stroke-linecap="round"
            .replace(/strokeLinecap=/g, "stroke-linecap=")
            // Convert strokeLinejoin="round" to stroke-linejoin="round"
            .replace(/strokeLinejoin=/g, "stroke-linejoin=")
            // Convert className="..." to class="..."
            .replace(/className=/g, "class=")
            // Convert clipRule="..." to clip-rule="..."
            .replace(/clipRule=/g, "clip-rule=")
            // Convert fillRule="..." to fill-rule="..."
            .replace(/fillRule=/g, "fill-rule=");

        return <div dangerouslySetInnerHTML={{ __html: processedSvg }} />;
    };

    // Sort categories by display order
    const getSortedCategories = () => {
        if (essentialSupportData?.categories) {
            return [...essentialSupportData.categories].sort(
                (a, b) => a.display_order - b.display_order,
            );
        }
        return [];
    };

    // Get sorted services for a category
    const getSortedServices = (category: {
        services?: Array<{
            service_text: string;
            display_order: number;
            is_active?: boolean;
        }>;
    }) => {
        if (category.services) {
            return [...category.services].sort(
                (a, b) => a.display_order - b.display_order,
            );
        }
        return [];
    };

    const categories = getSortedCategories();



    return (
        <section
            className="py-20 bg-gray-100 overflow-hidden relative"
            ref={ref}
        >
            {/* SVG Arrow on the right side */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 overflow-hidden z-10">
                <ArrowSvg />
            </div>

            <div className="container mx-auto relative z-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-2">
                        {essentialSupportData.heading}{" "}
                        <span className="font-markazi font-normal">
                            {essentialSupportData.heading_span}
                        </span>
                    </h2>
                    <div className="flex justify-center">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                    </div>
                    <p className="text-gray-600 font-markazi-text! text-2xl max-w-3xl mx-auto">
                        {essentialSupportData.description}
                    </p>
                </div>

                {/* Top row with 4 cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:px-0 px-4 gap-4 md:gap-8 lg:gap-20 mb-8">
                    {categories.slice(0, 3).map((category, index) => (
                        <div
                            key={`category-${index}-${category.title}`}
                            className="flex flex-col bg-white p-6 shadow-md justify-between hover:shadow-lg transition-shadow duration-300"
                        >
                            <div>
                                <div className="flex items-center mb-6">
                                    <div className="w-14 h-14 rounded-full border-2 border-[#a5cd39] flex items-center justify-center text-[#a5cd39]">
                                        <div className="w-6 h-6">
                                            {renderSvgIcon(category.icon_svg)}
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-300 flex-grow ml-4"></div>
                                </div>
                                <h4 className="font-markazi-text text-2xl font-semibold hover:translate-x-1 hover:text-[#222] transition-all duration-200 mb-6 ml-3 font-light">
                                    {category.title}
                                </h4>
                                <ul className="space-y-4">
                                    {getSortedServices(category).map(
                                        (service, serviceIndex) => (
                                            <li
                                                key={serviceIndex}
                                                className="flex items-start"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-[#a5cd39] mr-2 mt-0.5 flex-shrink-0"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-[14px] md:text-[14px] lg:text-[14px] font-noto-kufi-arabic text-gray-700">
                                                    {service.service_text}
                                                </span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                            <div className="flex mt-8">
                                <a
                                    href={essentialSupportData.cta_url}
                                    className="bg-[#a5cd39] text-white px-6 py-2 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 uppercase font-noto-kufi-arabic text-sm"
                                >
                                    {essentialSupportData.cta_text}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EssentialSupport;
