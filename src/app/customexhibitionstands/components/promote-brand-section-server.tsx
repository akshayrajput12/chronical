"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CustomExhibitionPromoteBrand } from "@/services/custom-exhibition-stands.service";
import { RequestQuotationDialog } from "@/components/ui/request-quotation-dialog";

interface PromoteBrandSectionServerProps {
    promoteBrandData: CustomExhibitionPromoteBrand | null;
}

const PromoteBrandSectionServer = ({ promoteBrandData }: PromoteBrandSectionServerProps) => {
    // Don't render if no data exists
    if (!promoteBrandData) {
        return null;
    }

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
            },
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
                                <h3 className="!text-3xl md:!text-4xl !font-rubik text-center !font-bold mb-2">
                                    {promoteBrandData?.title}
                                </h3>
                                <div className="flex !mb-3 justify-center">
                                    <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-0"></div>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <p className="text-base leading-relaxed text-justify">
                                        {promoteBrandData?.paragraph_1}
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        {promoteBrandData?.paragraph_2}
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        {promoteBrandData?.paragraph_3}
                                    </p>
                                    <Link href={promoteBrandData?.cta_url || "#"}>
                                        <RequestQuotationDialog
                                            trigger={
                                                <motion.button
                                                    className="bg-[#a5cd39] text-white px-6 py-2 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 font-noto-kufi-arabic text-sm"
                                                    variants={buttonVariants}
                                                    whileHover="hover"
                                                    type="button"
                                                >
                                                    {promoteBrandData?.cta_text ||
                                                        "Request Quotation"}
                                                </motion.button>
                                            }
                                        />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Image with Colored Background */}
                        <motion.div
                            className="order-1 lg:order-2 relative"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* Image Container */}
                            {promoteBrandData?.image_url && (
                                <div className="relative h-80 md:h-96 lg:h-[400px] rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src={promoteBrandData.image_url}
                                        alt={promoteBrandData.image_alt || "Promote Brand"}
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

export default PromoteBrandSectionServer;
