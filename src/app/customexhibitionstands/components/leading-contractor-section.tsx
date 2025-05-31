"use client";

import React from "react";
import { motion } from "framer-motion";

const LeadingContractorSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 uppercase tracking-wide">
              LEADING CONTRACTOR FOR CUSTOM EXHIBITION STANDS
            </h2>

            <div className="space-y-6 text-gray-700 max-w-5xl mx-auto">
              <p className="text-base leading-relaxed text-justify">
                The ultimate destination for bespoke, eye-catching, and innovative custom exhibition stands in Dubai that catapult your brand
                presence to new heights. Chronicle Exhibits is the leading provider of customized exhibition solutions in Dubai, we excel in
                crafting unforgettable experiences that catch the audiences and leave a lasting impression.
              </p>

              <p className="text-base leading-relaxed text-justify">
                At Custom Exhibition Stands, we recognize the uniqueness of every brand and commit ourselves to transforming your vision
                into reality. Whether you're gearing up for a trade show, conference, or any other event, our team actively collaborate with
                you to conceive and construct tailor-made exhibition stands that mirror your brand identity and objectives.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LeadingContractorSection;
