"use client";

import React from "react";
import BlogHero from "@/components/blog/blog-hero";
import BlogPostsSection from "@/components/blog/blog-posts-section";
import BlogSubscription from "@/components/blog/blog-subscription";

// Sample blog data - this would typically come from a CMS or API
const blogPosts = [
    {
        id: 1,
        date: "21 MAY 2025",
        title: "DWTC Hospitality Division Achieves Strong Performance in 2024, Catering to Nearly 1 Million Guests Across 2,400 Events",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        excerpt: "DWTC Hospitality division celebrates another landmark year serving prestigious large-scale events, catering to nearly 1 million guests across 2,400 events in 2024.",
    },
    {
        id: 2,
        date: "27 APR 2025",
        title: "DWTC delivers AED22.35 billion in economic output in 2024, driven by record increase in large scale events",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        excerpt: "Dubai World Trade Centre reports significant economic impact through successful large-scale events and exhibitions.",
    },
    {
        id: 3,
        date: "25 APR 2025",
        title: "Capacity Crowds Mark Monumental Opening of GITEX ASIA x Ai Everything Singapore – Cementing New Era For Asia's Tech Industry",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        excerpt: "GITEX ASIA x Ai Everything Singapore opens to capacity crowds, marking a new milestone for Asia's technology sector.",
    },
    {
        id: 4,
        date: "20 APR 2025",
        title: "Innovation Summit 2025 Brings Together Global Tech Leaders",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        excerpt: "Leading technology innovators gather to discuss the future of digital transformation and emerging technologies.",
    },
    {
        id: 5,
        date: "15 APR 2025",
        title: "Sustainable Technology Expo Showcases Green Innovation",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
        excerpt: "Discover the latest in sustainable technology solutions and environmental innovation at this groundbreaking expo.",
    },
    {
        id: 6,
        date: "10 APR 2025",
        title: "AI Revolution Conference Explores Future Possibilities",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        excerpt: "Industry experts discuss the transformative potential of artificial intelligence across various sectors.",
    },
];

const BlogPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <BlogHero />
            <BlogPostsSection blogPosts={blogPosts} />
            <BlogSubscription />
        </div>
    );
};

export default BlogPage;
