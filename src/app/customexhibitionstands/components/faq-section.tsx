"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
    getCustomExhibitionFAQSection,
    getCustomExhibitionFAQItems,
    CustomExhibitionFAQSection,
    CustomExhibitionFAQItem
} from "@/services/custom-exhibition-stands.service";

const FAQSection = () => {
    const [faqSection, setFaqSection] = useState<CustomExhibitionFAQSection | null>(null);
    const [faqItems, setFaqItems] = useState<CustomExhibitionFAQItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        loadFAQData();
    }, []);

    const loadFAQData = async () => {
        try {
            const [sectionData, itemsData] = await Promise.all([
                getCustomExhibitionFAQSection(),
                getCustomExhibitionFAQItems(),
            ]);

            setFaqSection(sectionData);
            setFaqItems(itemsData);
        } catch (error) {
            console.error('Error loading FAQ data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Don't render if no data exists
    if ((!faqSection || !faqItems.length) && !isLoading) {
        return null;
    }

    if (isLoading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto animate-pulse">
                        <div className="h-8 bg-gray-300 rounded mb-8 max-w-md mx-auto"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="border border-gray-200 rounded-lg p-4">
                                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide mb-8">
                            {faqSection?.title}
                        </h2>

                        <div
                            className="border-2 rounded-lg overflow-hidden"
                            style={{ borderColor: "#a5cd39" }}
                        >
                            {faqItems.map((faq, index) => (
                                <div
                                    key={faq.id || index}
                                    className="border-b last:border-b-0"
                                    style={{ borderColor: "#a5cd39" }}
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                                    >
                                        <span className="text-[#a5cd39] font-medium text-base pr-4">
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

                                                    {faq.list_items && faq.list_items.length > 0 && (
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

export default FAQSection;
