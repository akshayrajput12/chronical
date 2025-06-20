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
    Plus,
    Trash2,
    GripVertical,
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
    KioskBenefitsSection,
    KioskBenefitsSectionInput,
    KioskBenefitItem,
    KioskBenefitItemInput,
    KioskBenefitsNotification,
} from "@/types/kiosk";

const KioskBenefitsEditor = () => {
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

    // State for kiosk benefits data
    const [sectionData, setSectionData] = useState<KioskBenefitsSectionInput>({
        section_heading: "",
        section_description: "",
        benefit_items: [],
        is_active: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Notification state
    const [notification, setNotification] = useState<KioskBenefitsNotification>(
        {
            show: false,
            type: "info",
            title: "",
            message: "",
        },
    );

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

    const loadKioskBenefitsData = useCallback(async () => {
        try {
            setLoading(true);

            // Use the database function to get benefits data
            const { data, error } = await supabase.rpc(
                "get_kiosk_benefits_section",
            );

            if (error) {
                console.error("Error fetching kiosk benefits data:", error);
                return;
            }

            if (data && data.length > 0) {
                const benefitsSection = data[0];

                // Parse benefit items from JSONB
                let benefitItems: KioskBenefitItem[] = [];
                if (benefitsSection.benefit_items) {
                    try {
                        const parsedItems =
                            typeof benefitsSection.benefit_items === "string"
                                ? JSON.parse(benefitsSection.benefit_items)
                                : benefitsSection.benefit_items;

                        benefitItems = Array.isArray(parsedItems)
                            ? parsedItems.sort((a, b) => a.order - b.order)
                            : [];
                    } catch (parseError) {
                        console.error(
                            "Error parsing benefit items:",
                            parseError,
                        );
                        benefitItems = [];
                    }
                }

                setSectionData({
                    section_heading: benefitsSection.section_heading,
                    section_description: benefitsSection.section_description,
                    benefit_items: benefitItems,
                    is_active: benefitsSection.is_active,
                });
            } else {
                // Fallback to default data if no data found
                setSectionData({
                    section_heading: "SURE BENEFITS OF CUSTOM KIOSK",
                    section_description:
                        "Nowadays people admire innovation. Anything that is handy & unique appeals to them. Customized kiosk solutions are big thumbs up if you wish to impress visitors coming to the show. Let's have a quick look at the key benefits:",
                    benefit_items: [
                        {
                            id: "1",
                            title: "GOOD FOR ENGAGING CONSUMERS",
                            description:
                                "Talking about trade shows the most important factor is the involvement of the visitors. Custom kiosks are greatly interactive displays that come with a clear & well-organized customer interaction system to ensure better customer engagement.",
                            order: 1,
                        },
                        {
                            id: "2",
                            title: "ENSURE HIGHER EFFICIENCY",
                            description:
                                "Besides better consumer experience, custom kiosks enhance the efficiency of any brand or business group. Customized kiosks are digital & digitalization surely improves the rate of efficiency.",
                            order: 2,
                        },
                        {
                            id: "3",
                            title: "HIGHLY FLEXIBLE CUSTOM KIOSKS",
                            description:
                                "As customized kiosks are technology-based & manufactured keeping in view your dynamic business needs they are adaptable. You can easily change the information on the KIOSK's wing touch screens as the business needs change.",
                            order: 3,
                        },
                    ],
                    is_active: true,
                });
            }
        } catch (error) {
            console.error("Error loading kiosk benefits data:", error);
            showNotification(
                "error",
                "Error",
                "Failed to load kiosk benefits data",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Load existing data
    useEffect(() => {
        loadKioskBenefitsData();
    }, [loadKioskBenefitsData]);

    const saveKioskBenefitsData = async () => {
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

            if (!sectionData.section_description.trim()) {
                showNotification(
                    "error",
                    "Validation Error",
                    "Section description is required",
                );
                return;
            }

            // Filter out empty benefit items and validate
            const validBenefitItems = sectionData.benefit_items
                .filter(item => item.title.trim() && item.description.trim())
                .map((item, index) => ({
                    ...item,
                    order: index + 1,
                }));

            // Prepare data for database
            const dataToSave = {
                section_heading: sectionData.section_heading.trim(),
                section_description: sectionData.section_description.trim(),
                benefit_items: validBenefitItems,
                is_active: sectionData.is_active,
            };

            // Check if record exists (get the most recent one)
            const { data: existingData, error: fetchError } = await supabase
                .from("kiosk_benefits_sections")
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
                    .from("kiosk_benefits_sections")
                    .update(dataToSave)
                    .eq("id", existingData[0].id);

                if (error) {
                    console.error("Error updating data:", error);
                    throw error;
                }
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("kiosk_benefits_sections")
                    .insert([dataToSave]);

                if (error) {
                    console.error("Error inserting data:", error);
                    throw error;
                }
            }

            showNotification(
                "success",
                "Success!",
                "Kiosk benefits section saved successfully!",
            );
        } catch (error) {
            console.error("Error saving kiosk benefits data:", error);

            let errorMessage = "Unknown error";
            if (error && typeof error === "object" && "message" in error) {
                errorMessage = (error as Error).message;

                // Check for common database issues
                if (
                    errorMessage.includes(
                        'relation "kiosk_benefits_sections" does not exist',
                    )
                ) {
                    errorMessage =
                        "Database table not found. Please run the kiosk benefits schema script first.";
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
                `Failed to save kiosk benefits section: ${errorMessage}`,
            );
        } finally {
            setSaving(false);
        }
    };

    // Benefit item management functions
    const addBenefitItem = () => {
        const newItem: KioskBenefitItemInput = {
            id: Date.now().toString(),
            title: "",
            description: "",
            order: sectionData.benefit_items.length + 1,
        };

        setSectionData(prev => ({
            ...prev,
            benefit_items: [...prev.benefit_items, newItem],
        }));
    };

    const updateBenefitItem = (
        index: number,
        field: keyof KioskBenefitItemInput,
        value: string | number,
    ) => {
        setSectionData(prev => ({
            ...prev,
            benefit_items: prev.benefit_items.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        }));
    };

    const removeBenefitItem = (index: number) => {
        setSectionData(prev => ({
            ...prev,
            benefit_items: prev.benefit_items
                .filter((_, i) => i !== index)
                .map((item, i) => ({ ...item, order: i + 1 })),
        }));
    };

    const moveBenefitItem = (fromIndex: number, toIndex: number) => {
        setSectionData(prev => {
            const items = [...prev.benefit_items];
            const [movedItem] = items.splice(fromIndex, 1);
            items.splice(toIndex, 0, movedItem);

            // Update order numbers
            const reorderedItems = items.map((item, i) => ({
                ...item,
                order: i + 1,
            }));

            return {
                ...prev,
                benefit_items: reorderedItems,
            };
        });
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
                        Kiosk Benefits Section
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the benefits section of the kiosk page
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
                        onClick={saveKioskBenefitsData}
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
                                    Configure the main heading and description
                                    for the benefits section
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

                                <div className="space-y-2">
                                    <Label htmlFor="section_description">
                                        Section Description
                                    </Label>
                                    <Textarea
                                        id="section_description"
                                        value={sectionData.section_description}
                                        onChange={e =>
                                            setSectionData(prev => ({
                                                ...prev,
                                                section_description:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Enter the section description"
                                        rows={4}
                                        className="resize-none"
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

                        {/* Benefit Items */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Benefit Items</CardTitle>
                                        <CardDescription>
                                            Manage individual benefit items with
                                            titles and descriptions
                                        </CardDescription>
                                    </div>
                                    <Button
                                        onClick={addBenefitItem}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Benefit
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {sectionData.benefit_items.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            No benefit items yet
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Click "Add Benefit" to create your
                                            first benefit item
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {sectionData.benefit_items.map(
                                            (item, index) => (
                                                <div
                                                    key={item.id || index}
                                                    className="border rounded-lg p-4 space-y-4 bg-gray-50"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <GripVertical className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Benefit{" "}
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {index > 0 && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        moveBenefitItem(
                                                                            index,
                                                                            index -
                                                                                1,
                                                                        )
                                                                    }
                                                                >
                                                                    ↑
                                                                </Button>
                                                            )}
                                                            {index <
                                                                sectionData
                                                                    .benefit_items
                                                                    .length -
                                                                    1 && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        moveBenefitItem(
                                                                            index,
                                                                            index +
                                                                                1,
                                                                        )
                                                                    }
                                                                >
                                                                    ↓
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    removeBenefitItem(
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`benefit_title_${index}`}
                                                            >
                                                                Benefit Title
                                                            </Label>
                                                            <Input
                                                                id={`benefit_title_${index}`}
                                                                value={
                                                                    item.title
                                                                }
                                                                onChange={e =>
                                                                    updateBenefitItem(
                                                                        index,
                                                                        "title",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Enter benefit title"
                                                                className="font-medium"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`benefit_description_${index}`}
                                                            >
                                                                Benefit
                                                                Description
                                                            </Label>
                                                            <Textarea
                                                                id={`benefit_description_${index}`}
                                                                value={
                                                                    item.description
                                                                }
                                                                onChange={e =>
                                                                    updateBenefitItem(
                                                                        index,
                                                                        "description",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Enter benefit description"
                                                                rows={3}
                                                                className="resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preview Tab */}
                    <TabsContent value="preview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    Preview how the kiosk benefits section will
                                    appear on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sectionData.section_heading &&
                                sectionData.benefit_items.length > 0 ? (
                                    <div className="space-y-8 p-6 bg-white rounded-lg border">
                                        {/* Section Header Preview */}
                                        <div className="text-center">
                                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333333]">
                                                {sectionData.section_heading}
                                            </h2>
                                            <p className="text-gray-700 max-w-4xl mx-auto">
                                                {
                                                    sectionData.section_description
                                                }
                                            </p>
                                        </div>

                                        {/* Benefits Grid Preview */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {sectionData.benefit_items.map(
                                                (benefit, index) => (
                                                    <div
                                                        key={
                                                            benefit.id || index
                                                        }
                                                        className="text-center p-6 bg-gray-50 rounded-lg"
                                                    >
                                                        {/* Benefit Number */}
                                                        <div className="w-12 h-12 bg-[#a5cd39] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                                            {index + 1}
                                                        </div>

                                                        {/* Benefit Title */}
                                                        <h3 className="text-lg font-bold mb-3 text-[#333333]">
                                                            {benefit.title}
                                                        </h3>

                                                        {/* Benefit Description */}
                                                        <p className="text-gray-700 text-sm leading-relaxed">
                                                            {
                                                                benefit.description
                                                            }
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Enter section content and add
                                            benefit items to see the preview
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

export default KioskBenefitsEditor;
