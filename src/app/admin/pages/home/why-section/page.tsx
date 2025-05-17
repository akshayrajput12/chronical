'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Save,
  Eye,
  ArrowLeft,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import { getWhySection, updateWhySection, createWhySection, uploadWhySectionImage, deleteWhySectionImage } from '@/services/why-section.service';

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

  // State for the why section data
  const [whyData, setWhyData] = useState({
    heading: "",
    underlineColor: "",
    subtitle: "",
    leftColumnText1: "",
    leftColumnText2: "",
    rightColumnText: "",
    imageUrl: "",
    imageAlt: "",
    imageOverlayHeading: "",
    imageOverlaySubheading: ""
  });

  // State for the section ID (for updates)
  const [sectionId, setSectionId] = useState<string | null>(null);

  // Loading and notification states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch the why section data on component mount
  useEffect(() => {
    const fetchWhySection = async () => {
      setIsLoading(true);
      try {
        const data = await getWhySection();
        if (data) {
          setSectionId(data.id);
          setWhyData({
            heading: data.heading,
            underlineColor: data.underline_color,
            subtitle: data.subtitle,
            leftColumnText1: data.left_column_text_1,
            leftColumnText2: data.left_column_text_2,
            rightColumnText: data.right_column_text,
            imageUrl: data.image_url,
            imageAlt: data.image_alt,
            imageOverlayHeading: data.image_overlay_heading,
            imageOverlaySubheading: data.image_overlay_subheading
          });
        }
      } catch (error) {
        console.error('Error fetching why section:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load why section data'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhySection();
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof typeof whyData, value: string) => {
    setWhyData({
      ...whyData,
      [field]: value
    });
  };

  // Handle image delete
  const handleImageDelete = async () => {
    if (!whyData.imageUrl) {
      setNotification({
        type: 'error',
        message: 'No image to delete'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteWhySectionImage(whyData.imageUrl);
      if (result.success) {
        setWhyData({
          ...whyData,
          imageUrl: ''
        });
        setNotification({
          type: 'success',
          message: 'Image deleted successfully'
        });
      } else {
        setNotification({
          type: 'error',
          message: result.error || 'Failed to delete image'
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred while deleting the image'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if there's an existing image that needs to be deleted first
    if (whyData.imageUrl) {
      setNotification({
        type: 'error',
        message: 'Please delete the existing image before uploading a new one'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await uploadWhySectionImage(file);
      if (result.success && result.url) {
        setWhyData({
          ...whyData,
          imageUrl: result.url
        });
        setNotification({
          type: 'success',
          message: 'Image uploaded successfully'
        });
      } else {
        setNotification({
          type: 'error',
          message: result.error || 'Failed to upload image'
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred while uploading the image'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const whySectionData = {
        heading: whyData.heading,
        underline_color: whyData.underlineColor,
        subtitle: whyData.subtitle,
        left_column_text_1: whyData.leftColumnText1,
        left_column_text_2: whyData.leftColumnText2,
        right_column_text: whyData.rightColumnText,
        image_url: whyData.imageUrl,
        image_alt: whyData.imageAlt,
        image_overlay_heading: whyData.imageOverlayHeading,
        image_overlay_subheading: whyData.imageOverlaySubheading
      };

      let result;

      // If we have a section ID, update the existing record
      if (sectionId) {
        console.log('Updating existing why section with ID:', sectionId);
        result = await updateWhySection(sectionId, whySectionData);
      } else {
        // Otherwise, create a new record
        console.log('Creating new why section');
        const createResult = await createWhySection(whySectionData);
        if (createResult.success && createResult.id) {
          setSectionId(createResult.id);
        }
        result = createResult;
      }

      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Changes saved successfully'
        });
      } else {
        setNotification({
          type: 'error',
          message: result.error || 'Failed to save changes'
        });
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred while saving changes'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 size={40} className="animate-spin text-[#a5cd39] mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading Why Section Data...</h2>
        <p className="text-gray-500 mt-2">Please wait while we fetch the latest content.</p>
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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center">
        <div className="flex items-center gap-2">
          <Link href="/admin/pages/home">
            <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit Why Section</h1>
        </div>
        <div className="ml-auto">
          <button
            className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.open('/#why-section', '_blank')}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
        </div>
      </motion.div>

      {/* Notification */}
      {notification.type && (
        <motion.div
          className={`p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{notification.message}</span>
          </div>
        </motion.div>
      )}

      {/* Editor Form */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {/* Description */}
          <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">About the Why Section</h3>
            <p className="text-blue-700">
              This section showcases the key reasons why businesses should choose DWTC Free Zone.
              You can edit the heading, subtitle, main content paragraphs, and the featured image.
              All changes will be immediately reflected on the website after saving.
            </p>
          </div>

          {/* Save Button */}
          <div className="mb-6 flex justify-center">
            <button
              className="inline-flex items-center gap-1 px-6 py-3 bg-[#a5cd39] rounded-md text-white hover:bg-[#94b933] transition-colors w-full max-w-md"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

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
                      {whyData.imageUrl ? whyData.imageUrl.split('/').pop() : "No image selected"}
                    </span>
                    <div className="flex items-center gap-2">
                      {isLoading && (
                        <Loader2 size={14} className="animate-spin mr-2" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {whyData.imageUrl ? (
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-red-300 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                          onClick={handleImageDelete}
                          disabled={isLoading}
                          title="Delete current image"
                        >
                          <Trash2 size={14} />
                          <span className="text-sm">Delete</span>
                        </button>
                      ) : (
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                        >
                          <Upload size={14} />
                          <span className="text-sm">Upload</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500 space-y-1">
                  <p>Upload an image to showcase in the why section. Recommended size: 1200x800px.</p>
                  <p className="font-medium text-amber-600">Note: You must delete the existing image before uploading a new one.</p>
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
                  {whyData.imageUrl ? (
                    <>
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
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                      <p className="text-gray-500 mb-2">No image selected</p>
                      <p className="text-xs text-gray-400">Overlay text will appear when an image is uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            className="inline-flex items-center gap-1 px-6 py-3 bg-[#a5cd39] rounded-md text-white hover:bg-[#94b933] transition-colors w-full max-w-md"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WhySectionEditor;
