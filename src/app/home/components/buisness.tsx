'use client';
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const data = {
  heading: "A progressive business hub",
  subheading: "where companies can thrive",
  description: [
    "Dubai World Trade Centre stands at the centre of commerce, laying the foundation for Dubai's ascent as a global hub and future economy enabler. We are your business gateway to the region, and beyond.",
    "A highly sought-after global business address and a vibrant destination, featuring premium commercial offices, co-working communities, the region's leading exhibition and convention centre, in addition to hospitality and retail options Dubai World Trade Centre is where the world comes to meet and do business.",
    "With attractive benefits, facilities and tailored services for companies looking to shape the future of business, we offer a well-regulated and supportive environment, empowering startups, SMEs and multinationals to succeed.",
  ],
  stats: [
    {
      value: 2000,
      label: "Companies",
      sublabel: "AND GROWING",
    },
    {
      value: 40,
      label: "Industries",
      sublabel: "REPRESENTED",
    },
    {
      value: 2000000,
      label: "Sq Ft.",
      sublabel: "OF PREMIUM OFFICE SPACE",
    },
  ],
};

const AnimatedNumber = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(countRef, { once: false, amount: 0.3 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      ref.current = 0;
      setCount(0);

      const duration = 2000; // Longer duration for more dramatic effect
      const stepTime = 20;
      const totalSteps = duration / stepTime;

      // Use easeOutQuad easing function for a more natural counting effect
      const easeOutQuad = (t: number) => t * (2 - t);

      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        const easedProgress = easeOutQuad(progress);
        const nextValue = Math.min(value * easedProgress, value);

        ref.current = nextValue;
        setCount(Math.floor(nextValue));

        if (step >= totalSteps) {
          ref.current = value;
          setCount(value);
          clearInterval(interval);
        }
      }, stepTime);

      return () => clearInterval(interval);
    }
  }, [isInView, value, hasAnimated]);

  // Reset animation when scrolling back into view
  useEffect(() => {
    if (!isInView) {
      setHasAnimated(false);
    }
  }, [isInView]);

  // Format the number differently based on its value
  if (value >= 1000000) {
    // For 2M+ format
    return (
      <div ref={countRef} className="inline-block">
        {(count / 1000000).toFixed(1)}
        <span className="text-3xl align-top ml-1">M</span>
      </div>
    );
  } else if (value >= 1000) {
    // For 2,000+ format
    return <div ref={countRef}>{count.toLocaleString()}</div>;
  } else {
    // For 40+ format
    return <div ref={countRef}>{count}</div>;
  }
};

const BusinessHubSection = () => {
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

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.3 + (i * 0.2),
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <section className="bg-white py-20 px-4 md:px-20 relative overflow-hidden" ref={ref}>

      <motion.div
        className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Headings */}
        <motion.div variants={itemVariants} className="max-w-md">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-[#222] leading-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="text-[#222] block"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              A progressive business hub
            </motion.span>
          </motion.h2>
          <motion.div
            className="text-2xl md:text-3xl text-[#333] font-medium mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {data.subheading}
          </motion.div>
          <motion.div
            className="w-24 h-[3px] bg-[#a5cd39] mt-6"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ width: "12rem", transition: { duration: 0.3 } }}
          />
        </motion.div>

        {/* Paragraphs */}
        <motion.div
          className="text-[#444] text-base md:text-lg space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {data.description.map((para, idx) => (
            <motion.p
              key={idx}
              variants={itemVariants}
              custom={idx}
              whileHover={{ x: 5, color: "#222" }}
              transition={{ duration: 0.2 }}
              className="leading-relaxed"
            >
              {para}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>

      {/* Stats */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 border-t border-gray-200 pt-16">
        {data.stats.map((stat, idx) => (
          <motion.div
            key={idx}
            custom={idx}
            variants={statVariants}
            initial="hidden"
            animate={controls}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            className="flex flex-col items-center text-center"
          >
            {/* Stat number with animation */}
            <motion.div
              className="text-5xl md:text-6xl font-extrabold text-[#a5cd39] leading-none"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AnimatedNumber value={stat.value} />
            </motion.div>

            {/* Label */}
            <motion.div
              className="text-xl md:text-2xl font-medium text-[#333] mt-2"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {stat.label}
            </motion.div>

            {/* Sublabel */}
            <motion.div
              className="text-sm text-[#666] uppercase tracking-wide mt-1"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {stat.sublabel}
            </motion.div>

            {/* Decorative line */}
            <motion.div
              className="w-12 h-[2px] bg-gray-200 mt-4"
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ duration: 0.8, delay: 0.6 + (idx * 0.2) }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BusinessHubSection;
