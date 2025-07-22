"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    MapPin,
    Globe,
    Users,
    Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { City } from "@/types/cities";
import Link from "next/link";

const CitiesAdminPage = () => {
    const router = useRouter();
    const supabase = createClient();
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "active" | "inactive"
    >("all");
    const [selectedCities, setSelectedCities] = useState<string[]>([]);

    // Fetch cities
    const fetchCities = useCallback(async () => {
        try {
            setLoading(true);
            let query = supabase
                .from("cities")
                .select("*")
                .order("created_at", { ascending: false });

            if (statusFilter !== "all") {
                query = query.eq("is_active", statusFilter === "active");
            }

            if (searchTerm) {
                query = query.or(
                    `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,country_code.ilike.%${searchTerm}%`,
                );
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching cities:", error);
                return;
            }

            setCities(data || []);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchTerm, supabase]);

    // Delete city and associated images
    const handleDelete = async (cityId: string) => {
        if (
            !confirm(
                "Are you sure you want to delete this city? This action cannot be undone.",
            )
        ) {
            return;
        }

        try {
            // First get the city data to find associated images
            const { data: city, error: fetchError } = await supabase
                .from("cities")
                .select("hero_image_url")
                .eq("id", cityId)
                .single();

            if (fetchError) {
                console.error("Error fetching city data:", fetchError);
            }

            // Get all related images from content sections and services
            const { data: contentSections } = await supabase
                .from("city_content_sections")
                .select("image_url")
                .eq("city_id", cityId);

            const { data: services } = await supabase
                .from("city_services")
                .select("image_url")
                .eq("city_id", cityId);

            // Collect all image URLs
            const imageUrls = [];
            if (city?.hero_image_url) imageUrls.push(city.hero_image_url);
            if (contentSections) {
                contentSections.forEach(section => {
                    if (section.image_url) imageUrls.push(section.image_url);
                });
            }
            if (services) {
                services.forEach(service => {
                    if (service.image_url) imageUrls.push(service.image_url);
                });
            }

            // Delete the city (this will cascade delete related data)
            const { error } = await supabase
                .from("cities")
                .delete()
                .eq("id", cityId);

            if (error) {
                console.error("Error deleting city:", error);
                alert("Failed to delete city");
                return;
            }

            // Delete associated images from storage
            for (const imageUrl of imageUrls) {
                try {
                    // Extract file path from URL
                    const urlParts = imageUrl.split("/");
                    const fileName = urlParts[urlParts.length - 1];
                    const folderName = urlParts[urlParts.length - 2];
                    const filePath = folderName
                        ? `${folderName}/${fileName}`
                        : fileName;

                    await supabase.storage
                        .from("city-images")
                        .remove([filePath]);
                } catch (imageError) {
                    console.error("Error deleting image:", imageError);
                    // Continue with other images even if one fails
                }
            }

            // Refresh the list
            fetchCities();
        } catch (error) {
            console.error("Error deleting city:", error);
            alert("Failed to delete city");
        }
    };

    // Toggle city status
    const toggleCityStatus = async (cityId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("cities")
                .update({ is_active: !currentStatus })
                .eq("id", cityId);

            if (error) {
                console.error("Error updating city status:", error);
                alert("Failed to update city status");
                return;
            }

            // Refresh the list
            fetchCities();
        } catch (error) {
            console.error("Error updating city status:", error);
            alert("Failed to update city status");
        }
    };

    // Bulk delete with image cleanup
    const handleBulkDelete = async () => {
        if (selectedCities.length === 0) return;

        if (
            !confirm(
                `Are you sure you want to delete ${selectedCities.length} cities? This action cannot be undone.`,
            )
        ) {
            return;
        }

        try {
            // Collect all image URLs from selected cities
            const imageUrls = [];

            for (const cityId of selectedCities) {
                // Get city hero image
                const { data: city } = await supabase
                    .from("cities")
                    .select("hero_image_url")
                    .eq("id", cityId)
                    .single();

                if (city?.hero_image_url) imageUrls.push(city.hero_image_url);

                // Get content section images
                const { data: contentSections } = await supabase
                    .from("city_content_sections")
                    .select("image_url")
                    .eq("city_id", cityId);

                if (contentSections) {
                    contentSections.forEach(section => {
                        if (section.image_url)
                            imageUrls.push(section.image_url);
                    });
                }

                // Get service images
                const { data: services } = await supabase
                    .from("city_services")
                    .select("image_url")
                    .eq("city_id", cityId);

                if (services) {
                    services.forEach(service => {
                        if (service.image_url)
                            imageUrls.push(service.image_url);
                    });
                }
            }

            // Delete cities (cascade will handle related data)
            const { error } = await supabase
                .from("cities")
                .delete()
                .in("id", selectedCities);

            if (error) {
                console.error("Error bulk deleting cities:", error);
                alert("Failed to delete cities");
                return;
            }

            // Delete associated images from storage
            for (const imageUrl of imageUrls) {
                try {
                    const urlParts = imageUrl.split("/");
                    const fileName = urlParts[urlParts.length - 1];
                    const folderName = urlParts[urlParts.length - 2];
                    const filePath = folderName
                        ? `${folderName}/${fileName}`
                        : fileName;

                    await supabase.storage
                        .from("city-images")
                        .remove([filePath]);
                } catch (imageError) {
                    console.error("Error deleting image:", imageError);
                }
            }

            setSelectedCities([]);
            fetchCities();
        } catch (error) {
            console.error("Error bulk deleting cities:", error);
            alert("Failed to delete cities");
        }
    };

    // Handle checkbox selection
    const handleSelectCity = (cityId: string) => {
        setSelectedCities(prev =>
            prev.includes(cityId)
                ? prev.filter(id => id !== cityId)
                : [...prev, cityId],
        );
    };

    const handleSelectAll = () => {
        if (selectedCities.length === cities.length) {
            setSelectedCities([]);
        } else {
            setSelectedCities(cities.map(city => city.id));
        }
    };

    useEffect(() => {
        fetchCities();
    }, [fetchCities]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Cities Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your city locations and content
                    </p>
                </div>
                <Button
                    onClick={() => router.push("/admin/pages/cities/create")}
                    className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create City
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search cities..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e =>
                        setStatusFilter(
                            e.target.value as "all" | "active" | "inactive",
                        )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                >
                    <option value="all">All Cities</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Bulk Actions */}
            {selectedCities.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                        {selectedCities.length} cities selected
                    </span>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected
                    </Button>
                </div>
            )}

            {/* Cities Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39] mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading cities...</p>
                    </div>
                ) : cities.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-600">No cities found</p>
                        <Button
                            onClick={() =>
                                router.push("/admin/pages/cities/create")
                            }
                            className="mt-4 bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                        >
                            Create your first city
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedCities.length ===
                                                cities.length
                                            }
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        City
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Country
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stats
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cities.map(city => (
                                    <tr
                                        key={city.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedCities.includes(
                                                    city.id,
                                                )}
                                                onChange={() =>
                                                    handleSelectCity(city.id)
                                                }
                                                className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {city.hero_image_url ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={
                                                                city.hero_image_url
                                                            }
                                                            alt={city.name}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <MapPin className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {city.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        /{city.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Globe className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">
                                                    {city.country_code || "N/A"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    toggleCityStatus(
                                                        city.id,
                                                        city.is_active,
                                                    )
                                                }
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    city.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {city.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    {city.projects_completed ||
                                                        0}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {city.created_at
                                                    ? new Date(
                                                          city.created_at,
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/exhibition-stand-builder-${city.slug}`}
                                                    target="_blank"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/admin/pages/cities/edit/${city.id}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(city.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CitiesAdminPage;
