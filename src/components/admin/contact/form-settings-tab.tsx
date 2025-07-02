"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { contactAdminService } from '@/lib/services/contact';
import { ContactFormSettings, ContactFormSettingsInput } from '@/types/contact';
import { Save, Loader2, AlertCircle, CheckCircle, Settings } from 'lucide-react';

export default function ContactFormSettingsTab() {
    const [formSettings, setFormSettings] = useState<ContactFormSettings | null>(null);
    const [formData, setFormData] = useState<ContactFormSettingsInput>({
        sidebar_title: '',
        sidebar_description: '',
        success_message: '',
        error_message: '',
        max_file_size_mb: 10,
        allowed_file_types: '',
        enable_file_upload: true,
        require_terms_acceptance: true,
        terms_text: '',
        terms_link: '',
        enable_spam_protection: true,
        is_active: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        loadFormSettings();
    }, []);

    const loadFormSettings = async () => {
        try {
            setLoading(true);
            const data = await contactAdminService.getFormSettings();
            if (data) {
                setFormSettings(data);
                setFormData({
                    sidebar_title: data.sidebar_title,
                    sidebar_description: data.sidebar_description,
                    success_message: data.success_message,
                    error_message: data.error_message,
                    max_file_size_mb: data.max_file_size_mb,
                    allowed_file_types: data.allowed_file_types,
                    enable_file_upload: data.enable_file_upload,
                    require_terms_acceptance: data.require_terms_acceptance,
                    terms_text: data.terms_text,
                    terms_link: data.terms_link || '',
                    enable_spam_protection: data.enable_spam_protection,
                    is_active: data.is_active
                });
            }
        } catch (error) {
            console.error('Failed to load form settings:', error);
            setError('Failed to load form settings');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof ContactFormSettingsInput, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear messages when user starts editing
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // Validate required fields
            if (!formData.sidebar_title.trim()) {
                setError('Sidebar title is required');
                return;
            }
            if (!formData.sidebar_description.trim()) {
                setError('Sidebar description is required');
                return;
            }
            if (!formData.success_message.trim()) {
                setError('Success message is required');
                return;
            }
            if (!formData.error_message.trim()) {
                setError('Error message is required');
                return;
            }

            let result;
            if (formSettings) {
                // Update existing
                result = await contactAdminService.updateFormSettings(formSettings.id, formData);
            } else {
                // Create new
                result = await contactAdminService.createFormSettings(formData);
            }

            if (result) {
                setSuccess('Form settings saved successfully!');
                setFormSettings(result);
                // Reload data to ensure consistency
                setTimeout(() => {
                    loadFormSettings();
                }, 1000);
            } else {
                setError('Failed to save form settings');
            }
        } catch (error) {
            console.error('Save error:', error);
            setError('Failed to save form settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading form settings...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sidebar Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Sidebar Content
                        </CardTitle>
                        <CardDescription>
                            Configure the content displayed in the form sidebar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="sidebar_title">Sidebar Title *</Label>
                            <Input
                                id="sidebar_title"
                                value={formData.sidebar_title}
                                onChange={(e) => handleInputChange('sidebar_title', e.target.value)}
                                placeholder="Enter sidebar title"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="sidebar_description">Sidebar Description *</Label>
                            <Textarea
                                id="sidebar_description"
                                value={formData.sidebar_description}
                                onChange={(e) => handleInputChange('sidebar_description', e.target.value)}
                                placeholder="Enter sidebar description"
                                rows={4}
                                className="mt-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Messages */}
                <Card>
                    <CardHeader>
                        <CardTitle>Form Messages</CardTitle>
                        <CardDescription>
                            Configure success and error messages
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="success_message">Success Message *</Label>
                            <Textarea
                                id="success_message"
                                value={formData.success_message}
                                onChange={(e) => handleInputChange('success_message', e.target.value)}
                                placeholder="Message shown when form is submitted successfully"
                                rows={3}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="error_message">Error Message *</Label>
                            <Textarea
                                id="error_message"
                                value={formData.error_message}
                                onChange={(e) => handleInputChange('error_message', e.target.value)}
                                placeholder="Message shown when form submission fails"
                                rows={3}
                                className="mt-1"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* File Upload Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>File Upload Settings</CardTitle>
                    <CardDescription>
                        Configure file upload functionality and restrictions
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="enable_file_upload"
                            checked={formData.enable_file_upload}
                            onCheckedChange={(checked) => handleInputChange('enable_file_upload', checked)}
                        />
                        <Label htmlFor="enable_file_upload">Enable File Upload</Label>
                    </div>

                    {formData.enable_file_upload && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                            <div>
                                <Label htmlFor="max_file_size_mb">Max File Size (MB)</Label>
                                <Input
                                    id="max_file_size_mb"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.max_file_size_mb}
                                    onChange={(e) => handleInputChange('max_file_size_mb', parseInt(e.target.value) || 10)}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="allowed_file_types">Allowed File Types</Label>
                                <Input
                                    id="allowed_file_types"
                                    value={formData.allowed_file_types}
                                    onChange={(e) => handleInputChange('allowed_file_types', e.target.value)}
                                    placeholder="e.g., pdf,doc,docx,jpg,png"
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Comma-separated list of allowed file extensions
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Terms and Privacy */}
            <Card>
                <CardHeader>
                    <CardTitle>Terms and Privacy</CardTitle>
                    <CardDescription>
                        Configure terms acceptance and privacy settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="require_terms_acceptance"
                            checked={formData.require_terms_acceptance}
                            onCheckedChange={(checked) => handleInputChange('require_terms_acceptance', checked)}
                        />
                        <Label htmlFor="require_terms_acceptance">Require Terms Acceptance</Label>
                    </div>

                    {formData.require_terms_acceptance && (
                        <div className="space-y-4 pl-6">
                            <div>
                                <Label htmlFor="terms_text">Terms Text</Label>
                                <Input
                                    id="terms_text"
                                    value={formData.terms_text}
                                    onChange={(e) => handleInputChange('terms_text', e.target.value)}
                                    placeholder="I agree to the terms and conditions"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="terms_link">Terms Link (Optional)</Label>
                                <Input
                                    id="terms_link"
                                    value={formData.terms_link}
                                    onChange={(e) => handleInputChange('terms_link', e.target.value)}
                                    placeholder="https://example.com/terms"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                        Configure spam protection and security features
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="enable_spam_protection"
                            checked={formData.enable_spam_protection}
                            onCheckedChange={(checked) => handleInputChange('enable_spam_protection', checked)}
                        />
                        <Label htmlFor="enable_spam_protection">Enable Spam Protection</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                        />
                        <Label htmlFor="is_active">Form Active</Label>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="w-full sm:w-auto"
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Form Settings
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
