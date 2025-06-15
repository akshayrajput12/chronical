// Types for the dynamic cell section and image management

export interface DynamicCellImage {
    id: string;
    created_at: string;
    updated_at: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    width: number; // Static width (1920)
    height: number; // Static height (1080)
    alt_text: string;
    is_active: boolean;
    uploaded_by: string | null;
}

export interface DynamicCellSection {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    description: string | null;
    background_image_id: string | null;
    background_image_url: string | null;
    fallback_image_url: string;
    is_active: boolean;
}

export interface DynamicCellSectionWithImage extends DynamicCellSection {
    image_data: DynamicCellImage | null;
}

export interface DynamicCellImageInput {
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    width?: number; // Defaults to 1920
    height?: number; // Defaults to 1080
    alt_text?: string;
    is_active?: boolean;
}

export interface DynamicCellSectionInput {
    title: string;
    description?: string | null;
    background_image_id?: string | null;
    background_image_url?: string | null;
    fallback_image_url?: string;
    is_active?: boolean;
}

// For the frontend component display
export interface DynamicCellDisplayData {
    id: string;
    title: string;
    description: string | null;
    background_image_url: string;
    fallback_image_url: string;
    image_data: DynamicCellImage | null;
}

// For file upload handling
export interface ImageUploadResult {
    success: boolean;
    data?: DynamicCellImage;
    error?: string;
    file_path?: string;
    public_url?: string;
}

// For image management in admin
export interface ImageManagementData {
    images: DynamicCellImage[];
    active_image: DynamicCellImage | null;
    section: DynamicCellSection;
}

// Supported image formats
export const SUPPORTED_IMAGE_FORMATS = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
] as const;

export type SupportedImageFormat = (typeof SUPPORTED_IMAGE_FORMATS)[number];

// Image upload constraints
export const IMAGE_UPLOAD_CONSTRAINTS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    STATIC_WIDTH: 1920, // All images will be treated as this width
    STATIC_HEIGHT: 1080, // All images will be treated as this height
    SUPPORTED_FORMATS: SUPPORTED_IMAGE_FORMATS,
} as const;
