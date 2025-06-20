/**
 * TypeScript interfaces for Kiosk data structure
 * Designed to match the database schema for kiosk sections
 */

// Kiosk Hero Section Types
export interface KioskHeroSection {
    id: string;
    created_at: string;
    updated_at: string;
    heading: string;
    background_image_url?: string;
    background_image_id?: string;
    is_active: boolean;
}

// Input types for creating/updating kiosk hero sections
export interface KioskHeroSectionInput {
    heading: string;
    background_image_url?: string;
    background_image_id?: string;
    is_active?: boolean;
}

// Kiosk Hero Image Types
export interface KioskHeroImage {
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

// Input types for creating/updating kiosk hero images
export interface KioskHeroImageInput {
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    is_active?: boolean;
}

// Combined type for kiosk hero section with image data
export interface KioskHeroSectionWithImage extends KioskHeroSection {
    image?: KioskHeroImage;
    image_file_path?: string;
}

// API Response types
export interface KioskHeroResponse {
    data: KioskHeroSection | null;
    error?: string;
}

export interface KioskHeroImagesResponse {
    data: KioskHeroImage[];
    error?: string;
}

// Form validation types
export interface KioskHeroFormData {
    heading: string;
    background_image_url: string;
}

// Upload types
export interface KioskHeroImageUpload {
    file: File;
    alt_text?: string;
}

export interface KioskHeroImageUploadResponse {
    success: boolean;
    data?: KioskHeroImage;
    error?: string;
}

// Database function response types
export interface KioskHeroSectionWithImageData {
    id: string;
    heading: string;
    background_image_url?: string;
    background_image_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    image_file_path?: string;
}

// Admin interface types
export interface KioskHeroAdminState {
    sectionData: KioskHeroSectionInput;
    images: KioskHeroImage[];
    loading: boolean;
    saving: boolean;
    uploading: boolean;
}

// Notification types
export interface KioskHeroNotification {
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
}

// File upload types
export interface KioskHeroFileUpload {
    file: File;
    preview?: string;
    uploading?: boolean;
    error?: string;
}

// Drag and drop types
export interface KioskHeroDragDropState {
    isDragOver: boolean;
    files: KioskHeroFileUpload[];
}

// API operation types
export type KioskHeroOperation =
    | "create"
    | "update"
    | "delete"
    | "upload"
    | "activate"
    | "deactivate";

// Error types
export interface KioskHeroError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

// Success response types
export interface KioskHeroSuccessResponse<T = unknown> {
    success: true;
    data: T;
    message?: string;
}

// Error response types
export interface KioskHeroErrorResponse {
    success: false;
    error: KioskHeroError;
    message: string;
}

// Combined response types
export type KioskHeroApiResponse<T = unknown> =
    | KioskHeroSuccessResponse<T>
    | KioskHeroErrorResponse;

// Preview types
export interface KioskHeroPreviewData {
    heading: string;
    background_image_url?: string;
    is_active: boolean;
}

// Validation types
export interface KioskHeroValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// File validation types
export interface KioskHeroFileValidation {
    isValid: boolean;
    error?: string;
    maxSize: number;
    allowedTypes: string[];
}

// Component props types
export interface KioskHeroComponentProps {
    data?: KioskHeroSectionWithImageData;
    loading?: boolean;
    error?: string;
}

// Admin component props types
export interface KioskHeroAdminProps {
    initialData?: KioskHeroSectionWithImageData;
    onSave?: (data: KioskHeroSectionInput) => Promise<void>;
    onImageUpload?: (file: File) => Promise<KioskHeroImage>;
    onImageDelete?: (imageId: string) => Promise<void>;
}

// Tab types for admin interface
export type KioskHeroAdminTab = "content" | "images" | "preview";

// Sort and filter types
export interface KioskHeroSortOptions {
    field: keyof KioskHeroImage;
    direction: "asc" | "desc";
}

export interface KioskHeroFilterOptions {
    isActive?: boolean;
    mimeType?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
}

// Pagination types
export interface KioskHeroPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// List response types
export interface KioskHeroListResponse<T> {
    data: T[];
    pagination: KioskHeroPagination;
    error?: string;
}

// Bulk operation types
export interface KioskHeroBulkOperation {
    operation: KioskHeroOperation;
    ids: string[];
}

export interface KioskHeroBulkResponse {
    success: boolean;
    processed: number;
    failed: number;
    errors?: KioskHeroError[];
}

// ============================================================================
// KIOSK CONTENT SECTION TYPES
// ============================================================================

// Kiosk Content Section Types
export interface KioskContentSection {
    id: string;
    created_at: string;
    updated_at: string;
    first_section_heading: string;
    first_section_content: string;
    first_section_highlight_text?: string;
    second_section_heading: string;
    second_section_paragraph_1: string;
    second_section_paragraph_2: string;
    main_image_id?: string;
    main_image_url?: string;
    main_image_alt?: string;
    is_active: boolean;
}

// Input types for creating/updating kiosk content sections
export interface KioskContentSectionInput {
    first_section_heading: string;
    first_section_content: string;
    first_section_highlight_text?: string;
    second_section_heading: string;
    second_section_paragraph_1: string;
    second_section_paragraph_2: string;
    main_image_id?: string;
    main_image_url?: string;
    main_image_alt?: string;
    is_active?: boolean;
}

// Kiosk Content Image Types
export interface KioskContentImage {
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

// Input types for creating/updating kiosk content images
export interface KioskContentImageInput {
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    is_active?: boolean;
}

// Combined type for kiosk content section with image data
export interface KioskContentSectionWithImage extends KioskContentSection {
    image?: KioskContentImage;
    image_file_path?: string;
}

// Database function response types for content
export interface KioskContentSectionWithImageData {
    id: string;
    first_section_heading: string;
    first_section_content: string;
    first_section_highlight_text?: string;
    second_section_heading: string;
    second_section_paragraph_1: string;
    second_section_paragraph_2: string;
    main_image_id?: string;
    main_image_url?: string;
    main_image_alt?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    image_file_path?: string;
}

// API Response types for content
export interface KioskContentResponse {
    data: KioskContentSection | null;
    error?: string;
}

export interface KioskContentImagesResponse {
    data: KioskContentImage[];
    error?: string;
}

// Form validation types for content
export interface KioskContentFormData {
    first_section_heading: string;
    first_section_content: string;
    first_section_highlight_text?: string;
    second_section_heading: string;
    second_section_paragraph_1: string;
    second_section_paragraph_2: string;
    main_image_url?: string;
    main_image_alt?: string;
}

// Upload types for content
export interface KioskContentImageUpload {
    file: File;
    alt_text?: string;
}

export interface KioskContentImageUploadResponse {
    success: boolean;
    data?: KioskContentImage;
    error?: string;
}

// Admin interface types for content
export interface KioskContentAdminState {
    sectionData: KioskContentSectionInput;
    images: KioskContentImage[];
    loading: boolean;
    saving: boolean;
    uploading: boolean;
}

// Notification types for content (reusing hero notification type)
export type KioskContentNotification = KioskHeroNotification;

// File upload types for content (reusing hero file upload type)
export type KioskContentFileUpload = KioskHeroFileUpload;

// Drag and drop types for content (reusing hero drag drop type)
export type KioskContentDragDropState = KioskHeroDragDropState;

// Component props types for content
export interface KioskContentComponentProps {
    data?: KioskContentSectionWithImageData;
    loading?: boolean;
    error?: string;
}

// Admin component props types for content
export interface KioskContentAdminProps {
    initialData?: KioskContentSectionWithImageData;
    onSave?: (data: KioskContentSectionInput) => Promise<void>;
    onImageUpload?: (file: File) => Promise<KioskContentImage>;
    onImageDelete?: (imageId: string) => Promise<void>;
}

// Tab types for content admin interface
export type KioskContentAdminTab = "content" | "images" | "preview";

// Preview types for content
export interface KioskContentPreviewData {
    first_section_heading: string;
    first_section_content: string;
    first_section_highlight_text?: string;
    second_section_heading: string;
    second_section_paragraph_1: string;
    second_section_paragraph_2: string;
    main_image_url?: string;
    main_image_alt?: string;
    is_active: boolean;
}

// Validation types for content
export interface KioskContentValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// ============================================================================
// KIOSK BENEFITS SECTION TYPES
// ============================================================================

// Kiosk Benefit Item Types
export interface KioskBenefitItem {
    id: string;
    title: string;
    description: string;
    order: number;
}

// Input types for creating/updating kiosk benefit items
export interface KioskBenefitItemInput {
    id?: string;
    title: string;
    description: string;
    order: number;
}

// Kiosk Benefits Section Types
export interface KioskBenefitsSection {
    id: string;
    created_at: string;
    updated_at: string;
    section_heading: string;
    section_description: string;
    benefit_items: KioskBenefitItem[];
    is_active: boolean;
}

// Input types for creating/updating kiosk benefits sections
export interface KioskBenefitsSectionInput {
    section_heading: string;
    section_description: string;
    benefit_items: KioskBenefitItemInput[];
    is_active?: boolean;
}

// Database function response types for benefits
export interface KioskBenefitsSectionData {
    id: string;
    section_heading: string;
    section_description: string;
    benefit_items: KioskBenefitItem[]; // JSONB from database
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// API Response types for benefits
export interface KioskBenefitsResponse {
    data: KioskBenefitsSection | null;
    error?: string;
}

// Form validation types for benefits
export interface KioskBenefitsFormData {
    section_heading: string;
    section_description: string;
    benefit_items: KioskBenefitItemInput[];
}

// Admin interface types for benefits
export interface KioskBenefitsAdminState {
    sectionData: KioskBenefitsSectionInput;
    loading: boolean;
    saving: boolean;
}

// Notification types for benefits (reusing hero notification type)
export type KioskBenefitsNotification = KioskHeroNotification;

// Component props types for benefits
export interface KioskBenefitsComponentProps {
    data?: KioskBenefitsSectionData;
    loading?: boolean;
    error?: string;
}

// Admin component props types for benefits
export interface KioskBenefitsAdminProps {
    initialData?: KioskBenefitsSectionData;
    onSave?: (data: KioskBenefitsSectionInput) => Promise<void>;
}

// Tab types for benefits admin interface
export type KioskBenefitsAdminTab = "content" | "preview";

// Preview types for benefits
export interface KioskBenefitsPreviewData {
    section_heading: string;
    section_description: string;
    benefit_items: KioskBenefitItem[];
    is_active: boolean;
}

// Validation types for benefits
export interface KioskBenefitsValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// Benefit item validation types
export interface KioskBenefitItemValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// ============================================================================
// KIOSK MANUFACTURERS SECTION TYPES
// ============================================================================

// Kiosk Manufacturers Image Types
export interface KioskManufacturersImage {
    id: string;
    created_at: string;
    updated_at: string;
    file_name: string;
    file_path: string;
    file_url?: string;
    file_size?: number;
    mime_type?: string;
    alt_text?: string;
    width?: number;
    height?: number;
    display_order: number;
    is_active: boolean;
}

// Input types for creating/updating kiosk manufacturers images
export interface KioskManufacturersImageInput {
    file_name: string;
    file_path: string;
    file_size?: number;
    mime_type?: string;
    alt_text?: string;
    width?: number;
    height?: number;
    display_order?: number;
    is_active?: boolean;
}

// Kiosk Manufacturers Section Types
export interface KioskManufacturersSection {
    id: string;
    created_at: string;
    updated_at: string;
    section_heading: string;
    content_paragraph_1: string;
    content_paragraph_2: string;
    link_text?: string;
    link_url?: string;
    main_image_id?: string;
    main_image_url?: string;
    main_image_alt?: string;
    is_active: boolean;
}

// Input types for creating/updating kiosk manufacturers sections
export interface KioskManufacturersSectionInput {
    section_heading: string;
    content_paragraph_1: string;
    content_paragraph_2: string;
    link_text?: string;
    link_url?: string;
    main_image_id?: string;
    is_active?: boolean;
}

// Database function response types for manufacturers
export interface KioskManufacturersSectionData {
    id: string;
    section_heading: string;
    content_paragraph_1: string;
    content_paragraph_2: string;
    link_text?: string;
    link_url?: string;
    main_image_id?: string;
    main_image_url?: string;
    main_image_alt?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// API Response types for manufacturers
export interface KioskManufacturersResponse {
    data: KioskManufacturersSection | null;
    error?: string;
}

export interface KioskManufacturersImagesResponse {
    data: KioskManufacturersImage[];
    error?: string;
}

// Form validation types for manufacturers
export interface KioskManufacturersFormData {
    section_heading: string;
    content_paragraph_1: string;
    content_paragraph_2: string;
    link_text?: string;
    link_url?: string;
    main_image_id?: string;
}

// Admin interface types for manufacturers
export interface KioskManufacturersAdminState {
    sectionData: KioskManufacturersSectionInput;
    images: KioskManufacturersImage[];
    loading: boolean;
    saving: boolean;
    uploading: boolean;
}

// Notification types for manufacturers (reusing hero notification type)
export type KioskManufacturersNotification = KioskHeroNotification;

// Component props types for manufacturers
export interface KioskManufacturersComponentProps {
    data?: KioskManufacturersSectionData;
    loading?: boolean;
    error?: string;
}

// Admin component props types for manufacturers
export interface KioskManufacturersAdminProps {
    initialData?: KioskManufacturersSectionData;
    initialImages?: KioskManufacturersImage[];
    onSave?: (data: KioskManufacturersSectionInput) => Promise<void>;
    onImageUpload?: (file: File) => Promise<KioskManufacturersImage>;
    onImageDelete?: (imageId: string) => Promise<void>;
}

// Tab types for manufacturers admin interface
export type KioskManufacturersAdminTab = "content" | "media" | "preview";

// Preview types for manufacturers
export interface KioskManufacturersPreviewData {
    section_heading: string;
    content_paragraph_1: string;
    content_paragraph_2: string;
    link_text?: string;
    link_url?: string;
    main_image_url?: string;
    main_image_alt?: string;
    is_active: boolean;
}

// Validation types for manufacturers
export interface KioskManufacturersValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// Image upload types for manufacturers
export interface KioskManufacturersImageUpload {
    file: File;
    preview: string;
    uploading: boolean;
    progress: number;
}

// Media management types for manufacturers
export interface KioskManufacturersMediaState {
    images: KioskManufacturersImage[];
    selectedImages: string[];
    uploading: boolean;
    dragActive: boolean;
}

// ============================================================================
// KIOSK CONSULTANCY SECTION TYPES
// ============================================================================

// Kiosk Consultancy Section Types
export interface KioskConsultancySection {
    id: string;
    created_at: string;
    updated_at: string;
    section_heading: string;
    phone_number: string;
    phone_display_text: string;
    phone_href: string;
    additional_text: string;
    button_bg_color?: string;
    button_text_color?: string;
    section_bg_color?: string;
    section_text_color?: string;
    is_active: boolean;
}

// Input types for creating/updating kiosk consultancy sections
export interface KioskConsultancySectionInput {
    section_heading: string;
    phone_number: string;
    phone_display_text: string;
    phone_href: string;
    additional_text: string;
    button_bg_color?: string;
    button_text_color?: string;
    section_bg_color?: string;
    section_text_color?: string;
    is_active?: boolean;
}

// Database function response types for consultancy
export interface KioskConsultancySectionData {
    id: string;
    section_heading: string;
    phone_number: string;
    phone_display_text: string;
    phone_href: string;
    additional_text: string;
    button_bg_color?: string;
    button_text_color?: string;
    section_bg_color?: string;
    section_text_color?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// API Response types for consultancy
export interface KioskConsultancyResponse {
    data: KioskConsultancySection | null;
    error?: string;
}

// Form validation types for consultancy
export interface KioskConsultancyFormData {
    section_heading: string;
    phone_number: string;
    phone_display_text: string;
    phone_href: string;
    additional_text: string;
    button_bg_color?: string;
    button_text_color?: string;
    section_bg_color?: string;
    section_text_color?: string;
}

// Admin interface types for consultancy
export interface KioskConsultancyAdminState {
    sectionData: KioskConsultancySectionInput;
    loading: boolean;
    saving: boolean;
}

// Notification types for consultancy (reusing hero notification type)
export type KioskConsultancyNotification = KioskHeroNotification;

// Component props types for consultancy
export interface KioskConsultancyComponentProps {
    data?: KioskConsultancySectionData;
    loading?: boolean;
    error?: string;
}

// Admin component props types for consultancy
export interface KioskConsultancyAdminProps {
    initialData?: KioskConsultancySectionData;
    onSave?: (data: KioskConsultancySectionInput) => Promise<void>;
}

// Tab types for consultancy admin interface
export type KioskConsultancyAdminTab = "content" | "preview";

// Preview types for consultancy
export interface KioskConsultancyPreviewData {
    section_heading: string;
    phone_number: string;
    phone_display_text: string;
    phone_href: string;
    additional_text: string;
    button_bg_color?: string;
    button_text_color?: string;
    section_bg_color?: string;
    section_text_color?: string;
    is_active: boolean;
}

// Validation types for consultancy
export interface KioskConsultancyValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}
