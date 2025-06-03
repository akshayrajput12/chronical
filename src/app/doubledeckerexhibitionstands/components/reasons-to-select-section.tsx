"use client";

import React from "react";
import { motion } from "framer-motion";

const ReasonsToSelectSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
              REASONS TO SELECT OUR SERVICES FOR DOUBLE DECKER EXHIBITION STANDS
            </h2>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-base leading-relaxed text-justify">
              Chronicle Exhibition Organizing LLC stands in the forefront of custom Double Decker exhibition stand design to match your
              brand&apos;s identity. Our expert team of builders and designers will ensure smooth execution, transforming your ideas into an
              exhibition reality.
            </p>

            <p className="text-base leading-relaxed text-justify">
              Double decker booths are made to make an impression on the viewer and boost the visibility of your brand. Buy them now 
              and get the most out of your investment. These booths are available in different sizes and can be customized to meet your 
              specific requirements.
            </p>

            <p className="text-base leading-relaxed text-justify">
              Our commitment extends beyond design. We provide comprehensive services, including fabrication and 
              installation, ensuring timely delivery and high-quality standards. Trust us to bring your vision to life and achieve 
              your exhibition goals.
            </p>

            <p className="text-base leading-relaxed text-justify">
              Whether it&apos;s a trade show or corporate event, Double Storey Exhibition Stands in Dubai is here to help. Contact us today to
              discuss your requirements and elevate your exhibition presence with our exceptional double-decker stands.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReasonsToSelectSection;
