"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Save,
    Eye,
    ArrowLeft,
    Shield,
    Globe,
    Mail,
    FileText,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PrivacyPolicy, PrivacyPolicyFormData, defaultPrivacyPolicyFormData } from "@/types/privacy-policy";
import TiptapEditor from "@/components/admin/tiptap-editor";
import { revalidatePathAction } from "@/services/revalidate.action";
import { toast } from "sonner";

const PrivacyPolicyAdminPage = () => {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState<PrivacyPolicyFormData>(defaultPrivacyPolicyFormData);

    // Load existing privacy policy data
    useEffect(() => {
        const loadPrivacyPolicy = async () => {
            try {
                const response = await fetch('/api/privacy-policy');
                const result = await response.json();

                if (result.success && result.data) {
                    const policy: PrivacyPolicy = result.data;
                    setFormData({
                        title: policy.title,
                        content: policy.content,
                        meta_title: policy.meta_title || '',
                        meta_description: policy.meta_description || '',
                        meta_keywords: policy.meta_keywords || '',
                        og_title: policy.og_title || '',
                        og_description: policy.og_description || '',
                        og_image_url: policy.og_image_url || '',
                        contact_email: policy.contact_email,
                        is_active: policy.is_active,
                    });
                }
            } catch (error) {
                console.error('Error loading privacy policy:', error);
                toast.error('Failed to load privacy policy');
            } finally {
                setInitialLoading(false);
            }
        };

        loadPrivacyPolicy();
    }, []);

    const handleInputChange = (field: keyof PrivacyPolicyFormData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/privacy-policy', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Privacy policy updated successfully');
                
                // Revalidate the privacy policy page
                await revalidatePathAction('/privacy-policy');
                
                // Optionally redirect or refresh
                // router.refresh();
            } else {
                toast.error(result.error || 'Failed to update privacy policy');
            }
        } catch (error) {
            console.error('Error saving privacy policy:', error);
            toast.error('Failed to save privacy policy');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = () => {
        window.open('/privacy-policy', '_blank');
    };

    if (initialLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a5cd39]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Shield className="text-[#a5cd39]" size={24} />
                        <h1 className="text-2xl font-bold text-gray-900">
                            Privacy Policy Management
                        </h1>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={handlePreview}
                        className="flex items-center space-x-2"
                    >
                        <Eye size={16} />
                        <span>Preview</span>
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-[#a5cd39] hover:bg-[#8fb32e] text-white flex items-center space-x-2"
                    >
                        <Save size={16} />
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="content" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content" className="flex items-center space-x-2">
                        <FileText size={16} />
                        <span>Content</span>
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="flex items-center space-x-2">
                        <Globe size={16} />
                        <span>SEO & Meta</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center space-x-2">
                        <Mail size={16} />
                        <span>Settings</span>
                    </TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Policy Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Privacy Policy"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="content">Content</Label>
                                <div className="mt-1 border rounded-md">
                                    <TiptapEditor
                                        content={formData.content}
                                        onChange={(content) => handleInputChange('content', content)}
                                        placeholder="Enter your privacy policy content..."
                                        className="min-h-[400px]"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEO Tab */}
                <TabsContent value="seo" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO & Meta Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="meta_title">Meta Title</Label>
                                <Input
                                    id="meta_title"
                                    value={formData.meta_title}
                                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                                    placeholder="Privacy Policy - Chronicle Exhibits LLC"
                                    className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Recommended: 50-60 characters
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="meta_description">Meta Description</Label>
                                <Textarea
                                    id="meta_description"
                                    value={formData.meta_description}
                                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                                    placeholder="Learn about how Chronicle Exhibits LLC protects your privacy..."
                                    className="mt-1"
                                    rows={3}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Recommended: 150-160 characters
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                                <Input
                                    id="meta_keywords"
                                    value={formData.meta_keywords}
                                    onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                                    placeholder="privacy policy, data protection, personal information"
                                    className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Separate keywords with commas
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="og_title">Open Graph Title</Label>
                                <Input
                                    id="og_title"
                                    value={formData.og_title}
                                    onChange={(e) => handleInputChange('og_title', e.target.value)}
                                    placeholder="Privacy Policy - Chronicle Exhibits LLC"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="og_description">Open Graph Description</Label>
                                <Textarea
                                    id="og_description"
                                    value={formData.og_description}
                                    onChange={(e) => handleInputChange('og_description', e.target.value)}
                                    placeholder="Learn about how Chronicle Exhibits LLC protects your privacy..."
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="og_image_url">Open Graph Image URL</Label>
                                <Input
                                    id="og_image_url"
                                    value={formData.og_image_url}
                                    onChange={(e) => handleInputChange('og_image_url', e.target.value)}
                                    placeholder="https://example.com/privacy-policy-image.jpg"
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Policy Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="contact_email">Contact Email</Label>
                                <Input
                                    id="contact_email"
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                                    placeholder="info@chroniclesexhibits.com"
                                    className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Email address for privacy-related inquiries
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
                                />
                                <Label htmlFor="is_active">Active Privacy Policy</Label>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PrivacyPolicyAdminPage;
