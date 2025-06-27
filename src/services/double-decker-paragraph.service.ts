import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Types for double decker paragraph section
export interface DoubleDeckerParagraphSection {
  id?: string;
  paragraph_content: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Double Decker Paragraph Section Services
export const getDoubleDeckerParagraphSection = async (): Promise<DoubleDeckerParagraphSection | null> => {
  const { data, error } = await supabase
    .rpc('get_double_decker_paragraph_section')
    .single();

  if (error) {
    console.error('Error fetching double decker paragraph section:', error);
    return null;
  }

  return data as DoubleDeckerParagraphSection | null;
};

export const saveDoubleDeckerParagraphSection = async (paragraphContent: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('save_double_decker_paragraph_section', {
        p_paragraph_content: paragraphContent
      });

    if (error) {
      console.error('Error saving double decker paragraph section:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveDoubleDeckerParagraphSection:', error);
    return false;
  }
};
