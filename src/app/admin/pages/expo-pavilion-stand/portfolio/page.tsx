"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, Plus, Trash2, Upload, Edit } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ExpoPavilionPortfolioSection {
    id?: string;
    main_heading: string;
    sub_heading: string;
    description: string;
    cta_button_text: string;
    cta_button_url: string;
    is_active: boolean;
}

interface PortfolioItem {
    id?: string;
    title: string;
    description?: string;
    image_url: string;
    image_alt: string;
    project_url?: string;
    display_order: number;
    is_featured: boolean;
    is_active: boolean;
}

const ExpoPavilionPortfolioEditor = () => {
    const [sectionData, setSectionData] =
        useState<ExpoPavilionPortfolioSection | null>(null);

    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingItem, setEditingItem] = useState<number | null>(null);

    const supabase = createClient();

    const loadData = useCallback(async () => {
        try {
            // Load portfolio section data
            const { data: sectionData, error: sectionError } = await supabase
                .from("expo_pavilion_portfolio_sections")
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
                        .from("expo_pavilion_portfolio_sections")
                        .insert({
                            main_heading: "OUR RECENT WORK",
                            sub_heading: "PORTFOLIO",
                            description:
                                "Check out our portfolio for the success stories of brands that trusted us as their custom exhibition stand contractor. Our recent work includes a diverse range of custom stand designs.",
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
                .from("expo_pavilion_portfolio_items")
                .select("*")
                .eq("is_active", true)
                .order("display_order");

            if (itemsError) throw itemsError;

            setPortfolioItems(itemsData || []);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load portfolio data");
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSaveSection = async () => {
        setIsSaving(true);
        try {
            if (!sectionData) return;

            const { data, error } = await supabase
                .from("expo_pavilion_portfolio_sections")
                .upsert(sectionData, { onConflict: "id" })
                .select()
                .single();

            if (error) throw error;

            setSectionData(data);
            toast.success("Portfolio section updated successfully!");
        } catch (error) {
            console.error("Error saving section data:", error);
            toast.error("Failed to save section data");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveItems = async () => {
        setIsSaving(true);
        try {
            for (const item of portfolioItems) {
                const { error } = await supabase
                    .from("expo_pavilion_portfolio_items")
                    .upsert(item, { onConflict: "id" });

                if (error) throw error;
            }

            toast.success("Portfolio items updated successfully!");
        } catch (error) {
            console.error("Error saving portfolio items:", error);
            toast.error("Failed to save portfolio items");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        itemIndex: number,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `portfolio-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("expo-pavilion-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage
                .from("expo-pavilion-images")
                .getPublicUrl(filePath);

            updatePortfolioItem(itemIndex, "image_url", publicUrl);

            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const addPortfolioItem = () => {
        const newItem: PortfolioItem = {
            title: "New Portfolio Item",
            description: "",
            image_url:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s",
            image_alt: "Portfolio Item",
            project_url: "",
            display_order: portfolioItems.length + 1,
            is_featured: false,
            is_active: true,
        };
        setPortfolioItems([...portfolioItems, newItem]);
        setEditingItem(portfolioItems.length);
    };

    const updatePortfolioItem = (
        index: number,
        field: keyof PortfolioItem,
        value: any,
    ) => {
        const updatedItems = [...portfolioItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setPortfolioItems(updatedItems);
    };

    const removePortfolioItem = (index: number) => {
        const updatedItems = portfolioItems.filter((_, i) => i !== index);
        // Update display orders
        updatedItems.forEach((item, i) => {
            item.display_order = i + 1;
        });
        setPortfolioItems(updatedItems);
        setEditingItem(null);
    };

    if (isLoading || !sectionData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
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
                                href="/admin/pages/expo-pavilion-stand"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Portfolio Section
                                </h1>
                                <p className="text-gray-600">
                                    Manage the portfolio showcase and project
                                    gallery
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/country-pavilion-expo-booth-solutions-in-dubai"
                                target="_blank"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Link>
                            <Button
                                onClick={handleSaveSection}
                                disabled={isSaving}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Section
                            </Button>
                            <Button
                                onClick={handleSaveItems}
                                disabled={isSaving}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Items
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Section Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Settings</CardTitle>
                                <CardDescription>
                                    Configure the portfolio section headings and
                                    CTA
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="sub_heading">
                                        Sub Heading
                                    </Label>
                                    <Input
                                        id="sub_heading"
                                        value={sectionData.sub_heading}
                                        onChange={e =>
                                            setSectionData(prev =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          sub_heading:
                                                              e.target.value,
                                                      }
                                                    : null,
                                            )
                                        }
                                        placeholder="Enter sub heading"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="main_heading">
                                        Main Heading
                                    </Label>
                                    <Input
                                        id="main_heading"
                                        value={sectionData.main_heading}
                                        onChange={e =>
                                            setSectionData(prev =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          main_heading:
                                                              e.target.value,
                                                      }
                                                    : null,
                                            )
                                        }
                                        placeholder="Enter main heading"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={sectionData.description}
                                        onChange={e =>
                                            setSectionData(prev =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          description:
                                                              e.target.value,
                                                      }
                                                    : null,
                                            )
                                        }
                                        placeholder="Enter section description"
                                        rows={4}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cta_button_text">
                                        CTA Button Text
                                    </Label>
                                    <Input
                                        id="cta_button_text"
                                        value={sectionData.cta_button_text}
                                        onChange={e =>
                                            setSectionData(prev =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          cta_button_text:
                                                              e.target.value,
                                                      }
                                                    : null,
                                            )
                                        }
                                        placeholder="Enter button text"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cta_button_url">
                                        CTA Button URL
                                    </Label>
                                    <Input
                                        id="cta_button_url"
                                        value={sectionData.cta_button_url}
                                        onChange={e =>
                                            setSectionData(prev =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          cta_button_url:
                                                              e.target.value,
                                                      }
                                                    : null,
                                            )
                                        }
                                        placeholder="Enter button URL"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={sectionData.is_active}
                                        onCheckedChange={checked =>
                                            setSectionData(prev =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          is_active: checked,
                                                      }
                                                    : null,
                                            )
                                        }
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Preview</CardTitle>
                                <CardDescription>
                                    Preview how the portfolio section will
                                    appear
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <motion.div
                                    className="text-center space-y-4 p-4 bg-gray-900 text-white rounded-lg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2 className="text-[#a5cd39] text-sm font-semibold tracking-wider">
                                        {sectionData.sub_heading}
                                    </h2>

                                    <h1 className="text-lg font-bold">
                                        {sectionData.main_heading}
                                    </h1>

                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {sectionData.description}
                                    </p>

                                    <button className="bg-[#a5cd39] text-white px-6 py-2 rounded-lg font-semibold text-sm">
                                        {sectionData.cta_button_text}
                                    </button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Portfolio Items Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Portfolio Items</CardTitle>
                                    <CardDescription>
                                        Manage the portfolio project gallery (
                                        {portfolioItems.length} items)
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={addPortfolioItem}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Item
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {portfolioItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-4 space-y-4"
                                    >
                                        <div className="relative h-32 rounded overflow-hidden">
                                            <img
                                                src={item.image_url}
                                                alt={item.image_alt}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 right-2 flex space-x-1">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        setEditingItem(
                                                            editingItem ===
                                                                index
                                                                ? null
                                                                : index,
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 p-1"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        removePortfolioItem(
                                                            index,
                                                        )
                                                    }
                                                    variant="destructive"
                                                    className="p-1"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        {editingItem === index ? (
                                            <div className="space-y-3">
                                                <Input
                                                    value={item.title}
                                                    onChange={e =>
                                                        updatePortfolioItem(
                                                            index,
                                                            "title",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Item title"
                                                    className="text-sm"
                                                />
                                                <Input
                                                    value={item.image_url}
                                                    onChange={e =>
                                                        updatePortfolioItem(
                                                            index,
                                                            "image_url",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Image URL"
                                                    className="text-sm"
                                                />
                                                <Input
                                                    value={item.image_alt}
                                                    onChange={e =>
                                                        updatePortfolioItem(
                                                            index,
                                                            "image_alt",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Image alt text"
                                                    className="text-sm"
                                                />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e =>
                                                        handleImageUpload(
                                                            e,
                                                            index,
                                                        )
                                                    }
                                                    disabled={isUploading}
                                                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        checked={
                                                            item.is_featured
                                                        }
                                                        onCheckedChange={checked =>
                                                            updatePortfolioItem(
                                                                index,
                                                                "is_featured",
                                                                checked,
                                                            )
                                                        }
                                                    />
                                                    <Label className="text-xs">
                                                        Featured
                                                    </Label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <h4 className="font-medium text-sm">
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-gray-500">
                                                    Order: {item.display_order}
                                                </p>
                                                {item.is_featured && (
                                                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default ExpoPavilionPortfolioEditor;
