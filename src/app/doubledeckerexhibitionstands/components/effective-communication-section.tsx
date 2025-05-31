"use client";

import React from "react";
import { motion } from "framer-motion";

const EffectiveCommunicationSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
                EFFECTIVELY COMMUNICATES YOUR MESSAGE
              </h2>

              <p className="text-base leading-relaxed text-justify">
                An exhibition booth makes you look different from other exhibitors & passes on the relevant brand message to the 
                clients. We understand the importance of standing out. That's why we ensure your stand grabs attention and effectively 
                communicates your message. From innovative layouts to bold graphics, we use the latest technology to create 
                unforgettable experiences.
              </p>

              <p className="text-base leading-relaxed text-justify">
                Our commitment extends beyond design. We provide comprehensive services, including fabrication and 
                installation, ensuring timely delivery and high-quality standards. Trust us to bring your vision to life and achieve 
                your exhibition goals.
              </p>

              <p className="text-base leading-relaxed text-justify">
                Whether it's a trade show or corporate event, Double Storey Exhibition Stands in Dubai is here to help. Contact us today to 
                discuss your requirements and elevate your exhibition presence with our exceptional double-decker stands.
              </p>
            </motion.div>

            {/* Right Column - Image with Green Background */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Green Background */}
              <div className="absolute -bottom-6 -left-6 w-full h-full z-0" style={{ backgroundColor: '#a5cd39' }}></div>

              {/* Image Container */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Exhibition Communication"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EffectiveCommunicationSection;
