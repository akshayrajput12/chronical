import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogDetailHero from "@/components/blog/blog-detail-hero";
import BlogDetailContent from "@/components/blog/blog-detail-content";
import BlogRelatedPostsServer from "@/components/blog/blog-related-posts-server";
import { EventsForm } from "@/app/top-trade-shows-in-uae-saudi-arabia-middle-east/components/events-form";
import {
    incrementBlogPostViews,
    BlogDetailPageData,
} from "@/services/blog-page.service";

const BlogDetailPage = async ({
    blogDetailData,
}: {
    blogDetailData: BlogDetailPageData;
}) => {
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

            <div className="bg-white">
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

                {/* Back to News Link */}
                <section className="bg-white py-4 border-b border-gray-200">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <Link
                                href="/blog"
                                className="inline-flex items-center text-gray-600 hover:text-[#a5cd39] transition-colors duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium tracking-wide">
                                    BACK TO OUR NEWS
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Main Content Section */}
                <section className="py-8 md:py-12 lg:py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex lg:flex-row flex-col justify-between xl:gap-8 lg:gap-6 gap-8">
                                <BlogDetailContent
                                    content={blogPost.content || ""}
                                    excerpt={blogPost.excerpt}
                                />
                                <div className="flex flex-col gap-6 w-full lg:w-[32%]">
                                    <BlogRelatedPostsServer
                                        relatedPosts={relatedPosts}
                                        currentPostSlug={blogPost.slug}
                                    />
                                    <EventsForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default BlogDetailPage;
