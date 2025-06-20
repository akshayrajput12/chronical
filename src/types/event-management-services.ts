// Event Management Services Types
// TypeScript interfaces for event management services data structures
//
// 🎯 PURPOSE: Type safety for event management services admin system
// 📊 INTERFACES: Database models, form inputs, API responses
// 🔒 VALIDATION: Proper typing for all data operations

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Event Management Section - Main content table model
 */
export interface EventManagementSection {
    id: string;

    // Top Section Content
    main_heading: string;
    main_description: string;

    // Bottom Section Content
    secondary_heading: string;
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
 * Event Management Image - Images table model
 */
export interface EventManagementImage {
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
 * Event Management Section Input - For forms and API calls
 */
export interface EventManagementSectionInput {
    // Top Section Content
    main_heading: string;
    main_description: string;

    // Bottom Section Content
    secondary_heading: string;
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
 * Event Management Image Input - For image uploads
 */
export interface EventManagementImageInput {
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
 * Event Management Section with Image - Database function response
 */
export interface EventManagementSectionWithImage
    extends EventManagementSection {
    // Additional image fields from JOIN
    image_file_path?: string | null;
    image_filename?: string | null;
    image_alt_text?: string | null;
}

/**
 * API Response wrapper for event management operations
 */
export interface EventManagementApiResponse<T = unknown> {
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
export interface EventManagementNotification {
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
}

/**
 * Admin form state
 */
export interface EventManagementAdminState {
    // Data
    sectionData: EventManagementSectionInput;
    images: EventManagementImage[];

    // UI State
    loading: boolean;
    saving: boolean;
    uploading: boolean;
    notification: EventManagementNotification;

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
export interface EventManagementValidationErrors {
    main_heading?: string;
    main_description?: string;
    secondary_heading?: string;
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
    MAIN_DESCRIPTION: {
        MIN: 10,
        MAX: 1000,
    },
    SECONDARY_HEADING: {
        MIN: 5,
        MAX: 200,
    },
    PARAGRAPH: {
        MIN: 10,
        MAX: 2000,
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
    EVENT_MANAGEMENT_SECTIONS: "event_management_sections",
    EVENT_MANAGEMENT_IMAGES: "event_management_images",
} as const;

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
    EVENT_MANAGEMENT_IMAGES: "event-management-images",
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Partial update type for sections
 */
export type EventManagementSectionUpdate = Partial<EventManagementSectionInput>;

/**
 * Partial update type for images
 */
export type EventManagementImageUpdate = Partial<EventManagementImageInput>;

/**
 * Database query filters
 */
export interface EventManagementQueryFilters {
    is_active?: boolean;
    limit?: number;
    offset?: number;
    order_by?: "created_at" | "updated_at" | "main_heading";
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
