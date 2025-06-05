"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Headphones } from "lucide-react";

const ContactInfo = () => {
  return (
    <section className="py-16 bg-gray-50">
      {/* Apply same generous side gaps as blog detail page */}
      <div className="w-full px-24 md:px-32 lg:px-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Sales Contact */}
          <motion.div
            className="bg-white rounded-xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-[#a5cd39] border-2 border-transparent group hover:scale-105 transform"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center space-x-6">
              <motion.div
                className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-[#a5cd39]/10 rounded-full group-hover:bg-[#a5cd39]/20 transition-all duration-500"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <User className="w-8 h-8 text-[#a5cd39] group-hover:scale-110 transition-transform duration-300" />
              </motion.div>

              <div className="flex-1">
                <h3 className="text-sm font-markazi font-bold text-[#a5cd39] uppercase tracking-wider mb-3 group-hover:tracking-widest transition-all duration-300">
                  SALES DEPARTMENT
                </h3>

                <div className="space-y-2">
                  <motion.p
                    className="text-2xl font-rubik font-bold text-gray-900 group-hover:text-[#a5cd39] transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    +971 554 974 645
                  </motion.p>
                  <motion.a
                    href="mailto:sales@chronicleexhibits.com"
                    className="text-base font-nunito text-gray-600 hover:text-[#a5cd39] transition-colors duration-300 block font-medium"
                    whileHover={{ scale: 1.01 }}
                  >
                    sales@chronicleexhibits.com
                  </motion.a>
                  <p className="text-sm font-nunito text-gray-500 leading-relaxed pt-2">
                    Get in touch for project inquiries, quotes, and exhibition stand design consultations.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Care Contact */}
          <motion.div
            className="bg-white rounded-xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-[#a5cd39] border-2 border-transparent group hover:scale-105 transform"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center space-x-6">
              <motion.div
                className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-[#a5cd39]/10 rounded-full group-hover:bg-[#a5cd39]/20 transition-all duration-500"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <Headphones className="w-8 h-8 text-[#a5cd39] group-hover:scale-110 transition-transform duration-300" />
              </motion.div>

              <div className="flex-1">
                <h3 className="text-sm font-markazi font-bold text-[#a5cd39] uppercase tracking-wider mb-3 group-hover:tracking-widest transition-all duration-300">
                  CUSTOMER CARE
                </h3>

                <div className="space-y-2">
                  <motion.p
                    className="text-2xl font-rubik font-bold text-gray-900 group-hover:text-[#a5cd39] transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    +971 (0)4 389 3999
                  </motion.p>
                  <motion.a
                    href="mailto:care@chronicleexhibits.com"
                    className="text-base font-noto-kufi-arabic text-gray-600 hover:text-[#a5cd39] transition-colors duration-300 block font-medium"
                    whileHover={{ scale: 1.01 }}
                  >
                    care@chronicleexhibits.com
                  </motion.a>
                  <p className="text-sm font-noto-kufi-arabic text-gray-500 leading-relaxed pt-2">
                    Reach out for support, service requests, and post-project assistance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
