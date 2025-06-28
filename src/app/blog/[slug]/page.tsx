"use client";

import React, { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Head from "next/head";
import BlogDetailHero from "@/components/blog/blog-detail-hero";
import BlogDetailContent from "@/components/blog/blog-detail-content";
import BlogRelatedPosts from "@/components/blog/blog-related-posts";
import { BlogPostWithDetails } from "@/types/blog";
import { EventsForm } from "@/app/whats-on/components/events-form";

interface BlogDetailPageProps {
    params: { slug: string };
}

const BlogDetailPage = () => {
    const params = useParams();
    const slug = params.slug as string;
    const [blogPost, setBlogPost] = useState<BlogPostWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch blog post data
    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/blog/posts/${slug}`);

                if (response.status === 404) {
                    notFound();
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch blog post");
                }

                const data = await response.json();
                setBlogPost(data);
            } catch (error) {
                console.error("Error fetching blog post:", error);
                setError("Failed to load blog post");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlogPost();
        }
    }, [slug]);

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white mt-16 md:mt-20 lg:mt-24">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5cd39]"></div>
                    <p className="text-gray-600 ml-4">Loading blog post...</p>
                </div>
            </div>
        );
    }

    if (error || !blogPost) {
        return (
            <div className="min-h-screen bg-white mt-16 md:mt-20 lg:mt-24">
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-red-600 mb-4">
                        {error || "Blog post not found"}
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white px-6 py-2 rounded-md"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>
                    {blogPost.og_title || blogPost.title} | Chronicles Dubai
                </title>
                <meta
                    name="description"
                    content={
                        blogPost.meta_description ||
                        blogPost.excerpt ||
                        `Read ${blogPost.title} on Chronicles Dubai`
                    }
                />
                {blogPost.meta_keywords && (
                    <meta name="keywords" content={blogPost.meta_keywords} />
                )}

                {/* Open Graph */}
                <meta
                    property="og:title"
                    content={blogPost.og_title || blogPost.title}
                />
                <meta
                    property="og:description"
                    content={
                        blogPost.og_description ||
                        blogPost.excerpt ||
                        `Read ${blogPost.title} on Chronicles Dubai`
                    }
                />
                <meta property="og:type" content="article" />
                <meta
                    property="og:url"
                    content={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/blog/${
                        blogPost.slug
                    }`}
                />
                {(blogPost.og_image_url || blogPost.featured_image_url) && (
                    <meta
                        property="og:image"
                        content={
                            blogPost.og_image_url || blogPost.featured_image_url
                        }
                    />
                )}

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={blogPost.og_title || blogPost.title}
                />
                <meta
                    name="twitter:description"
                    content={
                        blogPost.og_description ||
                        blogPost.excerpt ||
                        `Read ${blogPost.title} on Chronicles Dubai`
                    }
                />
                {(blogPost.og_image_url || blogPost.featured_image_url) && (
                    <meta
                        name="twitter:image"
                        content={
                            blogPost.og_image_url || blogPost.featured_image_url
                        }
                    />
                )}

                {/* Article specific */}
                {blogPost.published_at && (
                    <meta
                        property="article:published_time"
                        content={blogPost.published_at}
                    />
                )}
                {blogPost.updated_at && (
                    <meta
                        property="article:modified_time"
                        content={blogPost.updated_at}
                    />
                )}
                {blogPost.category_name && (
                    <meta
                        property="article:section"
                        content={blogPost.category_name}
                    />
                )}
                {blogPost.tags &&
                    blogPost.tags.map(tag => (
                        <meta
                            key={tag.id}
                            property="article:tag"
                            content={tag.name}
                        />
                    ))}

                {/* Canonical URL */}
                <link
                    rel="canonical"
                    href={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/blog/${
                        blogPost.slug
                    }`}
                />
            </Head>

            <div className="min-h-screen bg-white mt-16 md:mt-20 lg:mt-24">
                <BlogDetailHero
                    title={blogPost.title}
                    subtitle={blogPost.excerpt || ""}
                    date={formatDate(
                        blogPost.published_at || blogPost.updated_at,
                    )}
                    heroImage={
                        blogPost.hero_image_url || blogPost.featured_image_url
                    }
                    viewCount={blogPost.view_count}
                    author={blogPost.author_id ? "Admin" : undefined}
                />
                <div className="flex gap-4 relative lg:flex-row flex-col xl:mx-20 lg:mx-8 md:mx-6 mx-4">
                    <BlogDetailContent
                        content={blogPost.content || ""}
                        excerpt={blogPost.excerpt}
                    />
                    <BlogRelatedPosts
                        currentPostId={blogPost.id}
                        currentPostSlug={blogPost.slug}
                    />
                </div>
                <EventsForm />
            </div>
        </>
    );
};

export default BlogDetailPage;
