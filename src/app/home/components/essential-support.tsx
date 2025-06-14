"use client";

import React, { useRef, useState, useEffect } from "react";
import { getEssentialSupportSection } from "@/services/essential-support.service";
import { EssentialSupportSection } from "@/types/essential-support";

const EssentialSupport = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sectionData, setSectionData] =
        useState<EssentialSupportSection | null>(null);

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

    // Fetch section data
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching essential support section data...");
                const data = await getEssentialSupportSection();
                if (data) {
                    console.log(
                        "Essential support section data received:",
                        data,
                    );
                    setSectionData(data);
                } else {
                    console.error("No essential support section data found");
                    setError("Failed to load essential support data");
                }
            } catch (error) {
                console.error("Error fetching essential support data:", error);
                setError("An error occurred while loading the data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
        if (sectionData?.categories) {
            return [...sectionData.categories].sort(
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

    // Show loading state
    if (loading) {
        return (
            <section
                className="py-20 bg-gray-100 overflow-hidden relative"
                ref={ref}
            >
                <div className="container mx-auto px-4 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-[#a5cd39] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">
                            Loading essential support services...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Show error state or no data state
    if (error || !sectionData || categories.length === 0) {
        return (
            <section
                className="py-20 bg-gray-100 overflow-hidden relative"
                ref={ref}
            >
                <div className="container mx-auto px-4 text-center">
                    <p className="text-red-500 mb-2">
                        {error
                            ? "Error loading content"
                            : "No content available"}
                    </p>
                    <p className="text-gray-600">
                        Essential support services are currently unavailable.
                        Please check the admin panel to ensure data has been
                        added.
                    </p>
                </div>
            </section>
        );
    }

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
                        {sectionData.heading}{" "}
                        <span className="font-markazi font-normal">
                            {sectionData.heading_span}
                        </span>
                    </h2>
                    <div className="flex justify-center">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                    </div>
                    <p className="text-gray-600 font-markazi-text! text-2xl max-w-3xl mx-auto">
                        {sectionData.description}
                    </p>
                </div>

                {/* Top row with 4 cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:px-0 px-4 gap-4 md:gap-8 lg:gap-20 mb-8">
                    {categories.slice(0, 3).map((category, index) => (
                        <div
                            key={index}
                            className="flex flex-col bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
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
                                            <span className="text-[14px] md:text-[14px] lg:text-[14px] font-nunito text-gray-700">
                                                {service.service_text}
                                            </span>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-16">
                    <a
                        href={sectionData.cta_url}
                        className="bg-[#a5cd39] text-white px-10 py-3 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 uppercase"
                    >
                        {sectionData.cta_text}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default EssentialSupport;
