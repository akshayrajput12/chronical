// Conference Management Services Types
// TypeScript interfaces for conference management services data structures
//
// 🎯 PURPOSE: Type safety for conference management services admin system
// 📊 INTERFACES: Database models, form inputs, API responses
// 🔒 VALIDATION: Proper typing for all data operations

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Conference Management Section - Main content table model
 */
export interface ConferenceManagementSection {
    id: string;

    // Section Content
    main_heading: string;
    main_description: string;

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
 * Conference Management Service - Individual service item model
 */
export interface ConferenceManagementService {
    id: string;

    // Service Content
    title: string;
    description: string;

    // Display Configuration
    display_order: number;
    is_active: boolean;

    // Timestamps
    created_at: string;
    updated_at: string;
}

/**
 * Conference Management Image - Images table model
 */
export interface ConferenceManagementImage {
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
 * Conference Management Section Input - For forms and API calls
 */
export interface ConferenceManagementSectionInput {
    // Section Content
    main_heading: string;
    main_description: string;

    // Image Configuration
    main_image_id?: string | null;
    main_image_url?: string | null;
    main_image_alt: string;

    // Status
    is_active: boolean;
}

/**
 * Conference Management Service Input - For service forms
 */
export interface ConferenceManagementServiceInput {
    title: string;
    description: string;
    display_order: number;
    is_active: boolean;
}

/**
 * Conference Management Image Input - For image uploads
 */
export interface ConferenceManagementImageInput {
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
 * Conference Management Section with Image - Database function response
 */
export interface ConferenceManagementSectionWithImage
    extends ConferenceManagementSection {
    // Additional image fields from JOIN
    image_file_path?: string | null;
    image_filename?: string | null;
    image_alt_text?: string | null;
}

/**
 * API Response wrapper for conference management operations
 */
export interface ConferenceManagementApiResponse<T = unknown> {
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
export interface ConferenceManagementNotification {
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
}

/**
 * Admin form state
 */
export interface ConferenceManagementAdminState {
    // Data
    sectionData: ConferenceManagementSectionInput;
    services: ConferenceManagementService[];
    images: ConferenceManagementImage[];

    // UI State
    loading: boolean;
    saving: boolean;
    uploading: boolean;
    notification: ConferenceManagementNotification;

    // Active tab
    activeTab: "content" | "services" | "images" | "preview";
}

/**
 * Service form state for editing individual services
 */
export interface ServiceFormState {
    editingService: ConferenceManagementService | null;
    isEditing: boolean;
    formData: ConferenceManagementServiceInput;
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
export interface ConferenceManagementValidationErrors {
    main_heading?: string;
    main_description?: string;
    main_image_alt?: string;
    services?: {
        [serviceId: string]: {
            title?: string;
            description?: string;
        };
    };
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
    MAIN_DESCRIPTION: {
        MIN: 10,
        MAX: 1000,
    },
    SERVICE_TITLE: {
        MIN: 3,
        MAX: 100,
    },
    SERVICE_DESCRIPTION: {
        MIN: 10,
        MAX: 500,
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
    CONFERENCE_MANAGEMENT_SECTIONS: "conference_management_sections",
    CONFERENCE_MANAGEMENT_SERVICES: "conference_management_services",
    CONFERENCE_MANAGEMENT_IMAGES: "conference_management_images",
} as const;

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
    CONFERENCE_MANAGEMENT_IMAGES: "conference-management-images",
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Partial update type for sections
 */
export type ConferenceManagementSectionUpdate =
    Partial<ConferenceManagementSectionInput>;

/**
 * Partial update type for services
 */
export type ConferenceManagementServiceUpdate =
    Partial<ConferenceManagementServiceInput>;

/**
 * Partial update type for images
 */
export type ConferenceManagementImageUpdate =
    Partial<ConferenceManagementImageInput>;

/**
 * Database query filters
 */
export interface ConferenceManagementQueryFilters {
    is_active?: boolean;
    limit?: number;
    offset?: number;
    order_by?: "created_at" | "updated_at" | "display_order" | "title";
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
