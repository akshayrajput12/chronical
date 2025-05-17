import { supabase } from '@/lib/supabase';
import { createClient } from '@/lib/supabase/client';
import {
  InstagramFeedSection,
  InstagramPost,
  InstagramPostInput
} from '@/types/instagram-feed';

export class InstagramFeedService {
  /**
   * Fetches the active Instagram feed section
   */
  static async getInstagramFeedSection(): Promise<InstagramFeedSection | null> {
    try {
      const { data, error } = await supabase
        .from('instagram_feed_section')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching Instagram feed section:', error);
        return null;
      }

      return data as InstagramFeedSection;
    } catch (error) {
      console.error('Error in getInstagramFeedSection:', error);
      return null;
    }
  }

  /**
   * Fetches all Instagram posts for a section
   */
  static async getInstagramPosts(sectionId: string): Promise<InstagramPost[]> {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('section_id', sectionId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching Instagram posts:', error);
        return [];
      }

      return data as InstagramPost[];
    } catch (error) {
      console.error('Error in getInstagramPosts:', error);
      return [];
    }
  }

  /**
   * Updates an existing Instagram feed section
   */
  static async updateInstagramFeedSection(section: InstagramFeedSection): Promise<InstagramFeedSection | null> {
    try {
      const { data, error } = await supabase
        .from('instagram_feed_section')
        .update({
          title: section.title,
          subtitle: section.subtitle,
          instagram_handle: section.instagram_handle,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating Instagram feed section:', error);
        return null;
      }

      return data as InstagramFeedSection;
    } catch (error) {
      console.error('Error in updateInstagramFeedSection:', error);
      return null;
    }
  }

  /**
   * Adds a new Instagram post
   */
  static async addInstagramPost(post: InstagramPostInput): Promise<InstagramPost | null> {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .insert({
          section_id: post.section_id,
          image_url: post.image_url,
          caption: post.caption,
          subcaption: post.subcaption || null,
          tag: post.tag || null,
          redirect_url: post.redirect_url || null,
          display_order: post.display_order,
          is_active: post.is_active
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error adding Instagram post:', error);
        return null;
      }

      return data as InstagramPost;
    } catch (error) {
      console.error('Error in addInstagramPost:', error);
      return null;
    }
  }

  /**
   * Updates an existing Instagram post
   */
  static async updateInstagramPost(post: InstagramPost): Promise<InstagramPost | null> {
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .update({
          image_url: post.image_url,
          caption: post.caption,
          subcaption: post.subcaption,
          tag: post.tag,
          redirect_url: post.redirect_url,
          display_order: post.display_order,
          is_active: post.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating Instagram post:', error);
        return null;
      }

      return data as InstagramPost;
    } catch (error) {
      console.error('Error in updateInstagramPost:', error);
      return null;
    }
  }

  /**
   * Deletes an Instagram post
   */
  static async deleteInstagramPost(postId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('instagram_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting Instagram post:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteInstagramPost:', error);
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
        .from('instagram-feed-images')
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
        .from('instagram-feed-images')
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
        .from('instagram-feed-images')
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

  /**
   * Reorders Instagram posts
   */
  static async reorderInstagramPosts(posts: { id: string, display_order: number }[]): Promise<boolean> {
    try {
      // Use a transaction to update all posts at once
      const updates = posts.map(post => ({
        id: post.id,
        display_order: post.display_order
      }));

      const { error } = await supabase
        .from('instagram_posts')
        .upsert(updates, { onConflict: 'id' });

      if (error) {
        console.error('Error reordering Instagram posts:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in reorderInstagramPosts:', error);
      return false;
    }
  }
}
