"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Palette,
    ArrowUp,
    ArrowDown,
    Eye,
    EyeOff,
} from "lucide-react";
import { revalidatePathAction } from "@/services/revalidate.action";

interface EventCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
    color: string;
    is_active: boolean;
    display_order: number;
}

const EventCategoriesPage = () => {
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        slug: "",
        description: "",
        color: "#22c55e",
        is_active: true,
        display_order: 0,
    });

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

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/events/categories");
            const data = await response.json();
            if (response.ok) {
                setCategories(data.categories || []);
            } else {
                console.error("Error fetching categories:", data.error);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleInputChange = (field: keyof CategoryFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            ...(field === "name" && { slug: generateSlug(value) }),
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            slug: "",
            description: "",
            color: "#22c55e",
            is_active: true,
            display_order: categories.length,
        });
        setEditingCategory(null);
    };

    const handleCreate = () => {
        resetForm();
        setFormData(prev => ({ ...prev, display_order: categories.length }));
        setDialogOpen(true);
    };

    const handleEdit = (category: EventCategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            color: category.color,
            is_active: category.is_active,
            display_order: category.display_order,
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editingCategory
                ? `/api/events/categories/${editingCategory.id}`
                : "/api/events/categories";
            
            const method = editingCategory ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                await fetchCategories();
                setDialogOpen(false);
                resetForm();
            } else {
                console.error("Error saving category:", data.error);
                alert(data.error || "Failed to save category");
            }
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Failed to save category");
        } finally {
            revalidatePathAction("/top-trade-shows-in-uae-saudi-arabia-middle-east");
            setSaving(false);
        }
    };

    const handleDelete = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await fetch(`/api/events/categories/${categoryId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                await fetchCategories();
            } else {
                const data = await response.json();
                alert(data.error || "Failed to delete category");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category");
        } finally {
            revalidatePathAction("/top-trade-shows-in-uae-saudi-arabia-middle-east");
        }
    };

    const handleToggleActive = async (categoryId: string, isActive: boolean) => {
        try {
            const response = await fetch(`/api/events/categories/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ is_active: isActive }),
            });

            if (response.ok) {
                await fetchCategories();
            } else {
                const data = await response.json();
                alert(data.error || "Failed to update category");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Failed to update category");
        }
    };

    const moveCategory = async (categoryId: string, direction: "up" | "down") => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        const newOrder = direction === "up" 
            ? Math.max(0, category.display_order - 1)
            : category.display_order + 1;

        try {
            const response = await fetch(`/api/events/categories/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ display_order: newOrder }),
            });

            if (response.ok) {
                await fetchCategories();
            }
        } catch (error) {
            console.error("Error updating category order:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5cd39]"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Event Categories</h1>
                        <p className="text-gray-600 mt-2">
                            Manage event categories to organize your events effectively
                        </p>
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="bg-[#a5cd39] hover:bg-[#8fb82e]"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </div>
            </motion.div>

            {/* Categories Table */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Categories ({categories.length})</CardTitle>
                        <CardDescription>
                            Organize your events with categories. Drag to reorder or use the arrow buttons.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categories.length === 0 ? (
                            <div className="text-center py-12">
                                <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No categories yet
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Create your first event category to get started
                                </p>
                                <Button
                                    onClick={handleCreate}
                                    className="bg-[#a5cd39] hover:bg-[#8fb82e]"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Category
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Color</TableHead>
                                        <TableHead>Events</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories
                                        .sort((a, b) => a.display_order - b.display_order)
                                        .map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => moveCategory(category.id, "up")}
                                                            disabled={category.display_order === 0}
                                                        >
                                                            <ArrowUp className="w-3 h-3" />
                                                        </Button>
                                                        <span className="text-sm text-gray-500 min-w-[20px] text-center">
                                                            {category.display_order + 1}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => moveCategory(category.id, "down")}
                                                        >
                                                            <ArrowDown className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{category.name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            /{category.slug}
                                                        </div>
                                                        {category.description && (
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                {category.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded-full border"
                                                            style={{ backgroundColor: category.color }}
                                                        />
                                                        <span className="text-sm font-mono">
                                                            {category.color}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">0 events</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={category.is_active}
                                                            onCheckedChange={(checked) =>
                                                                handleToggleActive(category.id, checked)
                                                            }
                                                        />
                                                        {category.is_active ? (
                                                            <Eye className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
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
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? "Edit Category" : "Create Category"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? "Update the category information below."
                                : "Add a new category to organize your events."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Category Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Technology, Healthcare"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug *</Label>
                            <Input
                                id="slug"
                                placeholder="technology-events"
                                value={formData.slug}
                                onChange={(e) => handleInputChange("slug", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of this category"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">Category Color</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    id="color"
                                    value={formData.color}
                                    onChange={(e) => handleInputChange("color", e.target.value)}
                                    className="w-12 h-10 rounded border cursor-pointer"
                                />
                                <Input
                                    value={formData.color}
                                    onChange={(e) => handleInputChange("color", e.target.value)}
                                    placeholder="#22c55e"
                                    className="font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-[#a5cd39] hover:bg-[#8fb82e]"
                            >
                                {saving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                {editingCategory ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default EventCategoriesPage;
