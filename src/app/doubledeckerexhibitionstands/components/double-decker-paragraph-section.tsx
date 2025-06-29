"use client";

import React, { useState, useEffect } from "react";
import {
    getDoubleDeckerParagraphSection,
    DoubleDeckerParagraphSection as DoubleDeckerParagraphData,
} from "@/services/double-decker-paragraph.service";
import BlogContent from "@/components/blog/blog-content";

const DoubleDeckerParagraphSection = () => {
    const [data, setData] = useState<DoubleDeckerParagraphData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await getDoubleDeckerParagraphSection();
            setData(result);
        } catch (error) {
            console.error("Error loading paragraph section data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render if no data exists and not loading
    if (!data && !isLoading && isClient) {
        return null;
    }

    // Render static content on server and during initial client render
    if (!isClient || isLoading) {
        return (
            <section className="pb-16 bg-white">
                <div className="container px-4 mx-auto">
                    <div className="max-w-full">
                        <div className="text-center">
                            <div className="max-w-6xl space-y-6">
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Chronicle Exhibits specializes in creating
                                    innovative double decker exhibition stands
                                    that maximize your exhibition space and
                                    create unforgettable brand experiences. Our
                                    expertly designed two-level booths provide
                                    double the impact, allowing you to showcase
                                    more products, accommodate larger crowds,
                                    and create distinct zones for different
                                    activities while maintaining a cohesive
                                    brand presence that captivates visitors and
                                    drives meaningful business connections.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="pb-16 bg-white">
            <div className="container px-4 mx-auto">
                <div className="max-w-full">
                    <div className="text-left">
                        <div className="max-w-6xl space-y-6">
                            <BlogContent
                                content={data?.paragraph_content ?? ""}
                            />
                            ;
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoubleDeckerParagraphSection;
