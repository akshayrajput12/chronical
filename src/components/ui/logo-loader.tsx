"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LogoLoaderProps {
    isVisible: boolean;
    message?: string;
}

const LogoLoader: React.FC<LogoLoaderProps> = ({
    isVisible,
    message = "Loading...",
}) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="loader-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-col items-center justify-center space-y-8">
                        {/* Logo with multiple animations */}
                        <motion.div
                            className="relative"
                            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            transition={{
                                duration: 1.2,
                                ease: "easeOut",
                                delay: 0.2,
                            }}
                        >
                            {/* Outer spinning ring */}
                            <div className="absolute inset-0 -m-12">
                                <div className="w-full h-full border-2 border-transparent border-t-[#a5cd39] border-r-[#a5cd39] rounded-full spinner-ring opacity-60"></div>
                            </div>

                            {/* Inner spinning ring (opposite direction) */}
                            <motion.div
                                className="absolute inset-0 -m-8 border-3 border-transparent border-b-[#8bb32f] border-l-[#8bb32f] rounded-full"
                                animate={{ rotate: -360 }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />

                            {/* Pulsing ring */}
                            <motion.div
                                className="absolute inset-0 -m-6 border-2 border-[#a5cd39] rounded-full opacity-30"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.1, 0.3],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* Secondary pulsing ring */}
                            <motion.div
                                className="absolute inset-0 -m-4 border border-[#a5cd39] rounded-full opacity-20"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.2, 0.05, 0.2],
                                }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5,
                                }}
                            />

                            {/* Logo with enhanced animations */}
                            <motion.div
                                className="relative z-10 logo-pulse logo-float logo-glow"
                                whileHover={{ scale: 1.05 }}
                                animate={{
                                    filter: [
                                        "drop-shadow(0 0 5px rgba(165, 205, 57, 0.3))",
                                        "drop-shadow(0 0 25px rgba(165, 205, 57, 0.6))",
                                        "drop-shadow(0 0 5px rgba(165, 205, 57, 0.3))",
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Image
                                    src="/logo.png"
                                    alt="Chronicle Exhibits Logo"
                                    width={200}
                                    height={80}
                                    className="h-auto w-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px]"
                                    priority
                                />
                            </motion.div>
                        </motion.div>

                        {/* Loading text */}
                        <motion.div
                            className="text-center space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.5,
                            }}
                        >
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 font-rubik">
                                {message}
                            </h2>

                            {/* Animated dots */}
                            <div className="flex justify-center space-x-1">
                                {[0, 1, 2].map(index => (
                                    <motion.div
                                        key={index}
                                        className="w-2 h-2 bg-[#a5cd39] rounded-full"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: index * 0.2,
                                            ease: "easeInOut",
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* Enhanced Progress bar */}
                        <motion.div
                            className="w-64 sm:w-80 relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.8,
                            }}
                        >
                            {/* Progress bar background */}
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#a5cd39] via-[#b8d946] to-[#8bb32f] rounded-full relative"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    {/* Shimmer effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    />
                                </motion.div>
                            </div>

                            {/* Progress percentage text */}
                            <motion.div
                                className="text-center mt-2 text-sm text-gray-500 font-medium"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                Loading...
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LogoLoader;
