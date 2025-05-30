import { supabase } from '@/lib/supabase';
import {
  HeroSection,
  HeroSectionInput,
  HeroTypingTextInput,
  HeroSectionWithTypingTexts
} from '@/types/hero';

/**
 * Fetches the active hero section with its typing texts
 */
export async function getHeroSection(): Promise<HeroSection | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_hero_section');

    if (error) {
      console.error('Error fetching hero section:', error);
      return null;
    }

    return data[0] as HeroSection;
  } catch (error) {
    console.error('Error in getHeroSection:', error);
    return null;
  }
}

/**
 * Updates an existing hero section
 */
export async function updateHeroSection(
  id: string,
  heroData: HeroSectionInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('hero_sections')
      .update(heroData)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Creates a new hero section
 */
export async function createHeroSection(
  heroData: HeroSectionInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('hero_sections')
      .insert(heroData)
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Updates typing texts for a hero section
 */
export async function updateTypingTexts(
  heroSectionId: string,
  typingTexts: HeroTypingTextInput[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, delete all existing typing texts for this hero section
    const { error: deleteError } = await supabase
      .from('hero_typing_texts')
      .delete()
      .eq('hero_section_id', heroSectionId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Then, insert the new typing texts
    const typingTextsWithHeroId = typingTexts.map(text => ({
      ...text,
      hero_section_id: heroSectionId
    }));

    const { error: insertError } = await supabase
      .from('hero_typing_texts')
      .insert(typingTextsWithHeroId);

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Creates or updates a hero section with its typing texts
 */
export async function saveHeroSection(
  heroData: HeroSectionWithTypingTexts,
  existingId?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Use direct Supabase client for simplicity and reliability
    // Extract typing texts from the hero data
    const { typing_texts, ...heroSectionData } = heroData;

    let heroSectionId = existingId;

    if (existingId) {
      // Update existing hero section
      const { error } = await supabase
        .from('hero_sections')
        .update(heroSectionData)
        .eq('id', existingId);

      if (error) {
        console.error('Error updating hero section:', error);
        return { success: false, error: error.message };
      }
    } else {
      // Create new hero section
      const { data, error } = await supabase
        .from('hero_sections')
        .insert(heroSectionData)
        .select('id')
        .single();

      if (error) {
        console.error('Error creating hero section:', error);
        return { success: false, error: error.message };
      }

      heroSectionId = data.id;
    }

    if (!heroSectionId) {
      console.error('Failed to get hero section ID');
      return { success: false, error: 'Failed to get hero section ID' };
    }

    // Delete existing typing texts
    const { error: deleteError } = await supabase
      .from('hero_typing_texts')
      .delete()
      .eq('hero_section_id', heroSectionId);

    if (deleteError) {
      console.error('Error deleting typing texts:', deleteError);
      return { success: false, error: deleteError.message };
    }

    // Insert new typing texts
    if (typing_texts.length > 0) {
      const typingTextsWithHeroId = typing_texts.map(text => ({
        ...text,
        hero_section_id: heroSectionId
      }));

      const { error: insertError } = await supabase
        .from('hero_typing_texts')
        .insert(typingTextsWithHeroId);

      if (insertError) {
        console.error('Error inserting typing texts:', insertError);
        return { success: false, error: insertError.message };
      }
    }

    console.log('Hero section saved successfully with ID:', heroSectionId);
    return { success: true, id: heroSectionId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unexpected error in saveHeroSection:', error);
    return { success: false, error: errorMessage };
  }
}

// Note: Video is now static and not stored in the database
