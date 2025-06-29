"use client";

import React from "react";
import { motion } from "framer-motion";
import { BlogImage } from "@/types/blog";
import BlogContent from "./blog-content";

interface BlogDetailContentProps {
    content: string;
    images?: BlogImage[];
    excerpt?: string;
}

const BlogDetailContent = ({
    content,
    images = [],
    excerpt,
}: BlogDetailContentProps) => {
    return (
        <>
            {/* Excerpt Section - positioned right after back link */}
            {/* COMMENTED OUT: Excerpt section removed from blog detail page
            {excerpt && (
                <section className="bg-white pb-4 md:pb-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h3 className=" text-center text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
                                    {excerpt}
                                </h3>
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}
            */}

            {/* Main Content Section */}
            <section className="w-full bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="w-full">
                            {/* Main Content */}
                            <BlogContent content={content} />
                            {/* Blog Images Gallery */}
                            {images && images.length > 0 && (
                                <motion.div
                                    className="mt-12"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                        Gallery
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {images.map((image, index) => (
                                            <motion.div
                                                key={image.id}
                                                className="relative aspect-video overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: index * 0.1,
                                                }}
                                            >
                                                <img
                                                    src={image.file_path}
                                                    alt={
                                                        image.alt_text ||
                                                        image.caption ||
                                                        "Blog image"
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                                {image.caption && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                                                        <p className="text-sm">
                                                            {image.caption}
                                                        </p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Custom styles for blog content */}
                <style jsx>{`
                    .blog-content h1,
                    .blog-content h2,
                    .blog-content h3,
                    .blog-content h4,
                    .blog-content h5,
                    .blog-content h6 {
                        font-weight: 600;
                        margin-top: 2rem;
                        margin-bottom: 1rem;
                        color: #111827;
                    }

                    .blog-content h1 {
                        font-size: 2.25rem;
                    }
                    .blog-content h2 {
                        font-size: 1.875rem;
                    }
                    .blog-content h3 {
                        font-size: 1.5rem;
                    }
                    .blog-content h4 {
                        font-size: 1.25rem;
                    }

                    .blog-content p {
                        margin-bottom: 1.5rem;
                        text-align: justify;
                    }

                    .blog-content ul,
                    .blog-content ol {
                        margin-bottom: 1.5rem;
                        padding-left: 1.5rem;
                    }

                    .blog-content li {
                        margin-bottom: 0.5rem;
                    }

                    .blog-content blockquote {
                        border-left: 4px solid #a5cd39;
                        padding-left: 1rem;
                        margin: 1.5rem 0;
                        font-style: italic;
                        background-color: #f9fafb;
                        padding: 1rem;
                        border-radius: 0.375rem;
                    }

                    .blog-content img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 0.5rem;
                        margin: 1.5rem 0;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    }

                    .blog-content a {
                        color: #a5cd39;
                        text-decoration: underline;
                    }

                    .blog-content a:hover {
                        color: #8fb82e;
                    }

                    .blog-content strong {
                        font-weight: 600;
                    }

                    .blog-content em {
                        font-style: italic;
                    }

                    .blog-content code {
                        background-color: #f3f4f6;
                        padding: 0.25rem 0.5rem;
                        border-radius: 0.25rem;
                        font-family: "Courier New", monospace;
                        font-size: 0.9rem;
                    }

                    .blog-content pre {
                        background-color: #1f2937;
                        color: #f9fafb;
                        padding: 1rem;
                        border-radius: 0.5rem;
                        overflow-x: auto;
                        margin: 1.5rem 0;
                    }

                    .blog-content table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 1.5rem 0;
                    }

                    .blog-content th,
                    .blog-content td {
                        border: 1px solid #d1d5db;
                        padding: 0.75rem;
                        text-align: left;
                    }

                    .blog-content th {
                        background-color: #f9fafb;
                        font-weight: 600;
                    }
                `}</style>
            </section>
        </>
    );
};

export default BlogDetailContent;
