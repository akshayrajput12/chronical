"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const WhySection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="relative overflow-hidden w-full py-20 -mt-40 z-10" id="why-section" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Main content container */}
        <motion.div
          className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-10 md:p-16"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Heading */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.h2
              className="text-4xl sm:text-5xl font-bold text-[#222] mb-4"
              variants={itemVariants}
            >
              Why <span className="text-[#222]">DWTC</span> Free Zone
            </motion.h2>

            {/* Red underline - matches the image */}
            <motion.div
              className="w-16 h-[3px] bg-[#E04163] mb-8 mx-auto"
              variants={itemVariants}
              whileHover={{ width: "120px", transition: { duration: 0.3 } }}
            />

            {/* Subtitle */}
            <motion.p
              className="text-[#444] text-lg max-w-3xl mx-auto mb-16"
              variants={itemVariants}
            >
              Building on a 45 year legacy, DWTC Free Zone connects businesses and communities
              propelling their potential for success.
            </motion.p>
          </motion.div>

          {/* Two-column content */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 md:gap-16"
            variants={containerVariants}
          >
            {/* Left column */}
            <motion.div variants={itemVariants}>
              <p className="text-[#444] mb-6 leading-relaxed">
                DWTC Free Zone provides a unique and highly desirable
                proposition for businesses seeking a competitive and well-
                regulated ecosystem to operate in regional and global
                markets. Offering a range of benefits such as 100% foreign
                ownership, 0% taxes and customs duties, and streamlined
                procedures for visas and permits, the DWTC free zone is a
                future-focused ecosystem designed for transformative
                business growth.
              </p>

              <p className="text-[#444] leading-relaxed">
                We are a progressive and welcoming free zone, open to all
                businesses. Anchored by world-class infrastructure and
                flexible company formation, licensing and setup solutions,
                DWTC Free Zone offers an ideal environment, nurturing a
                sustainable economy from Dubai.
              </p>
            </motion.div>

            {/* Right column */}
            <motion.div variants={itemVariants}>
              <p className="text-[#444] mb-6 leading-relaxed">
                Spanning from the iconic Sheikh Rashid Tower to the
                neighboring One Central, DWTC Free Zone offers a diverse
                range of 1,200+ licensed business activities and is home to
                more than 1,800 small and medium businesses.
              </p>

              {/* Image with text overlay */}
              <motion.div
                className="relative mt-8 h-64 overflow-hidden rounded-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/images/office-space.jpg"
                  alt="Premium Commercial Offices"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000cc] to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-3xl font-bold mb-1">2 MILLION+ SQ FT. OF</h3>
                    <p className="text-2xl font-bold">PREMIUM COMMERCIAL OFFICES</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhySection;
