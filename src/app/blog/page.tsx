import React from "react";
import BlogHero from "@/components/blog/blog-hero";
import BlogPostsSection from "@/components/blog/blog-posts-section";
import BlogSubscription from "@/components/blog/blog-subscription";
import { BlogPostSummary } from "@/types/blog";
import BoothRequirements from "../portfolio/components/booth-requirements";
import { getBlogPageData } from "@/services/blog-page.service";

interface BlogPageProps {
    searchParams?: Promise<{
        page?: string;
        category?: string;
        search?: string;
        featured?: string;
    }>;
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
    // Await searchParams for Next.js 15 compatibility
    const resolvedSearchParams = await searchParams;

    // Parse search parameters
    const page = parseInt(resolvedSearchParams?.page || "1", 10);
    const category = resolvedSearchParams?.category;
    const search = resolvedSearchParams?.search;
    const featured = resolvedSearchParams?.featured === "true";

    // Fetch blog data server-side
    const blogPageData = await getBlogPageData(
        page,
        20, // pageSize
        "published", // status
        category,
        search,
        featured
    );

    // Handle case where no posts are found
    if (!blogPageData.posts || blogPageData.posts.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <BlogHero />
                <div className="py-8 md:py-12 lg:py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                No blog posts found
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {search
                                    ? `No posts found matching "${search}"`
                                    : category
                                    ? `No posts found in category "${category}"`
                                    : "No blog posts are currently available."
                                }
                            </p>
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
            <BlogPostsSection blogPosts={blogPageData.posts} />
            <BoothRequirements />
        </div>
    );
};

export default BlogPage;
