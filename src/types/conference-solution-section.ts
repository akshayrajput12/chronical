// Conference Solution Section Types
// TypeScript interfaces for conference solution section data structures
//
// 🎯 PURPOSE: Type safety for conference solution section admin system
// 📊 INTERFACES: Database models, form inputs, API responses
// 🔒 VALIDATION: Proper typing for all data operations

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Conference Solution Section - Main content table model
 */
export interface ConferenceSolutionSection {
    id: string;

    // Section Content
    main_heading: string;
    phone_number: string;
    call_to_action_text: string;

    // Background Configuration
    background_color: string;

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
 * Conference Solution Image - Images table model
 */
export interface ConferenceSolutionImage {
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
 * Conference Solution Section Input - For forms and API calls
 */
export interface ConferenceSolutionSectionInput {
    // Section Content
    main_heading: string;
    phone_number: string;
    call_to_action_text: string;

    // Background Configuration
    background_color: string;

    // Image Configuration
    main_image_id?: string | null;
    main_image_url?: string | null;
    main_image_alt: string;

    // Status
    is_active: boolean;
}

/**
 * Conference Solution Image Input - For image uploads
 */
export interface ConferenceSolutionImageInput {
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
 * Conference Solution Section with Image - Database function response
 */
export interface ConferenceSolutionSectionWithImage
    extends ConferenceSolutionSection {
    // Additional image fields from JOIN
    image_file_path?: string | null;
    image_filename?: string | null;
    image_alt_text?: string | null;
}

/**
 * API Response wrapper for conference solution section operations
 */
export interface ConferenceSolutionApiResponse<T = unknown> {
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
export interface ConferenceSolutionNotification {
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
}

/**
 * Admin form state
 */
export interface ConferenceSolutionAdminState {
    // Data
    sectionData: ConferenceSolutionSectionInput;
    images: ConferenceSolutionImage[];

    // UI State
    loading: boolean;
    saving: boolean;
    uploading: boolean;
    notification: ConferenceSolutionNotification;

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
export interface ConferenceSolutionValidationErrors {
    main_heading?: string;
    phone_number?: string;
    call_to_action_text?: string;
    background_color?: string;
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
const SUPPORTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
] as const;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

/**
 * File size limits
 */
const FILE_SIZE_LIMITS = {
    MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
    RECOMMENDED_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
} as const;

/**
 * Image dimensions
 */
const IMAGE_DIMENSIONS = {
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
const TEXT_LIMITS = {
    MAIN_HEADING: {
        MIN: 5,
        MAX: 200,
    },
    PHONE_NUMBER: {
        MIN: 5,
        MAX: 50,
    },
    CALL_TO_ACTION_TEXT: {
        MIN: 5,
        MAX: 200,
    },
    ALT_TEXT: {
        MIN: 3,
        MAX: 200,
    },
} as const;

/**
 * Background color options
 */
const BACKGROUND_COLORS = {
    GREEN: "#a5cd39",
    BLUE: "#3b82f6",
    RED: "#ef4444",
    PURPLE: "#8b5cf6",
    ORANGE: "#f97316",
    GRAY: "#6b7280",
    BLACK: "#000000",
} as const;

/**
 * Database table names
 */
const TABLE_NAMES = {
    CONFERENCE_SOLUTION_SECTIONS: "conference_solution_sections",
    CONFERENCE_SOLUTION_IMAGES: "conference_solution_images",
} as const;

/**
 * Storage bucket names
 */
const STORAGE_BUCKETS = {
    CONFERENCE_SOLUTION_SECTION_IMAGES: "conference-solution-section-images",
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Partial update type for sections
 */
export type ConferenceSolutionSectionUpdate =
    Partial<ConferenceSolutionSectionInput>;

/**
 * Partial update type for images
 */
export type ConferenceSolutionImageUpdate =
    Partial<ConferenceSolutionImageInput>;

/**
 * Database query filters
 */
export interface ConferenceSolutionQueryFilters {
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

/**
 * Phone number validation
 */
export interface PhoneNumberValidation {
    valid: boolean;
    formatted?: string;
    country?: string;
    error?: string;
}

/**
 * Color validation
 */
export interface ColorValidation {
    valid: boolean;
    hex?: string;
    rgb?: { r: number; g: number; b: number };
    error?: string;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export {
    // Constants that are used by admin components
    BACKGROUND_COLORS,
};
