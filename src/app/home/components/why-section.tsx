"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { getWhySection, WhySection as WhySectionType } from "@/services/why-section.service";

const WhySection = () => {
  const ref = useRef(null);
  const [whyData, setWhyData] = useState<WhySectionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch why section data
  useEffect(() => {
    const fetchWhySection = async () => {
      try {
        console.log('Fetching why section data for frontend component');
        const data = await getWhySection();
        if (data) {
          console.log('Why section data received in frontend:', data);
          setWhyData(data);
        }
      } catch (error) {
        console.error('Error fetching why section data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhySection();
  }, []);

  // Show loading state or fallback if data is not available
  if (isLoading) {
    return (
      <section className="relative overflow-hidden w-full py-20 -mt-40 z-10" id="why-section">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-10 md:p-16 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="h-2 bg-gray-200 rounded w-16 mx-auto mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-16"></div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
                <div className="h-64 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden w-full py-20 -mt-40 z-10" id="why-section" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Main content container */}
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-10 md:p-16 opacity-100 transition-opacity duration-500">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-rubik font-bold text-[#222] mb-4">
              {whyData?.heading || "Why DWTC Free Zone"}
            </h2>

            {/* Underline with dynamic color */}
            <div
              className="w-16 h-[3px] mb-8 mx-auto hover:w-24 transition-all duration-300"
              style={{ backgroundColor: whyData?.underline_color || "#a5cd39" }}
            ></div>

            {/* Subtitle */}
            <p className="text-[#444] text-lg font-markazi max-w-3xl mx-auto mb-16">
              {whyData?.subtitle || "Building on a 45 year legacy, DWTC Free Zone connects businesses and communities propelling their potential for success."}
            </p>
          </div>

          {/* Two-column content */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {/* Left column */}
            <div>
              <p className="text-[#444] mb-6 font-nunito leading-relaxed">
                {whyData?.left_column_text_1 || "DWTC Free Zone provides a unique and highly desirable proposition for businesses seeking a competitive and well-regulated ecosystem to operate in regional and global markets. Offering a range of benefits such as 100% foreign ownership, 0% taxes and customs duties, and streamlined procedures for visas and permits, the DWTC free zone is a future-focused ecosystem designed for transformative business growth."}
              </p>

              <p className="text-[#444] font-nunito leading-relaxed">
                {whyData?.left_column_text_2 || "We are a progressive and welcoming free zone, open to all businesses. Anchored by world-class infrastructure and flexible company formation, licensing and setup solutions, DWTC Free Zone offers an ideal environment, nurturing a sustainable economy from Dubai."}
              </p>
            </div>

            {/* Right column */}
            <div>
              <p className="text-[#444] mb-6 font-nunito leading-relaxed">
                {whyData?.right_column_text || "Spanning from the iconic Sheikh Rashid Tower to the neighboring One Central, DWTC Free Zone offers a diverse range of 1,200+ licensed business activities and is home to more than 1,800 small and medium businesses."}
              </p>

              {/* Image with text overlay */}
              <div className="relative mt-8 h-64 overflow-hidden rounded-lg hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src={whyData?.image_url || "/images/office-space.jpg"}
                  alt={whyData?.image_alt || "Premium Commercial Offices"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000cc] to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-3xl font-rubik font-bold mb-1">{whyData?.image_overlay_heading || "2 MILLION+ SQ FT. OF"}</h3>
                    <p className="text-2xl font-markazi font-bold">{whyData?.image_overlay_subheading || "PREMIUM COMMERCIAL OFFICES"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
