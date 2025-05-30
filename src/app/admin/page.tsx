'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileEdit,
  Image as ImageIcon,
  Settings,
  ArrowUpRight,
  BarChart,
  Clock,
  Users
} from 'lucide-react';
import Link from 'next/link';

const AdminDashboard = () => {
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

  // Mock data for dashboard stats
  const stats = [
    {
      label: 'Total Pages',
      value: '8',
      icon: <FileEdit size={20} className="text-blue-500" />,
      change: '+2 this month',
      trend: 'up'
    },
    {
      label: 'Media Files',
      value: '124',
      icon: <ImageIcon size={20} className="text-purple-500" />,
      change: '+15 this week',
      trend: 'up'
    },
    {
      label: 'Visitors',
      value: '3.2k',
      icon: <Users size={20} className="text-green-500" />,
      change: '+12% this month',
      trend: 'up'
    },
    {
      label: 'Last Updated',
      value: '2h ago',
      icon: <Clock size={20} className="text-amber-500" />,
      change: 'Home page',
      trend: 'neutral'
    },
  ];

  // Quick access links
  const quickLinks = [
    {
      title: 'Edit Home Page',
      description: 'Update content on the main landing page',
      icon: <LayoutDashboard size={20} />,
      href: '/admin/pages/home',
      color: 'bg-blue-500'
    },
    {
      title: 'Media Library',
      description: 'Manage images and videos',
      icon: <ImageIcon size={20} />,
      href: '/admin/media',
      color: 'bg-purple-500'
    },
    {
      title: 'Site Settings',
      description: 'Update global site configuration',
      icon: <Settings size={20} />,
      href: '/admin/site-settings',
      color: 'bg-amber-500'
    },
    {
      title: 'View Analytics',
      description: 'Check site performance metrics',
      icon: <BarChart size={20} />,
      href: '/admin/analytics',
      color: 'bg-green-500'
    },
  ];

  // Recent activities (mock data)
  const recentActivities = [
    {
      action: 'Updated Hero Section',
      user: 'Admin',
      time: '2 hours ago',
      page: 'Home'
    },
    {
      action: 'Added new image',
      user: 'Admin',
      time: '5 hours ago',
      page: 'Media Library'
    },
    {
      action: 'Updated About Us content',
      user: 'Admin',
      time: '1 day ago',
      page: 'About'
    },
    {
      action: 'Changed site colors',
      user: 'Admin',
      time: '2 days ago',
      page: 'Settings'
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Dashboard Title */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to the Chronicle Exhibits admin panel</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className="p-2 rounded-md bg-gray-50">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4">
                <p className={`text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-500' :
                  stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Access */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="group bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-md ${link.color} text-white`}>
                  {link.icon}
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-gray-400 group-hover:text-gray-600 transition-colors"
                />
              </div>
              <h3 className="font-medium text-gray-800">{link.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{link.description}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500">by {activity.user} • {activity.time}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {activity.page}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <Link
              href="/admin/activity"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all activity
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
