"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";

const AboutUsMain = () => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    React.useEffect(() => {
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

    return (
        <section
            ref={ref}
            className="pt-36 md:pt-48 lg:pt-56 pb-8 md:pb-12 lg:pb-16 bg-white overflow-hidden"
        >
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="relative"
                        variants={containerVariants}
                        initial="hidden"
                        animate={controls}
                    >
                        {/* Main content container */}
                        <motion.div
                            className="relative z-20 flex flex-wrap md:flex-nowrap gap-10 md:gap-16"
                            variants={itemVariants}
                        >
                            {/* Left side - Video with ESC INDIA text */}
                            <div className="relative ml-0 sm:ml-[-40px] md:ml-[-60px] lg:ml-[-80px] w-full md:w-[500px] lg:w-[550px]">
                                {/* Top left red box */}
                                <div className="absolute -left-16 -top-16 w-[270px] h-[240px] bg-[#a5cd39] z-0"></div>

                                {/* Video container */}
                                <div className="relative z-10">
                                    <div className="relative bg-black">
                                        {/* YouTube Video Embed */}
                                        <div className="relative w-full h-[340px] bg-black">
                                            <iframe
                                                src="https://www.youtube.com/embed/02tEkxgRE2c"
                                                title="ESC India Video"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="absolute inset-0 w-full h-full"
                                            ></iframe>
                                        </div>

                                        {/* ESC Logo overlay */}
                                        <div className="absolute top-6 right-6 z-20">
                                            <Image
                                                src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80"
                                                alt="ESC Logo"
                                                width={40}
                                                height={40}
                                                className="object-contain"
                                            />
                                        </div>

                                        {/* ESC INDIA text */}
                                        <div className="absolute left-0 bottom-0 z-20">
                                            <div className="flex flex-col">
                                                <div className="bg-transparent px-8 py-1">
                                                    <h3 className="text-white text-7xl font-bold leading-tight">
                                                        ESC
                                                    </h3>
                                                </div>
                                                <div className="bg-transparent px-8 py-1">
                                                    <h4 className="text-[#f0c419] text-6xl font-bold leading-tight">
                                                        INDIA
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom right yellow box */}
                                <div className="absolute -right-24 top-[200px] sm:top-[200px] md:top-[200px] lg:top-[200px] w-[280px] h-[180px] bg-[#f0c419] z-0"></div>
                            </div>

                            {/* Right side - Text content */}
                            <div className="w-full ml-0 sm:ml-[40px] md:ml-[60px] lg:ml-[80px] md:w-[500px] lg:w-[550px] pt-8 md:pt-0">
                                <motion.div variants={itemVariants}>
                                    <div className="text-[#a5cd39] uppercase tracking-wider mb-3 font-medium font-markazi">
                                        ABOUT US
                                    </div>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-rubik font-bold text-gray-900 mb-6 leading-tight">
                                        Electronics And Computer Software Export
                                        Promotion Council
                                    </h2>
                                </motion.div>

                                <motion.p
                                    className="text-gray-600 mb-6 leading-relaxed text-base font-nunito"
                                    variants={itemVariants}
                                >
                                    Electronics & Computer Software Export
                                    Promotion Council or ESC, is India&apos;s
                                    apex trade promotion organization mandated
                                    to promote international cooperation in the
                                    field of electronics, telecom, and IT.
                                    Established with the support of Ministry of
                                    Commerce in the year 1989, Council has over
                                    2300 members spread all over the country.
                                </motion.p>

                                <motion.div
                                    className="mt-8"
                                    variants={itemVariants}
                                >
                                    <a
                                        href="#"
                                        className="inline-block bg-[#a5cd39] text-white py-3 px-8 rounded-md hover:bg-[#8fb32e] transition-colors"
                                    >
                                        Official website
                                    </a>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsMain;
