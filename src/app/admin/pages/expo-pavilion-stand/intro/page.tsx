"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ExpoPavilionIntro {
    id?: string;
    heading: string;
    paragraph_1: string;
    paragraph_2: string;
    is_active: boolean;
}

const ExpoPavilionIntroEditor = () => {
    const [introData, setIntroData] = useState<ExpoPavilionIntro | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadIntroData();
    }, []);

    const loadIntroData = async () => {
        try {
            const { data, error } = await supabase
                .from("expo_pavilion_intro")
                .select("*")
                .eq("is_active", true)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                setIntroData(data);
            } else {
                // Create default entry if none exists
                const { data: newData, error: insertError } = await supabase
                    .from("expo_pavilion_intro")
                    .insert({
                        heading: 'COUNTRY PAVILION EXPO BOOTH',
                        paragraph_1: 'Top choice for showcasing national excellence on a global stage. As the premier provider of country pavilion expo booth in Dubai, we specialize in creating immersive and impactful spaces that highlight the unique offerings of your nation. Our booths offer unparalleled visibility and serve as powerful platforms for promoting your country\'s culture, industry, and innovation.',
                        paragraph_2: 'With Chronicle Exhibits Dubai comprehensive services and attention to detail, you can trust us to elevate your country\'s presence at any event. Whether you\'re promoting trade, tourism, investment opportunities, our country pavilion exhibition booths provide the perfect platform for showcasing the best of what your nation has to offer.',
                        is_active: true,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                setIntroData(newData);
            }
        } catch (error) {
            console.error("Error loading intro data:", error);
            toast.error("Failed to load intro data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (!introData) return;

            const { data, error } = await supabase
                .from("expo_pavilion_intro")
                .upsert(introData, { onConflict: "id" })
                .select()
                .single();

            if (error) throw error;

            setIntroData(data);
            toast.success("Intro section updated successfully!");
        } catch (error) {
            console.error("Error saving intro data:", error);
            toast.error("Failed to save intro data");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !introData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading intro section...</p>
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
                                    Intro Section
                                </h1>
                                <p className="text-gray-600">
                                    Manage the introduction content for Expo Pavilion Stand page
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
                                <CardTitle>Intro Content</CardTitle>
                                <CardDescription>
                                    Edit the heading and content paragraphs for the intro section
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="heading">Section Heading</Label>
                                    <Input
                                        id="heading"
                                        value={introData.heading}
                                        onChange={(e) =>
                                            setIntroData(prev => prev ? ({
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
                                        value={introData.paragraph_1}
                                        onChange={(e) =>
                                            setIntroData(prev => prev ? ({
                                                ...prev,
                                                paragraph_1: e.target.value
                                            }) : null)
                                        }
                                        placeholder="Enter first paragraph content"
                                        rows={5}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="paragraph_2">Second Paragraph</Label>
                                    <Textarea
                                        id="paragraph_2"
                                        value={introData.paragraph_2}
                                        onChange={(e) =>
                                            setIntroData(prev => prev ? ({
                                                ...prev,
                                                paragraph_2: e.target.value
                                            }) : null)
                                        }
                                        placeholder="Enter second paragraph content"
                                        rows={5}
                                        className="mt-1"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={introData.is_active}
                                        onCheckedChange={(checked) =>
                                            setIntroData(prev => prev ? ({
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
                                    Preview how the intro section will appear
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 p-4 bg-white rounded-lg border">
                                    <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide text-center">
                                        {introData.heading}
                                    </h2>
                                    
                                    <div className="space-y-4 text-gray-700">
                                        <p className="text-sm leading-relaxed text-justify">
                                            {introData.paragraph_1}
                                        </p>
                                        
                                        <p className="text-sm leading-relaxed text-justify">
                                            {introData.paragraph_2}
                                        </p>
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

export default ExpoPavilionIntroEditor;
