-- About Main Section Schema for Supabase
-- This file contains the SQL schema for the about main section of the Chronicle Exhibits website
-- 
-- ⚠️  SAFE TO RUN: This script only adds about main support, preserves existing data
-- 🎯 ADDS: About main table with dynamic content and media management
-- ✅ RESULT: About main section supports dynamic content and media management
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for about main images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'about-main',
  'about-main',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DATABASE TABLES
-- ============================================================================

-- Create about_main_images table
CREATE TABLE IF NOT EXISTS about_main_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- File Information
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Image Metadata
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  
  -- Organization
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_file_name CHECK (length(trim(file_name)) > 0),
  CONSTRAINT valid_file_path CHECK (length(trim(file_path)) > 0),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 52428800),
  CONSTRAINT valid_mime_type CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'))
);

-- Create about_main_sections table
CREATE TABLE IF NOT EXISTS about_main_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Section Content
  section_label TEXT NOT NULL DEFAULT 'ABOUT US',
  main_heading TEXT NOT NULL DEFAULT 'Electronics And Computer Software Export Promotion Council',
  description TEXT NOT NULL DEFAULT 'Electronics & Computer Software Export Promotion Council or ESC, is India''s apex trade promotion organization mandated to promote international cooperation in the field of electronics, telecom, and IT. Established with the support of Ministry of Commerce in the year 1989, Council has over 2300 members spread all over the country.',
  
  -- Call to Action
  cta_text TEXT NOT NULL DEFAULT 'Official website',
  cta_url TEXT NOT NULL DEFAULT '#',
  
  -- Video Content
  video_url TEXT DEFAULT 'https://www.youtube.com/embed/02tEkxgRE2c',
  video_title TEXT DEFAULT 'ESC India Video',
  
  -- Logo and Branding
  logo_image_id UUID REFERENCES about_main_images(id) ON DELETE SET NULL,
  logo_fallback_url TEXT DEFAULT 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
  
  -- ESC Branding Text
  esc_main_text TEXT NOT NULL DEFAULT 'ESC',
  esc_sub_text TEXT NOT NULL DEFAULT 'INDIA',
  
  -- Layout Colors
  primary_color TEXT DEFAULT '#a5cd39',
  secondary_color TEXT DEFAULT '#f0c419',
  
  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_section_label CHECK (length(trim(section_label)) > 0),
  CONSTRAINT valid_main_heading CHECK (length(trim(main_heading)) > 0),
  CONSTRAINT valid_description CHECK (length(trim(description)) > 0),
  CONSTRAINT valid_cta_text CHECK (length(trim(cta_text)) > 0),
  CONSTRAINT valid_cta_url CHECK (length(trim(cta_url)) > 0),
  CONSTRAINT valid_esc_main_text CHECK (length(trim(esc_main_text)) > 0),
  CONSTRAINT valid_esc_sub_text CHECK (length(trim(esc_sub_text)) > 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster queries on active about main images
CREATE INDEX IF NOT EXISTS idx_about_main_images_active 
ON about_main_images(is_active, display_order ASC, created_at DESC);

-- Index for faster queries on active about main sections
CREATE INDEX IF NOT EXISTS idx_about_main_sections_active 
ON about_main_sections(is_active, created_at DESC);

-- Index for logo relationship in main sections
CREATE INDEX IF NOT EXISTS idx_about_main_sections_logo 
ON about_main_sections(logo_image_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on about_main_images table
ALTER TABLE about_main_images ENABLE ROW LEVEL SECURITY;

-- Enable RLS on about_main_sections table
ALTER TABLE about_main_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to about main images
CREATE POLICY "Public read access to about main images"
ON about_main_images FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage about main images
CREATE POLICY "Authenticated users can manage about main images"
ON about_main_images FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow public read access to about main sections
CREATE POLICY "Public read access to about main sections"
ON about_main_sections FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage about main sections
CREATE POLICY "Authenticated users can manage about main sections"
ON about_main_sections FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy: Allow public read access to about main storage
CREATE POLICY "Public read access to about main storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'about-main');

-- Policy: Allow authenticated users to upload about main images
CREATE POLICY "Authenticated users can upload about main images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'about-main' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'uploads'
);

-- Policy: Allow authenticated users to update about main images
CREATE POLICY "Authenticated users can update about main images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'about-main' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete about main images
CREATE POLICY "Authenticated users can delete about main images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'about-main' 
  AND auth.role() = 'authenticated'
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for about_main_images table
CREATE TRIGGER update_about_main_images_updated_at
  BEFORE UPDATE ON about_main_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for about_main_sections table
CREATE TRIGGER update_about_main_sections_updated_at
  BEFORE UPDATE ON about_main_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial section data
INSERT INTO about_main_sections (
  section_label,
  main_heading,
  description,
  cta_text,
  cta_url,
  video_url,
  video_title,
  logo_fallback_url,
  esc_main_text,
  esc_sub_text,
  primary_color,
  secondary_color
) VALUES (
  'ABOUT US',
  'Electronics And Computer Software Export Promotion Council',
  'Electronics & Computer Software Export Promotion Council or ESC, is India''s apex trade promotion organization mandated to promote international cooperation in the field of electronics, telecom, and IT. Established with the support of Ministry of Commerce in the year 1989, Council has over 2300 members spread all over the country.',
  'Official website',
  '#',
  'https://www.youtube.com/embed/02tEkxgRE2c',
  'ESC India Video',
  'https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
  'ESC',
  'INDIA',
  '#a5cd39',
  '#f0c419'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Create function to get about main section with logo image
CREATE OR REPLACE FUNCTION get_about_main_section()
RETURNS TABLE (
  id UUID,
  section_label TEXT,
  main_heading TEXT,
  description TEXT,
  cta_text TEXT,
  cta_url TEXT,
  video_url TEXT,
  video_title TEXT,
  logo_image_id UUID,
  logo_image_url TEXT,
  logo_image_alt TEXT,
  logo_fallback_url TEXT,
  esc_main_text TEXT,
  esc_sub_text TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ams.id,
    ams.section_label,
    ams.main_heading,
    ams.description,
    ams.cta_text,
    ams.cta_url,
    ams.video_url,
    ams.video_title,
    ams.logo_image_id,
    CASE
      WHEN amimg.file_path IS NOT NULL
      THEN amimg.file_path  -- Return file path for frontend URL construction
      ELSE NULL
    END as logo_image_url,
    amimg.alt_text as logo_image_alt,
    ams.logo_fallback_url,
    ams.esc_main_text,
    ams.esc_sub_text,
    ams.primary_color,
    ams.secondary_color,
    ams.is_active,
    ams.created_at,
    ams.updated_at
  FROM about_main_sections ams
  LEFT JOIN about_main_images amimg ON ams.logo_image_id = amimg.id
  WHERE ams.is_active = true
  ORDER BY ams.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all about main images
CREATE OR REPLACE FUNCTION get_about_main_images()
RETURNS TABLE (
  id UUID,
  file_name TEXT,
  file_path TEXT,
  file_url TEXT,
  alt_text TEXT,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  display_order INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ami.id,
    ami.file_name,
    ami.file_path,
    ami.file_path as file_url,  -- Return file path for frontend URL construction
    ami.alt_text,
    ami.file_size,
    ami.mime_type,
    ami.width,
    ami.height,
    ami.display_order,
    ami.is_active,
    ami.created_at,
    ami.updated_at
  FROM about_main_images ami
  WHERE ami.is_active = true
  ORDER BY ami.display_order ASC, ami.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the functions
GRANT EXECUTE ON FUNCTION get_about_main_section() TO authenticated;
GRANT EXECUTE ON FUNCTION get_about_main_section() TO anon;
GRANT EXECUTE ON FUNCTION get_about_main_images() TO authenticated;
GRANT EXECUTE ON FUNCTION get_about_main_images() TO anon;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to validate image file type
CREATE OR REPLACE FUNCTION validate_main_image_type(mime_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif');
END;
$$ LANGUAGE plpgsql;

-- Function to validate color format (hex colors)
CREATE OR REPLACE FUNCTION validate_color_format(color_value TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN color_value ~ '^#[0-9A-Fa-f]{6}$' OR color_value ~ '^#[0-9A-Fa-f]{3}$';
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on helper functions
GRANT EXECUTE ON FUNCTION validate_main_image_type(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_color_format(TEXT) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE about_main_images IS 'Stores images for about main section with metadata and organization';
COMMENT ON TABLE about_main_sections IS 'Stores content and configuration for about main sections including video, branding, and CTA elements';
COMMENT ON FUNCTION get_about_main_section() IS 'Returns the active about main section with logo image information';
COMMENT ON FUNCTION get_about_main_images() IS 'Returns all active about main images with file paths for frontend URL construction';
COMMENT ON FUNCTION validate_main_image_type(TEXT) IS 'Validates image MIME type for uploads';
COMMENT ON FUNCTION validate_color_format(TEXT) IS 'Validates hex color format for branding colors';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'about_main_%';

-- Verify initial data was inserted
-- SELECT * FROM about_main_sections WHERE is_active = true;

-- Test the database functions
-- SELECT * FROM get_about_main_section();
-- SELECT * FROM get_about_main_images();

-- Test validation functions
-- SELECT validate_main_image_type('image/jpeg');
-- SELECT validate_color_format('#a5cd39');

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'About main schema setup completed successfully!';
  RAISE NOTICE 'Storage bucket "about-main" created with proper policies.';
  RAISE NOTICE 'Database tables and functions are ready for use.';
  RAISE NOTICE 'Initial data has been inserted based on current main section.';
END $$;
