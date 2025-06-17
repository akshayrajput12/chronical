"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const CustomExhibitionHero = () => {
    return (
        <section className="relative h-[80vh] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Custom Exhibition Stands"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-6 uppercase tracking-wide leading-tight">
                                CUSTOM EXHIBITION STANDS
                            </h1>
                            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-markazi-text tracking-wide">
                                Increase the value of your brand with Chronicle
                                Exhibition Organizing LLC, the leading source
                                for custom-designed exhibit stand solutions in
                                the UAE. We create visually compelling
                                exhibition displays. Our team of skilled
                                designers work to custom exhibition stands that
                                transform your appearance at exhibitions.
                            </h3>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomExhibitionHero;
