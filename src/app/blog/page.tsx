"use client";

import React, { useState, useEffect } from "react";
import BlogHero from "@/components/blog/blog-hero";
import BlogPostsSection from "@/components/blog/blog-posts-section";
import BlogSubscription from "@/components/blog/blog-subscription";
import { BlogPostSummary } from "@/types/blog";
import BoothRequirements from "../portfolio/components/booth-requirements";

const BlogPage = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPostSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch blog posts from API
    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    "/api/blog/posts?status=published&page_size=20",
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch blog posts");
                }

                const data = await response.json();
                setBlogPosts(data.posts || []);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
                setError("Failed to load blog posts");
                // Fallback to sample data for development
                setBlogPosts([
                    {
                        id: "1",
                        title: "DWTC delivers AED22.35 billion in economic output in 2024, driven by record increase in large scale events",
                        slug: "dwtc-hospitality-division-achieves-strong-performance-2024",
                        excerpt:
                            "DWTC's hospitality division continues to excel with outstanding performance metrics.",
                        featured_image_url:
                            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                        published_at: "2025-05-21T00:00:00Z",
                        category_name: "Business",
                        category_color: "#3b82f6",
                        view_count: 0,
                        tags: ["HOSPITALITY", "EVENTS", "BUSINESS"],
                    },
                    {
                        id: "2",
                        title: "DWTC delivers AED22.35 billion in economic output in 2024, driven by record increase in large scale events",
                        slug: "dwtc-delivers-aed22-35-billion-economic-output-2024",
                        excerpt:
                            "Record increase in large scale events drives significant economic impact.",
                        featured_image_url:
                            "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                        published_at: "2025-04-27T00:00:00Z",
                        category_name: "Business",
                        category_color: "#3b82f6",
                        view_count: 0,
                        tags: ["ECONOMICS", "TRADE", "DUBAI"],
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <BlogHero />
                <div className="py-8 md:py-12 lg:py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5cd39] mx-auto"></div>
                            <p className="text-gray-600 mt-4">
                                Loading blog posts...
                            </p>
                        </div>
                    </div>
                </div>
                <BlogSubscription />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white">
                <BlogHero />
                <div className="py-8 md:py-12 lg:py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white px-6 py-2 rounded-md"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
                <BlogSubscription />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <BlogHero />
            <BlogPostsSection blogPosts={blogPosts} />
            <BoothRequirements />
        </div>
    );
};

export default BlogPage;
