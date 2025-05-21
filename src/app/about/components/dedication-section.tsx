'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  index: number;
}

const DedicationSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

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

  const features = [
    {
      title: "INNOVATION",
      description: "At Chronicle Exhibits, we believe in pushing the boundaries of creativity and technology to design trade show booths that captivate and inspire. Our commitment to innovation ensures that we deliver cutting-edge solutions tailored to our clients' unique needs.",
      image: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "QUALITY",
      description: "Quality is at the heart of everything we do. From the materials we choose to the craftsmanship we employ, Chronicle Exhibits is dedicated to delivering exceptional booths that stand the test of time and make a lasting impression.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "CUSTOMER FOCUS",
      description: "Our clients are our top priority. We work closely with each client to understand their vision and objectives, ensuring that every booth we create not only meets but exceeds their expectations. Your success is our success.",
      image: "https://images.unsplash.com/photo-1599642080669-0e7eaa5a2e18?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "SUSTAINABILITY",
      description: "We are committed to environmentally responsible practices. Chronicle Exhibits strives to minimize our ecological footprint by using sustainable materials and processes, contributing to a greener future for the trade show industry.",
      image: "https://images.unsplash.com/photo-1582037928769-351659e8b8ba?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "COLLABORATION",
      description: "Teamwork and collaboration are essential to our process. By fostering a collaborative environment, we harness the diverse talents of our team to deliver exceptional results for our clients.",
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1470&auto=format&fit=crop"
    }
  ];

  return (
    <section
      ref={ref}
      className="py-16 bg-white text-black overflow-hidden relative"
      aria-label="Our Core Values"
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Section Title */}
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#333333]">
              DEDICATION TO QUALITY AND PRECISION
            </h2>
          </motion.div>

          {/* Top Row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {features.slice(0, 3).map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                index={index}
              />
            ))}
          </div>

          {/* Bottom Row - 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
            {features.slice(3, 5).map((feature, index) => (
              <FeatureCard
                key={index + 3}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                index={index + 3}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, description, image, index }: FeatureCardProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="flex flex-col h-full group border border-transparent hover:border-[#a5cd39] p-3 rounded-sm transition-all duration-300"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden mb-3 rounded-sm shadow-sm group-hover:shadow-md transition-all duration-300">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-0">
        <h3 className="text-base font-bold mb-2 text-[#a5cd39]">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default DedicationSection;
