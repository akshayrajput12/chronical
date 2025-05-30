import { supabase } from '@/lib/supabase';
import {
  BusinessSection,
  BusinessSectionInput,
  BusinessParagraphInput,
  BusinessStatInput,
  BusinessSectionWithDetails
} from '@/types/business';

/**
 * Fetches the active business section with its paragraphs and stats
 */
export async function getBusinessSection(): Promise<BusinessSection | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_business_section');

    if (error) {
      console.error('Error fetching business section:', error);
      return null;
    }

    return data[0] as BusinessSection;
  } catch (error) {
    console.error('Error in getBusinessSection:', error);
    return null;
  }
}

/**
 * Updates an existing business section
 */
export async function updateBusinessSection(
  id: string,
  businessData: BusinessSectionInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('business_sections')
      .update(businessData)
      .eq('id', id);

    if (error) {
      console.error('Error updating business section:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in updateBusinessSection:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Creates a new business section
 */
export async function createBusinessSection(
  businessData: BusinessSectionInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('business_sections')
      .insert(businessData)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating business section:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in createBusinessSection:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Updates paragraphs for a business section
 */
export async function updateBusinessParagraphs(
  businessSectionId: string,
  paragraphs: BusinessParagraphInput[]
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Updating paragraphs for business section:', businessSectionId);

    // Get existing paragraphs to determine which ones to update, delete, or insert
    const { data: existingParagraphs, error: fetchError } = await supabase
      .from('business_paragraphs')
      .select('id, display_order')
      .eq('business_section_id', businessSectionId)
      .order('display_order', { ascending: true });

    if (fetchError) {
      console.error('Error fetching existing paragraphs:', fetchError);
      return { success: false, error: fetchError.message };
    }

    console.log('Found existing paragraphs:', existingParagraphs?.length || 0);

    // If there are no existing paragraphs or we're replacing all content, use the simple approach
    if (!existingParagraphs || existingParagraphs.length === 0 || existingParagraphs.length !== paragraphs.length) {
      console.log('Using delete-and-insert approach for paragraphs');

      // Delete all existing paragraphs
      const { error: deleteError } = await supabase
        .from('business_paragraphs')
        .delete()
        .eq('business_section_id', businessSectionId);

      if (deleteError) {
        console.error('Error deleting business paragraphs:', deleteError);
        return { success: false, error: deleteError.message };
      }

      // Insert the new paragraphs
      if (paragraphs.length > 0) {
        const paragraphsWithBusinessId = paragraphs.map(paragraph => ({
          ...paragraph,
          business_section_id: businessSectionId
        }));

        const { error: insertError } = await supabase
          .from('business_paragraphs')
          .insert(paragraphsWithBusinessId);

        if (insertError) {
          console.error('Error inserting business paragraphs:', insertError);
          return { success: false, error: insertError.message };
        }
      }
    } else {
      // Update existing paragraphs in place
      console.log('Updating existing paragraphs in place');

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        const existingParagraph = existingParagraphs[i];

        const { error: updateError } = await supabase
          .from('business_paragraphs')
          .update({
            content: paragraph.content,
            display_order: paragraph.display_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingParagraph.id);

        if (updateError) {
          console.error(`Error updating paragraph ${existingParagraph.id}:`, updateError);
          return { success: false, error: updateError.message };
        }
      }
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in updateBusinessParagraphs:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Updates stats for a business section
 */
export async function updateBusinessStats(
  businessSectionId: string,
  stats: BusinessStatInput[]
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Updating stats for business section:', businessSectionId);

    // Get existing stats to determine which ones to update, delete, or insert
    const { data: existingStats, error: fetchError } = await supabase
      .from('business_stats')
      .select('id, display_order')
      .eq('business_section_id', businessSectionId)
      .order('display_order', { ascending: true });

    if (fetchError) {
      console.error('Error fetching existing stats:', fetchError);
      return { success: false, error: fetchError.message };
    }

    console.log('Found existing stats:', existingStats?.length || 0);

    // If there are no existing stats or we're replacing all content, use the simple approach
    if (!existingStats || existingStats.length === 0 || existingStats.length !== stats.length) {
      console.log('Using delete-and-insert approach for stats');

      // Delete all existing stats
      const { error: deleteError } = await supabase
        .from('business_stats')
        .delete()
        .eq('business_section_id', businessSectionId);

      if (deleteError) {
        console.error('Error deleting business stats:', deleteError);
        return { success: false, error: deleteError.message };
      }

      // Insert the new stats
      if (stats.length > 0) {
        const statsWithBusinessId = stats.map(stat => ({
          ...stat,
          business_section_id: businessSectionId
        }));

        const { error: insertError } = await supabase
          .from('business_stats')
          .insert(statsWithBusinessId);

        if (insertError) {
          console.error('Error inserting business stats:', insertError);
          return { success: false, error: insertError.message };
        }
      }
    } else {
      // Update existing stats in place
      console.log('Updating existing stats in place');

      for (let i = 0; i < stats.length; i++) {
        const stat = stats[i];
        const existingStat = existingStats[i];

        const { error: updateError } = await supabase
          .from('business_stats')
          .update({
            value: stat.value,
            label: stat.label,
            sublabel: stat.sublabel,
            display_order: stat.display_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingStat.id);

        if (updateError) {
          console.error(`Error updating stat ${existingStat.id}:`, updateError);
          return { success: false, error: updateError.message };
        }
      }
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in updateBusinessStats:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Creates or updates a business section with its paragraphs and stats
 */
export async function saveBusinessSection(
  businessData: BusinessSectionWithDetails,
  existingId?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    console.log('Saving business section with existingId:', existingId);

    // Extract paragraphs and stats from the business data
    const { paragraphs, stats, ...businessSectionData } = businessData;

    let businessSectionId = existingId;
    let isNewSection = false;

    if (existingId) {
      // Check if the section exists
      const { data: existingSection, error: checkError } = await supabase
        .from('business_sections')
        .select('id')
        .eq('id', existingId)
        .single();

      if (checkError || !existingSection) {
        console.log('Existing section not found, will create new one');
        isNewSection = true;
      } else {
        console.log('Updating existing section with ID:', existingId);

        // Update existing business section
        const { error } = await supabase
          .from('business_sections')
          .update({
            ...businessSectionData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingId);

        if (error) {
          console.error('Error updating business section:', error);
          return { success: false, error: error.message };
        }
      }
    } else {
      isNewSection = true;
    }

    if (isNewSection) {
      console.log('Creating new business section');

      // First, check if there's an active section we should update instead
      const { data: activeSection, error: activeError } = await supabase
        .from('business_sections')
        .select('id')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!activeError && activeSection) {
        // Update the existing active section instead of creating a new one
        console.log('Found active section, updating instead of creating new:', activeSection.id);
        businessSectionId = activeSection.id;

        const { error } = await supabase
          .from('business_sections')
          .update({
            ...businessSectionData,
            updated_at: new Date().toISOString()
          })
          .eq('id', activeSection.id);

        if (error) {
          console.error('Error updating active business section:', error);
          return { success: false, error: error.message };
        }
      } else {
        // Create new business section
        const { data, error } = await supabase
          .from('business_sections')
          .insert({
            ...businessSectionData,
            is_active: true
          })
          .select('id')
          .single();

        if (error) {
          console.error('Error creating business section:', error);
          return { success: false, error: error.message };
        }

        businessSectionId = data.id;
      }
    }

    if (!businessSectionId) {
      console.error('Failed to get business section ID');
      return { success: false, error: 'Failed to get business section ID' };
    }

    // Update paragraphs
    const paragraphsResult = await updateBusinessParagraphs(businessSectionId, paragraphs);
    if (!paragraphsResult.success) {
      return paragraphsResult;
    }

    // Update stats
    const statsResult = await updateBusinessStats(businessSectionId, stats);
    if (!statsResult.success) {
      return statsResult;
    }

    console.log('Business section saved successfully with ID:', businessSectionId);
    return { success: true, id: businessSectionId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unexpected error in saveBusinessSection:', error);
    return { success: false, error: errorMessage };
  }
}
