// ============================================================================
// EVENTS PORTFOLIO SERVICE
// ============================================================================
// Service for managing events portfolio images
// Created: 2025-07-18

import { createClient } from '@/lib/supabase/client';
import {
  EventsPortfolioImage,
  EventsPortfolioImageInput,
  EventsPortfolioUploadData,
  EventsPortfolioUploadResponse,
  EventsPortfolioDeleteResponse,
  EventsPortfolioApiResponse,
  EventsPortfolioFilter,
  EventsPortfolioFileValidation,
  EventsPortfolioReorderItem,
  EventsPortfolioSearchResult,
  EventsPortfolioAdminStats,
  EventsPortfolioError,
  EVENTS_PORTFOLIO_CONSTANTS,
  isValidImageFile,
  isValidEventType,
} from '@/types/events-portfolio';

class EventsPortfolioService {
  private supabase = createClient();

  // ============================================================================
  // FILE VALIDATION
  // ============================================================================

  validateFile(file: File): EventsPortfolioFileValidation {
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (!isValidImageFile(file)) {
      if (!EVENTS_PORTFOLIO_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.type as any)) {
        return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
      }
      if (file.size === 0) {
        return { isValid: false, error: 'File is empty' };
      }
      if (file.size > EVENTS_PORTFOLIO_CONSTANTS.MAX_FILE_SIZE) {
        return { 
          isValid: false, 
          error: `File size must be less than ${EVENTS_PORTFOLIO_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB` 
        };
      }
    }

    return { 
      isValid: true, 
      size: file.size, 
      type: file.type 
    };
  }

  // Get image dimensions from file
  private async getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      
      img.src = url;
    });
  }

  // ============================================================================
  // IMAGE RETRIEVAL
  // ============================================================================

  async getImages(filter?: EventsPortfolioFilter): Promise<EventsPortfolioImage[]> {
    try {
      let query = this.supabase
        .from('events_portfolio_images')
        .select('*');

      // Apply filters
      if (filter?.is_active !== undefined) {
        query = query.eq('is_active', filter.is_active);
      }

      if (filter?.is_featured !== undefined) {
        query = query.eq('is_featured', filter.is_featured);
      }

      if (filter?.event_type) {
        query = query.eq('event_type', filter.event_type);
      }

      if (filter?.search) {
        query = query.or(`title.ilike.%${filter.search}%,description.ilike.%${filter.search}%,event_name.ilike.%${filter.search}%`);
      }

      if (filter?.tags && filter.tags.length > 0) {
        query = query.overlaps('tags', filter.tags);
      }

      // Apply sorting
      const sortBy = filter?.sortBy || 'display_order';
      const sortOrder = filter?.sortOrder || 'asc';
      
      if (sortBy === 'display_order') {
        query = query.order('display_order', { ascending: sortOrder === 'asc' })
                    .order('created_at', { ascending: false });
      } else {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }

      // Apply pagination
      if (filter?.limit) {
        query = query.limit(filter.limit);
      }
      if (filter?.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new EventsPortfolioError('Failed to fetch images', error.code, error);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching events portfolio images:', error);
      if (error instanceof EventsPortfolioError) {
        throw error;
      }
      throw new EventsPortfolioError('Failed to fetch images');
    }
  }

  async getImageById(id: string): Promise<EventsPortfolioImage | null> {
    try {
      const { data, error } = await this.supabase
        .from('events_portfolio_images')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new EventsPortfolioError('Failed to fetch image', error.code, error);
      }

      return data;
    } catch (error) {
      console.error('Error fetching events portfolio image by ID:', error);
      if (error instanceof EventsPortfolioError) {
        throw error;
      }
      throw new EventsPortfolioError('Failed to fetch image');
    }
  }

  // ============================================================================
  // IMAGE UPLOAD
  // ============================================================================

  async uploadImage(uploadData: EventsPortfolioUploadData): Promise<EventsPortfolioUploadResponse> {
    try {
      // Validate file
      const validation = this.validateFile(uploadData.file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Get image dimensions
      const dimensions = await this.getImageDimensions(uploadData.file);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = uploadData.file.name.split('.').pop();
      const filename = `events-portfolio-${timestamp}-${randomString}.${fileExtension}`;
      const filePath = `portfolio/${filename}`;

      // Upload file to storage
      const { data: uploadResult, error: uploadError } = await this.supabase.storage
        .from(EVENTS_PORTFOLIO_CONSTANTS.STORAGE_BUCKET)
        .upload(filePath, uploadData.file, {
          contentType: uploadData.file.type,
          upsert: false
        });

      if (uploadError) {
        throw new EventsPortfolioError('Failed to upload file to storage', uploadError.message, uploadError);
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from(EVENTS_PORTFOLIO_CONSTANTS.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      // Validate event_type if provided
      if (uploadData.event_type && !isValidEventType(uploadData.event_type)) {
        throw new EventsPortfolioError('Invalid event type');
      }

      // Create database record
      const imageData = {
        filename,
        original_filename: uploadData.file.name,
        file_path: filePath,
        file_size: uploadData.file.size,
        mime_type: uploadData.file.type,
        width: dimensions?.width || null,
        height: dimensions?.height || null,
        title: uploadData.title || EVENTS_PORTFOLIO_CONSTANTS.DEFAULT_TITLE,
        description: uploadData.description || null,
        alt_text: uploadData.alt_text || uploadData.title || EVENTS_PORTFOLIO_CONSTANTS.DEFAULT_ALT_TEXT,
        caption: uploadData.caption || null,
        event_name: uploadData.event_name || null,
        event_date: uploadData.event_date || null,
        event_location: uploadData.event_location || null,
        event_type: uploadData.event_type || null,
        is_active: uploadData.is_active ?? true,
        is_featured: uploadData.is_featured ?? false,
        display_order: uploadData.display_order || 0,
        tags: uploadData.tags || null,
        seo_keywords: uploadData.seo_keywords || null,
      };

      const { data: image, error: dbError } = await this.supabase
        .from('events_portfolio_images')
        .insert(imageData)
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await this.supabase.storage
          .from(EVENTS_PORTFOLIO_CONSTANTS.STORAGE_BUCKET)
          .remove([filePath]);
        
        throw new EventsPortfolioError('Failed to save image record', dbError.code, dbError);
      }

      return {
        success: true,
        data: {
          image,
          url: publicUrl,
          path: filePath
        }
      };
    } catch (error) {
      console.error('Error uploading events portfolio image:', error);
      if (error instanceof EventsPortfolioError) {
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Failed to upload image'
      };
    }
  }

  // ============================================================================
  // IMAGE MANAGEMENT
  // ============================================================================

  async updateImage(id: string, updateData: EventsPortfolioImageInput): Promise<EventsPortfolioApiResponse<EventsPortfolioImage>> {
    try {
      // Validate event_type if provided
      if (updateData.event_type && !isValidEventType(updateData.event_type)) {
        return {
          success: false,
          error: 'Invalid event type'
        };
      }

      const { data, error } = await this.supabase
        .from('events_portfolio_images')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new EventsPortfolioError('Failed to update image', error.code, error);
      }

      return {
        success: true,
        data,
        message: 'Image updated successfully'
      };
    } catch (error) {
      console.error('Error updating events portfolio image:', error);
      if (error instanceof EventsPortfolioError) {
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Failed to update image'
      };
    }
  }

  async deleteImage(id: string): Promise<EventsPortfolioDeleteResponse> {
    try {
      // First get the image to get file path
      const image = await this.getImageById(id);
      if (!image) {
        return {
          success: false,
          error: 'Image not found'
        };
      }

      // Delete from database first
      const { error: dbError } = await this.supabase
        .from('events_portfolio_images')
        .delete()
        .eq('id', id);

      if (dbError) {
        throw new EventsPortfolioError('Failed to delete image record', dbError.code, dbError);
      }

      // Delete file from storage
      const { error: storageError } = await this.supabase.storage
        .from(EVENTS_PORTFOLIO_CONSTANTS.STORAGE_BUCKET)
        .remove([image.file_path]);

      if (storageError) {
        console.warn('Failed to delete file from storage:', storageError);
        // Don't fail the operation if storage deletion fails
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting events portfolio image:', error);
      if (error instanceof EventsPortfolioError) {
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Failed to delete image'
      };
    }
  }

  // ============================================================================
  // REORDER AND FEATURED MANAGEMENT
  // ============================================================================

  async reorderImages(items: EventsPortfolioReorderItem[]): Promise<EventsPortfolioApiResponse<boolean>> {
    try {
      const imageIds = items.map(item => item.id);
      const newOrders = items.map(item => item.display_order);

      const { data, error } = await this.supabase
        .rpc('reorder_events_portfolio_images', {
          image_ids: imageIds,
          new_orders: newOrders
        });

      if (error) {
        throw new EventsPortfolioError('Failed to reorder images', error.code, error);
      }

      if (!data) {
        return {
          success: false,
          error: 'Failed to reorder images'
        };
      }

      return {
        success: true,
        data: true,
        message: 'Images reordered successfully'
      };
    } catch (error) {
      console.error('Error reordering events portfolio images:', error);
      if (error instanceof EventsPortfolioError) {
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Failed to reorder images'
      };
    }
  }

  async toggleFeatured(id: string): Promise<EventsPortfolioApiResponse<boolean>> {
    try {
      const { data, error } = await this.supabase
        .rpc('toggle_events_portfolio_featured', { image_id: id });

      if (error) {
        throw new EventsPortfolioError('Failed to toggle featured status', error.code, error);
      }

      if (!data) {
        return {
          success: false,
          error: 'Image not found'
        };
      }

      return {
        success: true,
        data: true,
        message: 'Featured status updated successfully'
      };
    } catch (error) {
      console.error('Error toggling featured status:', error);
      if (error instanceof EventsPortfolioError) {
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Failed to toggle featured status'
      };
    }
  }

  // ============================================================================
  // SEARCH AND STATISTICS
  // ============================================================================

  async searchImages(term: string, limit: number = 20): Promise<EventsPortfolioSearchResult[]> {
    try {
      const { data, error } = await this.supabase
        .rpc('search_events_portfolio_images', {
          search_term: term,
          limit_count: limit
        });

      if (error) {
        throw new EventsPortfolioError('Failed to search images', error.code, error);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching events portfolio images:', error);
      if (error instanceof EventsPortfolioError) {
        throw error;
      }
      throw new EventsPortfolioError('Failed to search images');
    }
  }

  async getStats(): Promise<EventsPortfolioAdminStats> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_events_portfolio_stats');

      if (error) {
        throw new EventsPortfolioError('Failed to get statistics', error.code, error);
      }

      const stats = data?.[0];
      if (!stats) {
        return {
          totalImages: 0,
          activeImages: 0,
          featuredImages: 0,
          totalSize: 0,
          eventTypesBreakdown: {}
        };
      }

      return {
        totalImages: stats.total_images || 0,
        activeImages: stats.active_images || 0,
        featuredImages: stats.featured_images || 0,
        totalSize: stats.total_size_bytes || 0,
        eventTypesBreakdown: stats.event_types_count || {}
      };
    } catch (error) {
      console.error('Error getting events portfolio statistics:', error);
      if (error instanceof EventsPortfolioError) {
        throw error;
      }
      throw new EventsPortfolioError('Failed to get statistics');
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getDownloadUrl(image: EventsPortfolioImage): string {
    const { data: { publicUrl } } = this.supabase.storage
      .from(EVENTS_PORTFOLIO_CONSTANTS.STORAGE_BUCKET)
      .getPublicUrl(image.file_path);

    return publicUrl;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get active images for frontend display
  async getActiveImages(limit?: number, featured_only: boolean = false): Promise<EventsPortfolioImage[]> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_active_events_portfolio_images', {
          limit_count: limit || null,
          offset_count: 0,
          event_type_filter: null,
          featured_only
        });

      if (error) {
        throw new EventsPortfolioError('Failed to fetch active images', error.code, error);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching active events portfolio images:', error);
      if (error instanceof EventsPortfolioError) {
        throw error;
      }
      throw new EventsPortfolioError('Failed to fetch active images');
    }
  }
}

// Export singleton instance
export const eventsPortfolioService = new EventsPortfolioService();
