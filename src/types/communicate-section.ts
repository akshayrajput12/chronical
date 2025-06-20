// Communicate Section Types
// TypeScript interfaces for communicate section data structures
//
// 🎯 PURPOSE: Type safety for communicate section admin system
// 📊 INTERFACES: Database models, form inputs, API responses
// 🔒 VALIDATION: Proper typing for all data operations

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Communicate Section - Main content table model
 */
export interface CommunicateSection {
    id: string;

    // Section Content
    main_heading: string;
    company_name: string;
    first_paragraph: string;
    second_paragraph: string;

    // Image Configuration
    main_image_id?: string | null;
    main_image_url?: string | null;
    main_image_alt: string;

    // Status and Metadata
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Communicate Image - Images table model
 */
export interface CommunicateImage {
    id: string;

    // File Information
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;

    // Image Metadata
    alt_text: string;
    width?: number | null;
    height?: number | null;

    // Status and Organization
    is_active: boolean;
    display_order: number;

    // Timestamps
    created_at: string;
    updated_at: string;
}

// ============================================================================
// FORM INPUT TYPES
// ============================================================================

/**
 * Communicate Section Input - For forms and API calls
 */
export interface CommunicateSectionInput {
    // Section Content
    main_heading: string;
    company_name: string;
    first_paragraph: string;
    second_paragraph: string;

    // Image Configuration
    main_image_id?: string | null;
    main_image_url?: string | null;
    main_image_alt: string;

    // Status
    is_active: boolean;
}

/**
 * Communicate Image Input - For image uploads
 */
export interface CommunicateImageInput {
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text: string;
    width?: number | null;
    height?: number | null;
    is_active: boolean;
    display_order: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Communicate Section with Image - Database function response
 */
export interface CommunicateSectionWithImage extends CommunicateSection {
    // Additional image fields from JOIN
    image_file_path?: string | null;
    image_filename?: string | null;
    image_alt_text?: string | null;
}

/**
 * API Response wrapper for communicate section operations
 */
export interface CommunicateApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// ============================================================================
// ADMIN INTERFACE TYPES
// ============================================================================

/**
 * Notification state for admin interface
 */
export interface CommunicateNotification {
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
}

/**
 * Admin form state
 */
export interface CommunicateAdminState {
    // Data
    sectionData: CommunicateSectionInput;
    images: CommunicateImage[];

    // UI State
    loading: boolean;
    saving: boolean;
    uploading: boolean;
    notification: CommunicateNotification;

    // Active tab
    activeTab: "content" | "images" | "preview";
}

/**
 * Image upload progress
 */
export interface ImageUploadProgress {
    file: File;
    progress: number;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Form validation errors
 */
export interface CommunicateValidationErrors {
    main_heading?: string;
    company_name?: string;
    first_paragraph?: string;
    second_paragraph?: string;
    main_image_alt?: string;
}

/**
 * File validation result
 */
export interface FileValidationResult {
    valid: boolean;
    error?: string;
    warnings?: string[];
}

// ============================================================================
// CONSTANTS AND ENUMS
// ============================================================================

/**
 * Supported image MIME types
 */
export const SUPPORTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
] as const;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

/**
 * File size limits
 */
export const FILE_SIZE_LIMITS = {
    MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
    RECOMMENDED_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
} as const;

/**
 * Image dimensions
 */
export const IMAGE_DIMENSIONS = {
    MIN_WIDTH: 400,
    MIN_HEIGHT: 300,
    RECOMMENDED_WIDTH: 1200,
    RECOMMENDED_HEIGHT: 800,
    MAX_WIDTH: 4000,
    MAX_HEIGHT: 3000,
} as const;

/**
 * Text length limits
 */
export const TEXT_LIMITS = {
    MAIN_HEADING: {
        MIN: 5,
        MAX: 200,
    },
    COMPANY_NAME: {
        MIN: 3,
        MAX: 100,
    },
    FIRST_PARAGRAPH: {
        MIN: 10,
        MAX: 1000,
    },
    SECOND_PARAGRAPH: {
        MIN: 10,
        MAX: 1000,
    },
    ALT_TEXT: {
        MIN: 3,
        MAX: 200,
    },
} as const;

/**
 * Database table names
 */
export const TABLE_NAMES = {
    COMMUNICATE_SECTIONS: "communicate_sections",
    COMMUNICATE_IMAGES: "communicate_images",
} as const;

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
    COMMUNICATE_SECTION_IMAGES: "communicate-section-images",
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Partial update type for sections
 */
export type CommunicateSectionUpdate = Partial<CommunicateSectionInput>;

/**
 * Partial update type for images
 */
export type CommunicateImageUpdate = Partial<CommunicateImageInput>;

/**
 * Database query filters
 */
export interface CommunicateQueryFilters {
    is_active?: boolean;
    limit?: number;
    offset?: number;
    order_by?: "created_at" | "updated_at" | "display_order";
    order_direction?: "asc" | "desc";
}

/**
 * Image processing options
 */
export interface ImageProcessingOptions {
    resize?: {
        width: number;
        height: number;
        fit?: "cover" | "contain" | "fill";
    };
    quality?: number;
    format?: "jpeg" | "png" | "webp";
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================
