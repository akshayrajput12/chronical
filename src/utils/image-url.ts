import { createClient } from "@/lib/supabase/client";

/**
 * Constructs a full image URL from a file path or filename
 * Handles both full URLs and relative paths/filenames
 */
export function getImageUrl(imagePath: string | null | undefined, bucketName: string = "images"): string {
    if (!imagePath) {
        return "";
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }

    // If it starts with a slash, it's a relative path - return as is for Next.js static files
    if (imagePath.startsWith("/")) {
        return imagePath;
    }

    // Otherwise, construct the Supabase storage URL
    try {
        const supabase = createClient();
        const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(imagePath);
        
        return data.publicUrl;
    } catch (error) {
        console.error("Error constructing image URL:", error);
        return "";
    }
}

/**
 * Constructs image URLs for different bucket types
 */
export const getImageUrlForBucket = {
    dynamicCell: (imagePath: string | null | undefined) => getImageUrl(imagePath, "dynamic-cell-images"),
    newCompany: (imagePath: string | null | undefined) => getImageUrl(imagePath, "new-company-images"),
    hero: (imagePath: string | null | undefined) => getImageUrl(imagePath, "hero-images"),
    business: (imagePath: string | null | undefined) => getImageUrl(imagePath, "business-images"),
    portfolio: (imagePath: string | null | undefined) => getImageUrl(imagePath, "portfolio-images"),
    events: (imagePath: string | null | undefined) => getImageUrl(imagePath, "event_images"),
    blogs: (imagePath: string | null | undefined) => getImageUrl(imagePath, "blog_images"),
    cities: (imagePath: string | null | undefined) => getImageUrl(imagePath, "city-images"),
    aboutDedication: (imagePath: string | null | undefined) => getImageUrl(imagePath, "about-dedication"),
    aboutHero: (imagePath: string | null | undefined) => getImageUrl(imagePath, "about-hero"),
    aboutMain: (imagePath: string | null | undefined) => getImageUrl(imagePath, "about-main"),
    aboutDescription: (imagePath: string | null | undefined) => getImageUrl(imagePath, "about-description"),
    general: (imagePath: string | null | undefined) => getImageUrl(imagePath, "images"),
};

/**
 * Validates if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
    if (!url) return false;
    
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Gets a fallback image URL if the primary image fails
 */
export function getImageUrlWithFallback(
    primaryImagePath: string | null | undefined,
    fallbackImagePath: string = "/images/placeholder.jpg",
    bucketName: string = "images"
): string {
    const primaryUrl = getImageUrl(primaryImagePath, bucketName);
    return primaryUrl || fallbackImagePath;
}
