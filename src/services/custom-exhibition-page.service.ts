import { createServiceClient } from "@/lib/supabase/service";
import { 
    CustomExhibitionHero,
    CustomExhibitionLeadingContractor,
    CustomExhibitionPromoteBrand,
    CustomExhibitionStrikingCustomized,
    CustomExhibitionReasonsToChoose,
    CustomExhibitionFAQSection,
    CustomExhibitionFAQItem,
    CustomExhibitionLookingForStands
} from "@/services/custom-exhibition-stands.service";

// Interface for custom exhibition stands page data
export interface CustomExhibitionPageData {
    hero: CustomExhibitionHero | null;
    leadingContractor: CustomExhibitionLeadingContractor | null;
    promoteBrand: CustomExhibitionPromoteBrand | null;
    strikingCustomized: CustomExhibitionStrikingCustomized | null;
    reasonsToChoose: CustomExhibitionReasonsToChoose | null;
    faqSection: CustomExhibitionFAQSection | null;
    faqItems: CustomExhibitionFAQItem[];
    lookingForStands: CustomExhibitionLookingForStands | null;
}

/**
 * Fetch all custom exhibition stands page data in one call
 * This replaces multiple useEffect calls across custom exhibition components
 */
export async function getCustomExhibitionPageData(): Promise<CustomExhibitionPageData> {
    try {
        const supabase = createServiceClient();
        
        // Use the existing database function to get all data at once
        const { data, error } = await supabase.rpc("get_custom_exhibition_page_data");
        
        if (error) {
            console.error("Error fetching custom exhibition page data:", error);
            return {
                hero: null,
                leadingContractor: null,
                promoteBrand: null,
                strikingCustomized: null,
                reasonsToChoose: null,
                faqSection: null,
                faqItems: [],
                lookingForStands: null
            };
        }
        
        return {
            hero: data?.hero || null,
            leadingContractor: data?.leading_contractor || null,
            promoteBrand: data?.promote_brand || null,
            strikingCustomized: data?.striking_customized || null,
            reasonsToChoose: data?.reasons_to_choose || null,
            faqSection: data?.faq_section || null,
            faqItems: data?.faq_items || [],
            lookingForStands: data?.looking_for_stands || null
        };
    } catch (error) {
        console.error("Error in getCustomExhibitionPageData:", error);
        return {
            hero: null,
            leadingContractor: null,
            promoteBrand: null,
            strikingCustomized: null,
            reasonsToChoose: null,
            faqSection: null,
            faqItems: [],
            lookingForStands: null
        };
    }
}

/**
 * Fetch individual section data functions for flexibility
 */

export async function getCustomExhibitionHeroData(): Promise<CustomExhibitionHero | null> {
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from("custom_exhibition_hero")
            .select("*")
            .eq("is_active", true)
            .single();
        
        if (error) {
            console.error("Error fetching hero data:", error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error in getCustomExhibitionHeroData:", error);
        return null;
    }
}

export async function getCustomExhibitionLeadingContractorData(): Promise<CustomExhibitionLeadingContractor | null> {
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from("custom_exhibition_leading_contractor")
            .select("*")
            .eq("is_active", true)
            .single();
        
        if (error) {
            console.error("Error fetching leading contractor data:", error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error in getCustomExhibitionLeadingContractorData:", error);
        return null;
    }
}

export async function getCustomExhibitionPromoteBrandData(): Promise<CustomExhibitionPromoteBrand | null> {
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from("custom_exhibition_promote_brand")
            .select("*")
            .eq("is_active", true)
            .single();
        
        if (error) {
            console.error("Error fetching promote brand data:", error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error in getCustomExhibitionPromoteBrandData:", error);
        return null;
    }
}

export async function getCustomExhibitionStrikingCustomizedData(): Promise<CustomExhibitionStrikingCustomized | null> {
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from("custom_exhibition_striking_customized")
            .select("*")
            .eq("is_active", true)
            .single();
        
        if (error) {
            console.error("Error fetching striking customized data:", error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error in getCustomExhibitionStrikingCustomizedData:", error);
        return null;
    }
}

export async function getCustomExhibitionReasonsToChooseData(): Promise<CustomExhibitionReasonsToChoose | null> {
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from("custom_exhibition_reasons_to_choose")
            .select("*")
            .eq("is_active", true)
            .single();
        
        if (error) {
            console.error("Error fetching reasons to choose data:", error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error("Error in getCustomExhibitionReasonsToChooseData:", error);
        return null;
    }
}

export async function getCustomExhibitionFAQData(): Promise<{ section: CustomExhibitionFAQSection | null; items: CustomExhibitionFAQItem[] }> {
    try {
        const supabase = createServiceClient();
        
        const [sectionResult, itemsResult] = await Promise.all([
            supabase
                .from("custom_exhibition_faq_section")
                .select("*")
                .eq("is_active", true)
                .single(),
            supabase
                .from("custom_exhibition_faq_items")
                .select("*")
                .eq("is_active", true)
                .order("display_order")
        ]);
        
        return {
            section: sectionResult.data || null,
            items: itemsResult.data || []
        };
    } catch (error) {
        console.error("Error in getCustomExhibitionFAQData:", error);
        return {
            section: null,
            items: []
        };
    }
}
