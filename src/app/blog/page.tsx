import React from "react";
import BlogHero from "@/components/blog/blog-hero";
import BlogPostsSection from "@/components/blog/blog-posts-section";
import BlogSubscription from "@/components/blog/blog-subscription";
import { BlogPostSummary } from "@/types/blog";
import BoothRequirements from "../portfolio/components/booth-requirements";
import { getBlogPageData } from "@/services/blog-page.service";
import { createClient } from "@/lib/supabase/client";
import { PageName } from "../admin/constants/pages";
import { Metadata } from "next";

// Enable ISR - revalidate every 30 minutes (1800 seconds) for fresh blog content
export const revalidate = 1800;

interface BlogPageProps {
    searchParams?: Promise<{
        page?: string;
        category?: string;
        search?: string;
        featured?: string;
    }>;
}

export async function generateMetadata(): Promise<Metadata> {
    try {
        const supabase = createClient();

        const { data, error } = await supabase
            .from("static_page_seo_data")
            .select("*")
            .eq("page_name", PageName.BLOGS);
        if (error) {
            console.error("Error fetching seo data:", error);
            return {
                title: "Blog | Chronicle Exhibits - Exhibition Stand Design Dubai",
                description:
                    "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai. Our team of experts has years of experience in the industry and can help you create a stunning exhibition stand that will leave a lasting impression on your visitors.",
                keywords:
                    "blog, chronicle exhibits, exhibition stand design, trade show services, exhibition company dubai, dubai exhibition stands, dubai trade shows, dubai exhibitions, dubai trade show design, dubai trade show services",
                openGraph: {
                    title: "Blog | Chronicle Exhibits",
                    description:
                        "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai.",
                    type: "website",
                },
            };
        }
        return {
            title:
                data[0].meta_title ||
                "Blog | Chronicle Exhibits - Exhibition Stand Design Dubai",
            description:
                data[0].meta_description ||
                "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai. Our team of experts has years of experience in the industry and can help you create a stunning exhibition stand that will leave a lasting impression on your visitors.",
            keywords:
                data[0].meta_keywords ||
                "blog, chronicle exhibits, exhibition stand design, trade show services, exhibition company dubai, dubai exhibition stands, dubai trade shows, dubai exhibitions, dubai trade show design, dubai trade show services",
            openGraph: {
                title: data[0].meta_title || "Blog | Chronicle Exhibits",
                description:
                    data[0].meta_description ||
                    "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai.",
                type: "website",
            },
        };
    } catch (error) {
        console.log(error);
        return {
            title: "Blog | Chronicle Exhibits - Exhibition Stand Design Dubai",
            description:
                "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai. Our team of experts has years of experience in the industry and can help you create a stunning exhibition stand that will leave a lasting impression on your visitors.",
            keywords:
                "blog, chronicle exhibits, exhibition stand design, trade show services, exhibition company dubai, dubai exhibition stands, dubai trade shows, dubai exhibitions, dubai trade show design, dubai trade show services",
            openGraph: {
                title: "Blog | Chronicle Exhibits",
                description:
                    "Chronicle Exhibits is a leading provider of exhibition stand design and construction services in Dubai.",
                type: "website",
            },
        };
    }
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
        6, // pageSize
        "published", // status
        category,
        search,
        featured,
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
                                    : "No blog posts are currently available."}
                            </p>
                        </div>
                    </div>
                </div>
                <BlogSubscription />
            </div>
        );
    }

    // Prepare search params for pagination (excluding page)
    const paginationSearchParams: Record<string, string> = {};
    if (category) paginationSearchParams.category = category;
    if (search) paginationSearchParams.search = search;
    if (featured) paginationSearchParams.featured = featured.toString();

    return (
        <div className="min-h-screen bg-white">
            <BlogHero />
            <BlogPostsSection
                blogPosts={blogPageData.posts}
                currentPage={blogPageData.currentPage}
                totalPages={blogPageData.totalPages}
                searchParams={paginationSearchParams}
            />
            <BoothRequirements />
        </div>
    );
};

export default BlogPage;
