"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const BlogSubscription = () => {
    return (
        <section className="w-full bg-white py-8 md:py-12 lg:py-16">
            {/* Container with padding/margins from all sides */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Banner container with background image */}
                <div className="relative overflow-hidden rounded-lg md:rounded-xl">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                            alt="Hands typing on laptop - background"
                            fill
                            className="object-cover"
                        />
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 px-6 md:px-12 lg:px-16 py-12 md:py-16">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
                            {/* Left Content */}
                            <motion.div
                                className="flex-1 text-white"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                {/* Serif Heading */}
                                <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-normal mb-3 leading-tight text-white">
                                    Discover our selection of original
                                    <br />
                                    industry content
                                </h2>

                                {/* Sans-serif Subtext */}
                                <p className="font-sans text-xs md:text-sm uppercase tracking-wide text-gray-200 font-medium leading-relaxed">
                                    SIGN UP AND RECEIVE ARTICLES, FEATURES, INFOGRAPHICS AND VIDEOS
                                    <br />
                                    STRAIGHT TO YOUR INBOX
                                </p>
                            </motion.div>

                            {/* Right Button */}
                            <motion.div
                                className="flex-shrink-0"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <Button
                                    className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white px-6 py-3 text-sm font-bold uppercase tracking-wide rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap border-0"
                                    onClick={() => {
                                        // Handle subscription logic here
                                        console.log("Subscribe button clicked");
                                    }}
                                >
                                    SUBSCRIBE NOW
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSubscription;
