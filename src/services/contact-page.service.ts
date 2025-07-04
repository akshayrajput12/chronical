import { createClient } from "@/lib/supabase/client";
import {
    ContactHeroSection,
    ContactFormSettings,
    ContactGroupCompany,
    ContactMapSettings
} from "@/types/contact";

// File upload response interface
interface FileUploadResponse {
    success: boolean;
    url?: string;
    error?: string;
}

// Types for the contact page data
export interface ContactPageData {
    hero: ContactHeroSection | null;
    formSettings: ContactFormSettings | null;
    groupCompanies: ContactGroupCompany[];
    mapSettings: ContactMapSettings | null;
}

// Default fallback data
const defaultHeroData: ContactHeroSection = {
    id: "default",
    title: "Contact Us",
    subtitle: "Get in Touch with Our Team",
    background_image_url: "",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

const defaultFormSettings: ContactFormSettings = {
    id: "default",
    form_title: "Send us a message",
    form_subtitle: "We'd love to hear from you",
    sidebar_phone: "+971 4 123 4567",
    sidebar_email: "info@chroniclesuae.com",
    sidebar_address: "Dubai, UAE",
    success_message: "Thank you for your message. We'll get back to you soon!",
    enable_file_upload: true,
    max_file_size_mb: 10,
    allowed_file_types: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
    require_terms_agreement: true,
    terms_text: "By clicking submit, you agree to our Terms and Conditions",
    success_description: "We'll get back to you soon!",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

const defaultMapSettings: ContactMapSettings = {
    id: "default",
    map_title: "Find Us",
    map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1736842!2d55.2708!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDEyJzE3LjMiTiA1NcKwMTYnMTQuOSJF!5e0!3m2!1sen!2sae!4v1234567890",
    google_maps_url: "https://maps.google.com/?q=Dubai,UAE",
    map_height: 400,
    parking_title: "Parking Information",
    parking_description: "Free parking available on-site",
    parking_background_image: "",
    parking_maps_download_url: "",
    show_parking_section: true,
    show_map_section: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

// ContactPageService class for client-side operations
export class ContactPageService {
    private supabase = createClient();

    // Upload file for form attachments
    async uploadFile(file: File): Promise<FileUploadResponse> {
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileExtension = file.name.split('.').pop();
            const fileName = `${timestamp}_${randomString}.${fileExtension}`;
            const filePath = `attachments/${fileName}`;

            // Convert file to buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);

            // Upload to Supabase storage
            const { data, error } = await this.supabase.storage
                .from('contact-attachments')
                .upload(filePath, buffer, {
                    contentType: file.type,
                    upsert: false
                });

            if (error) {
                console.error('Storage upload error:', error);
                return {
                    success: false,
                    error: 'Failed to upload file'
                };
            }

            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from('contact-attachments')
                .getPublicUrl(data.path);

            return {
                success: true,
                url: urlData.publicUrl
            };
        } catch (error) {
            console.error('File upload error:', error);
            return {
                success: false,
                error: 'Failed to upload file'
            };
        }
    }

    // Submit form data
    async submitForm(formData: any): Promise<{ success: boolean; error?: string }> {
        try {
            const { data, error } = await this.supabase
                .from('contact_form_submissions')
                .insert([formData])
                .select()
                .single();

            if (error) {
                console.error('Form submission error:', error);
                return {
                    success: false,
                    error: 'Failed to submit form'
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Form submission error:', error);
            return {
                success: false,
                error: 'Failed to submit form'
            };
        }
    }
}

// Export instance for use in components
export const contactPageService = new ContactPageService();

// Server-side data fetching functions
export async function getContactHeroData(): Promise<ContactHeroSection | null> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("contact_hero_section")
            .select("*")
            .eq("is_active", true)
            .single();

        if (error) {
            console.error("Error fetching contact hero data:", error);
            return defaultHeroData;
        }

        return data || defaultHeroData;
    } catch (error) {
        console.error("Error fetching contact hero data:", error);
        return defaultHeroData;
    }
}

export async function getContactFormSettings(): Promise<ContactFormSettings | null> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("contact_form_settings")
            .select("*")
            .eq("is_active", true)
            .single();

        if (error) {
            console.error("Error fetching contact form settings:", error);
            return defaultFormSettings;
        }

        return data || defaultFormSettings;
    } catch (error) {
        console.error("Error fetching contact form settings:", error);
        return defaultFormSettings;
    }
}

export async function getContactGroupCompanies(): Promise<ContactGroupCompany[]> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("contact_group_companies")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        if (error) {
            console.error("Error fetching contact group companies:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Error fetching contact group companies:", error);
        return [];
    }
}

export async function getContactMapSettings(): Promise<ContactMapSettings | null> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("contact_map_settings")
            .select("*")
            .eq("is_active", true)
            .single();

        if (error) {
            console.error("Error fetching contact map settings:", error);
            return defaultMapSettings;
        }

        return data || defaultMapSettings;
    } catch (error) {
        console.error("Error fetching contact map settings:", error);
        return defaultMapSettings;
    }
}

// Main function to fetch all contact page data in parallel
export async function getContactPageData(): Promise<ContactPageData> {
    try {
        const [heroData, formSettings, groupCompanies, mapSettings] = await Promise.all([
            getContactHeroData(),
            getContactFormSettings(),
            getContactGroupCompanies(),
            getContactMapSettings()
        ]);

        return {
            hero: heroData,
            formSettings: formSettings,
            groupCompanies: groupCompanies,
            mapSettings: mapSettings
        };
    } catch (error) {
        console.error("Error fetching contact page data:", error);
        // Return fallback data
        return {
            hero: defaultHeroData,
            formSettings: defaultFormSettings,
            groupCompanies: [],
            mapSettings: defaultMapSettings
        };
    }
}
