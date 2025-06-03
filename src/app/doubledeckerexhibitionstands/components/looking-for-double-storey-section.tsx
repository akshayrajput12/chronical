"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const LookingForDoubleStoreySection = () => {
  return (
    <section className="py-16" style={{ backgroundColor: '#a5cd39' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black uppercase tracking-wide">
              LOOKING FOR DOUBLE STOREY EXHIBITION STANDS IN DUBAI
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-black">
              <motion.a
                href="tel:+971543474645"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-4 h-4" />
                Call +971 (543) 47-4645
              </motion.a>

              <span className="text-lg">or submit enquiry form below</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LookingForDoubleStoreySection;
