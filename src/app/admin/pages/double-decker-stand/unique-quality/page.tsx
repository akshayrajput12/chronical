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
import { createClient } from "@/lib/supabase/client";
import { Save, Eye, AlertCircle } from "lucide-react";

interface UniqueQualitySection {
    id: string;
    main_heading: string;
    paragraph_1: string;
    paragraph_2: string;
    highlighted_text: string | null;
    is_active: boolean;
}

const DoubleDeckersUniqueQualityAdminPage = () => {
    const [sectionData, setSectionData] = useState<UniqueQualitySection | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    // Load section data
    const loadSectionData = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("double_decker_unique_quality_sections")
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
                    .from("double_decker_unique_quality_sections")
                    .insert({
                        main_heading:
                            "UNIQUE EXCELLENT QUALITY DOUBLE STOREY EXHIBITION BOOTHS",
                        paragraph_1:
                            "Welcome to Double Decker Exhibition Stands in Dubai – your premier destination for innovative exhibition solutions that elevate your brand presence. As Dubai's leading provider of double-decker stands, we specialize in creating impactful spaces that leave lasting impressions on your audience.",
                        paragraph_2:
                            "Our stands offer versatility and sophistication, providing the perfect platform for showcasing your products. Whether it's a trade show or conference, our team collaborates closely with you to reflecting your brand identity. Every element of these stands is manufactured to upgrade your brand image & meet your specific business requirements. These stands help you achieve your objectives and catch the convinced attention of the visitors.",
                        highlighted_text: "design customized stands",
                        is_active: true,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                setSectionData(newData);
            }
        } catch (error) {
            console.error("Error loading section data:", error);
            toast.error("Failed to load unique quality section data");
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
                .from("double_decker_unique_quality_sections")
                .update({
                    main_heading: sectionData.main_heading,
                    paragraph_1: sectionData.paragraph_1,
                    paragraph_2: sectionData.paragraph_2,
                    highlighted_text: sectionData.highlighted_text,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", sectionData.id);

            if (error) throw error;

            toast.success("Unique quality section updated successfully!");
        } catch (error) {
            console.error("Error saving section data:", error);
            toast.error("Failed to save unique quality section");
        } finally {
            setSaving(false);
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
                        There was an error loading the unique quality section
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
                    Unique Quality Section Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage the unique quality section content
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Section Content</CardTitle>
                        <CardDescription>
                            Edit the heading and content paragraphs
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

                        {/* Highlighted Text */}
                        <div className="space-y-2">
                            <Label htmlFor="highlighted_text">
                                Highlighted Text (Green)
                            </Label>
                            <Input
                                id="highlighted_text"
                                value={sectionData.highlighted_text || ""}
                                onChange={e =>
                                    setSectionData({
                                        ...sectionData,
                                        highlighted_text: e.target.value,
                                    })
                                }
                                placeholder="Enter text to highlight in green"
                            />
                            <p className="text-sm text-gray-500">
                                This text will appear in green color within the
                                second paragraph
                            </p>
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
                            Preview how the unique quality section will appear
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            className="space-y-6 p-4 bg-white rounded-lg border"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Heading */}
                            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                {sectionData.main_heading}
                            </h2>

                            {/* First Paragraph */}
                            <p className="text-sm leading-relaxed text-justify text-gray-700">
                                {sectionData.paragraph_1}
                            </p>

                            {/* Second Paragraph with Highlighted Text */}
                            <p className="text-sm leading-relaxed text-justify text-gray-700">
                                {sectionData.highlighted_text ? (
                                    <>
                                        {sectionData.paragraph_2
                                            .split(sectionData.highlighted_text)
                                            .map((part, index, array) => (
                                                <React.Fragment key={index}>
                                                    {part}
                                                    {index <
                                                        array.length - 1 && (
                                                        <span className="text-[#a5cd39] font-medium">
                                                            {
                                                                sectionData.highlighted_text
                                                            }
                                                        </span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                    </>
                                ) : (
                                    sectionData.paragraph_2
                                )}
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DoubleDeckersUniqueQualityAdminPage;
