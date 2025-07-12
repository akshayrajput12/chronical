"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CustomExhibitionFAQSection, CustomExhibitionFAQItem } from "@/services/custom-exhibition-stands.service";

interface FAQSectionServerProps {
    faqSectionData: CustomExhibitionFAQSection | null;
    faqItemsData: CustomExhibitionFAQItem[];
}

const FAQSectionServer = ({ faqSectionData, faqItemsData }: FAQSectionServerProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Don't render if no data exists
    if (!faqSectionData && (!faqItemsData || faqItemsData.length === 0)) {
        return null;
    }

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center space-y-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="!text-3xl text-center md:!text-4xl mx-auto !font-rubik !font-bold mb-4">
                            {faqSectionData?.title || "Frequently Asked Questions"}
                        </h2>
                        <div className="flex !mb-2 justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-4"></div>
                        </div>

                        <div
                            className="border-2 rounded-lg overflow-hidden"
                            style={{ borderColor: "#a5cd39" }}
                        >
                            {faqItemsData.map((faq, index) => (
                                <div
                                    key={faq.id || index}
                                    className="border-b last:border-b-0"
                                    style={{ borderColor: "#a5cd39" }}
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                                    >
                                        <span className="text-[#a5cd39] text-base !font-bold pr-4">
                                            ▶ {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                                                openIndex === index
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-4 bg-gray-50">
                                                    <p className="text-gray-700 text-base leading-relaxed text-justify mb-4">
                                                        {faq.answer}
                                                    </p>

                                                    {faq.list_items &&
                                                        faq.list_items.length >
                                                            0 && (
                                                            <ul className="space-y-2">
                                                                {faq.list_items.map(
                                                                    (
                                                                        item,
                                                                        itemIndex,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                itemIndex
                                                                            }
                                                                            className="flex items-start"
                                                                        >
                                                                            <span className="text-gray-700 mr-2">
                                                                                •
                                                                            </span>
                                                                            <span className="text-gray-700 text-base">
                                                                                {
                                                                                    item
                                                                                }
                                                                            </span>
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FAQSectionServer;
