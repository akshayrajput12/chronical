import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Types for expo pavilion paragraph section
export interface ExpoPavilionParagraphSection {
  id?: string;
  paragraph_content: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Expo Pavilion Paragraph Section Services
export const getExpoPavilionParagraphSection = async (): Promise<ExpoPavilionParagraphSection | null> => {
  const { data, error } = await supabase
    .rpc('get_expo_pavilion_paragraph_section')
    .single();

  if (error) {
    console.error('Error fetching expo pavilion paragraph section:', error);
    return null;
  }

  return data as ExpoPavilionParagraphSection | null;
};

export const saveExpoPavilionParagraphSection = async (paragraphContent: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('save_expo_pavilion_paragraph_section', {
        p_paragraph_content: paragraphContent
      });

    if (error) {
      console.error('Error saving expo pavilion paragraph section:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveExpoPavilionParagraphSection:', error);
    return false;
  }
};
