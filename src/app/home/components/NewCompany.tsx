"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import ImageScrollGrid from "./ImageScrollGrid";

const NewCompany = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = React.useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          controls.start("visible");
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const lineVariants: Variants = {
    hidden: { width: 0 },
    visible: {
      width: "6rem",
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.05,
      backgroundColor: "#8aaa30",
      boxShadow: "0px 5px 15px rgba(165,205,57,0.4)",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
      },
    },
  };

  // We no longer need the imageVariants and images arrays as we're using the ImageScrollGrid component

  return (
    <section ref={ref} className="py-20 bg-white -mt-1 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            className="lg:w-1/2 lg:pr-16 mb-10 lg:mb-0"
            initial="hidden"
            animate={controls}
            variants={containerVariants}
          >
            <motion.div variants={titleVariants} className="mb-4">
              <h2 className="text-3xl md:text-4xl font-bold inline-block">
                New Company{" "}
                <span className="font-normal text-gray-700">Formation</span>
              </h2>
              <motion.div
                className="h-1 bg-[#a5cd39] mt-2"
                variants={lineVariants}
              ></motion.div>
            </motion.div>

            <motion.p
              className="text-gray-700 mb-6"
              variants={textVariants}
            >
              Forming a new company has never been easier and can be done online from
              anywhere in the world using our simple eServices platform. If you are a
              startup or SME looking to gain traction in a highly competitive landscape, we
              offer a range of packages that can be customised to suit your specific needs.
            </motion.p>

            <motion.p
              className="text-gray-700 mb-8"
              variants={textVariants}
            >
              From determining your new company structure to defining different business
              activities or more regulated licenses and exploring the most cost-effective
              working environment for your operation, our free zone team is on hand to
              support you every step of the way for a hassle-free experience that gets you
              up and running without delay.
            </motion.p>

            <motion.button
              className="bg-[#a5cd39] text-white py-3 px-8 rounded-md font-medium"
              variants={buttonVariants}
              whileHover="hover"
            >
              LEARN MORE
            </motion.button>
          </motion.div>

          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ImageScrollGrid className="h-[550px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewCompany;
