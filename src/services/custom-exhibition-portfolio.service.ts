import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Types for custom exhibition portfolio data
export interface CustomExhibitionPortfolioSection {
  id?: string;
  created_at?: string;
  updated_at?: string;
  section_title: string;
  main_title: string;
  description: string;
  cta_text: string;
  cta_url: string;
  is_active: boolean;
}

export interface CustomExhibitionPortfolioItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  description?: string;
  client_name?: string;
  project_year?: number;
  project_location?: string;
  image_url: string;
  image_alt: string;
  category?: string;
  tags?: string[];
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  image_file_path?: string;
  image_file_size?: number;
  uploaded_by?: string;
}

export interface CustomExhibitionPortfolioData {
  section: CustomExhibitionPortfolioSection | null;
  items: CustomExhibitionPortfolioItem[];
}

// Portfolio Section Services
export const getCustomExhibitionPortfolioSection = async (): Promise<CustomExhibitionPortfolioSection | null> => {
  const { data, error } = await supabase
    .from('custom_exhibition_portfolio_section')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching custom exhibition portfolio section:', error);
    return null;
  }

  return data;
};

export const saveCustomExhibitionPortfolioSection = async (sectionData: Partial<CustomExhibitionPortfolioSection>): Promise<boolean> => {
  try {
    // First, deactivate all existing records
    await supabase
      .from('custom_exhibition_portfolio_section')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Then insert or update the new record
    const { error } = await supabase
      .from('custom_exhibition_portfolio_section')
      .upsert({
        ...sectionData,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving custom exhibition portfolio section:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomExhibitionPortfolioSection:', error);
    return false;
  }
};

// Portfolio Items Services
export const getCustomExhibitionPortfolioItems = async (): Promise<CustomExhibitionPortfolioItem[]> => {
  const { data, error } = await supabase
    .from('custom_exhibition_portfolio_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching custom exhibition portfolio items:', error);
    return [];
  }

  return data || [];
};

export const saveCustomExhibitionPortfolioItem = async (itemData: Partial<CustomExhibitionPortfolioItem>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('custom_exhibition_portfolio_items')
      .upsert({
        ...itemData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving custom exhibition portfolio item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomExhibitionPortfolioItem:', error);
    return false;
  }
};

export const deleteCustomExhibitionPortfolioItem = async (id: string): Promise<boolean> => {
  try {
    // First get the item data to get the file path if it exists
    const { data: itemData, error: fetchError } = await supabase
      .from('custom_exhibition_portfolio_items')
      .select('image_file_path')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching portfolio item data:', fetchError);
    }

    // Delete from storage if file path exists
    if (itemData?.image_file_path) {
      const { error: storageError } = await supabase.storage
        .from('custom-exhibition-portfolio')
        .remove([itemData.image_file_path]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
      }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('custom_exhibition_portfolio_items')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('Error deleting portfolio item from database:', dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCustomExhibitionPortfolioItem:', error);
    return false;
  }
};

// Image Upload Service
export const uploadCustomExhibitionPortfolioImage = async (
  file: File,
  altText: string = 'Portfolio project image'
): Promise<CustomExhibitionPortfolioItem | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `portfolio/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('custom-exhibition-portfolio')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading portfolio image:', uploadError);
      return null;
    }

    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('custom-exhibition-portfolio')
      .getPublicUrl(filePath);

    // Return the image data (not saved to database yet)
    return {
      title: 'New Portfolio Item',
      image_url: publicUrl,
      image_alt: altText,
      image_file_path: filePath,
      image_file_size: file.size,
      display_order: 1,
      is_featured: false,
      is_active: true,
    };
  } catch (error) {
    console.error('Error in uploadCustomExhibitionPortfolioImage:', error);
    return null;
  }
};

// Get complete portfolio data
export const getCustomExhibitionPortfolioData = async (): Promise<CustomExhibitionPortfolioData | null> => {
  try {
    const [sectionData, itemsData] = await Promise.all([
      getCustomExhibitionPortfolioSection(),
      getCustomExhibitionPortfolioItems(),
    ]);

    return {
      section: sectionData,
      items: itemsData,
    };
  } catch (error) {
    console.error('Error fetching complete portfolio data:', error);
    return null;
  }
};

// Get featured portfolio items only
export const getFeaturedPortfolioItems = async (): Promise<CustomExhibitionPortfolioItem[]> => {
  const { data, error } = await supabase
    .from('custom_exhibition_portfolio_items')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching featured portfolio items:', error);
    return [];
  }

  return data || [];
};

// Update display order for portfolio items
export const updatePortfolioItemsOrder = async (items: { id: string; display_order: number }[]): Promise<boolean> => {
  try {
    const updates = items.map(item => 
      supabase
        .from('custom_exhibition_portfolio_items')
        .update({ display_order: item.display_order })
        .eq('id', item.id)
    );

    const results = await Promise.all(updates);
    
    // Check if any updates failed
    const hasErrors = results.some(result => result.error);
    
    if (hasErrors) {
      console.error('Error updating portfolio items order');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updatePortfolioItemsOrder:', error);
    return false;
  }
};

// Get portfolio items by category
export const getPortfolioItemsByCategory = async (category: string): Promise<CustomExhibitionPortfolioItem[]> => {
  const { data, error } = await supabase
    .from('custom_exhibition_portfolio_items')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching portfolio items by category:', error);
    return [];
  }

  return data || [];
};

// Search portfolio items
export const searchPortfolioItems = async (searchTerm: string): Promise<CustomExhibitionPortfolioItem[]> => {
  const { data, error } = await supabase
    .from('custom_exhibition_portfolio_items')
    .select('*')
    .eq('is_active', true)
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,client_name.ilike.%${searchTerm}%`)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error searching portfolio items:', error);
    return [];
  }

  return data || [];
};
