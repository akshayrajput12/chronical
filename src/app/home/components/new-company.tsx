"use client";

import React, { useEffect, useRef } from "react";
import { Easing, motion, useAnimation, Variants } from "framer-motion";
import ImageScrollGrid from "./image-scroll-grid";
import { AnimationGeneratorType } from "framer-motion";
import Link from "next/link";
import { NewCompanySection, NewCompanyImage } from "@/types/new-company";

interface NewCompanyProps {
    newCompanyData: NewCompanySection | null;
    newCompanyImages: Record<number, NewCompanyImage[]>;
}

const NewCompany: React.FC<NewCompanyProps> = ({
    newCompanyData,
    newCompanyImages,
}) => {
    const controls = useAnimation();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!newCompanyData) return;

        const element = ref.current;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        element?.classList.add("animate-in");
                        controls.start("visible");
                    }
                });
            },
            { threshold: 0.2 },
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [controls, newCompanyData]);

    // Handle case where no data is provided
    if (!newCompanyData) {
        return (
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600">
                        New company section data is not available.
                    </p>
                </div>
            </div>
        );
    }

    const sectionData = newCompanyData;
    const images = newCompanyImages;

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
                ease: "easeOut" as Easing | Easing[] | undefined,
            },
        },
    };

    const lineVariants: Variants = {
        hidden: { width: 0 },
        visible: {
            width: "6rem",
            transition: {
                duration: 0.8,
                ease: "easeOut" as Easing | Easing[] | undefined,
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
                ease: "easeOut" as Easing | Easing[] | undefined,
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
                ease: "easeOut" as Easing | Easing[] | undefined,
                delay: 0.2,
            },
        },
        hover: {
            scale: 1.05,
            backgroundColor: "#8aaa30",
            boxShadow: "0px 5px 15px rgba(165,205,57,0.4)",
            transition: {
                duration: 0.3,
                type: "spring" as AnimationGeneratorType | undefined,
                stiffness: 300,
            },
        },
    };

    // We no longer need the imageVariants and images arrays as we're using the ImageScrollGrid component

    // If no data is found, use default content
    if (!sectionData) {
        console.warn(
            "No new company section data found, using default content",
        );
        return (
            <section
                ref={ref}
                className="py-20 bg-white -mt-1 overflow-hidden"
                id="new-company"
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <motion.div
                            className="lg:w-1/2 lg:pr-16 mb-10 lg:mb-0"
                            initial="hidden"
                            animate={controls}
                            variants={containerVariants}
                        >
                            <motion.div
                                variants={titleVariants}
                                className="mb-4"
                            >
                                <h2 className="text-3xl md:text-4xl font-rubik font-bold inline-block">
                                    New Company{" "}
                                    <span className="font-markazi font-normal text-gray-700">
                                        Formation
                                    </span>
                                </h2>
                                <motion.div
                                    className="h-1 mx-auto bg-[#a5cd39] mt-2"
                                    variants={lineVariants}
                                ></motion.div>
                            </motion.div>

                            <motion.p
                                className="text-gray-700 font-nunito mb-6"
                                variants={textVariants}
                            >
                                Forming a new company has never been easier and
                                can be done online from anywhere in the world
                                using our simple eServices platform. If you are
                                a startup or SME looking to gain traction in a
                                highly competitive landscape, we offer a range
                                of packages that can be customised to suit your
                                specific needs.
                            </motion.p>

                            <motion.p
                                className="text-gray-700 font-nunito mb-8"
                                variants={textVariants}
                            >
                                From determining your new company structure to
                                defining different business activities or more
                                regulated licenses and exploring the most
                                cost-effective working environment for your
                                operation, our free zone team is on hand to
                                support you every step of the way for a
                                hassle-free experience that gets you up and
                                running without delay.
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
                            <ImageScrollGrid className="h-[400px] sm:h-[550px]" />
                        </motion.div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={ref}
            className="bg-white overflow-hidden"
            id="new-company"
        >
            <div className="lg:pl-48 lg:px-0 px-0 w-full">
                <div className="flex flex-col lg:flex-row w-full items-center justify-between">
                    <motion.div
                        className="lg:w-[45%] lg:px-0 px-6 mt-4 lg:pr-12 mb-0"
                        initial="hidden"
                        animate={controls}
                        variants={containerVariants}
                    >
                        <motion.div
                            variants={titleVariants}
                            className="mb-4 w-full"
                        >
                            <h2 className="text-3xl md:text-4xl font-rubik font-bold inline-block">
                                {sectionData.title}{" "}
                                <span className="font-markazi font-normal text-gray-700">
                                    {sectionData.subtitle}
                                </span>
                            </h2>
                            <motion.div
                                className="h-1 bg-[#a5cd39] mt-2"
                                variants={lineVariants}
                            ></motion.div>
                        </motion.div>

                        <motion.p
                            className="text-gray-700 font-noto-kufi-arabic text-sm mb-6 leading-[24px]"
                            variants={textVariants}
                        >
                            {sectionData.description_1}
                        </motion.p>

                        <motion.p
                            className="text-gray-700 font-noto-kufi-arabic text-sm mb-8 leading-[24px]"
                            variants={textVariants}
                        >
                            {sectionData.description_2}
                        </motion.p>

                        <Link href={sectionData.button_url}>
                            <motion.button
                                className="bg-[#a5cd39] text-white px-6 py-2 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 font-noto-kufi-arabic text-sm"
                                variants={buttonVariants}
                                whileHover="hover"
                            >
                                {sectionData.button_text}
                            </motion.button>
                        </Link>
                    </motion.div>

                    <motion.div
                        className="w-full lg:w-[45%] mt-10 lg:mt-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <ImageScrollGrid
                            className="h-[400px] sm:h-[550px] 2xl:h-[600px]"
                            columnImages={images}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default NewCompany;
