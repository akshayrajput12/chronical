"use client";

import React from "react";
import { notFound } from "next/navigation";
import BlogDetailHero from "@/components/blog/blog-detail-hero";
import BlogDetailContent from "@/components/blog/blog-detail-content";

// Sample blog data - this would typically come from a CMS or API
const blogPosts = [
    {
        id: 1,
        date: "21 MAY 2025",
        title: "DWTC Hospitality Division Achieves Strong Performance in 2024, Catering to Nearly 1 Million Guests Across 2,400 Events",
        subtitle:
            "Another landmark year serving prestigious large-scale events such as GITEX GLOBAL, GULFOOD, World Health Expo, Arabian Travel Market and more",
        heroImage:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        content: `
            <p>Dubai, United Arab Emirates, 25 March 2025: DWTC Hospitality, the hospitality division of Dubai World Trade Centre, celebrated the division as a premium hospitality services provider in 2024, serving nearly one million guests across numerous large-scale and luxury events. As an award-winning leader in large-scale and hospitality catering, it continued to set new standards, providing exceptional service and culinary excellence.</p>

            <p>From mega exhibitions and international conventions, corporate galas and hospitality events, to high-profile weddings and private events, DWTC Hospitality showcased its ability to deliver world-class hospitality services at scale, both at events hosted within DWTC's owned and managed venues – including Dubai Exhibition Centre EXPO and Madinat Jumeirah Centre – as well as venues across the UAE.</p>

            <p>Major Jaber, Executive Vice President at Dubai World Trade Centre, said: "2024 has been an outstanding year for DWTC's Hospitality division, underlining our pivotal role in Dubai's dynamic events ecosystem. Our culinary team continues to push boundaries with innovation, and catering experiences, backed by exceptional service standards. From large-scale exhibitions and international conventions to intimate corporate gatherings, we've consistently delivered memorable experiences that exceed expectations."</p>

            <p>Another Landmark Year for Large-Scale Exhibitions & Corporate and Private Event Hospitality</p>

            <p>DWTC Hospitality continued to be recognised as one leading in 2024, by delivering world-class catering and hospitality to some of the region's most prestigious large-scale exhibitions and events, including Gulfood, World Health Expo DWTC Dubai, Arabian Travel Market and GITEX Global, whilst also supporting its international presence at GITEX Africa. In addition to large-scale events, the division also catered to 450 VIP attendees to corporate and private events held at DWTC's venues. Its expertise in managing diverse events was particularly evident in the seamless execution of high-profile gatherings, reinforcing its reputation as a leader in the hospitality industry.</p>

            <p>Operational Strength in Catering at Conferences and Associations</p>

            <p>The division's operational capabilities were further highlighted through its collaboration with the Dubai Health Authority and other key partners. DWTC's strong standing in this sector, few events, including the WCA Worldwide Conference, ARC MENA Summit 2024, and the International Congress of Endocrinology, among others, played a crucial role in building the region.</p>

            <p>Strong Performance Across DWTC-Operated Venues</p>

            <p>DWTC Hospitality's focus on 2024 was particularly effective, with enhanced exceptional growth, catering to over 75,000 attendees across these facilities by members from the previous year with a 115% increase. Specifically, the Dubai Exhibition Centre EXPO gained a pivotal role in DWTC Hospitality's success, catering to over 72,000 attendees in 2024. These achievements further reinforce DWTC's commitment to excellence and its position as a key player in the region's hospitality services multiple venues.</p>

            <p>Focus on Affiliate Catering</p>

            <p>The division's affiliate catering managed by over 155,000 guests in 1,500 external events in 2024, reflecting an impressive 27% year-on-year growth. Key events included the Dubai International Boat Show, the Dubai World Cup, Dubai Food Fest, Dubai Boat Fair, GITEX China Plus, the Middle East and North Africa Business Aviation Association (MEBAA), and several large-scale private events. This remarkable growth demonstrates the division's capacity was strategically enhanced, allowing the team to cater to up to 60,000 guests per day while maintaining exceptional service standards.</p>
        `,
        excerpt:
            "DWTC Hospitality division celebrates another landmark year serving prestigious large-scale events, catering to nearly 1 million guests across 2,400 events in 2024.",
    },
    {
        id: 2,
        date: "27 APR 2025",
        title: "DWTC delivers AED22.35 billion in economic output in 2024, driven by record increase in large scale events",
        subtitle:
            "Dubai World Trade Centre reports significant economic impact through successful large-scale events and exhibitions",
        heroImage:
            "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        content: `
            <p>Dubai, United Arab Emirates, 27 April 2025: Dubai World Trade Centre (DWTC) has announced record-breaking economic output of AED22.35 billion in 2024, representing a significant increase from the previous year. This achievement was driven by a substantial rise in large-scale events and exhibitions hosted at the venue.</p>

            <p>The impressive economic impact reflects DWTC's continued position as a leading global destination for business events, trade shows, and exhibitions. The venue's strategic location, world-class facilities, and comprehensive service offerings have attracted major international events throughout 2024.</p>

            <p>Key highlights from 2024 include hosting over 400 events, welcoming more than 2.5 million visitors, and facilitating business deals worth billions of dirhams. The venue's expansion and modernization efforts have also contributed to its enhanced capacity and appeal to event organizers worldwide.</p>

            <p>DWTC's success in 2024 underscores Dubai's position as a global business hub and its commitment to supporting economic diversification through the events and exhibitions sector. The venue continues to play a crucial role in attracting international businesses and fostering trade relationships.</p>
        `,
        excerpt:
            "Dubai World Trade Centre reports significant economic impact through successful large-scale events and exhibitions.",
    },
    // Add more blog posts as needed
];

interface BlogDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

const BlogDetailPage = ({ params }: BlogDetailPageProps) => {
    const resolvedParams = React.use(params);
    const blogPost = blogPosts.find(
        post => post.id === parseInt(resolvedParams.id),
    );

    if (!blogPost) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white mt-16 md:mt-20 lg:mt-24">
            <BlogDetailHero
                title={blogPost.title}
                subtitle={blogPost.subtitle}
                date={blogPost.date}
                heroImage={blogPost.heroImage}
            />
            <BlogDetailContent content={blogPost.content} />
        </div>
    );
};

export default BlogDetailPage;
