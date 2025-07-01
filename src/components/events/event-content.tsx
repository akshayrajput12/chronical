"use client";

import React from "react";
import "./event-content.css";

interface EventContentProps {
    content: string;
    className?: string;
}

export default function EventContent({
    content,
    className = "",
}: EventContentProps) {
    return (
        <div
            className={`event-content ${className}`}
            style={{
                whiteSpace: "pre-wrap", // Preserve whitespace and line breaks
            }}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

// Alternative component for cases where you want to sanitize HTML
export function SafeEventContent({ content, className = "" }: EventContentProps) {
    

    return (
        <div
            style={{
                whiteSpace: "pre-wrap", // Preserve whitespace and line breaks
            }}
            className={`event-content ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
