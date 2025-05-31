"use client";

import React from "react";
import { motion } from "framer-motion";

const ConferenceManagementServices = () => {
  const services = [
    {
      title: "SYSTEMATIC PLANNING",
      description: "Make an impactful strategy covering all event components, ensuring high-rate success.",
      color: "text-[#a5cd39]"
    },
    {
      title: "VENUE SELECTION",
      description: "Help you find an easy-to-access location for the conference or meeting.",
      color: "text-[#a5cd39]"
    },
    {
      title: "REGISTRATION PROCESS",
      description: "As efficient event planners, we suggest user-friendly registration solutions reducing your workload.",
      color: "text-[#a5cd39]"
    },
    {
      title: "PRESENTATION MANAGEMENT",
      description: "Assign the responsibility of sharing the information to trained speakers & provide them with all the essential presentation-related guidelines.",
      color: "text-[#a5cd39]"
    },
    {
      title: "FOOD & BEVERAGE",
      description: "Take care of food needs & look after everything including menus, workforce, and other important elements.",
      color: "text-[#a5cd39]"
    },
    {
      title: "PROGRAM DESIGN",
      description: "Well aware of the latest trends & colour schemes needed to create a vibrant stage. Our powerful program designs are an assurance of success.",
      color: "text-[#a5cd39]"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 uppercase tracking-wide">
            CONFERENCE MANAGEMENT SERVICES IN DUBAI
          </h2>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
            We are specialized in planning, designing, organizing & managing all kinds of meetings, promotional events and conferences in Dubai, UAE.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="bg-gray-50 p-8 text-left border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className={`text-xl font-bold mb-6 uppercase tracking-wide ${service.color}`}>
                {service.title}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default ConferenceManagementServices;
