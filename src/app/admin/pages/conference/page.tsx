"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    Eye,
    Clock,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const ConferenceAdminPage = () => {
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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // Conference page sections
    const sections = [
        {
            id: "hero",
            title: "Hero Section",
            description: "Main banner with conference background and headline",
            icon: <LayoutDashboard size={24} className="text-blue-500" />,
            lastUpdated: "Not configured",
            status: "Pending",
            href: "/admin/pages/conference/hero",
        },
        {
            id: "event-management",
            title: "Event Management Services",
            description:
                "Conference organizing and management services content",
            icon: <Calendar size={24} className="text-green-500" />,
            lastUpdated: "Dynamic content",
            status: "Active",
            href: "/admin/pages/conference/event-management-services",
        },
        {
            id: "conference-management",
            title: "Conference Management Services",
            description: "Conference management services and features",
            icon: <Users size={24} className="text-purple-500" />,
            lastUpdated: "Dynamic content",
            status: "Active",
            href: "/admin/pages/conference/conference-management-services",
        },
        {
            id: "communicate-section",
            title: "Communicate Section",
            description: "Company expertise and communication content",
            icon: <Settings size={24} className="text-blue-500" />,
            lastUpdated: "Dynamic content",
            status: "Active",
            href: "/admin/pages/conference/communicate-section",
        },
        {
            id: "virtual-events-section",
            title: "Virtual Events Section",
            description: "Virtual conference and event solutions content",
            icon: <Settings size={24} className="text-purple-500" />,
            lastUpdated: "Dynamic content",
            status: "Active",
            href: "/admin/pages/conference/virtual-events-section",
        },
        {
            id: "conference-solution-section",
            title: "Conference Solution Section",
            description: "Call-to-action section with contact information",
            icon: <Settings size={24} className="text-indigo-500" />,
            lastUpdated: "Dynamic content",
            status: "Active",
            href: "/admin/pages/conference/conference-solution-section",
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
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Conference Page Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage content and sections for the conference page
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/conference"
                        target="_blank"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Eye size={16} />
                        <span>Preview Page</span>
                    </Link>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Sections
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {sections.length}
                                </p>
                            </div>
                            <LayoutDashboard className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Dynamic Sections
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    1
                                </p>
                            </div>
                            <Settings className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Static Sections
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {sections.length - 1}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Last Updated
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    Today
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Sections Grid */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Conference Page Sections</CardTitle>
                        <CardDescription>
                            Manage individual sections of the conference page
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sections.map(section => (
                                <motion.div
                                    key={section.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link href={section.href}>
                                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        {section.icon}
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">
                                                                {section.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {
                                                                    section.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">
                                                        {section.lastUpdated}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            section.status ===
                                                            "Active"
                                                                ? "bg-green-100 text-green-800"
                                                                : section.status ===
                                                                  "Pending"
                                                                ? "bg-yellow-100 text-yellow-800"
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
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default ConferenceAdminPage;
