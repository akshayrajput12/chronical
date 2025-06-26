"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Palette,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BlogCategory, CreateBlogCategoryRequest, UpdateBlogCategoryRequest } from "@/types/blog";

const BlogCategoriesPage = () => {
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        color: "#a5cd39",
        sort_order: 0,
        is_active: true,
    });

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("blog_categories")
                .select("*")
                .order("sort_order");

            if (error) {
                console.error("Error fetching categories:", error);
                return;
            }

            setCategories(data || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
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
            description: "",
            color: "#a5cd39",
            sort_order: categories.length,
            is_active: true,
        });
        setEditingCategory(null);
        setShowForm(false);
    };

    // Handle edit
    const handleEdit = (category: BlogCategory) => {
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            color: category.color,
            sort_order: category.sort_order,
            is_active: category.is_active,
        });
        setEditingCategory(category);
        setShowForm(true);
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                // Update existing category
                const updateData: UpdateBlogCategoryRequest = {
                    id: editingCategory.id,
                    ...formData,
                };

                const { error } = await supabase
                    .from("blog_categories")
                    .update(formData)
                    .eq("id", editingCategory.id);

                if (error) {
                    console.error("Error updating category:", error);
                    alert("Error updating category. Please try again.");
                    return;
                }

                alert("Category updated successfully!");
            } else {
                // Create new category
                const createData: CreateBlogCategoryRequest = formData;

                const { error } = await supabase
                    .from("blog_categories")
                    .insert([createData]);

                if (error) {
                    console.error("Error creating category:", error);
                    alert("Error creating category. Please try again.");
                    return;
                }

                alert("Category created successfully!");
            }

            resetForm();
            fetchCategories();
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    // Handle delete
    const handleDelete = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from("blog_categories")
                .delete()
                .eq("id", categoryId);

            if (error) {
                console.error("Error deleting category:", error);
                alert("Error deleting category. Please try again.");
                return;
            }

            alert("Category deleted successfully!");
            fetchCategories();
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    // Toggle active status
    const toggleActive = async (category: BlogCategory) => {
        try {
            const { error } = await supabase
                .from("blog_categories")
                .update({ is_active: !category.is_active })
                .eq("id", category.id);

            if (error) {
                console.error("Error updating category:", error);
                return;
            }

            fetchCategories();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const colorOptions = [
        "#a5cd39", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b",
        "#ef4444", "#ec4899", "#6366f1", "#14b8a6", "#f97316"
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog Categories</h1>
                    <p className="text-gray-600 mt-2">Organize your blog posts with categories</p>
                </div>
                <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Categories List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39] mx-auto"></div>
                                <p className="text-gray-600 mt-2">Loading categories...</p>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-600">No categories found</p>
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="mt-4 bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                                >
                                    Create your first category
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Slug
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-4 h-4 rounded-full mr-3"
                                                            style={{ backgroundColor: category.color }}
                                                        ></div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {category.name}
                                                            </div>
                                                            {category.description && (
                                                                <div className="text-sm text-gray-500">
                                                                    {category.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    /{category.slug}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {category.sort_order}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => toggleActive(category)}
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            category.is_active
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {category.is_active ? "Active" : "Inactive"}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(category)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(category.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
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

                {/* Form */}
                {showForm && (
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {editingCategory ? "Edit Category" : "Add Category"}
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
                                        placeholder="Category name"
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
                                        placeholder="category-slug"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Category description"
                                        rows={3}
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

                                <div>
                                    <Label htmlFor="sort_order" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Sort Order
                                    </Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                        className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39] mr-2"
                                    />
                                    <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                        Active
                                    </Label>
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
                                        {editingCategory ? "Update" : "Create"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogCategoriesPage;
