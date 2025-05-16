'use client';

import React, { useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Image from 'next/image';

const AboutUsDescription = () => {
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



  const services = [
    {
      icon: "/icons/code.svg",
      title: "Customised Software Development",
      description: ""
    },
    {
      icon: "/icons/computer.svg",
      title: "Software Products",
      description: ""
    },
    {
      icon: "/icons/gear.svg",
      title: "IT Enabled Services",
      description: ""
    }
  ];

  return (
    <section
      ref={ref}
      className="py-16 bg-[#f9f7f7]"
      aria-label="About ESC Services"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Main description text */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ESC has emerged as a prime institution spearheading interest of Electronics and IT industry in the country. The Council proactively engages with the Government, both at the Centre and in States, to create a policy and regulatory environment conducive to growth of industry. Council also works in close coordination with India&apos;s Diplomatic Missions in various countries and Missions of various countries in India. ESC has an extensive network of like-minded organizations world over that helps in linking member companies with their counterparts in these economies. Significantly, ESC acts as the implementing agency for Government schemes to promote electronics and IT exports from India. Sectors covered by the Council include:
            </motion.p>
            <motion.h2
              className="text-3xl font-serif text-gray-900 mb-10 relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Computer Software and ITES:
              <motion.span
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-[#a5cd39] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "50%" }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </motion.h2>
          </motion.div>

          {/* Services grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 text-center rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#a5cd39]/30 group"
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }}
              >
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-[#f9f7f7] rounded-full p-3 group-hover:bg-[#a5cd39]/10 transition-colors duration-300">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={48}
                      height={48}
                      className="object-contain"
                      loading="lazy"
                      priority={false}
                    />
                  </div>
                </motion.div>
                <h3 className="text-xl font-medium text-gray-900 group-hover:text-[#a5cd39] transition-colors duration-300">{service.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUsDescription;
