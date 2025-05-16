'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Eye, Save } from 'lucide-react';

const AboutDescriptionEditor = () => {
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
          <h1 className="text-2xl font-bold text-gray-800">Edit About Description Section</h1>
        </div>
        <div className="flex gap-2">
          <button 
            className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.open('/about#description', '_blank')}
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
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About Description Section Editor</h2>
            <p className="text-gray-500">
              This is a placeholder for the About Description section editor. <br />
              The actual editor would include fields for main description text, services, and other content.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutDescriptionEditor;
