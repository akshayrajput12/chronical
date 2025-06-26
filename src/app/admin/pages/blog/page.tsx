"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Calendar,
    Tag,
    User,
    MoreHorizontal,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BlogPost, BlogPostStatus } from "@/types/blog";
import Link from "next/link";

interface BlogPostWithCategory extends BlogPost {
    category_name?: string;
    category_color?: string;
}

const BlogAdminPage = () => {
    const [posts, setPosts] = useState<BlogPostWithCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<BlogPostStatus | "all">(
        "all",
    );
    const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
    const supabase = createClient();

    // Fetch blog posts
    const fetchPosts = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from("blog_posts")
                .select(
                    `
                    *,
                    blog_categories (
                        name,
                        color
                    )
                `,
                )
                .order("created_at", { ascending: false });

            if (statusFilter !== "all") {
                query = query.eq("status", statusFilter);
            }

            if (searchTerm) {
                query = query.or(
                    `title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`,
                );
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching posts:", error);
                return;
            }

            const postsWithCategory =
                data?.map(post => ({
                    ...post,
                    category_name: post.blog_categories?.name,
                    category_color: post.blog_categories?.color,
                })) || [];

            setPosts(postsWithCategory);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, searchTerm]);

    // Delete post
    const handleDelete = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const { error } = await supabase
                .from("blog_posts")
                .delete()
                .eq("id", postId);

            if (error) {
                console.error("Error deleting post:", error);
                return;
            }

            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Update post status
    const handleStatusChange = async (
        postId: string,
        newStatus: BlogPostStatus,
    ) => {
        try {
            const updateData: any = { status: newStatus };

            // If publishing, set published_at
            if (newStatus === "published") {
                updateData.published_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from("blog_posts")
                .update(updateData)
                .eq("id", postId);

            if (error) {
                console.error("Error updating post status:", error);
                return;
            }

            fetchPosts();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Bulk actions
    const handleBulkDelete = async () => {
        if (
            !confirm(
                `Are you sure you want to delete ${selectedPosts.length} posts?`,
            )
        )
            return;

        try {
            const { error } = await supabase
                .from("blog_posts")
                .delete()
                .in("id", selectedPosts);

            if (error) {
                console.error("Error deleting posts:", error);
                return;
            }

            setPosts(posts.filter(post => !selectedPosts.includes(post.id)));
            setSelectedPosts([]);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const getStatusBadge = (status: BlogPostStatus) => {
        const styles = {
            draft: "bg-gray-100 text-gray-800",
            published: "bg-green-100 text-green-800",
            archived: "bg-red-100 text-red-800",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Blog Posts
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your blog content
                    </p>
                </div>
                <Link href="/admin/pages/blog/new">
                    <Button className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Post
                    </Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search posts..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={e =>
                                setStatusFilter(
                                    e.target.value as BlogPostStatus | "all",
                                )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39]"
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                        {selectedPosts.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={handleBulkDelete}
                                className="ml-2"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete ({selectedPosts.length})
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39] mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-600">No posts found</p>
                        <Link href="/admin/pages/blog/new">
                            <Button className="mt-4 bg-[#a5cd39] hover:bg-[#8fb82e] text-white">
                                Create your first post
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedPosts.length ===
                                                posts.length
                                            }
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setSelectedPosts(
                                                        posts.map(p => p.id),
                                                    );
                                                } else {
                                                    setSelectedPosts([]);
                                                }
                                            }}
                                            className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Views
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {posts.map(post => (
                                    <tr
                                        key={post.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedPosts.includes(
                                                    post.id,
                                                )}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setSelectedPosts([
                                                            ...selectedPosts,
                                                            post.id,
                                                        ]);
                                                    } else {
                                                        setSelectedPosts(
                                                            selectedPosts.filter(
                                                                id =>
                                                                    id !==
                                                                    post.id,
                                                            ),
                                                        );
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {post.featured_image_url && (
                                                    <img
                                                        src={
                                                            post.featured_image_url
                                                        }
                                                        alt={post.title}
                                                        className="w-10 h-10 rounded object-cover mr-3"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {post.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        /{post.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(
                                                post.status as BlogPostStatus,
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {post.category_name && (
                                                <span
                                                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                                    style={{
                                                        backgroundColor:
                                                            post.category_color,
                                                    }}
                                                >
                                                    {post.category_name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.published_at
                                                ? formatDate(post.published_at)
                                                : formatDate(post.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.view_count}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                {post.status ===
                                                    "published" && (
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Link
                                                    href={`/admin/pages/blog/edit/${post.id}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <div className="relative group">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                        <div className="py-1">
                                                            {post.status !==
                                                                "published" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            post.id,
                                                                            "published",
                                                                        )
                                                                    }
                                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    Publish
                                                                </button>
                                                            )}
                                                            {post.status !==
                                                                "draft" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            post.id,
                                                                            "draft",
                                                                        )
                                                                    }
                                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    Move to
                                                                    Draft
                                                                </button>
                                                            )}
                                                            {post.status !==
                                                                "archived" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            post.id,
                                                                            "archived",
                                                                        )
                                                                    }
                                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    Archive
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        post.id,
                                                                    )
                                                                }
                                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogAdminPage;
