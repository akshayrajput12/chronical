"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Eye,
    Info,
    ExternalLink,
    CheckCircle,
    XCircle,
    AlertCircle,
    X,
    Phone,
    Palette,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import {
    KioskConsultancySection,
    KioskConsultancySectionInput,
    KioskConsultancyNotification,
} from "@/types/kiosk";

const KioskConsultancyEditor = () => {
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

    // State for kiosk consultancy data
    const [sectionData, setSectionData] =
        useState<KioskConsultancySectionInput>({
            section_heading: "",
            phone_number: "",
            phone_display_text: "",
            phone_href: "",
            additional_text: "",
            button_bg_color: "black",
            button_text_color: "white",
            section_bg_color: "#a5cd39",
            section_text_color: "black",
            is_active: true,
        });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Notification state
    const [notification, setNotification] =
        useState<KioskConsultancyNotification>({
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

    const loadKioskConsultancyData = useCallback(async () => {
        try {
            setLoading(true);

            // Use the database function to get consultancy data
            const { data, error } = await supabase.rpc(
                "get_kiosk_consultancy_section",
            );

            if (error) {
                console.error("Error fetching kiosk consultancy data:", error);
                return;
            }

            if (data && data.length > 0) {
                const consultancySection = data[0];

                setSectionData({
                    section_heading: consultancySection.section_heading,
                    phone_number: consultancySection.phone_number,
                    phone_display_text: consultancySection.phone_display_text,
                    phone_href: consultancySection.phone_href,
                    additional_text: consultancySection.additional_text,
                    button_bg_color:
                        consultancySection.button_bg_color || "black",
                    button_text_color:
                        consultancySection.button_text_color || "white",
                    section_bg_color:
                        consultancySection.section_bg_color || "#a5cd39",
                    section_text_color:
                        consultancySection.section_text_color || "black",
                    is_active: consultancySection.is_active,
                });
            } else {
                // Fallback to default data if no data found
                setSectionData({
                    section_heading: "FREE KIOSK DESIGN CONSULTANCY NOW",
                    phone_number: "+971 (543) 47-6649",
                    phone_display_text: "Call +971 (543) 47-6649",
                    phone_href: "tel:+971554974645",
                    additional_text: "or submit inquiry form below",
                    button_bg_color: "black",
                    button_text_color: "white",
                    section_bg_color: "#a5cd39",
                    section_text_color: "black",
                    is_active: true,
                });
            }
        } catch (error) {
            console.error("Error loading kiosk consultancy data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to load kiosk consultancy data",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Load existing data
    useEffect(() => {
        loadKioskConsultancyData();
    }, [loadKioskConsultancyData]);

    const saveKioskConsultancyData = async () => {
        setSaving(true);
        try {
            // Validate required fields
            if (!sectionData.section_heading.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Section heading is required",
                );
                return;
            }

            if (!sectionData.phone_number.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Phone number is required",
                );
                return;
            }

            if (!sectionData.phone_display_text.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Phone display text is required",
                );
                return;
            }

            if (!sectionData.phone_href.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Phone href is required",
                );
                return;
            }

            if (!sectionData.additional_text.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Additional text is required",
                );
                return;
            }

            // Prepare data for database
            const dataToSave = {
                section_heading: sectionData.section_heading.trim(),
                phone_number: sectionData.phone_number.trim(),
                phone_display_text: sectionData.phone_display_text.trim(),
                phone_href: sectionData.phone_href.trim(),
                additional_text: sectionData.additional_text.trim(),
                button_bg_color: sectionData.button_bg_color || "black",
                button_text_color: sectionData.button_text_color || "white",
                section_bg_color: sectionData.section_bg_color || "#a5cd39",
                section_text_color: sectionData.section_text_color || "black",
                is_active: sectionData.is_active,
            };

            // Check if record exists (get the most recent one)
            const { data: existingData, error: fetchError } = await supabase
                .from("kiosk_consultancy_sections")
                .select("id")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1);

            if (fetchError) {
                console.error("Error fetching existing data:", fetchError);
                throw fetchError;
            }

            if (existingData && existingData.length > 0) {
                // Update existing record
                const { error } = await supabase
                    .from("kiosk_consultancy_sections")
                    .update(dataToSave)
                    .eq("id", existingData[0].id);

                if (error) {
                    console.error("Error updating data:", error);
                    throw error;
                }
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("kiosk_consultancy_sections")
                    .insert([dataToSave]);

                if (error) {
                    console.error("Error inserting data:", error);
                    throw error;
                }
            }

            showNotification(
                "success",
                "Success!",
                "Kiosk consultancy section saved successfully!",
            );
        } catch (error) {
            console.error("Error saving kiosk consultancy data:", error);

            let errorMessage = "Unknown error";
            if (error && typeof error === "object" && "message" in error) {
                errorMessage = (error as Error).message;

                // Check for common database issues
                if (
                    errorMessage.includes(
                        'relation "kiosk_consultancy_sections" does not exist',
                    )
                ) {
                    errorMessage =
                        "Database table not found. Please run the kiosk consultancy schema script first.";
                } else if (errorMessage.includes("violates check constraint")) {
                    errorMessage =
                        "Data validation failed. Please check your input and try again.";
                } else if (errorMessage.includes("permission denied")) {
                    errorMessage =
                        "Permission denied. Please check your authentication.";
                }
            }

            showNotification(
                "error",
                "Error",
                `Failed to save kiosk consultancy section: ${errorMessage}`,
            );
        } finally {
            setSaving(false);
        }
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
            {/* Notification */}
            {notification.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-4 right-4 z-50 max-w-md"
                >
                    <Card
                        className={`border-l-4 ${
                            notification.type === "success"
                                ? "border-l-green-500 bg-green-50"
                                : notification.type === "error"
                                ? "border-l-red-500 bg-red-50"
                                : "border-l-blue-500 bg-blue-50"
                        }`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    {notification.type === "success" && (
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                    )}
                                    {notification.type === "error" && (
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    )}
                                    {notification.type === "info" && (
                                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    )}
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {notification.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        setNotification(prev => ({
                                            ...prev,
                                            show: false,
                                        }))
                                    }
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Kiosk Consultancy Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the consultancy section of the kiosk page
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open("/kiosk", "_blank")}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={saveKioskConsultancyData}
                        disabled={saving}
                        className="bg-[#a5cd39] hover:bg-[#94b933]"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
                        {/* Section Header */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Header</CardTitle>
                                <CardDescription>
                                    Configure the main heading for the
                                    consultancy section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="section_heading">
                                        Section Heading
                                    </Label>
                                    <Input
                                        id="section_heading"
                                        value={sectionData.section_heading}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                section_heading: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the section heading"
                                        className="text-lg font-semibold"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={sectionData.is_active}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                is_active: e.target.checked,
                                            }))
                                        }
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                    <p className="text-sm text-gray-500">
                                        Uncheck to hide this section from the
                                        website
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Phone Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Phone Configuration</CardTitle>
                                <CardDescription>
                                    Configure the phone number and
                                    call-to-action button
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone_number">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone_number"
                                            value={sectionData.phone_number}
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    phone_number:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="+971 (543) 47-6649"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone_display_text">
                                            Button Display Text
                                        </Label>
                                        <Input
                                            id="phone_display_text"
                                            value={
                                                sectionData.phone_display_text
                                            }
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    phone_display_text:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="Call +971 (543) 47-6649"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone_href">
                                        Phone Link (tel:)
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="phone_href"
                                            value={sectionData.phone_href}
                                            onChange={e =>
                                                setSectionData(prev => ({
                                                    ...prev,
                                                    phone_href: e.target.value,
                                                }))
                                            }
                                            placeholder="tel:+971554974645"
                                            className="pl-10"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Use tel: format for phone links (e.g.,
                                        tel:+971554974645)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="additional_text">
                                        Additional Text
                                    </Label>
                                    <Input
                                        id="additional_text"
                                        value={sectionData.additional_text}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                additional_text: e.target.value,
                                            }))
                                        }
                                        placeholder="or submit inquiry form below"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Styling Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Styling Configuration</CardTitle>
                                <CardDescription>
                                    Customize colors and appearance of the
                                    consultancy section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="section_bg_color">
                                            Section Background Color
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="section_bg_color"
                                                type="color"
                                                value={
                                                    sectionData.section_bg_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        section_bg_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-16 h-10 p-1 border rounded"
                                            />
                                            <Input
                                                value={
                                                    sectionData.section_bg_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        section_bg_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="#a5cd39"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="section_text_color">
                                            Section Text Color
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="section_text_color"
                                                type="color"
                                                value={
                                                    sectionData.section_text_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        section_text_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-16 h-10 p-1 border rounded"
                                            />
                                            <Input
                                                value={
                                                    sectionData.section_text_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        section_text_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="black"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="button_bg_color">
                                            Button Background Color
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="button_bg_color"
                                                type="color"
                                                value={
                                                    sectionData.button_bg_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        button_bg_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-16 h-10 p-1 border rounded"
                                            />
                                            <Input
                                                value={
                                                    sectionData.button_bg_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        button_bg_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="black"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="button_text_color">
                                            Button Text Color
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="button_text_color"
                                                type="color"
                                                value={
                                                    sectionData.button_text_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        button_text_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-16 h-10 p-1 border rounded"
                                            />
                                            <Input
                                                value={
                                                    sectionData.button_text_color
                                                }
                                                onChange={e =>
                                                    setSectionData(prev => ({
                                                        ...prev,
                                                        button_text_color:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="white"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
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
                                    Preview how the kiosk consultancy section
                                    will appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.section_heading ? (
                                    <div
                                        className="space-y-8 p-6 rounded-lg border text-center"
                                        style={{
                                            backgroundColor:
                                                sectionData.section_bg_color,
                                            color: sectionData.section_text_color,
                                        }}
                                    >
                                        {/* Section Header Preview */}
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                                {sectionData.section_heading}
                                            </h2>
                                        </div>

                                        {/* Call-to-Action Preview */}
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                            <a
                                                href={sectionData.phone_href}
                                                className="flex items-center justify-center px-6 py-3 rounded-md font-medium transition-all duration-300 cursor-pointer"
                                                style={{
                                                    backgroundColor:
                                                        sectionData.button_bg_color,
                                                    color: sectionData.button_text_color,
                                                }}
                                            >
                                                <Phone className="mr-2 h-5 w-5" />
                                                {sectionData.phone_display_text}
                                            </a>
                                            <span className="font-medium">
                                                {sectionData.additional_text}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Enter section content to see the
                                            preview
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Live Preview</CardTitle>
                                <CardDescription>
                                    View the actual kiosk page to see your
                                    changes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        window.open("/kiosk", "_blank")
                                    }
                                    className="w-full"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open Kiosk Page in New Tab
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
};

export default KioskConsultancyEditor;
