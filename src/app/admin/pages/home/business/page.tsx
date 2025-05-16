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
  BarChart
} from 'lucide-react';

const BusinessSectionEditor = () => {
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

  // Sample data for the business hub section
  const [businessData, setBusinessData] = useState({
    heading: "A progressive business hub",
    subheading: "where companies can thrive",
    description: [
      "Dubai World Trade Centre stands at the centre of commerce, laying the foundation for Dubai's ascent as a global hub and future economy enabler. We are your business gateway to the region, and beyond.",
      "A highly sought-after global business address and a vibrant destination, featuring premium commercial offices, co-working communities, the region's leading exhibition and convention centre, in addition to hospitality and retail options Dubai World Trade Centre is where the world comes to meet and do business.",
      "With attractive benefits, facilities and tailored services for companies looking to shape the future of business, we offer a well-regulated and supportive environment, empowering startups, SMEs and multinationals to succeed.",
    ],
    stats: [
      {
        value: 2000,
        label: "Companies",
        sublabel: "AND GROWING",
      },
      {
        value: 40,
        label: "Industries",
        sublabel: "REPRESENTED",
      },
      {
        value: 2000000,
        label: "Sq Ft.",
        sublabel: "OF PREMIUM OFFICE SPACE",
      },
    ]
  });

  // Handle input changes
  const handleInputChange = (field: keyof typeof businessData, value: string) => {
    setBusinessData({
      ...businessData,
      [field]: value
    });
  };

  // Handle paragraph changes
  const handleParagraphChange = (index: number, value: string) => {
    const updatedParagraphs = [...businessData.description];
    updatedParagraphs[index] = value;
    setBusinessData({
      ...businessData,
      description: updatedParagraphs
    });
  };

  // Add new paragraph
  const addParagraph = () => {
    setBusinessData({
      ...businessData,
      description: [...businessData.description, "New paragraph text here."]
    });
  };

  // Remove paragraph
  const removeParagraph = (index: number) => {
    const updatedParagraphs = [...businessData.description];
    updatedParagraphs.splice(index, 1);
    setBusinessData({
      ...businessData,
      description: updatedParagraphs
    });
  };

  // Handle stat changes
  const handleStatChange = (index: number, field: keyof typeof businessData.stats[0], value: string) => {
    const updatedStats = [...businessData.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: field === 'value' ? parseInt(value) || 0 : value
    };
    setBusinessData({
      ...businessData,
      stats: updatedStats
    });
  };

  // Add new stat
  const addStat = () => {
    setBusinessData({
      ...businessData,
      stats: [...businessData.stats, { value: 0, label: "New Stat", sublabel: "DESCRIPTION" }]
    });
  };

  // Remove stat
  const removeStat = (index: number) => {
    const updatedStats = [...businessData.stats];
    updatedStats.splice(index, 1);
    setBusinessData({
      ...businessData,
      stats: updatedStats
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
          <h1 className="text-2xl font-bold text-gray-800">Edit Business Hub Section</h1>
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.open('/#business-hub', '_blank')}
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
                  Heading
                </label>
                <input
                  type="text"
                  value={businessData.heading}
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
                  value={businessData.subheading}
                  onChange={(e) => handleInputChange('subheading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Description Paragraphs
                  </label>
                  <button
                    onClick={addParagraph}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Plus size={14} />
                    <span>Add Paragraph</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {businessData.description.map((paragraph, index) => (
                    <div key={index} className="flex gap-2">
                      <textarea
                        value={paragraph}
                        onChange={(e) => handleParagraphChange(index, e.target.value)}
                        rows={4}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                      />
                      <button
                        onClick={() => removeParagraph(index)}
                        className="p-2 border border-gray-300 rounded-md text-red-500 hover:bg-red-50 transition-colors self-start"
                        disabled={businessData.description.length <= 1}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Statistics */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistics</h2>
                <button
                  onClick={addStat}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  <Plus size={14} />
                  <span>Add Stat</span>
                </button>
              </div>

              <div className="space-y-6">
                {businessData.stats.map((stat, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <BarChart size={18} className="text-[#a5cd39]" />
                        <h3 className="font-medium">Statistic {index + 1}</h3>
                      </div>
                      <button
                        onClick={() => removeStat(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        disabled={businessData.stats.length <= 1}
                      >
                        <Trash size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Value
                        </label>
                        <input
                          type="number"
                          value={stat.value}
                          onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sublabel
                        </label>
                        <input
                          type="text"
                          value={stat.sublabel}
                          onChange={(e) => handleStatChange(index, 'sublabel', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{businessData.heading}</h2>
              <p className="text-lg text-gray-600">{businessData.subheading}</p>
              <div className="w-16 h-[3px] bg-[#a5cd39] mt-2"></div>
            </div>

            <div className="space-y-4 mb-8">
              {businessData.description.map((paragraph, index) => (
                <p key={index} className="text-gray-700">{paragraph}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-300">
              {businessData.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-[#a5cd39]">
                    {stat.value >= 1000000
                      ? `${(stat.value / 1000000).toFixed(1)}M`
                      : stat.value >= 1000
                        ? `${Math.floor(stat.value / 1000)}K`
                        : stat.value}
                  </div>
                  <div className="text-lg font-medium text-gray-800">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BusinessSectionEditor;
