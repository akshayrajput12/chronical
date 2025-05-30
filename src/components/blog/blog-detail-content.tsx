"use client";

import React from "react";
import { motion } from "framer-motion";

interface BlogDetailContentProps {
    content: string;
}

const BlogDetailContent = ({ content }: BlogDetailContentProps) => {
    // Parse the content and create paragraphs
    const paragraphs = content.trim().split('\n').filter(p => p.trim() !== '');

    return (
        <section className="bg-white w-full" style={{ paddingTop: '50px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px' }}>
            {/* Container with maximum side gaps */}
            <div className="w-full px-24 md:px-32 lg:px-48">
                <div className="w-full">
                    <motion.div
                        className="prose prose-lg max-w-none"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {paragraphs.map((paragraph, index) => {
                            // Remove HTML tags for clean text
                            const cleanText = paragraph.replace(/<[^>]*>/g, '').trim();

                            if (!cleanText) return null;

                            // Check if this is a heading (shorter text, likely a section title)
                            const isHeading = cleanText.length < 100 && !cleanText.includes('.');

                            return (
                                <motion.div
                                    key={index}
                                    className="mb-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    {isHeading ? (
                                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 leading-tight">
                                            {cleanText}
                                        </h3>
                                    ) : (
                                        <p className="text-gray-700 text-base md:text-lg leading-relaxed font-normal text-justify">
                                            {cleanText}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BlogDetailContent;
