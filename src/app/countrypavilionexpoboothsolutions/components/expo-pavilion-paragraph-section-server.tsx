"use client";

import React from "react";
import { ExpoPavilionParagraphSection } from "@/services/country-pavilion-page.service";
import BlogContent from "@/components/blog/blog-content";

interface ExpoPavilionParagraphSectionServerProps {
    paragraphSectionData: ExpoPavilionParagraphSection | null;
}

const ExpoPavilionParagraphSectionServer = ({ 
    paragraphSectionData 
}: ExpoPavilionParagraphSectionServerProps) => {
    // Don't render if no data exists
    if (!paragraphSectionData) {
        return null;
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <BlogContent content={paragraphSectionData.content} />
                </div>
            </div>
        </section>
    );
};

export default ExpoPavilionParagraphSectionServer;
