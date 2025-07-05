'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileEdit,
  Calendar,
  MapPin,
  Mail,
  Activity,
  Loader2,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalPages: number;
  totalEvents: number;
  totalBlogPosts: number;
  totalCities: number;
  totalFormSubmissions: number;
  newSubmissionsToday: number;
  publishedEvents: number;
  publishedBlogs: number;
  recentActivity: Array<{
    type: string;
    title: string;
    timestamp: string;
    status: string;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard');
        const result = await response.json();

        if (result.success) {
          setStats(result.data);
        } else {
          setError(result.error || 'Failed to fetch dashboard statistics');
        }
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        console.error('Dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Format stats for display
  const getDisplayStats = () => {
    if (!stats) return [];

    return [
      {
        label: 'Total Pages',
        value: stats.totalPages.toString(),
        icon: <FileEdit size={20} className="text-blue-500" />,
        change: 'Main website pages',
        trend: 'neutral' as const
      },
      {
        label: 'Events',
        value: stats.totalEvents.toString(),
        icon: <Calendar size={20} className="text-purple-500" />,
        change: `${stats.publishedEvents} published`,
        trend: 'up' as const
      },
      {
        label: 'Blog Posts',
        value: stats.totalBlogPosts.toString(),
        icon: <FileEdit size={20} className="text-green-500" />,
        change: `${stats.publishedBlogs} published`,
        trend: 'up' as const
      },
      {
        label: 'Form Submissions',
        value: stats.totalFormSubmissions.toString(),
        icon: <Mail size={20} className="text-amber-500" />,
        change: `${stats.newSubmissionsToday} today`,
        trend: stats.newSubmissionsToday > 0 ? 'up' as const : 'neutral' as const
      },
    ];
  };

  // Quick access links
  const quickLinks = [
    {
      title: 'Manage Events',
      description: 'Create and edit events',
      icon: <Calendar size={20} />,
      href: '/admin/pages/events',
      color: 'bg-blue-500'
    },
    {
      title: 'Blog Management',
      description: 'Create and manage blog posts',
      icon: <FileEdit size={20} />,
      href: '/admin/pages/blog',
      color: 'bg-purple-500'
    },
    {
      title: 'Form Submissions',
      description: 'View and manage contact forms',
      icon: <Mail size={20} />,
      href: '/admin/contact',
      color: 'bg-amber-500'
    },
    {
      title: 'Cities Management',
      description: 'Manage city pages and content',
      icon: <MapPin size={20} />,
      href: '/admin/pages/cities',
      color: 'bg-green-500'
    },
  ];

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar size={16} className="text-purple-500" />;
      case 'blog': return <FileEdit size={16} className="text-green-500" />;
      case 'city': return <MapPin size={16} className="text-blue-500" />;
      case 'form': return <Mail size={16} className="text-amber-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'read': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayStats = getDisplayStats();



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
          {displayStats.map((stat, index) => (
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
                  stat.trend === 'up' ? 'text-green-500' : 'text-gray-500'
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
      {stats && stats.recentActivity.length > 0 && (
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                        <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
