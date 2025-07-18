-- ============================================================================
-- COMPANY PROFILE DOCUMENTS SCHEMA
-- ============================================================================
-- This schema manages company profile PDF documents for download in the footer
-- Created: 2025-07-18
-- Purpose: Store and manage company profile PDFs with admin upload functionality

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for company profile documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-profile-documents',
  'company-profile-documents',
  true,
  104857600, -- 100MB limit
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Allow public read access to company profile documents
CREATE POLICY "Public can view company profile documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'company-profile-documents');

-- Allow authenticated users (admins) to upload company profile documents
CREATE POLICY "Authenticated users can upload company profile documents" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'company-profile-documents');

-- Allow authenticated users (admins) to update company profile documents
CREATE POLICY "Authenticated users can update company profile documents" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'company-profile-documents');

-- Allow authenticated users (admins) to delete company profile documents
CREATE POLICY "Authenticated users can delete company profile documents" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'company-profile-documents');

-- ============================================================================
-- MAIN TABLE
-- ============================================================================

-- Create company_profile_documents table
CREATE TABLE IF NOT EXISTS company_profile_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- File Information
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  
  -- Document Metadata
  title TEXT NOT NULL DEFAULT 'Company Profile',
  description TEXT,
  version TEXT DEFAULT '1.0',
  
  -- Status and Organization
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_current BOOLEAN NOT NULL DEFAULT false, -- Only one document can be current
  
  -- Admin Management
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_filename CHECK (length(trim(filename)) > 0),
  CONSTRAINT valid_original_filename CHECK (length(trim(original_filename)) > 0),
  CONSTRAINT valid_file_path CHECK (length(trim(file_path)) > 0),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 104857600), -- 100MB max
  CONSTRAINT valid_mime_type CHECK (mime_type = 'application/pdf'),
  CONSTRAINT valid_title CHECK (length(trim(title)) > 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for finding the current active document
CREATE INDEX IF NOT EXISTS idx_company_profile_documents_current 
ON company_profile_documents (is_current, is_active) 
WHERE is_current = true AND is_active = true;

-- Index for admin management queries
CREATE INDEX IF NOT EXISTS idx_company_profile_documents_admin 
ON company_profile_documents (uploaded_by, created_at DESC);

-- Index for file path lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_company_profile_documents_file_path 
ON company_profile_documents (file_path);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_company_profile_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_company_profile_documents_updated_at
  BEFORE UPDATE ON company_profile_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_company_profile_documents_updated_at();

-- Trigger to ensure only one document is current at a time
CREATE OR REPLACE FUNCTION ensure_single_current_company_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a document as current, unset all others
  IF NEW.is_current = true THEN
    UPDATE company_profile_documents 
    SET is_current = false, updated_at = NOW()
    WHERE id != NEW.id AND is_current = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_current_company_profile
  BEFORE INSERT OR UPDATE ON company_profile_documents
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_current_company_profile();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE company_profile_documents ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to active documents
CREATE POLICY "Public can view active company profile documents" ON company_profile_documents
  FOR SELECT USING (is_active = true);

-- Policy for authenticated users (admins) to manage all documents
CREATE POLICY "Authenticated users can manage company profile documents" ON company_profile_documents
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- No initial data needed - admin will upload the first document through the interface

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get the current active company profile document
CREATE OR REPLACE FUNCTION get_current_company_profile()
RETURNS TABLE (
  id UUID,
  filename TEXT,
  original_filename TEXT,
  file_path TEXT,
  file_size BIGINT,
  title TEXT,
  description TEXT,
  version TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cpd.id,
    cpd.filename,
    cpd.original_filename,
    cpd.file_path,
    cpd.file_size,
    cpd.title,
    cpd.description,
    cpd.version,
    cpd.created_at,
    cpd.updated_at
  FROM company_profile_documents cpd
  WHERE cpd.is_current = true AND cpd.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set a document as current (admin use)
CREATE OR REPLACE FUNCTION set_current_company_profile(document_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  doc_exists BOOLEAN;
BEGIN
  -- Check if document exists and is active
  SELECT EXISTS(
    SELECT 1 FROM company_profile_documents
    WHERE id = document_id AND is_active = true
  ) INTO doc_exists;

  IF NOT doc_exists THEN
    RETURN false;
  END IF;

  -- Update the document to be current
  UPDATE company_profile_documents
  SET is_current = true, updated_at = NOW()
  WHERE id = document_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE company_profile_documents IS 'Stores company profile PDF documents for public download';
COMMENT ON COLUMN company_profile_documents.is_current IS 'Only one document can be current at a time - this is the one shown in footer';
COMMENT ON COLUMN company_profile_documents.is_active IS 'Whether the document is active and available for download';
COMMENT ON COLUMN company_profile_documents.file_path IS 'Path to the file in the storage bucket';
COMMENT ON COLUMN company_profile_documents.version IS 'Version number or identifier for the document';
