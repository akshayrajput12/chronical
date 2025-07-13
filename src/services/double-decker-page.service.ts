import { createClient } from "@/lib/supabase/client";

// Types for double decker page data
export interface DoubleDeckerHeroSection {
    id: string;
    heading: string;
    background_image_url: string;
    background_image_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    image_file_path?: string;
}

export interface DoubleDeckerUniqueQualitySection {
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
}

export interface DoubleDeckerCommunicationSection {
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
}

export interface DoubleDeckerPortfolioItem {
    id: string;
    title: string;
    description: string;
    image_url: string;
    image_alt: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DoubleDeckerParagraphSection {
    id: string;
    paragraph_content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Interface for double decker page data
export interface DoubleDeckerPageData {
    hero: DoubleDeckerHeroSection | null;
    uniqueQuality: DoubleDeckerUniqueQualitySection | null;
    communication: DoubleDeckerCommunicationSection | null;
    portfolioItems: DoubleDeckerPortfolioItem[];
    paragraphSection: DoubleDeckerParagraphSection | null;
}

/**
 * Fetch all double decker page data in one call
 * This replaces multiple useEffect calls across double decker components
 */
export async function getDoubleDeckerPageData(): Promise<DoubleDeckerPageData> {
    try {
        const supabase = await createClient();
        
        // Check if the comprehensive function exists, otherwise fetch individually
        const { data: comprehensiveData, error: comprehensiveError } = await supabase.rpc("get_double_decker_page_data");
        
        if (comprehensiveData && !comprehensiveError) {
            // Use the comprehensive function result
            const pageData = comprehensiveData;
            
            // Process hero data
            let heroData: DoubleDeckerHeroSection | null = null;
            if (pageData.hero) {
                const hero = pageData.hero;
                // Get public URL for image if file path exists
                let finalImageUrl = hero.background_image_url;
                if (hero.image_file_path) {
                    const { data: imageData } = supabase.storage
                        .from("double-decker-hero-images")
                        .getPublicUrl(hero.image_file_path);
                    finalImageUrl = imageData.publicUrl;
                }
                heroData = {
                    ...hero,
                    background_image_url: finalImageUrl || hero.background_image_url
                };
            }

            // Process unique quality data
            let uniqueQualityData: DoubleDeckerUniqueQualitySection | null = null;
            if (pageData.unique_quality) {
                const section = pageData.unique_quality;
                // Get public URL for image if file path exists
                let finalImageUrl = section.main_image_url;
                if (section.image_file_path) {
                    const { data: imageData } = supabase.storage
                        .from("double-decker-unique-quality-images")
                        .getPublicUrl(section.image_file_path);
                    finalImageUrl = imageData.publicUrl;
                }
                uniqueQualityData = {
                    ...section,
                    main_image_url: finalImageUrl || section.main_image_url
                };
            }

            // Process communication data
            let communicationData: DoubleDeckerCommunicationSection | null = null;
            if (pageData.communication) {
                const section = pageData.communication;
                // Get public URL for image if file path exists
                let finalImageUrl = section.main_image_url;
                if (section.image_file_path) {
                    const { data: imageData } = supabase.storage
                        .from("double-decker-communication-images")
                        .getPublicUrl(section.image_file_path);
                    finalImageUrl = imageData.publicUrl;
                }
                communicationData = {
                    ...section,
                    main_image_url: finalImageUrl || section.main_image_url
                };
            }

            return {
                hero: heroData,
                uniqueQuality: uniqueQualityData,
                communication: communicationData,
                portfolioItems: pageData.portfolio || [],
                paragraphSection: null // Will be fetched separately if needed
            };
        } else {
            // Fallback to individual function calls
            const [
                heroResult,
                uniqueQualityResult,
                communicationResult,
                paragraphResult
            ] = await Promise.all([
                supabase.rpc("get_double_decker_hero_section"),
                supabase.rpc("get_double_decker_unique_quality_section"),
                supabase.rpc("get_double_decker_communication_section"),
                supabase.rpc("get_double_decker_paragraph_section")
            ]);

            // Process individual results
            let heroData: DoubleDeckerHeroSection | null = null;
            if (heroResult.data) {
                const hero = heroResult.data;
                // Get public URL for image if file path exists
                let finalImageUrl = hero.background_image_url;
                if (hero.image_file_path) {
                    const { data: imageData } = supabase.storage
                        .from("double-decker-hero-images")
                        .getPublicUrl(hero.image_file_path);
                    finalImageUrl = imageData.publicUrl;
                }
                heroData = {
                    ...hero,
                    background_image_url: finalImageUrl || hero.background_image_url
                };
            }

            return {
                hero: heroData,
                uniqueQuality: uniqueQualityResult.data || null,
                communication: communicationResult.data || null,
                portfolioItems: [],
                paragraphSection: paragraphResult.data || null
            };
        }
    } catch (error) {
        console.error("Error in getDoubleDeckerPageData:", error);
        return {
            hero: null,
            uniqueQuality: null,
            communication: null,
            portfolioItems: [],
            paragraphSection: null
        };
    }
}

/**
 * Individual section data functions for flexibility
 */

export async function getDoubleDeckerHeroData(): Promise<DoubleDeckerHeroSection | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc("get_double_decker_hero_section");
        
        if (error || !data) {
            console.error("Error fetching double decker hero data:", error);
            return null;
        }
        
        const hero = data;
        // Get public URL for image if file path exists
        let finalImageUrl = hero.background_image_url;
        if (hero.image_file_path) {
            const { data: imageData } = supabase.storage
                .from("double-decker-hero-images")
                .getPublicUrl(hero.image_file_path);
            finalImageUrl = imageData.publicUrl;
        }
        
        return {
            ...hero,
            background_image_url: finalImageUrl || hero.background_image_url
        };
    } catch (error) {
        console.error("Error in getDoubleDeckerHeroData:", error);
        return null;
    }
}

export async function getDoubleDeckerParagraphData(): Promise<DoubleDeckerParagraphSection | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc("get_double_decker_paragraph_section");
        
        if (error || !data) {
            console.error("Error fetching double decker paragraph data:", error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error in getDoubleDeckerParagraphData:", error);
        return null;
    }
}
