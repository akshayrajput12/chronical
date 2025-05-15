'use client';

import React, { useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const ApplicationCta = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.6 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 md:py-20"
      style={{ backgroundColor: '#a5cd39' }}
    >
      {/* Wave-like background pattern */}
      <div className="absolute inset-0 z-0 opacity-30">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,32L48,53.3C96,75,192,117,288,122.7C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="#ffffff"
            fillOpacity="0.2"
          />
        </svg>
      </div>

      <div className="absolute inset-0 z-0 opacity-20">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: 'scaleX(-1)' }}
        >
          <path
            d="M0,96L48,106.7C96,117,192,139,288,149.3C384,160,480,160,576,138.7C672,117,768,75,864,64C960,53,1056,75,1152,96C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="#ffffff"
            fillOpacity="0.2"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:max-w-2xl">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white mb-4 text-center md:text-left"
                variants={itemVariants}
              >
                Start Your Application
              </motion.h2>

              <motion.p
                className="text-white text-base md:text-lg mb-2 text-center md:text-left"
                variants={itemVariants}
              >
                Take your first step in forming your new company today with our online application.
              </motion.p>

              <motion.p
                className="text-white text-base md:text-lg mb-8 md:mb-0 text-center md:text-left"
                variants={itemVariants}
              >
                Our Free Zone team are on hand to guide you through the application process.
              </motion.p>
            </div>

            <motion.div
              className="flex justify-center"
              variants={buttonVariants}
            >
              <motion.button
                className="bg-white text-[#a5cd39] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                GET STARTED
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ApplicationCta;
