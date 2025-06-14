"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, Variants } from "framer-motion";

const SetupProcess = () => {
    const controls = useAnimation();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        element?.classList.add("animate-in");
                        controls.start("visible"); // Start the animations when component is in view
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

    const underlineVariants: Variants = {
        hidden: { width: 0 },
        visible: {
            width: "100px",
            transition: {
                duration: 0.8,
                ease: "easeOut",
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

    const stepVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: i => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: i * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
            },
        }),
    };

    const diamondVariants: Variants = {
        hidden: { opacity: 0, scale: 0 },
        visible: i => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: i * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 10,
            },
        }),
        hover: {
            scale: 1.1,
            boxShadow: "0px 0px 12px rgba(165,205,57,0.7)",
            transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 300,
            },
        },
    };

    const circleVariants: Variants = {
        hidden: { opacity: 0, scale: 0 },
        visible: i => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: i * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 10,
            },
        }),
        hover: {
            scale: 1.1,
            boxShadow: "0px 0px 12px rgba(255,255,255,0.7)",
            transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 300,
            },
        },
    };

    const steps = [
        { id: 1, title: "Determine Company Type", type: "diamond" },
        {
            id: 2,
            title: "Select Business Activity & License Type",
            type: "diamond",
        },
        { id: 3, title: "Consider Your Office Solutions", type: "diamond" },
        { id: 4, title: "Submit Your Application", type: "circle" },
        { id: 5, title: "Receive Initial Approval", type: "circle" },
    ];

    return (
        <section
            ref={ref}
            className="relative py-16 md:py-20 text-white bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage:
                    'linear-gradient(rgba(44, 44, 44, 0.9), rgba(44, 44, 44, 0.9)), url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80")',
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-12"
                    initial="hidden"
                    animate={controls}
                    variants={containerVariants}
                >
                    <motion.h2
                        className="text-3xl md:text-4xl font-rubik font-bold mb-2"
                        variants={titleVariants}
                    >
                        Setting Up Your Business
                    </motion.h2>
                    <div className="flex justify-center">
                        <motion.div
                            className="h-1 bg-[#a5cd39] mt-2 mb-6"
                            variants={underlineVariants}
                        ></motion.div>
                    </div>
                    <motion.p
                        className="text-gray-300 font-markazi-text text-2xl max-w-2xl mx-auto"
                        variants={textVariants}
                    >
                        Form a new company with quick and easy steps via our
                        eServices platform.
                    </motion.p>
                </motion.div>

                <div className="flex flex-col justify-center items-center mt-12">
                    <motion.div
                        className="flex flex-col md:flex-row items-center justify-center w-full"
                        initial="hidden"
                        animate={controls}
                        variants={containerVariants}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-center border-b md:border-b-0 md:border-r border-gray-600 pb-4 md:pb-0 md:pr-8 w-full">
                                    <div className="relative mb-6">
                                        <div className="border-t-2 border-gray-400 absolute w-24 top-1/2 left-32"></div>
                                        <p className="text-xl font-markazi-text font-medium mx-auto px-4 inline-block">
                                            How To Apply
                                        </p>
                                        <div className="border-t-2 border-gray-400 absolute w-24 top-1/2 right-32"></div>
                                    </div>
                                    <div className="flex flex-row md:flex-row justify-center space-x-4 md:space-x-6 lg:space-x-10">
                                        {steps
                                            .slice(0, 3)
                                            .map((step, index) => (
                                                <motion.div
                                                    key={step.id}
                                                    className="flex flex-col items-center"
                                                    custom={index}
                                                    variants={stepVariants}
                                                >
                                                    <motion.div
                                                        className="w-12 h-12  bg-[#a5cd39] flex items-center justify-center text-white font-medium text-xl md:text-2xl transform rotate-45 mb-5 shadow-md"
                                                        custom={index}
                                                        variants={
                                                            diamondVariants
                                                        }
                                                        whileHover={"hover"}
                                                    >
                                                        <span
                                                            style={{
                                                                transform:
                                                                    "rotate(-45deg)",
                                                            }}
                                                        >
                                                            {step.id}
                                                        </span>
                                                    </motion.div>
                                                    <p className="text-xs md:text-sm font-noto-kufi-arabic max-w-[80px] md:max-w-[120px] text-center">
                                                        {step.title}
                                                    </p>
                                                </motion.div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center md:pl-8">
                                <div className="relative mb-6">
                                    <div className="border-t-2 border-gray-400 absolute w-24 top-1/2 left-32"></div>
                                    <p className="text-xl font-markazi-text font-medium mx-auto px-4 inline-block">
                                        Getting Started
                                    </p>
                                    <div className="border-t-2 border-gray-400 absolute w-24 top-1/2 right-32"></div>
                                </div>
                                <div className="flex flex-row md:flex-row justify-center space-x-4 md:space-x-6 lg:space-x-10">
                                    {steps.slice(3).map((step, index) => (
                                        <motion.div
                                            key={step.id}
                                            className="flex flex-col items-center"
                                            custom={index + 4}
                                            variants={stepVariants}
                                        >
                                            <motion.div
                                                className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-[#2C2C2C] font-bold text-xl md:text-2xl mb-5 shadow-md"
                                                custom={index + 4}
                                                variants={circleVariants}
                                                whileHover="hover"
                                            >
                                                <span>{step.id}</span>
                                            </motion.div>
                                            <p className="text-xs md:text-sm font-noto-kufi-arabic max-w-[80px] md:max-w-[120px] text-center">
                                                {step.title}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SetupProcess;
