"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Search,
    Star,
    Briefcase,
    ArrowRight,
} from "lucide-react";

const DoubleDeckersStandAdminPage = () => {
    // Double decker stand page sections
    const sections = [
        {
            id: "hero",
            title: "Hero Section",
            description: "Main banner with background image and headline",
            icon: <LayoutDashboard size={24} className="text-blue-500" />,
            href: "/admin/pages/double-decker-stand/hero",
            lastUpdated: "Recently updated",
            status: "Active",
        },
        {
            id: "unique-quality",
            title: "Unique Quality Section",
            description:
                "Content about unique excellent quality double storey booths",
            icon: <Star size={24} className="text-yellow-500" />,
            href: "/admin/pages/double-decker-stand/unique-quality",
            lastUpdated: "Recently updated",
            status: "Active",
        },
        {
            id: "communication",
            title: "Communication Section",
            description:
                "Two-column layout with content and image about effective communication",
            icon: <MessageSquare size={24} className="text-green-500" />,
            href: "/admin/pages/double-decker-stand/communication",
            lastUpdated: "Recently updated",
            status: "Active",
        },

        {
            id: "portfolio",
            title: "Portfolio Section",
            description: "Portfolio grid with double decker stand projects",
            icon: <Briefcase size={24} className="text-orange-500" />,
            href: "/admin/pages/double-decker-stand/portfolio",
            lastUpdated: "Recently updated",
            status: "Active",
        },
        {
            id: "paragraph-section",
            title: "Paragraph Section",
            description: "Manage the paragraph content section",
            icon: <FileText size={24} className="text-gray-500" />,
            href: "/admin/pages/double-decker-stand/paragraph-section",
            lastUpdated: "Recently updated",
            status: "Active",
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Double Decker Stand Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage all sections of the double decker exhibition stands
                    page
                </p>
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, index) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Link href={section.href}>
                            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-[#a5cd39]">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            {section.icon}
                                            <div>
                                                <CardTitle className="text-lg group-hover:text-[#a5cd39] transition-colors">
                                                    {section.title}
                                                </CardTitle>
                                            </div>
                                        </div>
                                        <ArrowRight
                                            size={16}
                                            className="text-gray-400 group-hover:text-[#a5cd39] group-hover:translate-x-1 transition-all"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-sm text-gray-600 mb-4">
                                        {section.description}
                                    </CardDescription>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">
                                            {section.lastUpdated}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                section.status === "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {section.status}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <LayoutDashboard className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Total Sections
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {sections.length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Star className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Active Sections
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        sections.filter(
                                            s => s.status === "Active",
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Briefcase className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Portfolio Items
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    Dynamic
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FileText className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Last Updated
                                </p>
                                <p className="text-sm font-bold text-gray-900">
                                    Today
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Page Preview Link */}
            <div className="mt-8 text-center">
                <Link
                    href="/double-decker-exhibition-stands-in-dubai"
                    target="_blank"
                    className="inline-flex items-center px-6 py-3 bg-[#a5cd39] text-white rounded-lg hover:bg-[#8fb82e] transition-colors"
                >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Preview Double Decker Stands Page
                </Link>
            </div>
        </div>
    );
};

export default DoubleDeckersStandAdminPage;
