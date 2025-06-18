import { supabase } from "@/lib/supabase";
import {
    SetupProcessDisplayData,
    SetupProcessSection,
    SetupProcessStep,
    SetupProcessImage,
    SetupProcessImageInput,
    SETUP_PROCESS_IMAGE_CONSTRAINTS,
    SupportedImageFormat,
} from "@/types/setup-process";

/**
 * Get the complete setup process data including steps and background image
 */
export async function getSetupProcessData(): Promise<SetupProcessDisplayData | null> {
    try {
        console.log("Attempting to fetch setup process data...");
        
        // Try to use the new function first
        try {
            const { data, error } = await supabase.rpc('get_setup_process_section_with_image');
            console.log("RPC call result:", { data, error });

            if (error) {
                console.warn("RPC function failed, falling back to direct queries:", error);
                throw error; // This will trigger the fallback
            }

            if (!data || data.length === 0) {
                console.log("No data returned from RPC function");
                return null;
            }

            const sectionData = data[0];
            const steps = sectionData.steps || [];

            // Organize steps by category
            const howToApplySteps = steps.filter((step: { category: string }) => step.category === 'how_to_apply');
            const gettingStartedSteps = steps.filter((step: { category: string }) => step.category === 'getting_started');

            return {
                id: sectionData.id,
                title: sectionData.title,
                subtitle: sectionData.subtitle,
                background_image_url: sectionData.background_image_url,
                background_image_id: sectionData.background_image_id,
                how_to_apply_steps: howToApplySteps,
                getting_started_steps: gettingStartedSteps,
            };
        } catch (rpcError) {
            console.log("RPC failed, using fallback approach...");
            
            // Fallback: Get section data directly
            const { data: sectionData, error: sectionError } = await supabase
                .from("setup_process_section")
                .select("*")
                .eq("is_active", true)
                .single();

            if (sectionError || !sectionData) {
                console.log("No setup process section found");
                return null;
            }

            // Get steps data
            const { data: stepsData, error: stepsError } = await supabase
                .from("setup_process_steps")
                .select("*")
                .eq("section_id", sectionData.id)
                .eq("is_active", true)
                .order("display_order", { ascending: true });

            if (stepsError) {
                console.error("Error fetching setup process steps:", stepsError);
                return null;
            }

            // Get active image if exists
            let backgroundImageUrl = sectionData.background_image_url;
            if (sectionData.background_image_id) {
                const { data: imageData } = await supabase
                    .from("setup_process_images")
                    .select("file_path")
                    .eq("id", sectionData.background_image_id)
                    .eq("is_active", true)
                    .single();

                if (imageData) {
                    const { data: { publicUrl } } = supabase.storage
                        .from("setup-process-images")
                        .getPublicUrl(imageData.file_path);
                    backgroundImageUrl = publicUrl;
                }
            }

            // Organize steps by category
            const howToApplySteps = stepsData?.filter(step => step.category === "how_to_apply") || [];
            const gettingStartedSteps = stepsData?.filter(step => step.category === "getting_started") || [];

            return {
                id: sectionData.id,
                title: sectionData.title,
                subtitle: sectionData.subtitle,
                background_image_url: backgroundImageUrl,
                background_image_id: sectionData.background_image_id,
                how_to_apply_steps: howToApplySteps,
                getting_started_steps: gettingStartedSteps,
            };
        }
    } catch (error) {
        console.error('Error in getSetupProcessData:', error);
        return null;
    }
}

/**
 * Get all uploaded images for setup process
 */
export async function getSetupProcessImages(): Promise<SetupProcessImage[]> {
    try {
        const { data, error } = await supabase
            .from('setup_process_images')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching setup process images:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getSetupProcessImages:', error);
        return [];
    }
}

/**
 * Upload an image to the setup-process-images bucket
 */
export async function uploadSetupProcessImage(
    file: File,
): Promise<{ success: boolean; url?: string; imageId?: string; error?: string }> {
    try {
        // Validate file type
        if (!SETUP_PROCESS_IMAGE_CONSTRAINTS.SUPPORTED_FORMATS.includes(file.type as SupportedImageFormat)) {
            return {
                success: false,
                error: "Invalid file type. Please upload JPG, PNG, or WebP files.",
            };
        }

        // Validate file size
        if (file.size > SETUP_PROCESS_IMAGE_CONSTRAINTS.MAX_FILE_SIZE) {
            return {
                success: false,
                error: "File size too large. Please upload images smaller than 10MB.",
            };
        }

        // Generate a unique file name
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload the file to Supabase Storage
        const { error } = await supabase.storage
            .from("setup-process-images")
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
        } = supabase.storage.from("setup-process-images").getPublicUrl(filePath);

        // Save to database
        const imageData = {
            filename: fileName,
            original_filename: file.name,
            file_path: fileName,
            file_size: file.size,
            mime_type: file.type,
            alt_text: `Setup process background - ${file.name}`,
            is_active: false,
        };

        const saveResult = await saveSetupProcessImageRecord(imageData);
        
        if (!saveResult.success) {
            return { success: false, error: saveResult.error };
        }

        // Automatically set the uploaded image as active
        if (saveResult.imageId) {
            const setActiveResult = await setActiveSetupProcessImage(saveResult.imageId);
            if (!setActiveResult.success) {
                console.warn("Failed to set uploaded image as active:", setActiveResult.error);
            }
        }

        return { success: true, url: publicUrl, imageId: saveResult.imageId };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}

/**
 * Save image record to database
 */
export async function saveSetupProcessImageRecord(
    imageData: SetupProcessImageInput,
): Promise<{ success: boolean; imageId?: string; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('setup_process_images')
            .insert(imageData)
            .select('id')
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, imageId: data.id };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}

/**
 * Set an image as the active background image
 */
export async function setActiveSetupProcessImage(
    imageId: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase.rpc('set_setup_process_active_image', {
            image_id: imageId,
        });

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
 * Delete an image from storage and database
 */
export async function deleteSetupProcessImage(
    imageId: string,
    filePath: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from("setup-process-images")
            .remove([filePath]);

        if (storageError) {
            return { success: false, error: storageError.message };
        }

        // Delete from database
        const { error: dbError } = await supabase
            .from('setup_process_images')
            .delete()
            .eq('id', imageId);

        if (dbError) {
            return { success: false, error: dbError.message };
        }

        return { success: true };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}

/**
 * Cleanup unused images
 */
export async function cleanupSetupProcessImages(): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
    try {
        const { data, error } = await supabase.rpc('cleanup_setup_process_unused_images');

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, deletedCount: data };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
} 