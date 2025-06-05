'use client';

import React from 'react';
import { motion } from 'framer-motion';

const FontShowcase = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-rubik font-bold text-gray-900 mb-4">
              Typography Showcase
            </h2>
            <p className="text-gray-600 font-nunito">
              Demonstrating our three beautiful Google Fonts
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Rubik Font Showcase */}
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
            >
              <h3 className="text-xl font-rubik font-bold text-[#a5cd39] mb-4">
                1. Rubik Font Family
              </h3>
              <div className="space-y-3">
                <h1 className="text-4xl font-rubik font-bold text-gray-900">
                  Main Heading - Rubik Bold
                </h1>
                <h2 className="text-2xl font-rubik font-semibold text-gray-800">
                  Subheading - Rubik Semibold
                </h2>
                <p className="text-base font-rubik text-gray-600">
                  This is a paragraph using Rubik regular weight. Rubik is a sans-serif font family with slightly rounded corners.
                </p>
                <p className="text-sm font-rubik italic text-gray-500">
                  Rubik italic style for emphasis and quotes.
                </p>
              </div>
            </motion.div>

            {/* Markazi Text Font Showcase */}
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
            >
              <h3 className="text-xl font-markazi font-bold text-[#a5cd39] mb-4">
                2. Markazi Text Font Family
              </h3>
              <div className="space-y-3">
                <h1 className="text-4xl font-markazi font-bold text-gray-900">
                  Main Heading - Markazi Text Bold
                </h1>
                <h2 className="text-2xl font-markazi font-semibold text-gray-800">
                  Subheading - Markazi Text Semibold
                </h2>
                <p className="text-base font-markazi text-gray-600">
                  This is a paragraph using Markazi Text regular weight. Markazi Text is a serif font that supports both Latin and Arabic scripts.
                </p>
                <p className="text-lg font-markazi font-medium text-gray-700">
                  Perfect for elegant headings and sophisticated typography.
                </p>
              </div>
            </motion.div>

            {/* Noto Kufi Arabic Font Showcase */}
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
            >
              <h3 className="text-xl font-noto-kufi-arabic font-bold text-[#a5cd39] mb-4">
                3. Noto Kufi Arabic Font Family
              </h3>
              <div className="space-y-3">
                <h1 className="text-4xl font-noto-kufi-arabic font-bold text-gray-900">
                  Main Heading - Noto Kufi Arabic Bold
                </h1>
                <h2 className="text-2xl font-noto-kufi-arabic font-semibold text-gray-800">
                  Subheading - Noto Kufi Arabic Semibold
                </h2>
                <p className="text-base font-noto-kufi-arabic text-gray-600">
                  This is a paragraph using Noto Kufi Arabic regular weight. This font supports Arabic script and Latin characters.
                </p>
                <div className="text-right">
                  <p className="text-2xl font-noto-kufi-arabic font-bold text-gray-900 mb-2" dir="rtl">
                    مرحباً بكم في موقعنا
                  </p>
                  <p className="text-base font-noto-kufi-arabic text-gray-600" dir="rtl">
                    هذا نص تجريبي باللغة العربية لعرض خط نوتو كوفي العربي
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Combined Usage Example */}
            <motion.div 
              className="bg-gradient-to-r from-[#a5cd39]/10 to-[#f0c419]/10 p-8 rounded-lg border border-[#a5cd39]/20"
              variants={itemVariants}
            >
              <h3 className="text-xl font-rubik font-bold text-[#a5cd39] mb-4">
                Combined Typography Example
              </h3>
              <div className="space-y-4">
                <h1 className="text-3xl font-rubik font-bold text-gray-900">
                  Rubik for Main Headlines
                </h1>
                <h2 className="text-xl font-markazi font-semibold text-gray-800">
                  Markazi Text for Elegant Subheadings
                </h2>
                <p className="text-base font-nunito text-gray-600 leading-relaxed">
                  Nunito for body text and paragraphs provides excellent readability and a friendly, modern appearance. This combination creates a harmonious typography system.
                </p>
                <div className="text-right mt-4">
                  <h3 className="text-lg font-noto-kufi-arabic font-bold text-gray-900 mb-2" dir="rtl">
                    نوتو كوفي للنصوص العربية
                  </h3>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FontShowcase;
