/**
 * TypeScript interfaces for Cities data structure
 * Updated to match Supabase database schema
 */

export interface City {
    id: string; // UUID in database
    name: string;
    slug: string;
    subtitle?: string;
    hero_image_url?: string;
    description?: string;
    is_active: boolean;
    country_code?: string;
    timezone?: string;

    // Contact Information
    contact_phone?: string;
    contact_email?: string;
    contact_address?: string;
    contact_working_hours?: string;
    contact_emergency?: string;

    // Statistics
    projects_completed?: number;
    years_of_operation?: number;
    clients_satisfied?: number;
    team_size?: number;

    // Coordinates
    latitude?: number;
    longitude?: number;

    // SEO Fields
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;

    // Timestamps
    created_at?: string;
    updated_at?: string;

    // Related data (populated via joins)
    services?: CityService[];
    content_sections?: CityContentSection[];
    portfolio_items?: CityPortfolioItem[];
    components?: CityComponent[];
    preferred_services?: CityPreferredService[];
    contact_details?: CityContactDetail[];
}

export interface CityService {
    id: string; // UUID
    city_id: string;
    name: string;
    description?: string;
    image_url?: string;
    href_link?: string;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface CityContentSection {
    id: string; // UUID
    city_id: string;
    section_type: string; // 'hero', 'content', 'services', 'role', etc.
    title?: string;
    subtitle?: string;
    content?: string;
    image_url?: string;
    additional_data?: any; // JSONB field for flexible data
    is_active: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface CityPortfolioItem {
    id: string; // UUID
    city_id: string;
    title?: string;
    description?: string;
    image_url: string;
    alt_text?: string;
    category?: string;
    project_year?: number;
    client_name?: string;
    is_featured: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface CityComponent {
    id: string; // UUID
    city_id: string;
    title: string;
    description?: string;
    icon_name?: string;
    color?: string;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface CityPreferredService {
    id: string; // UUID
    city_id: string;
    service_text: string;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface CityContactDetail {
    id: string; // UUID
    city_id: string;
    contact_type: string; // 'phone', 'email', 'whatsapp', etc.
    contact_value: string;
    display_text?: string;
    is_primary: boolean;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

// Input types for creating/updating cities
export interface CityInput {
    name: string;
    slug?: string; // Auto-generated if not provided
    subtitle?: string;
    hero_image_url?: string;
    description?: string;
    is_active?: boolean;
    country_code?: string;
    timezone?: string;

    // Contact Information
    contact_phone?: string;
    contact_email?: string;
    contact_address?: string;
    contact_working_hours?: string;
    contact_emergency?: string;

    // Statistics
    projects_completed?: number;
    years_of_operation?: number;
    clients_satisfied?: number;
    team_size?: number;

    // Coordinates
    latitude?: number;
    longitude?: number;

    // SEO Fields
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
}

export interface CityServiceInput {
    name: string;
    description?: string;
    image_url?: string;
    href_link?: string;
    is_active?: boolean;
    sort_order?: number;
}

export interface CityContentSectionInput {
    section_type: string;
    title?: string;
    subtitle?: string;
    content?: string;
    image_url?: string;
    additional_data?: any;
    is_active?: boolean;
    sort_order?: number;
}

export interface CityPortfolioItemInput {
    title?: string;
    description?: string;
    image_url: string;
    alt_text?: string;
    category?: string;
    project_year?: number;
    client_name?: string;
    is_featured?: boolean;
    sort_order?: number;
}

export interface CityComponentInput {
    title: string;
    description?: string;
    icon_name?: string;
    color?: string;
    is_active?: boolean;
    sort_order?: number;
}

export interface CityPreferredServiceInput {
    service_text: string;
    is_active?: boolean;
    sort_order?: number;
}

export interface CityContactDetailInput {
    contact_type: string;
    contact_value: string;
    display_text?: string;
    is_primary?: boolean;
    is_active?: boolean;
    sort_order?: number;
}

// API Response types
export interface CitiesResponse {
    cities: LegacyCity[];
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
    is_active?: boolean;
    country_code?: string;
}

// Admin-specific types
export interface UpdateCityRequest extends Partial<CityInput> {
    id: string;
}

export interface CityWithRelations extends City {
    services: CityService[];
    content_sections: CityContentSection[];
    portfolio_items: CityPortfolioItem[];
    components: CityComponent[];
}

// Legacy interface for backward compatibility with existing components
export interface LegacyCity {
    id: number;
    name: string;
    slug: string;
    subtitle: string;
    heroImage: string;
    description: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    countryCode?: string;
    timezone?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    contactInfo?: {
        phone: string;
        email: string;
        address?: string;
        workingHours: string;
        emergencyContact?: string;
    };
    services?: {
        id: number;
        name: string;
        description: string;
        isActive: boolean;
    }[];
    stats?: {
        projectsCompleted?: number;
        yearsOfOperation?: number;
        clientsSatisfied?: number;
        teamSize?: number;
    };
    // Additional data for dynamic content
    contentSections?: CityContentSection[];
    portfolioItems?: CityPortfolioItem[];
    components?: CityComponent[];
    preferredServices?: CityPreferredService[];
    contactDetails?: CityContactDetail[];
}
