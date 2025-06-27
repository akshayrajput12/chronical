import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Types for custom exhibition stands data
export interface CustomExhibitionHero {
  id?: string;
  title: string;
  subtitle: string;
  background_image_id?: string;
  background_image_url?: string;
  background_image_alt?: string;
  is_active: boolean;
}

export interface CustomExhibitionLeadingContractor {
  id?: string;
  title: string;
  paragraph_1: string;
  paragraph_2: string;
  is_active: boolean;
}

export interface CustomExhibitionPromoteBrand {
  id?: string;
  title: string;
  paragraph_1: string;
  paragraph_2: string;
  paragraph_3: string;
  cta_text: string;
  cta_url: string;
  image_id?: string;
  image_url?: string;
  image_alt?: string;
  is_active: boolean;
}

export interface CustomExhibitionStrikingCustomized {
  id?: string;
  title: string;
  paragraph_1: string;
  paragraph_2: string;
  image_id?: string;
  image_url?: string;
  image_alt?: string;
  is_active: boolean;
}

export interface CustomExhibitionReasonsToChoose {
  id?: string;
  title: string;
  paragraph_1: string;
  paragraph_2: string;
  is_active: boolean;
}

export interface CustomExhibitionFAQSection {
  id?: string;
  title: string;
  is_active: boolean;
}

export interface CustomExhibitionFAQItem {
  id?: string;
  question: string;
  answer: string;
  list_items?: string[];
  display_order: number;
  is_active: boolean;
}

export interface CustomExhibitionLookingForStands {
  id?: string;
  title: string;
  phone_number: string;
  phone_display: string;
  cta_text: string;
  background_color: string;
  is_active: boolean;
}

export interface CustomExhibitionImage {
  id?: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  alt_text: string;
  caption?: string;
  section_type?: 'hero' | 'promote_brand' | 'striking_customized';
  is_active: boolean;
  uploaded_by?: string;
}

// Hero Section Services
export const getCustomExhibitionHero = async (): Promise<CustomExhibitionHero | null> => {
  const { data, error } = await supabase
    .from('custom_exhibition_hero')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching custom exhibition hero:', error);
    return null;
  }

  return data;
};

export const saveCustomExhibitionHero = async (heroData: Partial<CustomExhibitionHero>): Promise<boolean> => {
  try {
    // First, deactivate all existing records
    await supabase
      .from('custom_exhibition_hero')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Then insert or update the new record
    const { error } = await supabase
      .from('custom_exhibition_hero')
      .upsert({
        ...heroData,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving custom exhibition hero:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomExhibitionHero:', error);
    return false;
  }
};

// Leading Contractor Section Services
export const getCustomExhibitionLeadingContractor = async (): Promise<CustomExhibitionLeadingContractor | null> => {
  const { data, error } = await supabase
    .from('custom_exhibition_leading_contractor')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching custom exhibition leading contractor:', error);
    return null;
  }

  return data;
};

export const saveCustomExhibitionLeadingContractor = async (data: Partial<CustomExhibitionLeadingContractor>): Promise<boolean> => {
  try {
    // First, deactivate all existing records
    await supabase
      .from('custom_exhibition_leading_contractor')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Then insert or update the new record
    const { error } = await supabase
      .from('custom_exhibition_leading_contractor')
      .upsert({
        ...data,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving custom exhibition leading contractor:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomExhibitionLeadingContractor:', error);
    return false;
  }
};

// Promote Brand Section Services
export const getCustomExhibitionPromoteBrand = async (): Promise<CustomExhibitionPromoteBrand | null> => {
  const { data, error } = await supabase
    .from('custom_exhibition_promote_brand')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching custom exhibition promote brand:', error);
    return null;
  }

  return data;
};

export const saveCustomExhibitionPromoteBrand = async (data: Partial<CustomExhibitionPromoteBrand>): Promise<boolean> => {
  try {
    // First, deactivate all existing records
    await supabase
      .from('custom_exhibition_promote_brand')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Then insert or update the new record
    const { error } = await supabase
      .from('custom_exhibition_promote_brand')
      .upsert({
        ...data,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving custom exhibition promote brand:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomExhibitionPromoteBrand:', error);
    return false;
  }
};

// Striking Customized Section Services
export const getCustomExhibitionStrikingCustomized = async (): Promise<CustomExhibitionStrikingCustomized | null> => {
  const { data, error } = await supabase
    .from('custom_exhibition_striking_customized')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching custom exhibition striking customized:', error);
    return null;
  }

  return data;
};

export const saveCustomExhibitionStrikingCustomized = async (data: Partial<CustomExhibitionStrikingCustomized>): Promise<boolean> => {
  try {
    // First, deactivate all existing records
    await supabase
      .from('custom_exhibition_striking_customized')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Then insert or update the new record
    const { error } = await supabase
      .from('custom_exhibition_striking_customized')
      .upsert({
        ...data,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving custom exhibition striking customized:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomExhibitionStrikingCustomized:', error);
    return false;
  }
};

// Reasons to Choose Section Services
export const getCustomExhibitionReasonsToChoose = async (): Promise<CustomExhibitionReasonsToChoose | null> => {
  const { data, error } = await supabase
    .from('custom_exhibition_reasons_to_choose')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching custom exhibition reasons to choose:', error);
    return null;
  }

  return data;
};

export const saveCustomExhibitionReasonsToChoose = async (data: Partial<CustomExhibitionReasonsToChoose>): Promise<boolean> => {
  try {
    // First, deactivate all existing records
    await supabase
      .from('custom_exhibition_reasons_to_choose')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Then insert or update the new record
    const { error } = await supabase
      .from('custom_exhibition_reasons_to_choose')
      .upsert({
        ...data,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving custom exhibition reasons to choose:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomExhibitionReasonsToChoose:', error);
    return false;
  }
};

// FAQ Section Services
export const getCustomExhibitionFAQSection = async (): Promise<CustomExhibitionFAQSection | null> => {
  const { data, error } = await supabase
    .from('custom_exhibition_faq_section')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching custom exhibition FAQ section:', error);
    return null;
  }

  return data;
};

export const getCustomExhibitionFAQItems = async (): Promise<CustomExhibitionFAQItem[]> => {
  const { data, error } = await supabase
    .from('custom_exhibition_faq_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching custom exhibition FAQ items:', error);
    return [];
  }

  return data || [];
};

export const saveCustomExhibitionFAQSection = async (data: Partial<CustomExhibitionFAQSection>): Promise<boolean> => {
  try {
    // First, deactivate all existing records
    await supabase
      .from('custom_exhibition_faq_section')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Then insert or update the new record
    const { error } = await supabase
      .from('custom_exhibition_faq_section')
      .upsert({
        ...data,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving custom exhibition FAQ section:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomExhibitionFAQSection:', error);
    return false;
  }
};

export const saveCustomExhibitionFAQItem = async (data: Partial<CustomExhibitionFAQItem>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('custom_exhibition_faq_items')
      .upsert({
        ...data,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving custom exhibition FAQ item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomExhibitionFAQItem:', error);
    return false;
  }
};

export const deleteCustomExhibitionFAQItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('custom_exhibition_faq_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting custom exhibition FAQ item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCustomExhibitionFAQItem:', error);
    return false;
  }
};

// Looking for Stands Section Services
export const getCustomExhibitionLookingForStands = async (): Promise<CustomExhibitionLookingForStands | null> => {
  const { data, error } = await supabase
    .from('custom_exhibition_looking_for_stands')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching custom exhibition looking for stands:', error);
    return null;
  }

  return data;
};

export const saveCustomExhibitionLookingForStands = async (data: Partial<CustomExhibitionLookingForStands>): Promise<boolean> => {
  try {
    // First, deactivate all existing records
    await supabase
      .from('custom_exhibition_looking_for_stands')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Then insert or update the new record
    const { error } = await supabase
      .from('custom_exhibition_looking_for_stands')
      .upsert({
        ...data,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving custom exhibition looking for stands:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomExhibitionLookingForStands:', error);
    return false;
  }
};

// Image Management Services
export const uploadCustomExhibitionImage = async (
  file: File,
  sectionType: 'hero' | 'promote_brand' | 'striking_customized',
  altText: string = 'Custom exhibition stands image'
): Promise<CustomExhibitionImage | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${sectionType}/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('custom-exhibition-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    // Save image metadata to database
    const imageData: Partial<CustomExhibitionImage> = {
      filename: fileName,
      original_filename: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      alt_text: altText,
      section_type: sectionType,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('custom_exhibition_images')
      .insert(imageData)
      .select()
      .single();

    if (error) {
      console.error('Error saving image metadata:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in uploadCustomExhibitionImage:', error);
    return null;
  }
};

export const deleteCustomExhibitionImage = async (id: string): Promise<boolean> => {
  try {
    // First get the image data to get the file path
    const { data: imageData, error: fetchError } = await supabase
      .from('custom_exhibition_images')
      .select('file_path')
      .eq('id', id)
      .single();

    if (fetchError || !imageData) {
      console.error('Error fetching image data:', fetchError);
      return false;
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('custom-exhibition-images')
      .remove([imageData.file_path]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('custom_exhibition_images')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('Error deleting from database:', dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCustomExhibitionImage:', error);
    return false;
  }
};

// Get all page data at once
export const getCustomExhibitionPageData = async () => {
  const { data, error } = await supabase.rpc('get_custom_exhibition_page_data');

  if (error) {
    console.error('Error fetching custom exhibition page data:', error);
    return null;
  }

  return data;
};
