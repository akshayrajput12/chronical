// Privacy Policy Types and Interfaces
// This file contains all TypeScript interfaces for the privacy policy system

export interface PrivacyPolicy {
    id: string;
    created_at: string;
    updated_at: string;

    // Content fields
    title: string;
    content: string;

    // SEO fields
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;

    // Open Graph fields
    og_title?: string;
    og_description?: string;
    og_image_url?: string;

    // Status
    is_active: boolean;

    // Contact information
    contact_email: string;

    // Version tracking
    version: number;
    last_updated_by?: string;
}

// Form data interface for admin
export interface PrivacyPolicyFormData {
    title: string;
    content: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    og_title: string;
    og_description: string;
    og_image_url: string;
    contact_email: string;
    is_active: boolean;
}

// API request interfaces
export interface UpdatePrivacyPolicyRequest {
    title: string;
    content: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image_url?: string;
    contact_email: string;
    is_active?: boolean;
}

// API response interfaces
export interface PrivacyPolicyResponse {
    success: boolean;
    data?: PrivacyPolicy;
    error?: string;
}

export interface PrivacyPolicyListResponse {
    success: boolean;
    data?: PrivacyPolicy[];
    error?: string;
}

// Service interfaces
export interface PrivacyPolicyService {
    getActivePrivacyPolicy(): Promise<PrivacyPolicy | null>;
    updatePrivacyPolicy(data: UpdatePrivacyPolicyRequest): Promise<PrivacyPolicy>;
    getAllPrivacyPolicies(): Promise<PrivacyPolicy[]>;
}

// Component props interfaces
export interface PrivacyPolicyPageProps {
    privacyPolicy: PrivacyPolicy;
}

export interface PrivacyPolicyAdminProps {
    initialData?: PrivacyPolicy;
}

// Default values
export const defaultPrivacyPolicyFormData: PrivacyPolicyFormData = {
    title: 'Privacy Policy',
    content: '',
    meta_title: 'Privacy Policy - Chronicle Exhibits LLC',
    meta_description: 'Learn about how Chronicle Exhibits LLC protects your privacy and handles your personal information.',
    meta_keywords: 'privacy policy, data protection, personal information, Chronicle Exhibits',
    og_title: 'Privacy Policy - Chronicle Exhibits LLC',
    og_description: 'Learn about how Chronicle Exhibits LLC protects your privacy and handles your personal information.',
    og_image_url: '',
    contact_email: 'info@chroniclesexhibits.com',
    is_active: true,
};

// Validation helpers
export const validatePrivacyPolicyData = (data: Partial<PrivacyPolicyFormData>): string[] => {
    const errors: string[] = [];

    if (!data.title?.trim()) {
        errors.push('Title is required');
    }

    if (!data.content?.trim()) {
        errors.push('Content is required');
    }

    if (!data.contact_email?.trim()) {
        errors.push('Contact email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
        errors.push('Contact email must be a valid email address');
    }

    return errors;
};

// Utility functions
export const createPrivacyPolicySlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export const formatPrivacyPolicyDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Constants
export const PRIVACY_POLICY_CONSTANTS = {
    MAX_TITLE_LENGTH: 255,
    MAX_META_DESCRIPTION_LENGTH: 160,
    MAX_CONTENT_LENGTH: 50000,
    DEFAULT_CONTACT_EMAIL: 'info@chroniclesexhibits.com',
    STORAGE_BUCKET: 'privacy-policy-images',
} as const;
