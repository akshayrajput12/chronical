"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
    // Basic city info
    name: string;
    slug: string;
    subtitle?: string;
    country_code: string;
    timezone?: string;
    description: string;
    hero_image_url: string;
    meta_title: string;
    meta_description: string;
    projects_completed: number;
    years_of_operation: number;
    clients_satisfied: number;
    team_size: number;
    is_active: boolean;
    // Contact Information
    contact_phone?: string;
    contact_email?: string;
    contact_address?: string;
    contact_working_hours?: string;
    contact_emergency?: string;
    // Coordinates
    latitude?: number;
    longitude?: number;
    meta_keywords?: string;
}

interface ContentSection {
    section_type: string;
    title: string;
    subtitle?: string;
    content: string;
    image_url?: string;
}

interface Service {
    name: string;
    description: string;
    href_link?: string;
    sort_order: number;
}

interface Component {
    title: string;
    description: string;
    icon_name?: string;
    color: string;
    sort_order: number;
}

interface PortfolioItem {
    title: string;
    description: string;
    image_url: string;
    alt_text: string;
    category: string;
    project_year?: number;
    client_name?: string;
    is_featured: boolean;
    sort_order: number;
}



const CreateCityPage = () => {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");

    // Form data states
    const [cityData, setCityData] = useState<CityFormData>({
        name: "",
        slug: "",
        subtitle: "",
        country_code: "",
        timezone: "",
        description: "",
        hero_image_url: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        projects_completed: 0,
        years_of_operation: 0,
        clients_satisfied: 0,
        team_size: 0,
        is_active: true,
        contact_phone: "",
        contact_email: "",
        contact_address: "",
        contact_working_hours: "",
        contact_emergency: "",
        latitude: undefined,
        longitude: undefined,
    });

    const [contentSections, setContentSections] = useState<ContentSection[]>([
        {
            section_type: "hero",
            title: "",
            subtitle: "",
            content: "",
            image_url: "",
        },
        {
            section_type: "role",
            title: "",
            content: "",
        },
        {
            section_type: "content",
            title: "",
            content: "",
            image_url: "",
        },
        {
            section_type: "booth_design",
            title: "",
            content: "",
            image_url: "",
        },
        {
            section_type: "why_best",
            title: "",
            content: "",
        },
    ]);

    const [services, setServices] = useState<Service[]>([
        { name: "", description: "", href_link: "", sort_order: 1 }
    ]);

    const [components, setComponents] = useState<Component[]>([
        { title: "", description: "", icon_name: "", color: "#a5cd39", sort_order: 1 },
        { title: "", description: "", icon_name: "", color: "#a5cd39", sort_order: 2 },
        { title: "", description: "", icon_name: "", color: "#a5cd39", sort_order: 3 },
        { title: "", description: "", icon_name: "", color: "#a5cd39", sort_order: 4 },
        { title: "", description: "", icon_name: "", color: "#a5cd39", sort_order: 5 },
        { title: "", description: "", icon_name: "", color: "#a5cd39", sort_order: 6 },
    ]);

    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
        { title: "", description: "", image_url: "", alt_text: "", category: "", project_year: new Date().getFullYear(), client_name: "", is_featured: false, sort_order: 1 }
    ]);


    const [showImageSelector, setShowImageSelector] = useState(false);
    const [imageSelectionCallback, setImageSelectionCallback] = useState<((url: string) => void) | null>(null);
    const [existingImages, setExistingImages] = useState<{name: string, url: string, folder: string}[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

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
            slug: generateSlug(name),
            meta_title: `Exhibition Stand Contractors in ${name} | Chronicle Exhibits`,
            meta_description: `Professional exhibition stand design and construction services in ${name}. Custom trade show booths and displays by Chronicle Exhibits.`
        }));
    };

    // Ensure portfolio bucket exists
    const ensurePortfolioBucket = async () => {
        try {
            const { data: buckets } = await supabase.storage.listBuckets();
            const portfolioBucketExists = buckets?.some(bucket => bucket.id === 'city-portfolio');

            if (!portfolioBucketExists) {
                console.log('Creating city-portfolio bucket...');
                const { error } = await supabase.storage.createBucket('city-portfolio', {
                    public: true,
                    fileSizeLimit: 52428800, // 50MB
                    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
                });

                if (error) {
                    console.warn('Failed to create portfolio bucket:', error);
                    return false;
                }
                console.log('Portfolio bucket created successfully');
            }
            return true;
        } catch (error) {
            console.warn('Error checking/creating portfolio bucket:', error);
            return false;
        }
    };

    // Image upload function
    const uploadImage = async (file: File, folder: string = "cities") => {
        try {
            const fileExt = file.name.split('.').pop();

            // Generate unique filename for portfolio items
            let fileName;
            if (folder === 'city-portfolio') {
                // Use consistent naming for portfolio items
                const timestamp = Date.now();
                fileName = `portfolio_${timestamp}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
            } else {
                fileName = `${folder}/${Date.now()}.${fileExt}`;
            }

            // Determine bucket based on folder
            let bucketName = folder === 'city-portfolio' ? 'city-portfolio' : 'city-images';

            // Ensure portfolio bucket exists if needed
            if (bucketName === 'city-portfolio') {
                const bucketExists = await ensurePortfolioBucket();
                if (!bucketExists) {
                    console.log('Portfolio bucket not available, using fallback');
                    bucketName = 'city-images';
                    const timestamp = Date.now();
                    const fallbackFileName = `portfolio/portfolio_${timestamp}_${Math.floor(Math.random() * 1000)}.${fileExt}`;

                    const { error } = await supabase.storage
                        .from(bucketName)
                        .upload(fallbackFileName, file);

                    if (error) throw error;

                    const { data: { publicUrl } } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(fallbackFileName);

                    return publicUrl;
                }
            }

            console.log(`Attempting to upload to bucket: ${bucketName}, file: ${fileName}`);

            let { error } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file);

            // If portfolio bucket fails, fallback to city-images bucket
            if (error && bucketName === 'city-portfolio') {
                console.warn('Portfolio bucket failed, falling back to city-images bucket:', error);
                bucketName = 'city-images';
                const timestamp = Date.now();
                const fallbackFileName = `portfolio/portfolio_${timestamp}_${Math.floor(Math.random() * 1000)}.${fileExt}`;

                const fallbackResult = await supabase.storage
                    .from(bucketName)
                    .upload(fallbackFileName, file);

                error = fallbackResult.error;

                if (!error) {
                    console.log('Successfully uploaded to fallback bucket');
                    const { data: { publicUrl } } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(fallbackFileName);
                    return publicUrl;
                }
            }

            if (error) {
                console.error('Upload error details:', {
                    message: error.message,
                    error: error,
                    bucket: bucketName,
                    fileName: fileName
                });
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName);

            console.log('Upload successful:', publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to upload image: ${errorMessage}`);
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



    // Handle hero image upload
    const handleHeroImageUpload = async (file: File) => {
        const imageUrl = await uploadImage(file, 'cities');
        if (imageUrl) {
            setCityData(prev => ({ ...prev, hero_image_url: imageUrl }));
        }
    };

    // Handle image upload for portfolio items
    const handlePortfolioImageUpload = async (index: number, file: File) => {
        const imageUrl = await uploadImage(file, 'city-portfolio');
        if (imageUrl) {
            const updatedItems = [...portfolioItems];
            updatedItems[index].image_url = imageUrl;
            setPortfolioItems(updatedItems);
        }
    };

    // Fetch existing images from bucket
    const fetchExistingImages = async (folder: string = '', bucketName: string = 'city-images') => {
        try {
            const { data, error } = await supabase.storage
                .from(bucketName)
                .list(folder, {
                    limit: 100,
                    offset: 0,
                });

            if (error) throw error;

            return data?.map(file => {
                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);
                return {
                    name: file.name,
                    url: publicUrl,
                    folder: folder,
                    bucket: bucketName
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
            // Fetch images from all folders and buckets
            const [citiesImages, servicesImages, contentImages, portfolioImages] = await Promise.all([
                fetchExistingImages('cities', 'city-images'),
                fetchExistingImages('services', 'city-images'),
                fetchExistingImages('content-sections', 'city-images'),
                fetchExistingImages('city-portfolio', 'city-portfolio')
            ]);

            const allImages = [...citiesImages, ...servicesImages, ...contentImages, ...portfolioImages];
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

    const addPortfolioItem = () => {
        setPortfolioItems([...portfolioItems, {
            title: "",
            description: "",
            image_url: "",
            alt_text: "",
            category: "",
            project_year: new Date().getFullYear(),
            client_name: "",
            is_featured: false,
            sort_order: portfolioItems.length + 1
        }]);
    };

    const removePortfolioItem = (index: number) => {
        setPortfolioItems(portfolioItems.filter((_, i) => i !== index));
    };



    // Save city with all data
    const handleSave = async () => {
        try {
            setLoading(true);

            if (!cityData.name || !cityData.slug) {
                alert("Please fill in required fields (Name, Slug)");
                return;
            }

            // Clean up city data - remove undefined values
            const cleanCityData = Object.fromEntries(
                Object.entries(cityData).filter(([_, value]) => value !== undefined && value !== "")
            );

            // Create city
            const { data: city, error: cityError } = await supabase
                .from("cities")
                .insert([cleanCityData])
                .select()
                .single();

            if (cityError) throw cityError;

            const cityId = city.id;

            // Create content sections
            const contentSectionsData = contentSections
                .filter(section => section.title || section.content)
                .map((section, index) => ({
                    city_id: cityId,
                    ...section,
                    sort_order: index + 1,
                    is_active: true,
                }));

            if (contentSectionsData.length > 0) {
                const { error: contentError } = await supabase
                    .from("city_content_sections")
                    .insert(contentSectionsData);
                if (contentError) throw contentError;
            }

            // Create services
            const servicesData = services
                .filter(service => service.name)
                .map(service => ({
                    city_id: cityId,
                    ...service,
                    is_active: true,
                }));

            if (servicesData.length > 0) {
                const { error: servicesError } = await supabase
                    .from("city_services")
                    .insert(servicesData);
                if (servicesError) throw servicesError;
            }

            // Create components
            const componentsData = components
                .filter(component => component.title)
                .map(component => ({
                    city_id: cityId,
                    ...component,
                    is_active: true,
                }));

            if (componentsData.length > 0) {
                const { error: componentsError } = await supabase
                    .from("city_components")
                    .insert(componentsData);
                if (componentsError) throw componentsError;
            }

            // Create portfolio items
            const portfolioData = portfolioItems
                .filter(item => item.title && item.image_url)
                .map(item => ({
                    city_id: cityId,
                    ...item,
                }));

            if (portfolioData.length > 0) {
                const { error: portfolioError } = await supabase
                    .from("city_portfolio_items")
                    .insert(portfolioData);
                if (portfolioError) throw portfolioError;
            }

            alert("City created successfully!");
            router.push("/admin/pages/cities");

        } catch (error) {
            console.error("Error creating city:", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`Failed to create city: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "basic", label: "Basic Info" },
        { id: "content", label: "Content Sections" },
        { id: "services", label: "Services" },
        { id: "components", label: "Components" },
        { id: "portfolio", label: "Portfolio" },
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
                        <h1 className="text-3xl font-bold text-gray-900">Create New City</h1>
                        <p className="text-gray-600 mt-2">
                            Fill in all the information for the new city
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Creating..." : "Create City"}
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
                    />
                )}
                
                {activeTab === "components" && (
                    <ComponentsTab
                        components={components}
                        setComponents={setComponents}
                    />
                )}

                {activeTab === "portfolio" && (
                    <PortfolioTab
                        portfolioItems={portfolioItems}
                        setPortfolioItems={setPortfolioItems}
                        addPortfolioItem={addPortfolioItem}
                        removePortfolioItem={removePortfolioItem}
                        handleImageUpload={handlePortfolioImageUpload}
                        openImageSelector={openImageSelector}
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
                <Label htmlFor="name">City Name *</Label>
                <Input
                    id="name"
                    value={cityData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Abu Dhabi"
                    required
                />
            </div>
            <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                    id="slug"
                    value={cityData.slug}
                    onChange={(e) => setCityData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="abu-dhabi"
                    required
                />
            </div>
        </div>

        <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
                id="subtitle"
                value={cityData.subtitle || ""}
                onChange={(e) => setCityData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Premium exhibition experiences in the UAE capital"
            />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                    id="timezone"
                    value={cityData.timezone || ""}
                    onChange={(e) => setCityData(prev => ({ ...prev, timezone: e.target.value }))}
                    placeholder="Asia/Dubai"
                />
            </div>
            <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                    id="contact_phone"
                    value={cityData.contact_phone || ""}
                    onChange={(e) => setCityData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="+971 4 567 8901"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                    id="contact_email"
                    type="email"
                    value={cityData.contact_email || ""}
                    onChange={(e) => setCityData(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="city@chronicles-dubai.com"
                />
            </div>
            <div>
                <Label htmlFor="contact_working_hours">Working Hours</Label>
                <Input
                    id="contact_working_hours"
                    value={cityData.contact_working_hours || ""}
                    onChange={(e) => setCityData(prev => ({ ...prev, contact_working_hours: e.target.value }))}
                    placeholder="9 AM - 6 PM"
                />
            </div>
        </div>

        <div>
            <Label htmlFor="contact_address">Contact Address</Label>
            <Textarea
                id="contact_address"
                value={cityData.contact_address || ""}
                onChange={(e) => setCityData(prev => ({ ...prev, contact_address: e.target.value }))}
                placeholder="Full address of the office"
                rows={2}
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

        <div>
            <Label htmlFor="meta_keywords">Meta Keywords</Label>
            <Input
                id="meta_keywords"
                value={cityData.meta_keywords || ""}
                onChange={(e) => setCityData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                placeholder="exhibition, stands, dubai, trade show"
            />
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
        hero: "Hero Section",
        content: "Main Content Section",
        role: "Role Section",
        booth_design: "Component Section",
        why_best: "Why Best Section",
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

                        {(section.section_type === 'content' || section.section_type === 'hero') && (
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

                        {(section.section_type === 'content' || section.section_type === 'hero') && (
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
const ServicesTab = ({ services, setServices, addService, removeService }: {
    services: Service[];
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
    addService: () => void;
    removeService: (index: number) => void;
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
                                value={service.name || ""}
                                onChange={(e) => updateService(index, 'name', e.target.value)}
                                placeholder="Service name"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`service-link-${index}`}>Link</Label>
                            <Input
                                id={`service-link-${index}`}
                                value={service.href_link || ""}
                                onChange={(e) => updateService(index, 'href_link', e.target.value)}
                                placeholder="/customexhibitionstands"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`service-description-${index}`}>Description</Label>
                        <Textarea
                            id={`service-description-${index}`}
                            value={service.description || ""}
                            onChange={(e) => updateService(index, 'description', e.target.value)}
                            placeholder="Service description"
                            rows={3}
                        />
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

// Portfolio Tab Component
const PortfolioTab = ({ portfolioItems, setPortfolioItems, addPortfolioItem, removePortfolioItem, handleImageUpload, openImageSelector }: {
    portfolioItems: PortfolioItem[];
    setPortfolioItems: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
    addPortfolioItem: () => void;
    removePortfolioItem: (index: number) => void;
    handleImageUpload: (index: number, file: File) => void;
    openImageSelector: (callback: (url: string) => void) => void;
}) => {
    const updatePortfolioItem = (index: number, field: keyof PortfolioItem, value: string | number | boolean) => {
        const updated = [...portfolioItems];
        updated[index] = { ...updated[index], [field]: value };
        setPortfolioItems(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Portfolio Items</h3>
                    <p className="text-sm text-gray-600">Showcase your best work and projects. Images will be uploaded to the city-portfolio bucket.</p>
                </div>
                <Button
                    onClick={addPortfolioItem}
                    variant="outline"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Portfolio Item
                </Button>
            </div>

            {portfolioItems.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No portfolio items yet. Add your first portfolio item to get started.</p>
                </div>
            )}

            {portfolioItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Portfolio Item {index + 1}</h4>
                        {portfolioItems.length > 1 && (
                            <Button
                                onClick={() => removePortfolioItem(index)}
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
                            <Label htmlFor={`portfolio-title-${index}`}>Title</Label>
                            <Input
                                id={`portfolio-title-${index}`}
                                value={item.title || ""}
                                onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                                placeholder="Project title"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`portfolio-category-${index}`}>Category</Label>
                            <Input
                                id={`portfolio-category-${index}`}
                                value={item.category || ""}
                                onChange={(e) => updatePortfolioItem(index, 'category', e.target.value)}
                                placeholder="e.g., Technology, Design, Corporate"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`portfolio-description-${index}`}>Description</Label>
                        <Textarea
                            id={`portfolio-description-${index}`}
                            value={item.description || ""}
                            onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                            placeholder="Project description"
                            rows={3}
                        />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`portfolio-image-${index}`}>Image</Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id={`portfolio-image-${index}`}
                                value={item.image_url || ""}
                                onChange={(e) => updatePortfolioItem(index, 'image_url', e.target.value)}
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
                                id={`portfolio-file-${index}`}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById(`portfolio-file-${index}`)?.click()}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => openImageSelector((url) => updatePortfolioItem(index, 'image_url', url))}
                            >
                                Select from Bucket
                            </Button>
                        </div>
                        {item.image_url && (
                            <div className="mt-2">
                                <img
                                    src={item.image_url}
                                    alt="Portfolio preview"
                                    className="w-48 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Preview</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`portfolio-alt-${index}`}>Alt Text</Label>
                        <Input
                            id={`portfolio-alt-${index}`}
                            value={item.alt_text || ""}
                            onChange={(e) => updatePortfolioItem(index, 'alt_text', e.target.value)}
                            placeholder="Descriptive alt text for the image"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <Label htmlFor={`portfolio-client-${index}`}>Client Name</Label>
                            <Input
                                id={`portfolio-client-${index}`}
                                value={item.client_name || ""}
                                onChange={(e) => updatePortfolioItem(index, 'client_name', e.target.value)}
                                placeholder="Client or company name"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`portfolio-year-${index}`}>Project Year</Label>
                            <Input
                                id={`portfolio-year-${index}`}
                                type="number"
                                value={item.project_year || ""}
                                onChange={(e) => updatePortfolioItem(index, 'project_year', parseInt(e.target.value) || new Date().getFullYear())}
                                placeholder="2024"
                                min="2000"
                                max="2030"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`portfolio-featured-${index}`}
                            checked={item.is_featured}
                            onChange={(e) => updatePortfolioItem(index, 'is_featured', e.target.checked)}
                            className="rounded"
                        />
                        <Label htmlFor={`portfolio-featured-${index}`}>Featured Project</Label>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CreateCityPage;
