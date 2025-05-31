"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const CommunicateSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Image with Colored Background */}
          <motion.div
            className="order-2 lg:order-1 relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Green Background */}
            <div className="absolute -bottom-6 -left-6 w-full h-full z-0" style={{ backgroundColor: '#a5cd39' }}></div>

            {/* Image Container */}
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
              <Image
                src="https://images.unsplash.com/photo-1559223607-b4d0555ae227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Professional conference presentation"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide text-center">
                COMMUNICATE TO PROFICIENT MEETING & CONFERENCE PLANNERS
              </h2>

              <div className="space-y-4 text-gray-700">
                <p className="text-base leading-relaxed text-justify">
                  <span className="font-semibold" style={{ color: '#a5cd39' }}>Chronicle Exhibition Organizing LLC</span> is one of the most well-liked event organizing & management companies in Dubai & UAE. We as conference organizers in Dubai, UAE have a close-knit & active team of dedicated professionals capable of planning & executing corporate meetings & events successfully.
                </p>

                <p className="text-base leading-relaxed text-justify">
                  Our event management experts are packed with innovative ideas & are there for your continuous support.
                </p>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunicateSection;
