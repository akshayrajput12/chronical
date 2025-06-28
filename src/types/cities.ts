/**
 * TypeScript interfaces for Cities data structure
 * Designed to be database-ready for future API integration
 */

export interface City {
    id: number;
    name: string;
    slug: string;
    subtitle: string;
    heroImage: string;
    description: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    // Additional fields for future database integration
    countryCode?: string;
    timezone?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    contactInfo?: CityContactInfo;
    services?: CityService[];
    stats?: CityStats;
}

export interface CityContactInfo {
    phone: string;
    email: string;
    address?: string;
    workingHours: string;
    emergencyContact?: string;
}

export interface CityService {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
}

export interface CityStats {
    projectsCompleted?: number;
    yearsOfOperation?: number;
    clientsSatisfied?: number;
    teamSize?: number;
}

// Input types for creating/updating cities
export interface CityInput {
    name: string;
    slug: string;
    subtitle: string;
    heroImage: string;
    description: string;
    isActive?: boolean;
    countryCode?: string;
    timezone?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

export interface CityContactInfoInput {
    phone: string;
    email: string;
    address?: string;
    workingHours: string;
    emergencyContact?: string;
}

export interface CityServiceInput {
    name: string;
    description: string;
    isActive?: boolean;
}

// API Response types
export interface CitiesResponse {
    cities: City[];
    total: number;
    page?: number;
    limit?: number;
}

export interface CityResponse {
    city: City;
}

// Error types
export interface CityError {
    message: string;
    code?: string;
    field?: string;
}

// Loading states
export interface CityLoadingState {
    isLoading: boolean;
    error: CityError | null;
}

// Query parameters for filtering cities
export interface CityQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    countryCode?: string;
}
