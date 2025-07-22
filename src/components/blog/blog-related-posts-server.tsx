"use client";

import React from "react";
import { motion } from "framer-motion";
import { BlogPostSummary } from "@/types/blog";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BlogRelatedPostsServerProps {
    relatedPosts: BlogPostSummary[];
    currentPostSlug: string;
}

const BlogRelatedPostsServer = ({
    relatedPosts,
    currentPostSlug,
}: BlogRelatedPostsServerProps) => {
    const router = useRouter();

    const handlePostClick = (slug: string) => {
        router.push(`/${slug}`);
    };

    // Filter out current post if it somehow appears in related posts
    const filteredRelatedPosts = relatedPosts.filter(
        post => post.slug !== currentPostSlug,
    );

    if (!filteredRelatedPosts || filteredRelatedPosts.length === 0) {
        return (
            <aside className="w-[30%] bg-white sticky top-8 h-fit">
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Related Blogs
                    </h3>
                    <p className="text-gray-600 text-sm">
                        No related posts available at the moment.
                    </p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-full bg-white sticky top-8 h-fit">
            <motion.div
                className="border border-gray-200 rounded-lg p-6 bg-white"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Related Blogs
                </h3>
                <div className="space-y-6">
                    {filteredRelatedPosts.slice(0, 4).map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                            className="cursor-pointer group"
                            onClick={() => handlePostClick(post.slug)}
                        >
                            <div className="flex items-start space-x-4">
                                {/* Square Image */}
                                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                                    {post.featured_image_url ? (
                                        <Image
                                            src={post.featured_image_url}
                                            alt={
                                                post.featured_image_alt ||
                                                post.title
                                            }
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">
                                                No image
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {/* Title */}
                                    <h4 className="text-base font-semibold text-gray-900 leading-tight mb-2 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                                        {post.title}
                                    </h4>

                                    {/* Read time */}
                                    <p className="text-sm text-gray-500">
                                        1 min read
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </aside>
    );
};

export default BlogRelatedPostsServer;
