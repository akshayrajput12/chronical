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
        form_title: '',
        form_subtitle: '',
        success_message: '',
        success_description: '',
        sidebar_phone: '',
        sidebar_email: '',
        sidebar_address: '',
        max_file_size_mb: 10,
        allowed_file_types: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
        enable_file_upload: true,
        require_terms_agreement: true,
        terms_text: '',
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
                    form_title: data.form_title,
                    form_subtitle: data.form_subtitle || '',
                    success_message: data.success_message,
                    success_description: data.success_description,
                    sidebar_phone: data.sidebar_phone,
                    sidebar_email: data.sidebar_email,
                    sidebar_address: data.sidebar_address,
                    max_file_size_mb: data.max_file_size_mb,
                    allowed_file_types: data.allowed_file_types,
                    enable_file_upload: data.enable_file_upload,
                    require_terms_agreement: data.require_terms_agreement,
                    terms_text: data.terms_text,
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

    const handleInputChange = (field: keyof ContactFormSettingsInput, value: string | number | boolean | string[]) => {
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
            if (!formData.form_title.trim()) {
                setError('Form title is required');
                return;
            }
            if (!formData.success_message.trim()) {
                setError('Success message is required');
                return;
            }
            if (!formData.success_description.trim()) {
                setError('Success description is required');
                return;
            }
            if (!formData.sidebar_phone.trim()) {
                setError('Sidebar phone is required');
                return;
            }
            if (!formData.sidebar_email.trim()) {
                setError('Sidebar email is required');
                return;
            }
            if (!formData.sidebar_address.trim()) {
                setError('Sidebar address is required');
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
                {/* Form Title */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Form Title
                        </CardTitle>
                        <CardDescription>
                            Configure the main form title and subtitle
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="form_title">Form Title *</Label>
                            <Input
                                id="form_title"
                                value={formData.form_title}
                                onChange={(e) => handleInputChange('form_title', e.target.value)}
                                placeholder="Enter form title"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="form_subtitle">Form Subtitle</Label>
                            <Input
                                id="form_subtitle"
                                value={formData.form_subtitle || ''}
                                onChange={(e) => handleInputChange('form_subtitle', e.target.value)}
                                placeholder="Enter form subtitle (optional)"
                                className="mt-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Contact Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Sidebar Contact Information
                        </CardTitle>
                        <CardDescription>
                            Configure the contact information displayed in the form sidebar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="sidebar_phone">Phone *</Label>
                            <Input
                                id="sidebar_phone"
                                value={formData.sidebar_phone}
                                onChange={(e) => handleInputChange('sidebar_phone', e.target.value)}
                                placeholder="Enter phone number"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="sidebar_email">Email *</Label>
                            <Input
                                id="sidebar_email"
                                value={formData.sidebar_email}
                                onChange={(e) => handleInputChange('sidebar_email', e.target.value)}
                                placeholder="Enter email address"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="sidebar_address">Address *</Label>
                            <Textarea
                                id="sidebar_address"
                                value={formData.sidebar_address}
                                onChange={(e) => handleInputChange('sidebar_address', e.target.value)}
                                placeholder="Enter address"
                                rows={3}
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
                            Configure success messages
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
                            <Label htmlFor="success_description">Success Description *</Label>
                            <Textarea
                                id="success_description"
                                value={formData.success_description}
                                onChange={(e) => handleInputChange('success_description', e.target.value)}
                                placeholder="Detailed description shown after successful submission"
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
                                    value={Array.isArray(formData.allowed_file_types) ? formData.allowed_file_types.join(',') : ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const arrayValue = value.split(',').map(type => type.trim()).filter(type => type.length > 0);
                                        handleInputChange('allowed_file_types', arrayValue);
                                    }}
                                    placeholder="e.g., .pdf,.doc,.docx,.jpg,.png"
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Comma-separated list of allowed file extensions (include the dot, e.g., .pdf)
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
                            id="require_terms_agreement"
                            checked={formData.require_terms_agreement}
                            onCheckedChange={(checked) => handleInputChange('require_terms_agreement', checked)}
                        />
                        <Label htmlFor="require_terms_agreement">Require Terms Agreement</Label>
                    </div>

                    {formData.require_terms_agreement && (
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
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Status Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Status Settings</CardTitle>
                    <CardDescription>
                        Configure form status
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active || false}
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
