"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft, Plus, Trash2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CityFormData {
    name: string;
    slug: string;
    country: string;
    country_code: string;
    description: string;
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

interface PortfolioItem {
    id?: string;
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

interface Statistic {
    id?: string;
    statistic_type: string;
    title: string;
    value: string;
    icon_name: string;
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
        meta_title: "",
        meta_description: "",
        projects_completed: 0,
        years_of_operation: 0,
        clients_satisfied: 0,
        team_size: 0,
        is_active: true,
    });

    const [contentSections, setContentSections] = useState<ContentSection[]>(
        [],
    );
    const [services, setServices] = useState<Service[]>([]);
    const [components, setComponents] = useState<Component[]>([]);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [preferredServices, setPreferredServices] = useState<
        PreferredService[]
    >([]);
    const [contactDetails, setContactDetails] = useState<ContactDetail[]>([]);
    const [statistics, setStatistics] = useState<Statistic[]>([]);
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [imageSelectionCallback, setImageSelectionCallback] = useState<
        ((url: string) => void) | null
    >(null);
    const [existingImages, setExistingImages] = useState<
        { name: string; url: string; folder: string }[]
    >([]);
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
                const sectionTypes = [
                    "hero",
                    "role",
                    "content",
                    "booth_design",
                    "why_best",
                ];
                const existingSections = sections || [];
                const allSections = sectionTypes.map(type => {
                    const existing = existingSections.find(
                        s => s.section_type === type,
                    );
                    if (existing) {
                        return existing;
                    }
                    // Default content for hero section
                    if (type === "hero") {
                        return {
                            section_type: type,
                            title: "EXHIBITION STAND DESIGN BUILDER IN [CITY], UAE.",
                            subtitle:
                                "World-class exhibition solutions in the global business hub",
                            content:
                                "Chronicle Exhibition Organizing LLC is one of the most reputable exhibition stand design manufacturers, and contractors located in [CITY] offering an exhaustive array of stand-up services for exhibitions. We provide complete display stand solutions, including designing, planning, fabricating and erecting and putting up.",
                            image_url: "",
                        };
                    }
                    return {
                        section_type: type,
                        title: "",
                        content: "",
                        image_url: "",
                    };
                });
                setContentSections(allSections);

                // Load services
                const { data: servicesData, error: servicesError } =
                    await supabase
                        .from("city_services")
                        .select("*")
                        .eq("city_id", cityId)
                        .order("sort_order");

                if (servicesError) throw servicesError;
                setServices(
                    servicesData || [
                        {
                            name: "",
                            description: "",
                            href_link: "",
                            sort_order: 1,
                        },
                    ],
                );

                // Load components
                const { data: componentsData, error: componentsError } =
                    await supabase
                        .from("city_components")
                        .select("*")
                        .eq("city_id", cityId)
                        .order("sort_order");

                if (componentsError) throw componentsError;

                // Ensure 6 components exist
                const existingComponents = componentsData || [];
                const allComponents = Array.from({ length: 6 }, (_, index) => {
                    const existing = existingComponents.find(
                        c => c.sort_order === index + 1,
                    );
                    return (
                        existing || {
                            title: "",
                            description: "",
                            icon_name: "",
                            color: "#a5cd39",
                            sort_order: index + 1,
                        }
                    );
                });
                setComponents(allComponents);

                // Load portfolio items
                const { data: portfolioData, error: portfolioError } =
                    await supabase
                        .from("city_portfolio_items")
                        .select("*")
                        .eq("city_id", cityId)
                        .order("sort_order");

                if (portfolioError) throw portfolioError;
                setPortfolioItems(
                    portfolioData || [
                        {
                            title: "",
                            description: "",
                            image_url: "",
                            alt_text: "",
                            category: "",
                            project_year: new Date().getFullYear(),
                            client_name: "",
                            is_featured: false,
                            sort_order: 1,
                        },
                    ],
                );

                // Load preferred services
                const { data: preferredData, error: preferredError } =
                    await supabase
                        .from("city_preferred_services")
                        .select("*")
                        .eq("city_id", cityId)
                        .order("sort_order");

                if (preferredError) throw preferredError;
                setPreferredServices(
                    preferredData || [{ service_text: "", sort_order: 1 }],
                );

                // Load contact details
                const { data: contactsData, error: contactsError } =
                    await supabase
                        .from("city_contact_details")
                        .select("*")
                        .eq("city_id", cityId)
                        .order("sort_order");

                if (contactsError) throw contactsError;
                setContactDetails(
                    contactsData || [
                        {
                            contact_type: "phone",
                            contact_value: "",
                            display_text: "",
                            is_primary: true,
                            sort_order: 1,
                        },
                    ],
                );

                // Load statistics
                const { data: statisticsData, error: statisticsError } =
                    await supabase
                        .from("city_statistics")
                        .select("*")
                        .eq("city_id", cityId)
                        .order("sort_order");

                if (statisticsError) throw statisticsError;
                setStatistics(
                    statisticsData || [
                        {
                            statistic_type: "happy_clients",
                            title: "Happy Clients",
                            value: "4650+",
                            icon_name: "users",
                            color: "#4F46E5",
                            sort_order: 1,
                        },
                        {
                            statistic_type: "completed_projects",
                            title: "Completed Projects",
                            value: "20800+",
                            icon_name: "briefcase",
                            color: "#4F46E5",
                            sort_order: 2,
                        },
                        {
                            statistic_type: "customer_support",
                            title: "Customer Support",
                            value: "24X7",
                            icon_name: "headphones",
                            color: "#4F46E5",
                            sort_order: 3,
                        },
                        {
                            statistic_type: "exhibitions",
                            title: "Exhibitions",
                            value: "2050+",
                            icon_name: "trophy",
                            color: "#4F46E5",
                            sort_order: 4,
                        },
                    ],
                );
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
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleNameChange = (name: string) => {
        setCityData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }));
    };

    // Ensure portfolio bucket exists
    const ensurePortfolioBucket = async () => {
        try {
            const { data: buckets } = await supabase.storage.listBuckets();
            const portfolioBucketExists = buckets?.some(
                bucket => bucket.id === "city-portfolio",
            );

            if (!portfolioBucketExists) {
                console.log("Creating city-portfolio bucket...");
                const { error } = await supabase.storage.createBucket(
                    "city-portfolio",
                    {
                        public: true,
                        fileSizeLimit: 52428800, // 50MB
                        allowedMimeTypes: [
                            "image/jpeg",
                            "image/png",
                            "image/webp",
                            "image/gif",
                        ],
                    },
                );

                if (error) {
                    console.warn("Failed to create portfolio bucket:", error);
                    return false;
                }
                console.log("Portfolio bucket created successfully");
            }
            return true;
        } catch (error) {
            console.warn("Error checking/creating portfolio bucket:", error);
            return false;
        }
    };

    // Image upload function
    const uploadImage = async (file: File, folder: string = "cities") => {
        try {
            const fileExt = file.name.split(".").pop();

            // Generate unique filename for portfolio items
            let fileName;
            if (folder === "city-portfolio") {
                // Use the generate_portfolio_filename function format for consistency
                const timestamp = Date.now();
                fileName = `${cityId}_${timestamp}_${Math.floor(
                    Math.random() * 1000,
                )}.${fileExt}`;
            } else {
                fileName = `${folder}/${Date.now()}.${fileExt}`;
            }

            // Determine bucket based on folder
            let bucketName =
                folder === "city-portfolio" ? "city-portfolio" : "city-images";

            // Ensure portfolio bucket exists if needed
            if (bucketName === "city-portfolio") {
                const bucketExists = await ensurePortfolioBucket();
                if (!bucketExists) {
                    console.log(
                        "Portfolio bucket not available, using fallback",
                    );
                    bucketName = "city-images";
                    const timestamp = Date.now();
                    const fallbackFileName = `portfolio/${cityId}_${timestamp}_${Math.floor(
                        Math.random() * 1000,
                    )}.${fileExt}`;

                    const { error } = await supabase.storage
                        .from(bucketName)
                        .upload(fallbackFileName, file);

                    if (error) throw error;

                    const {
                        data: { publicUrl },
                    } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(fallbackFileName);

                    return publicUrl;
                }
            }

            console.log(
                `Attempting to upload to bucket: ${bucketName}, file: ${fileName}`,
            );

            let { error } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file);

            // If portfolio bucket fails, fallback to city-images bucket
            if (error && bucketName === "city-portfolio") {
                console.warn(
                    "Portfolio bucket failed, falling back to city-images bucket:",
                    error,
                );
                bucketName = "city-images";
                const timestamp = Date.now();
                const fallbackFileName = `portfolio/${cityId}_${timestamp}_${Math.floor(
                    Math.random() * 1000,
                )}.${fileExt}`;

                const fallbackResult = await supabase.storage
                    .from(bucketName)
                    .upload(fallbackFileName, file);

                error = fallbackResult.error;

                if (!error) {
                    console.log("Successfully uploaded to fallback bucket");
                    const {
                        data: { publicUrl },
                    } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(fallbackFileName);
                    return publicUrl;
                }
            }

            if (error) {
                console.error("Upload error details:", {
                    message: error.message,
                    error: error,
                    bucket: bucketName,
                    fileName: fileName,
                });
                throw error;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from(bucketName).getPublicUrl(fileName);

            console.log("Upload successful:", publicUrl);
            return publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            alert(`Failed to upload image: ${errorMessage}`);
            return null;
        }
    };

    // Handle image upload for content sections
    const handleContentImageUpload = async (index: number, file: File) => {
        const imageUrl = await uploadImage(file, "content-sections");
        if (imageUrl) {
            const updatedSections = [...contentSections];
            updatedSections[index].image_url = imageUrl;
            setContentSections(updatedSections);
        }
    };

    // Handle image upload for portfolio items
    const handlePortfolioImageUpload = async (index: number, file: File) => {
        const imageUrl = await uploadImage(file, "city-portfolio");
        if (imageUrl) {
            const updatedItems = [...portfolioItems];
            updatedItems[index].image_url = imageUrl;
            setPortfolioItems(updatedItems);
        }
    };

    // Fetch existing images from bucket
    const fetchExistingImages = async (
        folder: string = "",
        bucketName: string = "city-images",
    ) => {
        try {
            const { data, error } = await supabase.storage
                .from(bucketName)
                .list(folder, {
                    limit: 100,
                    offset: 0,
                });

            if (error) throw error;

            return (
                data?.map(file => {
                    const {
                        data: { publicUrl },
                    } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(
                            folder ? `${folder}/${file.name}` : file.name,
                        );
                    return {
                        name: file.name,
                        url: publicUrl,
                        folder: folder,
                        bucket: bucketName,
                    };
                }) || []
            );
        } catch (error) {
            console.error("Error fetching images:", error);
            return [];
        }
    };

    // Open image selector
    const openImageSelector = async (callback: (url: string) => void) => {
        setLoadingImages(true);
        setImageSelectionCallback(() => callback);

        try {
            // Fetch images from all folders and buckets
            const [
                citiesImages,
                servicesImages,
                contentImages,
                portfolioImages,
            ] = await Promise.all([
                fetchExistingImages("cities", "city-images"),
                fetchExistingImages("services", "city-images"),
                fetchExistingImages("content-sections", "city-images"),
                fetchExistingImages("city-portfolio", "city-portfolio"),
            ]);

            const allImages = [
                ...citiesImages,
                ...servicesImages,
                ...contentImages,
                ...portfolioImages,
            ];
            setExistingImages(allImages);
            setShowImageSelector(true);
        } catch (error) {
            console.error("Error loading images:", error);
            alert("Failed to load existing images");
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
            setServices([
                ...services,
                {
                    name: "",
                    description: "",
                    href_link: "",
                    sort_order: services.length + 1,
                },
            ]);
        } else {
            alert("Maximum 3 services allowed");
        }
    };

    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const addPortfolioItem = () => {
        setPortfolioItems([
            ...portfolioItems,
            {
                title: "",
                description: "",
                image_url: "",
                alt_text: "",
                category: "",
                project_year: new Date().getFullYear(),
                client_name: "",
                is_featured: false,
                sort_order: portfolioItems.length + 1,
            },
        ]);
    };

    const removePortfolioItem = (index: number) => {
        setPortfolioItems(portfolioItems.filter((_, i) => i !== index));
    };

    const addPreferredService = () => {
        setPreferredServices([
            ...preferredServices,
            {
                service_text: "",
                sort_order: preferredServices.length + 1,
            },
        ]);
    };

    const removePreferredService = (index: number) => {
        setPreferredServices(preferredServices.filter((_, i) => i !== index));
    };

    const addContactDetail = () => {
        setContactDetails([
            ...contactDetails,
            {
                contact_type: "phone",
                contact_value: "",
                display_text: "",
                is_primary: false,
                sort_order: contactDetails.length + 1,
            },
        ]);
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
            if (cityData.country.trim())
                updateData.country = cityData.country.trim();
            if (cityData.country_code.trim())
                updateData.country_code = cityData.country_code.trim();
            if (cityData.description.trim())
                updateData.description = cityData.description.trim();
            if (cityData.meta_title.trim())
                updateData.meta_title = cityData.meta_title.trim();
            if (cityData.meta_description.trim())
                updateData.meta_description = cityData.meta_description.trim();
            if (cityData.projects_completed > 0)
                updateData.projects_completed = cityData.projects_completed;
            if (cityData.years_of_operation > 0)
                updateData.years_of_operation = cityData.years_of_operation;
            if (cityData.clients_satisfied > 0)
                updateData.clients_satisfied = cityData.clients_satisfied;
            if (cityData.team_size > 0)
                updateData.team_size = cityData.team_size;

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
                    supabase
                        .from("city_content_sections")
                        .delete()
                        .eq("city_id", cityId),
                    supabase
                        .from("city_services")
                        .delete()
                        .eq("city_id", cityId),
                    supabase
                        .from("city_components")
                        .delete()
                        .eq("city_id", cityId),
                    supabase
                        .from("city_statistics")
                        .delete()
                        .eq("city_id", cityId),
                    supabase
                        .from("city_preferred_services")
                        .delete()
                        .eq("city_id", cityId),
                    supabase
                        .from("city_contact_details")
                        .delete()
                        .eq("city_id", cityId),
                ]);
            } catch (deleteError) {
                console.error("Error deleting existing data:", deleteError);
                // Continue with insertion even if deletion fails
            }

            // Insert updated content sections
            const contentSectionsData = contentSections
                .filter(
                    section => section.title?.trim() || section.content?.trim(),
                )
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

            // Insert updated portfolio items
            const portfolioData = portfolioItems
                .filter(item => item.title?.trim() && item.image_url?.trim())
                .map((item, index) => ({
                    city_id: cityId,
                    title: item.title.trim(),
                    description: item.description?.trim() || "",
                    image_url: item.image_url.trim(),
                    alt_text: item.alt_text?.trim() || "",
                    category: item.category?.trim() || "",
                    project_year: item.project_year || new Date().getFullYear(),
                    client_name: item.client_name?.trim() || null,
                    is_featured: item.is_featured || false,
                    sort_order: item.sort_order || index + 1,
                }));

            if (portfolioData.length > 0) {
                const { error: portfolioError } = await supabase
                    .from("city_portfolio_items")
                    .insert(portfolioData);
                if (portfolioError) {
                    console.error("Portfolio error:", portfolioError);
                    throw portfolioError;
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

            // Insert updated statistics
            const statisticsData = statistics
                .filter(
                    stat =>
                        stat.title?.trim() &&
                        stat.value?.trim() &&
                        stat.statistic_type?.trim(),
                )
                .map((stat, index) => ({
                    city_id: cityId,
                    statistic_type: stat.statistic_type.trim(),
                    title: stat.title.trim(),
                    value: stat.value.trim(),
                    icon_name: stat.icon_name || "users",
                    sort_order: stat.sort_order || index + 1,
                    is_active: true,
                }));

            if (statisticsData.length > 0) {
                const { error: statisticsError } = await supabase
                    .from("city_statistics")
                    .insert(statisticsData);
                if (statisticsError) {
                    console.error("Statistics error:", statisticsError);
                    throw statisticsError;
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
        { id: "statistics", label: "Statistics" },
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
                        <h1 className="text-3xl font-bold text-gray-900">
                            Edit City: {cityData.name}
                        </h1>
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
                    {tabs.map(tab => (
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

                {activeTab === "statistics" && (
                    <StatisticsTab
                        statistics={statistics}
                        setStatistics={setStatistics}
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
const BasicInfoTab = ({
    cityData,
    setCityData,
    handleNameChange,
}: {
    cityData: CityFormData;
    setCityData: React.Dispatch<React.SetStateAction<CityFormData>>;
    handleNameChange: (name: string) => void;
}) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="name">City Name</Label>
                <Input
                    id="name"
                    value={cityData.name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="Abu Dhabi"
                />
            </div>
            <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                    id="slug"
                    value={cityData.slug}
                    onChange={e =>
                        setCityData(prev => ({ ...prev, slug: e.target.value }))
                    }
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
                    onChange={e =>
                        setCityData(prev => ({
                            ...prev,
                            country: e.target.value,
                        }))
                    }
                    placeholder="United Arab Emirates"
                />
            </div>
            <div>
                <Label htmlFor="country_code">Country Code</Label>
                <Input
                    id="country_code"
                    value={cityData.country_code}
                    onChange={e =>
                        setCityData(prev => ({
                            ...prev,
                            country_code: e.target.value,
                        }))
                    }
                    placeholder="AE"
                />
            </div>
        </div>

        <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
                id="description"
                value={cityData.description}
                onChange={e =>
                    setCityData(prev => ({
                        ...prev,
                        description: e.target.value,
                    }))
                }
                placeholder="Brief description of the city"
                rows={3}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                    id="meta_title"
                    value={cityData.meta_title}
                    onChange={e =>
                        setCityData(prev => ({
                            ...prev,
                            meta_title: e.target.value,
                        }))
                    }
                    placeholder="SEO title"
                />
            </div>
            <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Input
                    id="meta_description"
                    value={cityData.meta_description}
                    onChange={e =>
                        setCityData(prev => ({
                            ...prev,
                            meta_description: e.target.value,
                        }))
                    }
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
                    onChange={e =>
                        setCityData(prev => ({
                            ...prev,
                            projects_completed: parseInt(e.target.value) || 0,
                        }))
                    }
                    placeholder="0"
                />
            </div>
            <div>
                <Label htmlFor="years_of_operation">Years of Operation</Label>
                <Input
                    id="years_of_operation"
                    type="number"
                    value={cityData.years_of_operation}
                    onChange={e =>
                        setCityData(prev => ({
                            ...prev,
                            years_of_operation: parseInt(e.target.value) || 0,
                        }))
                    }
                    placeholder="0"
                />
            </div>
            <div>
                <Label htmlFor="clients_satisfied">Clients Satisfied</Label>
                <Input
                    id="clients_satisfied"
                    type="number"
                    value={cityData.clients_satisfied}
                    onChange={e =>
                        setCityData(prev => ({
                            ...prev,
                            clients_satisfied: parseInt(e.target.value) || 0,
                        }))
                    }
                    placeholder="0"
                />
            </div>
            <div>
                <Label htmlFor="team_size">Team Size</Label>
                <Input
                    id="team_size"
                    type="number"
                    value={cityData.team_size}
                    onChange={e =>
                        setCityData(prev => ({
                            ...prev,
                            team_size: parseInt(e.target.value) || 0,
                        }))
                    }
                    placeholder="0"
                />
            </div>
        </div>

        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id="is_active"
                checked={cityData.is_active}
                onChange={e =>
                    setCityData(prev => ({
                        ...prev,
                        is_active: e.target.checked,
                    }))
                }
                className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
            />
            <Label htmlFor="is_active">Active</Label>
        </div>
    </div>
);

// Content Sections Tab Component
const ContentSectionsTab = ({
    contentSections,
    setContentSections,
    handleImageUpload,
    openImageSelector,
}: {
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

    const updateSection = (
        index: number,
        field: keyof ContentSection,
        value: string,
    ) => {
        const updated = [...contentSections];
        updated[index] = { ...updated[index], [field]: value };
        setContentSections(updated);
    };

    return (
        <div className="space-y-8">
            {contentSections.map((section, index) => (
                <div
                    key={section.section_type}
                    className="border rounded-lg p-6"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        {
                            sectionLabels[
                                section.section_type as keyof typeof sectionLabels
                            ]
                        }
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor={`title-${index}`}>Title</Label>
                            <Input
                                id={`title-${index}`}
                                value={section.title}
                                onChange={e =>
                                    updateSection(
                                        index,
                                        "title",
                                        e.target.value,
                                    )
                                }
                                placeholder="Section title"
                            />
                        </div>

                        {(section.section_type === "content" ||
                            section.section_type === "hero") && (
                            <div>
                                <Label htmlFor={`subtitle-${index}`}>
                                    Subtitle
                                </Label>
                                <Input
                                    id={`subtitle-${index}`}
                                    value={section.subtitle || ""}
                                    onChange={e =>
                                        updateSection(
                                            index,
                                            "subtitle",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Section subtitle"
                                />
                            </div>
                        )}

                        <div>
                            <Label htmlFor={`content-${index}`}>Content</Label>
                            <Textarea
                                id={`content-${index}`}
                                value={section.content}
                                onChange={e =>
                                    updateSection(
                                        index,
                                        "content",
                                        e.target.value,
                                    )
                                }
                                placeholder="Section content"
                                rows={6}
                            />
                        </div>

                        {(section.section_type === "content" ||
                            section.section_type === "hero") && (
                            <div>
                                <Label htmlFor={`image-${index}`}>Image</Label>
                                <div className="flex items-center space-x-4">
                                    <Input
                                        id={`image-${index}`}
                                        value={section.image_url || ""}
                                        onChange={e =>
                                            updateSection(
                                                index,
                                                "image_url",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Image URL"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                handleImageUpload(index, file);
                                        }}
                                        className="hidden"
                                        id={`file-${index}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            document
                                                .getElementById(`file-${index}`)
                                                ?.click()
                                        }
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            openImageSelector(url =>
                                                updateSection(
                                                    index,
                                                    "image_url",
                                                    url,
                                                ),
                                            )
                                        }
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
const ServicesTab = ({
    services,
    setServices,
    addService,
    removeService,
}: {
    services: Service[];
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
    addService: () => void;
    removeService: (index: number) => void;
}) => {
    const updateService = (
        index: number,
        field: keyof Service,
        value: string | number,
    ) => {
        const updated = [...services];
        updated[index] = { ...updated[index], [field]: value };
        setServices(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">City Services</h3>
                    <p className="text-sm text-gray-600">
                        Maximum 3 services allowed ({services.length}/3)
                    </p>
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
                            <Label htmlFor={`service-name-${index}`}>
                                Service Name
                            </Label>
                            <Input
                                id={`service-name-${index}`}
                                value={service.name || ""}
                                onChange={e =>
                                    updateService(index, "name", e.target.value)
                                }
                                placeholder="Service name"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`service-link-${index}`}>
                                Link
                            </Label>
                            <Input
                                id={`service-link-${index}`}
                                value={service.href_link || ""}
                                onChange={e =>
                                    updateService(
                                        index,
                                        "href_link",
                                        e.target.value,
                                    )
                                }
                                placeholder="/custom-exhibition-stands-dubai-uae"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`service-description-${index}`}>
                            Description
                        </Label>
                        <Textarea
                            id={`service-description-${index}`}
                            value={service.description || ""}
                            onChange={e =>
                                updateService(
                                    index,
                                    "description",
                                    e.target.value,
                                )
                            }
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
const ComponentsTab = ({
    components,
    setComponents,
}: {
    components: Component[];
    setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
}) => {
    const updateComponent = (
        index: number,
        field: keyof Component,
        value: string | number,
    ) => {
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
                            <h4 className="font-medium">
                                Component {index + 1}
                            </h4>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor={`component-title-${index}`}>
                                    Title
                                </Label>
                                <Input
                                    id={`component-title-${index}`}
                                    value={component.title}
                                    onChange={e =>
                                        updateComponent(
                                            index,
                                            "title",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Component title"
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor={`component-description-${index}`}
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id={`component-description-${index}`}
                                    value={component.description}
                                    onChange={e =>
                                        updateComponent(
                                            index,
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Component description"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`component-icon-${index}`}>
                                        Icon Name
                                    </Label>
                                    <Input
                                        id={`component-icon-${index}`}
                                        value={component.icon_name}
                                        onChange={e =>
                                            updateComponent(
                                                index,
                                                "icon_name",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="star, check, arrow"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`component-color-${index}`}>
                                        Color
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            id={`component-color-${index}`}
                                            value={component.color}
                                            onChange={e =>
                                                updateComponent(
                                                    index,
                                                    "color",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                                        />
                                        <Input
                                            value={component.color}
                                            onChange={e =>
                                                updateComponent(
                                                    index,
                                                    "color",
                                                    e.target.value,
                                                )
                                            }
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

// Statistics Tab Component
const StatisticsTab = ({
    statistics,
    setStatistics,
}: {
    statistics: Statistic[];
    setStatistics: React.Dispatch<React.SetStateAction<Statistic[]>>;
}) => {
    const updateStatistic = (
        index: number,
        field: keyof Statistic,
        value: string | number,
    ) => {
        const updated = [...statistics];
        updated[index] = { ...updated[index], [field]: value };
        setStatistics(updated);
    };

    const addStatistic = () => {
        setStatistics([
            ...statistics,
            {
                statistic_type: "",
                title: "",
                value: "",
                icon_name: "users",
                sort_order: statistics.length + 1,
            },
        ]);
    };

    const removeStatistic = (index: number) => {
        setStatistics(statistics.filter((_, i) => i !== index));
    };

    const iconOptions = [
        { value: "users", label: "Users" },
        { value: "briefcase", label: "Briefcase" },
        { value: "headphones", label: "Headphones" },
        { value: "trophy", label: "Trophy" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Statistics</h3>
                <Button
                    onClick={addStatistic}
                    className="bg-[#a5cd39] hover:bg-[#8fb82e]"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Statistic
                </Button>
            </div>

            <div className="space-y-4">
                {statistics.map((statistic, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">
                                Statistic {index + 1}
                            </h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStatistic(index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`statistic-type-${index}`}>
                                    Statistic Type
                                </Label>
                                <Input
                                    id={`statistic-type-${index}`}
                                    value={statistic.statistic_type}
                                    onChange={e =>
                                        updateStatistic(
                                            index,
                                            "statistic_type",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g., happy_clients"
                                />
                            </div>

                            <div>
                                <Label htmlFor={`statistic-title-${index}`}>
                                    Title
                                </Label>
                                <Input
                                    id={`statistic-title-${index}`}
                                    value={statistic.title}
                                    onChange={e =>
                                        updateStatistic(
                                            index,
                                            "title",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g., Happy Clients"
                                />
                            </div>

                            <div>
                                <Label htmlFor={`statistic-value-${index}`}>
                                    Value
                                </Label>
                                <Input
                                    id={`statistic-value-${index}`}
                                    value={statistic.value}
                                    onChange={e =>
                                        updateStatistic(
                                            index,
                                            "value",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g., 4650+"
                                />
                            </div>

                            <div>
                                <Label htmlFor={`statistic-icon-${index}`}>
                                    Icon
                                </Label>
                                <select
                                    id={`statistic-icon-${index}`}
                                    value={statistic.icon_name}
                                    onChange={e =>
                                        updateStatistic(
                                            index,
                                            "icon_name",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39]"
                                >
                                    {iconOptions.map(option => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor={`statistic-sort-${index}`}>
                                    Sort Order
                                </Label>
                                <Input
                                    id={`statistic-sort-${index}`}
                                    type="number"
                                    value={statistic.sort_order}
                                    onChange={e =>
                                        updateStatistic(
                                            index,
                                            "sort_order",
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Preferred Services Tab Component
const PreferredServicesTab = ({
    preferredServices,
    setPreferredServices,
    addPreferredService,
    removePreferredService,
}: {
    preferredServices: PreferredService[];
    setPreferredServices: React.Dispatch<
        React.SetStateAction<PreferredService[]>
    >;
    addPreferredService: () => void;
    removePreferredService: (index: number) => void;
}) => {
    const updatePreferredService = (
        index: number,
        field: keyof PreferredService,
        value: string | number,
    ) => {
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
                                onChange={e =>
                                    updatePreferredService(
                                        index,
                                        "service_text",
                                        e.target.value,
                                    )
                                }
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
const ContactDetailsTab = ({
    contactDetails,
    setContactDetails,
    addContactDetail,
    removeContactDetail,
}: {
    contactDetails: ContactDetail[];
    setContactDetails: React.Dispatch<React.SetStateAction<ContactDetail[]>>;
    addContactDetail: () => void;
    removeContactDetail: (index: number) => void;
}) => {
    const updateContactDetail = (
        index: number,
        field: keyof ContactDetail,
        value: string | boolean | number,
    ) => {
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
                            <Label htmlFor={`contact-type-${index}`}>
                                Contact Type
                            </Label>
                            <select
                                id={`contact-type-${index}`}
                                value={contact.contact_type}
                                onChange={e =>
                                    updateContactDetail(
                                        index,
                                        "contact_type",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
                            >
                                {contactTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor={`contact-value-${index}`}>
                                Contact Value
                            </Label>
                            <Input
                                id={`contact-value-${index}`}
                                value={contact.contact_value}
                                onChange={e =>
                                    updateContactDetail(
                                        index,
                                        "contact_value",
                                        e.target.value,
                                    )
                                }
                                placeholder="+971 543 474 645"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`contact-display-${index}`}>
                            Display Text
                        </Label>
                        <Input
                            id={`contact-display-${index}`}
                            value={contact.display_text}
                            onChange={e =>
                                updateContactDetail(
                                    index,
                                    "display_text",
                                    e.target.value,
                                )
                            }
                            placeholder="How it should appear to users"
                        />
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`contact-primary-${index}`}
                            checked={contact.is_primary}
                            onChange={e =>
                                updateContactDetail(
                                    index,
                                    "is_primary",
                                    e.target.checked,
                                )
                            }
                            className="rounded border-gray-300 text-[#a5cd39] focus:ring-[#a5cd39]"
                        />
                        <Label htmlFor={`contact-primary-${index}`}>
                            Primary Contact
                        </Label>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Image Selector Modal Component
const ImageSelectorModal = ({
    images,
    onSelect,
    onClose,
    loading,
}: {
    images: { name: string; url: string; folder: string }[];
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
                                <p className="text-xs text-gray-600 truncate">
                                    {image.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {image.folder}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
);

// Portfolio Tab Component
const PortfolioTab = ({
    portfolioItems,
    setPortfolioItems,
    addPortfolioItem,
    removePortfolioItem,
    handleImageUpload,
    openImageSelector,
}: {
    portfolioItems: PortfolioItem[];
    setPortfolioItems: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
    addPortfolioItem: () => void;
    removePortfolioItem: (index: number) => void;
    handleImageUpload: (index: number, file: File) => void;
    openImageSelector: (callback: (url: string) => void) => void;
}) => {
    const updatePortfolioItem = (
        index: number,
        field: keyof PortfolioItem,
        value: string | number | boolean,
    ) => {
        const updated = [...portfolioItems];
        updated[index] = { ...updated[index], [field]: value };
        setPortfolioItems(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Portfolio Items</h3>
                    <p className="text-sm text-gray-600">
                        Showcase your best work and projects. Images will be
                        uploaded to the city-portfolio bucket.
                    </p>
                </div>
                <Button onClick={addPortfolioItem} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Portfolio Item
                </Button>
            </div>

            {portfolioItems.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">
                        No portfolio items yet. Add your first portfolio item to
                        get started.
                    </p>
                </div>
            )}

            {portfolioItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">
                            Portfolio Item {index + 1}
                        </h4>
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
                            <Label htmlFor={`portfolio-title-${index}`}>
                                Title
                            </Label>
                            <Input
                                id={`portfolio-title-${index}`}
                                value={item.title || ""}
                                onChange={e =>
                                    updatePortfolioItem(
                                        index,
                                        "title",
                                        e.target.value,
                                    )
                                }
                                placeholder="Project title"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`portfolio-category-${index}`}>
                                Category
                            </Label>
                            <Input
                                id={`portfolio-category-${index}`}
                                value={item.category || ""}
                                onChange={e =>
                                    updatePortfolioItem(
                                        index,
                                        "category",
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g., Technology, Design, Corporate"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`portfolio-description-${index}`}>
                            Description
                        </Label>
                        <Textarea
                            id={`portfolio-description-${index}`}
                            value={item.description || ""}
                            onChange={e =>
                                updatePortfolioItem(
                                    index,
                                    "description",
                                    e.target.value,
                                )
                            }
                            placeholder="Project description"
                            rows={3}
                        />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`portfolio-image-${index}`}>
                            Image
                        </Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id={`portfolio-image-${index}`}
                                value={item.image_url || ""}
                                onChange={e =>
                                    updatePortfolioItem(
                                        index,
                                        "image_url",
                                        e.target.value,
                                    )
                                }
                                placeholder="Image URL"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(index, file);
                                }}
                                className="hidden"
                                id={`portfolio-file-${index}`}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    document
                                        .getElementById(
                                            `portfolio-file-${index}`,
                                        )
                                        ?.click()
                                }
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    openImageSelector(url =>
                                        updatePortfolioItem(
                                            index,
                                            "image_url",
                                            url,
                                        ),
                                    )
                                }
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
                                <p className="text-xs text-gray-500 mt-1">
                                    Preview
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <Label htmlFor={`portfolio-alt-${index}`}>
                            Alt Text
                        </Label>
                        <Input
                            id={`portfolio-alt-${index}`}
                            value={item.alt_text || ""}
                            onChange={e =>
                                updatePortfolioItem(
                                    index,
                                    "alt_text",
                                    e.target.value,
                                )
                            }
                            placeholder="Descriptive alt text for the image"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <Label htmlFor={`portfolio-client-${index}`}>
                                Client Name
                            </Label>
                            <Input
                                id={`portfolio-client-${index}`}
                                value={item.client_name || ""}
                                onChange={e =>
                                    updatePortfolioItem(
                                        index,
                                        "client_name",
                                        e.target.value,
                                    )
                                }
                                placeholder="Client or company name"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`portfolio-year-${index}`}>
                                Project Year
                            </Label>
                            <Input
                                id={`portfolio-year-${index}`}
                                type="number"
                                value={item.project_year || ""}
                                onChange={e =>
                                    updatePortfolioItem(
                                        index,
                                        "project_year",
                                        parseInt(e.target.value) ||
                                            new Date().getFullYear(),
                                    )
                                }
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
                            onChange={e =>
                                updatePortfolioItem(
                                    index,
                                    "is_featured",
                                    e.target.checked,
                                )
                            }
                            className="rounded"
                        />
                        <Label htmlFor={`portfolio-featured-${index}`}>
                            Featured Project
                        </Label>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EditCityPage;
