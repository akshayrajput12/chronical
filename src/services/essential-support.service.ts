
import { supabase } from '@/lib/supabase';
import {
  EssentialSupportSection,
  EssentialSupportSectionInput,
  EssentialSupportCategory
} from '@/types/essential-support';

/**
 * Fetches the active essential support section data
 */
export async function getEssentialSupportSection(): Promise<EssentialSupportSection | null> {
  try {
    const { data, error } = await supabase
      .from('essential_support_data')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching essential support section:', error);
      return null;
    }

    return data as EssentialSupportSection;
  } catch (error) {
    console.error('Error in getEssentialSupportSection:', error);
    return null;
  }
}

/**
 * Updates the essential support section data
 */
export async function updateEssentialSupportSection(
  id: string,
  sectionData: EssentialSupportSectionInput
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the current data to preserve the categories structure
    const { data: currentData, error: fetchError } = await supabase
      .from('essential_support_data')
      .select('categories')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching current essential support data:', fetchError);
      return { success: false, error: fetchError.message };
    }

    // Preserve the category structure but update the content
    const updatedCategories = currentData.categories.map((existingCategory: EssentialSupportCategory, index: number) => {
      // Find the matching category in the new data by index
      const newCategory = sectionData.categories[index];

      if (newCategory) {
        // Preserve the category structure (especially icon_svg), but update the title and services
        return {
          ...existingCategory,
          title: newCategory.title,
          services: newCategory.services,
          // Ensure we keep the original icon_svg to maintain consistency
          icon_svg: existingCategory.icon_svg
        };
      }

      return existingCategory;
    });

    // Update the data
    const { error } = await supabase
      .from('essential_support_data')
      .update({
        heading: sectionData.heading,
        heading_span: sectionData.heading_span,
        description: sectionData.description,
        cta_text: sectionData.cta_text,
        cta_url: sectionData.cta_url,
        categories: updatedCategories,
        is_active: sectionData.is_active ?? true,
        updated_at: new Date()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating essential support section:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateEssentialSupportSection:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Creates a new essential support section
 */
export async function createEssentialSupportSection(
  sectionData: EssentialSupportSectionInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('essential_support_data')
      .insert({
        heading: sectionData.heading,
        heading_span: sectionData.heading_span,
        description: sectionData.description,
        cta_text: sectionData.cta_text,
        cta_url: sectionData.cta_url,
        categories: sectionData.categories,
        is_active: sectionData.is_active ?? true
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating essential support section:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error in createEssentialSupportSection:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Saves the entire essential support section
 */
export async function saveEssentialSupportSection(
  sectionId: string | null,
  sectionData: EssentialSupportSectionInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (sectionId) {
      // Update existing section
      const result = await updateEssentialSupportSection(sectionId, sectionData);
      if (!result.success) {
        return result;
      }
      return { success: true, id: sectionId };
    } else {
      // Create new section
      return await createEssentialSupportSection(sectionData);
    }
  } catch (error) {
    console.error('Error in saveEssentialSupportSection:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}



