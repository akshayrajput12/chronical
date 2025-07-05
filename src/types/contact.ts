// =====================================================
// CONTACT US PAGE TYPES AND INTERFACES
// =====================================================

// Base interface for database entities
export interface BaseEntity {
    id: string;
    created_at?: string;
    updated_at?: string;
}

// =====================================================
// CONTACT HERO SECTION
// =====================================================

export interface ContactHeroSection extends BaseEntity {
    title: string;
    subtitle: string;
    background_image_url: string;
    is_active: boolean;
}

export interface ContactHeroSectionInput {
    title: string;
    subtitle: string;
    background_image_url: string;
    is_active?: boolean;
}

// =====================================================
// CONTACT FORM SETTINGS
// =====================================================

export interface ContactFormSettings extends BaseEntity {
    form_title: string;
    form_subtitle?: string;
    success_message: string;
    success_description: string;
    sidebar_phone: string;
    sidebar_email: string;
    sidebar_address: string;
    enable_file_upload: boolean;
    max_file_size_mb: number;
    allowed_file_types: string[];
    require_terms_agreement: boolean;
    terms_text: string;
    is_active: boolean;
}

export interface ContactFormSettingsInput {
    form_title: string;
    form_subtitle?: string;
    success_message: string;
    success_description: string;
    sidebar_phone: string;
    sidebar_email: string;
    sidebar_address: string;
    enable_file_upload?: boolean;
    max_file_size_mb?: number;
    allowed_file_types?: string[];
    require_terms_agreement?: boolean;
    terms_text: string;
    is_active?: boolean;
}

// =====================================================
// GROUP COMPANIES
// =====================================================

export interface ContactGroupCompany extends BaseEntity {
    region: string;
    description?: string;
    address: string;
    phone: string;
    email: string;
    sort_order: number;
    is_active: boolean;
}

export interface ContactGroupCompanyInput {
    region: string;
    description?: string;
    phone: string;
    email: string;
    address: string;
    sort_order?: number;
    is_active?: boolean;
}

// For admin form compatibility
export interface ContactGroupCompanyFormInput {
    name: string;        // Maps to region
    description: string; // Maps to address
    phone: string;
    email: string;
    address: string;     // Additional address field
    display_order?: number; // Maps to sort_order
    is_active?: boolean;
}

// =====================================================
// CONTACT FORM SUBMISSIONS
// =====================================================

export type ContactFormSubmissionStatus = 'new' | 'read' | 'replied' | 'archived' | 'spam';

export interface ContactFormSubmission extends BaseEntity {
    name: string;
    exhibition_name?: string;
    company_name?: string;
    email: string;
    phone?: string;
    budget?: string; // Budget range for booth requirements
    message: string;
    attachment_url?: string;
    attachment_filename?: string;
    attachment_size?: number;
    attachment_type?: string;
    agreed_to_terms: boolean;
    status: ContactFormSubmissionStatus;
    is_spam: boolean;
    spam_score: number;
    admin_notes?: string;
    handled_by?: string;
    handled_at?: string;
    ip_address?: string;
    user_agent?: string;
    referrer?: string;
}

// =====================================================
// UNIFIED FORM SUBMISSIONS (Contact + Event)
// =====================================================

export type FormSubmissionType = 'contact' | 'event';

export interface UnifiedFormSubmission extends BaseEntity {
    // Basic fields common to both forms
    name: string;
    email: string;
    phone?: string;
    message?: string;

    // Form-specific fields
    exhibition_name?: string;
    company_name?: string;
    budget?: string; // Event form specific

    // File attachment
    attachment_url?: string;
    attachment_filename?: string;
    attachment_size?: number;
    attachment_type?: string;

    // Contact form specific
    agreed_to_terms?: boolean;

    // Status and processing
    status: ContactFormSubmissionStatus;
    is_spam: boolean;
    spam_score: number;
    admin_notes?: string;
    handled_by?: string;
    handled_at?: string;

    // Metadata
    ip_address?: string;
    user_agent?: string;
    referrer?: string;

    // Form type identification
    form_type: FormSubmissionType;

    // Event-specific data
    event_id?: string;
    event?: {
        id: string;
        title: string;
        slug: string;
    };
}

export interface ContactFormSubmissionInput {
    name: string;
    exhibition_name?: string;
    company_name?: string;
    email: string;
    phone?: string;
    budget?: string; // Budget range for booth requirements
    message: string;
    attachment_url?: string;
    attachment_filename?: string;
    attachment_size?: number;
    attachment_type?: string;
    agreed_to_terms: boolean;
}

export interface ContactFormSubmissionUpdate {
    status?: ContactFormSubmissionStatus;
    is_spam?: boolean;
    admin_notes?: string;
    handled_by?: string;
    handled_at?: string;
}

// =====================================================
// MAP AND PARKING SETTINGS
// =====================================================

export interface ContactMapSettings extends BaseEntity {
    map_embed_url: string;
    map_title: string;
    map_height: number;
    parking_title: string;
    parking_description: string;
    parking_background_image: string;
    parking_maps_download_url: string;
    google_maps_url: string;
    show_parking_section: boolean;
    show_map_section: boolean;
    is_active: boolean;
}

export interface ContactMapSettingsInput {
    map_embed_url: string;
    map_title?: string;
    map_height?: number;
    is_active: boolean;
}

// Full interface for backward compatibility with database
export interface ContactMapSettingsFullInput {
    map_embed_url: string;
    map_title: string;
    map_height?: number;
    parking_title: string;
    parking_description: string;
    parking_background_image: string;
    parking_maps_download_url: string;
    google_maps_url: string;
    show_parking_section?: boolean;
    show_map_section?: boolean;
    is_active?: boolean;
}

// =====================================================
// COMBINED CONTACT PAGE DATA
// =====================================================

export interface ContactPageData {
    hero: ContactHeroSection;
    formSettings: ContactFormSettings;
    groupCompanies: ContactGroupCompany[];
    mapSettings: ContactMapSettings;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ContactPageResponse {
    success: boolean;
    data?: ContactPageData;
    error?: string;
}

export interface ContactFormSubmissionResponse {
    success: boolean;
    data?: ContactFormSubmission;
    error?: string;
}

export interface ContactFormSubmissionsResponse {
    success: boolean;
    data?: ContactFormSubmission[];
    total?: number;
    page?: number;
    limit?: number;
    error?: string;
}

// =====================================================
// QUERY PARAMETERS
// =====================================================

export interface ContactSubmissionQueryParams {
    page?: number;
    limit?: number;
    status?: ContactFormSubmissionStatus;
    search?: string;
    start_date?: string;
    end_date?: string;
    is_spam?: boolean;
}

// =====================================================
// FORM DATA TYPES (for React components)
// =====================================================

export interface ContactFormData {
    name: string;
    exhibitionName: string;
    companyName: string;
    email: string;
    phone: string;
    message: string;
    file: File | null;
    agreedToTerms: boolean;
}

export interface ContactFormErrors {
    name?: string;
    exhibitionName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    message?: string;
    file?: string;
    agreedToTerms?: string;
    general?: string;
}

// =====================================================
// ADMIN FORM TYPES
// =====================================================

export interface ContactHeroFormData {
    title: string;
    subtitle: string;
    background_image_url: string;
    is_active: boolean;
}

export interface ContactFormSettingsFormData {
    form_title: string;
    form_subtitle: string;
    success_message: string;
    success_description: string;
    sidebar_phone: string;
    sidebar_email: string;
    sidebar_address: string;
    enable_file_upload: boolean;
    max_file_size_mb: number;
    allowed_file_types: string[];
    require_terms_agreement: boolean;
    terms_text: string;
    is_active: boolean;
}

export interface ContactGroupCompanyFormData {
    region: string;
    address: string;
    phone: string;
    email: string;
    sort_order: number;
    is_active: boolean;
}



// =====================================================
// FILE UPLOAD TYPES
// =====================================================

export interface ContactFileUpload {
    file: File;
    url?: string;
    error?: string;
    uploading?: boolean;
}

// =====================================================
// IMAGE UPLOAD TYPES
// =====================================================

export interface ContactImageUpload {
    file: File;
    url?: string;
    error?: string;
    uploading?: boolean;
    preview?: string;
}

export interface ContactImageLibrary {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
    created_at: string;
    bucket: ContactStorageBucket;
    path?: string;
    folder?: string;
}

export interface ContactImageUploadResponse {
    success: boolean;
    data?: {
        url: string;
        path: string;
        fullPath: string;
    };
    error?: string;
}

export interface ContactImageDeleteResponse {
    success: boolean;
    error?: string;
}

// =====================================================
// STORAGE BUCKET TYPES
// =====================================================

export type ContactStorageBucket = 'contact-images' | 'contact-attachments' | 'contact-admin-uploads';

export interface ContactStorageConfig {
    bucket: ContactStorageBucket;
    maxFileSize: number;
    allowedTypes: string[];
    isPublic: boolean;
}

export const CONTACT_STORAGE_CONFIGS: Record<ContactStorageBucket, ContactStorageConfig> = {
    'contact-images': {
        bucket: 'contact-images',
        maxFileSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'],
        isPublic: true
    },
    'contact-attachments': {
        bucket: 'contact-attachments',
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/jpg'
        ],
        isPublic: false
    },
    'contact-admin-uploads': {
        bucket: 'contact-admin-uploads',
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/webp',
            'image/svg+xml',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        isPublic: false
    }
};

// =====================================================
// SPAM DETECTION TYPES
// =====================================================

export interface SpamDetectionResult {
    isSpam: boolean;
    score: number;
    reasons: string[];
}

// =====================================================
// STATISTICS TYPES
// =====================================================

export interface ContactSubmissionStats {
    total: number;
    new: number;
    read: number;
    replied: number;
    archived: number;
    spam: number;
    today: number;
    this_week: number;
    this_month: number;
}

// =====================================================
// ADMIN INTERFACE TYPES
// =====================================================

export interface ContactAdminTab {
    id: string;
    label: string;
    icon?: string;
    component: React.ComponentType<any>;
}

export interface ContactAdminFormProps {
    data?: any;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    error?: string;
}

export interface ContactAdminListProps {
    data: any[];
    loading?: boolean;
    error?: string;
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAdd: () => void;
}
