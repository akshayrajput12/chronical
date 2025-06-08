"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import ImageScrollGrid from "./image-scroll-grid";
import Link from "next/link";
import { NewCompanyService } from "@/services/new-company.service";
import { NewCompanySection, NewCompanyImage } from "@/types/new-company";

const NewCompany = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [sectionData, setSectionData] = useState<NewCompanySection | null>(null);
  const [images, setImages] = useState<Record<number, NewCompanyImage[]>>({});
  const [loading, setLoading] = useState(true);

  // Fetch section data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching new company section data...');
        const data = await NewCompanyService.getNewCompanySection();
        if (data) {
          console.log('New company section data received:', data);
          setSectionData(data);

          console.log('Fetching new company images...');
          const imagesData = await NewCompanyService.getNewCompanyImagesByColumn(data.id);
          console.log('New company images received:', imagesData);
          setImages(imagesData);
        } else {
          console.error('No new company section data found');
        }
      } catch (error) {
        console.error('Error fetching new company data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const element = ref.current;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          element?.classList.add('animate-in');
          controls.start("visible");
        }
      });
    }, { threshold: 0.2 });

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
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

  // Show loading state or fallback to default content
  if (loading) {
    return (
      <section ref={ref} className="py-20 bg-white -mt-1 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 lg:pr-16 mb-10 lg:mb-0">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-1 bg-gray-200 w-24 mt-2 mb-6"></div>
                <div className="h-24 bg-gray-200 rounded mb-6"></div>
                <div className="h-24 bg-gray-200 rounded mb-8"></div>
                <div className="h-10 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="animate-pulse grid grid-cols-3 gap-4 h-[550px]">
                {[1, 2, 3].map(col => (
                  <div key={col} className="space-y-4">
                    {[1, 2, 3, 4].map(row => (
                      <div key={`${col}-${row}`} className="h-[200px] bg-gray-200 rounded-md"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no data is found, use default content
  if (!sectionData) {
    console.warn('No new company section data found, using default content');
    return (
      <section ref={ref} className="py-20 bg-white -mt-1 overflow-hidden" id="new-company">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <motion.div
              className="lg:w-1/2 lg:pr-16 mb-10 lg:mb-0"
              initial="hidden"
              animate={controls}
              variants={containerVariants}
            >
              <motion.div variants={titleVariants} className="mb-4">
                <h2 className="text-3xl md:text-4xl font-rubik font-bold inline-block">
                  New Company{" "}
                  <span className="font-markazi font-normal text-gray-700">Formation</span>
                </h2>
                <motion.div
                  className="h-1 bg-[#a5cd39] mt-2"
                  variants={lineVariants}
                ></motion.div>
              </motion.div>

              <motion.p
                className="text-gray-700 font-nunito mb-6"
                variants={textVariants}
              >
                Forming a new company has never been easier and can be done online from
                anywhere in the world using our simple eServices platform. If you are a
                startup or SME looking to gain traction in a highly competitive landscape, we
                offer a range of packages that can be customised to suit your specific needs.
              </motion.p>

              <motion.p
                className="text-gray-700 font-nunito mb-8"
                variants={textVariants}
              >
                From determining your new company structure to defining different business
                activities or more regulated licenses and exploring the most cost-effective
                working environment for your operation, our free zone team is on hand to
                support you every step of the way for a hassle-free experience that gets you
                up and running without delay.
              </motion.p>

              <Link href="/services/company-formation">
                <motion.button
                  className="bg-[#a5cd39] text-white py-3 px-8 rounded-md font-medium"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  LEARN MORE
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="w-full lg:w-1/2 mt-10 lg:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <ImageScrollGrid
                className="h-[400px] sm:h-[550px]"
              />
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-20 bg-white -mt-1 overflow-hidden" id="new-company">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            className="lg:w-1/2 lg:pr-16 mb-10 lg:mb-0"
            initial="hidden"
            animate={controls}
            variants={containerVariants}
          >
            <motion.div variants={titleVariants} className="mb-4">
              <h2 className="text-3xl md:text-4xl font-rubik font-bold inline-block">
                {sectionData.title}{" "}
                <span className="font-markazi font-normal text-gray-700">{sectionData.subtitle}</span>
              </h2>
              <motion.div
                className="h-1 bg-[#a5cd39] mt-2"
                variants={lineVariants}
              ></motion.div>
            </motion.div>

            <motion.p
              className="text-gray-700 font-noto-kufi-arabic mb-6"
              variants={textVariants}
            >
              {sectionData.description_1}
            </motion.p>

            <motion.p
              className="text-gray-700 font-noto-kufi-arabic mb-8"
              variants={textVariants}
            >
              {sectionData.description_2}
            </motion.p>

            <Link href={sectionData.button_url}>
              <motion.button
                className="bg-[#a5cd39] text-white py-3 px-8 rounded-md font-medium"
                variants={buttonVariants}
                whileHover="hover"
              >
                {sectionData.button_text}
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 mt-10 lg:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ImageScrollGrid
              className="h-[400px] sm:h-[550px]"
              columnImages={images}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewCompany;
