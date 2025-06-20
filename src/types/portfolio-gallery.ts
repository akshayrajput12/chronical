// Portfolio Gallery Types
// Complete TypeScript type definitions for the Portfolio Gallery management system
//
// 🎯 PURPOSE: Type safety for portfolio gallery components and admin interface
// 📊 INCLUDES: Database models, API responses, admin interfaces, validation types
// 🔒 VALIDATION: Input validation and error handling types

// ============================================================================
// MAIN DATABASE INTERFACES
// ============================================================================

/**
 * Portfolio item from database
 */
export interface PortfolioItem {
    id: string;
    title?: string | null;
    description?: string | null;
    alt_text: string;
    grid_class: GridClass;
    display_order: number;
    image_id?: string | null;
    image_url?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Portfolio image from database
 */
export interface PortfolioImage {
    id: string;
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
    created_at: string;
    updated_at: string;
}

/**
 * Portfolio item with image data (from database function)
 */
export interface PortfolioItemWithImage extends PortfolioItem {
    image_file_path?: string | null;
    image_filename?: string | null;
    image_alt_text?: string | null;
    image_width?: number | null;
    image_height?: number | null;
}

// ============================================================================
// INPUT INTERFACES (For forms and API)
// ============================================================================

/**
 * Portfolio item input for creation/updates
 */
export interface PortfolioItemInput {
    title?: string;
    description?: string;
    alt_text: string;
    grid_class: GridClass;
    display_order: number;
    image_id?: string | null;
    image_url?: string;
    is_active: boolean;
}

/**
 * Portfolio image input for creation/updates
 */
export interface PortfolioImageInput {
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text: string;
    width?: number;
    height?: number;
    is_active: boolean;
    display_order: number;
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

/**
 * API response wrapper
 */
export interface PortfolioApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
    success: boolean;
}

// ============================================================================
// ADMIN INTERFACE TYPES
// ============================================================================

/**
 * Notification for admin interface
 */
export interface PortfolioNotification {
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
}

/**
 * Admin state management
 */
export interface PortfolioAdminState {
    // Data
    items: PortfolioItem[];
    images: PortfolioImage[];

    // UI State
    loading: boolean;
    saving: boolean;
    uploading: boolean;
    notification: PortfolioNotification;

    // Active tab
    activeTab: "items" | "images" | "preview";

    // Selected items
    selectedItems: string[];
    selectedImages: string[];
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
export interface PortfolioValidationErrors {
    title?: string;
    description?: string;
    alt_text?: string;
    grid_class?: string;
    display_order?: string;
    image_url?: string;
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
 * Grid class options for masonry layout
 */
export type GridClass = "row-span-1" | "row-span-2" | "row-span-3";

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
    MIN_WIDTH: 200,
    MIN_HEIGHT: 150,
    RECOMMENDED_WIDTH: 800,
    RECOMMENDED_HEIGHT: 600,
    MAX_WIDTH: 4000,
    MAX_HEIGHT: 3000,
} as const;

/**
 * Text length limits
 */
const TEXT_LIMITS = {
    TITLE: {
        MIN: 0,
        MAX: 200,
    },
    DESCRIPTION: {
        MIN: 0,
        MAX: 500,
    },
    ALT_TEXT: {
        MIN: 3,
        MAX: 200,
    },
} as const;

/**
 * Grid class options with display names
 */
const GRID_CLASS_OPTIONS = {
    "row-span-1": "Small (1 row)",
    "row-span-2": "Medium (2 rows)",
    "row-span-3": "Large (3 rows)",
} as const;

/**
 * Database table names
 */
const TABLE_NAMES = {
    PORTFOLIO_ITEMS: "portfolio_items",
    PORTFOLIO_IMAGES: "portfolio_images",
} as const;

/**
 * Storage bucket names
 */
const STORAGE_BUCKETS = {
    PORTFOLIO_GALLERY_IMAGES: "portfolio-gallery-images",
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Partial update type for portfolio items
 */
export type PortfolioItemUpdate = Partial<PortfolioItemInput>;

/**
 * Partial update type for portfolio images
 */
export type PortfolioImageUpdate = Partial<PortfolioImageInput>;

/**
 * Database query filters
 */
export interface PortfolioQueryFilters {
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

export {
    // Constants that are used by admin components
    GRID_CLASS_OPTIONS,
};
