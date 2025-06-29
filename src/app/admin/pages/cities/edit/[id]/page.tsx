"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Save,
    ArrowLeft,
    Plus,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CityFormData {
    name: string;
    slug: string;
    country: string;
    country_code: string;
    description: string;
    hero_image_url: string;
    meta_title: string;
    meta_description: string;
    projects_completed: number;
    years_of_operation: number;
    clients_satisfied: number;
    team_size: number;
    is_active: boolean;
}

interface ContentSection {
    id?: string;
    section_type: string;
    title: string;
    subtitle?: string;
    content: string;
    image_url?: string;
}

interface Service {
    id?: string;
    name: string;
    description: string;
    image_url?: string;
    href_link?: string;
    sort_order: number;
}

interface Component {
    id?: string;
    title: string;
    description: string;
    icon_name?: string;
    color: string;
    sort_order: number;
}

interface PreferredService {
    id?: string;
    service_text: string;
    sort_order: number;
}

interface ContactDetail {
    id?: string;
    contact_type: string;
    contact_value: string;
    display_text?: string;
    is_primary: boolean;
    sort_order: number;
}

const EditCityPage = () => {
    const router = useRouter();
    const params = useParams();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const cityId = params.id as string;

    // Form data states
    const [cityData, setCityData] = useState<CityFormData>({
        name: "",
        slug: "",
        country: "",
        country_code: "",
        description: "",
        hero_image_url: "",
        meta_title: "",
        meta_description: "",
        projects_completed: 0,
        years_of_operation: 0,
        clients_satisfied: 0,
        team_size: 0,
        is_active: true,
    });

    const [contentSections, setContentSections] = useState<ContentSection[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [components, setComponents] = useState<Component[]>([]);
    const [preferredServices, setPreferredServices] = useState<PreferredService[]>([]);
    const [contactDetails, setContactDetails] = useState<ContactDetail[]>([]);
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [imageSelectionCallback, setImageSelectionCallback] = useState<((url: string) => void) | null>(null);
    const [existingImages, setExistingImages] = useState<{name: string, url: string, folder: string}[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

    // Load existing city data
    useEffect(() => {
        const loadCityData = async () => {
            try {
                setLoading(true);

                // Load city basic info
                const { data: city, error: cityError } = await supabase
                    .from("cities")
                    .select("*")
                    .eq("id", cityId)
                    .single();

                if (cityError) throw cityError;

                setCityData({
                    name: city.name || "",
                    slug: city.slug || "",
                    country: city.country || "",
                    country_code: city.country_code || "",
                    description: city.description || "",
                    hero_image_url: city.hero_image_url || "",
                    meta_title: city.meta_title || "",
                    meta_description: city.meta_description || "",
                    projects_completed: city.projects_completed || 0,
                    years_of_operation: city.years_of_operation || 0,
                    clients_satisfied: city.clients_satisfied || 0,
                    team_size: city.team_size || 0,
                    is_active: city.is_active,
                });

                // Load content sections
                const { data: sections, error: sectionsError } = await supabase
                    .from("city_content_sections")
                    .select("*")
                    .eq("city_id", cityId)
                    .order("sort_order");

                if (sectionsError) throw sectionsError;

                // Ensure all section types exist
                const sectionTypes = ["content", "role", "booth_design", "why_best", "preferred_choice", "contractors"];
                const existingSections = sections || [];
                const allSections = sectionTypes.map(type => {
                    const existing = existingSections.find(s => s.section_type === type);
                    return existing || {
                        section_type: type,
                        title: "",
                        content: "",
                        image_url: "",
                    };
                });
                setContentSections(allSections);

                // Load services
                const { data: servicesData, error: servicesError } = await supabase
                    .from("city_services")
                    .select("*")
                    .eq("city_id", cityId)
                    .order("sort_order");

                if (servicesError) throw servicesError;
                setServices(servicesData || [{ name: "", description: "", image_url: "", href_link: "", sort_order: 1 }]);

                // Load components
                const { data: componentsData, error: componentsError } = await supabase
                    .from("city_components")
                    .select("*")
                    .eq("city_id", cityId)
                    .order("sort_order");

                if (componentsError) throw componentsError;
                
                // Ensure 6 components exist
                const existingComponents = componentsData || [];
                const allComponents = Array.from({ length: 6 }, (_, index) => {
                    const existing = existingComponents.find(c => c.sort_order === index + 1);
                    return existing || {
                        title: "",
                        description: "",
                        icon_name: "",
                        color: "#a5cd39",
                        sort_order: index + 1,
                    };
                });
                setComponents(allComponents);

                // Load preferred services
                const { data: preferredData, error: preferredError } = await supabase
                    .from("city_preferred_services")
                    .select("*")
                    .eq("city_id", cityId)
                    .order("sort_order");

                if (preferredError) throw preferredError;
                setPreferredServices(preferredData || [{ service_text: "", sort_order: 1 }]);

                // Load contact details
                const { data: contactsData, error: contactsError } = await supabase
                    .from("city_contact_details")
                    .select("*")
                    .eq("city_id", cityId)
                    .order("sort_order");

                if (contactsError) throw contactsError;
                setContactDetails(contactsData || [{ contact_type: "phone", contact_value: "", display_text: "", is_primary: true, sort_order: 1 }]);

            } catch (error) {
                console.error("Error loading city data:", error);
                alert("Failed to load city data");
                router.push("/admin/pages/cities");
            } finally {
                setLoading(false);
            }
        };

        if (cityId) {
            loadCityData();
        }
    }, [cityId, supabase, router]);

    // Auto-generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (name: string) => {
        setCityData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }));
    };

    // Image upload function
    const uploadImage = async (file: File, folder: string = "cities") => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}.${fileExt}`;
            
            const { data, error } = await supabase.storage
                .from('city-images')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('city-images')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
            return null;
        }
    };

    // Handle image upload for content sections
    const handleContentImageUpload = async (index: number, file: File) => {
        const imageUrl = await uploadImage(file, 'content-sections');
        if (imageUrl) {
            const updatedSections = [...contentSections];
            updatedSections[index].image_url = imageUrl;
            setContentSections(updatedSections);
        }
    };

    // Handle image upload for services
    const handleServiceImageUpload = async (index: number, file: File) => {
        const imageUrl = await uploadImage(file, 'services');
        if (imageUrl) {
            const updatedServices = [...services];
            updatedServices[index].image_url = imageUrl;
            setServices(updatedServices);
        }
    };

    // Handle hero image upload
    const handleHeroImageUpload = async (file: File) => {
        const imageUrl = await uploadImage(file, 'cities');
        if (imageUrl) {
            setCityData(prev => ({ ...prev, hero_image_url: imageUrl }));
        }
    };

    // Fetch existing images from bucket
    const fetchExistingImages = async (folder: string = '') => {
        try {
            const { data, error } = await supabase.storage
                .from('city-images')
                .list(folder, {
                    limit: 100,
                    offset: 0,
                });

            if (error) throw error;

            return data?.map(file => {
                const { data: { publicUrl } } = supabase.storage
                    .from('city-images')
                    .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);
                return {
                    name: file.name,
                    url: publicUrl,
                    folder: folder
                };
            }) || [];
        } catch (error) {
            console.error('Error fetching images:', error);
            return [];
        }
    };

    // Open image selector
    const openImageSelector = async (callback: (url: string) => void) => {
        setLoadingImages(true);
        setImageSelectionCallback(() => callback);

        try {
            // Fetch images from all folders
            const [citiesImages, servicesImages, contentImages] = await Promise.all([
                fetchExistingImages('cities'),
                fetchExistingImages('services'),
                fetchExistingImages('content-sections')
            ]);

            const allImages = [...citiesImages, ...servicesImages, ...contentImages];
            setExistingImages(allImages);
            setShowImageSelector(true);
        } catch (error) {
            console.error('Error loading images:', error);
            alert('Failed to load existing images');
        } finally {
            setLoadingImages(false);
        }
    };

    // Handle image selection
    const handleImageSelection = (imageUrl: string) => {
        if (imageSelectionCallback) {
            imageSelectionCallback(imageUrl);
        }
        setShowImageSelector(false);
        setImageSelectionCallback(null);
    };

    // Add/Remove functions
    const addService = () => {
        if (services.length < 3) {
            setServices([...services, {
                name: "",
                description: "",
                image_url: "",
                href_link: "",
                sort_order: services.length + 1
            }]);
        } else {
            alert("Maximum 3 services allowed");
        }
    };

    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const addPreferredService = () => {
        setPreferredServices([...preferredServices, { 
            service_text: "", 
            sort_order: preferredServices.length + 1 
        }]);
    };

    const removePreferredService = (index: number) => {
        setPreferredServices(preferredServices.filter((_, i) => i !== index));
    };

    const addContactDetail = () => {
        setContactDetails([...contactDetails, { 
            contact_type: "phone", 
            contact_value: "", 
            display_text: "", 
            is_primary: false, 
            sort_order: contactDetails.length + 1 
        }]);
    };

    const removeContactDetail = (index: number) => {
        setContactDetails(contactDetails.filter((_, i) => i !== index));
    };

    // Save city with all data
    const handleSave = async () => {
        try {
            setSaving(true);

            // Only require name for updating (more flexible)
            if (!cityData.name.trim()) {
                alert("City name is required");
                return;
            }

            // Prepare city data for update (only include non-empty fields)
            const updateData: any = {
                name: cityData.name.trim(),
                is_active: cityData.is_active,
            };

            // Only include fields that have values
            if (cityData.slug.trim()) updateData.slug = cityData.slug.trim();
            if (cityData.country.trim()) updateData.country = cityData.country.trim();
            if (cityData.country_code.trim()) updateData.country_code = cityData.country_code.trim();
            if (cityData.description.trim()) updateData.description = cityData.description.trim();
            if (cityData.hero_image_url.trim()) updateData.hero_image_url = cityData.hero_image_url.trim();
            if (cityData.meta_title.trim()) updateData.meta_title = cityData.meta_title.trim();
            if (cityData.meta_description.trim()) updateData.meta_description = cityData.meta_description.trim();
            if (cityData.projects_completed > 0) updateData.projects_completed = cityData.projects_completed;
            if (cityData.years_of_operation > 0) updateData.years_of_operation = cityData.years_of_operation;
            if (cityData.clients_satisfied > 0) updateData.clients_satisfied = cityData.clients_satisfied;
            if (cityData.team_size > 0) updateData.team_size = cityData.team_size;

            // Update city basic info
            const { error: cityError } = await supabase
                .from("cities")
                .update(updateData)
                .eq("id", cityId);

            if (cityError) {
                console.error("City update error:", cityError);
                throw cityError;
            }

            // Delete existing related data (with error handling)
            try {
                await Promise.all([
                    supabase.from("city_content_sections").delete().eq("city_id", cityId),
                    supabase.from("city_services").delete().eq("city_id", cityId),
                    supabase.from("city_components").delete().eq("city_id", cityId),
                    supabase.from("city_preferred_services").delete().eq("city_id", cityId),
                    supabase.from("city_contact_details").delete().eq("city_id", cityId),
                ]);
            } catch (deleteError) {
                console.error("Error deleting existing data:", deleteError);
                // Continue with insertion even if deletion fails
            }

            // Insert updated content sections
            const contentSectionsData = contentSections
                .filter(section => section.title?.trim() || section.content?.trim())
                .map((section, index) => ({
                    city_id: cityId,
                    section_type: section.section_type,
                    title: section.title?.trim() || "",
                    subtitle: section.subtitle?.trim() || null,
                    content: section.content?.trim() || "",
                    image_url: section.image_url?.trim() || null,
                    sort_order: index + 1,
                    is_active: true,
                }));

            if (contentSectionsData.length > 0) {
                const { error: contentError } = await supabase
                    .from("city_content_sections")
                    .insert(contentSectionsData);
                if (contentError) {
                    console.error("Content sections error:", contentError);
                    throw contentError;
                }
            }

            // Insert updated services
            const servicesData = services
                .filter(service => service.name?.trim())
                .map((service, index) => ({
                    city_id: cityId,
                    name: service.name.trim(),
                    description: service.description?.trim() || "",
                    image_url: service.image_url?.trim() || null,
                    href_link: service.href_link?.trim() || null,
                    sort_order: service.sort_order || index + 1,
                    is_active: true,
                }));

            if (servicesData.length > 0) {
                const { error: servicesError } = await supabase
                    .from("city_services")
                    .insert(servicesData);
                if (servicesError) {
                    console.error("Services error:", servicesError);
                    throw servicesError;
                }
            }

            // Insert updated components
            const componentsData = components
                .filter(component => component.title?.trim())
                .map(component => ({
                    city_id: cityId,
                    title: component.title.trim(),
                    description: component.description?.trim() || "",
                    icon_name: component.icon_name?.trim() || null,
                    color: component.color || "#a5cd39",
                    sort_order: component.sort_order,
                    is_active: true,
                }));

            if (componentsData.length > 0) {
                const { error: componentsError } = await supabase
                    .from("city_components")
                    .insert(componentsData);
                if (componentsError) {
                    console.error("Components error:", componentsError);
                    throw componentsError;
                }
            }

            // Insert updated preferred services
            const preferredServicesData = preferredServices
                .filter(service => service.service_text?.trim())
                .map((service, index) => ({
                    city_id: cityId,
                    service_text: service.service_text.trim(),
                    sort_order: service.sort_order || index + 1,
                    is_active: true,
                }));

            if (preferredServicesData.length > 0) {
                const { error: preferredError } = await supabase
                    .from("city_preferred_services")
                    .insert(preferredServicesData);
                if (preferredError) {
                    console.error("Preferred services error:", preferredError);
                    throw preferredError;
                }
            }

            // Insert updated contact details
            const contactDetailsData = contactDetails
                .filter(contact => contact.contact_value?.trim())
                .map((contact, index) => ({
                    city_id: cityId,
                    contact_type: contact.contact_type || "phone",
                    contact_value: contact.contact_value.trim(),
                    display_text: contact.display_text?.trim() || null,
                    is_primary: contact.is_primary || false,
                    sort_order: contact.sort_order || index + 1,
                    is_active: true,
                }));

            if (contactDetailsData.length > 0) {
                const { error: contactsError } = await supabase
                    .from("city_contact_details")
                    .insert(contactDetailsData);
                if (contactsError) {
                    console.error("Contact details error:", contactsError);
                    throw contactsError;
                }
            }

            alert("City updated successfully!");
            router.push("/admin/pages/cities");

        } catch (error: any) {
            console.error("Error updating city:", error);

            // Provide more specific error messages
            let errorMessage = "Failed to update city";
            if (error?.message) {
                errorMessage += `: ${error.message}`;
            } else if (error?.details) {
                errorMessage += `: ${error.details}`;
            } else if (error?.hint) {
                errorMessage += `: ${error.hint}`;
            }

            alert(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39]"></div>
                    <p className="ml-4 text-gray-600">Loading city data...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "basic", label: "Basic Info" },
        { id: "content", label: "Content Sections" },
        { id: "services", label: "Services" },
        { id: "components", label: "Components" },
        { id: "preferred", label: "Preferred Services" },
        { id: "contacts", label: "Contact Details" },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/admin/pages/cities")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Cities
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit City: {cityData.name}</h1>
                        <p className="text-gray-600 mt-2">
                            Update all the information for this city
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.id
                                    ? "border-[#a5cd39] text-[#a5cd39]"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                {activeTab === "basic" && (
                    <BasicInfoTab
                        cityData={cityData}
                        setCityData={setCityData}
                        handleNameChange={handleNameChange}
                        handleHeroImageUpload={handleHeroImageUpload}
                        openImageSelector={openImageSelector}
                    />
                )}
                
                {activeTab === "content" && (
                    <ContentSectionsTab
                        contentSections={contentSections}
                        setContentSections={setContentSections}
                        handleImageUpload={handleContentImageUpload}
                        openImageSelector={openImageSelector}
                    />
                )}
                
                {activeTab === "services" && (
                    <ServicesTab
                        services={services}
                        setServices={setServices}
                        addService={addService}
                        removeService={removeService}
                        handleImageUpload={handleServiceImageUpload}
                        openImageSelector={openImageSelector}
                    />
                )}
                
                {activeTab === "components" && (
                    <ComponentsTab 
                        components={components}
                        setComponents={setComponents}
                    />
                )}
                
                {activeTab === "preferred" && (
                    <PreferredServicesTab 
                        preferredServices={preferredServices}
                        setPreferredServices={setPreferredServices}
                        addPreferredService={addPreferredService}
                        removePreferredService={removePreferredService}
                    />
                )}
                
                {activeTab === "contacts" && (
                    <ContactDetailsTab 
                        contactDetails={contactDetails}
                        setContactDetails={setContactDetails}
                        addContactDetail={addContactDetail}
                        removeContactDetail={removeContactDetail}
                    />
                )}
            </div>

            {/* Image Selector Modal */}
            {showImageSelector && (
                <ImageSelectorModal
                    images={existingImages}
                    onSelect={handleImageSelection}
                    onClose={() => setShowImageSelector(false)}
                    loading={loadingImages}
                />
            )}
        </div>
    );
};

// Basic Info Tab Component
const BasicInfoTab = ({ cityData, setCityData, handleNameChange, handleHeroImageUpload, openImageSelector }: {
    cityData: CityFormData;
    setCityData: React.Dispatch<React.SetStateAction<CityFormData>>;
    handleNameChange: (name: string) => void;
    handleHeroImageUpload: (file: File) => void;
    openImageSelector: (callback: (url: string) => void) => void;
}) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="name">City Name</Label>
                <Input
                    id="name"
                    value={cityData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Abu Dhabi"
                />
            </div>
            <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                    id="slug"
                    value={cityData.slug}
                    onChange={(e) => setCityData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="abu-dhabi"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="country">Country</Label>
                <Input
                    id="country"
                    value={cityData.country}
                    onChange={(e) => setCityData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="United Arab Emirates"
                />
            </div>
            <div>
                <Label htmlFor="country_code">Country Code</Label>
                <Input
                    id="country_code"
                    value={cityData.country_code}
                    onChange={(e) => setCityData(prev => ({ ...prev, country_code: e.target.value }))}
                    placeholder="AE"
                />
            </div>
        </div>

        <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
                id="description"
                value={cityData.description}
                onChange={(e) => setCityData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the city"
                rows={3}
            />
        </div>

        <div>
            <Label htmlFor="hero_image">Hero Image</Label>
            <div className="flex items-center space-x-4">
                <Input
                    id="hero_image"
                    value={cityData.hero_image_url}
                    onChange={(e) => setCityData(prev => ({ ...prev, hero_image_url: e.target.value }))}
                    placeholder="Hero image URL"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleHeroImageUpload(file);
                    }}
                    className="hidden"
                    id="hero-file"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('hero-file')?.click()}
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => openImageSelector((url) => setCityData(prev => ({ ...prev, hero_image_url: url })))}
                >
                    Select from Bucket
                </Button>
            </div>
            {cityData.hero_image_url && (
                <img
                    src={cityData.hero_image_url}
                    alt="Hero preview"
                    className="mt-2 w-48 h-32 object-cover rounded"
                />
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                    id="meta_title"
                    value={cityData.meta_title}
                    onChange={(e) => setCityData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="SEO title"
                />
            </div>
            <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Input
                    id="meta_description"
                    value={cityData.meta_description}
                    onChange={(e) => setCityData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="SEO description"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
                <Label htmlFor="projects_completed">Projects Completed</Label>
                <Input
                    id="projects_completed"
                    type="number"
                    value={cityData.projects_completed}
                    onChange={(e) => setCityData(prev => ({ ...prev, projects_completed: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                />
            </div>
            <div>
                <Label htmlFor="years_of_operation">Years of Operation</Label>
                <Input
                    id="years_of_operation"
                    type="number"
                    value={cityData.years_of_operation}
                    onChange={(e) => setCityData(prev => ({ ...prev, years_of_operation: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                />
            </div>
            <div>
                <Label htmlFor="clients_satisfied">Clients Satisfied</Label>
                <Input
                    id="clients_satisfied"
                    type="number"
                    value={cityData.clients_satisfied}
                    onChange={(e) => setCityData(prev => ({ ...prev, clients_satisfied: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                />
            </div>
            <div>
                <Label htmlFor="team_size">Team Size</Label>
                <Input
                    id="team_size"
                    type="number"
                    value={cityData.team_size}
                    onChange={(e) => setCityData(prev => ({ ...prev, team_size: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                />
            </div>
        </div>

        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id="is_active"
                checked={cityData.is_active}
                onChange={(e) => setCityData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
            />
            <Label htmlFor="is_active">Active</Label>
        </div>
    </div>
);

// Content Sections Tab Component
const ContentSectionsTab = ({ contentSections, setContentSections, handleImageUpload, openImageSelector }: {
    contentSections: ContentSection[];
    setContentSections: React.Dispatch<React.SetStateAction<ContentSection[]>>;
    handleImageUpload: (index: number, file: File) => void;
    openImageSelector: (callback: (url: string) => void) => void;
}) => {
    const sectionLabels = {
        content: "Main Content Section",
        role: "Role Section",
        booth_design: "Booth Design Section",
        why_best: "Why Best Section",
        preferred_choice: "Preferred Choice Section",
        contractors: "Contractors Section",
    };

    const updateSection = (index: number, field: keyof ContentSection, value: string) => {
        const updated = [...contentSections];
        updated[index] = { ...updated[index], [field]: value };
        setContentSections(updated);
    };

    return (
        <div className="space-y-8">
            {contentSections.map((section, index) => (
                <div key={section.section_type} className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {sectionLabels[section.section_type as keyof typeof sectionLabels]}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor={`title-${index}`}>Title</Label>
                            <Input
                                id={`title-${index}`}
                                value={section.title}
                                onChange={(e) => updateSection(index, 'title', e.target.value)}
                                placeholder="Section title"
                            />
                        </div>

                        {section.section_type === 'content' && (
                            <div>
                                <Label htmlFor={`subtitle-${index}`}>Subtitle</Label>
                                <Input
                                    id={`subtitle-${index}`}
                                    value={section.subtitle || ''}
                                    onChange={(e) => updateSection(index, 'subtitle', e.target.value)}
                                    placeholder="Section subtitle"
                                />
                            </div>
                        )}

                        <div>
                            <Label htmlFor={`content-${index}`}>Content</Label>
                            <Textarea
                                id={`content-${index}`}
                                value={section.content}
                                onChange={(e) => updateSection(index, 'content', e.target.value)}
                                placeholder="Section content"
                                rows={6}
                            />
                        </div>

                        {(section.section_type === 'content' || section.section_type === 'booth_design') && (
                            <div>
                                <Label htmlFor={`image-${index}`}>Image</Label>
                                <div className="flex items-center space-x-4">
                                    <Input
                                        id={`image-${index}`}
                                        value={section.image_url || ''}
                                        onChange={(e) => updateSection(index, 'image_url', e.target.value)}
                                        placeholder="Image URL"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(index, file);
                                        }}
                                        className="hidden"
                                        id={`file-${index}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById(`file-${index}`)?.click()}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => openImageSelector((url) => updateSection(index, 'image_url', url))}
                                    >
                                        Select from Bucket
                                    </Button>
                                </div>
                                {section.image_url && (
                                    <img
                                        src={section.image_url}
                                        alt="Preview"
                                        className="mt-2 w-32 h-20 object-cover rounded"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Services Tab Component
const ServicesTab = ({ services, setServices, addService, removeService, handleImageUpload, openImageSelector }: {
    services: Service[];
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
    addService: () => void;
    removeService: (index: number) => void;
    handleImageUpload: (index: number, file: File) => void;
    openImageSelector: (callback: (url: string) => void) => void;
}) => {
    const updateService = (index: number, field: keyof Service, value: string | number) => {
        const updated = [...services];
        updated[index] = { ...updated[index], [field]: value };
        setServices(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">City Services</h3>
                    <p className="text-sm text-gray-600">Maximum 3 services allowed ({services.length}/3)</p>
                </div>
                <Button
                    onClick={addService}
                    variant="outline"
                    disabled={services.length >= 3}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                </Button>
            </div>

            {services.map((service, index) => (
                <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Service {index + 1}</h4>
                        {services.length > 1 && (
                            <Button
                                onClick={() => removeService(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor={`service-name-${index}`}>Service Name</Label>
                            <Input
                                id={`service-name-${index}`}
                                value={service.name}
                                onChange={(e) => updateService(index, 'name', e.target.value)}
                                placeholder="Service name"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`service-link-${index}`}>Link</Label>
                            <Input
                                id={`service-link-${index}`}
                                value={service.href_link}
                                onChange={(e) => updateService(index, 'href_link', e.target.value)}
                                placeholder="/customexhibitionstands"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`service-description-${index}`}>Description</Label>
                        <Textarea
                            id={`service-description-${index}`}
                            value={service.description}
                            onChange={(e) => updateService(index, 'description', e.target.value)}
                            placeholder="Service description"
                            rows={3}
                        />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`service-image-${index}`}>Image</Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id={`service-image-${index}`}
                                value={service.image_url}
                                onChange={(e) => updateService(index, 'image_url', e.target.value)}
                                placeholder="Image URL"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(index, file);
                                }}
                                className="hidden"
                                id={`service-file-${index}`}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById(`service-file-${index}`)?.click()}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => openImageSelector((url) => updateService(index, 'image_url', url))}
                            >
                                Select from Bucket
                            </Button>
                        </div>
                        {service.image_url && (
                            <img
                                src={service.image_url}
                                alt="Service preview"
                                className="mt-2 w-32 h-20 object-cover rounded"
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Components Tab Component
const ComponentsTab = ({ components, setComponents }: {
    components: Component[];
    setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
}) => {
    const updateComponent = (index: number, field: keyof Component, value: string | number) => {
        const updated = [...components];
        updated[index] = { ...updated[index], [field]: value };
        setComponents(updated);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">6 Key Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {components.map((component, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center mb-4">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3"
                                style={{ backgroundColor: component.color }}
                            >
                                {index + 1}
                            </div>
                            <h4 className="font-medium">Component {index + 1}</h4>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor={`component-title-${index}`}>Title</Label>
                                <Input
                                    id={`component-title-${index}`}
                                    value={component.title}
                                    onChange={(e) => updateComponent(index, 'title', e.target.value)}
                                    placeholder="Component title"
                                />
                            </div>

                            <div>
                                <Label htmlFor={`component-description-${index}`}>Description</Label>
                                <Textarea
                                    id={`component-description-${index}`}
                                    value={component.description}
                                    onChange={(e) => updateComponent(index, 'description', e.target.value)}
                                    placeholder="Component description"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`component-icon-${index}`}>Icon Name</Label>
                                    <Input
                                        id={`component-icon-${index}`}
                                        value={component.icon_name}
                                        onChange={(e) => updateComponent(index, 'icon_name', e.target.value)}
                                        placeholder="star, check, arrow"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`component-color-${index}`}>Color</Label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            id={`component-color-${index}`}
                                            value={component.color}
                                            onChange={(e) => updateComponent(index, 'color', e.target.value)}
                                            className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                                        />
                                        <Input
                                            value={component.color}
                                            onChange={(e) => updateComponent(index, 'color', e.target.value)}
                                            placeholder="#a5cd39"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Preferred Services Tab Component
const PreferredServicesTab = ({ preferredServices, setPreferredServices, addPreferredService, removePreferredService }: {
    preferredServices: PreferredService[];
    setPreferredServices: React.Dispatch<React.SetStateAction<PreferredService[]>>;
    addPreferredService: () => void;
    removePreferredService: (index: number) => void;
}) => {
    const updatePreferredService = (index: number, field: keyof PreferredService, value: string | number) => {
        const updated = [...preferredServices];
        updated[index] = { ...updated[index], [field]: value };
        setPreferredServices(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Preferred Services</h3>
                <Button onClick={addPreferredService} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                </Button>
            </div>

            {preferredServices.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-2">
                            <div className="w-5 h-5 rounded-full bg-[#a5cd39] flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <Textarea
                                value={service.service_text}
                                onChange={(e) => updatePreferredService(index, 'service_text', e.target.value)}
                                placeholder="Describe the service offered..."
                                rows={2}
                            />
                        </div>
                        {preferredServices.length > 1 && (
                            <Button
                                onClick={() => removePreferredService(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Contact Details Tab Component
const ContactDetailsTab = ({ contactDetails, setContactDetails, addContactDetail, removeContactDetail }: {
    contactDetails: ContactDetail[];
    setContactDetails: React.Dispatch<React.SetStateAction<ContactDetail[]>>;
    addContactDetail: () => void;
    removeContactDetail: (index: number) => void;
}) => {
    const updateContactDetail = (index: number, field: keyof ContactDetail, value: string | boolean | number) => {
        const updated = [...contactDetails];
        updated[index] = { ...updated[index], [field]: value };
        setContactDetails(updated);
    };

    const contactTypes = [
        { value: "phone", label: "Phone" },
        { value: "email", label: "Email" },
        { value: "whatsapp", label: "WhatsApp" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Contact Details</h3>
                <Button onClick={addContactDetail} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                </Button>
            </div>

            {contactDetails.map((contact, index) => (
                <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Contact {index + 1}</h4>
                        <div className="flex items-center space-x-2">
                            {contact.is_primary && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                    Primary
                                </span>
                            )}
                            {contactDetails.length > 1 && (
                                <Button
                                    onClick={() => removeContactDetail(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor={`contact-type-${index}`}>Contact Type</Label>
                            <select
                                id={`contact-type-${index}`}
                                value={contact.contact_type}
                                onChange={(e) => updateContactDetail(index, 'contact_type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                            >
                                {contactTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor={`contact-value-${index}`}>Contact Value</Label>
                            <Input
                                id={`contact-value-${index}`}
                                value={contact.contact_value}
                                onChange={(e) => updateContactDetail(index, 'contact_value', e.target.value)}
                                placeholder="+971 543 474 645"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`contact-display-${index}`}>Display Text</Label>
                        <Input
                            id={`contact-display-${index}`}
                            value={contact.display_text}
                            onChange={(e) => updateContactDetail(index, 'display_text', e.target.value)}
                            placeholder="How it should appear to users"
                        />
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`contact-primary-${index}`}
                            checked={contact.is_primary}
                            onChange={(e) => updateContactDetail(index, 'is_primary', e.target.checked)}
                            className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
                        />
                        <Label htmlFor={`contact-primary-${index}`}>Primary Contact</Label>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Image Selector Modal Component
const ImageSelectorModal = ({ images, onSelect, onClose, loading }: {
    images: {name: string, url: string, folder: string}[];
    onSelect: (url: string) => void;
    onClose: () => void;
    loading: boolean;
}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Existing Image</h3>
                <Button variant="ghost" onClick={onClose}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a5cd39]"></div>
                    <p className="ml-4 text-gray-600">Loading images...</p>
                </div>
            ) : images.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">No images found in storage</p>
                </div>
            ) : (
                <div className="overflow-y-auto max-h-96">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => onSelect(image.url)}
                            >
                                <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-24 object-cover rounded mb-2"
                                />
                                <p className="text-xs text-gray-600 truncate">{image.name}</p>
                                <p className="text-xs text-gray-400">{image.folder}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
);

export default EditCityPage;
