"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Save,
    Eye,
    Info,
    CheckCircle,
    XCircle,
    AlertCircle,
    X,
    Palette,
} from "lucide-react";
import type {
    ConferenceSolutionSectionInput,
    ConferenceSolutionNotification,
} from "@/types/conference-solution-section";
import { BACKGROUND_COLORS } from "@/types/conference-solution-section";
import { revalidatePathAction } from "@/services/revalidate.action";

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

const ConferenceSolutionSectionEditor = () => {
    // State management
    const [sectionData, setSectionData] =
        useState<ConferenceSolutionSectionInput>({
            main_heading: "NEED CONFERENCE SOLUTION?",
            phone_number: "+971 (543) 47-4645",
            call_to_action_text: "or submit enquiry form below",
            background_color: "#a5cd39",
            main_image_url: "",
            main_image_alt: "Conference solution call to action",
            is_active: true,
        });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Notification state
    const [notification, setNotification] =
        useState<ConferenceSolutionNotification>({
            show: false,
            type: "info",
            title: "",
            message: "",
        });

    // Notification helper function
    const showNotification = (
        type: "success" | "error" | "info",
        title: string,
        message: string,
    ) => {
        setNotification({
            show: true,
            type,
            title,
            message,
        });

        // Auto-hide after 5 seconds
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    // Load existing data
    useEffect(() => {
        loadConferenceSolutionData();
    }, []);

    const loadConferenceSolutionData = async () => {
        try {
            // Get the section data (get the most recent one)
            const { data: sections, error: sectionError } = await supabase
                .from("conference_solution_sections")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (sectionError) {
                return;
            }

            if (sections && sections.length > 0) {
                const section = sections[0];

                // If there's a main_image_id, get its public URL
                let finalImageUrl = section.main_image_url;
                if (section.main_image_id) {
                    const { data: imageData, error: imageError } =
                        await supabase
                            .from("conference_solution_images")
                            .select("file_path")
                            .eq("id", section.main_image_id)
                            .eq("is_active", true)
                            .single();

                    if (imageData && !imageError) {
                        const { data: publicUrlData } = supabase.storage
                            .from("conference-solution-section-images")
                            .getPublicUrl(imageData.file_path);
                        finalImageUrl = publicUrlData.publicUrl;
                    }
                }

                setSectionData({
                    main_heading: section.main_heading,
                    phone_number: section.phone_number,
                    call_to_action_text: section.call_to_action_text,
                    background_color: section.background_color,
                    main_image_url: finalImageUrl || "",
                    main_image_alt: section.main_image_alt,
                    main_image_id: section.main_image_id,
                    is_active: section.is_active,
                });
            }
        } catch (error) {
            console.error("Error loading conference solution data:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveConferenceSolutionData = async () => {
        setSaving(true);
        try {
            // Check if record exists (get the most recent one)
            const { data: existingData } = await supabase
                .from("conference_solution_sections")
                .select("id")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (existingData && existingData.length > 0) {
                // Update existing record
                const { error } = await supabase
                    .from("conference_solution_sections")
                    .update(sectionData)
                    .eq("id", existingData[0].id);

                if (error) throw error;
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("conference_solution_sections")
                    .insert([sectionData]);

                if (error) throw error;
            }

            showNotification(
                "success",
                "Success!",
                "Conference solution section saved successfully!",
            );
        } catch (error) {
            console.error("Error saving conference solution data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to save data. Please try again.",
            );
        } finally {
            revalidatePathAction("/conference-organizers-in-dubai-uae");
            setSaving(false);
        }
    };

    const handleInputChange = (
        field: keyof ConferenceSolutionSectionInput,
        value: string,
    ) => {
        setSectionData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39]"></div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Conference Solution Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the conference solution call-to-action section
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open("/conference", "_blank")}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={saveConferenceSolutionData}
                        disabled={saving}
                        className="bg-[#a5cd39] hover:bg-[#94b933]"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>

            {/* Info Banner */}
            <motion.div
                variants={itemVariants}
                className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-start gap-3"
            >
                <Info
                    className="text-blue-500 mt-0.5 flex-shrink-0"
                    size={18}
                />
                <div>
                    <h3 className="font-medium text-blue-700 mb-1">
                        About the Conference Solution Section
                    </h3>
                    <p className="text-blue-600 text-sm">
                        This section appears on the conference page as a
                        call-to-action with contact information. You can edit
                        the heading, phone number, call-to-action text, and
                        background color. All changes will be reflected on the
                        website after saving.
                    </p>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div variants={itemVariants}>
                <Tabs defaultValue="content" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="content">
                            Content Settings
                        </TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    {/* Content Settings Tab */}
                    <TabsContent value="content" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Content</CardTitle>
                                <CardDescription>
                                    Configure the content for the conference
                                    solution call-to-action section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Main Heading */}
                                <div className="space-y-2">
                                    <Label htmlFor="main_heading">
                                        Main Heading *
                                    </Label>
                                    <Input
                                        id="main_heading"
                                        value={sectionData.main_heading}
                                        onChange={e =>
                                            handleInputChange(
                                                "main_heading",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter main heading"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">
                                        Phone Number *
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        value={sectionData.phone_number}
                                        onChange={e =>
                                            handleInputChange(
                                                "phone_number",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter phone number"
                                        type="tel"
                                    />
                                </div>

                                {/* Call to Action Text */}
                                <div className="space-y-2">
                                    <Label htmlFor="call_to_action_text">
                                        Call to Action Text *
                                    </Label>
                                    <Input
                                        id="call_to_action_text"
                                        value={sectionData.call_to_action_text}
                                        onChange={e =>
                                            handleInputChange(
                                                "call_to_action_text",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter call to action text"
                                    />
                                </div>

                                {/* Background Color */}
                                <div className="space-y-2">
                                    <Label htmlFor="background_color">
                                        Background Color
                                    </Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="background_color"
                                            value={sectionData.background_color}
                                            onChange={e =>
                                                handleInputChange(
                                                    "background_color",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="#a5cd39"
                                            className="flex-1"
                                        />
                                        <div
                                            className="w-10 h-10 rounded border border-gray-300 flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    sectionData.background_color,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {Object.entries(BACKGROUND_COLORS).map(
                                            ([name, color]) => (
                                                <button
                                                    key={name}
                                                    type="button"
                                                    onClick={() =>
                                                        handleInputChange(
                                                            "background_color",
                                                            color,
                                                        )
                                                    }
                                                    className={`w-8 h-8 rounded border-2 ${
                                                        sectionData.background_color ===
                                                        color
                                                            ? "border-gray-800"
                                                            : "border-gray-300"
                                                    }`}
                                                    style={{
                                                        backgroundColor: color,
                                                    }}
                                                    title={name}
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Image Alt Text */}
                                <div className="space-y-2">
                                    <Label htmlFor="main_image_alt">
                                        Image Alt Text
                                    </Label>
                                    <Input
                                        id="main_image_alt"
                                        value={sectionData.main_image_alt}
                                        onChange={e =>
                                            handleInputChange(
                                                "main_image_alt",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter image alt text for accessibility"
                                    />
                                </div>

                                {/* Main Image URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="main_image_url">
                                        Main Image URL
                                    </Label>
                                    <Input
                                        id="main_image_url"
                                        value={sectionData.main_image_url || ""}
                                        onChange={e =>
                                            handleInputChange(
                                                "main_image_url",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter image URL (optional)"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preview Tab */}
                    <TabsContent value="preview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    Preview how the conference solution section
                                    will appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.main_heading &&
                                sectionData.phone_number ? (
                                    <div
                                        className="rounded-lg overflow-hidden p-8"
                                        style={{
                                            backgroundColor:
                                                sectionData.background_color,
                                        }}
                                    >
                                        {/* Preview Container */}
                                        <div className="text-center">
                                            <h2 className="text-xl md:text-2xl font-bold text-black mb-6 uppercase tracking-wide">
                                                {sectionData.main_heading}
                                            </h2>
                                            <div className="flex flex-wrap items-center justify-center gap-3">
                                                <div className="bg-black text-white px-6 py-3 rounded-lg inline-block">
                                                    <span className="text-base sm:text-lg font-semibold">
                                                        Call{" "}
                                                        {
                                                            sectionData.phone_number
                                                        }
                                                    </span>
                                                </div>
                                                <span className="text-black text-base sm:text-lg">
                                                    {
                                                        sectionData.call_to_action_text
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <h3 className="text-lg font-medium mb-2">
                                                No Content Available
                                            </h3>
                                            <p className="text-sm">
                                                Add content in the Content
                                                Settings tab to see the preview
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        This is a preview of how your conference
                                        solution section will appear. Save your
                                        changes and visit the conference page to
                                        see the live version.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* Notification Popup */}
            {notification.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    className="fixed top-4 right-4 z-50 max-w-sm w-full"
                >
                    <div
                        className={`rounded-lg shadow-lg border p-4 ${
                            notification.type === "success"
                                ? "bg-green-50 border-green-200"
                                : notification.type === "error"
                                ? "bg-red-50 border-red-200"
                                : "bg-blue-50 border-blue-200"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                {notification.type === "success" && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                {notification.type === "error" && (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                {notification.type === "info" && (
                                    <AlertCircle className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4
                                    className={`text-sm font-medium ${
                                        notification.type === "success"
                                            ? "text-green-800"
                                            : notification.type === "error"
                                            ? "text-red-800"
                                            : "text-blue-800"
                                    }`}
                                >
                                    {notification.title}
                                </h4>
                                <p
                                    className={`text-sm mt-1 ${
                                        notification.type === "success"
                                            ? "text-green-700"
                                            : notification.type === "error"
                                            ? "text-red-700"
                                            : "text-blue-700"
                                    }`}
                                >
                                    {notification.message}
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    setNotification(prev => ({
                                        ...prev,
                                        show: false,
                                    }))
                                }
                                className={`flex-shrink-0 rounded-md p-1.5 inline-flex ${
                                    notification.type === "success"
                                        ? "text-green-500 hover:bg-green-100"
                                        : notification.type === "error"
                                        ? "text-red-500 hover:bg-red-100"
                                        : "text-blue-500 hover:bg-blue-100"
                                }`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ConferenceSolutionSectionEditor;
