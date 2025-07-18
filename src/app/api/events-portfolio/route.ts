// ============================================================================
// EVENTS PORTFOLIO API ROUTES
// ============================================================================
// API endpoints for events portfolio image management
// Created: 2025-07-18

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidEventType } from '@/types/events-portfolio';

// ============================================================================
// GET - Retrieve events portfolio images
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const id = searchParams.get('id');
    const active_only = searchParams.get('active_only') === 'true';
    const featured_only = searchParams.get('featured_only') === 'true';
    const event_type = searchParams.get('event_type');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort_by = searchParams.get('sort_by') || 'display_order';
    const sort_order = searchParams.get('sort_order') || 'asc';

    if (id) {
      // Get specific image by ID
      const { data: image, error } = await supabase
        .from('events_portfolio_images')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({
            success: false,
            error: 'Image not found'
          }, { status: 404 });
        }
        throw error;
      }

      // Get download URL
      const { data: { publicUrl } } = supabase.storage
        .from('events-portfolio-images')
        .getPublicUrl(image.file_path);

      return NextResponse.json({
        success: true,
        data: {
          image,
          downloadUrl: publicUrl
        }
      });
    }

    // Build query for multiple images
    let query = supabase
      .from('events_portfolio_images')
      .select('*');

    // Apply filters
    if (active_only) {
      query = query.eq('is_active', true);
    }

    if (featured_only) {
      query = query.eq('is_featured', true);
    }

    if (event_type && isValidEventType(event_type)) {
      query = query.eq('event_type', event_type);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,event_name.ilike.%${search}%`);
    }

    // Apply sorting
    if (sort_by === 'display_order') {
      query = query.order('display_order', { ascending: sort_order === 'asc' })
                  .order('created_at', { ascending: false });
    } else {
      query = query.order(sort_by, { ascending: sort_order === 'asc' });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: images, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: {
        images: images || [],
        total: images?.length || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasMore: (images?.length || 0) === limit
      }
    });

  } catch (error) {
    console.error('Error in GET /api/events-portfolio:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// ============================================================================
// POST - Upload new events portfolio image
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Use service role for admin operations
    const supabase = await createClient(true);

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const alt_text = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    const event_name = formData.get('event_name') as string;
    const event_date = formData.get('event_date') as string;
    const event_location = formData.get('event_location') as string;
    const event_type = formData.get('event_type') as string;
    const is_active = formData.get('is_active') === 'true';
    const is_featured = formData.get('is_featured') === 'true';
    const display_order = parseInt(formData.get('display_order') as string) || 0;
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [];
    const seo_keywords = formData.get('seo_keywords') as string;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Title is required'
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
      }, { status: 400 });
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size must be less than 50MB'
      }, { status: 400 });
    }

    // Validate event type if provided
    if (event_type && event_type !== 'none' && !isValidEventType(event_type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid event type'
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `events-portfolio-${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `portfolio/${filename}`;

    // Upload file to storage
    const { data: uploadResult, error: uploadError } = await supabase.storage
      .from('events-portfolio-images')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({
        success: false,
        error: 'Failed to upload file to storage'
      }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('events-portfolio-images')
      .getPublicUrl(filePath);

    // Create database record
    const imageData = {
      filename,
      original_filename: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      title: title.trim(),
      description: description?.trim() || null,
      alt_text: alt_text?.trim() || title.trim(),
      caption: caption?.trim() || null,
      event_name: event_name?.trim() || null,
      event_date: event_date || null,
      event_location: event_location?.trim() || null,
      event_type: (event_type && event_type !== 'none') ? event_type : null,
      is_active,
      is_featured,
      display_order,
      tags: tags.length > 0 ? tags : null,
      seo_keywords: seo_keywords?.trim() || null,
    };

    const { data: image, error: dbError } = await supabase
      .from('events_portfolio_images')
      .insert(imageData)
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage
        .from('events-portfolio-images')
        .remove([filePath]);
      
      console.error('Database insert error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Failed to save image record'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        image,
        url: publicUrl,
        path: filePath
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/events-portfolio:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// ============================================================================
// PUT - Update events portfolio image
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    // Use service role for admin operations
    const supabase = await createClient(true);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Image ID is required'
      }, { status: 400 });
    }

    if (action === 'toggle_featured') {
      // Toggle featured status
      const { data, error } = await supabase
        .rpc('toggle_events_portfolio_featured', { image_id: id });

      if (error) {
        console.error('Error toggling featured status:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to toggle featured status'
        }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({
          success: false,
          error: 'Image not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: true,
        message: 'Featured status updated successfully'
      });
    }

    if (action === 'reorder') {
      // Reorder images
      const body = await request.json();
      const { items } = body;

      if (!items || !Array.isArray(items)) {
        return NextResponse.json({
          success: false,
          error: 'Items array is required for reordering'
        }, { status: 400 });
      }

      const imageIds = items.map((item: any) => item.id);
      const newOrders = items.map((item: any) => item.display_order);

      const { data, error } = await supabase
        .rpc('reorder_events_portfolio_images', {
          image_ids: imageIds,
          new_orders: newOrders
        });

      if (error) {
        console.error('Error reordering images:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to reorder images'
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: true,
        message: 'Images reordered successfully'
      });
    }

    // Regular update
    const body = await request.json();
    const updateData = {
      title: body.title?.trim(),
      description: body.description?.trim() || null,
      alt_text: body.alt_text?.trim(),
      caption: body.caption?.trim() || null,
      event_name: body.event_name?.trim() || null,
      event_date: body.event_date || null,
      event_location: body.event_location?.trim() || null,
      event_type: (body.event_type && body.event_type !== 'none') ? body.event_type : null,
      is_active: body.is_active,
      is_featured: body.is_featured,
      display_order: body.display_order,
      tags: body.tags || null,
      seo_keywords: body.seo_keywords?.trim() || null,
    };

    // Validate required fields
    if (updateData.title && !updateData.title) {
      return NextResponse.json({
        success: false,
        error: 'Title cannot be empty'
      }, { status: 400 });
    }

    // Validate event type if provided
    if (updateData.event_type && updateData.event_type !== 'none' && !isValidEventType(updateData.event_type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid event type'
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('events_portfolio_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating image:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to update image'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Image updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/events-portfolio:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// ============================================================================
// DELETE - Delete events portfolio image
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    // Use service role for admin operations
    const supabase = await createClient(true);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Image ID is required'
      }, { status: 400 });
    }

    // First get the image to get file path
    const { data: image, error: fetchError } = await supabase
      .from('events_portfolio_images')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: 'Image not found'
        }, { status: 404 });
      }
      throw fetchError;
    }

    // Delete from database first
    const { error: dbError } = await supabase
      .from('events_portfolio_images')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('Error deleting image from database:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete image record'
      }, { status: 500 });
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('events-portfolio-images')
      .remove([image.file_path]);

    if (storageError) {
      console.warn('Failed to delete file from storage:', storageError);
      // Don't fail the operation if storage deletion fails
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error in DELETE /api/events-portfolio:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
