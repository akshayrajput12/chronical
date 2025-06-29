"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, Upload, X } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ExpoPavilionHero {
    id?: string;
    title: string;
    subtitle: string;
    background_image_url: string;
    background_image_alt: string;
    is_active: boolean;
}

const ExpoPavilionHeroEditor = () => {
    const [heroData, setHeroData] = useState<ExpoPavilionHero | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const supabase = createClient();

    const loadHeroData = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("expo_pavilion_hero")
                .select("*")
                .eq("is_active", true)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                setHeroData(data);
            } else {
                // Create default entry if none exists
                const { data: newData, error: insertError } = await supabase
                    .from("expo_pavilion_hero")
                    .insert({
                        title: 'COUNTRY PAVILION EXPO BOOTH DESIGN IN UAE',
                        subtitle: 'Chronicle Exhibition Organizing LLC masters the art of designing for country pavilion expo booth. Let your brand shine at international events by using our unique country pavilion exhibition stands. Explore stunning designs that captivate and engage.',
                        background_image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                        background_image_alt: 'Country Pavilion Expo Booth Design',
                        is_active: true,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                setHeroData(newData);
            }
        } catch (error) {
            console.error("Error loading hero data:", error);
            toast.error("Failed to load hero data");
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadHeroData();
    }, [loadHeroData]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (!heroData) return;

            const { data, error } = await supabase
                .from("expo_pavilion_hero")
                .upsert(heroData, { onConflict: "id" })
                .select()
                .single();

            if (error) throw error;

            setHeroData(data);
            toast.success("Hero section updated successfully!");
        } catch (error) {
            console.error("Error saving hero data:", error);
            toast.error("Failed to save hero data");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `hero-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('expo-pavilion-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('expo-pavilion-images')
                .getPublicUrl(filePath);

            if (heroData) {
                setHeroData(prev => prev ? ({
                    ...prev,
                    background_image_url: publicUrl
                }) : null);
            }

            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading || !heroData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading hero section...</p>
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
                                href="/admin/pages/expo-pavilion-stand"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Hero Section
                                </h1>
                                <p className="text-gray-600">
                                    Manage the main hero banner for Expo Pavilion Stand page
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/countrypavilionexpoboothsolutions"
                                target="_blank"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Link>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Content</CardTitle>
                                <CardDescription>
                                    Edit the main headline and description for the hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={heroData.title}
                                        onChange={(e) =>
                                            setHeroData(prev => prev ? ({
                                                ...prev,
                                                title: e.target.value
                                            }) : null)
                                        }
                                        placeholder="Enter hero title"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="subtitle">Subtitle</Label>
                                    <Textarea
                                        id="subtitle"
                                        value={heroData.subtitle}
                                        onChange={(e) =>
                                            setHeroData(prev => prev ? ({
                                                ...prev,
                                                subtitle: e.target.value
                                            }) : null)
                                        }
                                        placeholder="Enter hero subtitle"
                                        rows={4}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="background_image_url">Background Image URL</Label>
                                    <Input
                                        id="background_image_url"
                                        value={heroData.background_image_url}
                                        onChange={(e) =>
                                            setHeroData(prev => prev ? ({
                                                ...prev,
                                                background_image_url: e.target.value
                                            }) : null)
                                        }
                                        placeholder="Enter image URL"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="background_image_alt">Image Alt Text</Label>
                                    <Input
                                        id="background_image_alt"
                                        value={heroData.background_image_alt}
                                        onChange={(e) =>
                                            setHeroData(prev => prev ? ({
                                                ...prev,
                                                background_image_alt: e.target.value
                                            }) : null)
                                        }
                                        placeholder="Enter image alt text"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="image-upload">Upload New Image</Label>
                                    <div className="mt-1">
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {isUploading && (
                                            <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={heroData.is_active}
                                        onCheckedChange={(checked) =>
                                            setHeroData(prev => prev ? ({
                                                ...prev,
                                                is_active: checked
                                            }) : null)
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
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    Preview how the hero section will appear
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative h-64 rounded-lg overflow-hidden">
                                    <img
                                        src={heroData.background_image_url}
                                        alt={heroData.background_image_alt}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60"></div>
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <div className="text-center text-white">
                                            <h1 className="text-lg font-bold mb-2 uppercase tracking-wide">
                                                {heroData.title}
                                            </h1>
                                            <p className="text-sm leading-relaxed">
                                                {heroData.subtitle.substring(0, 150)}...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ExpoPavilionHeroEditor;
