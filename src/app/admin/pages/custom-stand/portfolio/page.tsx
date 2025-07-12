"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save,
    Plus,
    Trash2,
    Edit,
    Eye,
    ArrowLeft,
    Upload,
    GripVertical,
    Star,
    StarOff,
    Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
    getCustomExhibitionPortfolioData,
    saveCustomExhibitionPortfolioSection,
    saveCustomExhibitionPortfolioItem,
    deleteCustomExhibitionPortfolioItem,
    uploadCustomExhibitionPortfolioImage,
    type CustomExhibitionPortfolioData,
    type CustomExhibitionPortfolioSection,
    type CustomExhibitionPortfolioItem,
} from "@/services/custom-exhibition-portfolio.service";

const CustomStandPortfolioEditor = () => {
    const [portfolioData, setPortfolioData] =
        useState<CustomExhibitionPortfolioData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadPortfolioData();
    }, []);

    const loadPortfolioData = async () => {
        try {
            const data = await getCustomExhibitionPortfolioData();
            setPortfolioData(data);
        } catch (error) {
            console.error("Error loading portfolio data:", error);
            toast.error("Failed to load portfolio data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSection = async () => {
        if (!portfolioData?.section) return;

        setIsSaving(true);
        try {
            const success = await saveCustomExhibitionPortfolioSection(
                portfolioData.section,
            );
            if (success) {
                toast.success("Portfolio section saved successfully!");
            } else {
                toast.error("Failed to save portfolio section");
            }
        } catch (error) {
            console.error("Error saving portfolio section:", error);
            toast.error("Failed to save portfolio section");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveItem = async (item: CustomExhibitionPortfolioItem) => {
        try {
            const success = await saveCustomExhibitionPortfolioItem(item);
            if (success) {
                toast.success("Portfolio item saved successfully!");
                setEditingItem(null);
                loadPortfolioData(); // Reload to get updated data
            } else {
                toast.error("Failed to save portfolio item");
            }
        } catch (error) {
            console.error("Error saving portfolio item:", error);
            toast.error("Failed to save portfolio item");
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm("Are you sure you want to delete this portfolio item?")) {
            return;
        }

        try {
            const success = await deleteCustomExhibitionPortfolioItem(id);
            if (success) {
                toast.success("Portfolio item deleted successfully!");
                loadPortfolioData(); // Reload to get updated data
            } else {
                toast.error("Failed to delete portfolio item");
            }
        } catch (error) {
            console.error("Error deleting portfolio item:", error);
            toast.error("Failed to delete portfolio item");
        }
    };

    const handleAddNewItem = () => {
        const newItem: CustomExhibitionPortfolioItem = {
            title: "New Portfolio Item",
            description: "",
            client_name: "",
            project_year: new Date().getFullYear(),
            project_location: "",
            image_url: "",
            image_alt: "Portfolio project image",
            category: "Exhibition Stand",
            tags: [],
            display_order: (portfolioData?.items.length || 0) + 1,
            is_featured: false,
            is_active: true,
        };

        setPortfolioData(prev =>
            prev
                ? {
                      ...prev,
                      items: [...prev.items, newItem],
                  }
                : null,
        );
        setEditingItem("new");
    };

    const handleUpdateSection = (
        field: keyof CustomExhibitionPortfolioSection,
        value: string,
    ) => {
        setPortfolioData(prev =>
            prev
                ? {
                      ...prev,
                      section: prev.section
                          ? { ...prev.section, [field]: value }
                          : null,
                  }
                : null,
        );
    };

    const handleUpdateItem = (
        index: number,
        field: keyof CustomExhibitionPortfolioItem,
        value: any,
    ) => {
        setPortfolioData(prev =>
            prev
                ? {
                      ...prev,
                      items: prev.items.map((item, i) =>
                          i === index ? { ...item, [field]: value } : item,
                      ),
                  }
                : null,
        );
    };

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handleImageUpload = async (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size must be less than 10MB");
            return;
        }

        try {
            const uploadedImage = await uploadCustomExhibitionPortfolioImage(
                file,
                "Portfolio project image",
            );

            if (uploadedImage) {
                handleUpdateItem(index, "image_url", uploadedImage.image_url);
                handleUpdateItem(
                    index,
                    "image_file_path",
                    uploadedImage.image_file_path,
                );
                handleUpdateItem(
                    index,
                    "image_file_size",
                    uploadedImage.image_file_size,
                );
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Loading portfolio section...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/admin/pages/custom-stand"
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Portfolio Section
                                </h1>
                                <p className="text-gray-600">
                                    Manage portfolio content and showcase
                                    projects
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/custom-exhibition-stands-dubai-uae"
                                target="_blank"
                                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Link>
                            <button
                                onClick={handleSaveSection}
                                disabled={isSaving}
                                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? "Saving..." : "Save Section"}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Portfolio Section Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Section Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section Title
                            </label>
                            <input
                                type="text"
                                value={
                                    portfolioData?.section?.section_title || ""
                                }
                                onChange={e =>
                                    handleUpdateSection(
                                        "section_title",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., PORTFOLIO"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Main Title
                            </label>
                            <input
                                type="text"
                                value={portfolioData?.section?.main_title || ""}
                                onChange={e =>
                                    handleUpdateSection(
                                        "main_title",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., OUR RECENT WORK"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={
                                    portfolioData?.section?.description || ""
                                }
                                onChange={e =>
                                    handleUpdateSection(
                                        "description",
                                        e.target.value,
                                    )
                                }
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter section description"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CTA Button Text
                            </label>
                            <input
                                type="text"
                                value={portfolioData?.section?.cta_text || ""}
                                onChange={e =>
                                    handleUpdateSection(
                                        "cta_text",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., View All Projects"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CTA Button URL
                            </label>
                            <input
                                type="url"
                                value={portfolioData?.section?.cta_url || ""}
                                onChange={e =>
                                    handleUpdateSection(
                                        "cta_url",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter button URL"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Portfolio Items */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Portfolio Items
                        </h2>
                        <button
                            onClick={handleAddNewItem}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Portfolio Item
                        </button>
                    </div>

                    <div className="space-y-4">
                        {portfolioData?.items.map((item, index) => (
                            <PortfolioItemEditor
                                key={item.id || `new-${index}`}
                                item={item}
                                index={index}
                                isEditing={editingItem === (item.id || "new")}
                                isExpanded={expandedItems.has(
                                    item.id || `new-${index}`,
                                )}
                                onToggleExpanded={() =>
                                    toggleExpanded(item.id || `new-${index}`)
                                }
                                onEdit={() => setEditingItem(item.id || "new")}
                                onSave={() => handleSaveItem(item)}
                                onDelete={() =>
                                    item.id && handleDeleteItem(item.id)
                                }
                                onUpdate={(field, value) =>
                                    handleUpdateItem(index, field, value)
                                }
                                onImageUpload={event =>
                                    handleImageUpload(index, event)
                                }
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Portfolio Item Editor Component
interface PortfolioItemEditorProps {
    item: CustomExhibitionPortfolioItem;
    index: number;
    isEditing: boolean;
    isExpanded: boolean;
    onToggleExpanded: () => void;
    onEdit: () => void;
    onSave: () => void;
    onDelete: () => void;
    onUpdate: (field: keyof CustomExhibitionPortfolioItem, value: any) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PortfolioItemEditor: React.FC<PortfolioItemEditorProps> = ({
    item,
    index,
    isEditing,
    isExpanded,
    onToggleExpanded,
    onEdit,
    onSave,
    onDelete,
    onUpdate,
    onImageUpload,
}) => {
    const handleTagsChange = (value: string) => {
        const tags = value
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        onUpdate("tags", tags);
    };

    return (
        <div className="border border-gray-200 rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50">
                <div className="flex items-center space-x-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                        Item #{item.display_order || index + 1}
                    </span>
                    {item.title && (
                        <span className="text-sm text-gray-500 truncate max-w-md">
                            {item.title}
                        </span>
                    )}
                    {item.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onToggleExpanded}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                        {isExpanded ? (
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 180 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ArrowLeft className="w-4 h-4 rotate-90" />
                            </motion.div>
                        ) : (
                            <ArrowLeft className="w-4 h-4 -rotate-90" />
                        )}
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {/* Image Preview */}
                            {item.image_url && (
                                <div className="mb-4">
                                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={item.image_url}
                                            alt={
                                                item.image_alt ||
                                                "Portfolio item"
                                            }
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={e =>
                                            onUpdate("title", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter project title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Client Name
                                    </label>
                                    <input
                                        type="text"
                                        value={item.client_name || ""}
                                        onChange={e =>
                                            onUpdate(
                                                "client_name",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter client name"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={item.description || ""}
                                    onChange={e =>
                                        onUpdate("description", e.target.value)
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter project description"
                                />
                            </div>

                            {/* Project Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Year
                                    </label>
                                    <input
                                        type="number"
                                        value={item.project_year || ""}
                                        onChange={e =>
                                            onUpdate(
                                                "project_year",
                                                parseInt(e.target.value) ||
                                                    null,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="2024"
                                        min="2000"
                                        max={new Date().getFullYear() + 1}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={item.project_location || ""}
                                        onChange={e =>
                                            onUpdate(
                                                "project_location",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Dubai, UAE"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={item.category || ""}
                                        onChange={e =>
                                            onUpdate("category", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Exhibition Stand"
                                    />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Image *
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={onImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <div className="flex-1">
                                        <input
                                            type="url"
                                            value={item.image_url}
                                            onChange={e =>
                                                onUpdate(
                                                    "image_url",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Or enter image URL"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Image Alt Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image Alt Text
                                </label>
                                <input
                                    type="text"
                                    value={item.image_alt}
                                    onChange={e =>
                                        onUpdate("image_alt", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe the image for accessibility"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={item.tags?.join(", ") || ""}
                                    onChange={e =>
                                        handleTagsChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Modern, Interactive, Technology, LED"
                                />
                            </div>

                            {/* Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={item.display_order}
                                        onChange={e =>
                                            onUpdate(
                                                "display_order",
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="1"
                                    />
                                </div>
                                <div className="flex items-center space-x-4 pt-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={item.is_featured}
                                            onChange={e =>
                                                onUpdate(
                                                    "is_featured",
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Featured
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={item.is_active}
                                            onChange={e =>
                                                onUpdate(
                                                    "is_active",
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Active
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Save Button */}
                            {isEditing && (
                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={onSave}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Item
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomStandPortfolioEditor;
