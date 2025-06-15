"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Eye,
    Plus,
    Trash,
    Info,
    BarChart3,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Types for stats data
interface BusinessStat {
    id: string;
    value: number;
    label: string;
    sublabel: string;
    display_order: number;
}

interface BusinessStatInput {
    value: number;
    label: string;
    sublabel: string;
    display_order: number;
}

const StatsEditor = () => {
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

    // State for stats data
    const [stats, setStats] = useState<BusinessStat[]>([]);
    const [businessSectionId, setBusinessSectionId] = useState<string | null>(
        null,
    );

    // State for loading and saving
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch business section ID and stats data on component mount
    useEffect(() => {
        const fetchStatsData = async () => {
            setLoading(true);
            try {
                // First, get the active business section ID
                const { data: sectionData, error: sectionError } =
                    await supabase
                        .from("business_sections")
                        .select("id")
                        .eq("is_active", true)
                        .single();

                if (sectionError || !sectionData) {
                    console.error(
                        "Error fetching business section:",
                        sectionError,
                    );
                    toast.error("Failed to load business section data");
                    return;
                }

                setBusinessSectionId(sectionData.id);

                // Then fetch the stats for this section
                const { data: statsData, error: statsError } = await supabase
                    .from("business_stats")
                    .select("id, value, label, sublabel, display_order")
                    .eq("business_section_id", sectionData.id)
                    .order("display_order", { ascending: true });

                if (statsError) {
                    console.error("Error fetching stats:", statsError);
                    toast.error("Failed to load stats data");
                    return;
                }

                setStats(statsData || []);
            } catch (error) {
                console.error("Error fetching stats data:", error);
                toast.error("Failed to load stats data");
            } finally {
                setLoading(false);
            }
        };

        fetchStatsData();
    }, []);

    // Add new stat
    const addStat = () => {
        const newStat: BusinessStat = {
            id: `temp-${Date.now()}`, // Temporary ID for new stats
            value: 0,
            label: "New Stat",
            sublabel: "DESCRIPTION",
            display_order: stats.length,
        };
        setStats(prev => [...prev, newStat]);
    };

    // Remove stat
    const removeStat = (index: number) => {
        setStats(prev => prev.filter((_, i) => i !== index));
    };

    // Update stat
    const updateStat = (
        index: number,
        field: keyof BusinessStatInput,
        value: string | number,
    ) => {
        setStats(prev =>
            prev.map((stat, i) =>
                i === index
                    ? {
                          ...stat,
                          [field]:
                              field === "value" || field === "display_order"
                                  ? Number(value)
                                  : value,
                      }
                    : stat,
            ),
        );
    };

    // Move stat up
    const moveStatUp = (index: number) => {
        if (index === 0) return;
        setStats(prev => {
            const newStats = [...prev];
            [newStats[index - 1], newStats[index]] = [
                newStats[index],
                newStats[index - 1],
            ];
            return newStats.map((stat, i) => ({ ...stat, display_order: i }));
        });
    };

    // Move stat down
    const moveStatDown = (index: number) => {
        if (index === stats.length - 1) return;
        setStats(prev => {
            const newStats = [...prev];
            [newStats[index], newStats[index + 1]] = [
                newStats[index + 1],
                newStats[index],
            ];
            return newStats.map((stat, i) => ({ ...stat, display_order: i }));
        });
    };

    // Save stats data
    const saveStatsData = async () => {
        if (!businessSectionId) {
            toast.error("Business section ID not found");
            return;
        }

        setSaving(true);
        try {
            // Delete existing stats
            const { error: deleteError } = await supabase
                .from("business_stats")
                .delete()
                .eq("business_section_id", businessSectionId);

            if (deleteError) {
                console.error("Error deleting existing stats:", deleteError);
                toast.error("Failed to update stats");
                return;
            }

            // Insert new stats
            const statsToInsert = stats.map((stat, index) => ({
                business_section_id: businessSectionId,
                value: stat.value,
                label: stat.label,
                sublabel: stat.sublabel,
                display_order: index,
            }));

            const { error: insertError } = await supabase
                .from("business_stats")
                .insert(statsToInsert);

            if (insertError) {
                console.error("Error inserting stats:", insertError);
                toast.error("Failed to save stats");
                return;
            }

            toast.success("Stats saved successfully");

            // Refresh data to get new IDs
            const { data: refreshedStats } = await supabase
                .from("business_stats")
                .select("id, value, label, sublabel, display_order")
                .eq("business_section_id", businessSectionId)
                .order("display_order", { ascending: true });

            if (refreshedStats) {
                setStats(refreshedStats);
            }
        } catch (error) {
            console.error("Error saving stats:", error);
            toast.error("Failed to save stats");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a5cd39] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading stats data...</p>
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
                        Stats Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage business statistics that appear on the website
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-8 w-8 text-[#a5cd39]" />
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
                                    Stats Management
                                </p>
                                <p>
                                    Manage the business statistics that appear
                                    in the Business Hub section. These stats
                                    showcase key business metrics and
                                    achievements.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Stats Management */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Business Statistics</CardTitle>
                        <CardDescription>
                            Add, edit, and reorder the statistics that appear on
                            the website
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.id}
                                    className="border rounded-lg p-4 bg-gray-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                        <div>
                                            <Label htmlFor={`value-${index}`}>
                                                Value
                                            </Label>
                                            <Input
                                                id={`value-${index}`}
                                                type="number"
                                                value={stat.value}
                                                onChange={e =>
                                                    updateStat(
                                                        index,
                                                        "value",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter value"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`label-${index}`}>
                                                Label
                                            </Label>
                                            <Input
                                                id={`label-${index}`}
                                                value={stat.label}
                                                onChange={e =>
                                                    updateStat(
                                                        index,
                                                        "label",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter label"
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor={`sublabel-${index}`}
                                            >
                                                Sublabel
                                            </Label>
                                            <Input
                                                id={`sublabel-${index}`}
                                                value={stat.sublabel}
                                                onChange={e =>
                                                    updateStat(
                                                        index,
                                                        "sublabel",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter sublabel"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    moveStatUp(index)
                                                }
                                                disabled={index === 0}
                                            >
                                                <ArrowUp size={16} />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    moveStatDown(index)
                                                }
                                                disabled={
                                                    index === stats.length - 1
                                                }
                                            >
                                                <ArrowDown size={16} />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    removeStat(index)
                                                }
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                onClick={addStat}
                                className="w-full gap-2"
                            >
                                <Plus size={16} />
                                Add New Stat
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Preview Section */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        <CardDescription>
                            Preview how the stats will appear on the website
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-300">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-medium text-[#a5cd39]">
                                        {stat.label
                                            .toLowerCase()
                                            .includes("countries") ||
                                        stat.label
                                            .toLowerCase()
                                            .includes("country")
                                            ? `${stat.value}+`
                                            : stat.value >= 20000
                                            ? `${(stat.value / 1000000).toFixed(
                                                  1,
                                              )}M`
                                            : stat.value.toLocaleString()}
                                    </div>
                                    <div className="text-lg font-medium text-gray-800">
                                        {stat.label}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {stat.sublabel}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Actions */}
            <motion.div variants={itemVariants} className="flex justify-end">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open("/#business-hub", "_blank")}
                        className="gap-1"
                    >
                        <Eye size={16} />
                        <span>Preview on Website</span>
                    </Button>
                    <Button
                        onClick={saveStatsData}
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

export default StatsEditor;
