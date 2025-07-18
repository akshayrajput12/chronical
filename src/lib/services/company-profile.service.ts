// ============================================================================
// COMPANY PROFILE SERVICE
// ============================================================================
// Service for managing company profile PDF documents
// Created: 2025-07-18

import { createClient } from '@/lib/supabase/client';
import {
  CompanyProfileDocument,
  CompanyProfileDocumentInput,
  CompanyProfileUploadData,
  CompanyProfileUploadResponse,
  CompanyProfileDeleteResponse,
  CompanyProfileApiResponse,
  CompanyProfileFileValidation,
  CompanyProfileError,
  COMPANY_PROFILE_CONSTANTS,
  isValidPdfFile,
} from '@/types/company-profile';

class CompanyProfileService {
  private supabase = createClient();

  // ============================================================================
  // FILE VALIDATION
  // ============================================================================

  validateFile(file: File): CompanyProfileFileValidation {
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (!isValidPdfFile(file)) {
      if (file.type !== 'application/pdf') {
        return { isValid: false, error: 'Only PDF files are allowed' };
      }
      if (file.size === 0) {
        return { isValid: false, error: 'File is empty' };
      }
      if (file.size > COMPANY_PROFILE_CONSTANTS.MAX_FILE_SIZE) {
        return { 
          isValid: false, 
          error: `File size must be less than ${COMPANY_PROFILE_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB` 
        };
      }
    }

    return { 
      isValid: true, 
      size: file.size, 
      type: file.type 
    };
  }

  // ============================================================================
  // DOCUMENT RETRIEVAL
  // ============================================================================

  async getCurrentDocument(): Promise<CompanyProfileDocument | null> {
    try {
      const { data, error } = await this.supabase
        .from('company_profile_documents')
        .select('*')
        .eq('is_current', true)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - no current document
          return null;
        }
        throw new CompanyProfileError('Failed to fetch current document', error.code, error);
      }

      return data;
    } catch (error) {
      console.error('Error fetching current company profile document:', error);
      if (error instanceof CompanyProfileError) {
        throw error;
      }
      throw new CompanyProfileError('Failed to fetch current document');
    }
  }

  async getAllDocuments(): Promise<CompanyProfileDocument[]> {
    try {
      const { data, error } = await this.supabase
        .from('company_profile_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new CompanyProfileError('Failed to fetch documents', error.code, error);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching company profile documents:', error);
      if (error instanceof CompanyProfileError) {
        throw error;
      }
      throw new CompanyProfileError('Failed to fetch documents');
    }
  }

  async getDocumentById(id: string): Promise<CompanyProfileDocument | null> {
    try {
      const { data, error } = await this.supabase
        .from('company_profile_documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new CompanyProfileError('Failed to fetch document', error.code, error);
      }

      return data;
    } catch (error) {
      console.error('Error fetching company profile document by ID:', error);
      if (error instanceof CompanyProfileError) {
        throw error;
      }
      throw new CompanyProfileError('Failed to fetch document');
    }
  }

  // ============================================================================
  // DOCUMENT UPLOAD
  // ============================================================================

  async uploadDocument(uploadData: CompanyProfileUploadData): Promise<CompanyProfileUploadResponse> {
    try {
      // Validate file
      const validation = this.validateFile(uploadData.file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = uploadData.file.name.split('.').pop();
      const filename = `company-profile-${timestamp}-${randomString}.${fileExtension}`;
      const filePath = `documents/${filename}`;

      // Upload file to storage
      const { data: uploadResult, error: uploadError } = await this.supabase.storage
        .from(COMPANY_PROFILE_CONSTANTS.STORAGE_BUCKET)
        .upload(filePath, uploadData.file, {
          contentType: uploadData.file.type,
          upsert: false
        });

      if (uploadError) {
        throw new CompanyProfileError('Failed to upload file to storage', uploadError.message, uploadError);
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from(COMPANY_PROFILE_CONSTANTS.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      // Create database record
      const documentData = {
        filename,
        original_filename: uploadData.file.name,
        file_path: filePath,
        file_size: uploadData.file.size,
        mime_type: uploadData.file.type,
        title: uploadData.title || COMPANY_PROFILE_CONSTANTS.DEFAULT_TITLE,
        description: uploadData.description || null,
        version: uploadData.version || COMPANY_PROFILE_CONSTANTS.DEFAULT_VERSION,
        is_active: uploadData.is_active ?? true,
        is_current: uploadData.is_current ?? false,
      };

      const { data: document, error: dbError } = await this.supabase
        .from('company_profile_documents')
        .insert(documentData)
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await this.supabase.storage
          .from(COMPANY_PROFILE_CONSTANTS.STORAGE_BUCKET)
          .remove([filePath]);
        
        throw new CompanyProfileError('Failed to save document record', dbError.code, dbError);
      }

      return {
        success: true,
        data: {
          document,
          url: publicUrl,
          path: filePath
        }
      };
    } catch (error) {
      console.error('Error uploading company profile document:', error);
      if (error instanceof CompanyProfileError) {
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Failed to upload document'
      };
    }
  }

  // ============================================================================
  // DOCUMENT MANAGEMENT
  // ============================================================================

  async updateDocument(id: string, updateData: CompanyProfileDocumentInput): Promise<CompanyProfileApiResponse<CompanyProfileDocument>> {
    try {
      const { data, error } = await this.supabase
        .from('company_profile_documents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new CompanyProfileError('Failed to update document', error.code, error);
      }

      return {
        success: true,
        data,
        message: 'Document updated successfully'
      };
    } catch (error) {
      console.error('Error updating company profile document:', error);
      if (error instanceof CompanyProfileError) {
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Failed to update document'
      };
    }
  }

  async setCurrentDocument(id: string): Promise<CompanyProfileApiResponse<boolean>> {
    try {
      // Use the database function to set current document
      const { data, error } = await this.supabase
        .rpc('set_current_company_profile', { document_id: id });

      if (error) {
        throw new CompanyProfileError('Failed to set current document', error.code, error);
      }

      if (!data) {
        return {
          success: false,
          error: 'Document not found or not active'
        };
      }

      return {
        success: true,
        data: true,
        message: 'Document set as current successfully'
      };
    } catch (error) {
      console.error('Error setting current company profile document:', error);
      if (error instanceof CompanyProfileError) {
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Failed to set current document'
      };
    }
  }

  async deleteDocument(id: string): Promise<CompanyProfileDeleteResponse> {
    try {
      // First get the document to get file path
      const document = await this.getDocumentById(id);
      if (!document) {
        return {
          success: false,
          error: 'Document not found'
        };
      }

      // Delete from database first
      const { error: dbError } = await this.supabase
        .from('company_profile_documents')
        .delete()
        .eq('id', id);

      if (dbError) {
        throw new CompanyProfileError('Failed to delete document record', dbError.code, dbError);
      }

      // Delete file from storage
      const { error: storageError } = await this.supabase.storage
        .from(COMPANY_PROFILE_CONSTANTS.STORAGE_BUCKET)
        .remove([document.file_path]);

      if (storageError) {
        console.warn('Failed to delete file from storage:', storageError);
        // Don't fail the operation if storage deletion fails
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting company profile document:', error);
      if (error instanceof CompanyProfileError) {
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'Failed to delete document'
      };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getDownloadUrl(document: CompanyProfileDocument): string {
    const { data: { publicUrl } } = this.supabase.storage
      .from(COMPANY_PROFILE_CONSTANTS.STORAGE_BUCKET)
      .getPublicUrl(document.file_path);
    
    return publicUrl;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const companyProfileService = new CompanyProfileService();
