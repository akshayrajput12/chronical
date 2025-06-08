"use client";

import React from 'react';
import { motion } from 'framer-motion';

const KioskMain = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2069&auto=format&fit=crop')",
            backgroundPosition: "center",
            filter: "brightness(0.5)"
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10 text-center">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          KIOSK MANUFACTURERS IN DUBAI
        </motion.h1>
        <motion.div
          className="w-24 h-1 bg-[#a5cd39] mx-auto"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </section>
  );
};

export default KioskMain;
