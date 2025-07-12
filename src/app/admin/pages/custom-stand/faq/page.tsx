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
    GripVertical,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
    getCustomExhibitionFAQSection,
    getCustomExhibitionFAQItems,
    saveCustomExhibitionFAQSection,
    saveCustomExhibitionFAQItem,
    deleteCustomExhibitionFAQItem,
    CustomExhibitionFAQSection,
    CustomExhibitionFAQItem,
} from "@/services/custom-exhibition-stands.service";

const CustomStandFAQEditor = () => {
    const [faqSection, setFaqSection] = useState<CustomExhibitionFAQSection>({
        title: "FREQUENTLY ASKED QUESTION (FAQ)",
        is_active: true,
    });

    const [faqItems, setFaqItems] = useState<CustomExhibitionFAQItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadFAQData();
    }, []);

    const loadFAQData = async () => {
        try {
            const [sectionData, itemsData] = await Promise.all([
                getCustomExhibitionFAQSection(),
                getCustomExhibitionFAQItems(),
            ]);

            if (sectionData) {
                setFaqSection(sectionData);
            }

            setFaqItems(itemsData);
        } catch (error) {
            console.error("Error loading FAQ data:", error);
            toast.error("Failed to load FAQ data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSection = async () => {
        setIsSaving(true);
        try {
            const success = await saveCustomExhibitionFAQSection(faqSection);
            if (success) {
                toast.success("FAQ section saved successfully!");
            } else {
                toast.error("Failed to save FAQ section");
            }
        } catch (error) {
            console.error("Error saving FAQ section:", error);
            toast.error("Failed to save FAQ section");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveItem = async (item: CustomExhibitionFAQItem) => {
        try {
            const success = await saveCustomExhibitionFAQItem(item);
            if (success) {
                toast.success("FAQ item saved successfully!");
                setEditingItem(null);
                loadFAQData(); // Reload to get updated data
            } else {
                toast.error("Failed to save FAQ item");
            }
        } catch (error) {
            console.error("Error saving FAQ item:", error);
            toast.error("Failed to save FAQ item");
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm("Are you sure you want to delete this FAQ item?")) {
            return;
        }

        try {
            const success = await deleteCustomExhibitionFAQItem(id);
            if (success) {
                toast.success("FAQ item deleted successfully!");
                loadFAQData(); // Reload to get updated data
            } else {
                toast.error("Failed to delete FAQ item");
            }
        } catch (error) {
            console.error("Error deleting FAQ item:", error);
            toast.error("Failed to delete FAQ item");
        }
    };

    const handleAddNewItem = () => {
        const newItem: CustomExhibitionFAQItem = {
            question: "",
            answer: "",
            list_items: [],
            display_order: faqItems.length + 1,
            is_active: true,
        };

        setFaqItems(prev => [...prev, newItem]);
        setEditingItem("new");
    };

    const handleUpdateItem = (
        index: number,
        field: keyof CustomExhibitionFAQItem,
        value: any,
    ) => {
        setFaqItems(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        );
    };

    const handleAddListItem = (index: number) => {
        setFaqItems(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, list_items: [...(item.list_items || []), ""] }
                    : item,
            ),
        );
    };

    const handleUpdateListItem = (
        itemIndex: number,
        listIndex: number,
        value: string,
    ) => {
        setFaqItems(prev =>
            prev.map((item, i) =>
                i === itemIndex
                    ? {
                          ...item,
                          list_items:
                              item.list_items?.map((listItem, li) =>
                                  li === listIndex ? value : listItem,
                              ) || [],
                      }
                    : item,
            ),
        );
    };

    const handleRemoveListItem = (itemIndex: number, listIndex: number) => {
        setFaqItems(prev =>
            prev.map((item, i) =>
                i === itemIndex
                    ? {
                          ...item,
                          list_items:
                              item.list_items?.filter(
                                  (_, li) => li !== listIndex,
                              ) || [],
                      }
                    : item,
            ),
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading FAQ section...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
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
                                    FAQ Section
                                </h1>
                                <p className="text-gray-600">
                                    Manage frequently asked questions
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

                {/* FAQ Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section Title
                        </label>
                        <input
                            type="text"
                            value={faqSection.title}
                            onChange={e =>
                                setFaqSection(prev => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter FAQ section title"
                        />
                    </div>
                </motion.div>

                {/* FAQ Items */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            FAQ Items
                        </h2>
                        <button
                            onClick={handleAddNewItem}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add FAQ Item
                        </button>
                    </div>

                    <div className="space-y-4">
                        {faqItems.map((item, index) => (
                            <FAQItemEditor
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
                                onAddListItem={() => handleAddListItem(index)}
                                onUpdateListItem={(listIndex, value) =>
                                    handleUpdateListItem(
                                        index,
                                        listIndex,
                                        value,
                                    )
                                }
                                onRemoveListItem={listIndex =>
                                    handleRemoveListItem(index, listIndex)
                                }
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// FAQ Item Editor Component
interface FAQItemEditorProps {
    item: CustomExhibitionFAQItem;
    index: number;
    isEditing: boolean;
    isExpanded: boolean;
    onToggleExpanded: () => void;
    onEdit: () => void;
    onSave: () => void;
    onDelete: () => void;
    onUpdate: (field: keyof CustomExhibitionFAQItem, value: any) => void;
    onAddListItem: () => void;
    onUpdateListItem: (listIndex: number, value: string) => void;
    onRemoveListItem: (listIndex: number) => void;
}

const FAQItemEditor: React.FC<FAQItemEditorProps> = ({
    item,
    index,
    isEditing,
    isExpanded,
    onToggleExpanded,
    onEdit,
    onSave,
    onDelete,
    onUpdate,
    onAddListItem,
    onUpdateListItem,
    onRemoveListItem,
}) => {
    return (
        <div className="border border-gray-200 rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50">
                <div className="flex items-center space-x-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                        FAQ Item #{item.display_order || index + 1}
                    </span>
                    {item.question && (
                        <span className="text-sm text-gray-500 truncate max-w-md">
                            {item.question}
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onToggleExpanded}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
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
                            {/* Question */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Question
                                </label>
                                <input
                                    type="text"
                                    value={item.question}
                                    onChange={e =>
                                        onUpdate("question", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter FAQ question"
                                />
                            </div>

                            {/* Answer */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Answer
                                </label>
                                <textarea
                                    value={item.answer}
                                    onChange={e =>
                                        onUpdate("answer", e.target.value)
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter FAQ answer"
                                />
                            </div>

                            {/* List Items */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        List Items (Optional)
                                    </label>
                                    <button
                                        onClick={onAddListItem}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                                {item.list_items?.map((listItem, listIndex) => (
                                    <div
                                        key={listIndex}
                                        className="flex items-center space-x-2 mb-2"
                                    >
                                        <input
                                            type="text"
                                            value={listItem}
                                            onChange={e =>
                                                onUpdateListItem(
                                                    listIndex,
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter list item"
                                        />
                                        <button
                                            onClick={() =>
                                                onRemoveListItem(listIndex)
                                            }
                                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Display Order */}
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
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="1"
                                />
                            </div>

                            {/* Save Button */}
                            {isEditing && (
                                <div className="flex justify-end">
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

export default CustomStandFAQEditor;
