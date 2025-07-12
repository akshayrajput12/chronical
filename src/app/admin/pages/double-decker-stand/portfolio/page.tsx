"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
    Upload,
    Save,
    Eye,
    AlertCircle,
    Plus,
    Edit,
    Trash2,
    Image as ImageIcon,
} from "lucide-react";

interface PortfolioSection {
    id: string;
    main_heading: string;
    description: string | null;
    cta_button_text: string;
    cta_button_url: string;
    is_active: boolean;
}

interface PortfolioItem {
    id: string;
    title: string | null;
    description: string | null;
    alt_text: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
}

const DoubleDeckersPortfolioAdminPage = () => {
    const [sectionData, setSectionData] = useState<PortfolioSection | null>(
        null,
    );
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const supabase = createClient();

    // Load section and portfolio data
    const loadData = useCallback(async () => {
        try {
            setLoading(true);

            // Load section data
            const { data: sectionData, error: sectionError } = await supabase
                .from("double_decker_portfolio_sections")
                .select("*")
                .eq("is_active", true)
                .single();

            if (sectionError && sectionError.code !== "PGRST116") {
                throw sectionError;
            }

            if (sectionData) {
                setSectionData(sectionData);
            } else {
                // Create default section if none exists
                const { data: newSectionData, error: insertError } =
                    await supabase
                        .from("double_decker_portfolio_sections")
                        .insert({
                            main_heading:
                                "OUR DOUBLE DECKER EXHIBITION STANDS PORTFOLIO",
                            description:
                                "Explore our impressive collection of double decker exhibition stands that showcase our expertise in creating multi-level displays that captivate and engage.",
                            cta_button_text: "View All Projects",
                            cta_button_url: "/portfolio",
                            is_active: true,
                        })
                        .select()
                        .single();

                if (insertError) throw insertError;
                setSectionData(newSectionData);
            }

            // Load portfolio items
            const { data: itemsData, error: itemsError } = await supabase
                .from("double_decker_portfolio_items")
                .select("*")
                .order("display_order", { ascending: true });

            if (itemsError) throw itemsError;
            setPortfolioItems(itemsData || []);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load portfolio data");
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Handle section save
    const handleSaveSection = async () => {
        if (!sectionData) return;

        try {
            setSaving(true);
            const { error } = await supabase
                .from("double_decker_portfolio_sections")
                .update({
                    main_heading: sectionData.main_heading,
                    description: sectionData.description,
                    cta_button_text: sectionData.cta_button_text,
                    cta_button_url: sectionData.cta_button_url,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", sectionData.id);

            if (error) throw error;

            toast.success("Portfolio section updated successfully!");
        } catch (error) {
            console.error("Error saving section data:", error);
            toast.error("Failed to save portfolio section");
        } finally {
            setSaving(false);
        }
    };

    // Handle image upload
    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const fileExt = file.name.split(".").pop();
            const fileName = `portfolio-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("double-decker-portfolio-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage
                .from("double-decker-portfolio-images")
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
            return null;
        } finally {
            setUploading(false);
        }
    };

    // Handle portfolio item save
    const handleSaveItem = async () => {
        if (!editingItem) return;

        try {
            if (editingItem.id === "new") {
                // Create new item
                const { error } = await supabase
                    .from("double_decker_portfolio_items")
                    .insert({
                        title: editingItem.title,
                        description: editingItem.description,
                        alt_text: editingItem.alt_text,
                        image_url: editingItem.image_url,
                        display_order: portfolioItems.length + 1,
                        is_active: true,
                    });

                if (error) throw error;
                toast.success("Portfolio item created successfully!");
            } else {
                // Update existing item
                const { error } = await supabase
                    .from("double_decker_portfolio_items")
                    .update({
                        title: editingItem.title,
                        description: editingItem.description,
                        alt_text: editingItem.alt_text,
                        image_url: editingItem.image_url,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", editingItem.id);

                if (error) throw error;
                toast.success("Portfolio item updated successfully!");
            }

            setIsDialogOpen(false);
            setEditingItem(null);
            loadData();
        } catch (error) {
            console.error("Error saving item:", error);
            toast.error("Failed to save portfolio item");
        }
    };

    // Handle portfolio item delete
    const handleDeleteItem = async (id: string) => {
        if (!confirm("Are you sure you want to delete this portfolio item?"))
            return;

        try {
            const { error } = await supabase
                .from("double_decker_portfolio_items")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast.success("Portfolio item deleted successfully!");
            loadData();
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete portfolio item");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a5cd39]"></div>
            </div>
        );
    }

    if (!sectionData) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No section found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        There was an error loading the portfolio section data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Portfolio Section Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage the portfolio section and portfolio items
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Section Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Section Settings</CardTitle>
                        <CardDescription>
                            Edit the portfolio section heading and settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Main Heading */}
                        <div className="space-y-2">
                            <Label htmlFor="main_heading">Main Heading</Label>
                            <Textarea
                                id="main_heading"
                                value={sectionData.main_heading}
                                onChange={e =>
                                    setSectionData({
                                        ...sectionData,
                                        main_heading: e.target.value,
                                    })
                                }
                                placeholder="Enter main heading"
                                rows={2}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={sectionData.description || ""}
                                onChange={e =>
                                    setSectionData({
                                        ...sectionData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Enter description"
                                rows={3}
                            />
                        </div>

                        {/* CTA Button Text */}
                        <div className="space-y-2">
                            <Label htmlFor="cta_button_text">
                                CTA Button Text
                            </Label>
                            <Input
                                id="cta_button_text"
                                value={sectionData.cta_button_text}
                                onChange={e =>
                                    setSectionData({
                                        ...sectionData,
                                        cta_button_text: e.target.value,
                                    })
                                }
                                placeholder="Enter button text"
                            />
                        </div>

                        {/* CTA Button URL */}
                        <div className="space-y-2">
                            <Label htmlFor="cta_button_url">
                                CTA Button URL
                            </Label>
                            <Input
                                id="cta_button_url"
                                value={sectionData.cta_button_url}
                                onChange={e =>
                                    setSectionData({
                                        ...sectionData,
                                        cta_button_url: e.target.value,
                                    })
                                }
                                placeholder="Enter button URL"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <Button
                                onClick={handleSaveSection}
                                disabled={saving}
                                className="bg-[#a5cd39] hover:bg-[#8fb82e]"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? "Saving..." : "Save Section"}
                            </Button>
                            <Button variant="outline" asChild>
                                <a
                                    href="/double-decker-exhibition-stands-in-dubai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview Page
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Section Preview</CardTitle>
                        <CardDescription>
                            Preview how the portfolio section will appear
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            className="text-center space-y-4 p-4 bg-gray-900 text-white rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-lg font-bold uppercase tracking-wide">
                                {sectionData.main_heading}
                            </h2>

                            {sectionData.description && (
                                <p className="text-sm text-gray-300">
                                    {sectionData.description}
                                </p>
                            )}

                            <button className="bg-[#a5cd39] text-white px-6 py-2 rounded-lg font-semibold text-sm">
                                {sectionData.cta_button_text}
                            </button>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>

            {/* Portfolio Items Management */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Portfolio Items</CardTitle>
                            <CardDescription>
                                Manage portfolio items for the double decker
                                stands
                            </CardDescription>
                        </div>
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => {
                                        setEditingItem({
                                            id: "new",
                                            title: "",
                                            description: "",
                                            alt_text: "",
                                            image_url: "",
                                            display_order: 0,
                                            is_active: true,
                                        });
                                    }}
                                    className="bg-[#a5cd39] hover:bg-[#8fb82e]"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Item
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingItem?.id === "new"
                                            ? "Add"
                                            : "Edit"}{" "}
                                        Portfolio Item
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingItem?.id === "new"
                                            ? "Add a new"
                                            : "Edit the"}{" "}
                                        portfolio item details
                                    </DialogDescription>
                                </DialogHeader>
                                {editingItem && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="item_title">
                                                Title
                                            </Label>
                                            <Input
                                                id="item_title"
                                                value={editingItem.title || ""}
                                                onChange={e =>
                                                    setEditingItem({
                                                        ...editingItem,
                                                        title: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter title"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="item_description">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="item_description"
                                                value={
                                                    editingItem.description ||
                                                    ""
                                                }
                                                onChange={e =>
                                                    setEditingItem({
                                                        ...editingItem,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter description"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="item_alt_text">
                                                Alt Text
                                            </Label>
                                            <Input
                                                id="item_alt_text"
                                                value={editingItem.alt_text}
                                                onChange={e =>
                                                    setEditingItem({
                                                        ...editingItem,
                                                        alt_text:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter alt text"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="item_image">
                                                Image
                                            </Label>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async e => {
                                                        const url =
                                                            await handleImageUpload(
                                                                e,
                                                            );
                                                        if (url) {
                                                            setEditingItem({
                                                                ...editingItem,
                                                                image_url: url,
                                                            });
                                                        }
                                                    }}
                                                    disabled={uploading}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={uploading}
                                                >
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    {uploading
                                                        ? "Uploading..."
                                                        : "Upload"}
                                                </Button>
                                            </div>
                                        </div>

                                        {editingItem.image_url && (
                                            <div className="space-y-2">
                                                <Label>Preview</Label>
                                                <img
                                                    src={editingItem.image_url}
                                                    alt={editingItem.alt_text}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}

                                        <div className="flex space-x-2 pt-4">
                                            <Button
                                                onClick={handleSaveItem}
                                                className="bg-[#a5cd39] hover:bg-[#8fb82e] flex-1"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsDialogOpen(false);
                                                    setEditingItem(null);
                                                }}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {portfolioItems.length === 0 ? (
                        <div className="text-center py-8">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No portfolio items
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by adding your first portfolio item.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {portfolioItems.map(item => (
                                <div
                                    key={item.id}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    <img
                                        src={item.image_url}
                                        alt={item.alt_text}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h4 className="font-medium text-sm">
                                            {item.title || "Untitled"}
                                        </h4>
                                        {item.description && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingItem(item);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleDeleteItem(item.id)
                                            }
                                        >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DoubleDeckersPortfolioAdminPage;
