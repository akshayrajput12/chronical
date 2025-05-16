'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Upload,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram
} from 'lucide-react';
import Image from 'next/image';

const SiteSettings = () => {
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

  // Sample site settings data
  const [siteData, setSiteData] = useState({
    siteName: 'Chronicle Exhibits',
    primaryColor: '#a5cd39',
    secondaryColor: '#2C2C2C',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    contactEmail: 'info@chronicleexhibits.com',
    contactPhone: '+971 4 123 4567',
    whatsappNumber: '+971 50 123 4567',
    address: 'Dubai World Trade Centre, Dubai, UAE',
    socialFacebook: 'https://facebook.com/chronicleexhibits',
    socialInstagram: 'https://instagram.com/chronicleexhibits',
    socialLinkedin: 'https://linkedin.com/company/chronicleexhibits',
    socialTwitter: 'https://twitter.com/chronicleexhibits'
  });

  // Handle input changes
  const handleInputChange = (field: keyof typeof siteData, value: string) => {
    setSiteData({
      ...siteData,
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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Site Settings</h1>
          <p className="text-gray-500 mt-1">Manage global site settings and branding</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1 px-4 py-2 bg-[#a5cd39] rounded-md text-white hover:bg-[#94b933] transition-colors">
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </motion.div>

      {/* Settings Form */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - General Settings */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteData.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={siteData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-10 h-10 border-0 p-0 rounded-md"
                    />
                    <input
                      type="text"
                      value={siteData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={siteData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-10 h-10 border-0 p-0 rounded-md"
                    />
                    <input
                      type="text"
                      value={siteData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-12 bg-gray-100 rounded-md overflow-hidden relative border border-gray-300 flex items-center justify-center">
                      {siteData.logoUrl && (
                        <Image
                          src={siteData.logoUrl}
                          alt="Logo"
                          width={120}
                          height={40}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                      <Upload size={16} />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Favicon
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative border border-gray-300 flex items-center justify-center">
                      {siteData.faviconUrl && (
                        <Image
                          src={siteData.faviconUrl}
                          alt="Favicon"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                      <Upload size={16} />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Contact & Social */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>Contact Email</span>
                  </div>
                </label>
                <input
                  type="email"
                  value={siteData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>Contact Phone</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={siteData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>WhatsApp Number</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={siteData.whatsappNumber}
                  onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>Address</span>
                  </div>
                </label>
                <textarea
                  value={siteData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Social Media</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Facebook size={16} />
                    <span>Facebook URL</span>
                  </div>
                </label>
                <input
                  type="url"
                  value={siteData.socialFacebook}
                  onChange={(e) => handleInputChange('socialFacebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Instagram size={16} />
                    <span>Instagram URL</span>
                  </div>
                </label>
                <input
                  type="url"
                  value={siteData.socialInstagram}
                  onChange={(e) => handleInputChange('socialInstagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SiteSettings;
