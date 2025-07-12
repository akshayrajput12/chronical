import React from "react";
import { notFound } from "next/navigation";
import Head from "next/head";
import BlogDetailHero from "@/components/blog/blog-detail-hero";
import BlogDetailContent from "@/components/blog/blog-detail-content";
import BlogRelatedPostsServer from "@/components/blog/blog-related-posts-server";
import { BlogPostWithDetails } from "@/types/blog";
import { EventsForm } from "@/app/whats-on/components/events-form";
import {
    getBlogDetailPageData,
    incrementBlogPostViews,
    getAllBlogSlugs,
} from "@/services/blog-page.service";

interface BlogDetailPageProps {
    params: Promise<{ slug: string }>;
}

// Enable ISR - revalidate every 1 hour (3600 seconds) for blog posts
export const revalidate = 3600;

// Generate static params for all blog posts
export async function generateStaticParams() {
    try {
        const slugs = await getAllBlogSlugs();
        return slugs.map(slug => ({
            slug,
        }));
    } catch (error) {
        console.error("Error generating static params for blog posts:", error);
        return [];
    }
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
    // Await params for Next.js 15 compatibility
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // Fetch blog post data server-side
    const blogDetailData = await getBlogDetailPageData(slug);

    // If no blog post found, trigger 404
    if (!blogDetailData || !blogDetailData.post) {
        notFound();
    }

    const { post: blogPost, relatedPosts } = blogDetailData;

    // Increment view count server-side (fire and forget)
    incrementBlogPostViews(blogPost.slug).catch(error => {
        console.error("Failed to increment view count:", error);
    });

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

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

            <div className="bg-white mt-16 md:mt-20 lg:mt-24">
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
                <div className="relative lg:mx-12 md:mx-12 sm:mx-8 mx-4 flex row-col justify-between xl:gap-8 lg:gap-4 gap-6">
                    <BlogDetailContent
                        content={blogPost.content || ""}
                        excerpt={blogPost.excerpt}
                    />
                    <div className="flex flex-col gap-6 w-[32%]">
                        <BlogRelatedPostsServer
                            relatedPosts={relatedPosts}
                            currentPostSlug={blogPost.slug}
                        />
                        <EventsForm />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDetailPage;
