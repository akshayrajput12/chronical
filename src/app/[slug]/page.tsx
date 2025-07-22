import {
    getAllBlogSlugs,
    getBlogDetailPageData,
} from "@/services/blog-page.service";
import {
    getAllEventSlugs,
    getEventDetailPageData,
} from "@/services/event-page.service";
import { notFound } from "next/navigation";
import React from "react";
import BlogDetailPage from "../blog/_components/blog-slug";
import EventDetailPage from "../top-trade-shows-in-uae-saudi-arabia-middle-east/components/event-slug";

// Enable ISR - revalidate every 1 hour (3600 seconds) for blog posts
export const revalidate = 3600;

// Generate static params for all blog posts
export async function generateStaticParams() {
    try {
        const blogSlugs = await getAllBlogSlugs();
        const eventSlugs = await getAllEventSlugs();

        const allSlugs = [...blogSlugs, ...eventSlugs];

        return allSlugs.map(slug => ({
            slug,
        }));
    } catch (error) {
        console.error("Error generating static params for posts:", error);
        return [];
    }
}

const Page = async ({ params }: { params: { slug: string } }) => {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // Fetch blog post data server-side
    const blogDetailData = await getBlogDetailPageData(slug);

    if (!blogDetailData) {
        const eventData = await getEventDetailPageData(resolvedParams.slug);
        if (!eventData) {
            return notFound();
        }
        return <EventDetailPage eventData={eventData} />;
    }

    return <BlogDetailPage blogDetailData={blogDetailData} />;
};

export default Page;
