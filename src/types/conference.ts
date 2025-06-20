/**
 * TypeScript interfaces for Conference data structure
 * Designed to match the database schema for conference sections
 */

// Conference Hero Section Types
export interface ConferenceHeroSection {
    id: string;
    created_at: string;
    updated_at: string;
    heading: string;
    background_image_url?: string;
    background_image_id?: string;
    is_active: boolean;
}

// Input types for creating/updating conference hero sections
export interface ConferenceHeroSectionInput {
    heading: string;
    background_image_url?: string;
    background_image_id?: string;
    is_active?: boolean;
}

// Conference Hero Image Types
export interface ConferenceHeroImage {
    id: string;
    created_at: string;
    updated_at: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text: string;
    is_active: boolean;
    uploaded_by?: string;
}

// Input types for creating/updating conference hero images
export interface ConferenceHeroImageInput {
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    is_active?: boolean;
}

// Combined type for conference hero section with image data
export interface ConferenceHeroSectionWithImage extends ConferenceHeroSection {
    image?: ConferenceHeroImage;
}

// API Response types
export interface ConferenceHeroResponse {
    data: ConferenceHeroSection | null;
    error?: string;
}

export interface ConferenceHeroImagesResponse {
    data: ConferenceHeroImage[];
    error?: string;
}

// Form validation types
export interface ConferenceHeroFormData {
    heading: string;
    background_image_url: string;
}

// Upload types
export interface ConferenceHeroImageUpload {
    file: File;
    alt_text?: string;
}

export interface ConferenceHeroImageUploadResponse {
    success: boolean;
    data?: ConferenceHeroImage;
    error?: string;
}
