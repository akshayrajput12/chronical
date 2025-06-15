"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Eye,
    ArrowRight,
    LayoutDashboard,
    BarChart3,
    Lightbulb,
    Building,
    FileText,
    Briefcase,
    Settings,
    Image as ImageIcon,
} from "lucide-react";

const HomePage = () => {
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

    // Home page sections
    const sections = [
        {
            id: "hero",
            title: "Hero Section",
            description: "Main banner with video background and headline",
            icon: <LayoutDashboard size={24} className="text-blue-500" />,
            lastUpdated: "2 hours ago",
            status: "Active",
        },
        {
            id: "business",
            title: "Business Hub",
            description: "Business hub section with statistics",
            icon: <BarChart3 size={24} className="text-green-500" />,
            lastUpdated: "1 day ago",
            status: "Active",
        },
        {
            id: "dynamic-cell",
            title: "Dynamic Cell",
            description: "Background image management for dynamic cell section",
            icon: <ImageIcon size={24} className="text-purple-500" />,
            lastUpdated: "Recently updated",
            status: "Active",
        },
        {
            id: "why-section",
            title: "Why Section",
            description: "Why choose us section with image",
            icon: <Lightbulb size={24} className="text-amber-500" />,
            lastUpdated: "1 week ago",
            status: "Active",
        },
        {
            id: "new-company",
            title: "New Company",
            description: "New company formation information",
            icon: <Building size={24} className="text-cyan-500" />,
            lastUpdated: "3 weeks ago",
            status: "Active",
        },
        {
            id: "essential-support",
            title: "Essential Support",
            description: "Essential support services section",
            icon: <Briefcase size={24} className="text-purple-500" />,
            lastUpdated: "Recently updated",
            status: "Active",
        },

        {
            id: "setup-process",
            title: "Setup Process",
            description: "Business setup process steps",
            icon: <Settings size={24} className="text-indigo-500" />,
            lastUpdated: "Recently updated",
            status: "Active",
        },
        {
            id: "stats",
            title: "Stats",
            description: "Business statistics management",
            icon: <BarChart3 size={24} className="text-emerald-500" />,
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
                        Home Page
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage all sections of the home page
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map(section => (
                        <Link
                            key={section.id}
                            href={
                                section.id === "stats"
                                    ? "/admin/pages/stats"
                                    : `/admin/pages/home/${section.id}`
                            }
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

export default HomePage;
