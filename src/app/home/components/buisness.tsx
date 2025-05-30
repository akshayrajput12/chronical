'use client';
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Define types based on the database schema
interface BusinessParagraph {
  id: string;
  content: string;
  display_order: number;
}

interface BusinessStat {
  id: string;
  value: number;
  label: string;
  sublabel: string;
  display_order: number;
}

interface BusinessSection {
  id: string;
  heading: string;
  subheading: string;
  paragraphs: BusinessParagraph[];
  stats: BusinessStat[];
}

// Simple number formatter without animations
const NumberDisplay = ({ value }: { value: number }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (
        <div className="inline-flex items-baseline">
          <span>{(num / 1000000).toFixed(1)}</span>
          <span className="text-3xl ml-1">M</span>
        </div>
      );
    } else if (num >= 1000) {
      return (
        <div className="inline-flex items-baseline">
          <span>{Math.floor(num / 1000)}</span>
          <span className="text-3xl ml-1">K</span>
        </div>
      );
    }
    return <div>{num}</div>;
  };

  return formatNumber(value);
};

const BusinessHubSection = () => {
  // State for business data
  const [businessData, setBusinessData] = useState<BusinessSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch business data from Supabase
  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching business section data...');

        // Get active business section
        const { data: sectionData, error: sectionError } = await supabase
          .from('business_sections')
          .select('id, heading, subheading')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (sectionError) {
          console.error('Error fetching business section:', sectionError);
          setError(`Failed to fetch business section: ${sectionError.message}`);
          setLoading(false);
          return;
        }

        console.log('Business section data:', sectionData);

        if (!sectionData) {
          setError('No active business section found');
          setLoading(false);
          return;
        }

        // Get paragraphs for this section
        const { data: paragraphsData, error: paragraphsError } = await supabase
          .from('business_paragraphs')
          .select('id, content, display_order')
          .eq('business_section_id', sectionData.id)
          .order('display_order', { ascending: true });

        if (paragraphsError) {
          console.error('Error fetching business paragraphs:', paragraphsError);
          setError(`Failed to fetch paragraphs: ${paragraphsError.message}`);
          setLoading(false);
          return;
        }

        console.log('Business paragraphs data:', paragraphsData);

        // Get stats for this section
        const { data: statsData, error: statsError } = await supabase
          .from('business_stats')
          .select('id, value, label, sublabel, display_order')
          .eq('business_section_id', sectionData.id)
          .order('display_order', { ascending: true });

        if (statsError) {
          console.error('Error fetching business stats:', statsError);
          setError(`Failed to fetch stats: ${statsError.message}`);
          setLoading(false);
          return;
        }

        console.log('Business stats data:', statsData);

        // Combine all data
        const combinedData = {
          id: sectionData.id,
          heading: sectionData.heading,
          subheading: sectionData.subheading,
          paragraphs: paragraphsData || [],
          stats: statsData || []
        };

        console.log('Combined business data:', combinedData);
        setBusinessData(combinedData);
      } catch (error) {
        console.error('Unexpected error in fetchBusinessData:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] bg-white">
        <div className="animate-spin h-12 w-12 border-4 border-[#a5cd39] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh] bg-white">
        <div className="text-center text-gray-500">
          <p className="text-xl">Error loading business section data</p>
          <p className="mt-2">{error}</p>
          <p className="mt-4">Please check the console for more details.</p>
        </div>
      </div>
    );
  }

  // Show error state if no data
  if (!businessData) {
    return (
      <div className="flex items-center justify-center h-[50vh] bg-white">
        <div className="text-center text-gray-500">
          <p className="text-xl">Could not load business section data.</p>
          <p>Please check your database connection.</p>
        </div>
      </div>
    );
  }

  return (
    <section id="business-hub" className="bg-white py-20 px-4 md:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Headings */}
        <div className="max-w-md">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#222] leading-tight">
            <span className="text-[#222] block hover:translate-x-1 transition-transform duration-300">
              {businessData.heading}
            </span>
          </h2>
          <div className="text-2xl md:text-3xl text-[#333] font-medium mt-2">
            {businessData.subheading}
          </div>
          <div className="w-24 h-[3px] bg-[#a5cd39] mt-6 hover:w-32 transition-all duration-300" />
        </div>

        {/* Paragraphs */}
        <div className="text-[#444] text-base md:text-lg space-y-6">
          {businessData.paragraphs.map((paragraph) => (
            <p
              key={paragraph.id}
              className="leading-relaxed hover:translate-x-1 hover:text-[#222] transition-all duration-200"
            >
              {paragraph.content}
            </p>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 border-t border-gray-200 pt-16">
        {businessData.stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300"
          >
            {/* Stat number */}
            <div className="text-5xl md:text-6xl font-extrabold text-[#a5cd39] leading-none hover:scale-105 transition-transform duration-300">
              <NumberDisplay value={stat.value} />
            </div>

            {/* Label */}
            <div className="text-xl md:text-2xl font-medium text-[#333] mt-2 hover:-translate-y-0.5 transition-transform duration-200">
              {stat.label}
            </div>

            {/* Sublabel */}
            <div className="text-sm text-[#666] uppercase tracking-wide mt-1 hover:-translate-y-0.5 transition-transform duration-200">
              {stat.sublabel}
            </div>

            {/* Decorative line */}
            <div className="w-12 h-[2px] bg-gray-200 mt-4" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BusinessHubSection;
