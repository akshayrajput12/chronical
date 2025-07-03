import { createClient } from "@/lib/supabase/server";
import { AboutHeroSectionData } from "@/types/about";
import type { PortfolioItemWithImage } from "@/types/portfolio-gallery";

// Interface for portfolio page data
export interface PortfolioPageData {
    hero: AboutHeroSectionData | null;
    portfolioItems: PortfolioItemWithImage[];
}

/**
 * Fetch hero section data for portfolio page
 * Uses the same about hero section as the about page
 */
async function getPortfolioHeroData(): Promise<AboutHeroSectionData | null> {
    try {
        const supabase = await createClient();
        
        // Use the database function to get about hero data
        const { data, error } = await supabase.rpc("get_about_hero_section");

        if (error) {
            console.error("Error fetching portfolio hero data:", error);
            return null;
        }

        if (data && data.length > 0) {
            const heroSection = data[0];

            // Construct proper image URL if file path exists
            let imageUrl = null;
            if (heroSection.background_image_url) {
                // Get the public URL from Supabase storage
                const { data: urlData } = supabase.storage
                    .from("about-hero")
                    .getPublicUrl(heroSection.background_image_url);
                imageUrl = urlData.publicUrl;
            }

            return {
                ...heroSection,
                background_image_url: imageUrl,
            };
        }

        return null;
    } catch (error) {
        console.error("Error in getPortfolioHeroData:", error);
        return null;
    }
}

/**
 * Fetch portfolio items with images
 */
async function getPortfolioItems(): Promise<PortfolioItemWithImage[]> {
    try {
        const supabase = await createClient();
        
        // Use the database function to get items with images
        const { data, error } = await supabase.rpc("get_portfolio_items_with_images");

        if (error) {
            console.error("Error fetching portfolio items:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Error in getPortfolioItems:", error);
        return [];
    }
}

/**
 * Fetch all portfolio page data in a single server-side call
 * This replaces multiple useEffect calls for better SEO performance
 */
export async function getPortfolioPageData(): Promise<PortfolioPageData> {
    try {
        // Fetch all data in parallel for better performance
        const [heroData, portfolioItems] = await Promise.all([
            getPortfolioHeroData(),
            getPortfolioItems()
        ]);

        return {
            hero: heroData,
            portfolioItems: portfolioItems
        };
    } catch (error) {
        console.error("Error fetching portfolio page data:", error);
        // Return empty data instead of throwing to prevent page crashes
        return {
            hero: null,
            portfolioItems: []
        };
    }
}

/**
 * Helper function to get image URL for portfolio items
 * (either from Supabase storage or external URL)
 */
export function getPortfolioImageUrl(item: PortfolioItemWithImage, supabase: any): string {
    // If there's an uploaded image, use Supabase storage URL
    if (item.image_file_path) {
        const { data } = supabase.storage
            .from("portfolio-gallery-images")
            .getPublicUrl(item.image_file_path);
        return data.publicUrl;
    }

    // Otherwise use the external image URL
    return item.image_url || "";
}
