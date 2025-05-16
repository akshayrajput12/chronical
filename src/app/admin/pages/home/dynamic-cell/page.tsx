'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload,
} from 'lucide-react';
import Image from 'next/image';

const DynamicCellEditor = () => {
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

  // Sample data for the dynamic cell section
  const [dynamicCellData, setDynamicCellData] = useState({
    heading: "A Dynamic Central Business District",
    headingBoldPart: "A Dynamic Central",
    underlineColor: "#a5cd39",
    subtitle: "Dubai is the future economy and global trade gateway.",
    backgroundImageUrl: "/images/home.jpg",
    backgroundImageAlt: "Dubai Business District"
  });

  // Handle input changes
  const handleInputChange = (field: keyof typeof dynamicCellData, value: string) => {
    setDynamicCellData({
      ...dynamicCellData,
      [field]: value
    });

    // Update the heading when either part changes
    if (field === 'headingBoldPart') {
      const remainingPart = dynamicCellData.heading.replace(dynamicCellData.headingBoldPart, '').trim();
      setDynamicCellData(prev => ({
        ...prev,
        heading: `${value} ${remainingPart}`
      }));
    }
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
          <h1 className="text-2xl font-bold text-gray-800">Edit Dynamic Cell Section</h1>
        </div>
        <div className="flex gap-2">
          <button 
            className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.open('/#dynamic-central', '_blank')}
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
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Content</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading Bold Part
                </label>
                <input
                  type="text"
                  value={dynamicCellData.headingBoldPart}
                  onChange={(e) => handleInputChange('headingBoldPart', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">This part of the heading will be bold</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Heading
                </label>
                <input
                  type="text"
                  value={dynamicCellData.heading}
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
                    value={dynamicCellData.underlineColor}
                    onChange={(e) => handleInputChange('underlineColor', e.target.value)}
                    className="w-10 h-10 border-0 p-0 rounded-md"
                  />
                  <input
                    type="text"
                    value={dynamicCellData.underlineColor}
                    onChange={(e) => handleInputChange('underlineColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={dynamicCellData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Right Column - Background Image */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Background Image</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Image
                </label>
                <div className="relative border border-gray-300 rounded-md overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {dynamicCellData.backgroundImageUrl && (
                      <Image
                        src={dynamicCellData.backgroundImageUrl}
                        alt={dynamicCellData.backgroundImageAlt}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-300 flex justify-between items-center">
                    <span className="text-sm text-gray-500 truncate max-w-[200px]">
                      {dynamicCellData.backgroundImageUrl || "No image selected"}
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
                  Background Image Alt Text
                </label>
                <input
                  type="text"
                  value={dynamicCellData.backgroundImageAlt}
                  onChange={(e) => handleInputChange('backgroundImageAlt', e.target.value)}
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
        <div className="relative h-[300px] rounded-lg overflow-hidden">
          {/* Background Image */}
          <Image
            src={dynamicCellData.backgroundImageUrl}
            alt={dynamicCellData.backgroundImageAlt}
            fill
            className="object-cover"
          />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white mb-2">
                <span className="font-bold">{dynamicCellData.headingBoldPart}</span>
                {dynamicCellData.heading.replace(dynamicCellData.headingBoldPart, '')}
              </h2>
              
              <div 
                className="w-16 h-[3px] mx-auto mb-4"
                style={{ backgroundColor: dynamicCellData.underlineColor }}
              ></div>
              
              <p className="text-white text-lg">{dynamicCellData.subtitle}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DynamicCellEditor;
