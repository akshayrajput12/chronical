"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CustomExhibitionStrikingCustomized } from "@/services/custom-exhibition-stands.service";

interface StrikingCustomizedSectionServerProps {
    strikingCustomizedData: CustomExhibitionStrikingCustomized | null;
}

const StrikingCustomizedSectionServer = ({ strikingCustomizedData }: StrikingCustomizedSectionServerProps) => {
    // Don't render if no data exists
    if (!strikingCustomizedData) {
        return null;
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Left Image with Colored Background */}
                        <motion.div
                            className="order-1 lg:order-1 relative"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div
                                className="absolute -bottom-6 -left-6 w-full h-full z-0"
                                style={{ backgroundColor: "#a5cd39" }}
                            ></div>

                            {/* Image Container */}
                            {strikingCustomizedData?.image_url && (
                                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                                    <Image
                                        src={strikingCustomizedData.image_url}
                                        alt={strikingCustomizedData.image_alt || 'Striking customized exhibition stands'}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                        </motion.div>

                        {/* Right Content */}
                        <motion.div
                            className="order-2 lg:order-2"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-6">
                                <h3 className="!text-3xl md:!text-4xl !font-rubik text-center !font-bold mb-2">
                                    {strikingCustomizedData?.title}
                                </h3>
                                <div className="flex !mb-3 justify-center">
                                    <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-0"></div>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <p className="text-base leading-relaxed text-justify">
                                        {strikingCustomizedData?.paragraph_1}
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        {strikingCustomizedData?.paragraph_2}
                                    </p>


                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StrikingCustomizedSectionServer;
