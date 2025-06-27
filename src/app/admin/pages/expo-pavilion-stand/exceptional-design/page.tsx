"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ExpoPavilionExceptionalDesign {
    id?: string;
    heading: string;
    paragraph_1: string;
    paragraph_2: string;
    image_url: string;
    image_alt: string;
    is_active: boolean;
}

interface DesignBenefit {
    id?: string;
    benefit_text: string;
    display_order: number;
    is_active: boolean;
}

const ExpoPavilionExceptionalDesignEditor = () => {
    const [designData, setDesignData] = useState<ExpoPavilionExceptionalDesign | null>(null);
    const [benefits, setBenefits] = useState<DesignBenefit[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load design section data
            const { data: designSection, error: designError } = await supabase
                .from("expo_pavilion_exceptional_design")
                .select("*")
                .eq("is_active", true)
                .single();

            if (designError && designError.code !== 'PGRST116') {
                throw designError;
            }

            if (designSection) {
                setDesignData(designSection);

                // Load benefits for this section
                const { data: benefitsData, error: benefitsError } = await supabase
                    .from("expo_pavilion_design_benefits")
                    .select("*")
                    .eq("design_section_id", designSection.id)
                    .eq("is_active", true)
                    .order("display_order");

                if (benefitsError) throw benefitsError;

                if (benefitsData && benefitsData.length > 0) {
                    setBenefits(benefitsData);
                }
            } else {
                // Create default entry if none exists
                const { data: newDesignData, error: insertError } = await supabase
                    .from("expo_pavilion_exceptional_design")
                    .insert({
                        heading: 'EXCEPTIONAL DESIGN SERVICES FOR PAVILION BOOTHS',
                        paragraph_1: 'Country Pavilion Expo Booth reflects a particular nation\'s culture, religion & way of living. It is a chain of small exhibition stands where you can display your products with the member exhibitors of your country. Explore companies across the globe pick out pavilion booths to promote their brand & sell out their products.',
                        paragraph_2: 'Pavilion booths are highly beneficial for promoting brands & products. Let\'s quickly look into its pros →',
                        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                        image_alt: 'Country Pavilion Exhibition Booth',
                        is_active: true,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                setDesignData(newDesignData);

                // Create default benefits
                const defaultBenefits = [
                    { benefit_text: 'You can target a vast number of potential consumers.', display_order: 1 },
                    { benefit_text: 'Enrich brand value by creating positive brand awareness.', display_order: 2 },
                    { benefit_text: 'Gives you an excellent chance to interact with new consumers who may become your future clients.', display_order: 3 },
                    { benefit_text: 'Allow you to make strong business networks and discover the latest business ideas.', display_order: 4 },
                ];

                for (const benefit of defaultBenefits) {
                    await supabase
                        .from("expo_pavilion_design_benefits")
                        .insert({
                            design_section_id: newDesignData.id,
                            benefit_text: benefit.benefit_text,
                            display_order: benefit.display_order,
                            is_active: true,
                        });
                }

                // Reload benefits
                const { data: benefitsData } = await supabase
                    .from("expo_pavilion_design_benefits")
                    .select("*")
                    .eq("design_section_id", newDesignData.id)
                    .eq("is_active", true)
                    .order("display_order");

                if (benefitsData) {
                    setBenefits(benefitsData);
                }
            }
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load section data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (!designData) return;

            // Save design section
            const { data: savedDesign, error: designError } = await supabase
                .from("expo_pavilion_exceptional_design")
                .upsert(designData, { onConflict: "id" })
                .select()
                .single();

            if (designError) throw designError;

            setDesignData(savedDesign);

            // Save benefits
            for (const benefit of benefits) {
                const benefitData = {
                    ...benefit,
                    design_section_id: savedDesign.id,
                };

                const { error: benefitError } = await supabase
                    .from("expo_pavilion_design_benefits")
                    .upsert(benefitData, { onConflict: "id" });

                if (benefitError) throw benefitError;
            }

            toast.success("Exceptional Design section updated successfully!");
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("Failed to save section data");
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
            const fileName = `exceptional-design-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('expo-pavilion-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('expo-pavilion-images')
                .getPublicUrl(filePath);

            if (designData) {
                setDesignData(prev => prev ? ({
                    ...prev,
                    image_url: publicUrl
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

    const addBenefit = () => {
        const newBenefit: DesignBenefit = {
            benefit_text: '',
            display_order: benefits.length + 1,
            is_active: true,
        };
        setBenefits([...benefits, newBenefit]);
    };

    const updateBenefit = (index: number, field: keyof DesignBenefit, value: any) => {
        const updatedBenefits = [...benefits];
        updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
        setBenefits(updatedBenefits);
    };

    const removeBenefit = (index: number) => {
        const updatedBenefits = benefits.filter((_, i) => i !== index);
        // Update display orders
        updatedBenefits.forEach((benefit, i) => {
            benefit.display_order = i + 1;
        });
        setBenefits(updatedBenefits);
    };

    if (isLoading || !designData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading exceptional design section...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
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
                                    Exceptional Design Section
                                </h1>
                                <p className="text-gray-600">
                                    Manage the exceptional design content and benefits
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
                        className="space-y-6"
                    >
                        {/* Main Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Content</CardTitle>
                                <CardDescription>
                                    Edit the main content for the exceptional design section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="heading">Section Heading</Label>
                                    <Input
                                        id="heading"
                                        value={designData.heading}
                                        onChange={(e) =>
                                            setDesignData(prev => prev ? ({
                                                ...prev,
                                                heading: e.target.value
                                            }) : null)
                                        }
                                        placeholder="Enter section heading"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="paragraph_1">First Paragraph</Label>
                                    <Textarea
                                        id="paragraph_1"
                                        value={designData.paragraph_1}
                                        onChange={(e) =>
                                            setDesignData(prev => prev ? ({
                                                ...prev,
                                                paragraph_1: e.target.value
                                            }) : null)
                                        }
                                        placeholder="Enter first paragraph content"
                                        rows={4}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="paragraph_2">Second Paragraph</Label>
                                    <Textarea
                                        id="paragraph_2"
                                        value={designData.paragraph_2}
                                        onChange={(e) =>
                                            setDesignData(prev => prev ? ({
                                                ...prev,
                                                paragraph_2: e.target.value
                                            }) : null)
                                        }
                                        placeholder="Enter second paragraph content"
                                        rows={3}
                                        className="mt-1"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={designData.is_active}
                                        onCheckedChange={(checked) =>
                                            setDesignData(prev => prev ? ({
                                                ...prev,
                                                is_active: checked
                                            }) : null)
                                        }
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Section Image</CardTitle>
                                <CardDescription>
                                    Manage the image for this section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="image_url">Image URL</Label>
                                    <Input
                                        id="image_url"
                                        value={designData.image_url}
                                        onChange={(e) =>
                                            setDesignData(prev => prev ? ({
                                                ...prev,
                                                image_url: e.target.value
                                            }) : null)
                                        }
                                        placeholder="Enter image URL"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="image_alt">Image Alt Text</Label>
                                    <Input
                                        id="image_alt"
                                        value={designData.image_alt}
                                        onChange={(e) =>
                                            setDesignData(prev => prev ? ({
                                                ...prev,
                                                image_alt: e.target.value
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
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Benefits and Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Benefits Management */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Benefits List</CardTitle>
                                        <CardDescription>
                                            Manage the bullet points for this section
                                        </CardDescription>
                                    </div>
                                    <Button
                                        onClick={addBenefit}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Input
                                            value={benefit.benefit_text}
                                            onChange={(e) =>
                                                updateBenefit(index, 'benefit_text', e.target.value)
                                            }
                                            placeholder="Enter benefit text"
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={() => removeBenefit(index)}
                                            size="sm"
                                            variant="destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    Preview how the section will appear
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 p-4 bg-white rounded-lg border">
                                    <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide text-center">
                                        {designData.heading}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-700 text-justify">
                                                {designData.paragraph_1}
                                            </p>
                                            <p className="text-sm text-gray-700 text-justify">
                                                {designData.paragraph_2}
                                            </p>
                                            <ul className="space-y-2 ml-4">
                                                {benefits.map((benefit, index) => (
                                                    <li key={index} className="flex items-start text-sm">
                                                        <span className="text-[#a5cd39] mr-2">•</span>
                                                        <span>{benefit.benefit_text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="h-32 rounded overflow-hidden">
                                            <img
                                                src={designData.image_url}
                                                alt={designData.image_alt}
                                                className="w-full h-full object-cover"
                                            />
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

export default ExpoPavilionExceptionalDesignEditor;
