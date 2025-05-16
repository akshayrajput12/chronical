'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload
} from 'lucide-react';
import Image from 'next/image';

const WhySectionEditor = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Sample data for the why section
  const [whyData, setWhyData] = useState({
    heading: "Why DWTC Free Zone",
    underlineColor: "#a5cd39", // Changed from #E04163 to green
    subtitle: "Building on a 45 year legacy, DWTC Free Zone connects businesses and communities propelling their potential for success.",
    leftColumnText1: "DWTC Free Zone provides a unique and highly desirable proposition for businesses seeking a competitive and well-regulated ecosystem to operate in regional and global markets. Offering a range of benefits such as 100% foreign ownership, 0% taxes and customs duties, and streamlined procedures for visas and permits, the DWTC free zone is a future-focused ecosystem designed for transformative business growth.",
    leftColumnText2: "We are a progressive and welcoming free zone, open to all businesses. Anchored by world-class infrastructure and flexible company formation, licensing and setup solutions, DWTC Free Zone offers an ideal environment, nurturing a sustainable economy from Dubai.",
    rightColumnText: "Spanning from the iconic Sheikh Rashid Tower to the neighboring One Central, DWTC Free Zone offers a diverse range of 1,200+ licensed business activities and is home to more than 1,800 small and medium businesses.",
    imageUrl: "/images/office-space.jpg",
    imageAlt: "Premium Commercial Offices",
    imageOverlayHeading: "2 MILLION+ SQ FT. OF",
    imageOverlaySubheading: "PREMIUM COMMERCIAL OFFICES"
  });

  // Handle input changes
  const handleInputChange = (field: keyof typeof whyData, value: string) => {
    setWhyData({
      ...whyData,
      [field]: value
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/admin/pages/home">
            <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit Why Section</h1>
        </div>
        <div className="flex gap-2">
          <button 
            className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.open('/#why-section', '_blank')}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
          <button className="inline-flex items-center gap-1 px-4 py-2 bg-[#a5cd39] rounded-md text-white hover:bg-[#94b933] transition-colors">
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </motion.div>

      {/* Editor Form */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Main Content */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Main Content</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  value={whyData.heading}
                  onChange={(e) => handleInputChange('heading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Underline Color
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={whyData.underlineColor}
                    onChange={(e) => handleInputChange('underlineColor', e.target.value)}
                    className="w-10 h-10 border-0 p-0 rounded-md"
                  />
                  <input
                    type="text"
                    value={whyData.underlineColor}
                    onChange={(e) => handleInputChange('underlineColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  value={whyData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Left Column - First Paragraph
                </label>
                <textarea
                  value={whyData.leftColumnText1}
                  onChange={(e) => handleInputChange('leftColumnText1', e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Left Column - Second Paragraph
                </label>
                <textarea
                  value={whyData.leftColumnText2}
                  onChange={(e) => handleInputChange('leftColumnText2', e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Right Column - Image & Right Column Text */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Right Column & Image</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Right Column Text
                </label>
                <textarea
                  value={whyData.rightColumnText}
                  onChange={(e) => handleInputChange('rightColumnText', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="relative border border-gray-300 rounded-md overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {whyData.imageUrl && (
                      <Image
                        src={whyData.imageUrl}
                        alt={whyData.imageAlt}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-300 flex justify-between items-center">
                    <span className="text-sm text-gray-500 truncate max-w-[200px]">
                      {whyData.imageUrl || "No image selected"}
                    </span>
                    <button className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                      <Upload size={14} />
                      <span className="text-sm">Upload</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Alt Text
                </label>
                <input
                  type="text"
                  value={whyData.imageAlt}
                  onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Overlay Heading
                </label>
                <input
                  type="text"
                  value={whyData.imageOverlayHeading}
                  onChange={(e) => handleInputChange('imageOverlayHeading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Overlay Subheading
                </label>
                <input
                  type="text"
                  value={whyData.imageOverlaySubheading}
                  onChange={(e) => handleInputChange('imageOverlaySubheading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Preview Section */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">{whyData.heading}</h2>
              <div 
                className="w-16 h-[3px] mx-auto mt-2 mb-4"
                style={{ backgroundColor: whyData.underlineColor }}
              ></div>
              <p className="text-gray-600">{whyData.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-gray-700">{whyData.leftColumnText1}</p>
                <p className="text-gray-700">{whyData.leftColumnText2}</p>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">{whyData.rightColumnText}</p>
                
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={whyData.imageUrl}
                    alt={whyData.imageAlt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <div className="text-white">
                      <h3 className="text-lg font-bold">{whyData.imageOverlayHeading}</h3>
                      <p className="text-sm font-medium">{whyData.imageOverlaySubheading}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WhySectionEditor;
