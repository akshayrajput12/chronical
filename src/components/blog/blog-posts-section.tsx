"use client";

import React from "react";
import { motion } from "framer-motion";
import BlogCard from "./blog-card";

interface BlogPost {
    id: number;
    date: string;
    title: string;
    image: string;
    excerpt: string;
}

interface BlogPostsSectionProps {
    blogPosts: BlogPost[];
}

const BlogPostsSection = ({ blogPosts }: BlogPostsSectionProps) => {
    return (
        <section id="blog-posts" className="py-20 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4">
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
            </div>
        </section>
    );
};

export default BlogPostsSection;
