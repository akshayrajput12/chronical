"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContactImageUpload } from "./image-upload";
import { contactAdminService } from "@/lib/services/contact";
import { ContactHeroSection, ContactHeroSectionInput } from "@/types/contact";
import { Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { revalidatePathAction } from "@/services/revalidate.action";

export default function ContactHeroTab() {
    const [heroData, setHeroData] = useState<ContactHeroSection | null>(null);
    const [formData, setFormData] = useState<ContactHeroSectionInput>({
        title: "",
        subtitle: "",
        background_image_url: "",
        is_active: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    useEffect(() => {
        loadHeroData();
    }, []);

    const loadHeroData = async () => {
        try {
            setLoading(true);
            const data = await contactAdminService.getHeroSection();
            if (data) {
                setHeroData(data);
                setFormData({
                    title: data.title,
                    subtitle: data.subtitle,
                    background_image_url: data.background_image_url,
                    is_active: data.is_active,
                });
            }
        } catch (error) {
            console.error("Failed to load hero data:", error);
            setError("Failed to load hero section data");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        field: keyof ContactHeroSectionInput,
        value: string | boolean,
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        // Clear messages when user starts editing
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            // Validate required fields
            if (!formData.title.trim()) {
                setError("Title is required");
                return;
            }
            if (!formData.subtitle.trim()) {
                setError("Subtitle is required");
                return;
            }
            if (!formData.background_image_url.trim()) {
                setError("Background image is required");
                return;
            }

            let result;
            if (heroData) {
                // Update existing
                result = await contactAdminService.updateHeroSection(
                    heroData.id,
                    formData,
                );
            } else {
                // Create new
                result = await contactAdminService.createHeroSection(formData);
            }

            if (result) {
                setSuccess("Hero section saved successfully!");
                setHeroData(result);
                // Reload data to ensure consistency
                setTimeout(() => {
                    loadHeroData();
                }, 1000);
            } else {
                setError("Failed to save hero section");
            }
        } catch (error) {
            console.error("Save error:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to save hero section";
            setError(errorMessage);
        } finally {
            revalidatePathAction("/contact-us");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading hero section...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        {success}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={e =>
                                handleInputChange("title", e.target.value)
                            }
                            placeholder="Enter hero section title"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="subtitle">Subtitle *</Label>
                        <Textarea
                            id="subtitle"
                            value={formData.subtitle}
                            onChange={e =>
                                handleInputChange("subtitle", e.target.value)
                            }
                            placeholder="Enter hero section subtitle"
                            rows={3}
                            className="mt-1"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={checked =>
                                handleInputChange("is_active", checked)
                            }
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full sm:w-auto"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Hero Section
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Background Image Upload */}
                <div>
                    <ContactImageUpload
                        value={formData.background_image_url}
                        onChange={url =>
                            handleInputChange("background_image_url", url)
                        }
                        bucket="contact-images"
                        folder="hero"
                        label="Background Image *"
                        placeholder="Enter background image URL or upload a file"
                        aspectRatio="aspect-video"
                        showLibrary={true}
                    />
                </div>
            </div>

            {/* Preview Section */}
            {formData.title &&
                formData.subtitle &&
                formData.background_image_url && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>
                                This is how the hero section will appear on the
                                contact us page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="relative h-64 bg-cover bg-center rounded-lg overflow-hidden"
                                style={{
                                    backgroundImage: `url(${formData.background_image_url})`,
                                }}
                            >
                                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                                <div className="relative z-10 h-full flex items-center justify-center text-center text-white p-6">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-4">
                                            {formData.title}
                                        </h1>
                                        <p className="text-lg opacity-90 max-w-2xl">
                                            {formData.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {!formData.is_active && (
                                <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                                    ⚠️ This hero section is currently inactive
                                    and will not be displayed on the website.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
        </div>
    );
}
