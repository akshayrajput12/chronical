'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Eye,
  Plus,
  Trash,
  Info,
  Play,
  Pause
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getHeroSection,
  saveHeroSection
} from '@/services/hero.service';
import { HeroSectionWithTypingTexts } from '@/types/hero';
import { revalidatePathAction } from '@/services/revalidate.action';

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

  // State for hero section data
  const [heroData, setHeroData] = useState<HeroSectionWithTypingTexts>({
    heading: "Launch, Grow and Thrive in the Free Zone",
    subheading: "for Business Game Changers",
    description: "Welcome to Chronicle Exhibits - a connected, collaborative world-class exhibition stand builder for pioneering entrepreneurs, startups and multinationals, in the heart of Dubai's central business district.",
    typing_texts: [
      { text: "Exhibition Stands", display_order: 1 },
      { text: "Congress Services", display_order: 2 },
      { text: "Kiosk Solutions", display_order: 3 },
      { text: "Custom Designs", display_order: 4 },
      { text: "Event Management", display_order: 5 }
    ],
    cta_primary_text: "GET STARTED",
    cta_primary_url: "#",
    cta_secondary_text: "LEARN MORE",
    cta_secondary_url: "#"
  });

  // State for loading, saving, and hero section ID
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroId, setHeroId] = useState<string | undefined>(undefined);

  // Static video path
  const staticVideoPath = "/videos/hero-background.mp4";

  // Fetch hero section data on component mount
  useEffect(() => {
    const fetchHeroData = async () => {
      setLoading(true);
      try {
        const data = await getHeroSection();
        if (data) {
          setHeroId(data.id);
          setHeroData({
            heading: data.heading,
            subheading: data.subheading,
            description: data.description,
            cta_primary_text: data.cta_primary_text,
            cta_primary_url: data.cta_primary_url,
            cta_secondary_text: data.cta_secondary_text,
            cta_secondary_url: data.cta_secondary_url,
            typing_texts: data.typing_texts.map(text => ({
              text: text.text,
              display_order: text.display_order
            }))
          });
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
        toast.error('Failed to load hero section data');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof HeroSectionWithTypingTexts, value: string) => {
    setHeroData({
      ...heroData,
      [field]: value
    });
  };

  // Handle typing text changes
  const handleTypingTextChange = (index: number, value: string) => {
    const updatedTexts = [...heroData.typing_texts];
    updatedTexts[index] = { ...updatedTexts[index], text: value };
    setHeroData({
      ...heroData,
      typing_texts: updatedTexts
    });
  };

  // Add new typing text
  const addTypingText = () => {
    const newOrder = heroData.typing_texts.length > 0
      ? Math.max(...heroData.typing_texts.map(t => t.display_order)) + 1
      : 1;

    setHeroData({
      ...heroData,
      typing_texts: [
        ...heroData.typing_texts,
        { text: "New Text", display_order: newOrder }
      ]
    });
  };

  // Remove typing text
  const removeTypingText = (index: number) => {
    const updatedTexts = [...heroData.typing_texts];
    updatedTexts.splice(index, 1);

    // Reorder the remaining texts
    const reorderedTexts = updatedTexts.map((text, idx) => ({
      ...text,
      display_order: idx + 1
    }));

    setHeroData({
      ...heroData,
      typing_texts: reorderedTexts
    });
  };

  // Save hero section data
  const saveHeroSectionData = async () => {
    setSaving(true);

    // Validate data before saving
    if (!heroData.heading.trim()) {
      toast.error('Heading cannot be empty');
      setSaving(false);
      return;
    }

    if (heroData.typing_texts.length === 0) {
      toast.error('At least one typing text is required');
      setSaving(false);
      return;
    }

    try {
      // Save the hero section data
      const result = await saveHeroSection(heroData, heroId);

      if (result.success) {
        if (result.id && !heroId) {
          setHeroId(result.id);
        }
        toast.success('Hero section saved successfully');
      } else {
        toast.error(`Failed to save: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error('An error occurred while saving');
    } finally {
      revalidatePathAction('/');
      setSaving(false);
    }
  };

  // Note: Video is now static and not stored in the database

  // Video preview state
  const [isPlaying, setIsPlaying] = useState(false);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-[#a5cd39] border-t-transparent rounded-full"></div>
        <p className="text-gray-600">Loading hero section data...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Info Banner */}
      <motion.div
        variants={itemVariants}
        className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-start gap-3"
      >
        <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
        <div>
          <h3 className="font-medium text-blue-700 mb-1">About the Hero Section</h3>
          <p className="text-blue-600 text-sm">
            You can edit the text content and typing animation texts of the hero section.
            The background video is static and cannot be changed from this interface.
            Please contact the development team if you need to update the video.
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.open('/#hero', '_blank')}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
          <button
            onClick={saveHeroSectionData}
            disabled={saving}
            className="inline-flex items-center gap-1 px-4 py-2 bg-[#a5cd39] rounded-md text-white hover:bg-[#94b933] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
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
                  value={heroData.cta_primary_text}
                  onChange={(e) => handleInputChange('cta_primary_text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Button URL
                </label>
                <input
                  type="text"
                  value={heroData.cta_primary_url}
                  onChange={(e) => handleInputChange('cta_primary_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={heroData.cta_secondary_text}
                  onChange={(e) => handleInputChange('cta_secondary_text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Button URL
                </label>
                <input
                  type="text"
                  value={heroData.cta_secondary_url}
                  onChange={(e) => handleInputChange('cta_secondary_url', e.target.value)}
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
                    <video
                      src={staticVideoPath}
                      className="w-full h-full object-cover"
                      autoPlay={isPlaying}
                      loop
                      muted
                    />
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
                      {staticVideoPath}
                    </span>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-gray-500 text-sm">
                      <Info size={14} />
                      <span>Static Video</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Note: The background video is static and cannot be changed from the admin panel.
                  Contact the development team if you need to update it.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Typing Animation Texts
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      These texts will be displayed in a typing animation effect on the hero section.
                    </p>
                  </div>
                  <button
                    onClick={addTypingText}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Add Text</span>
                  </button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {heroData.typing_texts.map((text, index) => (
                    <div key={index} className="flex gap-2 items-center bg-white p-2 rounded-md border border-gray-200">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md w-8 text-center">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={text.text}
                        onChange={(e) => handleTypingTextChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                        placeholder="Enter text for typing animation"
                      />
                      <button
                        onClick={() => removeTypingText(index)}
                        className="p-2 border border-gray-300 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                        disabled={heroData.typing_texts.length <= 1}
                        title={heroData.typing_texts.length <= 1 ? "At least one typing text is required" : "Remove this text"}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                {heroData.typing_texts.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No typing texts added. Click &quot;Add Text&quot; to add one.
                  </div>
                )}
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
            src={staticVideoPath}
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
                  {heroData.cta_primary_text}
                </button>
                <button className="px-4 py-2 border border-white text-white font-medium rounded-md text-sm">
                  {heroData.cta_secondary_text}
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
