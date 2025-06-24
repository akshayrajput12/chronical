"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BlogPostSummary } from "@/types/blog";

interface BlogRelatedPostsProps {
    currentPostId: string;
    currentPostSlug: string;
}

const BlogRelatedPosts = ({ currentPostId, currentPostSlug }: BlogRelatedPostsProps) => {
    const [relatedPosts, setRelatedPosts] = useState<BlogPostSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/blog/posts?related_to=${currentPostId}&page_size=3&exclude=${currentPostSlug}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setRelatedPosts(data.posts || []);
                }
            } catch (error) {
                console.error("Error fetching related posts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentPostId) {
            fetchRelatedPosts();
        }
    }, [currentPostId, currentPostSlug]);

    if (loading) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                            Related Articles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="animate-pulse">
                                        <div className="h-48 bg-gray-200"></div>
                                        <div className="p-6">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (relatedPosts.length === 0) {
        return null;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Related Articles
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group h-full">
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            {post.featured_image_url ? (
                                                <Image
                                                    src={post.featured_image_url}
                                                    alt={post.featured_image_alt || post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-sm">No image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col h-full">
                                            {/* Category */}
                                            {post.category_name && (
                                                <div className="mb-3">
                                                    <span
                                                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                                        style={{ backgroundColor: post.category_color || "#a5cd39" }}
                                                    >
                                                        {post.category_name}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Title */}
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                                                {post.title}
                                            </h3>

                                            {/* Excerpt */}
                                            {post.excerpt && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            {/* Meta */}
                                            <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                                                <span>{formatDate(post.published_at || "")}</span>
                                                {post.view_count > 0 && (
                                                    <span>{post.view_count} views</span>
                                                )}
                                            </div>

                                            {/* Tags */}
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-3">
                                                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                                                        <span
                                                            key={tagIndex}
                                                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {post.tags.length > 2 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                            +{post.tags.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* View All Posts Link */}
                    <motion.div
                        className="text-center mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Link
                            href="/blog"
                            className="inline-flex items-center px-6 py-3 bg-[#a5cd39] hover:bg-[#8fb82e] text-white font-medium rounded-md transition-colors duration-300"
                        >
                            View All Articles
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BlogRelatedPosts;
