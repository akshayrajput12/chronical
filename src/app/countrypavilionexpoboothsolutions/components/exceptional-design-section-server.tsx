"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExpoPavilionExceptionalDesign, DesignBenefit } from "@/services/country-pavilion-page.service";
import { RequestQuotationDialog } from "@/components/ui/request-quotation-dialog";

interface ExceptionalDesignSectionServerProps {
    exceptionalDesignData: ExpoPavilionExceptionalDesign | null;
    designBenefitsData: DesignBenefit[];
}

const ExceptionalDesignSectionServer = ({ 
    exceptionalDesignData, 
    designBenefitsData 
}: ExceptionalDesignSectionServerProps) => {
    // Don't render if no data exists
    if (!exceptionalDesignData) {
        return null;
    }

    const buttonVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 0.8,
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
            },
        },
        tap: {
            scale: 0.95,
        },
    };

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Left Content */}
                        <motion.div
                            className="order-2 lg:order-1"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-4xl text-center font-rubik font-bold mb-2">
                                    {exceptionalDesignData.title}
                                </h2>
                                <div className="flex !mb-1 justify-center">
                                    <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                                </div>
                                <div className="space-y-4 !mt-0 text-gray-700">
                                    <p className="text-base leading-relaxed text-justify">
                                        {exceptionalDesignData.paragraph_1
                                            .split("Country Pavilion Expo Booth")
                                            .map((part, index, array) => (
                                                <React.Fragment key={index}>
                                                    {part}
                                                    {index < array.length - 1 && (
                                                        <span className="text-[#a5cd39] font-medium">
                                                            Country Pavilion Expo Booth
                                                        </span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        {exceptionalDesignData.paragraph_2
                                            .split("quickly look into its pros")
                                            .map((part, index, array) => (
                                                <React.Fragment key={index}>
                                                    {part}
                                                    {index < array.length - 1 && (
                                                        <span className="text-[#a5cd39] font-medium">
                                                            quickly look into its pros
                                                        </span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                    </p>

                                    <ul className="space-y-3 ml-6">
                                        {designBenefitsData.map(benefit => (
                                            <li key={benefit.id} className="flex items-start">
                                                <span className="text-[#a5cd39] mr-2 mt-1">•</span>
                                                <div>
                                                    <span className="font-medium text-gray-900">
                                                        {benefit.title}:
                                                    </span>
                                                    <span className="text-gray-700 ml-1">
                                                        {benefit.description}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-base leading-relaxed text-justify">
                                        {exceptionalDesignData.paragraph_3}
                                    </p>

                                    <Link href={exceptionalDesignData.cta_url || "#"}>
                                        <RequestQuotationDialog
                                            trigger={
                                                <motion.button
                                                    className="bg-[#a5cd39] text-white px-6 py-2 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 font-noto-kufi-arabic text-sm"
                                                    variants={buttonVariants}
                                                    initial="hidden"
                                                    whileInView="visible"
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                    viewport={{ once: true }}
                                                    type="button"
                                                >
                                                    {exceptionalDesignData.cta_text || "Request Quotation"}
                                                </motion.button>
                                            }
                                        />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            className="order-1 lg:order-2 relative"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {exceptionalDesignData.image_url && (
                                <div className="relative h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src={exceptionalDesignData.image_url}
                                        alt={exceptionalDesignData.image_alt || "Exceptional Design"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExceptionalDesignSectionServer;
