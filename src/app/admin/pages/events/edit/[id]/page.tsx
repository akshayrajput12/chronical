"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
    Save,
    ArrowLeft,
    Upload,
    X,
    Calendar,
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
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import Image from "next/image";
import { EventInput, EventCategory } from "@/types/events";
import ImageBrowser from "@/components/admin/image-browser";
import TiptapEditor from "@/components/admin/tiptap-editor";
import DeferredImageUpload, {
    DeferredImageData,
    createEmptyDeferredImage
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

const EditEventPage = () => {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;



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

    // UI state
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);
    const [imageBrowserOpen, setImageBrowserOpen] = useState(false);
    const [imageBrowserType, setImageBrowserType] = useState<'featured' | 'hero' | 'logo' | 'gallery'>('featured');
    const [galleryImages, setGalleryImages] = useState<Array<{id?: string; file_path: string; database_id?: string}>>([]);

    // Deferred image uploads (like blog admin)
    const [featuredImage, setFeaturedImage] = useState<DeferredImageData>(createEmptyDeferredImage());
    const [heroImage, setHeroImage] = useState<DeferredImageData>(createEmptyDeferredImage());
    const [logoImage, setLogoImage] = useState<DeferredImageData>(createEmptyDeferredImage());

    // Load gallery images for the event
    const loadGalleryImages = useCallback(async () => {
        if (!eventId) return;

        try {
            const response = await fetch(`/api/events/${eventId}/images?type=gallery`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.images) {
                    const imageObjects = data.images.map((img: any) => ({
                        id: img.id,
                        file_path: img.file_path,
                        database_id: img.id
                    }));
                    setGalleryImages(imageObjects);
                    console.log('Loaded gallery images:', imageObjects);
                }
            }
        } catch (error) {
            console.error('Error loading gallery images:', error);
        }
    }, [eventId]);

    // Load event data and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch event data and categories in parallel
                const [eventResponse, categoriesResponse] = await Promise.all([
                    fetch(`/api/events/${eventId}?admin=true`),
                    fetch('/api/events/categories')
                ]);

                if (!eventResponse.ok) {
                    throw new Error('Event not found');
                }

                const eventData = await eventResponse.json();
                const categoriesData = await categoriesResponse.json();

                if (eventData.event) {
                    // Convert event data to form format
                    const event = eventData.event;
                    setFormData({
                        title: event.title || "",
                        slug: event.slug || "",
                        description: event.description || "",
                        short_description: event.short_description || "",
                        category_id: event.category_id || "",
                        organizer: event.organizer || "",
                        organized_by: event.organized_by || "",
                        venue: event.venue || "",
                        event_type: event.event_type || "",
                        industry: event.industry || "",
                        audience: event.audience || "",
                        start_date: event.start_date ? event.start_date.split('T')[0] : "",
                        end_date: event.end_date ? event.end_date.split('T')[0] : "",
                        date_range: event.date_range || "",
                        featured_image_url: event.featured_image_url || "",
                        hero_image_url: event.hero_image_url || "",
                        logo_image_url: event.logo_image_url || "",
                        logo_text: event.logo_text || "",
                        logo_subtext: event.logo_subtext || "",
                        meta_title: event.meta_title || "",
                        meta_description: event.meta_description || "",
                        meta_keywords: event.meta_keywords || "",
                        is_active: event.is_active ?? true,
                        is_featured: event.is_featured ?? false,
                        display_order: event.display_order || 0,
                        published_at: event.published_at || "",
                    });

                    // Initialize deferred image states with existing URLs
                    if (event.featured_image_url) {
                        setFeaturedImage({
                            file: null,
                            previewUrl: event.featured_image_url,
                            uploaded: true,
                            uploadedUrl: event.featured_image_url
                        });
                    }
                    if (event.hero_image_url) {
                        setHeroImage({
                            file: null,
                            previewUrl: event.hero_image_url,
                            uploaded: true,
                            uploadedUrl: event.hero_image_url
                        });
                    }
                    if (event.logo_image_url) {
                        setLogoImage({
                            file: null,
                            previewUrl: event.logo_image_url,
                            uploaded: true,
                            uploadedUrl: event.logo_image_url
                        });
                    }

                    // Load gallery images
                    await loadGalleryImages();
                }

                if (categoriesData.categories) {
                    setCategories(categoriesData.categories);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load event data');
                router.push('/admin/pages/events');
            } finally {
                setLoading(false);
            }
        };

        if (eventId && eventId !== 'undefined' && eventId !== 'null') {
            fetchData();
        } else {
            console.error('Invalid eventId:', eventId);
            alert('Invalid event ID');
            router.push('/admin/pages/events');
        }
    }, [eventId, router]);

    // Generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    // Handle input changes
    const handleInputChange = (field: keyof EventInput, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Auto-generate slug when title changes
        if (field === 'title' && value) {
            const newSlug = generateSlug(value);
            setFormData(prev => ({
                ...prev,
                slug: newSlug
            }));
        }
    };

    // Handle image upload
    const handleImageUpload = async (field: string, file: File) => {
        setUploadingImage(field);
        try {
            // Validate file
            if (!file) {
                throw new Error('No file selected');
            }

            // Check file size (50MB limit)
            const maxSize = 50 * 1024 * 1024;
            if (file.size > maxSize) {
                throw new Error('File size too large. Maximum size is 50MB.');
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'events');
            formData.append('bucket', 'event-images');
            if (eventId) {
                formData.append('event_id', eventId);
            }

            console.log('Sending upload request...');
            const response = await fetch('/api/images', {
                method: 'POST',
                body: formData,
            });

            console.log('Upload response status:', response.status);
            const data = await response.json();
            console.log('Upload response data:', data);

            if (response.ok && data.success && data.image) {
                handleInputChange(field as keyof EventInput, data.image.file_path);
                console.log('Image uploaded successfully:', data.image.file_path);
            } else {
                throw new Error(data.error || `Upload failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
            alert(`Image upload failed: ${errorMessage}`);
        } finally {
            setUploadingImage(null);
        }
    };

    // Handle gallery image upload
    const handleGalleryImageUpload = async (file: File) => {
        setUploadingImage('gallery');
        try {
            console.log('Starting gallery image upload:', file.name);

            // Validate file
            if (!file) {
                throw new Error('No file selected');
            }

            // Check file size (50MB limit)
            const maxSize = 50 * 1024 * 1024;
            if (file.size > maxSize) {
                throw new Error('File size too large. Maximum size is 50MB.');
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'events');
            formData.append('bucket', 'event-images');
            if (eventId) {
                formData.append('event_id', eventId);
            }

            console.log('Sending gallery upload request...');
            const response = await fetch('/api/images', {
                method: 'POST',
                body: formData,
            });

            console.log('Gallery upload response status:', response.status);
            const data = await response.json();
            console.log('Gallery upload response data:', data);

            if (response.ok && data.success && data.image) {
                setGalleryImages(prev => [...prev, data.image.file_path]);
                console.log('Gallery image uploaded successfully:', data.image.file_path);
            } else {
                throw new Error(data.error || `Upload failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('Gallery upload error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload gallery image';
            alert(`Gallery image upload failed: ${errorMessage}`);
        } finally {
            setUploadingImage(null);
        }
    };

    // Handle image selection from browser
    const handleImageSelect = (image: { id: string; filename: string; file_path: string; alt_text: string; category: string; }) => {
        if (imageBrowserType === 'gallery') {
            // Handle gallery images separately
            setGalleryImages(prev => [...prev, {
                id: image.id,
                file_path: image.file_path,
                database_id: image.id
            }]);
        } else {
            // Update deferred image state and form data
            const deferredImageData: DeferredImageData = {
                file: null,
                previewUrl: image.file_path,
                uploaded: true,
                uploadedUrl: image.file_path
            };

            switch (imageBrowserType) {
                case 'featured':
                    setFeaturedImage(deferredImageData);
                    handleInputChange('featured_image_url', image.file_path);
                    break;
                case 'hero':
                    setHeroImage(deferredImageData);
                    handleInputChange('hero_image_url', image.file_path);
                    break;
                case 'logo':
                    setLogoImage(deferredImageData);
                    handleInputChange('logo_image_url', image.file_path);
                    break;
            }
        }
        setImageBrowserOpen(false);
    };

    const handleSave = async (publish: boolean = false) => {
        setSaving(true);
        try {
            console.log('Starting event update...', { eventId, publish });

            // Validate required fields
            if (!formData.title?.trim()) {
                throw new Error('Event title is required');
            }
            if (!formData.slug?.trim()) {
                throw new Error('Event slug is required');
            }

            // Upload deferred images first
            let featuredImageUrl: string | null = formData.featured_image_url || null;
            let heroImageUrl: string | null = formData.hero_image_url || null;
            let logoImageUrl: string | null = formData.logo_image_url || null;

            try {
                if (featuredImage.file && !featuredImage.uploaded) {
                    featuredImageUrl = await uploadDeferredImage(featuredImage, 'event-images');
                }
                if (heroImage.file && !heroImage.uploaded) {
                    heroImageUrl = await uploadDeferredImage(heroImage, 'event-images');
                }
                if (logoImage.file && !logoImage.uploaded) {
                    logoImageUrl = await uploadDeferredImage(logoImage, 'event-images');
                }
            } catch (uploadError) {
                console.error('Error uploading images:', uploadError);
                throw new Error('Failed to upload images. Please try again.');
            }

            // Clean the form data - convert empty strings to null for foreign key fields
            const cleanedFormData = {
                ...formData,
                // Clean foreign key fields
                category_id: formData.category_id && formData.category_id.trim() !== '' ? formData.category_id : null,

                // Clean optional text fields
                description: formData.description?.trim() || null,
                short_description: formData.short_description?.trim() || null,
                organizer: formData.organizer?.trim() || null,
                organized_by: formData.organized_by?.trim() || null,
                venue: formData.venue?.trim() || null,
                event_type: formData.event_type?.trim() || null,
                industry: formData.industry?.trim() || null,
                audience: formData.audience?.trim() || null,
                date_range: formData.date_range?.trim() || null,

                // Use uploaded image URLs
                featured_image_url: featuredImageUrl?.trim() || null,
                hero_image_url: heroImageUrl?.trim() || null,
                logo_image_url: logoImageUrl?.trim() || null,
                logo_text: formData.logo_text?.trim() || null,
                logo_subtext: formData.logo_subtext?.trim() || null,

                // Clean SEO fields
                meta_title: formData.meta_title?.trim() || null,
                meta_description: formData.meta_description?.trim() || null,
                meta_keywords: formData.meta_keywords?.trim() || null,

                // Handle dates
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
                published_at: publish ? new Date().toISOString() : formData.published_at,

                // Ensure boolean fields are proper booleans
                is_active: Boolean(formData.is_active),
                is_featured: Boolean(formData.is_featured),
                display_order: Number(formData.display_order) || 0,
            };

            console.log('Cleaned form data:', cleanedFormData);

            const response = await fetch(`/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedFormData),
            });

            console.log('Update response status:', response.status);
            const data = await response.json();
            console.log('Update response data:', data);

            if (response.ok && data.success && data.event) {
                // Save gallery images to database
                if (galleryImages.length > 0) {
                    console.log('Saving gallery images to database:', galleryImages);
                    await saveGalleryImages();
                }

                alert(publish ? 'Event published successfully!' : 'Event updated successfully!');
                router.push('/admin/pages/events');
            } else {
                throw new Error(data.error || `Failed to update event (Status: ${response.status})`);
            }
        } catch (error) {
            console.error("Error updating event:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update event';
            alert(`Update failed: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    // Image upload helper function for deferred uploads
    const uploadDeferredImage = async (imageData: DeferredImageData, bucket: string): Promise<string | null> => {
        if (!imageData.file || imageData.uploaded) {
            return imageData.uploadedUrl || null;
        }

        try {
            const formData = new FormData();
            formData.append('file', imageData.file);
            formData.append('bucket', bucket);
            formData.append('category', 'events');

            const response = await fetch('/api/images', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok && data.success) {
                return data.image.file_path;
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    // Save gallery images to database
    const saveGalleryImages = async () => {
        try {
            // First, get existing gallery images to clear them
            const existingResponse = await fetch(`/api/events/${eventId}/images?type=gallery`);
            if (existingResponse.ok) {
                const existingData = await existingResponse.json();
                if (existingData.success && existingData.images && existingData.images.length > 0) {
                    // Delete existing gallery images
                    const imageIds = existingData.images.map((img: any) => img.id);
                    const deleteResponse = await fetch(`/api/events/${eventId}/images`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image_ids: imageIds }),
                    });

                    if (!deleteResponse.ok) {
                        console.warn('Failed to clear existing gallery images, continuing...');
                    }
                }
            }

            // Save each gallery image to the database
            for (let i = 0; i < galleryImages.length; i++) {
                const imageObj = galleryImages[i];
                const filename = imageObj.file_path.split('/').pop() || `gallery-image-${i + 1}`;

                const imageData = {
                    filename,
                    original_filename: filename,
                    file_path: imageObj.file_path,
                    image_type: 'gallery',
                    display_order: i,
                    alt_text: `Gallery image ${i + 1}`,
                    mime_type: 'image/jpeg', // Default, could be improved to detect actual type
                    file_size: 0 // Default value since we don't have the actual file size
                };

                console.log(`Saving gallery image ${i + 1}:`, imageData);
                const response = await fetch(`/api/events/${eventId}/images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(imageData),
                });

                console.log(`Gallery image ${i + 1} response status:`, response.status);
                const responseData = await response.json();
                console.log(`Gallery image ${i + 1} response data:`, responseData);

                if (!response.ok) {
                    console.error(`Failed to save gallery image ${i + 1}:`, responseData);
                    // Continue with other images even if one fails
                } else {
                    console.log(`Successfully saved gallery image ${i + 1}`);
                }
            }

            console.log('Gallery images saved successfully');
        } catch (error) {
            console.error('Error saving gallery images:', error);
            // Don't throw error to prevent blocking the main save operation
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

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
                            Edit Event
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Update event information and settings
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
                        Update Event
                    </Button>
                </div>
            </motion.div>

            {/* Form */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardContent className="p-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="basic" className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Basic Info
                                </TabsTrigger>
                                <TabsTrigger value="details" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Event Details
                                </TabsTrigger>
                                <TabsTrigger value="description" className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Description
                                </TabsTrigger>
                                <TabsTrigger value="images" className="flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Images
                                </TabsTrigger>
                                <TabsTrigger value="gallery" className="flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Gallery
                                </TabsTrigger>
                                <TabsTrigger value="seo" className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    SEO
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </TabsTrigger>
                            </TabsList>

                            {/* Basic Info Tab */}
                            <TabsContent value="basic" className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Event Title *</Label>
                                        <Input
                                            id="title"
                                            placeholder="Enter event title"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">URL Slug *</Label>
                                        <Input
                                            id="slug"
                                            placeholder="event-url-slug"
                                            value={formData.slug}
                                            onChange={(e) => handleInputChange("slug", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="short_description">Short Description</Label>
                                    <Input
                                        id="short_description"
                                        placeholder="Brief description for cards and previews"
                                        value={formData.short_description}
                                        onChange={(e) => handleInputChange("short_description", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category_id}
                                        onValueChange={(value) => handleInputChange("category_id", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: category.color }}
                                                        />
                                                        <span>{category.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            {/* Event Details Tab */}
                            <TabsContent value="details" className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="organizer">Organizer</Label>
                                        <Input
                                            id="organizer"
                                            placeholder="Event organizer name"
                                            value={formData.organizer}
                                            onChange={(e) => handleInputChange("organizer", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="organized_by">Organized By</Label>
                                        <Input
                                            id="organized_by"
                                            placeholder="Organization or company"
                                            value={formData.organized_by}
                                            onChange={(e) => handleInputChange("organized_by", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="venue">Venue</Label>
                                        <Input
                                            id="venue"
                                            placeholder="Event venue or location"
                                            value={formData.venue}
                                            onChange={(e) => handleInputChange("venue", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="event_type">Event Type</Label>
                                        <Select
                                            value={formData.event_type}
                                            onValueChange={(value) => handleInputChange("event_type", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select event type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="conference">Conference</SelectItem>
                                                <SelectItem value="exhibition">Exhibition</SelectItem>
                                                <SelectItem value="workshop">Workshop</SelectItem>
                                                <SelectItem value="seminar">Seminar</SelectItem>
                                                <SelectItem value="networking">Networking</SelectItem>
                                                <SelectItem value="trade-show">Trade Show</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="industry">Industry</Label>
                                        <Input
                                            id="industry"
                                            placeholder="Target industry"
                                            value={formData.industry}
                                            onChange={(e) => handleInputChange("industry", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="audience">Target Audience</Label>
                                        <Input
                                            id="audience"
                                            placeholder="e.g., Public, Trade Only, Professionals"
                                            value={formData.audience}
                                            onChange={(e) => handleInputChange("audience", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Start Date</Label>
                                        <Input
                                            id="start_date"
                                            type="datetime-local"
                                            value={formData.start_date}
                                            onChange={(e) => handleInputChange("start_date", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">End Date</Label>
                                        <Input
                                            id="end_date"
                                            type="datetime-local"
                                            value={formData.end_date}
                                            onChange={(e) => handleInputChange("end_date", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_range">Display Date Range</Label>
                                        <Input
                                            id="date_range"
                                            placeholder="e.g., 24 MAY - 1 JUN 2025"
                                            value={formData.date_range}
                                            onChange={(e) => handleInputChange("date_range", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Description Tab */}
                            <TabsContent value="description" className="space-y-6 mt-6">
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-base font-medium">Detailed Event Description</Label>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Create rich content for the event detail page. This will be displayed alongside the event information.
                                        </p>
                                        <TiptapEditor
                                            content={formData.description || ""}
                                            onChange={(content) => handleInputChange("description", content)}
                                            placeholder="Write a detailed description of your event..."
                                            className="min-h-[400px]"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Images Tab */}
                            <TabsContent value="images" className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Featured Image */}
                                    <div className="bg-white rounded-lg shadow-sm border p-6">
                                        <DeferredImageUpload
                                            label="Featured Image"
                                            value={featuredImage}
                                            onChange={setFeaturedImage}
                                            placeholder="Upload featured image (will upload on save)"
                                            maxSize={10}
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            Main image for event cards and listings (recommended: 800x600px)
                                        </p>

                                        <div className="mt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setImageBrowserType('featured');
                                                    setImageBrowserOpen(true);
                                                }}
                                                className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                                            >
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                Select from Library
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Hero Image */}
                                    <div className="bg-white rounded-lg shadow-sm border p-6">
                                        <DeferredImageUpload
                                            label="Hero Image"
                                            value={heroImage}
                                            onChange={setHeroImage}
                                            placeholder="Upload hero image (will upload on save)"
                                            maxSize={10}
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            Large banner image for event detail page (recommended: 1920x800px)
                                        </p>

                                        <div className="mt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setImageBrowserType('hero');
                                                    setImageBrowserOpen(true);
                                                }}
                                                className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                                            >
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                Select from Library
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Logo Image */}
                                    <div className="bg-white rounded-lg shadow-sm border p-6">
                                        <DeferredImageUpload
                                            label="Event Logo"
                                            value={logoImage}
                                            onChange={setLogoImage}
                                            placeholder="Upload logo image (will upload on save)"
                                            maxSize={10}
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            Event or organizer logo (recommended: 400x400px)
                                        </p>

                                        <div className="mt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setImageBrowserType('logo');
                                                    setImageBrowserOpen(true);
                                                }}
                                                className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                                            >
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                Select from Library
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="logo_text">Logo Text</Label>
                                            <Input
                                                id="logo_text"
                                                placeholder="Text to display with logo"
                                                value={formData.logo_text}
                                                onChange={(e) => handleInputChange("logo_text", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="logo_subtext">Logo Subtext</Label>
                                            <Input
                                                id="logo_subtext"
                                                placeholder="Additional text below logo"
                                                value={formData.logo_subtext}
                                                onChange={(e) => handleInputChange("logo_subtext", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Gallery Tab */}
                            <TabsContent value="gallery" className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium">Event Gallery</h3>
                                            <p className="text-sm text-gray-500">
                                                Add multiple images to showcase your event
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* Upload New Image */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files || []);
                                                    files.forEach(file => {
                                                        if (file) {
                                                            handleGalleryImageUpload(file);
                                                        }
                                                    });
                                                }}
                                                className="hidden"
                                                id="gallery-upload"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('gallery-upload')?.click()}
                                                disabled={uploadingImage === 'gallery'}
                                            >
                                                {uploadingImage === 'gallery' ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                                ) : (
                                                    <Upload className="w-4 h-4 mr-2" />
                                                )}
                                                Upload Images
                                            </Button>

                                            {/* Select from Library */}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setImageBrowserType('gallery');
                                                    setImageBrowserOpen(true);
                                                }}
                                                className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                                            >
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                Select from Library
                                            </Button>
                                        </div>
                                    </div>

                                    {galleryImages.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {galleryImages
                                                .filter(imageObj => imageObj.file_path && imageObj.file_path.trim() !== '')
                                                .map((imageObj, index) => (
                                                <div key={imageObj.database_id || index} className="relative group">
                                                    <div className="aspect-square rounded-lg overflow-hidden border">
                                                        <Image
                                                            src={imageObj.file_path}
                                                            alt={`Gallery image ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            if (imageObj.database_id) {
                                                                // Delete from database
                                                                try {
                                                                    const response = await fetch(`/api/events/${eventId}/images`, {
                                                                        method: 'DELETE',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                        body: JSON.stringify({
                                                                            image_ids: [imageObj.database_id]
                                                                        }),
                                                                    });

                                                                    if (response.ok) {
                                                                        // Remove from local state
                                                                        setGalleryImages(prev =>
                                                                            prev.filter((_, i) => i !== index)
                                                                        );
                                                                    } else {
                                                                        console.error('Failed to delete image from database');
                                                                        alert('Failed to delete image');
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Error deleting image:', error);
                                                                    alert('Failed to delete image');
                                                                }
                                                            } else {
                                                                // Just remove from local state (not yet saved to database)
                                                                setGalleryImages(prev =>
                                                                    prev.filter((_, i) => i !== index)
                                                                );
                                                            }
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {galleryImages.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">No gallery images added yet</p>
                                            <p className="text-sm text-gray-400">Click "Add Images" to get started</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* SEO Tab */}
                            <TabsContent value="seo" className="space-y-6 mt-6">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_title">Meta Title</Label>
                                        <Input
                                            id="meta_title"
                                            placeholder="SEO title for search engines"
                                            value={formData.meta_title}
                                            onChange={(e) => handleInputChange("meta_title", e.target.value)}
                                        />
                                        <p className="text-sm text-gray-500">
                                            Recommended: 50-60 characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meta_description">Meta Description</Label>
                                        <Textarea
                                            id="meta_description"
                                            placeholder="Brief description for search engine results"
                                            value={formData.meta_description}
                                            onChange={(e) => handleInputChange("meta_description", e.target.value)}
                                            rows={3}
                                        />
                                        <p className="text-sm text-gray-500">
                                            Recommended: 150-160 characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meta_keywords">Meta Keywords</Label>
                                        <Input
                                            id="meta_keywords"
                                            placeholder="Comma-separated keywords"
                                            value={formData.meta_keywords}
                                            onChange={(e) => handleInputChange("meta_keywords", e.target.value)}
                                        />
                                        <p className="text-sm text-gray-500">
                                            Separate keywords with commas
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Settings Tab */}
                            <TabsContent value="settings" className="space-y-6 mt-6">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Active Status</Label>
                                            <p className="text-sm text-gray-500">
                                                Control whether this event is visible on the website
                                            </p>
                                        </div>
                                        <Switch
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Featured Event</Label>
                                            <p className="text-sm text-gray-500">
                                                Highlight this event in featured sections
                                            </p>
                                        </div>
                                        <Switch
                                            checked={formData.is_featured}
                                            onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="display_order">Display Order</Label>
                                        <Input
                                            id="display_order"
                                            type="number"
                                            placeholder="0"
                                            value={formData.display_order}
                                            onChange={(e) => handleInputChange("display_order", parseInt(e.target.value) || 0)}
                                        />
                                        <p className="text-sm text-gray-500">
                                            Lower numbers appear first in listings
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="published_at">Publish Date</Label>
                                        <Input
                                            id="published_at"
                                            type="datetime-local"
                                            value={formData.published_at}
                                            onChange={(e) => handleInputChange("published_at", e.target.value)}
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
            {imageBrowserOpen && (
                <ImageBrowser
                    isOpen={imageBrowserOpen}
                    onClose={() => setImageBrowserOpen(false)}
                    onSelect={handleImageSelect}
                    multiple={imageBrowserType === 'gallery'}
                    eventId={eventId}
                    title={
                        imageBrowserType === 'gallery'
                            ? "Select Gallery Images"
                            : `Select ${imageBrowserType.charAt(0).toUpperCase() + imageBrowserType.slice(1)} Image`
                    }
                    description={
                        imageBrowserType === 'gallery'
                            ? "Choose multiple images for the event gallery"
                            : `Choose an image for the ${imageBrowserType} section`
                    }
                />
            )}
        </motion.div>
    );
};

export default EditEventPage;
