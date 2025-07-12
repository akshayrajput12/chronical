"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    Star,
    Briefcase,
    Eye,
    ArrowRight,
} from "lucide-react";

const ExpoPavilionStandAdminPage = () => {
    // Expo pavilion stand page sections
    const sections = [
        {
            id: "hero",
            title: "Hero Section",
            description:
                "Main banner with background image and headline for Country Pavilion Expo Booth",
            icon: <LayoutDashboard size={24} className="text-blue-500" />,
            href: "/admin/pages/expo-pavilion-stand/hero",
            lastUpdated: "Recently updated",
            status: "Active",
        },
        {
            id: "intro",
            title: "Intro Section",
            description:
                "Introduction content about Country Pavilion Expo Booth services",
            icon: <FileText size={24} className="text-green-500" />,
            href: "/admin/pages/expo-pavilion-stand/intro",
            lastUpdated: "Recently updated",
            status: "Active",
        },
        {
            id: "exceptional-design",
            title: "Exceptional Design Section",
            description:
                "Content about exceptional design services with benefits and features",
            icon: <Star size={24} className="text-yellow-500" />,
            href: "/admin/pages/expo-pavilion-stand/exceptional-design",
            lastUpdated: "Recently updated",
            status: "Active",
        },
        {
            id: "portfolio",
            title: "Portfolio Section",
            description:
                "Portfolio showcase with project gallery and CTA button",
            icon: <Briefcase size={24} className="text-purple-500" />,
            href: "/admin/pages/expo-pavilion-stand/portfolio",
            lastUpdated: "Recently updated",
            status: "Active",
        },
        {
            id: "paragraph-section",
            title: "Paragraph Section",
            description: "Manage the paragraph content section",
            icon: <FileText size={24} className="text-gray-500" />,
            href: "/admin/pages/expo-pavilion-stand/paragraph-section",
            lastUpdated: "Recently updated",
            status: "Active",
        },
    ];

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
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Expo Pavilion Stand
                            </h1>
                            <p className="text-gray-600">
                                Manage all content sections for the Country
                                Pavilion Expo Booth Solutions page
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/country-pavilion-expo-booth-solutions-in-dubai"
                                target="_blank"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview Page
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                        variants={itemVariants}
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <LayoutDashboard className="w-6 h-6 text-blue-600" />
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
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                        variants={itemVariants}
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Star className="w-6 h-6 text-green-600" />
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
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                        variants={itemVariants}
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Content Sections
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    3
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                        variants={itemVariants}
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Briefcase className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Portfolio Items
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    6
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Sections Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {sections.map(section => (
                        <motion.div
                            key={section.id}
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-gray-100 rounded-lg mr-3">
                                            {section.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {section.title}
                                            </h3>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    section.status === "Active"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {section.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4 text-sm">
                                    {section.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                        {section.lastUpdated}
                                    </span>
                                    <Link
                                        href={section.href}
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Edit
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/country-pavilion-expo-booth-solutions-in-dubai"
                            target="_blank"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Eye className="w-5 h-5 text-blue-600 mr-3" />
                            <span className="text-sm font-medium text-gray-900">
                                Preview Live Page
                            </span>
                        </Link>
                        <Link
                            href="/admin/pages/expo-pavilion-stand/hero"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <LayoutDashboard className="w-5 h-5 text-green-600 mr-3" />
                            <span className="text-sm font-medium text-gray-900">
                                Edit Hero Section
                            </span>
                        </Link>
                        <Link
                            href="/admin/pages/expo-pavilion-stand/portfolio"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Briefcase className="w-5 h-5 text-purple-600 mr-3" />
                            <span className="text-sm font-medium text-gray-900">
                                Manage Portfolio
                            </span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ExpoPavilionStandAdminPage;
