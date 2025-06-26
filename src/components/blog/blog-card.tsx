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
    const [showAllTags, setShowAllTags] = useState(false);

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

    // Use tags from the post data or extract from excerpt as fallback
    const categoryTags =
        post.tags && post.tags.length > 0
            ? post.tags.slice(0, 3)
            : (post.excerpt || "")
                  .split(",")
                  .map(tag => tag.trim())
                  .slice(0, 3)
                  .filter(tag => tag.length > 0);

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
                    border: "0px",
                    backgroundColor: "rgb(255, 255, 255)",
                    position: "relative",
                }}
            >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
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
                {/* Content Section */}
                <div className="p-6 flex flex-col">
                    {/* Article Label and Date */}
                    <div className="flex items-center">
                        {post.published_at && (
                            <span className="text-xs text-gray-500 font-medium">
                                {formatCardDate(post.published_at)}
                            </span>
                        )}
                    </div>

                    {/* Title and Excerpt */}
                    <div className="my-6">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-gray-700 transition-colors duration-300">
                            {post.title}
                        </h3>
                    </div>

                    {/* Category and Tags in one row */}
                    {/* <div className="flex items-center gap-2 flex-wrap">
                        {post.category_name && (
                            <span
                                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                style={{
                                    backgroundColor:
                                        post.category_color || "#a5cd39",
                                }}
                            >
                                {post.category_name}
                            </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                            <>
                                {(showAllTags
                                    ? post.tags
                                    : post.tags.slice(0, 2)
                                ).map((tag, tagIndex) => (
                                    <span
                                        key={tagIndex}
                                        className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-700 uppercase tracking-wider rounded-sm"
                                        style={{ marginLeft: "0.5rem" }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {post.tags.length > 2 && !showAllTags && (
                                    <button
                                        className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-sm hover:bg-gray-200 focus:outline-none"
                                        style={{ marginLeft: "0.5rem" }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setShowAllTags(true);
                                        }}
                                    >
                                        ...
                                    </button>
                                )}
                                {post.tags.length > 2 && showAllTags && (
                                    <button
                                        className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-sm hover:bg-gray-200 focus:outline-none"
                                        style={{ marginLeft: "0.5rem" }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setShowAllTags(false);
                                        }}
                                    >
                                        Show less
                                    </button>
                                )}
                            </>
                        )}
                    </div> */}
                </div>

                {/* Full-Width Blue Button - Covering Card Bottom */}
                <div className="relative">
                    <div className="bg-[#a5cd39] text-white py-4 text-center text-sm font-medium uppercase tracking-wider hover:bg-[#357ABD] transition-colors duration-300 cursor-pointer">
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
