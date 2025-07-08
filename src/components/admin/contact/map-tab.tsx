"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { contactAdminService } from "@/lib/services/contact";
import { ContactMapSettings, ContactMapSettingsInput } from "@/types/contact";
import { Save, Loader2, AlertCircle, CheckCircle, MapPin } from "lucide-react";
import { revalidatePath } from "next/cache";

export default function ContactMapTab() {
    const [mapSettings, setMapSettings] = useState<ContactMapSettings | null>(
        null,
    );
    const [formData, setFormData] = useState<ContactMapSettingsInput>({
        map_embed_url: "",
        map_title: "",
        map_height: 400,
        is_active: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    useEffect(() => {
        loadMapSettings();
    }, []);

    const loadMapSettings = async () => {
        try {
            setLoading(true);
            const data = await contactAdminService.getMapSettings();
            if (data) {
                setMapSettings(data);
                setFormData({
                    map_embed_url: data.map_embed_url,
                    map_title: data.map_title || "",
                    map_height: data.map_height || 400,
                    is_active: data.is_active,
                });
            }
        } catch (error) {
            console.error("Failed to load map settings:", error);
            setError("Failed to load map settings");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        field: keyof ContactMapSettingsInput,
        value: string | boolean | number,
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        // Clear messages when user starts editing
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            // Validate required fields
            if (!formData.map_embed_url.trim()) {
                setError("Map embed URL is required");
                return;
            }

            let result;
            if (mapSettings) {
                // Update existing
                result = await contactAdminService.updateMapSettings(
                    mapSettings.id,
                    formData,
                );
            } else {
                // Create new
                result = await contactAdminService.createMapSettings(formData);
            }

            if (result) {
                setSuccess("Map settings saved successfully!");
                setMapSettings(result);
                // Reload data to ensure consistency
                setTimeout(() => {
                    loadMapSettings();
                }, 1000);
            } else {
                setError("Failed to save map settings");
            }
        } catch (error) {
            console.error("Save error:", error);
            setError("Failed to save map settings");
        } finally {
            revalidatePath("/contact-us");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading map settings...</span>
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
                    <AlertDescription className="text-green-800">
                        {success}
                    </AlertDescription>
                </Alert>
            )}

            {/* Map Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Map Settings
                    </CardTitle>
                    <CardDescription>
                        Configure the embedded map displayed on the contact page
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="map_embed_url">Map Embed URL *</Label>
                        <Textarea
                            id="map_embed_url"
                            value={formData.map_embed_url}
                            onChange={e =>
                                handleInputChange(
                                    "map_embed_url",
                                    e.target.value,
                                )
                            }
                            placeholder="Enter Google Maps embed URL or iframe code"
                            rows={4}
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You can paste the full iframe code from Google Maps
                            or just the src URL
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={checked =>
                                handleInputChange("is_active", checked)
                            }
                        />
                        <Label htmlFor="is_active">Map Active</Label>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Map Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Additional Settings
                    </CardTitle>
                    <CardDescription>
                        Configure additional map display options
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="map_title">Map Title (Optional)</Label>
                        <Input
                            id="map_title"
                            value={formData.map_title}
                            onChange={e =>
                                handleInputChange("map_title", e.target.value)
                            }
                            placeholder="Enter map section title"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="map_height">Map Height (pixels)</Label>
                        <Input
                            id="map_height"
                            type="number"
                            value={formData.map_height}
                            onChange={e =>
                                handleInputChange(
                                    "map_height",
                                    parseInt(e.target.value) || 400,
                                )
                            }
                            placeholder="400"
                            min="200"
                            max="800"
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Height of the map in pixels (200-800)
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Section */}
            {formData.map_embed_url && (
                <Card>
                    <CardHeader>
                        <CardTitle>Map Preview</CardTitle>
                        <CardDescription>
                            Preview of how the map will appear on the contact
                            page
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="bg-gray-100 rounded-lg overflow-hidden"
                            style={{ height: `${formData.map_height}px` }}
                        >
                            {formData.map_embed_url.includes("<iframe") ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: formData.map_embed_url,
                                    }}
                                />
                            ) : (
                                <iframe
                                    src={formData.map_embed_url}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            )}
                        </div>
                        {!formData.is_active && (
                            <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                                ⚠️ This map is currently inactive and will not
                                be displayed on the website.
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

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
                            Save Map Settings
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
