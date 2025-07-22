import { createServiceClient } from "@/lib/supabase/service";

// Interfaces for country pavilion page data
export interface ExpoPavilionHero {
    id: string;
    title: string;
    subtitle: string;
    background_image_url: string;
    background_image_alt: string;
    is_active: boolean;
}

export interface ExpoPavilionIntro {
    id: string;
    heading: string;
    paragraph_1: string;
    paragraph_2: string;
    is_active: boolean;
}

export interface ExpoPavilionExceptionalDesign {
    id: string;
    heading: string;
    paragraph_1: string;
    paragraph_2: string;
    paragraph_3: string;
    cta_text: string;
    cta_url: string;
    image_url: string;
    image_alt: string;
    is_active: boolean;
}

export interface DesignBenefit {
    id: string;
    design_section_id: string;
    title: string;
    description: string;
    icon_name: string;
    benefit_text: string;
    display_order: number;
    is_active: boolean;
}

export interface ExpoPavilionPortfolioSection {
    id: string;
    title: string;
    description: string;
    is_active: boolean;
}

export interface ExpoPavilionPortfolioItem {
    id: string;
    title: string;
    image_url: string;
    image_alt: string;
    display_order: number;
    is_active: boolean;
}

export interface ExpoPavilionParagraphSection {
    id: string;
    paragraph_content: string;
    is_active: boolean;
}

// Interface for country pavilion page data
export interface CountryPavilionPageData {
    hero: ExpoPavilionHero | null;
    intro: ExpoPavilionIntro | null;
    exceptionalDesign: ExpoPavilionExceptionalDesign | null;
    designBenefits: DesignBenefit[];
    portfolioSection: ExpoPavilionPortfolioSection | null;
    portfolioItems: ExpoPavilionPortfolioItem[];
    paragraphSection: ExpoPavilionParagraphSection | null;
}

/**
 * Fetch all country pavilion page data in one call
 * This replaces multiple useEffect calls across country pavilion components
 */
export async function getCountryPavilionPageData(): Promise<CountryPavilionPageData> {
    try {
        const supabase = createServiceClient();

        // Fetch all data in parallel for better performance
        const [
            heroResult,
            introResult,
            exceptionalDesignResult,
            portfolioSectionResult,
            portfolioItemsResult,
            paragraphSectionResult,
        ] = await Promise.all([
            supabase
                .from("expo_pavilion_hero")
                .select("*")
                .eq("is_active", true)
                .single(),
            supabase
                .from("expo_pavilion_intro")
                .select("*")
                .eq("is_active", true)
                .single(),
            supabase
                .from("expo_pavilion_exceptional_design")
                .select("*")
                .eq("is_active", true)
                .single(),
            supabase
                .from("expo_pavilion_portfolio_sections")
                .select("*")
                .eq("is_active", true)
                .single(),
            supabase
                .from("expo_pavilion_portfolio_items")
                .select("*")
                .eq("is_active", true)
                .order("display_order")
                .limit(6),
            supabase
                .from("expo_pavilion_paragraph_section")
                .select("*")
                .eq("is_active", true)
                .single(),
        ]);

        // Fetch design benefits if exceptional design exists
        let designBenefits: DesignBenefit[] = [];
        if (exceptionalDesignResult.data) {
            const benefitsResult = await supabase
                .from("expo_pavilion_design_benefits")
                .select("*")
                .eq("design_section_id", exceptionalDesignResult.data.id)
                .eq("is_active", true)
                .order("display_order");

            designBenefits = benefitsResult.data || [];
        }

        // Debug logging
        console.log(
            "Country Pavilion Page Data - paragraphSectionResult:",
            paragraphSectionResult,
        );

        return {
            hero: heroResult.data || null,
            intro: introResult.data || null,
            exceptionalDesign: exceptionalDesignResult.data || null,
            designBenefits,
            portfolioSection: portfolioSectionResult.data || null,
            portfolioItems: portfolioItemsResult.data || [],
            paragraphSection: paragraphSectionResult.data || null,
        };
    } catch (error) {
        console.error("Error in getCountryPavilionPageData:", error);
        return {
            hero: null,
            intro: null,
            exceptionalDesign: null,
            designBenefits: [],
            portfolioSection: null,
            portfolioItems: [],
            paragraphSection: null,
        };
    }
}

/**
 * Individual section data functions for flexibility
 */

export async function getExpoPavilionHeroData(): Promise<ExpoPavilionHero | null> {
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from("expo_pavilion_hero")
            .select("*")
            .eq("is_active", true)
            .single();

        if (error) {
            console.error("Error fetching hero data:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error in getExpoPavilionHeroData:", error);
        return null;
    }
}

export async function getExpoPavilionIntroData(): Promise<ExpoPavilionIntro | null> {
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from("expo_pavilion_intro")
            .select("*")
            .eq("is_active", true)
            .single();

        if (error) {
            console.error("Error fetching intro data:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error in getExpoPavilionIntroData:", error);
        return null;
    }
}

export async function getExpoPavilionExceptionalDesignData(): Promise<{
    design: ExpoPavilionExceptionalDesign | null;
    benefits: DesignBenefit[];
}> {
    try {
        const supabase = createServiceClient();

        const { data: designData, error: designError } = await supabase
            .from("expo_pavilion_exceptional_design")
            .select("*")
            .eq("is_active", true)
            .single();

        if (designError) {
            console.error(
                "Error fetching exceptional design data:",
                designError,
            );
            return { design: null, benefits: [] };
        }

        // Fetch benefits for this design section
        const { data: benefitsData, error: benefitsError } = await supabase
            .from("expo_pavilion_design_benefits")
            .select("*")
            .eq("design_section_id", designData.id)
            .eq("is_active", true)
            .order("display_order");

        if (benefitsError) {
            console.error("Error fetching design benefits:", benefitsError);
        }

        return {
            design: designData,
            benefits: benefitsData || [],
        };
    } catch (error) {
        console.error("Error in getExpoPavilionExceptionalDesignData:", error);
        return { design: null, benefits: [] };
    }
}

export async function getExpoPavilionPortfolioData(): Promise<{
    section: ExpoPavilionPortfolioSection | null;
    items: ExpoPavilionPortfolioItem[];
}> {
    try {
        const supabase = createServiceClient();

        const [sectionResult, itemsResult] = await Promise.all([
            supabase
                .from("expo_pavilion_portfolio_sections")
                .select("*")
                .eq("is_active", true)
                .single(),
            supabase
                .from("expo_pavilion_portfolio_items")
                .select("*")
                .eq("is_active", true)
                .order("display_order")
                .limit(6),
        ]);

        return {
            section: sectionResult.data || null,
            items: itemsResult.data || [],
        };
    } catch (error) {
        console.error("Error in getExpoPavilionPortfolioData:", error);
        return {
            section: null,
            items: [],
        };
    }
}
