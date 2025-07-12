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
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Upload, Save, Eye, AlertCircle } from "lucide-react";

interface HeroSection {
    id: string;
    main_heading: string;
    description: string;
    background_image_url: string | null;
    background_image_alt: string | null;
    is_active: boolean;
}

const DoubleDeckersHeroAdminPage = () => {
    const [heroData, setHeroData] = useState<HeroSection | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    // Load hero section data
    const loadHeroData = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("double_decker_hero_sections")
                .select("*")
                .eq("is_active", true)
                .single();

            if (error && error.code !== "PGRST116") {
                throw error;
            }

            if (data) {
                setHeroData(data);
            } else {
                // Create default hero section if none exists
                const { data: newData, error: insertError } = await supabase
                    .from("double_decker_hero_sections")
                    .insert({
                        main_heading: "DOUBLE DECKER EXHIBITION STANDS",
                        description:
                            "Make your exhibit stand out and step up with our smartly created Double Decker Exhibition Stands. Engage your visitors with our stunning and innovative double-decker booths.",
                        background_image_url:
                            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                        background_image_alt: "Double Decker Exhibition Stands",
                        is_active: true,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                setHeroData(newData);
            }
        } catch (error) {
            console.error("Error loading hero data:", error);
            toast.error("Failed to load hero section data");
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadHeroData();
    }, [loadHeroData]);

    // Handle form submission
    const handleSave = async () => {
        if (!heroData) return;

        try {
            setSaving(true);
            const { error } = await supabase
                .from("double_decker_hero_sections")
                .update({
                    main_heading: heroData.main_heading,
                    description: heroData.description,
                    background_image_url: heroData.background_image_url,
                    background_image_alt: heroData.background_image_alt,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", heroData.id);

            if (error) throw error;

            toast.success("Hero section updated successfully!");
        } catch (error) {
            console.error("Error saving hero data:", error);
            toast.error("Failed to save hero section");
        } finally {
            setSaving(false);
        }
    };

    // Handle image upload
    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file || !heroData) return;

        try {
            setUploading(true);
            const fileExt = file.name.split(".").pop();
            const fileName = `hero-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("double-decker-stands-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage
                .from("double-decker-stands-images")
                .getPublicUrl(filePath);

            setHeroData({
                ...heroData,
                background_image_url: publicUrl,
                background_image_alt:
                    heroData.background_image_alt ||
                    "Double Decker Exhibition Stands",
            });

            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a5cd39]"></div>
            </div>
        );
    }

    if (!heroData) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No hero section found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        There was an error loading the hero section data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Hero Section Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage the main hero section of the double decker stands
                    page
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hero Content</CardTitle>
                        <CardDescription>
                            Edit the main heading, description, and background
                            image
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Main Heading */}
                        <div className="space-y-2">
                            <Label htmlFor="main_heading">Main Heading</Label>
                            <Input
                                id="main_heading"
                                value={heroData.main_heading}
                                onChange={e =>
                                    setHeroData({
                                        ...heroData,
                                        main_heading: e.target.value,
                                    })
                                }
                                placeholder="Enter main heading"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={heroData.description}
                                onChange={e =>
                                    setHeroData({
                                        ...heroData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Enter description"
                                rows={4}
                            />
                        </div>

                        {/* Background Image */}
                        <div className="space-y-2">
                            <Label htmlFor="background_image">
                                Background Image
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={uploading}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploading ? "Uploading..." : "Upload"}
                                </Button>
                            </div>
                        </div>

                        {/* Image Alt Text */}
                        <div className="space-y-2">
                            <Label htmlFor="background_image_alt">
                                Image Alt Text
                            </Label>
                            <Input
                                id="background_image_alt"
                                value={heroData.background_image_alt || ""}
                                onChange={e =>
                                    setHeroData({
                                        ...heroData,
                                        background_image_alt: e.target.value,
                                    })
                                }
                                placeholder="Enter image alt text"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-[#a5cd39] hover:bg-[#8fb82e]"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? "Saving..." : "Save Changes"}
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
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>
                            Preview how the hero section will appear
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            className="relative h-64 rounded-lg overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {heroData.background_image_url && (
                                <img
                                    src={heroData.background_image_url}
                                    alt={heroData.background_image_alt || ""}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/60"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
                                <div>
                                    <h1 className="text-xl font-bold mb-2 uppercase tracking-wide">
                                        {heroData.main_heading}
                                    </h1>
                                    <p className="text-sm leading-relaxed">
                                        {heroData.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DoubleDeckersHeroAdminPage;
