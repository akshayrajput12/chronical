'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  Users,
  MessageSquare,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Phone,
  Eye,
  Edit,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';

const CustomStandAdminPage = () => {
  const sections = [
    {
      id: 'hero',
      title: 'Hero Section',
      description: 'Main banner with title, subtitle, and background image',
      icon: <Building2 className="w-6 h-6" />,
      href: '/admin/pages/custom-stand/hero',
      color: 'bg-blue-500',
    },
    {
      id: 'leading-contractor',
      title: 'Leading Contractor',
      description: 'Introduction section about being a leading contractor',
      icon: <Users className="w-6 h-6" />,
      href: '/admin/pages/custom-stand/leading-contractor',
      color: 'bg-green-500',
    },
    {
      id: 'promote-brand',
      title: 'Promote Brand',
      description: 'Section about promoting brand and services with image',
      icon: <MessageSquare className="w-6 h-6" />,
      href: '/admin/pages/custom-stand/promote-brand',
      color: 'bg-purple-500',
    },
    {
      id: 'striking-customized',
      title: 'Striking Customized',
      description: 'Section about striking customized exhibition stands',
      icon: <Sparkles className="w-6 h-6" />,
      href: '/admin/pages/custom-stand/striking-customized',
      color: 'bg-orange-500',
    },
    {
      id: 'reasons-to-choose',
      title: 'Reasons to Choose',
      description: 'Section explaining reasons to choose the services',
      icon: <CheckCircle className="w-6 h-6" />,
      href: '/admin/pages/custom-stand/reasons-to-choose',
      color: 'bg-teal-500',
    },
    {
      id: 'faq',
      title: 'FAQ Section',
      description: 'Frequently asked questions with expandable answers',
      icon: <HelpCircle className="w-6 h-6" />,
      href: '/admin/pages/custom-stand/faq',
      color: 'bg-indigo-500',
    },
    {
      id: 'looking-for-stands',
      title: 'Looking for Stands',
      description: 'Call-to-action section with phone number and contact info',
      icon: <Phone className="w-6 h-6" />,
      href: '/admin/pages/custom-stand/looking-for-stands',
      color: 'bg-red-500',
    },
    {
      id: 'portfolio',
      title: 'Portfolio Section',
      description: 'Manage portfolio showcase and project gallery',
      icon: <ImageIcon className="w-6 h-6" />,
      href: '/admin/pages/custom-stand/portfolio',
      color: 'bg-purple-500',
    },
    {
      id: 'paragraph-section',
      title: 'Paragraph Section',
      description: 'Manage the paragraph content section',
      icon: <MessageSquare className="w-6 h-6" />,
      href: '/admin/pages/custom-stand/paragraph-section',
      color: 'bg-gray-500',
    },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Custom Exhibition Stands
              </h1>
              <p className="text-gray-600">
                Manage all content sections for the custom exhibition stands page
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/customexhibitionstands"
                target="_blank"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Page
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Sections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sections.map((section) => (
            <motion.div
              key={section.id}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${section.color} text-white`}>
                    {section.icon}
                  </div>
                  <Link
                    href={section.href}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {section.description}
                </p>
                
                <Link
                  href={section.href}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  Manage Section
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Page Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">7</div>
              <div className="text-gray-600 text-sm">Content Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">3</div>
              <div className="text-gray-600 text-sm">Image Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">1</div>
              <div className="text-gray-600 text-sm">FAQ Section</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomStandAdminPage;
