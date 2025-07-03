import { createClient } from "@/lib/supabase/server";
import { AboutMainSectionData, AboutDescriptionSectionData } from "@/types/about";

// Interface for about page data
export interface AboutPageData {
    mainSection: AboutMainSectionData | null;
    descriptionSection: AboutDescriptionSectionData | null;
    dedicationSection: any | null; // Add proper type if available
}

/**
 * Fetch about main section data
 * This replaces the useEffect call in about-us-main component
 */
export async function getAboutMainSectionData(): Promise<AboutMainSectionData | null> {
    try {
        const supabase = await createClient();
        
        // Try to use the database function to get main data
        const { data, error } = await supabase.rpc("get_about_main_section");
        
        if (error) {
            console.error("Error fetching about main section:", error);
            return null;
        }
        
        if (data && data.length > 0) {
            return data[0];
        }
        
        return null;
    } catch (error) {
        console.error("Error in getAboutMainSectionData:", error);
        return null;
    }
}

/**
 * Fetch about description section data
 * This replaces the useEffect call in about-us-description component
 */
export async function getAboutDescriptionSectionData(): Promise<AboutDescriptionSectionData | null> {
    try {
        const supabase = await createClient();
        
        // Try to load section data from database
        const { data: sectionResponse, error: sectionError } = await supabase.rpc("get_about_description_section");
        
        if (sectionError) {
            console.error("Error fetching about description section:", sectionError);
            return null;
        }
        
        if (sectionResponse && sectionResponse.length > 0) {
            return sectionResponse[0];
        }
        
        return null;
    } catch (error) {
        console.error("Error in getAboutDescriptionSectionData:", error);
        return null;
    }
}

/**
 * Fetch dedication section data
 * This replaces the useEffect call in dedication-section component
 */
export async function getAboutDedicationSectionData(): Promise<any | null> {
    try {
        const supabase = await createClient();

        // Try to load dedication section data and its items
        const [sectionResult, itemsResult] = await Promise.all([
            supabase
                .from("about_dedication_sections")
                .select("*")
                .eq("is_active", true)
                .single(),
            supabase
                .from("about_dedication_items")
                .select("*")
                .eq("is_active", true)
                .order("display_order")
        ]);

        if (sectionResult.error) {
            console.error("Error fetching dedication section:", sectionResult.error);
            return null;
        }

        return {
            ...sectionResult.data,
            items: itemsResult.data || []
        };
    } catch (error) {
        console.error("Error in getAboutDedicationSectionData:", error);
        return null;
    }
}

/**
 * Fetch all about page data in parallel
 * This replaces multiple useEffect calls across about page components
 */
export async function getAboutPageData(): Promise<AboutPageData> {
    try {
        // Fetch all data in parallel for better performance
        const [mainSection, descriptionSection, dedicationSection] = await Promise.all([
            getAboutMainSectionData(),
            getAboutDescriptionSectionData(),
            getAboutDedicationSectionData()
        ]);
        
        return {
            mainSection,
            descriptionSection,
            dedicationSection
        };
    } catch (error) {
        console.error("Error in getAboutPageData:", error);
        return {
            mainSection: null,
            descriptionSection: null,
            dedicationSection: null
        };
    }
}
