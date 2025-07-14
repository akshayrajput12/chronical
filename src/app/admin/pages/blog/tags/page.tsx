"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Tag as TagIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BlogTag, CreateBlogTagRequest, UpdateBlogTagRequest } from "@/types/blog";
import { revalidatePathAction } from "@/services/revalidate.action";

const BlogTagsPage = () => {
    const [tags, setTags] = useState<BlogTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        color: "#6b7280",
    });

    // Fetch tags
    const fetchTags = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("blog_tags")
                .select("*")
                .order("name");

            if (error) {
                console.error("Error fetching tags:", error);
                return;
            }

            setTags(data || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    };

    // Handle name change and auto-generate slug
    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: prev.slug || generateSlug(name),
        }));
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            slug: "",
            color: "#6b7280",
        });
        setEditingTag(null);
        setShowForm(false);
    };

    // Handle edit
    const handleEdit = (tag: BlogTag) => {
        setFormData({
            name: tag.name,
            slug: tag.slug,
            color: tag.color,
        });
        setEditingTag(tag);
        setShowForm(true);
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingTag) {
                // Update existing tag
                const updateData: UpdateBlogTagRequest = {
                    id: editingTag.id,
                    ...formData,
                };

                const { error } = await supabase
                    .from("blog_tags")
                    .update(formData)
                    .eq("id", editingTag.id);

                if (error) {
                    console.error("Error updating tag:", error);
                    alert("Error updating tag. Please try again.");
                    return;
                }

                alert("Tag updated successfully!");
            } else {
                // Create new tag
                const createData: CreateBlogTagRequest = formData;

                const { error } = await supabase
                    .from("blog_tags")
                    .insert([createData]);

                if (error) {
                    console.error("Error creating tag:", error);
                    alert("Error creating tag. Please try again.");
                    return;
                }

                alert("Tag created successfully!");
            }

            resetForm();
            fetchTags();
            revalidatePathAction("/blog");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    // Handle delete
    const handleDelete = async (tagId: string) => {
        if (!confirm("Are you sure you want to delete this tag? This action cannot be undone.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from("blog_tags")
                .delete()
                .eq("id", tagId);

            if (error) {
                console.error("Error deleting tag:", error);
                alert("Error deleting tag. Please try again.");
                return;
            }

            alert("Tag deleted successfully!");
            fetchTags();
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const colorOptions = [
        "#6b7280", "#a5cd39", "#3b82f6", "#10b981", "#8b5cf6", 
        "#f59e0b", "#ef4444", "#ec4899", "#6366f1", "#14b8a6"
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog Tags</h1>
                    <p className="text-gray-600 mt-2">Manage tags for better content organization</p>
                </div>
                <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tag
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tags List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39] mx-auto"></div>
                                <p className="text-gray-600 mt-2">Loading tags...</p>
                            </div>
                        ) : tags.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-600">No tags found</p>
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="mt-4 bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                                >
                                    Create your first tag
                                </Button>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {tags.map((tag) => (
                                        <div
                                            key={tag.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                                        >
                                            <div className="flex items-center flex-1">
                                                <div
                                                    className="w-4 h-4 rounded-full mr-3"
                                                    style={{ backgroundColor: tag.color }}
                                                ></div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {tag.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        /{tag.slug}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 ml-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(tag)}
                                                    className="p-1 h-8 w-8"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(tag.id)}
                                                    className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {editingTag ? "Edit Tag" : "Add Tag"}
                                </h3>
                                <Button variant="ghost" size="sm" onClick={resetForm}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Tag name"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="slug" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Slug *
                                    </Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        placeholder="tag-slug"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Color
                                    </Label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {colorOptions.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, color }))}
                                                className={`w-8 h-8 rounded-full border-2 ${
                                                    formData.color === color ? "border-gray-900" : "border-gray-300"
                                                }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <Input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                        className="mt-2 w-full h-10"
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetForm}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {editingTag ? "Update" : "Create"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Tag Usage Stats */}
            {!showForm && tags.length > 0 && (
                <div className="mt-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tag Cloud</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                                    style={{ backgroundColor: tag.color }}
                                >
                                    <TagIcon className="w-3 h-3 mr-1" />
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogTagsPage;
