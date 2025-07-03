import { createClient } from "@/lib/supabase/server";
import { City, LegacyCity } from "@/types/cities";

// Interface for cities page data
export interface CitiesPageData {
    cities: SimplifiedCity[];
    total: number;
}

// Simplified city interface for the cities listing page
export interface SimplifiedCity {
    id: string;
    name: string;
    slug: string;
    heroImage: string;
}

/**
 * Fetch cities data for the cities listing page
 * This replaces the useEffect-based data fetching in the cities page
 */
export async function getCitiesPageData(): Promise<CitiesPageData> {
    try {
        const supabase = await createClient();
        
        // Fetch active cities with only the fields needed for the listing page
        const { data, error, count } = await supabase
            .from("cities")
            .select("id, name, slug, hero_image_url", { count: 'exact' })
            .eq("is_active", true)
            .order("created_at", { ascending: false });
        
        if (error) {
            console.error("Error fetching cities:", error);
            return {
                cities: [],
                total: 0
            };
        }
        
        // Transform to simplified format for the cities grid
        const simplifiedCities: SimplifiedCity[] = (data || []).map(city => ({
            id: city.id,
            name: city.name,
            slug: city.slug,
            heroImage: city.hero_image_url || ""
        }));
        
        return {
            cities: simplifiedCities,
            total: count || 0
        };
    } catch (error) {
        console.error("Error in getCitiesPageData:", error);
        return {
            cities: [],
            total: 0
        };
    }
}

/**
 * Fetch all cities data with full details (for admin or detailed views)
 */
export async function getAllCitiesData(): Promise<City[]> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase
            .from("cities")
            .select(`
                *,
                services:city_services(*),
                content_sections:city_content_sections(*),
                portfolio_items:city_portfolio_items(*),
                components:city_components(*),
                preferred_services:city_preferred_services(*),
                contact_details:city_contact_details(*),
                statistics:city_statistics(*)
            `)
            .eq("is_active", true)
            .order("created_at", { ascending: false });
        
        if (error) {
            console.error("Error fetching all cities data:", error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error("Error in getAllCitiesData:", error);
        return [];
    }
}

/**
 * Transform database city format to legacy format for backward compatibility
 */
function transformToLegacyFormat(city: City): LegacyCity {
    return {
        id: parseInt(city.id) || 0, // Convert UUID to number for legacy compatibility
        name: city.name,
        slug: city.slug,
        subtitle: city.subtitle || "",
        heroImage: city.hero_image_url || "",
        description: city.description || "",
        isActive: city.is_active,
        createdAt: city.created_at,
        updatedAt: city.updated_at,
        countryCode: city.country_code,
        timezone: city.timezone,
        coordinates: city.latitude && city.longitude ? {
            latitude: city.latitude,
            longitude: city.longitude,
        } : undefined,
        contactInfo: {
            phone: city.contact_phone || "",
            email: city.contact_email || "",
            address: city.contact_address,
            workingHours: city.contact_working_hours || "",
            emergencyContact: city.contact_emergency,
        },
        services: city.services?.map(service => ({
            id: parseInt(service.id) || 0,
            name: service.name,
            description: service.description || "",
            isActive: service.is_active,
        })),
        stats: {
            projectsCompleted: city.projects_completed,
            yearsOfOperation: city.years_of_operation,
            clientsSatisfied: city.clients_satisfied,
            teamSize: city.team_size,
        },
        // Add the additional properties that components expect
        contentSections: city.content_sections,
        components: city.components,
        portfolioItems: city.portfolio_items,
        preferredServices: city.preferred_services,
        contactDetails: city.contact_details,
        statistics: city.statistics,
        // Add SEO fields for metadata generation
        meta_title: city.meta_title,
        meta_description: city.meta_description,
        meta_keywords: city.meta_keywords,
    };
}

/**
 * Fetch a single city by slug with all related data
 */
export async function getCityBySlug(slug: string): Promise<LegacyCity | null> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("cities")
            .select(`
                *,
                services:city_services(*),
                content_sections:city_content_sections(*),
                portfolio_items:city_portfolio_items(*),
                components:city_components(*),
                preferred_services:city_preferred_services(*),
                contact_details:city_contact_details(*),
                statistics:city_statistics(*)
            `)
            .eq("slug", slug)
            .eq("is_active", true)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                // No rows returned
                return null;
            }
            console.error("Error fetching city by slug:", error);
            return null;
        }

        // Transform to legacy format for component compatibility
        return transformToLegacyFormat(data);
    } catch (error) {
        console.error("Error in getCityBySlug:", error);
        return null;
    }
}
