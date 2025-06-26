"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence, Easing } from "framer-motion";

interface InitialLoaderProps {
    isVisible: boolean;
}

const InitialLoader: React.FC<InitialLoaderProps> = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeOut" as Easing | Easing[] | undefined,
                    }}
                >
                    {/* Simple animated logo */}
                    <motion.div
                        className="relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut" as Easing | Easing[] | undefined,
                        }}
                    >
                        {/* Subtle spinning ring */}
                        <motion.div
                            className="absolute inset-0 -m-4 w-24 h-24 border-2 border-transparent border-t-[#a5cd39] rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />

                        {/* Logo with gentle pulse */}
                        <motion.div
                            className="relative z-10 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden"
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Image
                                src="/logo.png"
                                alt="Chronicle Exhibits"
                                width={48}
                                height={18}
                                className="h-auto w-auto max-w-[48px]"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InitialLoader;
