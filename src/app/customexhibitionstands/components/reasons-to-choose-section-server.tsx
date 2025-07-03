"use client";

import React from "react";
import { motion } from "framer-motion";
import { CustomExhibitionReasonsToChoose } from "@/services/custom-exhibition-stands.service";

interface ReasonsToChooseSectionServerProps {
    reasonsToChooseData: CustomExhibitionReasonsToChoose | null;
}

const ReasonsToChooseSectionServer = ({ reasonsToChooseData }: ReasonsToChooseSectionServerProps) => {
    // Don't render if no data exists
    if (!reasonsToChooseData) {
        return null;
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center space-y-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="!text-3xl md:!text-4xl mx-auto !font-rubik !font-bold mb-4">
                            {reasonsToChooseData?.title}
                        </h2>
                        <div className="flex !mb-2 justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-4"></div>
                        </div>
                        <div className="space-y-6 text-gray-700 max-w-5xl mx-auto">
                            <p className="text-base sm:text-lg leading-relaxed text-justify">
                                {reasonsToChooseData?.paragraph_1}
                            </p>

                            <p className="text-base sm:text-lg leading-relaxed text-justify">
                                {reasonsToChooseData?.paragraph_2}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ReasonsToChooseSectionServer;
