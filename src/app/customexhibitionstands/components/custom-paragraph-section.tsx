"use client";

import React, { useState, useEffect } from "react";
import { getCustomExhibitionParagraphSection, CustomExhibitionParagraphSection } from "@/services/custom-exhibition-stands.service";

const CustomParagraphSection = () => {
  const [data, setData] = useState<CustomExhibitionParagraphSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await getCustomExhibitionParagraphSection();
      setData(result);
    } catch (error) {
      console.error('Error loading paragraph section data:', error);
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
                  At Chronicle Exhibits, we understand that every business has unique requirements and objectives when it comes to exhibition participation. Our custom exhibition stands are meticulously designed to reflect your brand identity while maximizing visitor engagement and creating memorable experiences that drive business results.
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
          <div className="text-center">
            <div className="max-w-6xl space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {data?.paragraph_content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomParagraphSection;
