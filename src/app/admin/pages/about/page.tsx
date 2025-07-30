"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, ArrowRight, Info, FileText } from "lucide-react";

const AboutPage = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    // About page sections - ordered to match frontend section display
    const sections = [
        {
            id: "hero",
            title: "Hero Section",
            description: "Main banner with background image and headline",
            icon: <Info size={24} className="text-blue-500" />,
            lastUpdated: "Recently updated",
            status: "Active",
        },
        {
            id: "main",
            title: "About Us Main",
            description:
                "Main about us section with video and company information",
            icon: <Info size={24} className="text-blue-500" />,
            lastUpdated: "1 week ago",
            status: "Active",
        },
        {
            id: "description",
            title: "About Description",
            description: "Detailed company description and services",
            icon: <FileText size={24} className="text-green-500" />,
            lastUpdated: "2 weeks ago",
            status: "Active",
        },
        {
            id: "dedication",
            title: "Dedication Section",
            description: "Company dedication and commitment section",
            icon: <FileText size={24} className="text-purple-500" />,
            lastUpdated: "Recently updated",
            status: "Active",
        },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        About Page
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage all sections of the about page
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/about-us"
                        target="_blank"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Eye size={16} />
                        <span>View Page</span>
                    </Link>
                </div>
            </motion.div>

            {/* Sections Grid */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.map(section => (
                        <Link
                            key={section.id}
                            href={`/admin/pages/about/${section.id}`}
                            className="group bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 rounded-md bg-gray-50">
                                    {section.icon}
                                </div>
                                <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {section.status}
                                </div>
                            </div>
                            <h3 className="font-medium text-gray-800 text-lg group-hover:text-[#a5cd39] transition-colors">
                                {section.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4">
                                {section.description}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-400">
                                    Updated {section.lastUpdated}
                                </span>
                                <div className="flex items-center gap-1 text-[#a5cd39] group-hover:translate-x-1 transition-transform">
                                    <span className="text-sm font-medium">
                                        Edit
                                    </span>
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AboutPage;
