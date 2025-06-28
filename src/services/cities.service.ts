import {
    City,
    CityInput,
    CitiesResponse,
    CityQueryParams,
    LegacyCity,
} from "@/types/cities";

/**
 * Cities Service - Database-driven implementation
 * Fetches data from Supabase via API routes
 */
export class CitiesService {
    /**
     * Transform database city format to legacy format for backward compatibility
     */
    private static transformToLegacyFormat(city: City): LegacyCity {
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
            // Additional data for dynamic content
            contentSections: city.content_sections,
            portfolioItems: city.portfolio_items,
            components: city.components,
            preferredServices: city.preferred_services,
            contactDetails: city.contact_details,
        };
    }

    /**
     * Fetches all cities with optional filtering
     * Database-driven implementation using API routes
     */
    static async getCities(params?: CityQueryParams): Promise<CitiesResponse> {
        try {
            const searchParams = new URLSearchParams();

            if (params?.page) searchParams.set("page", params.page.toString());
            if (params?.limit) searchParams.set("limit", params.limit.toString());
            if (params?.search) searchParams.set("search", params.search);
            if (params?.is_active !== undefined) searchParams.set("is_active", params.is_active.toString());
            if (params?.country_code) searchParams.set("country_code", params.country_code);

            // Include relations for frontend display
            searchParams.set("include_relations", "true");

            const response = await fetch(`/api/cities?${searchParams.toString()}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform database format to legacy format for backward compatibility
            const transformedCities = data.cities.map(this.transformToLegacyFormat);

            return {
                cities: transformedCities,
                total: data.total,
                page: data.page,
                limit: data.limit,
            };
        } catch (error) {
            console.error("Error fetching cities:", error);
            throw new Error("Failed to fetch cities");
        }
    }

    /**
     * Fetches a single city by slug
     * Database-driven implementation using API routes
     */
    static async getCityBySlug(slug: string): Promise<LegacyCity | null> {
        try {
            const response = await fetch(`/api/cities/${slug}?include_relations=true`);

            if (response.status === 404) {
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform database format to legacy format for backward compatibility
            return this.transformToLegacyFormat(data.city);
        } catch (error) {
            console.error("Error fetching city by slug:", error);
            throw new Error("Failed to fetch city");
        }
    }

    /**
     * Creates a new city
     * Database-driven implementation using API routes
     */
    static async createCity(cityData: CityInput): Promise<LegacyCity> {
        try {
            const response = await fetch('/api/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cityData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create city');
            }

            const data = await response.json();
            return this.transformToLegacyFormat(data.city);
        } catch (error) {
            console.error("Error creating city:", error);
            throw new Error("Failed to create city");
        }
    }

    /**
     * Updates an existing city
     * Database-driven implementation using API routes
     */
    static async updateCity(
        slug: string,
        cityData: Partial<CityInput>,
    ): Promise<LegacyCity> {
        try {
            const response = await fetch(`/api/cities/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cityData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update city');
            }

            const data = await response.json();
            return this.transformToLegacyFormat(data.city);
        } catch (error) {
            console.error("Error updating city:", error);
            throw new Error("Failed to update city");
        }
    }

    /**
     * Deletes a city
     * Database-driven implementation using API routes
     */
    static async deleteCity(slug: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/cities/${slug}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete city');
            }

            return true;
        } catch (error) {
            console.error("Error deleting city:", error);
            throw new Error("Failed to delete city");
        }
    }
}
