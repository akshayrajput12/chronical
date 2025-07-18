"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
    Save,
    Eye,
    Upload,
    Trash2,
    Info,
    CheckCircle,
    XCircle,
    AlertCircle,
    X,
    Plus,
    Edit,
    Grid,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type {
    PortfolioItem,
    PortfolioItemInput,
    PortfolioNotification,
    GridClass,
} from "@/types/portfolio-gallery";
import { GRID_CLASS_OPTIONS } from "@/types/portfolio-gallery";
import { revalidatePathAction } from "@/services/revalidate.action";

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

const PortfolioGalleryEditor = () => {
    // State management
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state for new/edit item
    const [editingItem, setEditingItem] = useState<
        (PortfolioItemInput & { id?: string }) | null
    >(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    // Notification state
    const [notification, setNotification] = useState<PortfolioNotification>({
        show: false,
        type: "info",
        title: "",
        message: "",
    });

    // Drag and drop state
    const [dragOver, setDragOver] = useState(false);

    // Notification helper
    const showNotification = useCallback(
        (
            type: "success" | "error" | "info",
            title: string,
            message: string,
        ) => {
            setNotification({ show: true, type, title, message });
            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 5000);
        },
        [],
    );

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, itemId?: string) => {
        e.preventDefault();
        setDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(file => file.type.startsWith("image/"));

        if (imageFile) {
            // Create a fake event object for the upload handler
            const fakeEvent = {
                target: { files: [imageFile] },
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            handleDirectImageUpload(fakeEvent, itemId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Check and ensure storage bucket exists
    const ensureStorageBucket = useCallback(async () => {
        try {
            const { data: buckets, error: listError } =
                await supabase.storage.listBuckets();

            if (listError) {
                console.error("Error listing buckets:", listError);
                // Don't fail completely, just warn and continue
                console.warn(
                    "Could not verify bucket existence, but continuing with upload attempt",
                );
                return true;
            }

            const portfolioBucket = buckets.find(
                bucket => bucket.id === "portfolio-gallery-images",
            );

            if (!portfolioBucket) {
                console.warn(
                    "Portfolio gallery images bucket not found in bucket list",
                );
                // Try to test bucket access directly instead of failing
                try {
                    const { error: testError } = await supabase.storage
                        .from("portfolio-gallery-images")
                        .list("", { limit: 1 });

                    if (testError) {
                        console.error("Bucket access test failed:", testError);
                        showNotification(
                            "error",
                            "Storage Setup Required",
                            "Portfolio gallery storage bucket is not accessible. Please run the setup script.",
                        );
                        return false;
                    } else {
                        console.log(
                            "Bucket access test passed, bucket exists but not in list",
                        );
                        return true;
                    }
                } catch (accessError) {
                    console.error("Bucket access test error:", accessError);
                    showNotification(
                        "error",
                        "Storage Setup Required",
                        "Portfolio gallery storage bucket is not configured. Please contact administrator.",
                    );
                    return false;
                }
            }

            console.log("Portfolio gallery bucket found and verified");
            return true;
        } catch (error) {
            console.error("Error checking storage bucket:", error);
            // Don't fail completely, just warn and continue
            console.warn(
                "Bucket check failed, but continuing with upload attempt",
            );
            return true;
        }
    }, [showNotification]);

    const loadPortfolioData = useCallback(async () => {
        try {
            setLoading(true);

            // Check storage bucket first
            const bucketExists = await ensureStorageBucket();
            if (!bucketExists) {
                console.warn(
                    "Storage bucket check failed, but continuing with data load",
                );
            }

            const { data, error } = await supabase
                .from("portfolio_items")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;

            if (data) {
                setItems(data);
            }
        } catch (error) {
            console.error("Error loading portfolio items:", error);
            showNotification(
                "error",
                "Error",
                "Failed to load portfolio items",
            );
        } finally {
            setLoading(false);
        }
    }, [showNotification, ensureStorageBucket]);

    // Load existing data
    useEffect(() => {
        loadPortfolioData();
    }, [loadPortfolioData]);

    // Form handlers
    const handleNewItem = () => {
        setEditingItem({
            title: "",
            description: "",
            alt_text: "",
            grid_class: "row-span-1",
            display_order: items.length + 1,
            image_url: "",
            is_active: true,
        });
        setIsEditing(true);
    };

    const handleEditItem = (item: PortfolioItem) => {
        setEditingItem({
            id: item.id,
            title: item.title || "",
            description: item.description || "",
            alt_text: item.alt_text,
            grid_class: item.grid_class,
            display_order: item.display_order,
            image_id: item.image_id,
            image_url: item.image_url || "",
            is_active: item.is_active,
        });
        setEditingItemId(item.id);
        setIsEditing(true);
    };

    const handleInputChange = (
        field: keyof PortfolioItemInput,
        value: string | number,
    ) => {
        if (!editingItem) return;
        setEditingItem(prev => ({
            ...prev!,
            [field]: value,
        }));
    };

    const savePortfolioItem = async () => {
        if (!editingItem) return;

        setSaving(true);
        try {
            if (isEditing && editingItemId) {
                // Update existing item - exclude id from update data
                const { id, ...updateData } = editingItem;
                const { error } = await supabase
                    .from("portfolio_items")
                    .update(updateData)
                    .eq("id", editingItemId);

                if (error) throw error;
            } else {
                // Create new item - exclude id from insert data
                const { id, ...insertData } = editingItem;
                const { error } = await supabase
                    .from("portfolio_items")
                    .insert([insertData]);

                if (error) throw error;
            }

            await loadPortfolioData();
            setEditingItem(null);
            setEditingItemId(null);
            setIsEditing(false);

            // Revalidate cache for portfolio page
            await revalidatePathAction("/portfolio");

            showNotification(
                "success",
                "Success!",
                `Portfolio item ${
                    isEditing ? "updated" : "created"
                } successfully!`,
            );
        } catch (error) {
            console.error("Error saving portfolio item:", error);
            showNotification(
                "error",
                "Save Failed",
                "Error saving portfolio item. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    const deletePortfolioItem = async (itemId: string) => {
        if (!confirm("Are you sure you want to delete this portfolio item?"))
            return;

        try {
            const { error } = await supabase
                .from("portfolio_items")
                .delete()
                .eq("id", itemId);

            if (error) throw error;

            await loadPortfolioData();

            // Revalidate cache for portfolio page
            await revalidatePathAction("/portfolio");

            showNotification(
                "success",
                "Success!",
                "Portfolio item deleted successfully!",
            );
        } catch (error) {
            console.error("Error deleting portfolio item:", error);
            showNotification(
                "error",
                "Delete Failed",
                "Error deleting portfolio item. Please try again.",
            );
        }
    };

    // Direct image upload for portfolio items
    const handleDirectImageUpload = useCallback(async (
        event: React.ChangeEvent<HTMLInputElement>,
        itemId?: string,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            showNotification(
                "error",
                "Invalid File Type",
                "Please upload a JPG, PNG, or WebP image.",
            );
            return;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showNotification(
                "error",
                "File Too Large",
                "Please upload an image smaller than 10MB.",
            );
            return;
        }

        setUploading(true);
        try {
            console.log(
                "Starting image upload for file:",
                file.name,
                "Size:",
                file.size,
                "Type:",
                file.type,
            );

            // Check if storage bucket exists (but don't fail if check fails)
            const bucketExists = await ensureStorageBucket();
            if (!bucketExists) {
                console.warn(
                    "Bucket check failed, but attempting upload anyway",
                );
            }

            // Generate unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `portfolio-gallery/${fileName}`;

            console.log("Uploading to path:", filePath);

            // Upload file to Supabase storage
            const { data: uploadData, error: uploadError } =
                await supabase.storage
                    .from("portfolio-gallery-images")
                    .upload(filePath, file);

            if (uploadError) {
                console.error("Storage upload error:", uploadError);
                throw new Error(
                    `Storage upload failed: ${uploadError.message}`,
                );
            }

            console.log("File uploaded successfully:", uploadData);

            // Save image metadata to database
            const imageMetadata = {
                filename: fileName,
                original_filename: file.name,
                file_path: filePath,
                file_size: file.size,
                mime_type: file.type,
                alt_text: "Portfolio gallery image",
                is_active: true,
                display_order: 1,
            };

            console.log("Saving image metadata:", imageMetadata);

            const { data: imageData, error: dbError } = await supabase
                .from("portfolio_images")
                .insert([imageMetadata])
                .select()
                .single();

            if (dbError) {
                console.error("Database insert error:", dbError);
                throw new Error(`Database insert failed: ${dbError.message}`);
            }

            console.log("Image metadata saved:", imageData);

            // Get the public URL for the uploaded image
            const { data: urlData } = supabase.storage
                .from("portfolio-gallery-images")
                .getPublicUrl(filePath);

            console.log("Public URL generated:", urlData.publicUrl);

            // If itemId is provided, update existing item
            if (itemId) {
                console.log("Updating existing portfolio item:", itemId);
                const { error: updateError } = await supabase
                    .from("portfolio_items")
                    .update({
                        image_id: imageData.id,
                        image_url: urlData.publicUrl,
                    })
                    .eq("id", itemId);

                if (updateError) {
                    console.error("Portfolio item update error:", updateError);
                    throw new Error(
                        `Portfolio item update failed: ${updateError.message}`,
                    );
                }
                await loadPortfolioData();

                // Revalidate cache for portfolio page
                await revalidatePathAction("/portfolio");
            } else {
                // If no itemId, update the editing form
                console.log("Updating editing form with new image");
                if (editingItem) {
                    setEditingItem(prev => ({
                        ...prev!,
                        image_id: imageData.id,
                        image_url: urlData.publicUrl,
                    }));
                }
            }

            showNotification(
                "success",
                "Success!",
                "Image uploaded successfully!",
            );
        } catch (error) {
            console.error("Error uploading image:", {
                message:
                    error instanceof Error ? error.message : "Unknown error",
                error: error,
                stack: error instanceof Error ? error.stack : undefined,
            });

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred";
            showNotification("error", "Upload Failed", errorMessage);
        } finally {
            setUploading(false);
        }
    }, [ensureStorageBucket, showNotification, loadPortfolioData, editingItem, setEditingItem]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39]"></div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Portfolio Gallery
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage portfolio gallery items and images
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open("/portfolio", "_blank")}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={handleNewItem}
                        className="bg-[#a5cd39] hover:bg-[#94b933]"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                    </Button>
                </div>
            </motion.div>

            {/* Info Banner */}
            <motion.div
                variants={itemVariants}
                className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-start gap-3"
            >
                <Info
                    className="text-blue-500 mt-0.5 flex-shrink-0"
                    size={18}
                />
                <div>
                    <h3 className="font-medium text-blue-700 mb-1">
                        Portfolio Gallery Management
                    </h3>
                    <p className="text-blue-600 text-sm mb-2">
                        Manage your portfolio gallery with dynamic content and
                        image uploads.
                    </p>
                    <ul className="text-blue-600 text-sm space-y-1">
                        <li>
                            • <strong>Add Items:</strong> Click "Add Item" to
                            create new portfolio entries
                        </li>
                        <li>
                            • <strong>Upload Images:</strong> Click the upload
                            areas or drag & drop images directly
                        </li>
                        <li>
                            • <strong>Grid Sizes:</strong> Choose different
                            sizes (1x1, 1x2, 1x3) for varied layouts
                        </li>
                        <li>
                            • <strong>Organize:</strong> Use display order to
                            arrange items as needed
                        </li>
                    </ul>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div variants={itemVariants}>
                <Tabs defaultValue="items" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="items">Portfolio Items</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    {/* Portfolio Items Tab */}
                    <TabsContent value="items" className="space-y-6">
                        {/* Add/Edit Item Form */}
                        {editingItem && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {isEditing
                                            ? "Edit Portfolio Item"
                                            : "Add New Portfolio Item"}
                                    </CardTitle>
                                    <CardDescription>
                                        Configure the portfolio item details and
                                        layout
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Title */}
                                        <div className="space-y-2">
                                            <Label htmlFor="title">
                                                Title (Optional)
                                            </Label>
                                            <Input
                                                id="title"
                                                value={editingItem.title || ""}
                                                onChange={e =>
                                                    handleInputChange(
                                                        "title",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter portfolio item title"
                                            />
                                        </div>

                                        {/* Grid Class */}
                                        <div className="space-y-2">
                                            <Label htmlFor="grid_class">
                                                Size
                                            </Label>
                                            <Select
                                                value={editingItem.grid_class}
                                                onValueChange={(
                                                    value: GridClass,
                                                ) =>
                                                    handleInputChange(
                                                        "grid_class",
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(
                                                        GRID_CLASS_OPTIONS,
                                                    ).map(([value, label]) => (
                                                        <SelectItem
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Description (Optional)
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={
                                                editingItem.description || ""
                                            }
                                            onChange={e =>
                                                handleInputChange(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter portfolio item description"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Alt Text */}
                                    <div className="space-y-2">
                                        <Label htmlFor="alt_text">
                                            Alt Text *
                                        </Label>
                                        <Input
                                            id="alt_text"
                                            value={editingItem.alt_text}
                                            onChange={e =>
                                                handleInputChange(
                                                    "alt_text",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter alt text for accessibility"
                                            required
                                        />
                                    </div>

                                    {/* Image Upload Section */}
                                    <div className="space-y-3">
                                        <Label>Image</Label>
                                        <div
                                            className={`border-2 border-dashed rounded-lg p-6 transition-colors relative ${
                                                uploading
                                                    ? "border-[#a5cd39] bg-green-50"
                                                    : dragOver
                                                    ? "border-[#a5cd39] bg-green-50"
                                                    : "border-gray-300 hover:border-gray-400"
                                            }`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={e =>
                                                handleDrop(e, editingItem?.id)
                                            }
                                        >
                                            {uploading && (
                                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                                                    <div className="flex items-center gap-2 text-[#a5cd39]">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#a5cd39] border-t-transparent"></div>
                                                        <span className="text-sm font-medium">
                                                            Uploading...
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {editingItem.image_url ? (
                                                <div className="space-y-3">
                                                    <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                                                        <img
                                                            src={
                                                                editingItem.image_url
                                                            }
                                                            alt={
                                                                editingItem.alt_text ||
                                                                "Preview"
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label
                                                            htmlFor="form-image-upload"
                                                            className={`cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a5cd39] ${
                                                                uploading
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <Upload className="w-4 h-4 mr-2" />
                                                            Replace Image
                                                        </label>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleInputChange(
                                                                    "image_url",
                                                                    "",
                                                                )
                                                            }
                                                            disabled={uploading}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="mt-4">
                                                        <label
                                                            htmlFor="form-image-upload"
                                                            className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#a5cd39] hover:bg-[#94b933] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a5cd39] ${
                                                                uploading
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <Upload className="w-4 h-4 mr-2" />
                                                            Upload Image
                                                        </label>
                                                        <p className="mt-2 text-sm text-gray-500">
                                                            Drag & drop an image
                                                            here, or enter URL
                                                            below
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (file) {
                                                        // For new items (no ID yet), pass undefined
                                                        // For existing items, pass the ID
                                                        handleDirectImageUpload(
                                                            e,
                                                            editingItem?.id,
                                                        );
                                                    }
                                                }}
                                                disabled={uploading}
                                                className="hidden"
                                                id="form-image-upload"
                                            />
                                        </div>

                                        {/* Manual URL Input */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="image_url"
                                                className="text-sm text-gray-600"
                                            >
                                                Or enter image URL manually
                                            </Label>
                                            <Input
                                                id="image_url"
                                                value={
                                                    editingItem.image_url || ""
                                                }
                                                onChange={e =>
                                                    handleInputChange(
                                                        "image_url",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="https://example.com/image.jpg"
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Display Order */}
                                    <div className="space-y-2">
                                        <Label htmlFor="display_order">
                                            Display Order
                                        </Label>
                                        <Input
                                            id="display_order"
                                            type="number"
                                            value={editingItem.display_order}
                                            onChange={e =>
                                                handleInputChange(
                                                    "display_order",
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            placeholder="Enter display order"
                                            min="0"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-4">
                                        <Button
                                            onClick={savePortfolioItem}
                                            disabled={
                                                saving || !editingItem.alt_text
                                            }
                                            className="bg-[#a5cd39] hover:bg-[#94b933]"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Item
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEditingItem(null);
                                                setEditingItemId(null);
                                                setIsEditing(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Portfolio Items List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Portfolio Items ({items.length})
                                </CardTitle>
                                <CardDescription>
                                    Manage your portfolio gallery items
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {items.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {items.map(item => (
                                            <div
                                                key={item.id}
                                                className="border rounded-lg p-4 space-y-3"
                                            >
                                                {/* Item Preview with Upload */}
                                                <div
                                                    className={`aspect-video bg-gray-100 rounded overflow-hidden relative group ${item.grid_class}`}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={
                                                        handleDragLeave
                                                    }
                                                    onDrop={e =>
                                                        handleDrop(e, item.id)
                                                    }
                                                >
                                                    {item.image_url ? (
                                                        <>
                                                            <img
                                                                src={
                                                                    item.image_url
                                                                }
                                                                alt={
                                                                    item.alt_text
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                            {/* Upload overlay on hover */}
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                <label
                                                                    htmlFor={`image-upload-${item.id}`}
                                                                    className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-colors"
                                                                >
                                                                    <Upload className="w-6 h-6 text-white" />
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={e =>
                                                                        handleDirectImageUpload(
                                                                            e,
                                                                            item.id,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        uploading
                                                                    }
                                                                    className="hidden"
                                                                    id={`image-upload-${item.id}`}
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#a5cd39] hover:bg-green-50 transition-colors">
                                                            <label
                                                                htmlFor={`image-upload-${item.id}`}
                                                                className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-[#a5cd39] transition-colors p-4"
                                                            >
                                                                <div className="p-3 rounded-full bg-gray-100 hover:bg-[#a5cd39] hover:text-white transition-colors">
                                                                    <Upload className="w-6 h-6" />
                                                                </div>
                                                                <span className="text-sm font-medium text-center">
                                                                    Click or
                                                                    Drag to
                                                                    Upload
                                                                </span>
                                                                <span className="text-xs text-gray-400 text-center">
                                                                    JPG, PNG,
                                                                    WebP up to
                                                                    10MB
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={e =>
                                                                    handleDirectImageUpload(
                                                                        e,
                                                                        item.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    uploading
                                                                }
                                                                className="hidden"
                                                                id={`image-upload-${item.id}`}
                                                            />
                                                        </div>
                                                    )}
                                                    {uploading && (
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Item Info */}
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        {item.title ||
                                                            "Untitled"}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {item.alt_text}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                                        <span>
                                                            Order:{" "}
                                                            {item.display_order}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {
                                                                GRID_CLASS_OPTIONS[
                                                                    item
                                                                        .grid_class
                                                                ]
                                                            }
                                                        </span>
                                                        <span>•</span>
                                                        <span
                                                            className={
                                                                item.is_active
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }
                                                        >
                                                            {item.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleEditItem(item)
                                                        }
                                                    >
                                                        <Edit className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            deletePortfolioItem(
                                                                item.id,
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-3 h-3 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Grid className="mx-auto h-8 w-8 mb-2" />
                                        <p>No portfolio items yet</p>
                                        <Button
                                            onClick={handleNewItem}
                                            className="mt-4 bg-[#a5cd39] hover:bg-[#94b933]"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add First Item
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preview Tab */}
                    <TabsContent value="preview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Portfolio Gallery Preview</CardTitle>
                                <CardDescription>
                                    Preview how the portfolio gallery will
                                    appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {items.length > 0 ? (
                                    <div className="border rounded-lg p-6 bg-white">
                                        {/* Preview Grid - Masonry Style */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 auto-rows-[150px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
                                            {items
                                                .filter(item => item.is_active)
                                                .map(item => (
                                                    <div
                                                        key={item.id}
                                                        className={`group relative overflow-hidden ${item.grid_class}`}
                                                    >
                                                        {item.image_url && (
                                                            <img
                                                                src={
                                                                    item.image_url
                                                                }
                                                                alt={
                                                                    item.alt_text
                                                                }
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        )}

                                                        {/* VIEW CASE Overlay */}
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <span className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-rubik font-bold tracking-wider">
                                                                VIEW CASE
                                                            </span>
                                                        </div>

                                                        {/* Optional title overlay */}
                                                        {item.title && (
                                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                                                <h3 className="text-white text-sm font-medium">
                                                                    {item.title}
                                                                </h3>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <h3 className="text-lg font-medium mb-2">
                                                No Portfolio Items
                                            </h3>
                                            <p className="text-sm">
                                                Add portfolio items to see the
                                                preview
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        This is a preview of how your portfolio
                                        gallery will appear. Visit the portfolio
                                        page to see the live version.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* Notification Popup */}
            {notification.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    className="fixed top-4 right-4 z-50 max-w-sm w-full"
                >
                    <div
                        className={`rounded-lg shadow-lg border p-4 ${
                            notification.type === "success"
                                ? "bg-green-50 border-green-200"
                                : notification.type === "error"
                                ? "bg-red-50 border-red-200"
                                : "bg-blue-50 border-blue-200"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                {notification.type === "success" && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                {notification.type === "error" && (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                {notification.type === "info" && (
                                    <AlertCircle className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4
                                    className={`text-sm font-medium ${
                                        notification.type === "success"
                                            ? "text-green-800"
                                            : notification.type === "error"
                                            ? "text-red-800"
                                            : "text-blue-800"
                                    }`}
                                >
                                    {notification.title}
                                </h4>
                                <p
                                    className={`text-sm mt-1 ${
                                        notification.type === "success"
                                            ? "text-green-700"
                                            : notification.type === "error"
                                            ? "text-red-700"
                                            : "text-blue-700"
                                    }`}
                                >
                                    {notification.message}
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    setNotification(prev => ({
                                        ...prev,
                                        show: false,
                                    }))
                                }
                                className={`flex-shrink-0 rounded-md p-1.5 inline-flex ${
                                    notification.type === "success"
                                        ? "text-green-500 hover:bg-green-100"
                                        : notification.type === "error"
                                        ? "text-red-500 hover:bg-red-100"
                                        : "text-blue-500 hover:bg-blue-100"
                                }`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default PortfolioGalleryEditor;
