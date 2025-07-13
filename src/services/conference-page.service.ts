import { createServiceClient } from "@/lib/supabase/service";

// Types for conference page data
export interface ConferenceHeroSection {
    id: string;
    heading: string;
    background_image_url: string;
    background_image_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    image_file_path?: string;
}

export interface ConferenceManagementSection {
    id: string;
    main_heading: string;
    main_description: string;
    main_image_id?: string;
    main_image_url: string;
    main_image_alt: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    image_file_path?: string;
    image_filename?: string;
    image_alt_text?: string;
}

export interface ConferenceManagementService {
    id: string;
    title: string;
    description: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ConferenceSolutionSection {
    id: string;
    main_heading: string;
    phone_number: string;
    call_to_action_text: string;
    background_color: string;
    main_image_id?: string;
    main_image_url: string;
    main_image_alt: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    image_file_path?: string;
    image_filename?: string;
    image_alt_text?: string;
}

// Interface for conference page data
export interface ConferencePageData {
    hero: ConferenceHeroSection | null;
    managementSection: ConferenceManagementSection | null;
    managementServices: ConferenceManagementService[];
    solutionSection: ConferenceSolutionSection | null;
}

/**
 * Fetch all conference page data in one call
 * This replaces multiple useEffect calls across conference components
 */
export async function getConferencePageData(): Promise<ConferencePageData> {
    try {
        const supabase = createServiceClient();
        
        // Fetch all data in parallel for better performance
        const [
            heroResult,
            managementSectionResult,
            managementServicesResult,
            solutionSectionResult
        ] = await Promise.all([
            supabase.rpc("get_conference_hero_section_with_image"),
            supabase.rpc("get_conference_management_section_with_data"),
            supabase
                .from("conference_management_services")
                .select("*")
                .eq("is_active", true)
                .order("display_order"),
            supabase.rpc("get_conference_solution_section_with_image")
        ]);

        // Process hero data
        let heroData: ConferenceHeroSection | null = null;
        if (heroResult.data && heroResult.data.length > 0) {
            const hero = heroResult.data[0];
            // Get public URL for image if file path exists
            let finalImageUrl = hero.background_image_url;
            if (hero.image_file_path) {
                const { data: imageData } = supabase.storage
                    .from("conference-hero-images")
                    .getPublicUrl(hero.image_file_path);
                finalImageUrl = imageData.publicUrl;
            }
            heroData = {
                ...hero,
                background_image_url: finalImageUrl || hero.background_image_url
            };
        }

        // Process management section data
        let managementSectionData: ConferenceManagementSection | null = null;
        if (managementSectionResult.data && managementSectionResult.data.length > 0) {
            const section = managementSectionResult.data[0];
            // Get public URL for image if file path exists
            let finalImageUrl = section.main_image_url;
            if (section.image_file_path) {
                const { data: imageData } = supabase.storage
                    .from("conference-management-images")
                    .getPublicUrl(section.image_file_path);
                finalImageUrl = imageData.publicUrl;
            }
            managementSectionData = {
                ...section,
                main_image_url: finalImageUrl || section.main_image_url
            };
        }

        // Process solution section data
        let solutionSectionData: ConferenceSolutionSection | null = null;
        if (solutionSectionResult.data && solutionSectionResult.data.length > 0) {
            const section = solutionSectionResult.data[0];
            // Get public URL for image if file path exists
            let finalImageUrl = section.main_image_url;
            if (section.image_file_path) {
                const { data: imageData } = supabase.storage
                    .from("conference-solution-section-images")
                    .getPublicUrl(section.image_file_path);
                finalImageUrl = imageData.publicUrl;
            }
            solutionSectionData = {
                ...section,
                main_image_url: finalImageUrl || section.main_image_url
            };
        }

        return {
            hero: heroData,
            managementSection: managementSectionData,
            managementServices: managementServicesResult.data || [],
            solutionSection: solutionSectionData
        };
    } catch (error) {
        console.error("Error in getConferencePageData:", error);
        return {
            hero: null,
            managementSection: null,
            managementServices: [],
            solutionSection: null
        };
    }
}

/**
 * Individual section data functions for flexibility
 */

export async function getConferenceHeroData(): Promise<ConferenceHeroSection | null> {
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase.rpc("get_conference_hero_section_with_image");
        
        if (error || !data || data.length === 0) {
            console.error("Error fetching conference hero data:", error);
            return null;
        }
        
        const hero = data[0];
        // Get public URL for image if file path exists
        let finalImageUrl = hero.background_image_url;
        if (hero.image_file_path) {
            const { data: imageData } = supabase.storage
                .from("conference-hero-images")
                .getPublicUrl(hero.image_file_path);
            finalImageUrl = imageData.publicUrl;
        }
        
        return {
            ...hero,
            background_image_url: finalImageUrl || hero.background_image_url
        };
    } catch (error) {
        console.error("Error in getConferenceHeroData:", error);
        return null;
    }
}

export async function getConferenceManagementSectionData(): Promise<ConferenceManagementSection | null> {
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase.rpc("get_conference_management_section_with_data");
        
        if (error || !data || data.length === 0) {
            console.error("Error fetching conference management section data:", error);
            return null;
        }
        
        const section = data[0];
        // Get public URL for image if file path exists
        let finalImageUrl = section.main_image_url;
        if (section.image_file_path) {
            const { data: imageData } = supabase.storage
                .from("conference-management-images")
                .getPublicUrl(section.image_file_path);
            finalImageUrl = imageData.publicUrl;
        }
        
        return {
            ...section,
            main_image_url: finalImageUrl || section.main_image_url
        };
    } catch (error) {
        console.error("Error in getConferenceManagementSectionData:", error);
        return null;
    }
}
