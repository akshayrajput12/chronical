"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, FileText } from "lucide-react";
import Link from "next/link";
import {
    getCustomExhibitionParagraphSection,
    saveCustomExhibitionParagraphSection,
    CustomExhibitionParagraphSection,
} from "@/services/custom-exhibition-stands.service";

const CustomStandParagraphSectionEditor = () => {
    const [data, setData] = useState<CustomExhibitionParagraphSection>({
        paragraph_content: '',
        is_active: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await getCustomExhibitionParagraphSection();
            if (result) {
                setData(result);
            }
        } catch (error) {
            console.error('Error loading paragraph section data:', error);
            toast.error('Failed to load paragraph section data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof CustomExhibitionParagraphSection, value: any) => {
        setData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (!data.paragraph_content.trim()) {
            toast.error('Paragraph content is required');
            return;
        }

        setIsSaving(true);
        try {
            const success = await saveCustomExhibitionParagraphSection(data.paragraph_content);
            if (success) {
                toast.success('Paragraph section saved successfully!');
                await loadData(); // Reload to get updated data
            } else {
                toast.error('Failed to save paragraph section');
            }
        } catch (error) {
            console.error('Error saving paragraph section:', error);
            toast.error('Failed to save paragraph section');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39]"></div>
                    </div>
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
                                href="/admin/pages/custom-stand"
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Paragraph Section</h1>
                                <p className="text-gray-600">Manage the paragraph section content</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/customexhibitionstands"
                                target="_blank"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview Page
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Paragraph Content
                            </CardTitle>
                            <CardDescription>
                                Edit the paragraph content that appears in the section
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Paragraph Content */}
                            <div>
                                <Label htmlFor="paragraph_content">Paragraph Content</Label>
                                <Textarea
                                    id="paragraph_content"
                                    value={data.paragraph_content}
                                    onChange={(e) => handleInputChange('paragraph_content', e.target.value)}
                                    rows={8}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter paragraph content"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    This content will be displayed in the paragraph section.
                                </p>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            {/* Save Button */}
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-[#a5cd39] hover:bg-[#8fb32a] text-black"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>
                                Preview how the paragraph section will appear
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="bg-white p-6 rounded-lg border">
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        {data.paragraph_content || 'Enter paragraph content to see preview...'}
                                    </p>
                                </div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default CustomStandParagraphSectionEditor;
