"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ContactMap = () => {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-24 md:px-32 lg:px-48">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Our Location
          </h2>
        </motion.div>

        <motion.div
          className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Map Container */}
          <div className="relative h-96">
            {/* Map Placeholder - Using a map-like background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
              }}
            >
              {/* Map overlay to simulate actual map appearance */}
              <div className="absolute inset-0 bg-blue-100/70"></div>

              {/* Location marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Marker pin */}
                  <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg relative">
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                  </div>
                </div>
              </div>

              {/* Map controls simulation */}
              <div className="absolute top-4 right-4 space-y-2">
                <div className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 text-sm font-bold">+</div>
                <div className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 text-sm font-bold">-</div>
              </div>
            </div>
          </div>

          {/* View on Google Maps Button */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Button
              className="bg-white hover:bg-gray-50 text-[#007bff] border border-[#007bff] px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md shadow-md"
              onClick={() => window.open('https://maps.google.com', '_blank')}
            >
              VIEW ON GOOGLE MAPS
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactMap;
