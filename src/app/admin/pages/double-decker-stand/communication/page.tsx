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
import { revalidatePathAction } from "@/services/revalidate.action";
import { createClient } from "@/lib/supabase/client";
import { Upload, Save, Eye, AlertCircle } from "lucide-react";

interface CommunicationSection {
    id: string;
    main_heading: string;
    paragraph_1: string;
    paragraph_2: string;
    section_image_url: string | null;
    section_image_alt: string | null;
    is_active: boolean;
}

const DoubleDeckersCommuncationAdminPage = () => {
    const [sectionData, setSectionData] = useState<CommunicationSection | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    // Load section data
    const loadSectionData = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("double_decker_communication_sections")
                .select("*")
                .eq("is_active", true)
                .single();

            if (error && error.code !== "PGRST116") {
                throw error;
            }

            if (data) {
                setSectionData(data);
            } else {
                // Create default section if none exists
                const { data: newData, error: insertError } = await supabase
                    .from("double_decker_communication_sections")
                    .insert({
                        main_heading: "EFFECTIVELY COMMUNICATES YOUR MESSAGE",
                        paragraph_1:
                            "An exhibition booth makes you look different from other exhibitors & passes on the relevant brand message to the clients. We understand the importance of standing out. That's why we ensure your stand grabs attention and effectively communicates your message. From innovative layouts to bold graphics, we use the latest technology to create unforgettable experiences.",
                        paragraph_2:
                            "Our commitment extends beyond design. We provide comprehensive services, including fabrication and installation, ensuring timely delivery and high-quality standards. Trust us to bring your vision to life and achieve your exhibition goals.",
                        section_image_url:
                            "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                        section_image_alt: "Exhibition Communication",
                        is_active: true,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                setSectionData(newData);
            }
        } catch (error) {
            console.error("Error loading section data:", error);
            toast.error("Failed to load communication section data");
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadSectionData();
    }, [loadSectionData]);

    // Handle form submission
    const handleSave = async () => {
        if (!sectionData) return;

        try {
            setSaving(true);
            const { error } = await supabase
                .from("double_decker_communication_sections")
                .update({
                    main_heading: sectionData.main_heading,
                    paragraph_1: sectionData.paragraph_1,
                    paragraph_2: sectionData.paragraph_2,
                    section_image_url: sectionData.section_image_url,
                    section_image_alt: sectionData.section_image_alt,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", sectionData.id);

            if (error) throw error;

            toast.success("Communication section updated successfully!");
        } catch (error) {
            console.error("Error saving section data:", error);
            toast.error("Failed to save communication section");
        } finally {
            revalidatePathAction("/double-decker-exhibition-stands-in-dubai");
            setSaving(false);
        }
    };

    // Handle image upload
    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file || !sectionData) return;

        try {
            setUploading(true);
            const fileExt = file.name.split(".").pop();
            const fileName = `communication-${Date.now()}.${fileExt}`;
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

            setSectionData({
                ...sectionData,
                section_image_url: publicUrl,
                section_image_alt:
                    sectionData.section_image_alt || "Exhibition Communication",
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

    if (!sectionData) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No section found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        There was an error loading the communication section
                        data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Communication Section Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage the effective communication section content and image
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Section Content</CardTitle>
                        <CardDescription>
                            Edit the heading, content paragraphs, and section
                            image
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Main Heading */}
                        <div className="space-y-2">
                            <Label htmlFor="main_heading">Main Heading</Label>
                            <Textarea
                                id="main_heading"
                                value={sectionData.main_heading}
                                onChange={e =>
                                    setSectionData({
                                        ...sectionData,
                                        main_heading: e.target.value,
                                    })
                                }
                                placeholder="Enter main heading"
                                rows={2}
                            />
                        </div>

                        {/* First Paragraph */}
                        <div className="space-y-2">
                            <Label htmlFor="paragraph_1">First Paragraph</Label>
                            <Textarea
                                id="paragraph_1"
                                value={sectionData.paragraph_1}
                                onChange={e =>
                                    setSectionData({
                                        ...sectionData,
                                        paragraph_1: e.target.value,
                                    })
                                }
                                placeholder="Enter first paragraph"
                                rows={4}
                            />
                        </div>

                        {/* Second Paragraph */}
                        <div className="space-y-2">
                            <Label htmlFor="paragraph_2">
                                Second Paragraph
                            </Label>
                            <Textarea
                                id="paragraph_2"
                                value={sectionData.paragraph_2}
                                onChange={e =>
                                    setSectionData({
                                        ...sectionData,
                                        paragraph_2: e.target.value,
                                    })
                                }
                                placeholder="Enter second paragraph"
                                rows={4}
                            />
                        </div>

                        {/* Section Image */}
                        <div className="space-y-2">
                            <Label htmlFor="section_image">Section Image</Label>
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
                            <Label htmlFor="section_image_alt">
                                Image Alt Text
                            </Label>
                            <Input
                                id="section_image_alt"
                                value={sectionData.section_image_alt || ""}
                                onChange={e =>
                                    setSectionData({
                                        ...sectionData,
                                        section_image_alt: e.target.value,
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
                            Preview how the communication section will appear
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Two-column layout preview */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column - Content */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                        {sectionData.main_heading}
                                    </h2>
                                    <p className="text-sm leading-relaxed text-justify text-gray-700">
                                        {sectionData.paragraph_1}
                                    </p>
                                    <p className="text-sm leading-relaxed text-justify text-gray-700">
                                        {sectionData.paragraph_2}
                                    </p>
                                </div>

                                {/* Right Column - Image */}
                                <div className="relative">
                                    {sectionData.section_image_url && (
                                        <img
                                            src={sectionData.section_image_url}
                                            alt={
                                                sectionData.section_image_alt ||
                                                ""
                                            }
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DoubleDeckersCommuncationAdminPage;
