"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
}

const BlogCard = ({ post, index }: BlogCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
        >
            <Link href={`/blog/${post.id}`} className="block h-full">
                <Card className="h-full bg-white shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#a5cd39] hover:border-2 overflow-hidden rounded-lg">
                    <CardContent className="p-0">
                        {/* Date */}
                        <div className="p-6 pb-4">
                            <div className="text-[#a5cd39] text-sm font-bold uppercase tracking-wide mb-4">
                                {post.date}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg md:text-xl font-bold text-[#2C2C2C] mb-6 leading-tight group-hover:text-[#a5cd39] transition-colors duration-300 min-h-[3.5rem]">
                                {post.title}
                            </h3>
                        </div>

                        {/* Featured Image */}
                        <div className="relative h-48 md:h-52 overflow-hidden">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-[#a5cd39]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Excerpt - Hidden on mobile, shown on larger screens */}
                        <div className="p-6 pt-4 hidden md:block">
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                {post.excerpt}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
};

export default BlogCard;
