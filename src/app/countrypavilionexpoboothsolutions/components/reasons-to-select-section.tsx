"use client";

import React from "react";
import { motion } from "framer-motion";

const ReasonsToSelectSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide">
              REASONS TO SELECT OUR SERVICES FOR COUNTRY PAVILION EXPO BOOTH
            </h2>

            {/* Content */}
            <div className="space-y-6 text-gray-700 max-w-5xl mx-auto">
              <p className="text-base leading-relaxed text-center">
                In Chronicle Exhibition Organizing LLC, we go beyond the traditional exhibition stand We create experiences. Our pavilions 
                for country events are carefully designed to reflect the distinctiveness of your nation. With a singular emphasis on the richness 
                of culture and contemporary design Our pavilions make an impression that lasts.
              </p>

              <p className="text-base leading-relaxed text-center">
                Let us make your vision an unforgettable reality on the world stage. Attract the maximum amount of attention and guarantee an 
                effective presence at events and trade fairs in the UAE by partnering with us.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReasonsToSelectSection;
