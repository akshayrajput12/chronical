// About Section Types for Chronicle Exhibits Website
// This file contains TypeScript interfaces for all about-related components

// ============================================================================
// ABOUT HERO SECTION TYPES
// ============================================================================

// About Hero Image Types
interface AboutHeroImage {
    id: string;
    created_at: string;
    updated_at: string;
    file_name: string;
    file_path: string;
    file_url?: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    width?: number;
    height?: number;
    display_order: number;
    is_active: boolean;
}

// Input types for creating/updating about hero images
interface AboutHeroImageInput {
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    width?: number;
    height?: number;
    display_order?: number;
    is_active?: boolean;
}

// About Hero Section Types
interface AboutHeroSection {
    id: string;
    created_at: string;
    updated_at: string;
    hero_heading: string;
    hero_subheading: string;
    background_image_id?: string;
    background_image_url?: string;
    background_image_alt?: string;
    fallback_image_url?: string;
    overlay_opacity: number;
    overlay_color: string;
    text_color: string;
    height_class: string;
    show_scroll_indicator: boolean;
    is_active: boolean;
}

// Input types for creating/updating about hero sections
interface AboutHeroSectionInput {
    hero_heading: string;
    hero_subheading: string;
    background_image_id?: string;
    fallback_image_url?: string;
    overlay_opacity?: number;
    overlay_color?: string;
    text_color?: string;
    height_class?: string;
    show_scroll_indicator?: boolean;
    is_active?: boolean;
}

// Database function response types for about hero
interface AboutHeroSectionData {
    id: string;
    hero_heading: string;
    hero_subheading: string;
    background_image_id?: string;
    background_image_url?: string;
    background_image_alt?: string;
    fallback_image_url?: string;
    overlay_opacity: number;
    overlay_color: string;
    text_color: string;
    height_class: string;
    show_scroll_indicator: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// API Response types for about hero
interface AboutHeroResponse {
    data: AboutHeroSection | null;
    error?: string;
}

interface AboutHeroImagesResponse {
    data: AboutHeroImage[] | null;
    error?: string;
}

// Form validation types for about hero
interface AboutHeroFormData {
    hero_heading: string;
    hero_subheading: string;
    background_image_id?: string;
    fallback_image_url?: string;
    overlay_opacity: number;
    overlay_color: string;
    text_color: string;
    height_class: string;
    show_scroll_indicator: boolean;
}

// Admin interface types for about hero
interface AboutHeroAdminState {
    sectionData: AboutHeroSectionInput;
    images: AboutHeroImage[];
    loading: boolean;
    saving: boolean;
    uploading: boolean;
}

// Notification types for about hero
interface AboutHeroNotification {
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
}

// Component props types for about hero
interface AboutHeroComponentProps {
    data?: AboutHeroSectionData;
    loading?: boolean;
    error?: string;
}

// Admin component props types for about hero
interface AboutHeroAdminProps {
    initialData?: AboutHeroSectionData;
    initialImages?: AboutHeroImage[];
    onSave?: (data: AboutHeroSectionInput) => Promise<void>;
    onImageUpload?: (files: FileList) => Promise<void>;
    onImageDelete?: (imageId: string) => Promise<void>;
}

// Tab types for about hero admin interface
type AboutHeroAdminTab = "content" | "media" | "preview";

// Preview types for about hero
interface AboutHeroPreviewData {
    hero_heading: string;
    hero_subheading: string;
    background_image_url?: string;
    background_image_alt?: string;
    fallback_image_url?: string;
    overlay_opacity: number;
    overlay_color: string;
    text_color: string;
    height_class: string;
    show_scroll_indicator: boolean;
    is_active: boolean;
}

// Validation types for about hero
interface AboutHeroValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// Image upload types for about hero
interface AboutHeroImageUpload {
    file: File;
    preview: string;
    progress: number;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
}

// Media management types for about hero
interface AboutHeroMediaState {
    images: AboutHeroImage[];
    selectedImages: string[];
    uploading: boolean;
    dragActive: boolean;
}

// Height class options for about hero
type AboutHeroHeightClass =
    | "h-screen"
    | "h-[100vh]"
    | "h-[90vh]"
    | "h-[80vh]"
    | "h-[70vh]"
    | "h-[60vh]"
    | "h-[50vh]";

// Color options for about hero
interface AboutHeroColorOption {
    name: string;
    value: string;
    preview: string;
}

// Overlay opacity options for about hero
interface AboutHeroOpacityOption {
    name: string;
    value: number;
    description: string;
}

// ============================================================================
// ABOUT DEDICATION SECTION TYPES
// ============================================================================

// About Dedication Image Types
interface AboutDedicationImage {
    id: string;
    created_at: string;
    updated_at: string;
    file_name: string;
    file_path: string;
    file_url?: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    width?: number;
    height?: number;
    display_order: number;
    is_active: boolean;
}

// Input types for creating/updating about dedication images
interface AboutDedicationImageInput {
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    width?: number;
    height?: number;
    display_order?: number;
    is_active?: boolean;
}

// About Dedication Section Types
interface AboutDedicationSection {
    id: string;
    created_at: string;
    updated_at: string;
    section_heading: string;
    section_description?: string;
    is_active: boolean;
}

// Input types for creating/updating about dedication sections
interface AboutDedicationSectionInput {
    section_heading: string;
    section_description?: string;
    is_active?: boolean;
}

// About Dedication Item Types
interface AboutDedicationItem {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    description: string;
    image_id?: string;
    image_url?: string;
    image_alt?: string;
    fallback_image_url?: string;
    display_order: number;
    is_active: boolean;
    section_id: string;
}

// Input types for creating/updating about dedication items
interface AboutDedicationItemInput {
    title: string;
    description: string;
    image_id?: string;
    fallback_image_url?: string;
    display_order?: number;
    is_active?: boolean;
    section_id: string;
}

// Database function response types for dedication
interface AboutDedicationSectionData {
    id: string;
    section_heading: string;
    section_description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface AboutDedicationItemData {
    id: string;
    title: string;
    description: string;
    image_id?: string;
    image_url?: string;
    image_alt?: string;
    fallback_image_url?: string;
    display_order: number;
    is_active: boolean;
    section_id: string;
    created_at: string;
    updated_at: string;
}

// API Response types for dedication
interface AboutDedicationResponse {
    data: AboutDedicationSection | null;
    error?: string;
}

interface AboutDedicationItemsResponse {
    data: AboutDedicationItem[] | null;
    error?: string;
}

interface AboutDedicationImagesResponse {
    data: AboutDedicationImage[] | null;
    error?: string;
}

// Form validation types for dedication
interface AboutDedicationFormData {
    section_heading: string;
    section_description?: string;
    items: AboutDedicationItemInput[];
}

// Admin interface types for dedication
interface AboutDedicationAdminState {
    sectionData: AboutDedicationSectionInput;
    items: AboutDedicationItem[];
    images: AboutDedicationImage[];
    loading: boolean;
    saving: boolean;
    uploading: boolean;
}

// Notification types for dedication (reusing hero notification type)
type AboutDedicationNotification = AboutHeroNotification;

// Component props types for dedication
interface AboutDedicationComponentProps {
    sectionData?: AboutDedicationSectionData;
    items?: AboutDedicationItemData[];
    loading?: boolean;
    error?: string;
}

// Admin component props types for dedication
interface AboutDedicationAdminProps {
    initialSectionData?: AboutDedicationSectionData;
    initialItems?: AboutDedicationItem[];
    initialImages?: AboutDedicationImage[];
    onSave?: (
        data: AboutDedicationSectionInput,
        items: AboutDedicationItemInput[],
    ) => Promise<void>;
    onImageUpload?: (files: FileList) => Promise<void>;
    onImageDelete?: (imageId: string) => Promise<void>;
}

// Tab types for dedication admin interface
type AboutDedicationAdminTab = "content" | "media" | "preview";

// Preview types for dedication
interface AboutDedicationPreviewData {
    section_heading: string;
    section_description?: string;
    items: AboutDedicationItemData[];
    is_active: boolean;
}

// Validation types for dedication
interface AboutDedicationValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// Image upload types for dedication
interface AboutDedicationImageUpload {
    file: File;
    preview: string;
    progress: number;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
}

// Media management types for dedication
interface AboutDedicationMediaState {
    images: AboutDedicationImage[];
    selectedImages: string[];
    uploading: boolean;
    dragActive: boolean;
}

// ============================================================================
// ABOUT MAIN SECTION TYPES
// ============================================================================

// About Main Image Types
interface AboutMainImage {
    id: string;
    created_at: string;
    updated_at: string;
    file_name: string;
    file_path: string;
    file_url?: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    width?: number;
    height?: number;
    display_order: number;
    is_active: boolean;
}

// Input types for creating/updating about main images
interface AboutMainImageInput {
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    width?: number;
    height?: number;
    display_order?: number;
    is_active?: boolean;
}

// About Main Section Types
interface AboutMainSection {
    id: string;
    created_at: string;
    updated_at: string;
    section_label: string;
    main_heading: string;
    description: string;
    cta_text: string;
    cta_url: string;
    video_url?: string;
    video_title?: string;
    logo_image_id?: string;
    logo_image_url?: string;
    logo_image_alt?: string;
    logo_fallback_url?: string;
    esc_main_text: string;
    esc_sub_text: string;
    primary_color: string;
    secondary_color: string;
    is_active: boolean;
}

// Input types for creating/updating about main sections
interface AboutMainSectionInput {
    section_label: string;
    main_heading: string;
    description: string;
    cta_text: string;
    cta_url: string;
    video_url?: string;
    video_title?: string;
    logo_image_id?: string;
    logo_fallback_url?: string;
    esc_main_text: string;
    esc_sub_text: string;
    primary_color?: string;
    secondary_color?: string;
    is_active?: boolean;
}

// Database function response types for main
interface AboutMainSectionData {
    id: string;
    section_label: string;
    main_heading: string;
    description: string;
    cta_text: string;
    cta_url: string;
    video_url?: string;
    video_title?: string;
    logo_image_id?: string;
    logo_image_url?: string;
    logo_image_alt?: string;
    logo_fallback_url?: string;
    esc_main_text: string;
    esc_sub_text: string;
    primary_color: string;
    secondary_color: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// API Response types for main
interface AboutMainResponse {
    data: AboutMainSection | null;
    error?: string;
}

interface AboutMainImagesResponse {
    data: AboutMainImage[] | null;
    error?: string;
}

// Form validation types for main
interface AboutMainFormData {
    section_label: string;
    main_heading: string;
    description: string;
    cta_text: string;
    cta_url: string;
    video_url?: string;
    video_title?: string;
    logo_image_id?: string;
    logo_fallback_url?: string;
    esc_main_text: string;
    esc_sub_text: string;
    primary_color: string;
    secondary_color: string;
}

// Admin interface types for main
interface AboutMainAdminState {
    sectionData: AboutMainSectionInput;
    images: AboutMainImage[];
    loading: boolean;
    saving: boolean;
    uploading: boolean;
}

// Notification types for main (reusing hero notification type)
type AboutMainNotification = AboutHeroNotification;

// Component props types for main
interface AboutMainComponentProps {
    sectionData?: AboutMainSectionData;
    loading?: boolean;
    error?: string;
}

// Admin component props types for main
interface AboutMainAdminProps {
    initialSectionData?: AboutMainSectionData;
    initialImages?: AboutMainImage[];
    onSave?: (data: AboutMainSectionInput) => Promise<void>;
    onImageUpload?: (files: FileList) => Promise<void>;
    onImageDelete?: (imageId: string) => Promise<void>;
}

// Tab types for main admin interface
type AboutMainAdminTab = "content" | "media" | "preview";

// Preview types for main
interface AboutMainPreviewData {
    section_label: string;
    main_heading: string;
    description: string;
    cta_text: string;
    cta_url: string;
    video_url?: string;
    video_title?: string;
    logo_image_url?: string;
    logo_fallback_url?: string;
    esc_main_text: string;
    esc_sub_text: string;
    primary_color: string;
    secondary_color: string;
    is_active: boolean;
}

// Validation types for main
interface AboutMainValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// Image upload types for main
interface AboutMainImageUpload {
    file: File;
    preview: string;
    progress: number;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
}

// Media management types for main
interface AboutMainMediaState {
    images: AboutMainImage[];
    selectedImages: string[];
    uploading: boolean;
    dragActive: boolean;
}

// Color option types for main
interface AboutMainColorOption {
    label: string;
    value: string;
    preview: string;
}

// ============================================================================
// ABOUT DESCRIPTION SECTION TYPES
// ============================================================================

// About Description Image Types
interface AboutDescriptionImage {
    id: string;
    created_at: string;
    updated_at: string;
    file_name: string;
    file_path: string;
    file_url?: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    width?: number;
    height?: number;
    display_order: number;
    is_active: boolean;
}

// Input types for creating/updating about description images
interface AboutDescriptionImageInput {
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text?: string;
    width?: number;
    height?: number;
    display_order?: number;
    is_active?: boolean;
}

// About Description Section Types
interface AboutDescriptionSection {
    id: string;
    created_at: string;
    updated_at: string;
    section_heading: string;
    section_description: string;
    background_color: string;
    service_1_title: string;
    service_1_icon_url: string;
    service_1_description: string;
    service_2_title: string;
    service_2_icon_url: string;
    service_2_description: string;
    service_3_title: string;
    service_3_icon_url: string;
    service_3_description: string;
    is_active: boolean;
}

// Input types for creating/updating about description sections
interface AboutDescriptionSectionInput {
    section_heading: string;
    section_description: string;
    background_color?: string;
    service_1_title: string;
    service_1_icon_url: string;
    service_1_description?: string;
    service_2_title: string;
    service_2_icon_url: string;
    service_2_description?: string;
    service_3_title: string;
    service_3_icon_url: string;
    service_3_description?: string;
    is_active?: boolean;
}

// Database function response types for description
interface AboutDescriptionSectionData {
    id: string;
    section_heading: string;
    section_description: string;
    background_color: string;
    service_1_title: string;
    service_1_icon_url: string;
    service_1_description: string;
    service_2_title: string;
    service_2_icon_url: string;
    service_2_description: string;
    service_3_title: string;
    service_3_icon_url: string;
    service_3_description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// API Response types for description
interface AboutDescriptionResponse {
    data: AboutDescriptionSection | null;
    error?: string;
}

interface AboutDescriptionImagesResponse {
    data: AboutDescriptionImage[] | null;
    error?: string;
}

// Form validation types for description
interface AboutDescriptionFormData {
    section_heading: string;
    section_description: string;
    background_color: string;
    service_1_title: string;
    service_1_icon_url: string;
    service_1_description: string;
    service_2_title: string;
    service_2_icon_url: string;
    service_2_description: string;
    service_3_title: string;
    service_3_icon_url: string;
    service_3_description: string;
}

// Admin interface types for description
interface AboutDescriptionAdminState {
    sectionData: AboutDescriptionSectionInput;
    images: AboutDescriptionImage[];
    loading: boolean;
    saving: boolean;
    uploading: boolean;
}

// Notification types for description (reusing hero notification type)
type AboutDescriptionNotification = AboutHeroNotification;

// Component props types for description
interface AboutDescriptionComponentProps {
    sectionData?: AboutDescriptionSectionData;
    loading?: boolean;
    error?: string;
}

// Admin component props types for description
interface AboutDescriptionAdminProps {
    initialSectionData?: AboutDescriptionSectionData;
    initialImages?: AboutDescriptionImage[];
    onSave?: (data: AboutDescriptionSectionInput) => Promise<void>;
    onImageUpload?: (files: FileList) => Promise<void>;
    onImageDelete?: (imageId: string) => Promise<void>;
}

// Tab types for description admin interface
type AboutDescriptionAdminTab = "content" | "media" | "preview";

// Preview types for description
interface AboutDescriptionPreviewData {
    section_heading: string;
    section_description: string;
    background_color: string;
    service_1_title: string;
    service_1_icon_url: string;
    service_1_description: string;
    service_2_title: string;
    service_2_icon_url: string;
    service_2_description: string;
    service_3_title: string;
    service_3_icon_url: string;
    service_3_description: string;
    is_active: boolean;
}

// Validation types for description
interface AboutDescriptionValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// Image upload types for description
interface AboutDescriptionImageUpload {
    file: File;
    preview: string;
    progress: number;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
}

// Media management types for description
interface AboutDescriptionMediaState {
    images: AboutDescriptionImage[];
    selectedImages: string[];
    uploading: boolean;
    dragActive: boolean;
}

// Service item type for description
interface AboutDescriptionService {
    title: string;
    icon_url: string;
    description: string;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
    // Hero image types
    AboutHeroImage,
    AboutHeroImageInput,
    // Hero section types
    AboutHeroSection,
    AboutHeroSectionInput,
    AboutHeroSectionData,
    // Response types
    AboutHeroResponse,
    AboutHeroImagesResponse,
    // Form and validation types
    AboutHeroFormData,
    AboutHeroValidationResult,
    // Admin types
    AboutHeroAdminState,
    AboutHeroNotification,
    AboutHeroAdminProps,
    AboutHeroAdminTab,
    // Component types
    AboutHeroComponentProps,
    AboutHeroPreviewData,
    // Media management types
    AboutHeroImageUpload,
    AboutHeroMediaState,
    // Option types
    AboutHeroHeightClass,
    AboutHeroColorOption,
    AboutHeroOpacityOption,
    // Dedication types
    AboutDedicationImage,
    AboutDedicationImageInput,
    AboutDedicationSection,
    AboutDedicationSectionInput,
    AboutDedicationItem,
    AboutDedicationItemInput,
    AboutDedicationSectionData,
    AboutDedicationItemData,
    AboutDedicationResponse,
    AboutDedicationItemsResponse,
    AboutDedicationImagesResponse,
    AboutDedicationFormData,
    AboutDedicationAdminState,
    AboutDedicationNotification,
    AboutDedicationComponentProps,
    AboutDedicationAdminProps,
    AboutDedicationAdminTab,
    AboutDedicationPreviewData,
    AboutDedicationValidationResult,
    AboutDedicationImageUpload,
    AboutDedicationMediaState,
    // Main types
    AboutMainImage,
    AboutMainImageInput,
    AboutMainSection,
    AboutMainSectionInput,
    AboutMainSectionData,
    AboutMainResponse,
    AboutMainImagesResponse,
    AboutMainFormData,
    AboutMainAdminState,
    AboutMainNotification,
    AboutMainComponentProps,
    AboutMainAdminProps,
    AboutMainAdminTab,
    AboutMainPreviewData,
    AboutMainValidationResult,
    AboutMainImageUpload,
    AboutMainMediaState,
    AboutMainColorOption,
    // Description types
    AboutDescriptionImage,
    AboutDescriptionImageInput,
    AboutDescriptionSection,
    AboutDescriptionSectionInput,
    AboutDescriptionSectionData,
    AboutDescriptionResponse,
    AboutDescriptionImagesResponse,
    AboutDescriptionFormData,
    AboutDescriptionAdminState,
    AboutDescriptionNotification,
    AboutDescriptionComponentProps,
    AboutDescriptionAdminProps,
    AboutDescriptionAdminTab,
    AboutDescriptionPreviewData,
    AboutDescriptionValidationResult,
    AboutDescriptionImageUpload,
    AboutDescriptionMediaState,
    AboutDescriptionService,
};
