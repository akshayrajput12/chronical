import { supabase } from "@/lib/supabase";

export interface WhySection {
    id: string;
    heading: string;
    underline_color: string;
    subtitle: string;
    left_column_text_1: string;
    left_column_text_2: string;
    right_column_text: string;
    image_url: string;
    image_alt: string;
    image_overlay_heading: string;
    image_overlay_subheading: string;
    // Basic video support fields
    media_type: "image" | "video";
    video_url?: string;
}

export interface WhySectionInput {
    heading: string;
    underline_color: string;
    subtitle: string;
    left_column_text_1: string;
    left_column_text_2: string;
    right_column_text: string;
    image_url: string;
    image_alt: string;
    image_overlay_heading: string;
    image_overlay_subheading: string;
    // Basic video support fields
    media_type: "image" | "video";
    video_url?: string;
}

/**
 * Fetches the active why section
 */
export async function getWhySection(): Promise<WhySection | null> {
    try {
        console.log("Fetching why section data...");
        const { data, error } = await supabase.rpc("get_why_section");

        if (error) {
            console.error("Error fetching why section:", error);
            return null;
        }

        console.log("Why section data received:", data);

        // If no data is returned from the RPC function, try to fetch directly from the table
        if (!data || data.length === 0) {
            console.log("No data from RPC, trying direct table query...");
            const { data: tableData, error: tableError } = await supabase
                .from("why_sections")
                .select("*")
                .eq("is_active", true)
                .order("updated_at", { ascending: false })
                .limit(1);

            if (tableError) {
                console.error(
                    "Error fetching from why_sections table:",
                    tableError,
                );
                return null;
            }

            console.log("Table data received:", tableData);

            if (tableData && tableData.length > 0) {
                // Convert table data to match the expected format
                return {
                    id: tableData[0].id,
                    heading: tableData[0].heading,
                    underline_color: tableData[0].underline_color,
                    subtitle: tableData[0].subtitle,
                    left_column_text_1: tableData[0].left_column_text_1,
                    left_column_text_2: tableData[0].left_column_text_2,
                    right_column_text: tableData[0].right_column_text,
                    image_url: tableData[0].image_url,
                    image_alt: tableData[0].image_alt,
                    image_overlay_heading: tableData[0].image_overlay_heading,
                    image_overlay_subheading:
                        tableData[0].image_overlay_subheading,
                    media_type: tableData[0].media_type || "image",
                    video_url: tableData[0].video_url || undefined,
                };
            }

            // If still no data, return default values
            return {
                id: crypto.randomUUID(),
                heading: "Why DWTC Free Zone",
                underline_color: "#a5cd39",
                subtitle:
                    "Building on a 45 year legacy, DWTC Free Zone connects businesses and communities propelling their potential for success.",
                left_column_text_1:
                    "DWTC Free Zone provides a unique and highly desirable proposition for businesses seeking a competitive and well-regulated ecosystem to operate in regional and global markets. Offering a range of benefits such as 100% foreign ownership, 0% taxes and customs duties, and streamlined procedures for visas and permits, the DWTC free zone is a future-focused ecosystem designed for transformative business growth.",
                left_column_text_2:
                    "We are a progressive and welcoming free zone, open to all businesses. Anchored by world-class infrastructure and flexible company formation, licensing and setup solutions, DWTC Free Zone offers an ideal environment, nurturing a sustainable economy from Dubai.",
                right_column_text:
                    "Spanning from the iconic Sheikh Rashid Tower to the neighboring One Central, DWTC Free Zone offers a diverse range of 1,200+ licensed business activities and is home to more than 1,800 small and medium businesses.",
                image_url: "/images/office-space.jpg",
                image_alt: "Premium Commercial Offices",
                image_overlay_heading: "2 MILLION+ SQ FT. OF",
                image_overlay_subheading: "PREMIUM COMMERCIAL OFFICES",
                media_type: "image" as const,
                video_url: undefined,
            };
        }

        return data[0] as WhySection;
    } catch (error) {
        console.error("Error in getWhySection:", error);

        // Return default values in case of error
        return {
            id: crypto.randomUUID(),
            heading: "Why DWTC Free Zone",
            underline_color: "#a5cd39",
            subtitle:
                "Building on a 45 year legacy, DWTC Free Zone connects businesses and communities propelling their potential for success.",
            left_column_text_1:
                "DWTC Free Zone provides a unique and highly desirable proposition for businesses seeking a competitive and well-regulated ecosystem to operate in regional and global markets. Offering a range of benefits such as 100% foreign ownership, 0% taxes and customs duties, and streamlined procedures for visas and permits, the DWTC free zone is a future-focused ecosystem designed for transformative business growth.",
            left_column_text_2:
                "We are a progressive and welcoming free zone, open to all businesses. Anchored by world-class infrastructure and flexible company formation, licensing and setup solutions, DWTC Free Zone offers an ideal environment, nurturing a sustainable economy from Dubai.",
            right_column_text:
                "Spanning from the iconic Sheikh Rashid Tower to the neighboring One Central, DWTC Free Zone offers a diverse range of 1,200+ licensed business activities and is home to more than 1,800 small and medium businesses.",
            image_url: "/images/office-space.jpg",
            image_alt: "Premium Commercial Offices",
            image_overlay_heading: "2 MILLION+ SQ FT. OF",
            image_overlay_subheading: "PREMIUM COMMERCIAL OFFICES",
            media_type: "image" as const,
            video_url: undefined,
        };
    }
}

/**
 * Updates an existing why section
 */
export async function updateWhySection(
    id: string,
    whyData: WhySectionInput,
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from("why_sections")
            .update({
                heading: whyData.heading,
                underline_color: whyData.underline_color,
                subtitle: whyData.subtitle,
                left_column_text_1: whyData.left_column_text_1,
                left_column_text_2: whyData.left_column_text_2,
                right_column_text: whyData.right_column_text,
                image_url: whyData.image_url,
                image_alt: whyData.image_alt,
                image_overlay_heading: whyData.image_overlay_heading,
                image_overlay_subheading: whyData.image_overlay_subheading,
                media_type: whyData.media_type,
                video_url: whyData.video_url,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}

/**
 * Creates a new why section
 */
export async function createWhySection(
    whyData: WhySectionInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const { data, error } = await supabase
            .from("why_sections")
            .insert({
                heading: whyData.heading,
                underline_color: whyData.underline_color,
                subtitle: whyData.subtitle,
                left_column_text_1: whyData.left_column_text_1,
                left_column_text_2: whyData.left_column_text_2,
                right_column_text: whyData.right_column_text,
                image_url: whyData.image_url,
                image_alt: whyData.image_alt,
                image_overlay_heading: whyData.image_overlay_heading,
                image_overlay_subheading: whyData.image_overlay_subheading,
                media_type: whyData.media_type,
                video_url: whyData.video_url,
            })
            .select("id")
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, id: data.id };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}

/**
 * Uploads an image to the why-section-images bucket
 */
export async function uploadWhySectionImage(
    file: File,
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // Generate a unique file name
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload the file to Supabase Storage
        const { error } = await supabase.storage
            .from("why-section-images")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            return { success: false, error: error.message };
        }

        // Get the public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("why-section-images").getPublicUrl(filePath);

        return { success: true, url: publicUrl };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}

/**
 * Uploads a video to the why-section-images bucket
 */
export async function uploadWhySectionVideo(
    file: File,
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // Validate file type
        const allowedVideoTypes = [
            "video/mp4",
            "video/webm",
            "video/mov",
            "video/avi",
            "video/quicktime",
        ];
        if (!allowedVideoTypes.includes(file.type)) {
            return {
                success: false,
                error: "Invalid file type. Please upload MP4, WebM, MOV, or AVI files.",
            };
        }

        // Validate file size (50MB limit)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            return {
                success: false,
                error: "File size too large. Please upload videos smaller than 50MB.",
            };
        }

        // Generate a unique file name
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload the file to Supabase Storage
        const { error } = await supabase.storage
            .from("why-section-images")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            return { success: false, error: error.message };
        }

        // Get the public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("why-section-images").getPublicUrl(filePath);

        return { success: true, url: publicUrl };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}

/**
 * Deletes a video from the why-section-images bucket
 */
export async function deleteWhySectionVideo(
    url: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        // Extract the file path from the URL
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split("/");
        const filePath = pathSegments[pathSegments.length - 1];

        // Delete the file from Supabase Storage
        const { error } = await supabase.storage
            .from("why-section-images")
            .remove([filePath]);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}

/**
 * Deletes an image from the why-section-images bucket
 */
export async function deleteWhySectionImage(
    url: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        // Extract the file path from the URL
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split("/");
        const filePath = pathSegments[pathSegments.length - 1];

        // Delete the file from Supabase Storage
        const { error } = await supabase.storage
            .from("why-section-images")
            .remove([filePath]);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}
