"use client";

import React from "react";
import "./content.css";

interface BlogContentProps {
    content: string;
    className?: string;
}

export default function BlogContent({
    content,
    className = "",
}: BlogContentProps) {
    return (
        <div
            className="blog-content"
            style={{
                whiteSpace: "pre-wrap", // Preserve whitespace and line breaks
            }}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

// Alternative component for cases where you want to sanitize HTML
export function SafeBlogContent({ content, className = "" }: BlogContentProps) {
    // You can add DOMPurify here if needed for extra security
    // import DOMPurify from 'dompurify'
    // const sanitizedContent = DOMPurify.sanitize(content)

    return (
        <div
            style={{
                whiteSpace: "pre-wrap", // Preserve whitespace and line breaks
            }}
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
