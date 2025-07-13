"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Upload,
    X,
    Check,
    Image as ImageIcon,
    Grid,
    List,
    Filter,
    RefreshCw,
    Trash2,
} from "lucide-react";
import Image from "next/image";

interface ImageData {
    id: string;
    filename: string;
    file_path: string;
    title?: string;
    alt_text: string;
    description?: string;
    tags?: string[];
    category: string;
    width?: number;
    height?: number;
    thumbnail_url?: string;
    medium_url?: string;
    file_size: number;
    usage_count: number;
    created_at: string;
}

interface ImageBrowserProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (image: ImageData) => void;
    selectedImageId?: string;
    category?: string;
    multiple?: boolean;
    title?: string;
    description?: string;
    eventId?: string; // Optional event ID to filter images
}

const ImageBrowser: React.FC<ImageBrowserProps> = ({
    isOpen,
    onClose,
    onSelect,
    selectedImageId,
    category,
    multiple = false,
    title = "Select Image",
    description = "Choose an image from the library or upload a new one",
    eventId,
}) => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(category || "all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Categories for filtering
    const categories = [
        { value: "all", label: "All Categories" },
        { value: "events", label: "Events" },
        { value: "heroes", label: "Hero Images" },
        { value: "galleries", label: "Gallery Images" },
        { value: "general", label: "General" },
    ];

    const fetchImages = useCallback(async (reset = false) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: reset ? "1" : page.toString(),
                limit: "20",
                sort_by: "created_at",
                sort_order: "desc",
                bucket: "event-images", // Always use event-images bucket for events
            });

            if (searchTerm) params.append("search", searchTerm);
            if (selectedCategory !== "all") params.append("category", selectedCategory);
            if (eventId) params.append("event_id", eventId); // Filter by event if provided

            const response = await fetch(`/api/images?${params}`);
            const data = await response.json();

            if (response.ok) {
                if (reset) {
                    setImages(data.images);
                    setPage(1);
                } else {
                    setImages(prev => [...prev, ...data.images]);
                }
                setHasMore(data.has_more);
            } else {
                console.error("Error fetching images:", data.error);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, selectedCategory, eventId]);

    useEffect(() => {
        if (isOpen) {
            fetchImages(true);
        }
    }, [isOpen, searchTerm, selectedCategory, fetchImages]);

    useEffect(() => {
        if (selectedImageId) {
            setSelectedImages(new Set([selectedImageId]));
        }
    }, [selectedImageId]);

    const handleImageSelect = (image: ImageData) => {
        if (multiple) {
            const newSelected = new Set(selectedImages);
            if (newSelected.has(image.id)) {
                newSelected.delete(image.id);
            } else {
                newSelected.add(image.id);
            }
            setSelectedImages(newSelected);
        } else {
            setSelectedImages(new Set([image.id]));
            onSelect(image);
            onClose();
        }
    };

    const handleMultipleSelect = () => {
        const selectedImageObjects = images.filter(img => selectedImages.has(img.id));
        selectedImageObjects.forEach(img => onSelect(img));
        onClose();
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", file.name);
            formData.append("alt_text", file.name);
            formData.append("category", selectedCategory === "all" ? "events" : selectedCategory);
            formData.append("bucket", "event-images");
            if (eventId) {
                formData.append("event_id", eventId);
            }

            const response = await fetch("/api/images", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                // Add new image to the beginning of the list
                setImages(prev => [data.image, ...prev]);

                // Auto-select the uploaded image only for single selection mode
                if (!multiple) {
                    onSelect(data.image);
                    onClose();
                } else {
                    // For multiple selection (gallery), just add to selected images but don't close modal
                    // This allows users to upload multiple images and then select them manually
                    setSelectedImages(prev => new Set([...prev, data.image.id]));
                    console.log('Image uploaded and added to selection for gallery');
                }
            } else {
                console.error("Upload error:", data.error);
                alert(data.error || "Failed to upload image");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
            // Reset file input
            event.target.value = "";
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Handle image deletion
    const handleDeleteImage = async (image: ImageData) => {
        if (!confirm(`Are you sure you want to delete "${image.filename}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const deletePayload = {
                filePaths: [image.file_path],
                imageIds: [image.id],
                bucket: category === 'heroes' ? 'hero-images' :
                       category === 'galleries' ? 'event-images' :
                       'event-images' // default bucket
            };

            console.log('Deleting image with payload:', deletePayload);
            console.log('Image data:', image);

            // Delete from storage and database
            const response = await fetch('/api/images', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deletePayload),
            });

            const responseData = await response.json();
            console.log('Delete response:', responseData);

            if (response.ok) {
                // Remove from local state
                setImages(prev => prev.filter(img => img.id !== image.id));
                console.log('Image deleted successfully:', responseData);
                alert('Image deleted successfully!');
            } else {
                console.error('Failed to delete image:', responseData);
                alert('Failed to delete image: ' + (responseData.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image. Please try again.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 py-4 border-b">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search images..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === "grid" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading}
                        />
                        <Button disabled={uploading} className="bg-[#a5cd39] hover:bg-[#8fb82e]">
                            {uploading ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload
                        </Button>
                    </div>
                </div>

                {/* Images Grid/List */}
                <div className="flex-1 overflow-auto">
                    {loading && images.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : images.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <ImageIcon className="w-16 h-16 mb-4" />
                            <p>No images found</p>
                            <p className="text-sm">Try uploading some images or adjusting your search</p>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                            {images.map((image) => (
                                <motion.div
                                    key={image.id}
                                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                        selectedImages.has(image.id)
                                            ? "border-[#a5cd39] ring-2 ring-[#a5cd39]/20"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    onClick={() => handleImageSelect(image)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="aspect-square relative">
                                        <Image
                                            src={image.thumbnail_url || image.file_path}
                                            alt={image.alt_text}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                        />
                                        {selectedImages.has(image.id) && (
                                            <div className="absolute inset-0 bg-[#a5cd39]/20 flex items-center justify-center">
                                                <div className="bg-[#a5cd39] rounded-full p-1">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        {/* Delete button */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteImage(image);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-xs font-medium truncate">
                                            {image.title || image.filename}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(image.file_size)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 ${
                                        selectedImages.has(image.id) ? "bg-[#a5cd39]/10" : ""
                                    }`}
                                    onClick={() => handleImageSelect(image)}
                                >
                                    <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={image.thumbnail_url || image.file_path}
                                            alt={image.alt_text}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate">
                                            {image.title || image.filename}
                                        </h4>
                                        <p className="text-sm text-gray-500 truncate">
                                            {image.description || image.alt_text}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {image.category}
                                            </Badge>
                                            <span className="text-xs text-gray-400">
                                                {formatFileSize(image.file_size)}
                                            </span>
                                            {image.width && image.height && (
                                                <span className="text-xs text-gray-400">
                                                    {image.width}×{image.height}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedImages.has(image.id) && (
                                            <Check className="w-5 h-5 text-[#a5cd39]" />
                                        )}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteImage(image);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Load More */}
                    {hasMore && !loading && (
                        <div className="p-4 text-center">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setPage(prev => prev + 1);
                                    fetchImages(false);
                                }}
                            >
                                Load More
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {multiple && selectedImages.size > 0 && (
                    <div className="border-t pt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            {selectedImages.size} image{selectedImages.size !== 1 ? "s" : ""} selected
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleMultipleSelect}
                                className="bg-[#a5cd39] hover:bg-[#8fb82e]"
                            >
                                Select Images
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ImageBrowser;
