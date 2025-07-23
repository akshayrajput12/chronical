"use client";
import { PageName } from "@/app/admin/constants/pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Save } from "lucide-react";
import React from "react";

const HomePageSeo = () => {
    const [seoData, setSeoData] = React.useState<{
        meta_title: string;
        meta_description: string;
        meta_keywords: string;
    }>({
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
    });

    const [saving, setSaving] = React.useState(false);
    const [fetchingData, setFetchingData] = React.useState(false);

    React.useEffect(() => {
        const fetchSeoData = async () => {
            setFetchingData(true);

            try {
                const { data, error } = await supabase
                    .from("static_page_seo_data")
                    .select("*")
                    .eq("page_name", PageName.CUSTOM_STANDS);
                if (error) {
                    console.error("Error fetching seo data:", error);
                    return;
                }
                if (data.length === 0) {
                    setSeoData({
                        meta_title: "",
                        meta_description: "",
                        meta_keywords: "",
                    });
                    return;
                }
                setSeoData(data[0]);
            } catch (error) {
                console.error("Error fetching seo data:", error);
            } finally {
                setFetchingData(false);
            }
        };

        fetchSeoData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        if (
            !seoData.meta_title ||
            !seoData.meta_description ||
            !seoData.meta_keywords
        ) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const { error } = await supabase
                .from("static_page_seo_data")
                .update(seoData)
                .eq("page_name", PageName.CUSTOM_STANDS);

            if (error) {
                console.error("Error saving seo data:", error);
                return;
            }

            alert("SEO data saved successfully");
        } catch (error) {
            console.error("Error saving seo data:", error);
            alert("An error occurred while saving SEO data");
        } finally {
            setSaving(false);
        }
    };

    if (fetchingData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {PageName.CUSTOM_STANDS.toUpperCase()} Page SEO Data
                        </h2>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        type="button"
                        className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="meta_title">Meta Title</Label>
                            <Input
                                id="meta_title"
                                value={seoData.meta_title}
                                onChange={e =>
                                    setSeoData(prev => ({
                                        ...prev,
                                        meta_title: e.target.value || "",
                                    }))
                                }
                                placeholder="SEO title"
                            />
                        </div>
                        <div>
                            <Label htmlFor="meta_description">
                                Meta Description
                            </Label>
                            <Input
                                id="meta_description"
                                value={seoData.meta_description}
                                onChange={e =>
                                    setSeoData(prev => ({
                                        ...prev,
                                        meta_description: e.target.value,
                                    }))
                                }
                                placeholder="SEO description"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="meta_keywords">Meta Keywords</Label>
                        <Input
                            id="meta_keywords"
                            value={seoData.meta_keywords || ""}
                            onChange={e =>
                                setSeoData(prev => ({
                                    ...prev,
                                    meta_keywords: e.target.value,
                                }))
                            }
                            placeholder="exhibition, stands, dubai, trade show"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageSeo;
