"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const ExceptionalDesignSection = () => {
  return (
    <>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Content */}
              <motion.div
                className="order-1 lg:order-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-wide text-center">
                    EXCEPTIONAL DESIGN SERVICES<br />FOR PAVILION BOOTHS
                  </h3>

                  <div className="space-y-4 text-gray-700">
                    <p className="text-base leading-relaxed text-justify">
                      <span className="text-[#a5cd39] font-medium">Country Pavilion Expo Booth</span> reflects a particular nation&apos;s
                      culture, religion & way of living. It is a chain of small
                      exhibition stands where you can display your products with
                      the member exhibitors of your country. Explore companies
                      across the globe pick out pavilion booths to promote their
                      brand & sell out their products.
                    </p>

                    <p className="text-base leading-relaxed text-justify">
                      Pavilion booths are highly beneficial for promoting brands &
                      products. Let&apos;s <span className="text-[#a5cd39] font-medium">quickly look into its pros</span> →
                    </p>

                    <ul className="space-y-3 ml-6">
                      <li className="flex items-start">
                        <span className="text-[#a5cd39] mr-2">•</span>
                        <span>You can target a vast number of potential consumers.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#a5cd39] mr-2">•</span>
                        <span>Enrich brand value by creating positive brand awareness.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#a5cd39] mr-2">•</span>
                        <span>Gives you an excellent chance to interact with new consumers who may become your future clients.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#a5cd39] mr-2">•</span>
                        <span>Allow you to make strong business networks and discover the latest business ideas.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Right Image with Green Background */}
              <motion.div
                className="order-2 lg:order-2 relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {/* Green Background */}
                <div className="absolute -bottom-6 -left-6 w-full h-full z-0" style={{ backgroundColor: '#a5cd39' }}></div>

                {/* Image Container */}
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                  <Image
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Country Pavilion Exhibition Booth"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Showcase Section with Gray Background */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-base leading-relaxed text-justify text-gray-700">
                Ready to showcase your country&apos;s excellence on the world stage? Contact us today to discuss your requirements and see how
                we can help you make a lasting impact with our country pavilion exhibition stands in Dubai.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExceptionalDesignSection;
