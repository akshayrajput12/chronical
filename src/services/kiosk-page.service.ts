import { createClient } from "@/lib/supabase/client";

// Types for kiosk page data
export interface KioskHeroSection {
    id: string;
    heading: string;
    background_image_url: string;
    background_image_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    image_file_path?: string;
}

export interface KioskContentSection {
    id: string;
    first_section_heading: string;
    first_section_content: string;
    first_section_highlight_text: string;
    second_section_heading: string;
    second_section_paragraph_1: string;
    second_section_paragraph_2: string;
    main_image_id?: string;
    main_image_url: string;
    main_image_alt: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    image_file_path?: string;
}

export interface KioskBenefit {
    id: string;
    title: string;
    description: string;
    icon_name: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface KioskBenefitsSection {
    id: string;
    section_heading: string;
    section_description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface KioskManufacturersSection {
    id: string;
    section_heading: string;
    content_paragraph_1: string;
    content_paragraph_2: string;
    link_text: string;
    link_url: string;
    main_image_id?: string;
    main_image_url: string;
    main_image_alt: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Interface for kiosk page data
export interface KioskPageData {
    hero: KioskHeroSection | null;
    content: KioskContentSection | null;
    benefitsSection: KioskBenefitsSection | null;
    benefits: KioskBenefit[];
    manufacturers: KioskManufacturersSection | null;
}

/**
 * Fetch all kiosk page data in one call
 * This replaces multiple useEffect calls across kiosk components
 */
export async function getKioskPageData(): Promise<KioskPageData> {
    try {
        const supabase = await createClient();
        
        // Fetch all data in parallel for better performance
        const [
            heroResult,
            contentResult,
            benefitsSectionResult,
            benefitsResult,
            manufacturersResult
        ] = await Promise.all([
            supabase.rpc("get_kiosk_hero_section_with_image"),
            supabase.rpc("get_kiosk_content_section_with_image"),
            supabase.rpc("get_kiosk_benefits_section"),
            supabase
                .from("kiosk_benefits")
                .select("*")
                .eq("is_active", true)
                .order("display_order"),
            supabase.rpc("get_kiosk_manufacturers_section")
        ]);

        // Process hero data
        let heroData: KioskHeroSection | null = null;
        if (heroResult.data && heroResult.data.length > 0) {
            const hero = heroResult.data[0];
            // Get public URL for image if file path exists
            let finalImageUrl = hero.background_image_url;
            if (hero.image_file_path) {
                const { data: imageData } = supabase.storage
                    .from("kiosk-hero-images")
                    .getPublicUrl(hero.image_file_path);
                finalImageUrl = imageData.publicUrl;
            }
            heroData = {
                ...hero,
                background_image_url: finalImageUrl || hero.background_image_url
            };
        }

        // Process content data
        let contentData: KioskContentSection | null = null;
        if (contentResult.data && contentResult.data.length > 0) {
            const content = contentResult.data[0];
            // Get public URL for image if file path exists
            let finalImageUrl = content.main_image_url;
            if (content.image_file_path) {
                const { data: imageData } = supabase.storage
                    .from("kiosk-content-images")
                    .getPublicUrl(content.image_file_path);
                finalImageUrl = imageData.publicUrl;
            }
            contentData = {
                ...content,
                main_image_url: finalImageUrl || content.main_image_url
            };
        }

        // Process benefits section data
        let benefitsSectionData: KioskBenefitsSection | null = null;
        if (benefitsSectionResult.data && benefitsSectionResult.data.length > 0) {
            benefitsSectionData = benefitsSectionResult.data[0];
        }

        // Process manufacturers data
        let manufacturersData: KioskManufacturersSection | null = null;
        if (manufacturersResult.data && manufacturersResult.data.length > 0) {
            manufacturersData = manufacturersResult.data[0];
        }

        return {
            hero: heroData,
            content: contentData,
            benefitsSection: benefitsSectionData,
            benefits: benefitsResult.data || [],
            manufacturers: manufacturersData
        };
    } catch (error) {
        console.error("Error in getKioskPageData:", error);
        return {
            hero: null,
            content: null,
            benefitsSection: null,
            benefits: [],
            manufacturers: null
        };
    }
}

/**
 * Individual section data functions for flexibility
 */

export async function getKioskHeroData(): Promise<KioskHeroSection | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc("get_kiosk_hero_section_with_image");
        
        if (error || !data || data.length === 0) {
            console.error("Error fetching kiosk hero data:", error);
            return null;
        }
        
        const hero = data[0];
        // Get public URL for image if file path exists
        let finalImageUrl = hero.background_image_url;
        if (hero.image_file_path) {
            const { data: imageData } = supabase.storage
                .from("kiosk-hero-images")
                .getPublicUrl(hero.image_file_path);
            finalImageUrl = imageData.publicUrl;
        }
        
        return {
            ...hero,
            background_image_url: finalImageUrl || hero.background_image_url
        };
    } catch (error) {
        console.error("Error in getKioskHeroData:", error);
        return null;
    }
}

export async function getKioskContentData(): Promise<KioskContentSection | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc("get_kiosk_content_section_with_image");
        
        if (error || !data || data.length === 0) {
            console.error("Error fetching kiosk content data:", error);
            return null;
        }
        
        const content = data[0];
        // Get public URL for image if file path exists
        let finalImageUrl = content.main_image_url;
        if (content.image_file_path) {
            const { data: imageData } = supabase.storage
                .from("kiosk-content-images")
                .getPublicUrl(content.image_file_path);
            finalImageUrl = imageData.publicUrl;
        }
        
        return {
            ...content,
            main_image_url: finalImageUrl || content.main_image_url
        };
    } catch (error) {
        console.error("Error in getKioskContentData:", error);
        return null;
    }
}
