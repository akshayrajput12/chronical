// import { supabase } from '@/lib/supabase'; // Uncomment when ready for database integration
import {
    City,
    CityInput,
    CitiesResponse,
    CityQueryParams,
} from "@/types/cities";

/**
 * Cities Service - Ready for database integration
 * Currently uses mock data, but structured for easy API integration
 */
export class CitiesService {
    // Mock data - this will be replaced with actual database calls
    private static mockCities: City[] = [
        {
            id: 1,
            name: "Saudi Arabia",
            slug: "saudi-arabia",
            subtitle: "Leading exhibition solutions across the Kingdom",
            heroImage:
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description:
                "Discover our comprehensive exhibition services in Saudi Arabia, where we deliver world-class solutions for major trade shows and events across the Kingdom.",
            isActive: true,
            countryCode: "SA",
            timezone: "Asia/Riyadh",
            contactInfo: {
                phone: "+966 11 234 5678",
                email: "saudi@chronicles-dubai.com",
                workingHours: "9 AM - 6 PM",
                address: "Riyadh, Saudi Arabia",
            },
            services: [
                {
                    id: 1,
                    name: "Custom Exhibition Stand Design",
                    description: "Tailored exhibition solutions",
                    isActive: true,
                },
                {
                    id: 2,
                    name: "Double Decker Exhibitions",
                    description: "Multi-level exhibition stands",
                    isActive: true,
                },
                {
                    id: 3,
                    name: "Country Pavilion Solutions",
                    description: "National pavilion design and setup",
                    isActive: true,
                },
            ],
            stats: {
                projectsCompleted: 150,
                yearsOfOperation: 8,
                clientsSatisfied: 200,
                teamSize: 25,
            },
        },
        {
            id: 2,
            name: "Abu Dhabi",
            slug: "abu-dhabi",
            subtitle: "Premium exhibition experiences in the UAE capital",
            heroImage:
                "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description:
                "Experience our exceptional exhibition services in Abu Dhabi, delivering innovative solutions for prestigious events and exhibitions in the UAE capital.",
            isActive: true,
            countryCode: "AE",
            timezone: "Asia/Dubai",
            contactInfo: {
                phone: "+971 2 345 6789",
                email: "abudhabi@chronicles-dubai.com",
                workingHours: "9 AM - 6 PM",
                address: "Abu Dhabi, UAE",
            },
            services: [
                {
                    id: 1,
                    name: "Custom Exhibition Stand Design",
                    description: "Tailored exhibition solutions",
                    isActive: true,
                },
                {
                    id: 2,
                    name: "Double Decker Exhibitions",
                    description: "Multi-level exhibition stands",
                    isActive: true,
                },
                {
                    id: 3,
                    name: "Country Pavilion Solutions",
                    description: "National pavilion design and setup",
                    isActive: true,
                },
            ],
            stats: {
                projectsCompleted: 200,
                yearsOfOperation: 10,
                clientsSatisfied: 300,
                teamSize: 35,
            },
        },
        {
            id: 3,
            name: "Qatar",
            slug: "qatar",
            subtitle: "Excellence in exhibition design and execution",
            heroImage:
                "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description:
                "Our Qatar operations showcase cutting-edge exhibition solutions, supporting major international events and trade shows throughout the country.",
            isActive: true,
            countryCode: "QA",
            timezone: "Asia/Qatar",
            contactInfo: {
                phone: "+974 4444 5555",
                email: "qatar@chronicles-dubai.com",
                workingHours: "9 AM - 6 PM",
                address: "Doha, Qatar",
            },
            services: [
                {
                    id: 1,
                    name: "Custom Exhibition Stand Design",
                    description: "Tailored exhibition solutions",
                    isActive: true,
                },
                {
                    id: 2,
                    name: "Double Decker Exhibitions",
                    description: "Multi-level exhibition stands",
                    isActive: true,
                },
                {
                    id: 3,
                    name: "Country Pavilion Solutions",
                    description: "National pavilion design and setup",
                    isActive: true,
                },
            ],
            stats: {
                projectsCompleted: 120,
                yearsOfOperation: 6,
                clientsSatisfied: 180,
                teamSize: 20,
            },
        },
        {
            id: 4,
            name: "Turkey",
            slug: "turkey",
            subtitle: "Bridging Europe and Asia with exceptional exhibitions",
            heroImage:
                "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description:
                "Explore our Turkish operations where we deliver innovative exhibition solutions at the crossroads of Europe and Asia.",
            isActive: true,
            countryCode: "TR",
            timezone: "Europe/Istanbul",
            contactInfo: {
                phone: "+90 212 345 6789",
                email: "turkey@chronicles-dubai.com",
                workingHours: "9 AM - 6 PM",
                address: "Istanbul, Turkey",
            },
            services: [
                {
                    id: 1,
                    name: "Custom Exhibition Stand Design",
                    description: "Tailored exhibition solutions",
                    isActive: true,
                },
                {
                    id: 2,
                    name: "Double Decker Exhibitions",
                    description: "Multi-level exhibition stands",
                    isActive: true,
                },
                {
                    id: 3,
                    name: "Country Pavilion Solutions",
                    description: "National pavilion design and setup",
                    isActive: true,
                },
            ],
            stats: {
                projectsCompleted: 100,
                yearsOfOperation: 5,
                clientsSatisfied: 150,
                teamSize: 18,
            },
        },
        {
            id: 5,
            name: "Kuwait",
            slug: "kuwait",
            subtitle: "Innovative exhibition solutions in Kuwait",
            heroImage:
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description:
                "Our Kuwait services provide comprehensive exhibition solutions for major trade shows and corporate events throughout the region.",
            isActive: true,
            countryCode: "KW",
            timezone: "Asia/Kuwait",
            contactInfo: {
                phone: "+965 2222 3333",
                email: "kuwait@chronicles-dubai.com",
                workingHours: "9 AM - 6 PM",
                address: "Kuwait City, Kuwait",
            },
            services: [
                {
                    id: 1,
                    name: "Custom Exhibition Stand Design",
                    description: "Tailored exhibition solutions",
                    isActive: true,
                },
                {
                    id: 2,
                    name: "Double Decker Exhibitions",
                    description: "Multi-level exhibition stands",
                    isActive: true,
                },
                {
                    id: 3,
                    name: "Country Pavilion Solutions",
                    description: "National pavilion design and setup",
                    isActive: true,
                },
            ],
            stats: {
                projectsCompleted: 80,
                yearsOfOperation: 4,
                clientsSatisfied: 120,
                teamSize: 15,
            },
        },
        {
            id: 6,
            name: "Jordan",
            slug: "jordan",
            subtitle: "Strategic exhibition services in the Levant",
            heroImage:
                "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            description:
                "Discover our Jordan operations, delivering exceptional exhibition experiences and supporting regional business growth.",
            isActive: true,
            countryCode: "JO",
            timezone: "Asia/Amman",
            contactInfo: {
                phone: "+962 6 555 6666",
                email: "jordan@chronicles-dubai.com",
                workingHours: "9 AM - 6 PM",
                address: "Amman, Jordan",
            },
            services: [
                {
                    id: 1,
                    name: "Custom Exhibition Stand Design",
                    description: "Tailored exhibition solutions",
                    isActive: true,
                },
                {
                    id: 2,
                    name: "Double Decker Exhibitions",
                    description: "Multi-level exhibition stands",
                    isActive: true,
                },
                {
                    id: 3,
                    name: "Country Pavilion Solutions",
                    description: "National pavilion design and setup",
                    isActive: true,
                },
            ],
            stats: {
                projectsCompleted: 60,
                yearsOfOperation: 3,
                clientsSatisfied: 90,
                teamSize: 12,
            },
        },
    ];

    /**
     * Fetches all cities with optional filtering
     * Ready for database integration - just replace mock data with actual API call
     */
    static async getCities(params?: CityQueryParams): Promise<CitiesResponse> {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredCities = this.mockCities.filter(city => city.isActive);

            // Apply filters
            if (params?.search) {
                const searchLower = params.search.toLowerCase();
                filteredCities = filteredCities.filter(
                    city =>
                        city.name.toLowerCase().includes(searchLower) ||
                        city.description.toLowerCase().includes(searchLower),
                );
            }

            if (params?.countryCode) {
                filteredCities = filteredCities.filter(
                    city => city.countryCode === params.countryCode,
                );
            }

            // Apply pagination
            const page = params?.page || 1;
            const limit = params?.limit || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedCities = filteredCities.slice(startIndex, endIndex);

            return {
                cities: paginatedCities,
                total: filteredCities.length,
                page,
                limit,
            };
        } catch (error) {
            console.error("Error fetching cities:", error);
            throw new Error("Failed to fetch cities");
        }
    }

    /**
     * Fetches a single city by slug
     * Ready for database integration
     */
    static async getCityBySlug(slug: string): Promise<City | null> {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const city = this.mockCities.find(
                c => c.slug === slug && c.isActive,
            );
            return city || null;
        } catch (error) {
            console.error("Error fetching city by slug:", error);
            throw new Error("Failed to fetch city");
        }
    }

    /**
     * Creates a new city (for future admin functionality)
     * Ready for database integration
     */
    static async createCity(cityData: CityInput): Promise<City> {
        try {
            // TODO: Replace with actual database call
            // const { data, error } = await supabase
            //     .from('cities')
            //     .insert(cityData)
            //     .select()
            //     .single();

            // Mock implementation
            const newCity: City = {
                id: this.mockCities.length + 1,
                ...cityData,
                isActive: cityData.isActive ?? true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            this.mockCities.push(newCity);
            return newCity;
        } catch (error) {
            console.error("Error creating city:", error);
            throw new Error("Failed to create city");
        }
    }

    /**
     * Updates an existing city (for future admin functionality)
     * Ready for database integration
     */
    static async updateCity(
        id: number,
        cityData: Partial<CityInput>,
    ): Promise<City> {
        try {
            // TODO: Replace with actual database call
            // const { data, error } = await supabase
            //     .from('cities')
            //     .update({ ...cityData, updated_at: new Date().toISOString() })
            //     .eq('id', id)
            //     .select()
            //     .single();

            // Mock implementation
            const cityIndex = this.mockCities.findIndex(c => c.id === id);
            if (cityIndex === -1) {
                throw new Error("City not found");
            }

            this.mockCities[cityIndex] = {
                ...this.mockCities[cityIndex],
                ...cityData,
                updatedAt: new Date().toISOString(),
            };

            return this.mockCities[cityIndex];
        } catch (error) {
            console.error("Error updating city:", error);
            throw new Error("Failed to update city");
        }
    }

    /**
     * Deletes a city (soft delete - sets isActive to false)
     * Ready for database integration
     */
    static async deleteCity(id: number): Promise<boolean> {
        try {
            // TODO: Replace with actual database call
            // const { error } = await supabase
            //     .from('cities')
            //     .update({ is_active: false, updated_at: new Date().toISOString() })
            //     .eq('id', id);

            // Mock implementation
            const cityIndex = this.mockCities.findIndex(c => c.id === id);
            if (cityIndex === -1) {
                throw new Error("City not found");
            }

            this.mockCities[cityIndex].isActive = false;
            this.mockCities[cityIndex].updatedAt = new Date().toISOString();

            return true;
        } catch (error) {
            console.error("Error deleting city:", error);
            throw new Error("Failed to delete city");
        }
    }
}
