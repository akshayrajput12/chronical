"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
    id: number;
    date: string;
    title: string;
    image: string;
    excerpt: string;
}

interface BlogCardProps {
    post: BlogPost;
    index: number;
    onClick?: (postId: string) => void;
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
    const handleClick = () => {
        if (onClick) {
            onClick(post.id.toString());
        }
    };

    // Extract category tags from excerpt (assuming they're comma-separated)
    const categoryTags = post.excerpt
        .split(",")
        .map(tag => tag.trim())
        .slice(0, 3);

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
                className="bg-white cursor-pointer transition-all duration-500 hover:shadow-lg group flex flex-col h-full"
                onClick={handleClick}
                style={{
                    width: "100%",
                    height: "auto",
                    border: "0px",
                    backgroundColor: "rgb(255, 255, 255)",
                    position: "relative",
                }}
            >
                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                    {/* Article Label */}
                    <div className="mb-4">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                            ARTICLE
                        </span>
                    </div>

                    {/* Title */}
                    <div className="flex-1 mb-6">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-gray-700 transition-colors duration-300">
                            {post.title}
                        </h3>
                    </div>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categoryTags.map((tag, tagIndex) => (
                            <span
                                key={tagIndex}
                                className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-700 uppercase tracking-wider rounded-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Image Section with Button Overlay */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Green Button Overlay - Permanently Visible */}
                    <div className="absolute inset-0 flex items-end justify-center pb-6">
                        <div className="bg-[#a5cd39] text-white px-6 py-3 text-sm font-medium uppercase tracking-wider hover:bg-[#8fb32a] transition-colors duration-300">
                            FIND OUT MORE
                        </div>
                    </div>
                </div>

                {/* Link overlay for navigation */}
                <Link
                    href={`/blog/${post.id}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Read more about ${post.title}`}
                />
            </div>
        </motion.div>
    );
};

export default BlogCard;
