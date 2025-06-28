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

export const staticBlogPosts = [
    {
        id: "1",
        title: "The Future of Exhibition Stands: AI and Interactive Technology",
        slug: "future-exhibition-stands-ai-interactive-technology",
        excerpt:
            "Discover how artificial intelligence and interactive technologies are revolutionizing the exhibition industry, creating immersive experiences that engage visitors like never before.",
        featured_image_url:
            "https://weyctebrsboqjfkntyfd.supabase.co/storage/v1/object/public/blog-featured-images//1750962481300-qp8q3zx64e.jpg",
        featured_image_alt:
            "AI-powered interactive exhibition stand with holographic displays",
        published_at: "2024-01-15T10:00:00Z",
        category_name: "Technology",
        category_slug: "technology",
        category_color: "#3B82F6",
        view_count: 1247,
        tags: [
            "AI",
            "Interactive Technology",
            "Exhibition Design",
            "Innovation",
        ],
    },
    {
        id: "2",
        title: "Top 5 Mistakes Exhibitors Make and How to Avoid Them",
        slug: "top-5-mistakes-exhibitors-make-avoid-them",
        excerpt:
            "Trade shows can be one of the most effective marketing strategies, but common mistakes can derail your success.",
        featured_image_url:
            "https://weyctebrsboqjfkntyfd.supabase.co/storage/v1/object/public/blog-featured-images//1751019082397-vvlij722fu.jpeg",
        featured_image_alt: "Common exhibition mistakes to avoid",
        published_at: "2024-01-12T14:30:00Z",
        category_name: "Tips",
        category_slug: "tips",
        category_color: "#EF4444",
        view_count: 892,
        tags: ["Exhibition Tips", "Trade Shows", "Marketing", "Best Practices"],
    },
    {
        id: "3",
        title: "Booth Sizes & Types: What You Should Know Before You Exhibit",
        slug: "booth-sizes-types-what-you-should-know",
        excerpt:
            "If you're new to the world of trade shows, the different booth types and sizes can be confusing.",
        featured_image_url:
            "https://weyctebrsboqjfkntyfd.supabase.co/storage/v1/object/public/blog-featured-images//1751026301907-jggk6h72g0h.jpg",
        featured_image_alt: "Different exhibition booth sizes and types",
        published_at: "2024-01-10T09:15:00Z",
        category_name: "Planning",
        category_slug: "planning",
        category_color: "#10B981",
        view_count: 1563,
        tags: ["Booth Planning", "Exhibition", "Trade Show", "Setup"],
    },
    {
        id: "4",
        title: "Double-Sided Printing: Transforming Trade Show Displays",
        slug: "double-sided-printing-transforming-trade-show-displays",
        excerpt:
            "Double-sided printing is the secret weapon every savvy exhibitor should know about.",
        featured_image_url:
            "https://weyctebrsboqjfkntyfd.supabase.co/storage/v1/object/public/blog-featured-images//1751026301907-jggk6h72g0h.jpg",
        featured_image_alt: "Double-sided printed trade show displays",
        published_at: "2024-01-08T11:20:00Z",
        category_name: "Printing",
        category_slug: "printing",
        category_color: "#8B5CF6",
        view_count: 745,
        tags: ["Printing", "Display", "Graphics", "Design"],
    },
];

const BlogRelatedPosts = ({
    currentPostId,
    currentPostSlug,
}: BlogRelatedPostsProps) => {
    const [relatedPosts, setRelatedPosts] =
        useState<BlogPostSummary[]>(staticBlogPosts);
    const [loading, setLoading] = useState(false);

    // Filter out current post and get first 4 posts
    const filteredPosts = relatedPosts
        .filter(
            post => post.id !== currentPostId && post.slug !== currentPostSlug,
        )
        .slice(0, 4);

    const featuredPost = filteredPosts[0];
    const recentPosts = filteredPosts.slice(1, 4);

    if (loading) {
        return (
            <section className="bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                            Related Articles
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Featured post skeleton */}
                            <div className="lg:col-span-2">
                                <div className="animate-pulse">
                                    <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                            {/* Recent posts skeleton */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className="flex gap-3 mb-4 animate-pulse"
                                    >
                                        <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (filteredPosts.length === 0) {
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
        <section className="lg:w-[30%] w-full bg-white">
            <div className="px-4">
                <div className="w-full mx-auto">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Recent Articles - Right Side */}
                        <motion.div
                            className="bg-gray-50 p-6 rounded-lg h-fit"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                                Recent Articles
                            </h3>

                            <div className="space-y-4">
                                {recentPosts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.3 + index * 0.1,
                                        }}
                                    >
                                        <Link href={`/blog/${post.slug}`}>
                                            <div className="flex gap-3 group cursor-pointer hover:bg-white p-2 rounded-lg transition-colors duration-200">
                                                {/* Thumbnail */}
                                                <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                                                    {post.featured_image_url ? (
                                                        <Image
                                                            src={
                                                                post.featured_image_url
                                                            }
                                                            alt={
                                                                post.featured_image_alt ||
                                                                post.title
                                                            }
                                                            fill
                                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                            sizes="64px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-gray-500 text-xs">
                                                                No img
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors mb-1">
                                                        {post.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* View All Link */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <Link
                                    href="/blog"
                                    className="text-[#a5cd39] hover:text-[#8fb82e] font-medium text-sm transition-colors duration-300 flex items-center justify-center"
                                >
                                    View All Articles →
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogRelatedPosts;
