"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Save,
    ArrowLeft,
    Upload,
    X,
    Calendar,
    MapPin,
    Building2,
    Users,
    Tag,
    Eye,
    Settings,
    Image as ImageIcon,
    FileText,
    Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { EventInput, EventCategory } from "@/types/events";
import ImageBrowser from "@/components/admin/image-browser";
import TiptapEditor from "@/components/admin/tiptap-editor";
import DeferredImageUpload, {
    DeferredImageData,
    createEmptyDeferredImage,
} from "@/components/admin/deferred-image-upload";

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
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

const CreateEventPage = () => {
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState<EventInput>({
        title: "",
        slug: "",
        description: "",
        short_description: "",
        category_id: "",
        organizer: "",
        organized_by: "",
        venue: "",
        event_type: "",
        industry: "",
        audience: "",
        start_date: "",
        end_date: "",
        date_range: "",
        featured_image_url: "",
        hero_image_url: "",
        logo_image_url: "",
        logo_text: "",
        logo_subtext: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        is_active: true,
        is_featured: false,
        display_order: 0,
        published_at: "",
    });

    // Additional state for enhanced features
    const [detailedDescription, setDetailedDescription] = useState("");
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [selectedImages, setSelectedImages] = useState<{
        featured?: any;
        hero?: any;
        logo?: any;
    }>({});

    // Other state
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);
    const [imageBrowserOpen, setImageBrowserOpen] = useState(false);
    const [imageBrowserType, setImageBrowserType] = useState<
        "featured" | "hero" | "logo" | "gallery"
    >("featured");

    // Deferred image uploads (like blog admin)
    const [featuredImage, setFeaturedImage] = useState<DeferredImageData>(
        createEmptyDeferredImage(),
    );
    const [heroImage, setHeroImage] = useState<DeferredImageData>(
        createEmptyDeferredImage(),
    );
    const [logoImage, setLogoImage] = useState<DeferredImageData>(
        createEmptyDeferredImage(),
    );

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Auto-generate slug from title
    useEffect(() => {
        if (formData.title && !formData.slug) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
                .replace(/\/+$/, ""); // Remove trailing slashes
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, formData.slug]);

    const fetchCategories = async () => {
        try {
            // Fetch categories from API
            const response = await fetch("/api/events/categories");
            const data = await response.json();
            if (response.ok && data.categories) {
                setCategories(data.categories);
            } else {
                console.error("Failed to fetch categories:", data.error);
                // Fallback to empty array if API fails
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            // Fallback to empty array if fetch fails
            setCategories([]);
        }
    };

    // Generate display date range from start and end dates
    const generateDateRange = (startDate: string, endDate: string) => {
        if (!startDate) return "";

        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : start;

        const formatOptions: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "short",
            year: "numeric",
        };

        const startFormatted = start
            .toLocaleDateString("en-US", formatOptions)
            .toUpperCase();

        // If same date or no end date, show single date
        if (!endDate || start.toDateString() === end.toDateString()) {
            return startFormatted;
        }

        // If same year, don't repeat year
        if (start.getFullYear() === end.getFullYear()) {
            const endFormatted = end
                .toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                })
                .toUpperCase();
            return `${startFormatted} - ${endFormatted}`;
        }

        // Different years, show full dates
        const endFormatted = end
            .toLocaleDateString("en-US", formatOptions)
            .toUpperCase();
        return `${startFormatted} - ${endFormatted}`;
    };

    const handleInputChange = (field: keyof EventInput, value: any) => {
        // Clean slug input to remove trailing slashes
        if (field === "slug" && typeof value === "string") {
            value = value.replace(/\/+$/, "");
        }

        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value,
            };

            // Auto-generate date_range when start_date or end_date changes
            if (field === "start_date" || field === "end_date") {
                const startDate =
                    field === "start_date" ? value : prev.start_date;
                const endDate = field === "end_date" ? value : prev.end_date;
                newData.date_range = generateDateRange(startDate, endDate);
            }

            return newData;
        });
    };

    // Handle gallery image deletion
    const handleDeleteGalleryImage = (index: number) => {
        if (
            confirm(
                "Are you sure you want to remove this image from the gallery?",
            )
        ) {
            setGalleryImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleImageUpload = async (field: string, file: File) => {
        setUploadingImage(field);
        try {
            console.log(
                "Starting image upload for field:",
                field,
                "file:",
                file.name,
            );

            // Validate file
            if (!file) {
                throw new Error("No file selected");
            }

            // Check file size (50MB limit)
            const maxSize = 50 * 1024 * 1024;
            if (file.size > maxSize) {
                throw new Error("File size too large. Maximum size is 50MB.");
            }

            // Check file type
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
            ];
            if (!allowedTypes.includes(file.type)) {
                throw new Error(
                    "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
                );
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("category", "events");
            formData.append("bucket", "event-images");
            // Note: For create page, we don't have event ID yet, so images will be uploaded to storage only

            console.log("Sending upload request...");
            const response = await fetch("/api/images", {
                method: "POST",
                body: formData,
            });

            console.log("Upload response status:", response.status);
            const data = await response.json();
            console.log("Upload response data:", data);

            if (response.ok && data.success && data.image) {
                handleInputChange(
                    field as keyof EventInput,
                    data.image.file_path,
                );
                console.log(
                    "Image uploaded successfully:",
                    data.image.file_path,
                );
            } else {
                throw new Error(
                    data.error ||
                        `Upload failed with status ${response.status}`,
                );
            }
        } catch (error) {
            console.error("Upload error:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to upload image";
            alert(`Image upload failed: ${errorMessage}`);
        } finally {
            setUploadingImage(null);
        }
    };

    const handleSave = async (publish: boolean = false) => {
        setSaving(true);
        try {
            // Basic validation
            if (!formData.title.trim()) {
                alert("Please enter an event title");
                setSaving(false);
                return;
            }

            if (!formData.slug.trim()) {
                alert("Please enter an event slug");
                setSaving(false);
                return;
            }

            if (formData.slug.endsWith("/")) {
                alert("Event slug cannot end with a slash (/)");
                setSaving(false);
                return;
            }

            const eventData = {
                ...formData,
                published_at: publish
                    ? new Date().toISOString()
                    : formData.published_at,
            };

            const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            });

            const data = await response.json();

            if (response.ok && data.event) {
                alert(
                    publish
                        ? "Event published successfully!"
                        : "Event saved as draft!",
                );
                router.push("/admin/pages/events");
            } else {
                throw new Error(data.error || "Failed to save event");
            }
        } catch (error) {
            console.error("Error saving event:", error);
            alert(
                error instanceof Error ? error.message : "Failed to save event",
            );
        } finally {
            setSaving(false);
        }
    };

    const ImageUploadField = ({
        field,
        label,
        description,
        currentUrl,
    }: {
        field: string;
        label: string;
        description: string;
        currentUrl?: string;
    }) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            <p className="text-sm text-gray-500">{description}</p>

            {currentUrl && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                    <Image
                        src={currentUrl}
                        alt={label}
                        fill
                        className="object-cover"
                    />
                    <button
                        onClick={() =>
                            handleInputChange(field as keyof EventInput, "")
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingImage === field}
                        onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = e => {
                                const file = (e.target as HTMLInputElement)
                                    .files?.[0];
                                if (file) {
                                    handleImageUpload(field, file);
                                }
                            };
                            input.click();
                        }}
                    >
                        {uploadingImage === field ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        ) : (
                            <Upload className="w-4 h-4 mr-2" />
                        )}
                        Upload New
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setImageBrowserType(
                                field as "featured" | "hero" | "logo",
                            );
                            setImageBrowserOpen(true);
                        }}
                        className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                    >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Select from Library
                    </Button>
                </div>

                {currentUrl && (
                    <Input
                        placeholder="Or enter image URL"
                        value={currentUrl}
                        onChange={e =>
                            handleInputChange(
                                field as keyof EventInput,
                                e.target.value,
                            )
                        }
                    />
                )}
            </div>
        </div>
    );

    return (
        <motion.div
            className="p-6 max-w-5xl mx-auto space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
            >
                <div className="flex items-center space-x-4">
                    <Link href="/admin/pages/events">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Events
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Create New Event
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Add a new event to your events calendar
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSave(false)}
                        disabled={saving}
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Draft
                    </Button>
                    <Button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                            <Eye className="w-4 h-4 mr-2" />
                        )}
                        Publish Event
                    </Button>
                </div>
            </motion.div>

            {/* Form */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardContent className="p-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger
                                    value="basic"
                                    className="flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Basic Info
                                </TabsTrigger>
                                <TabsTrigger
                                    value="details"
                                    className="flex items-center gap-2"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Event Details
                                </TabsTrigger>
                                <TabsTrigger
                                    value="description"
                                    className="flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Description
                                </TabsTrigger>
                                <TabsTrigger
                                    value="images"
                                    className="flex items-center gap-2"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    Images
                                </TabsTrigger>
                                <TabsTrigger
                                    value="gallery"
                                    className="flex items-center gap-2"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    Gallery
                                </TabsTrigger>
                                <TabsTrigger
                                    value="seo"
                                    className="flex items-center gap-2"
                                >
                                    <Globe className="w-4 h-4" />
                                    SEO
                                </TabsTrigger>
                                <TabsTrigger
                                    value="settings"
                                    className="flex items-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </TabsTrigger>
                            </TabsList>

                            {/* Basic Info Tab */}
                            <TabsContent
                                value="basic"
                                className="space-y-6 mt-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">
                                            Event Title *
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="Enter event title"
                                            value={formData.title}
                                            onChange={e =>
                                                handleInputChange(
                                                    "title",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">URL Slug *</Label>
                                        <Input
                                            id="slug"
                                            placeholder="event-url-slug"
                                            value={formData.slug}
                                            onChange={e =>
                                                handleInputChange(
                                                    "slug",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="short_description">
                                        Short Description
                                    </Label>
                                    <Input
                                        id="short_description"
                                        placeholder="Brief description for cards and previews"
                                        value={formData.short_description}
                                        onChange={e =>
                                            handleInputChange(
                                                "short_description",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category_id}
                                        onValueChange={value =>
                                            handleInputChange(
                                                "category_id",
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    category.color,
                                                            }}
                                                        />
                                                        <span>
                                                            {category.name}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            {/* Event Details Tab */}
                            <TabsContent
                                value="details"
                                className="space-y-6 mt-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="organizer">
                                            Organizer
                                        </Label>
                                        <Input
                                            id="organizer"
                                            placeholder="Event organizer name"
                                            value={formData.organizer}
                                            onChange={e =>
                                                handleInputChange(
                                                    "organizer",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="organized_by">
                                            Organized By
                                        </Label>
                                        <Input
                                            id="organized_by"
                                            placeholder="Organization details"
                                            value={formData.organized_by}
                                            onChange={e =>
                                                handleInputChange(
                                                    "organized_by",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="venue">Venue</Label>
                                        <Input
                                            id="venue"
                                            placeholder="Event venue"
                                            value={formData.venue}
                                            onChange={e =>
                                                handleInputChange(
                                                    "venue",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="event_type">
                                            Event Type
                                        </Label>
                                        <Input
                                            id="event_type"
                                            placeholder="e.g., Conference, Exhibition, Workshop"
                                            value={formData.event_type}
                                            onChange={e =>
                                                handleInputChange(
                                                    "event_type",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="industry">
                                            Industry
                                        </Label>
                                        <Input
                                            id="industry"
                                            placeholder="Target industry"
                                            value={formData.industry}
                                            onChange={e =>
                                                handleInputChange(
                                                    "industry",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="audience">
                                            Target Audience
                                        </Label>
                                        <Input
                                            id="audience"
                                            placeholder="e.g., Public, Trade Only, Professionals"
                                            value={formData.audience}
                                            onChange={e =>
                                                handleInputChange(
                                                    "audience",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">
                                            Start Date
                                        </Label>
                                        <Input
                                            id="start_date"
                                            type="datetime-local"
                                            max={formData.end_date || undefined}
                                            value={formData.start_date}
                                            onChange={e => {
                                                const startDate =
                                                    e.target.value;
                                                handleInputChange(
                                                    "start_date",
                                                    startDate,
                                                );

                                                // If end date is before new start date, clear it
                                                if (
                                                    formData.end_date &&
                                                    startDate >
                                                        formData.end_date
                                                ) {
                                                    handleInputChange(
                                                        "end_date",
                                                        "",
                                                    );
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">
                                            End Date
                                        </Label>
                                        <Input
                                            id="end_date"
                                            type="datetime-local"
                                            min={
                                                formData.start_date || undefined
                                            }
                                            value={formData.end_date}
                                            onChange={e => {
                                                const endDate = e.target.value;
                                                handleInputChange(
                                                    "end_date",
                                                    endDate,
                                                );

                                                // If start date is after new end date, clear it
                                                if (
                                                    formData.start_date &&
                                                    endDate <
                                                        formData.start_date
                                                ) {
                                                    handleInputChange(
                                                        "start_date",
                                                        "",
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="date_range">
                                            Display Date Range
                                        </Label>
                                        <Input
                                            id="date_range"
                                            placeholder="Auto-generated from start and end dates"
                                            value={formData.date_range}
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                        <p className="text-sm text-gray-500">
                                            This field is automatically
                                            generated from the start and end
                                            dates above
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Description Tab */}
                            <TabsContent
                                value="description"
                                className="space-y-6 mt-6"
                            >
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-base font-medium">
                                            Detailed Event Description
                                        </Label>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Create rich content for the event
                                            detail page. This will be displayed
                                            alongside the event information.
                                        </p>
                                        <TiptapEditor
                                            content={detailedDescription}
                                            onChange={setDetailedDescription}
                                            placeholder="Write a detailed description of your event..."
                                            className="min-h-[400px]"
                                        />
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-medium text-blue-900 mb-2">
                                            💡 Tips for Great Event Descriptions
                                        </h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>
                                                • Include key highlights and
                                                unique features of your event
                                            </li>
                                            <li>
                                                • Mention notable speakers,
                                                exhibitors, or attractions
                                            </li>
                                            <li>
                                                • Add practical information like
                                                parking, accessibility, etc.
                                            </li>
                                            <li>
                                                • Use headings and bullet points
                                                for better readability
                                            </li>
                                            <li>
                                                • Include calls-to-action for
                                                registration or inquiries
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Images Tab */}
                            <TabsContent
                                value="images"
                                className="space-y-6 mt-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <ImageUploadField
                                        field="featured_image_url"
                                        label="Featured Image"
                                        description="Main image displayed in event cards and listings"
                                        currentUrl={formData.featured_image_url}
                                    />

                                    <ImageUploadField
                                        field="hero_image_url"
                                        label="Hero Image"
                                        description="Large background image for event detail page"
                                        currentUrl={formData.hero_image_url}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <ImageUploadField
                                            field="logo_image_url"
                                            label="Logo Image"
                                            description="Event or organizer logo"
                                            currentUrl={formData.logo_image_url}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="logo_text">
                                                Logo Text
                                            </Label>
                                            <Input
                                                id="logo_text"
                                                placeholder="Text to display with logo"
                                                value={formData.logo_text}
                                                onChange={e =>
                                                    handleInputChange(
                                                        "logo_text",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="logo_subtext">
                                                Logo Subtext
                                            </Label>
                                            <Input
                                                id="logo_subtext"
                                                placeholder="Additional text below logo"
                                                value={formData.logo_subtext}
                                                onChange={e =>
                                                    handleInputChange(
                                                        "logo_subtext",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Gallery Tab */}
                            <TabsContent
                                value="gallery"
                                className="space-y-6 mt-6"
                            >
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-medium">
                                                Event Gallery
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Add images to showcase your
                                                event. These will be displayed
                                                in the event gallery section.
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setImageBrowserType("gallery");
                                                setImageBrowserOpen(true);
                                            }}
                                            className="bg-[#a5cd39] hover:bg-[#8fb82e]"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Add Images
                                        </Button>
                                    </div>

                                    {galleryImages.length === 0 ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                No gallery images added yet
                                            </h4>
                                            <p className="text-gray-500 mb-4">
                                                Click "Add Images" to get
                                                started
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setImageBrowserType(
                                                        "gallery",
                                                    );
                                                    setImageBrowserOpen(true);
                                                }}
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Add Images
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {galleryImages.map(
                                                (image, index) => (
                                                    <div
                                                        key={image.id || index}
                                                        className="relative group"
                                                    >
                                                        <div className="aspect-square relative rounded-lg overflow-hidden border">
                                                            <Image
                                                                src={
                                                                    image.thumbnail_url ||
                                                                    image.file_path
                                                                }
                                                                alt={
                                                                    image.alt_text ||
                                                                    image.title
                                                                }
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onClick={() =>
                                                                        handleDeleteGalleryImage(
                                                                            index,
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="text-sm font-medium truncate">
                                                                {image.title ||
                                                                    image.filename}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {image.alt_text}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="font-medium text-yellow-900 mb-2">
                                            📸 Gallery Best Practices
                                        </h4>
                                        <ul className="text-sm text-yellow-800 space-y-1">
                                            <li>
                                                • Use high-quality images that
                                                showcase your event
                                            </li>
                                            <li>
                                                • Include a mix of venue shots,
                                                activities, and attendee photos
                                            </li>
                                            <li>
                                                • Optimize images for web
                                                (recommended: under 2MB each)
                                            </li>
                                            <li>
                                                • Add descriptive alt text for
                                                accessibility
                                            </li>
                                            <li>
                                                • Arrange images in order of
                                                importance
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* SEO Tab */}
                            <TabsContent value="seo" className="space-y-6 mt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="meta_title">
                                        Meta Title
                                    </Label>
                                    <Input
                                        id="meta_title"
                                        placeholder="SEO title for search engines"
                                        value={formData.meta_title}
                                        onChange={e =>
                                            handleInputChange(
                                                "meta_title",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="text-sm text-gray-500">
                                        Recommended: 50-60 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meta_description">
                                        Meta Description
                                    </Label>
                                    <Textarea
                                        id="meta_description"
                                        placeholder="Brief description for search engine results"
                                        value={formData.meta_description}
                                        onChange={e =>
                                            handleInputChange(
                                                "meta_description",
                                                e.target.value,
                                            )
                                        }
                                        rows={3}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Recommended: 150-160 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meta_keywords">
                                        Meta Keywords
                                    </Label>
                                    <Input
                                        id="meta_keywords"
                                        placeholder="Comma-separated keywords"
                                        value={formData.meta_keywords}
                                        onChange={e =>
                                            handleInputChange(
                                                "meta_keywords",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="text-sm text-gray-500">
                                        Separate keywords with commas
                                    </p>
                                </div>
                            </TabsContent>

                            {/* Settings Tab */}
                            <TabsContent
                                value="settings"
                                className="space-y-6 mt-6"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Active Status</Label>
                                            <p className="text-sm text-gray-500">
                                                Make this event visible to the
                                                public
                                            </p>
                                        </div>
                                        <Switch
                                            checked={formData.is_active}
                                            onCheckedChange={checked =>
                                                handleInputChange(
                                                    "is_active",
                                                    checked,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Featured Event</Label>
                                            <p className="text-sm text-gray-500">
                                                Highlight this event in featured
                                                sections
                                            </p>
                                        </div>
                                        <Switch
                                            checked={formData.is_featured}
                                            onCheckedChange={checked =>
                                                handleInputChange(
                                                    "is_featured",
                                                    checked,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="display_order">
                                            Display Order
                                        </Label>
                                        <Input
                                            id="display_order"
                                            type="number"
                                            placeholder="0"
                                            value={formData.display_order}
                                            onChange={e =>
                                                handleInputChange(
                                                    "display_order",
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                        />
                                        <p className="text-sm text-gray-500">
                                            Lower numbers appear first in
                                            listings
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="published_at">
                                            Publish Date
                                        </Label>
                                        <Input
                                            id="published_at"
                                            type="datetime-local"
                                            value={formData.published_at}
                                            onChange={e =>
                                                handleInputChange(
                                                    "published_at",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <p className="text-sm text-gray-500">
                                            Leave empty to save as draft
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Image Browser Modal */}
            <ImageBrowser
                isOpen={imageBrowserOpen}
                onClose={() => setImageBrowserOpen(false)}
                onSelect={image => {
                    if (imageBrowserType === "gallery") {
                        setGalleryImages(prev => [...prev, image]);
                    } else {
                        setSelectedImages(prev => ({
                            ...prev,
                            [imageBrowserType]: image,
                        }));
                        // Fix: Use the correct field name mapping
                        const fieldName =
                            `${imageBrowserType}_image_url` as keyof EventInput;
                        handleInputChange(fieldName, image.file_path);
                    }
                }}
                multiple={imageBrowserType === "gallery"}
                title={
                    imageBrowserType === "gallery"
                        ? "Select Gallery Images"
                        : `Select ${
                              imageBrowserType.charAt(0).toUpperCase() +
                              imageBrowserType.slice(1)
                          } Image`
                }
                description={
                    imageBrowserType === "gallery"
                        ? "Choose multiple images for the event gallery"
                        : `Choose an image for the ${imageBrowserType} section`
                }
                category={
                    imageBrowserType === "hero"
                        ? "heroes"
                        : imageBrowserType === "gallery"
                        ? "galleries"
                        : "events"
                }
                eventId={undefined} // No event ID for create page
            />
        </motion.div>
    );
};

export default CreateEventPage;
