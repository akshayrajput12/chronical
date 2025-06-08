"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
    listItems?: string[];
}

const faqData: FAQItem[] = [
    {
        question:
            "What is the time it will take to create and construct an exhibition stand that is custom-designed?",
        answer: "The time needed to create the custom display stand will depend on the dimensions and demands. The process of creating a custom display a skill; The method and plan for designing and constructing a custom display stand must be explained.",
    },
    {
        question:
            "Can I reuse my custom-designed exhibition stand in different shows?",
        answer: "Yes, you can! There are many benefits to reuse of custom-designed exhibition stands at the upcoming shows in Europe the most significant is that it will make you cost. A lot of companies and brands both small and large continue to believe that purchasing disposable displays is the most effective option to make the perfect impression. Also, invest in reusable exhibit stands.",
    },
    {
        question:
            "What is the cost to employ an expert builder of exhibition stands?",
        answer: "Cost of hiring an experienced builder of exhibition stands is contingent upon a variety of elements. However, Chronicle Exhibition offers cost-effective exhibition services.",
    },
    {
        question:
            "How can I measure the performance of my custom exhibit stand at an exhibition?",
        answer: "Going to an exhibition can be costly. Expos are often a major amount of an organization's budget, which can include travel expenses and exhibiting costs along with branding items, stand design and build. What is the best way to measure the ROI of your investment? Every brand is unique and a company's worth of exhibiting may differ from other. But, in order to calculate his ROI from an show, here are a few indicators that can be used across all types of exhibitions:",
        listItems: [
            "The feedback from the visitor",
            "Survey",
            "ROI (ROI) Cost: Show the cost divided by the revenue that is generated.",
            "Offers and Sales",
            "After exhibit engagement",
            "The result of the leads and contacts",
        ],
    },
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

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
                            FREQUENTLY ASKED QUESTION (FAQ)
                        </h2>

                        <div
                            className="border-2 rounded-lg overflow-hidden"
                            style={{ borderColor: "#a5cd39" }}
                        >
                            {faqData.map((faq, index) => (
                                <div
                                    key={index}
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

                                                    {faq.listItems && (
                                                        <ul className="space-y-2">
                                                            {faq.listItems.map(
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
