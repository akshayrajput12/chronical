"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const StrikingCustomizedSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Image with Colored Background */}
            <motion.div
              className="order-1 lg:order-1 relative"
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
                  src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Striking customized exhibition stands"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              className="order-2 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-wide text-center">
                  STRIKING CUSTOMIZED EXHIBITION STANDS
                </h3>

                <div className="space-y-4 text-gray-700">
                  <p className="text-base leading-relaxed text-justify">
                    Interactive displays and eye-catching designs will help you communicate your company's message effectively and
                    convincingly. From materials and colors, to dimensions, shapes and design, your display is completely tailored to your
                    brand and business which allows you to present your services and products in the most effective and appealing manner
                    possible.
                  </p>

                  <p className="text-base leading-relaxed text-justify">
                    You can use our custom exhibit stands for various branding and exhibit needs, such as portable fitting rooms, entry
                    spaces, custom workspaces, and pop-up stores. The distinctive stand designed by Chronicle creates an
                    unforgettable impression on the people who visit your stand. As more than 50% of business decision makers would
                    like sales representatives to visit their business following the event, you'll need a stand to showcase your product in the
                    best way possible. Our stand is distinct and appealing design which is sure to draw attention.
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

export default StrikingCustomizedSection;
