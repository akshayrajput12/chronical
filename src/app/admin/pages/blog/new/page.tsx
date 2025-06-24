"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Save,
    Eye,
    Upload,
    X,
    Calendar,
    Tag,
    Image as ImageIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BlogCategory, BlogTag, CreateBlogPostRequest } from "@/types/blog";

const CreateBlogPostPage = () => {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [tags, setTags] = useState<BlogTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(
        null,
    );
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        meta_description: "",
        meta_keywords: "",
        featured_image_url: "",
        featured_image_alt: "",
        hero_image_url: "",
        hero_image_alt: "",
        status: "draft" as const,
        is_featured: false,
        og_title: "",
        og_description: "",
        og_image_url: "",
        category_id: "",
        scheduled_publish_at: "",
    });

    // Fetch categories and tags
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, tagsRes] = await Promise.all([
                    supabase
                        .from("blog_categories")
                        .select("*")
                        .eq("is_active", true)
                        .order("sort_order"),
                    supabase.from("blog_tags").select("*").order("name"),
                ]);

                if (categoriesRes.data) setCategories(categoriesRes.data);
                if (tagsRes.data) setTags(tagsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    };

    // Handle title change and auto-generate slug
    const handleTitleChange = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title,
            slug: prev.slug || generateSlug(title),
            og_title: prev.og_title || title,
        }));
    };

    // Upload image to Supabase storage
    const uploadImage = async (
        file: File,
        bucket: string,
    ): Promise<string | null> => {
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                return null;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from(bucket).getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    // Handle image upload
    const handleImageUpload = async (file: File, type: "featured" | "hero") => {
        const bucket =
            type === "featured" ? "blog-featured-images" : "blog-images";
        const url = await uploadImage(file, bucket);

        if (url) {
            if (type === "featured") {
                setFormData(prev => ({ ...prev, featured_image_url: url }));
                setFeaturedImageFile(null);
            } else {
                setFormData(prev => ({ ...prev, hero_image_url: url }));
                setHeroImageFile(null);
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (status: "draft" | "published") => {
        try {
            setLoading(true);

            // Upload images if selected
            if (featuredImageFile) {
                await handleImageUpload(featuredImageFile, "featured");
            }
            if (heroImageFile) {
                await handleImageUpload(heroImageFile, "hero");
            }

            // Prepare post data
            const postData: CreateBlogPostRequest = {
                ...formData,
                status,
                tag_ids: selectedTags,
            };

            // Generate unique slug
            const { data: slugData } = await supabase.rpc(
                "generate_unique_blog_slug",
                { title_text: formData.title },
            );

            if (slugData) {
                postData.slug = slugData;
            }

            // Insert blog post
            const response = await fetch("/api/blog/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });
            const result = await response.json();

            if (!response.ok) {
                console.error("Error creating post:", result.error || result);
                alert(
                    "Error creating post. " +
                        (result.error || "Please try again."),
                );
                return;
            }
            const postResult = result;

            // Insert tag relationships
            if (selectedTags.length > 0 && postResult) {
                // Tag relationships are already handled in the API route, so this can be skipped or left for legacy support
            }

            alert(
                `Post ${
                    status === "published" ? "published" : "saved as draft"
                } successfully!`,
            );
            router.push("/admin/pages/blog");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create New Post
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Write and publish your blog content
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit("draft")}
                        disabled={loading || !formData.title}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                    </Button>
                    <Button
                        onClick={() => handleSubmit("published")}
                        disabled={
                            loading || !formData.title || !formData.content
                        }
                        className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Publish
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <Label
                            htmlFor="title"
                            className="text-sm font-medium text-gray-700 mb-2 block"
                        >
                            Title *
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={e => handleTitleChange(e.target.value)}
                            placeholder="Enter post title..."
                            className="text-lg"
                        />
                    </div>

                    {/* Slug */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <Label
                            htmlFor="slug"
                            className="text-sm font-medium text-gray-700 mb-2 block"
                        >
                            URL Slug
                        </Label>
                        <div className="flex items-center">
                            <span className="text-gray-500 mr-2">/blog/</span>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        slug: e.target.value,
                                    }))
                                }
                                placeholder="url-slug"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <Label
                            htmlFor="excerpt"
                            className="text-sm font-medium text-gray-700 mb-2 block"
                        >
                            Excerpt
                        </Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    excerpt: e.target.value,
                                }))
                            }
                            placeholder="Brief description of the post..."
                            rows={3}
                        />
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <Label
                            htmlFor="content"
                            className="text-sm font-medium text-gray-700 mb-2 block"
                        >
                            Content *
                        </Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    content: e.target.value,
                                }))
                            }
                            placeholder="Write your post content here..."
                            rows={15}
                            className="font-mono"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            You can use HTML and Markdown formatting
                        </p>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            SEO Settings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="meta_description"
                                    className="text-sm font-medium text-gray-700 mb-2 block"
                                >
                                    Meta Description
                                </Label>
                                <Textarea
                                    id="meta_description"
                                    value={formData.meta_description}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            meta_description: e.target.value,
                                        }))
                                    }
                                    placeholder="SEO meta description..."
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="meta_keywords"
                                    className="text-sm font-medium text-gray-700 mb-2 block"
                                >
                                    Meta Keywords
                                </Label>
                                <Input
                                    id="meta_keywords"
                                    value={formData.meta_keywords}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            meta_keywords: e.target.value,
                                        }))
                                    }
                                    placeholder="keyword1, keyword2, keyword3"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publish Settings */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Publish Settings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="category"
                                    className="text-sm font-medium text-gray-700 mb-2 block"
                                >
                                    Category
                                </Label>
                                <select
                                    id="category"
                                    value={formData.category_id}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            category_id: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39]"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(category => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Tags
                                </Label>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {tags.map(tag => (
                                        <label
                                            key={tag.id}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedTags.includes(
                                                    tag.id,
                                                )}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setSelectedTags([
                                                            ...selectedTags,
                                                            tag.id,
                                                        ]);
                                                    } else {
                                                        setSelectedTags(
                                                            selectedTags.filter(
                                                                id =>
                                                                    id !==
                                                                    tag.id,
                                                            ),
                                                        );
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39] mr-2"
                                            />
                                            <span className="text-sm">
                                                {tag.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            is_featured: e.target.checked,
                                        }))
                                    }
                                    className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39] mr-2"
                                />
                                <Label
                                    htmlFor="is_featured"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Featured Post
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Featured Image
                        </h3>
                        {formData.featured_image_url ? (
                            <div className="relative">
                                <img
                                    src={formData.featured_image_url}
                                    alt="Featured"
                                    className="w-full h-32 object-cover rounded"
                                />
                                <button
                                    onClick={() =>
                                        setFormData(prev => ({
                                            ...prev,
                                            featured_image_url: "",
                                        }))
                                    }
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) setFeaturedImageFile(file);
                                    }}
                                    className="hidden"
                                    id="featured-image"
                                />
                                <label
                                    htmlFor="featured-image"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                                >
                                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">
                                        Upload featured image
                                    </span>
                                </label>
                            </div>
                        )}
                        {featuredImageFile && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                    Selected: {featuredImageFile.name}
                                </p>
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        handleImageUpload(
                                            featuredImageFile,
                                            "featured",
                                        )
                                    }
                                    className="mt-2"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload
                                </Button>
                            </div>
                        )}
                        {formData.featured_image_url && (
                            <div className="mt-4">
                                <Label
                                    htmlFor="featured_alt"
                                    className="text-sm font-medium text-gray-700 mb-2 block"
                                >
                                    Alt Text
                                </Label>
                                <Input
                                    id="featured_alt"
                                    value={formData.featured_image_alt}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            featured_image_alt: e.target.value,
                                        }))
                                    }
                                    placeholder="Image description..."
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBlogPostPage;
