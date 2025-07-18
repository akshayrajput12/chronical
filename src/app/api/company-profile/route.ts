// ============================================================================
// COMPANY PROFILE API ROUTES
// ============================================================================
// API endpoints for company profile document management
// Created: 2025-07-18

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================================
// GET - Retrieve company profile documents
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const current = searchParams.get('current');
    const id = searchParams.get('id');

    if (current === 'true') {
      // Get current active document
      const { data: document, error } = await supabase
        .from('company_profile_documents')
        .select('*')
        .eq('is_current', true)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - no current document
          return NextResponse.json({
            success: false,
            error: 'No current company profile document found'
          }, { status: 404 });
        }
        throw error;
      }

      // Get download URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-profile-documents')
        .getPublicUrl(document.file_path);

      return NextResponse.json({
        success: true,
        data: {
          document,
          downloadUrl: publicUrl
        }
      });
    }

    if (id) {
      // Get specific document by ID
      const { data: document, error } = await supabase
        .from('company_profile_documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({
            success: false,
            error: 'Document not found'
          }, { status: 404 });
        }
        throw error;
      }

      // Get download URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-profile-documents')
        .getPublicUrl(document.file_path);

      return NextResponse.json({
        success: true,
        data: {
          document,
          downloadUrl: publicUrl
        }
      });
    }

    // Get all documents
    const { data: documents, error } = await supabase
      .from('company_profile_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const currentDocument = documents?.find(doc => doc.is_current && doc.is_active);

    return NextResponse.json({
      success: true,
      data: {
        documents: documents || [],
        total: documents?.length || 0,
        current: currentDocument
      }
    });

  } catch (error) {
    console.error('Error in GET /api/company-profile:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// ============================================================================
// POST - Upload new company profile document
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
    const version = formData.get('version') as string;
    const isActive = formData.get('is_active') === 'true';
    const isCurrent = formData.get('is_current') === 'true';

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
    if (file.type !== 'application/pdf') {
      return NextResponse.json({
        success: false,
        error: 'Only PDF files are allowed'
      }, { status: 400 });
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size must be less than 100MB'
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `company-profile-${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `documents/${filename}`;

    // Upload file to storage
    const { data: uploadResult, error: uploadError } = await supabase.storage
      .from('company-profile-documents')
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
      .from('company-profile-documents')
      .getPublicUrl(filePath);

    // Create database record
    const documentData = {
      filename,
      original_filename: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      title: title.trim(),
      description: description?.trim() || null,
      version: version?.trim() || '1.0',
      is_active: isActive,
      is_current: isCurrent,
    };

    const { data: document, error: dbError } = await supabase
      .from('company_profile_documents')
      .insert(documentData)
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage
        .from('company-profile-documents')
        .remove([filePath]);

      console.error('Database insert error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Failed to save document record'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        document,
        url: publicUrl,
        path: filePath
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/company-profile:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// ============================================================================
// PUT - Update company profile document
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
        error: 'Document ID is required'
      }, { status: 400 });
    }

    if (action === 'set_current') {
      // Use the database function to set current document
      const { data, error } = await supabase
        .rpc('set_current_company_profile', { document_id: id });

      if (error) {
        console.error('Error setting current document:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to set current document'
        }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({
          success: false,
          error: 'Document not found or not active'
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        data: true,
        message: 'Document set as current successfully'
      });
    }

    // Regular update
    const body = await request.json();
    const updateData = {
      title: body.title?.trim(),
      description: body.description?.trim() || null,
      version: body.version?.trim(),
      is_active: body.is_active,
      is_current: body.is_current,
    };

    // Validate required fields
    if (updateData.title && !updateData.title) {
      return NextResponse.json({
        success: false,
        error: 'Title cannot be empty'
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('company_profile_documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating document:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to update document'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Document updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/company-profile:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// ============================================================================
// DELETE - Delete company profile document
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
        error: 'Document ID is required'
      }, { status: 400 });
    }

    // First get the document to get file path
    const { data: document, error: fetchError } = await supabase
      .from('company_profile_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: 'Document not found'
        }, { status: 404 });
      }
      throw fetchError;
    }

    // Delete from database first
    const { error: dbError } = await supabase
      .from('company_profile_documents')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('Error deleting document from database:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete document record'
      }, { status: 500 });
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('company-profile-documents')
      .remove([document.file_path]);

    if (storageError) {
      console.warn('Failed to delete file from storage:', storageError);
      // Don't fail the operation if storage deletion fails
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error in DELETE /api/company-profile:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
