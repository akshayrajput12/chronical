"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    searchParams?: Record<string, string>;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({
    currentPage,
    totalPages,
    baseUrl,
    searchParams = {},
}) => {
    // Don't render pagination if there's only one page or no pages
    if (totalPages <= 1) {
        return null;
    }

    const buildUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2),
        );
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pages.push(
                <Link
                    key={1}
                    href={buildUrl(1)}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                    1
                </Link>,
            );

            if (startPage > 2) {
                pages.push(
                    <span
                        key="ellipsis1"
                        className="px-3 py-2 text-sm text-gray-500"
                    >
                        ...
                    </span>,
                );
            }
        }

        // Add visible page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Link
                    key={i}
                    href={buildUrl(i)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                        i === currentPage
                            ? "text-white bg-[#a5cd39] border border-[#a5cd39]"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                >
                    {i}
                </Link>,
            );
        }

        // Add last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span
                        key="ellipsis2"
                        className="px-3 py-2 text-sm text-gray-500"
                    >
                        ...
                    </span>,
                );
            }

            pages.push(
                <Link
                    key={totalPages}
                    href={buildUrl(totalPages)}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                    {totalPages}
                </Link>,
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center mt-12">
            <nav
                className="flex items-center space-x-1"
                aria-label="Blog pagination"
            >
                {/* Previous button */}
                {currentPage > 1 && (
                    <Link
                        href={buildUrl(currentPage - 1)}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </Link>
                )}

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                    {renderPageNumbers()}
                </div>

                {/* Next button */}
                {currentPage < totalPages && (
                    <Link
                        href={buildUrl(currentPage + 1)}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center gap-1"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                )}
            </nav>
        </div>
    );
};

export default BlogPagination;
