"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const buildingImage = {
  src: "/images/home.jpg", // Using the existing image
  alt: "Dubai Business District",
};

const DynamicCell = () => {
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

  const imageVariants = {
    hidden: { scale: 1.05, opacity: 0.9 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  };

  return (
    <section className="relative bg-white overflow-hidden w-full h-screen" id="dynamic-central" ref={ref}>
      {/* Background Image - Full width and height, positioned behind content */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        variants={imageVariants}
        initial="hidden"
        animate={controls}
      >
        <Image
          src={buildingImage.src}
          alt={buildingImage.alt}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={100}
        />
      </motion.div>

      {/* Content overlay - Centered horizontally but at the top of the section */}
      <motion.div
        className="relative z-10 h-full w-full flex flex-col items-center justify-start text-center px-4 pt-32 md:pt-40"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="max-w-3xl mx-auto">
          {/* Title with exact styling from the image */}
          <motion.h2
            className="text-4xl sm:text-5xl font-rubik font-bold text-[#222] mb-4"
            variants={itemVariants}
          >
            <span className="text-[#222]">A Dynamic Central</span> Business District
          </motion.h2>

          {/* Green underline - matches the brand color */}
          <motion.div
            className="w-16 h-[3px] bg-[#a5cd39] mb-6 mx-auto"
            variants={itemVariants}
            whileHover={{ width: "120px", transition: { duration: 0.3 } }}
          />

          {/* Subtitle - Simple and clean as in the image */}
          <motion.p
            className="text-[#444] font-nunito text-lg"
            variants={itemVariants}
          >
            Dubai is the future economy and global trade gateway.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

export default DynamicCell;
