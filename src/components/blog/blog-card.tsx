"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlogPostSummary } from "@/types/blog";

interface BlogCardProps {
    post: BlogPostSummary;
    index: number;
    onClick?: (slug: string) => void;
    className?: string;
    style?: React.CSSProperties;
}

const BlogCard = ({
    post,
    index,
    onClick,
    className = "",
    style,
}: BlogCardProps) => {
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive detection safely
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleClick = () => {
        if (onClick) {
            onClick(post.slug);
        }
    };

    // Format date for display in card header
    const formatCardDate = (dateString: string) => {
        return new Date(dateString)
            .toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .toUpperCase();
    };

    return (
        <motion.div
            className={`flex-none ${className}`}
            style={style}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            <div
                className="bg-white cursor-pointer transition-all duration-500 hover:shadow-lg group flex flex-col"
                onClick={handleClick}
                style={{
                    width: "100%",
                    // Fixed height for consistent card size
                    height: "500px", // Fixed height regardless of content
                    border: "0px",
                    backgroundColor: "rgb(255, 255, 255)",
                    position: "relative",
                }}
            >
                {/* Image Section - Fixed height */}
                <div
                    className="relative overflow-hidden"
                    style={{ height: "220px" }}
                >
                    {post.featured_image_url ? (
                        <Image
                            src={post.featured_image_url}
                            alt={post.featured_image_alt || post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">
                                No image
                            </span>
                        </div>
                    )}
                </div>
                {/* Content Section - Fixed height */}
                <div className="p-4 flex flex-col" style={{ height: "240px" }}>
                    {/* Article Label and Date */}
                    <div className="mb-3 flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-600 tracking-wider">
                            ARTICLE
                        </span>
                        {post.published_at && (
                            <span className="text-xs text-gray-500 font-medium">
                                {formatCardDate(post.published_at)}
                            </span>
                        )}
                    </div>

                    {/* Title and Excerpt - Fixed space */}
                    <div className="flex-1 overflow-hidden">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight mb-2 group-hover:text-gray-700 transition-colors duration-300 line-clamp-3">
                            {post.title}
                        </h3>
                        {post.excerpt && (
                            <p className="text-xs text-gray-600 line-clamp-3">
                                {post.excerpt}
                            </p>
                        )}
                    </div>
                </div>

                {/* Full-Width Blue Button - Fixed height */}
                <div className="relative" style={{ height: "40px" }}>
                    <div className="bg-[#a5cd39] text-white h-full flex items-center justify-center text-xs font-medium tracking-wider hover:bg-[#357ABD] transition-colors duration-300 cursor-pointer">
                        FIND OUT MORE
                    </div>
                </div>

                {/* Link overlay for navigation */}
                <Link
                    href={`/blog/${post.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Read more about ${post.title}`}
                />
            </div>
        </motion.div>
    );
};

export default BlogCard;
