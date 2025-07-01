"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Save,
    Upload,
    Eye,
    Monitor,
    Smartphone,
    Tablet,
    Palette,
    Type,
    Image as ImageIcon,
    X,
} from "lucide-react";
import Image from "next/image";
import ImageBrowser from "@/components/admin/image-browser";

interface EventsHero {
    id: string;
    main_heading: string;
    sub_heading: string;
    background_image_url?: string;
    background_overlay_opacity: number;
    background_overlay_color: string;
    text_color: string;
    heading_font_size: string;
    subheading_font_size: string;
    text_alignment: string;
    button_text?: string;
    button_url?: string;
    button_style: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface HeroFormData {
    main_heading: string;
    sub_heading: string;
    background_image_url: string;
    background_overlay_opacity: number;
    background_overlay_color: string;
    text_color: string;
    heading_font_size: string;
    subheading_font_size: string;
    text_alignment: string;
    button_text: string;
    button_url: string;
    button_style: string;
    is_active: boolean;
}

const EventsHeroPage = () => {
    const [heroData, setHeroData] = useState<EventsHero | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [imageBrowserOpen, setImageBrowserOpen] = useState(false);
    const [formData, setFormData] = useState<HeroFormData>({
        main_heading: "Welcome to Dubai World Trade Centre",
        sub_heading: "Dubai's epicentre for events and business in the heart of the city",
        background_image_url: "",
        background_overlay_opacity: 0.3, // Fixed value
        background_overlay_color: "#000000", // Fixed value
        text_color: "#ffffff", // Fixed value
        heading_font_size: "large", // Fixed value
        subheading_font_size: "medium", // Fixed value
        text_alignment: "center", // Fixed value
        button_text: "Explore Events",
        button_url: "/whats-on",
        button_style: "primary",
        is_active: true,
    });

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

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        try {
            const response = await fetch("/api/events/hero");
            const data = await response.json();
            if (response.ok && data.hero) {
                setHeroData(data.hero);
                setFormData({
                    main_heading: data.hero.main_heading || "",
                    sub_heading: data.hero.sub_heading || "",
                    background_image_url: data.hero.background_image_url || "",
                    background_overlay_opacity: 0.3, // Fixed value
                    background_overlay_color: "#000000", // Fixed value
                    text_color: "#ffffff", // Fixed value
                    heading_font_size: "large", // Fixed value
                    subheading_font_size: "medium", // Fixed value
                    text_alignment: "center", // Fixed value
                    button_text: data.hero.button_text || "Explore Events",
                    button_url: data.hero.button_url || "/whats-on",
                    button_style: data.hero.button_style || "primary",
                    is_active: data.hero.is_active !== false,
                });
            }
        } catch (error) {
            console.error("Error fetching hero data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof HeroFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            console.log('Saving hero data...', { heroData, formData });

            // Always use PUT to /api/events/hero and include ID in body if updating
            const requestBody = heroData
                ? { ...formData, id: heroData.id }  // Include ID for updates
                : formData;  // No ID for new creation

            console.log('Request body:', requestBody);

            const response = await fetch("/api/events/hero", {
                method: "PUT",  // Always use PUT as the API handles both create and update
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('Non-JSON response received:', textResponse);
                throw new Error('Server returned non-JSON response. Check server logs.');
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok && data.success) {
                await fetchHeroData();
                alert("Hero section updated successfully!");
            } else {
                console.error("Error saving hero:", data.error);
                alert(data.error || "Failed to save hero section");
            }
        } catch (error) {
            console.error("Error saving hero:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to save hero section";
            alert(`Save failed: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    const getPreviewStyles = () => {
        const overlayOpacity = 0.3; // Fixed value
        const overlayColor = "#000000"; // Fixed value
        const textColor = "#ffffff"; // Fixed value
        const textAlignment = "center"; // Fixed value

        const baseStyles = {
            backgroundImage: formData.background_image_url
                ? `linear-gradient(rgba(0, 0, 0, ${overlayOpacity})), url(${formData.background_image_url})`
                : `linear-gradient(rgba(0, 0, 0, ${overlayOpacity})), linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: textColor,
            textAlign: textAlignment as any,
        };

        const headingSize = "text-4xl md:text-5xl lg:text-6xl"; // Fixed large size
        const subheadingSize = "text-base md:text-lg"; // Fixed medium size

        return { baseStyles, headingSize, subheadingSize };
    };

    const getPreviewDimensions = () => {
        switch (previewMode) {
            case "mobile":
                return "w-80 h-64";
            case "tablet":
                return "w-96 h-72";
            default:
                return "w-full h-80";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5cd39]"></div>
            </div>
        );
    }

    const { baseStyles, headingSize, subheadingSize } = getPreviewStyles();

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Events Hero Section</h1>
                        <p className="text-gray-600 mt-2">
                            Customize the hero section for your events page
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={formData.is_active}
                            onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                        />
                        <Label>Active</Label>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Type className="w-5 h-5" />
                                Hero Content
                            </CardTitle>
                            <CardDescription>
                                Configure the text, styling, and background for your events hero section
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Content Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Content</h3>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="main_heading">Main Heading *</Label>
                                        <Input
                                            id="main_heading"
                                            placeholder="Welcome to Dubai World Trade Centre"
                                            value={formData.main_heading}
                                            onChange={(e) => handleInputChange("main_heading", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sub_heading">Sub Heading</Label>
                                        <Textarea
                                            id="sub_heading"
                                            placeholder="Dubai's epicentre for events and business"
                                            value={formData.sub_heading}
                                            onChange={(e) => handleInputChange("sub_heading", e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="button_text">Button Text</Label>
                                            <Input
                                                id="button_text"
                                                placeholder="Explore Events"
                                                value={formData.button_text}
                                                onChange={(e) => handleInputChange("button_text", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="button_url">Button URL</Label>
                                            <Input
                                                id="button_url"
                                                placeholder="/whats-on"
                                                value={formData.button_url}
                                                onChange={(e) => handleInputChange("button_url", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Background Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Background</h3>
                                    
                                    <div className="space-y-2">
                                        <Label>Background Image</Label>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setImageBrowserOpen(true)}
                                                className="flex-1"
                                            >
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                {formData.background_image_url ? "Change Image" : "Select Image"}
                                            </Button>
                                            {formData.background_image_url && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleInputChange("background_image_url", "")}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                        {formData.background_image_url && (
                                            <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                                                <Image
                                                    src={formData.background_image_url}
                                                    alt="Background preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>


                                </div>



                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-[#a5cd39] hover:bg-[#8fb82e]"
                                    >
                                        {saving ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        ) : (
                                            <Save className="w-4 h-4 mr-2" />
                                        )}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Preview */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        Live Preview
                                    </CardTitle>
                                    <CardDescription>
                                        See how your hero section will look
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                    <Button
                                        variant={previewMode === "desktop" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setPreviewMode("desktop")}
                                    >
                                        <Monitor className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={previewMode === "tablet" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setPreviewMode("tablet")}
                                    >
                                        <Tablet className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={previewMode === "mobile" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setPreviewMode("mobile")}
                                    >
                                        <Smartphone className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center">
                                <div
                                    className={`${getPreviewDimensions()} rounded-lg overflow-hidden border shadow-lg flex items-center justify-center p-8`}
                                    style={baseStyles}
                                >
                                    <div className="text-center space-y-4 max-w-4xl">
                                        <h1 className={`font-bold ${headingSize} font-rubik`}>
                                            {formData.main_heading}
                                        </h1>
                                        {formData.sub_heading && (
                                            <p className={`${subheadingSize} opacity-90`}>
                                                {formData.sub_heading}
                                            </p>
                                        )}
                                        {formData.button_text && (
                                            <div className="pt-4">
                                                <button
                                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                                        formData.button_style === "primary"
                                                            ? "bg-[#a5cd39] text-white hover:bg-[#8fb82e]"
                                                            : "bg-white text-gray-900 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    {formData.button_text}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Image Browser Modal */}
            <ImageBrowser
                isOpen={imageBrowserOpen}
                onClose={() => setImageBrowserOpen(false)}
                onSelect={(image) => {
                    handleInputChange("background_image_url", image.file_path);
                    setImageBrowserOpen(false);
                }}
                title="Select Hero Background Image"
                description="Choose a high-quality image for the hero background"
                category="heroes"
            />
        </motion.div>
    );
};

export default EventsHeroPage;
