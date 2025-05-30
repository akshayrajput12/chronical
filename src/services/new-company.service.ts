import { supabase } from '@/lib/supabase';
import { createClient } from '@/lib/supabase/client';
import {
  NewCompanySection,
  NewCompanyImage
} from '@/types/new-company';

export class NewCompanyService {
  /**
   * Fetches the active new company section
   */
  static async getNewCompanySection(): Promise<NewCompanySection | null> {
    try {
      const { data, error } = await supabase
        .from('new_company_section')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching new company section:', error);
        return null;
      }

      return data as NewCompanySection;
    } catch (error) {
      console.error('Error in getNewCompanySection:', error);
      return null;
    }
  }

  /**
   * Fetches all images for a new company section, organized by column
   */
  static async getNewCompanyImagesByColumn(sectionId: string): Promise<Record<number, NewCompanyImage[]>> {
    try {
      const { data, error } = await supabase
        .from('new_company_images')
        .select('*')
        .eq('section_id', sectionId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching new company images:', error);
        return {};
      }

      // Organize images by column
      const imagesByColumn: Record<number, NewCompanyImage[]> = {};

      data.forEach((image: NewCompanyImage) => {
        if (!imagesByColumn[image.column_number]) {
          imagesByColumn[image.column_number] = [];
        }
        imagesByColumn[image.column_number].push(image);
      });

      return imagesByColumn;
    } catch (error) {
      console.error('Error in getNewCompanyImagesByColumn:', error);
      return {};
    }
  }

  /**
   * Updates an existing new company section
   */
  static async updateNewCompanySection(section: NewCompanySection): Promise<NewCompanySection | null> {
    try {
      const { data, error } = await supabase
        .from('new_company_section')
        .update({
          title: section.title,
          subtitle: section.subtitle,
          description_1: section.description_1,
          description_2: section.description_2,
          button_text: section.button_text,
          button_url: section.button_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating new company section:', error);
        return null;
      }

      return data as NewCompanySection;
    } catch (error) {
      console.error('Error in updateNewCompanySection:', error);
      return null;
    }
  }

  /**
   * Adds a new image to the new company section
   */
  static async addNewCompanyImage(image: Omit<NewCompanyImage, 'id' | 'created_at' | 'updated_at'>): Promise<NewCompanyImage | null> {
    try {
      const { data, error } = await supabase
        .from('new_company_images')
        .insert({
          section_id: image.section_id,
          image_url: image.image_url,
          image_alt: image.image_alt,
          column_number: image.column_number,
          display_order: image.display_order,
          is_active: image.is_active
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error adding new company image:', error);
        return null;
      }

      return data as NewCompanyImage;
    } catch (error) {
      console.error('Error in addNewCompanyImage:', error);
      return null;
    }
  }

  /**
   * Updates an existing new company image
   */
  static async updateNewCompanyImage(image: NewCompanyImage): Promise<NewCompanyImage | null> {
    try {
      const { data, error } = await supabase
        .from('new_company_images')
        .update({
          image_alt: image.image_alt,
          display_order: image.display_order,
          is_active: image.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', image.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating new company image:', error);
        return null;
      }

      return data as NewCompanyImage;
    } catch (error) {
      console.error('Error in updateNewCompanyImage:', error);
      return null;
    }
  }

  /**
   * Deletes a new company image
   */
  static async deleteNewCompanyImage(imageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('new_company_images')
        .delete()
        .eq('id', imageId);

      if (error) {
        console.error('Error deleting new company image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteNewCompanyImage:', error);
      return false;
    }
  }

  /**
   * Uploads an image to storage and returns the public URL
   */
  static async uploadImage(file: File, filePath: string): Promise<string | null> {
    try {
      const supabaseClient = createClient();

      const { data, error } = await supabaseClient.storage
        .from('new_company_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      // Get the public URL
      const { data: urlData } = supabaseClient.storage
        .from('new_company_images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  }

  /**
   * Deletes an image from storage
   */
  static async deleteImageFromStorage(filePath: string): Promise<boolean> {
    try {
      const supabaseClient = createClient();

      const { error } = await supabaseClient.storage
        .from('new_company_images')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image from storage:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteImageFromStorage:', error);
      return false;
    }
  }
}
