"use client";

import React from "react";
import { motion } from "framer-motion";
import BlogCard from "./blog-card";
import BlogPagination from "./blog-pagination";
import { BlogPostSummary } from "@/types/blog";

interface BlogPostsSectionProps {
    blogPosts: BlogPostSummary[];
    currentPage: number;
    totalPages: number;
    searchParams?: Record<string, string>;
}

const BlogPostsSection = ({
    blogPosts,
    currentPage,
    totalPages,
    searchParams = {},
}: BlogPostsSectionProps) => {
    return (
        <section id="blog-posts" className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-4">
                            Latest Updates
                        </h2>
                        <div className="w-24 h-1 bg-[#a5cd39] mx-auto"></div>
                    </motion.div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {blogPosts.map((post, index) => (
                            <BlogCard key={post.id} post={post} index={index} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <BlogPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        baseUrl="/blog"
                        searchParams={searchParams}
                    />
                </div>
            </div>
        </section>
    );
};

export default BlogPostsSection;
