"use client";

import React, { useState, useEffect } from "react";
import { getExpoPavilionParagraphSection, ExpoPavilionParagraphSection as ExpoPavilionParagraphData } from "@/services/expo-pavilion-paragraph.service";

const ExpoPavilionParagraphSection = () => {
  const [data, setData] = useState<ExpoPavilionParagraphData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await getExpoPavilionParagraphSection();
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
                  Chronicle Exhibits excels in designing and constructing country pavilion expo booths that authentically represent national identity and cultural heritage on the global stage. Our pavilion solutions create immersive environments that showcase your country's unique offerings, from traditional craftsmanship to cutting-edge innovations, while fostering international trade relationships and cultural exchange that leave lasting impressions on visitors from around the world.
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

export default ExpoPavilionParagraphSection;
