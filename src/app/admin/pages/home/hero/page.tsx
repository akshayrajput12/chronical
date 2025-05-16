'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus, 
  Trash, 
  Upload,
  Play,
  Pause
} from 'lucide-react';

const HeroSectionEditor = () => {
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

  // Sample data for the hero section
  const [heroData, setHeroData] = useState({
    heading: "Launch, Grow and Thrive in the Free Zone",
    subheading: "for Business Game Changers",
    description: "Welcome to Chronicle Exhibits - a connected, collaborative world-class exhibition stand builder for pioneering entrepreneurs, startups and multinationals, in the heart of Dubai's central business district.",
    videoSrc: "/videos/hero-background.mp4",
    typingTexts: [
      "Exhibition Stands",
      "Congress Services",
      "Kiosk Solutions",
      "Custom Designs",
      "Event Management"
    ],
    ctaPrimaryText: "GET STARTED",
    ctaPrimaryUrl: "#",
    ctaSecondaryText: "LEARN MORE",
    ctaSecondaryUrl: "#"
  });

  // Handle input changes
  const handleInputChange = (field: keyof typeof heroData, value: string) => {
    setHeroData({
      ...heroData,
      [field]: value
    });
  };

  // Handle typing text changes
  const handleTypingTextChange = (index: number, value: string) => {
    const updatedTexts = [...heroData.typingTexts];
    updatedTexts[index] = value;
    setHeroData({
      ...heroData,
      typingTexts: updatedTexts
    });
  };

  // Add new typing text
  const addTypingText = () => {
    setHeroData({
      ...heroData,
      typingTexts: [...heroData.typingTexts, "New Text"]
    });
  };

  // Remove typing text
  const removeTypingText = (index: number) => {
    const updatedTexts = [...heroData.typingTexts];
    updatedTexts.splice(index, 1);
    setHeroData({
      ...heroData,
      typingTexts: updatedTexts
    });
  };

  // Video preview state
  const [isPlaying, setIsPlaying] = useState(false);

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
          <h1 className="text-2xl font-bold text-gray-800">Edit Hero Section</h1>
        </div>
        <div className="flex gap-2">
          <button 
            className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.open('/#hero', '_blank')}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  value={heroData.heading}
                  onChange={(e) => handleInputChange('heading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subheading
                </label>
                <input
                  type="text"
                  value={heroData.subheading}
                  onChange={(e) => handleInputChange('subheading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={heroData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={heroData.ctaPrimaryText}
                  onChange={(e) => handleInputChange('ctaPrimaryText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Button URL
                </label>
                <input
                  type="text"
                  value={heroData.ctaPrimaryUrl}
                  onChange={(e) => handleInputChange('ctaPrimaryUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={heroData.ctaSecondaryText}
                  onChange={(e) => handleInputChange('ctaSecondaryText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Button URL
                </label>
                <input
                  type="text"
                  value={heroData.ctaSecondaryUrl}
                  onChange={(e) => handleInputChange('ctaSecondaryUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Right Column - Media & Typing Texts */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Video
                </label>
                <div className="relative border border-gray-300 rounded-md overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {heroData.videoSrc && (
                      <video 
                        src={heroData.videoSrc} 
                        className="w-full h-full object-cover"
                        autoPlay={isPlaying}
                        loop
                        muted
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-300 flex justify-between items-center">
                    <span className="text-sm text-gray-500 truncate max-w-[200px]">
                      {heroData.videoSrc || "No video selected"}
                    </span>
                    <button className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                      <Upload size={14} />
                      <span className="text-sm">Upload</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Typing Animation Texts
                  </label>
                  <button 
                    onClick={addTypingText}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {heroData.typingTexts.map((text, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => handleTypingTextChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                      />
                      <button 
                        onClick={() => removeTypingText(index)}
                        className="p-2 border border-gray-300 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                        disabled={heroData.typingTexts.length <= 1}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Preview Section */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
        <div className="relative w-full h-[300px] bg-gray-900 rounded-lg overflow-hidden">
          {/* Background Video */}
          <video 
            src={heroData.videoSrc} 
            className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
            autoPlay
            loop
            muted
          />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full px-4 text-center text-white">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">
                {heroData.heading}
              </h1>
              <h2 className="text-xl mb-3">
                {heroData.subheading}
              </h2>
              <p className="mb-4 text-sm">
                {heroData.description}
              </p>
              <div className="flex justify-center space-x-4">
                <button className="px-4 py-2 bg-[#a5cd39] text-white font-medium rounded-md text-sm">
                  {heroData.ctaPrimaryText}
                </button>
                <button className="px-4 py-2 border border-white text-white font-medium rounded-md text-sm">
                  {heroData.ctaSecondaryText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroSectionEditor;
