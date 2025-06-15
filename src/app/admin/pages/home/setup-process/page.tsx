"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Eye,
    Plus,
    Trash,
    Info,
    ArrowUp,
    ArrowDown,
    Settings,
    Diamond,
    Circle,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    SetupProcessSection,
    SetupProcessStep,
    SetupProcessStepInput,
    SetupProcessSectionWithDetails,
} from "@/types/setup-process";

const SetupProcessEditor = () => {
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

    // State for setup process data
    const [sectionData, setSectionData] =
        useState<SetupProcessSectionWithDetails>({
            title: "Setting Up Your Business",
            subtitle:
                "Form a new company with quick and easy steps via our eServices platform.",
            background_image_url:
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
            is_active: true,
            steps: [],
        });

    const [sectionId, setSectionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch setup process data on component mount
    useEffect(() => {
        const fetchSetupProcessData = async () => {
            setLoading(true);
            try {
                // Get section data
                const { data: sectionData, error: sectionError } =
                    await supabase
                        .from("setup_process_section")
                        .select("*")
                        .eq("is_active", true)
                        .single();

                if (sectionError && sectionError.code !== "PGRST116") {
                    console.error(
                        "Error fetching setup process section:",
                        sectionError,
                    );
                    toast.error("Failed to load setup process section data");
                    return;
                }

                if (sectionData) {
                    setSectionId(sectionData.id);

                    // Get steps data
                    const { data: stepsData, error: stepsError } =
                        await supabase
                            .from("setup_process_steps")
                            .select("*")
                            .eq("section_id", sectionData.id)
                            .eq("is_active", true)
                            .order("display_order", { ascending: true });

                    if (stepsError) {
                        console.error(
                            "Error fetching setup process steps:",
                            stepsError,
                        );
                        toast.error("Failed to load setup process steps data");
                        return;
                    }

                    setSectionData({
                        title: sectionData.title,
                        subtitle: sectionData.subtitle,
                        background_image_url: sectionData.background_image_url,
                        is_active: sectionData.is_active,
                        steps:
                            stepsData?.map(step => ({
                                title: step.title,
                                description: step.description,
                                step_number: step.step_number,
                                step_type: step.step_type,
                                category: step.category,
                                display_order: step.display_order,
                                is_active: step.is_active,
                            })) || [],
                    });
                }
            } catch (error) {
                console.error("Error fetching setup process data:", error);
                toast.error("Failed to load setup process data");
            } finally {
                setLoading(false);
            }
        };

        fetchSetupProcessData();
    }, []);

    // Handle section input changes
    const handleSectionChange = (
        field: keyof SetupProcessSectionWithDetails,
        value: string | boolean,
    ) => {
        setSectionData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle step changes
    const updateStep = (
        index: number,
        field: keyof SetupProcessStepInput,
        value: string | number | boolean,
    ) => {
        setSectionData(prev => ({
            ...prev,
            steps: prev.steps.map((step, i) =>
                i === index
                    ? {
                          ...step,
                          [field]:
                              field === "step_number" ||
                              field === "display_order"
                                  ? Number(value)
                                  : value,
                      }
                    : step,
            ),
        }));
    };

    // Add new step
    const addStep = () => {
        const newStep: SetupProcessStepInput = {
            title: "New Step",
            description: "Step description",
            step_number: sectionData.steps.length + 1,
            step_type: "diamond",
            category: "how_to_apply",
            display_order: sectionData.steps.length,
            is_active: true,
        };
        setSectionData(prev => ({
            ...prev,
            steps: [...prev.steps, newStep],
        }));
    };

    // Remove step
    const removeStep = (index: number) => {
        setSectionData(prev => ({
            ...prev,
            steps: prev.steps
                .filter((_, i) => i !== index)
                .map((step, i) => ({
                    ...step,
                    display_order: i,
                    step_number: i + 1,
                })),
        }));
    };

    // Move step up
    const moveStepUp = (index: number) => {
        if (index === 0) return;
        setSectionData(prev => {
            const newSteps = [...prev.steps];
            [newSteps[index - 1], newSteps[index]] = [
                newSteps[index],
                newSteps[index - 1],
            ];
            return {
                ...prev,
                steps: newSteps.map((step, i) => ({
                    ...step,
                    display_order: i,
                    step_number: i + 1,
                })),
            };
        });
    };

    // Move step down
    const moveStepDown = (index: number) => {
        if (index === sectionData.steps.length - 1) return;
        setSectionData(prev => {
            const newSteps = [...prev.steps];
            [newSteps[index], newSteps[index + 1]] = [
                newSteps[index + 1],
                newSteps[index],
            ];
            return {
                ...prev,
                steps: newSteps.map((step, i) => ({
                    ...step,
                    display_order: i,
                    step_number: i + 1,
                })),
            };
        });
    };

    // Save setup process data
    const saveSetupProcessData = async () => {
        setSaving(true);
        try {
            let currentSectionId = sectionId;

            // Save or update section
            if (currentSectionId) {
                const { error: sectionError } = await supabase
                    .from("setup_process_section")
                    .update({
                        title: sectionData.title,
                        subtitle: sectionData.subtitle,
                        background_image_url: sectionData.background_image_url,
                        is_active: sectionData.is_active,
                    })
                    .eq("id", currentSectionId);

                if (sectionError) {
                    console.error(
                        "Error updating setup process section:",
                        sectionError,
                    );
                    toast.error("Failed to update setup process section");
                    return;
                }
            } else {
                const { data: newSection, error: sectionError } = await supabase
                    .from("setup_process_section")
                    .insert({
                        title: sectionData.title,
                        subtitle: sectionData.subtitle,
                        background_image_url: sectionData.background_image_url,
                        is_active: sectionData.is_active,
                    })
                    .select("id")
                    .single();

                if (sectionError || !newSection) {
                    console.error(
                        "Error creating setup process section:",
                        sectionError,
                    );
                    toast.error("Failed to create setup process section");
                    return;
                }

                currentSectionId = newSection.id;
                setSectionId(currentSectionId);
            }

            // Delete existing steps
            const { error: deleteError } = await supabase
                .from("setup_process_steps")
                .delete()
                .eq("section_id", currentSectionId);

            if (deleteError) {
                console.error("Error deleting existing steps:", deleteError);
                toast.error("Failed to update steps");
                return;
            }

            // Insert new steps
            if (sectionData.steps.length > 0) {
                const stepsToInsert = sectionData.steps.map((step, index) => ({
                    section_id: currentSectionId,
                    title: step.title,
                    description: step.description,
                    step_number: index + 1,
                    step_type: step.step_type,
                    category: step.category,
                    display_order: index,
                    is_active: step.is_active,
                }));

                const { error: insertError } = await supabase
                    .from("setup_process_steps")
                    .insert(stepsToInsert);

                if (insertError) {
                    console.error("Error inserting steps:", insertError);
                    toast.error("Failed to save steps");
                    return;
                }
            }

            toast.success("Setup process saved successfully");
        } catch (error) {
            console.error("Error saving setup process:", error);
            toast.error("Failed to save setup process");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a5cd39] mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading setup process data...
                    </p>
                </div>
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
                        Setup Process Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the setup process steps that appear on the
                        website
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Settings className="h-8 w-8 text-[#a5cd39]" />
                </div>
            </motion.div>

            {/* Info Card */}
            <motion.div variants={itemVariants}>
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">
                                    Setup Process Management
                                </p>
                                <p>
                                    Configure the setup process section
                                    including the main title, subtitle,
                                    background image, and individual steps.
                                    Steps are categorized into "How To Apply"
                                    (diamond icons) and "Getting Started"
                                    (circle icons).
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div variants={itemVariants}>
                <Tabs defaultValue="section" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="section">
                            Section Settings
                        </TabsTrigger>
                        <TabsTrigger value="steps">Manage Steps</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    {/* Section Settings Tab */}
                    <TabsContent value="section">
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Configuration</CardTitle>
                                <CardDescription>
                                    Configure the main section title, subtitle,
                                    and background image
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Section Title</Label>
                                    <Input
                                        id="title"
                                        value={sectionData.title}
                                        onChange={e =>
                                            handleSectionChange(
                                                "title",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter section title"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="subtitle">
                                        Section Subtitle
                                    </Label>
                                    <Textarea
                                        id="subtitle"
                                        value={sectionData.subtitle}
                                        onChange={e =>
                                            handleSectionChange(
                                                "subtitle",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter section subtitle"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="background_image">
                                        Background Image URL
                                    </Label>
                                    <Input
                                        id="background_image"
                                        value={
                                            sectionData.background_image_url ||
                                            ""
                                        }
                                        onChange={e =>
                                            handleSectionChange(
                                                "background_image_url",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter background image URL"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Steps Management Tab */}
                    <TabsContent value="steps">
                        <Card>
                            <CardHeader>
                                <CardTitle>Setup Process Steps</CardTitle>
                                <CardDescription>
                                    Add, edit, and reorder the setup process
                                    steps
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {sectionData.steps.map((step, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-4 bg-gray-50"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                                <div>
                                                    <Label
                                                        htmlFor={`step-title-${index}`}
                                                    >
                                                        Step Title
                                                    </Label>
                                                    <Input
                                                        id={`step-title-${index}`}
                                                        value={step.title}
                                                        onChange={e =>
                                                            updateStep(
                                                                index,
                                                                "title",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter step title"
                                                    />
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor={`step-description-${index}`}
                                                    >
                                                        Description
                                                    </Label>
                                                    <Input
                                                        id={`step-description-${index}`}
                                                        value={
                                                            step.description ||
                                                            ""
                                                        }
                                                        onChange={e =>
                                                            updateStep(
                                                                index,
                                                                "description",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter step description"
                                                    />
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor={`step-type-${index}`}
                                                    >
                                                        Step Type
                                                    </Label>
                                                    <Select
                                                        value={step.step_type}
                                                        onValueChange={value =>
                                                            updateStep(
                                                                index,
                                                                "step_type",
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="diamond">
                                                                <div className="flex items-center gap-2">
                                                                    <Diamond
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                    Diamond
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="circle">
                                                                <div className="flex items-center gap-2">
                                                                    <Circle
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                    Circle
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor={`step-category-${index}`}
                                                    >
                                                        Category
                                                    </Label>
                                                    <Select
                                                        value={step.category}
                                                        onValueChange={value =>
                                                            updateStep(
                                                                index,
                                                                "category",
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="how_to_apply">
                                                                How To Apply
                                                            </SelectItem>
                                                            <SelectItem value="getting_started">
                                                                Getting Started
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        moveStepUp(index)
                                                    }
                                                    disabled={index === 0}
                                                >
                                                    <ArrowUp size={16} />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        moveStepDown(index)
                                                    }
                                                    disabled={
                                                        index ===
                                                        sectionData.steps
                                                            .length -
                                                            1
                                                    }
                                                >
                                                    <ArrowDown size={16} />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeStep(index)
                                                    }
                                                >
                                                    <Trash size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        variant="outline"
                                        onClick={addStep}
                                        className="w-full gap-2"
                                    >
                                        <Plus size={16} />
                                        Add New Step
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preview Tab */}
                    <TabsContent value="preview">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    Preview how the setup process will appear on
                                    the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-900 text-white p-8 rounded-lg">
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold mb-2">
                                            {sectionData.title}
                                        </h2>
                                        <div className="w-24 h-1 bg-[#a5cd39] mx-auto mb-4"></div>
                                        <p className="text-gray-300 text-lg">
                                            {sectionData.subtitle}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* How To Apply Steps */}
                                        <div className="text-center">
                                            <h3 className="text-xl font-medium mb-6">
                                                How To Apply
                                            </h3>
                                            <div className="flex justify-center space-x-6">
                                                {sectionData.steps
                                                    .filter(
                                                        step =>
                                                            step.category ===
                                                            "how_to_apply",
                                                    )
                                                    .map((step, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex flex-col items-center"
                                                        >
                                                            <div className="w-12 h-12 bg-[#a5cd39] flex items-center justify-center text-white font-medium text-xl transform rotate-45 mb-3">
                                                                <span
                                                                    style={{
                                                                        transform:
                                                                            "rotate(-45deg)",
                                                                    }}
                                                                >
                                                                    {
                                                                        step.step_number
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p className="text-xs max-w-[80px] text-center">
                                                                {step.title}
                                                            </p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Getting Started Steps */}
                                        <div className="text-center">
                                            <h3 className="text-xl font-medium mb-6">
                                                Getting Started
                                            </h3>
                                            <div className="flex justify-center space-x-6">
                                                {sectionData.steps
                                                    .filter(
                                                        step =>
                                                            step.category ===
                                                            "getting_started",
                                                    )
                                                    .map((step, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex flex-col items-center"
                                                        >
                                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 font-bold text-xl mb-3">
                                                                {
                                                                    step.step_number
                                                                }
                                                            </div>
                                                            <p className="text-xs max-w-[80px] text-center">
                                                                {step.title}
                                                            </p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* Actions */}
            <motion.div variants={itemVariants} className="flex justify-end">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open("/#setup-process", "_blank")}
                        className="gap-1"
                    >
                        <Eye size={16} />
                        <span>Preview on Website</span>
                    </Button>
                    <Button
                        onClick={saveSetupProcessData}
                        disabled={saving}
                        className="gap-1 bg-[#a5cd39] hover:bg-[#94b933]"
                    >
                        {saving ? (
                            <>
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SetupProcessEditor;
