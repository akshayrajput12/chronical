import { supabase } from "@/lib/supabase";
import { HeroSection } from "@/types/hero";
import { BusinessSection } from "@/types/business";
import { WhySection } from "@/services/why-section.service";
import { EssentialSupportSection } from "@/types/essential-support";
import { SetupProcessDisplayData } from "@/types/setup-process";
import { NewCompanySection } from "@/types/new-company";
import { DynamicCellDisplayData } from "@/types/dynamic-cell";
import { getSetupProcessData } from "@/services/setup-process.service";

export interface HomePageData {
    hero: HeroSection | null;
    business: BusinessSection | null;
    whySection: WhySection | null;
    essentialSupport: EssentialSupportSection | null;
    setupProcess: SetupProcessDisplayData | null;
    newCompany: {
        section: NewCompanySection | null;
        images: any | null;
    };
    dynamicCell: DynamicCellDisplayData | null;
}

/**
 * Fetches all home page data in a single server-side call
 * This replaces multiple useEffect calls for better SEO performance
 */
export async function getHomePageData(): Promise<HomePageData> {
    try {
        // Fetch all data in parallel for better performance
        const [
            heroData,
            businessData,
            whySectionData,
            essentialSupportData,
            setupProcessData,
            newCompanyData,
            dynamicCellData
        ] = await Promise.all([
            getHeroSectionData(),
            getBusinessSectionData(),
            getWhySectionData(),
            getEssentialSupportData(),
            getSetupProcessData(),
            getNewCompanyData(),
            getDynamicCellData()
        ]);

        return {
            hero: heroData,
            business: businessData,
            whySection: whySectionData,
            essentialSupport: essentialSupportData,
            setupProcess: setupProcessData,
            newCompany: newCompanyData,
            dynamicCell: dynamicCellData
        };
    } catch (error) {
        console.error("Error fetching home page data:", error);
        // Return null values instead of throwing to prevent page crashes
        return {
            hero: null,
            business: null,
            whySection: null,
            essentialSupport: null,
            setupProcess: null,
            newCompany: { section: null, images: null },
            dynamicCell: null
        };
    }
}

/**
 * Fetch hero section data
 */
async function getHeroSectionData(): Promise<HeroSection | null> {
    try {
        const { data, error } = await supabase.rpc('get_hero_section');
        
        if (error) {
            console.error('Error fetching hero section:', error);
            return null;
        }

        return data?.[0] as HeroSection || null;
    } catch (error) {
        console.error('Error in getHeroSectionData:', error);
        return null;
    }
}

/**
 * Fetch business section data
 */
async function getBusinessSectionData(): Promise<BusinessSection | null> {
    try {
        const { data, error } = await supabase.rpc("get_business_section");

        if (error) {
            console.error("Error fetching business section:", error);
            return null;
        }

        return data?.[0] as BusinessSection || null;
    } catch (error) {
        console.error("Error in getBusinessSectionData:", error);
        return null;
    }
}

/**
 * Fetch why section data
 */
async function getWhySectionData(): Promise<WhySection | null> {
    try {
        const { data, error } = await supabase.rpc("get_why_section");

        if (error) {
            console.error("Error fetching why section:", error);
            return null;
        }

        return data?.[0] as WhySection || null;
    } catch (error) {
        console.error("Error in getWhySectionData:", error);
        return null;
    }
}

/**
 * Fetch essential support data
 */
async function getEssentialSupportData(): Promise<EssentialSupportSection | null> {
    try {
        // Use direct table query with correct table name
        const { data, error } = await supabase
            .from("essential_support_data")
            .select("*")
            .eq("is_active", true)
            .order("updated_at", { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error("Error fetching essential support section:", error);
            return null;
        }

        return data as EssentialSupportSection;
    } catch (error) {
        console.error("Error in getEssentialSupportData:", error);
        return null;
    }
}



/**
 * Fetch new company data with images
 */
async function getNewCompanyData(): Promise<{ section: NewCompanySection | null; images: any | null }> {
    try {
        // First get the section data using correct table name
        const { data: sectionData, error: sectionError } = await supabase
            .from("new_company_section")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (sectionError || !sectionData) {
            console.error("Error fetching new company section:", sectionError);
            return { section: null, images: null };
        }

        // Then get the images for this section
        const { data: imagesData, error: imagesError } = await supabase
            .from("new_company_images")
            .select("*")
            .eq("section_id", sectionData.id)
            .eq("is_active", true)
            .order("display_order");

        if (imagesError) {
            console.error("Error fetching new company images:", imagesError);
            return { section: sectionData as NewCompanySection, images: null };
        }

        // Group images by column number (1, 2, 3)
        const imagesByColumn = {
            1: imagesData?.filter(img => img.column_number === 1) || [],
            2: imagesData?.filter(img => img.column_number === 2) || [],
            3: imagesData?.filter(img => img.column_number === 3) || []
        };

        return {
            section: sectionData as NewCompanySection,
            images: imagesByColumn
        };
    } catch (error) {
        console.error("Error in getNewCompanyData:", error);
        return { section: null, images: null };
    }
}

/**
 * Fetch dynamic cell data
 */
async function getDynamicCellData(): Promise<DynamicCellDisplayData | null> {
    try {
        const { data, error } = await supabase.rpc("get_dynamic_cell_section");

        if (error) {
            console.error("Error fetching dynamic cell data:", error);
            return null;
        }

        return data?.[0] as DynamicCellDisplayData || null;
    } catch (error) {
        console.error("Error in getDynamicCellData:", error);
        return null;
    }
}
