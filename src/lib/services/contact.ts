// =====================================================
// CONTACT US SERVICE LAYER
// =====================================================

import { createClient } from "@/lib/supabase/client";
import {
    ContactPageData,
    ContactHeroSection,
    ContactFormSettings,
    ContactGroupCompany,
    ContactMapSettings,
    ContactFormSubmission,
    ContactFormSubmissionInput,
    ContactSubmissionQueryParams,
    ContactSubmissionStats,
    ContactHeroSectionInput,
    ContactFormSettingsInput,
    ContactGroupCompanyInput,
    ContactMapSettingsInput,
    ContactFormSubmissionUpdate,
    ContactImageUploadResponse,
    ContactImageDeleteResponse,
    ContactImageLibrary,
    ContactStorageBucket
} from "@/types/contact";

// =====================================================
// PUBLIC CONTACT PAGE SERVICES
// =====================================================

export class ContactPageService {
    private supabase = createClient();

    // Fetch all contact page data
    async getContactPageData(): Promise<ContactPageData> {
        try {
            const [heroData, formSettingsData, groupCompaniesData, mapSettingsData] = await Promise.all([
                this.getHeroSection(),
                this.getFormSettings(),
                this.getGroupCompanies(),
                this.getMapSettings()
            ]);

            return {
                hero: heroData,
                formSettings: formSettingsData,
                groupCompanies: groupCompaniesData,
                mapSettings: mapSettingsData
            };
        } catch (error) {
            console.error("Error fetching contact page data:", error);
            throw error;
        }
    }

    // Get hero section data
    async getHeroSection(): Promise<ContactHeroSection> {
        const { data, error } = await this.supabase
            .from("contact_hero_section")
            .select("*")
            .eq("is_active", true)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data || this.getDefaultHeroSection();
    }

    // Get form settings data
    async getFormSettings(): Promise<ContactFormSettings> {
        const { data, error } = await this.supabase
            .from("contact_form_settings")
            .select("*")
            .eq("is_active", true)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data || this.getDefaultFormSettings();
    }

    // Get group companies data
    async getGroupCompanies(): Promise<ContactGroupCompany[]> {
        const { data, error } = await this.supabase
            .from("contact_group_companies")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        if (error) {
            throw error;
        }

        return data || this.getDefaultGroupCompanies();
    }

    // Get map settings data
    async getMapSettings(): Promise<ContactMapSettings> {
        const { data, error } = await this.supabase
            .from("contact_map_settings")
            .select("*")
            .eq("is_active", true)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data || this.getDefaultMapSettings();
    }

    // Submit contact form
    async submitContactForm(submission: ContactFormSubmissionInput): Promise<ContactFormSubmission> {
        const response = await fetch('/api/contact/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submission),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to submit contact form');
        }

        return result.data;
    }

    // Default data fallbacks
    private getDefaultHeroSection(): ContactHeroSection {
        return {
            id: "default",
            title: "Contact Us",
            subtitle: "Our team is standing by to answer your questions and direct you to the expertise you need for your next event",
            background_image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    private getDefaultFormSettings(): ContactFormSettings {
        return {
            id: "default",
            form_title: "Feel Free To Write",
            form_subtitle: "",
            success_message: "Thank You for Your Message!",
            success_description: "We've received your inquiry and will get back to you within 24 hours.",
            sidebar_phone: "+971 54 347 4645",
            sidebar_email: "info@chronicleexhibts.ae",
            sidebar_address: "Al Qouz Industrial Area 1st. No. 5B, Warehouse 14 P.O. Box 128046, Dubai – UAE",
            enable_file_upload: true,
            max_file_size_mb: 10,
            allowed_file_types: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
            require_terms_agreement: true,
            terms_text: "By clicking submit, you agree to our Terms and Conditions",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    private getDefaultGroupCompanies(): ContactGroupCompany[] {
        return [
            {
                id: "default-1",
                region: "Europe",
                description: "European operations and services",
                address: "Zum see 7, 14542 Werder (Havel), Germany",
                phone: "+49 (0) 33 2774 99-100",
                email: "enquiry@triumfo.de",
                sort_order: 1,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: "default-2",
                region: "United States",
                description: "North American operations and services",
                address: "2782 Abels Ln, Las Vegas, NV 89115, USA",
                phone: "+1 702 992 0440",
                email: "enquiry@triumfo.us",
                sort_order: 2,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: "default-3",
                region: "India",
                description: "Indian operations and services",
                address: "A-65 Sector-83, Phase II, Noida – 201305, India",
                phone: "+91-0120-4690699",
                email: "enquiry@triumfo.in",
                sort_order: 3,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
    }

    private getDefaultMapSettings(): ContactMapSettings {
        return {
            id: "default",
            map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5139890547107!2d55.38061577600814!3d25.28692967765328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f42e5a9ddaf97%3A0x563a582dbda7f14c!2sChronicle%20Exhibition%20Organizing%20L.L.C%20%7C%20Exhibition%20Stand%20Builder%20in%20Dubai%2C%20UAE%20-%20Middle%20East!5e0!3m2!1sen!2sin!4v1750325309116!5m2!1sen!2sin",
            map_title: "Dubai World Trade Centre Location",
            map_height: 400,
            parking_title: "On-site parking at Dubai World Trade Centre",
            parking_description: "PLAN YOUR ARRIVAL BY EXPLORING OUR USEFUL PARKING AND ACCESSIBILITY MAPS.",
            parking_background_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            parking_maps_download_url: "#",
            google_maps_url: "https://maps.google.com",
            show_parking_section: true,
            show_map_section: true,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
}

// =====================================================
// ADMIN CONTACT SERVICES
// =====================================================

export class ContactAdminService {
    private supabase = createClient();

    // For admin operations, we'll use API routes that have service role access

    // ===== FORM SUBMISSIONS MANAGEMENT =====

    // Get form submissions with filtering and pagination
    async getFormSubmissions(params: ContactSubmissionQueryParams = {}): Promise<{
        submissions: ContactFormSubmission[];
        total: number;
        page: number;
        limit: number;
    }> {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.status) queryParams.append('status', params.status);
        if (params.search) queryParams.append('search', params.search);
        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);
        if (params.is_spam !== undefined) queryParams.append('is_spam', params.is_spam.toString());

        const response = await fetch(`/api/contact/submissions?${queryParams.toString()}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch form submissions');
        }

        return {
            submissions: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit
        };
    }

    // Get single form submission
    async getFormSubmission(id: string): Promise<ContactFormSubmission> {
        const response = await fetch(`/api/contact/submissions/${id}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch form submission');
        }

        return result.data;
    }

    // Update form submission
    async updateFormSubmission(id: string, updates: ContactFormSubmissionUpdate): Promise<ContactFormSubmission> {
        const response = await fetch(`/api/contact/submissions/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to update form submission');
        }

        return result.data;
    }

    // Delete form submission
    async deleteFormSubmission(id: string): Promise<void> {
        const response = await fetch(`/api/contact/submissions/${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to delete form submission');
        }
    }

    // Get submission statistics
    async getSubmissionStats(): Promise<ContactSubmissionStats> {
        // Use API route for admin operations
        const response = await fetch('/api/contact/submissions/stats');
        if (!response.ok) {
            throw new Error('Failed to fetch submission stats');
        }
        return await response.json();
    }

    // =====================================================
    // IMAGE MANAGEMENT METHODS
    // =====================================================

    // Upload image to contact storage
    async uploadImage(
        file: File,
        bucket: ContactStorageBucket = 'contact-images',
        folder: string = ''
    ): Promise<ContactImageUploadResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucket', bucket);
            if (folder) formData.append('folder', folder);

            const response = await fetch('/api/contact/images/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Image upload error:', error);
            return {
                success: false,
                error: 'Failed to upload image'
            };
        }
    }

    // Delete image from contact storage
    async deleteImage(bucket: ContactStorageBucket, filePath: string): Promise<ContactImageDeleteResponse> {
        try {
            const response = await fetch(`/api/contact/images/delete?bucket=${bucket}&path=${encodeURIComponent(filePath)}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Image delete error:', error);
            return {
                success: false,
                error: 'Failed to delete image'
            };
        }
    }

    // Get image library data
    async getImageLibraryData(
        bucket: ContactStorageBucket = 'contact-images',
        folder: string = '',
        limit: number = 50,
        offset: number = 0
    ): Promise<{ success: boolean; data?: ContactImageLibrary[]; error?: string }> {
        try {
            const params = new URLSearchParams({
                bucket,
                folder,
                limit: limit.toString(),
                offset: offset.toString()
            });

            const response = await fetch(`/api/contact/images/library?${params}`);
            const result = await response.json();

            if (result.success) {
                return {
                    success: true,
                    data: result.data
                };
            } else {
                return {
                    success: false,
                    error: result.error || 'Failed to fetch image library'
                };
            }
        } catch (error) {
            console.error('Image library error:', error);
            return {
                success: false,
                error: 'Failed to fetch image library'
            };
        }
    }

    // Helper method to extract file path from URL
    extractFilePathFromUrl(url: string, bucket: ContactStorageBucket): string | null {
        try {
            const bucketPath = `/storage/v1/object/public/${bucket}/`;
            const index = url.indexOf(bucketPath);
            if (index !== -1) {
                return url.substring(index + bucketPath.length);
            }
            return null;
        } catch (error) {
            console.error('Error extracting file path:', error);
            return null;
        }
    }

    // =====================================================
    // MISSING METHODS FOR ADMIN COMPONENTS
    // =====================================================

    // Group Companies Management
    async getGroupCompanies(): Promise<ContactGroupCompany[]> {
        try {
            const response = await fetch('/api/contact/companies');
            const result = await response.json();

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to fetch companies');
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            throw error;
        }
    }

    // Helper function to convert form data to database format
    private mapFormToDatabase(formData: any): ContactGroupCompanyInput {
        return {
            region: formData.name || formData.region,
            description: formData.description,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            sort_order: formData.display_order || formData.sort_order,
            is_active: formData.is_active
        };
    }

    async createGroupCompany(company: any): Promise<ContactGroupCompany> {
        try {
            const mappedData = this.mapFormToDatabase(company);

            const response = await fetch('/api/contact/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mappedData),
            });

            const result = await response.json();

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to create company');
            }
        } catch (error) {
            console.error('Error creating company:', error);
            throw error;
        }
    }

    async updateGroupCompany(id: string, updates: any): Promise<ContactGroupCompany> {
        try {
            const mappedData = this.mapFormToDatabase(updates);

            const response = await fetch(`/api/contact/companies/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mappedData),
            });

            const result = await response.json();

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to update company');
            }
        } catch (error) {
            console.error('Error updating company:', error);
            throw error;
        }
    }

    async deleteGroupCompany(id: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/contact/companies/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                return true;
            } else {
                throw new Error(result.error || 'Failed to delete company');
            }
        } catch (error) {
            console.error('Error deleting company:', error);
            throw error;
        }
    }

    // Hero Section Management
    async getHeroSection(): Promise<ContactHeroSection | null> {
        try {
            const response = await fetch('/api/contact/hero');
            const result = await response.json();

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to fetch hero section');
            }
        } catch (error) {
            console.error('Error fetching hero section:', error);
            throw error;
        }
    }

    async createHeroSection(hero: ContactHeroSectionInput): Promise<ContactHeroSection> {
        try {
            const response = await fetch('/api/contact/hero', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(hero),
            });

            const result = await response.json();

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to create hero section');
            }
        } catch (error) {
            console.error('Error creating hero section:', error);
            throw error;
        }
    }

    async updateHeroSection(id: string, updates: Partial<ContactHeroSectionInput>): Promise<ContactHeroSection> {
        try {
            const response = await fetch('/api/contact/hero', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, ...updates }),
            });

            const result = await response.json();

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to update hero section');
            }
        } catch (error) {
            console.error('Error updating hero section:', error);
            throw error;
        }
    }

    // Form Settings Management
    async getFormSettings(): Promise<ContactFormSettings | null> {
        const { data, error } = await this.supabase
            .from("contact_form_settings")
            .select("*")
            .eq("is_active", true)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
            throw error;
        }

        return data || null;
    }

    async createFormSettings(settings: ContactFormSettingsInput): Promise<ContactFormSettings> {
        const { data, error } = await this.supabase
            .from("contact_form_settings")
            .insert(settings)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async updateFormSettings(id: string, updates: Partial<ContactFormSettingsInput>): Promise<ContactFormSettings> {
        const { data, error } = await this.supabase
            .from("contact_form_settings")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    // Map Settings Management
    async getMapSettings(): Promise<ContactMapSettings | null> {
        try {
            const response = await fetch('/api/contact/map', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching map settings:', error);
            throw error;
        }
    }

    async createMapSettings(settings: ContactMapSettingsInput): Promise<ContactMapSettings> {
        try {
            const response = await fetch('/api/contact/map', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating map settings:', error);
            throw error;
        }
    }

    async updateMapSettings(id: string, updates: Partial<ContactMapSettingsInput>): Promise<ContactMapSettings> {
        try {
            const response = await fetch('/api/contact/map', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, ...updates }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating map settings:', error);
            throw error;
        }
    }

    // Submissions Management (simplified methods for components)
    async getSubmissions(): Promise<ContactFormSubmission[]> {
        const response = await fetch('/api/contact/submissions');
        if (!response.ok) {
            throw new Error('Failed to fetch submissions');
        }
        const result = await response.json();
        return result.data || [];
    }

    async updateSubmissionStatus(id: string, status: string): Promise<boolean> {
        const response = await fetch(`/api/contact/submissions/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update submission status');
        }

        return true;
    }

    async deleteSubmission(id: string): Promise<boolean> {
        const response = await fetch(`/api/contact/submissions/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete submission');
        }

        return true;
    }

    async sendReply(submissionId: string, message: string): Promise<boolean> {
        // This would typically integrate with an email service
        // For now, we'll just update the submission status to 'replied'
        const response = await fetch(`/api/contact/submissions/${submissionId}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Failed to send reply');
        }

        return true;
    }

    // Image Library Management (wrapper for existing method)
    async getImageLibrary(): Promise<ContactImageLibrary[]> {
        try {
            const result = await this.getImageLibraryData('contact-images', '', 100, 0);
            if (result.success && result.data) {
                return result.data;
            }
            throw new Error(result.error || 'Failed to fetch image library');
        } catch (error) {
            console.error('Error in getImageLibrary:', error);
            throw new Error('Failed to fetch image library');
        }
    }
}

// Export service instances
export const contactPageService = new ContactPageService();
export const contactAdminService = new ContactAdminService();
