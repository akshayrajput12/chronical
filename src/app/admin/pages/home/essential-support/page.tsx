'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Save,
  Eye,
  Plus,
  Trash,
  Info,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  MoveVertical,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getEssentialSupportSection,
  saveEssentialSupportSection
} from '@/services/essential-support.service';
import { EssentialSupportSectionInput } from '@/types/essential-support';

const EssentialSupportEditor = () => {
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

  // State for essential support section data
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [sectionData, setSectionData] = useState<EssentialSupportSectionInput>({
    heading: "Essential Support",
    heading_span: "Services",
    description: "A range of essential and value-added services to support your operations, freeing you up to focus on what matters most - growing your business.",
    cta_text: "Learn More",
    cta_url: "#",
    categories: [],
    is_active: true
  });

  // UI state
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Fetch essential support section data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getEssentialSupportSection();
        if (data) {
          setSectionId(data.id);
          setSectionData({
            heading: data.heading,
            heading_span: data.heading_span,
            description: data.description,
            cta_text: data.cta_text,
            cta_url: data.cta_url,
            categories: data.categories.map(category => ({
              title: category.title,
              icon_svg: category.icon_svg,
              display_order: category.display_order,
              is_active: category.is_active,
              services: category.services.map(service => ({
                service_text: service.service_text,
                display_order: service.display_order,
                is_active: service.is_active
              }))
            }))
          });
        }
      } catch (error) {
        console.error('Error fetching essential support data:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load essential support section data'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSectionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category changes
  const handleCategoryChange = (index: number, field: string, value: string) => {
    // Prevent changing the icon_svg field
    if (field === 'icon_svg') {
      return;
    }

    setSectionData(prev => {
      const updatedCategories = [...prev.categories];
      updatedCategories[index] = {
        ...updatedCategories[index],
        [field]: value
      };
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };

  // Handle service changes
  const handleServiceChange = (categoryIndex: number, serviceIndex: number, value: string) => {
    setSectionData(prev => {
      const updatedCategories = [...prev.categories];
      const updatedServices = [...updatedCategories[categoryIndex].services];
      updatedServices[serviceIndex] = {
        ...updatedServices[serviceIndex],
        service_text: value
      };
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        services: updatedServices
      };
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };

  // Categories are fixed and cannot be added or removed

  // Add a new service to a category
  const addService = (categoryIndex: number) => {
    setSectionData(prev => {
      const updatedCategories = [...prev.categories];
      const services = updatedCategories[categoryIndex].services;
      const newDisplayOrder = services.length > 0
        ? Math.max(...services.map(s => s.display_order)) + 1
        : 1;

      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        services: [
          ...services,
          {
            service_text: "New Service",
            display_order: newDisplayOrder,
            is_active: true
          }
        ]
      };

      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };

  // Remove a service
  const removeService = (categoryIndex: number, serviceIndex: number) => {
    setSectionData(prev => {
      const updatedCategories = [...prev.categories];
      const updatedServices = [...updatedCategories[categoryIndex].services];
      updatedServices.splice(serviceIndex, 1);
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        services: updatedServices
      };
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };

  // Categories are fixed and cannot be removed or reordered

  // Move a service up or down
  const moveService = (categoryIndex: number, serviceIndex: number, direction: 'up' | 'down') => {
    const services = sectionData.categories[categoryIndex].services;

    if (
      (direction === 'up' && serviceIndex === 0) ||
      (direction === 'down' && serviceIndex === services.length - 1)
    ) {
      return;
    }

    setSectionData(prev => {
      const updatedCategories = [...prev.categories];
      const updatedServices = [...updatedCategories[categoryIndex].services];
      const targetIndex = direction === 'up' ? serviceIndex - 1 : serviceIndex + 1;

      // Swap display orders
      const tempOrder = updatedServices[serviceIndex].display_order;
      updatedServices[serviceIndex].display_order = updatedServices[targetIndex].display_order;
      updatedServices[targetIndex].display_order = tempOrder;

      // Swap positions in array for immediate UI update
      [updatedServices[serviceIndex], updatedServices[targetIndex]] =
      [updatedServices[targetIndex], updatedServices[serviceIndex]];

      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        services: updatedServices
      };

      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };

  // Save all changes
  const saveChanges = async () => {
    setSaving(true);
    setNotification({ type: null, message: '' });

    try {
      const result = await saveEssentialSupportSection(sectionId, sectionData);

      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Changes saved successfully'
        });

        if (result.id && !sectionId) {
          setSectionId(result.id);
        }

        toast.success('Essential Support section updated successfully');
      } else {
        setNotification({
          type: 'error',
          message: result.error || 'Failed to save changes'
        });
        toast.error('Failed to update Essential Support section');
      }
    } catch (error) {
      console.error('Error saving essential support data:', error);
      setNotification({
        type: 'error',
        message: 'An unexpected error occurred'
      });
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
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
          <Link
            href="/admin/pages/home"
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Essential Support Section</h1>
            <p className="text-gray-500 mt-1">Edit the essential support services section</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye size={16} />
            <span>View Page</span>
          </Link>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="inline-flex items-center gap-1 px-4 py-2 bg-[#a5cd39] rounded-md text-white hover:bg-[#94b933] transition-colors disabled:opacity-70"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </motion.div>

      {/* Notification */}
      {notification.type && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-md ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : (
              <AlertCircle size={18} className="text-red-500" />
            )}
            <span>{notification.message}</span>
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      {loading ? (
        <motion.div variants={itemVariants} className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a5cd39]"></div>
            <p className="text-gray-500">Loading essential support section data...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Section Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Section Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  name="heading"
                  value={sectionData.heading}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading Span (lighter text)
                </label>
                <input
                  type="text"
                  name="heading_span"
                  value={sectionData.heading_span}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={sectionData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  name="cta_text"
                  value={sectionData.cta_text}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Button URL
                </label>
                <input
                  type="text"
                  name="cta_url"
                  value={sectionData.cta_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Service Categories</h2>
              <div className="flex items-center gap-2">
                <Info size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">Categories are fixed and cannot be added or removed</span>
              </div>
            </div>

            <div className="space-y-8">
              {sectionData.categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-md bg-[#a5cd39] bg-opacity-10 text-[#a5cd39]">
                        <Briefcase size={20} />
                      </div>
                      <h3 className="text-lg font-medium">{category.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                        Category {categoryIndex + 1}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Title
                      </label>
                      <input
                        type="text"
                        value={category.title}
                        onChange={(e) => handleCategoryChange(categoryIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon SVG (Read-only)
                      </label>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full border-2 border-[#a5cd39] flex items-center justify-center text-[#a5cd39]">
                          <div className="w-6 h-6" dangerouslySetInnerHTML={{
                            __html: category.icon_svg
                              .replace(/strokeWidth=\{([^}]+)\}/g, 'stroke-width="$1"')
                              .replace(/strokeLinecap=/g, 'stroke-linecap=')
                              .replace(/strokeLinejoin=/g, 'stroke-linejoin=')
                              .replace(/className=/g, 'class=')
                              .replace(/clipRule=/g, 'clip-rule=')
                              .replace(/fillRule=/g, 'fill-rule=')
                          }} />
                        </div>
                        <div className="text-xs text-gray-500">
                          SVG icons are fixed and cannot be changed
                        </div>
                      </div>
                      <textarea
                        value={category.icon_svg}
                        readOnly
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-xs font-mono"
                      ></textarea>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-md font-medium">Services</h4>
                      <button
                        onClick={() => addService(categoryIndex)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition-colors text-xs"
                      >
                        <Plus size={14} />
                        <span>Add Service</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {category.services.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-center gap-2">
                          <div className="flex-grow">
                            <input
                              type="text"
                              value={service.service_text}
                              onChange={(e) => handleServiceChange(categoryIndex, serviceIndex, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                            />
                          </div>
                          <button
                            onClick={() => moveService(categoryIndex, serviceIndex, 'up')}
                            disabled={serviceIndex === 0}
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                            title="Move Up"
                          >
                            <MoveVertical size={14} className="rotate-180" />
                          </button>
                          <button
                            onClick={() => moveService(categoryIndex, serviceIndex, 'down')}
                            disabled={serviceIndex === category.services.length - 1}
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                            title="Move Down"
                          >
                            <MoveVertical size={14} />
                          </button>
                          <button
                            onClick={() => removeService(categoryIndex, serviceIndex)}
                            className="p-1 rounded-md hover:bg-red-100 text-red-500 transition-colors"
                            title="Remove Service"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveChanges}
              disabled={saving}
              className="inline-flex items-center gap-1 px-6 py-3 bg-[#a5cd39] rounded-md text-white hover:bg-[#94b933] transition-colors disabled:opacity-70"
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EssentialSupportEditor;
