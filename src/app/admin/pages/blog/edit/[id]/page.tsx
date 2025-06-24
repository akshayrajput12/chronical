"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
    ArrowLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
    BlogCategory,
    BlogTag,
    BlogPost,
    UpdateBlogPostRequest,
} from "@/types/blog";

type BlogFormData = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    meta_description: string;
    meta_keywords: string;
    featured_image_url: string;
    featured_image_alt: string;
    hero_image_url: string;
    hero_image_alt: string;
    status: "draft" | "published" | "archived";
    is_featured: boolean;
    og_title: string;
    og_description: string;
    og_image_url: string;
    category_id: string;
    scheduled_publish_at: string;
};

const EditBlogPostPage = () => {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [tags, setTags] = useState<BlogTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(
        null,
    );
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<BlogFormData>({
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
        status: "draft",
        is_featured: false,
        og_title: "",
        og_description: "",
        og_image_url: "",
        category_id: "",
        scheduled_publish_at: "",
    });

    // Fetch post data and related data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setInitialLoading(true);

                // Fetch post data
                const { data: postData, error: postError } = await supabase
                    .from("blog_posts")
                    .select(
                        `
                        *,
                        blog_post_tags (
                            blog_tag_id
                        )
                    `,
                    )
                    .eq("id", postId)
                    .single();

                if (postError) {
                    console.error("Error fetching post:", postError);
                    alert("Post not found");
                    router.push("/admin/pages/blog");
                    return;
                }

                // Fetch categories and tags
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

                // Set form data
                setFormData({
                    title: postData.title || "",
                    slug: postData.slug || "",
                    excerpt: postData.excerpt || "",
                    content: postData.content || "",
                    meta_description: postData.meta_description || "",
                    meta_keywords: postData.meta_keywords || "",
                    featured_image_url: postData.featured_image_url || "",
                    featured_image_alt: postData.featured_image_alt || "",
                    hero_image_url: postData.hero_image_url || "",
                    hero_image_alt: postData.hero_image_alt || "",
                    status: postData.status || "draft",
                    is_featured: postData.is_featured || false,
                    og_title: postData.og_title || "",
                    og_description: postData.og_description || "",
                    og_image_url: postData.og_image_url || "",
                    category_id: postData.category_id || "",
                    scheduled_publish_at: postData.scheduled_publish_at
                        ? new Date(postData.scheduled_publish_at)
                              .toISOString()
                              .slice(0, 16)
                        : "",
                });

                // Set selected tags
                const postTagIds =
                    postData.blog_post_tags?.map((pt: any) => pt.blog_tag_id) ||
                    [];
                setSelectedTags(postTagIds);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Error loading post data");
                router.push("/admin/pages/blog");
            } finally {
                setInitialLoading(false);
            }
        };

        if (postId) {
            fetchData();
        }
    }, [postId]);

    // Upload image to Supabase storage
    const uploadImage = async (file: File, bucket: string): Promise<string> => {
        try {
            // Validate file
            if (!file) {
                throw new Error("No file provided");
            }

            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error("File size must be less than 10MB");
            }

            // Validate file type
            if (!file.type.startsWith("image/")) {
                throw new Error("File must be an image");
            }

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
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from(bucket).getPublicUrl(filePath);

            if (!publicUrl) {
                throw new Error("Failed to get public URL for uploaded image");
            }

            return publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error; // Re-throw the error instead of returning null
        }
    };

    // Handle image upload
    const handleImageUpload = async (file: File, type: "featured" | "hero") => {
        try {
            const bucket =
                type === "featured" ? "blog-featured-images" : "blog-images";
            const url = await uploadImage(file, bucket);

            // uploadImage now throws errors instead of returning null
            if (type === "featured") {
                setFormData(prev => ({ ...prev, featured_image_url: url }));
                setFeaturedImageFile(null);
            } else {
                setFormData(prev => ({ ...prev, hero_image_url: url }));
                setHeroImageFile(null);
            }
        } catch (error) {
            console.error(`Error uploading ${type} image:`, error);
            throw error; // Re-throw to be caught by handleSubmit
        }
    };

    // Handle form submission
    const handleSubmit = async (status: "draft" | "published" | "archived") => {
        try {
            setLoading(true);

            // Validate required fields
            if (!formData.title.trim()) {
                alert("Title is required");
                return;
            }

            if (status === "published" && !formData.content.trim()) {
                alert("Content is required for published posts");
                return;
            }

            // Upload images if selected
            if (featuredImageFile) {
                await handleImageUpload(featuredImageFile, "featured");
            }
            if (heroImageFile) {
                await handleImageUpload(heroImageFile, "hero");
            }

            // Prepare update data
            const updateData: any = {
                ...formData,
                status,
                tag_ids: selectedTags,
                updated_at: new Date().toISOString(),
                previous_status: formData.status,
            };

            // Set published_at if publishing for the first time
            if (status === "published" && formData.status !== "published") {
                updateData.published_at = new Date().toISOString();
            }

            // Use API route for update
            const res = await fetch(`/api/blog/posts/${formData.slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            const result = await res.json();

            if (!res.ok) {
                const errorMsg =
                    result?.error || "Error updating post. Please try again.";
                console.error("Error updating post:", result);
                alert(errorMsg);
                return;
            }

            alert(
                `Post ${
                    status === "published"
                        ? "published"
                        : status === "archived"
                        ? "archived"
                        : "updated"
                } successfully!`,
            );
            router.push("/admin/pages/blog");
        } catch (error) {
            console.error("Error updating post:", error);
            let errorMessage = "An error occurred. Please try again.";
            if (error instanceof Error) {
                errorMessage = `Error: ${error.message}`;
            } else if (typeof error === "string") {
                errorMessage = `Error: ${error}`;
            } else if (error && typeof error === "object") {
                errorMessage = `Error: ${JSON.stringify(error)}`;
            }
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39]"></div>
                    <p className="text-gray-600 ml-3">Loading post...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mr-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Edit Post
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Update your blog content
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit("draft")}
                        disabled={loading || !formData.title}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                    </Button>
                    {formData.status !== "archived" && (
                        <Button
                            variant="outline"
                            onClick={() => handleSubmit("archived")}
                            disabled={loading}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                            Archive
                        </Button>
                    )}
                    <Button
                        onClick={() => handleSubmit("published")}
                        disabled={
                            loading || !formData.title || !formData.content
                        }
                        className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        {formData.status === "published" ? "Update" : "Publish"}
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
                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
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
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Current Status
                                </Label>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        formData.status === "published"
                                            ? "bg-green-100 text-green-800"
                                            : formData.status === "archived"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    {formData.status.charAt(0).toUpperCase() +
                                        formData.status.slice(1)}
                                </span>
                            </div>

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

export default EditBlogPostPage;
