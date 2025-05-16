'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload,
  Youtube
} from 'lucide-react';
import Image from 'next/image';

const AboutUsMainEditor = () => {
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

  // Sample data for the about us main section
  const [aboutData, setAboutData] = useState({
    sectionLabel: "ABOUT US",
    heading: "Electronics And Computer Software Export Promotion Council",
    description: "Electronics & Computer Software Export Promotion Council or ESC, is India's apex trade promotion organization mandated to promote international cooperation in the field of electronics, telecom, and IT. Established with the support of Ministry of Commerce in the year 1989, Council has over 2300 members spread all over the country.",
    buttonText: "Official website",
    buttonUrl: "#",
    videoUrl: "https://www.youtube.com/embed/02tEkxgRE2c",
    logoUrl: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80",
    yellowBoxTop: "200px",
    yellowBoxColor: "#a5cd39"
  });

  // Handle input changes
  const handleInputChange = (field: keyof typeof aboutData, value: string) => {
    setAboutData({
      ...aboutData,
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
          <Link href="/admin/pages/about">
            <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit About Us Main Section</h1>
        </div>
        <div className="flex gap-2">
          <button 
            className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.open('/about', '_blank')}
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
            {/* Left Column - Media Content */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Video Embed URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aboutData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                  <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                    <Youtube size={16} />
                    <span>Test</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Preview
                </label>
                <div className="relative border border-gray-300 rounded-md overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <iframe
                      src={aboutData.videoUrl}
                      title="About Us Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative border border-gray-300">
                    {aboutData.logoUrl && (
                      <Image
                        src={aboutData.logoUrl}
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                  <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                    <Upload size={16} />
                    <span>Upload Logo</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yellow Box Position (top)
                </label>
                <input
                  type="text"
                  value={aboutData.yellowBoxTop}
                  onChange={(e) => handleInputChange('yellowBoxTop', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                  placeholder="200px"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yellow Box Color
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={aboutData.yellowBoxColor}
                    onChange={(e) => handleInputChange('yellowBoxColor', e.target.value)}
                    className="w-10 h-10 border-0 p-0 rounded-md"
                  />
                  <input
                    type="text"
                    value={aboutData.yellowBoxColor}
                    onChange={(e) => handleInputChange('yellowBoxColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                    placeholder="#a5cd39"
                  />
                </div>
              </div>
            </div>
            
            {/* Right Column - Text Content */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Label
                </label>
                <input
                  type="text"
                  value={aboutData.sectionLabel}
                  onChange={(e) => handleInputChange('sectionLabel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  value={aboutData.heading}
                  onChange={(e) => handleInputChange('heading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={aboutData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={aboutData.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button URL
                </label>
                <input
                  type="text"
                  value={aboutData.buttonUrl}
                  onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
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
        <div className="relative w-full bg-white rounded-lg overflow-hidden p-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Video with colored box */}
            <div className="relative md:w-1/2">
              {/* Yellow box */}
              <div 
                className="absolute -left-4 w-[200px] h-[180px] z-0"
                style={{ 
                  backgroundColor: aboutData.yellowBoxColor,
                  top: aboutData.yellowBoxTop ? `-${aboutData.yellowBoxTop}` : '-200px'
                }}
              ></div>
              
              {/* Video container */}
              <div className="relative z-10 bg-black aspect-video">
                <iframe
                  src={aboutData.videoUrl}
                  title="About Us Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
                
                {/* Logo overlay */}
                {aboutData.logoUrl && (
                  <div className="absolute top-2 right-2 z-20 w-8 h-8">
                    <Image
                      src={aboutData.logoUrl}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Right side - Text content */}
            <div className="md:w-1/2 pt-4 md:pt-0">
              <div className="text-[#a5cd39] uppercase tracking-wider mb-2 font-medium text-sm">
                {aboutData.sectionLabel}
              </div>
              <h2 className="text-xl font-serif text-gray-900 mb-3 leading-tight">
                {aboutData.heading}
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                {aboutData.description}
              </p>
              <div className="mt-4">
                <button
                  className="inline-block bg-[#a5cd39] text-white py-2 px-4 rounded-md text-sm"
                >
                  {aboutData.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutUsMainEditor;
