-- Kiosk Content Section Schema for Supabase
-- This file contains the SQL schema for the kiosk content section of the Chronicle Exhibits website
-- 
-- ⚠️  SAFE TO RUN: This script only adds kiosk content support, preserves existing data
-- 🎯 ADDS: Storage bucket, kiosk content table, image management
-- ✅ RESULT: Kiosk content section supports dynamic content and image upload
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for kiosk content images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kiosk-content-images',
  'kiosk-content-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy: Allow public read access to kiosk content images
CREATE POLICY "Public read access for kiosk content images"
ON storage.objects FOR SELECT
USING (bucket_id = 'kiosk-content-images');

-- Policy: Allow authenticated users to upload kiosk content images
CREATE POLICY "Authenticated users can upload kiosk content images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kiosk-content-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to update kiosk content images
CREATE POLICY "Authenticated users can update kiosk content images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'kiosk-content-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete kiosk content images
CREATE POLICY "Authenticated users can delete kiosk content images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'kiosk-content-images' 
  AND auth.role() = 'authenticated'
);

-- ============================================================================
-- DATABASE TABLES
-- ============================================================================

-- Create kiosk_content_images table for tracking uploaded images
CREATE TABLE IF NOT EXISTS kiosk_content_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT 'Kiosk content image',
  is_active BOOLEAN NOT NULL DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT valid_filename CHECK (length(trim(filename)) > 0),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 52428800)
);

-- Create kiosk_content_sections table
CREATE TABLE IF NOT EXISTS kiosk_content_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- First Section Content (CUSTOM KIOSK)
  first_section_heading TEXT NOT NULL DEFAULT 'CUSTOM KIOSK',
  first_section_content TEXT NOT NULL DEFAULT 'When it comes to taking part in trade shows exhibitors are nowadays looking for digital, interactive & cost-efficient solutions to represent their brand. Customer satisfaction is the main concern of every exhibitor for a successful trade show experience. This is why their interest is shifting towards customized, self-service & engaging custom Kiosk manufacturers in Dubai solutions to offer convenience to visitors & address the needs of the customers better.',
  first_section_highlight_text TEXT DEFAULT 'custom Kiosk manufacturers in Dubai',
  
  -- Second Section Content (WHAT ARE CUSTOM KIOSKS?)
  second_section_heading TEXT NOT NULL DEFAULT 'WHAT ARE CUSTOM KIOSKS?',
  second_section_paragraph_1 TEXT NOT NULL DEFAULT 'Kiosks are non-permanent display booths used for demonstrating information & advertising products offered by different brands or companies. You can easily find them in public areas that are visited by huge mob-like shopping malls, museums, movie theatres, and large-scale trade shows. Kiosks are a brilliant way to develop a strong connection with the visitors at the trade show as they are packed with digital & interactive features.',
  second_section_paragraph_2 TEXT NOT NULL DEFAULT 'Custom kiosks are the best as they are manufactured after an analysis of your business purposes & needs, unlike standard kiosks, customized kiosks are cost-effective as you would pay only for things you need. These kiosks have a lasting impact on the visitors & allow them to interact with your brand.',
  
  -- Image Configuration
  main_image_id UUID REFERENCES kiosk_content_images(id) ON DELETE SET NULL,
  main_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop',
  main_image_alt TEXT DEFAULT 'Custom Kiosk Solutions',
  
  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_first_heading CHECK (length(trim(first_section_heading)) > 0),
  CONSTRAINT valid_second_heading CHECK (length(trim(second_section_heading)) > 0),
  CONSTRAINT valid_first_content CHECK (length(trim(first_section_content)) > 0),
  CONSTRAINT valid_paragraph_1 CHECK (length(trim(second_section_paragraph_1)) > 0),
  CONSTRAINT valid_paragraph_2 CHECK (length(trim(second_section_paragraph_2)) > 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster queries on active kiosk content sections
CREATE INDEX IF NOT EXISTS idx_kiosk_content_sections_active 
ON kiosk_content_sections(is_active, created_at DESC);

-- Index for faster queries on active kiosk content images
CREATE INDEX IF NOT EXISTS idx_kiosk_content_images_active 
ON kiosk_content_images(is_active, created_at DESC);

-- Index for faster queries on kiosk content images by file path
CREATE INDEX IF NOT EXISTS idx_kiosk_content_images_file_path 
ON kiosk_content_images(file_path);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on kiosk_content_images table
ALTER TABLE kiosk_content_images ENABLE ROW LEVEL SECURITY;

-- Enable RLS on kiosk_content_sections table
ALTER TABLE kiosk_content_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to kiosk content images
CREATE POLICY "Public read access to kiosk content images"
ON kiosk_content_images FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage kiosk content images
CREATE POLICY "Authenticated users can manage kiosk content images"
ON kiosk_content_images FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow public read access to kiosk content sections
CREATE POLICY "Public read access to kiosk content sections"
ON kiosk_content_sections FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage kiosk content sections
CREATE POLICY "Authenticated users can manage kiosk content sections"
ON kiosk_content_sections FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

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

-- Trigger for kiosk_content_images table
CREATE TRIGGER update_kiosk_content_images_updated_at
  BEFORE UPDATE ON kiosk_content_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for kiosk_content_sections table
CREATE TRIGGER update_kiosk_content_sections_updated_at
  BEFORE UPDATE ON kiosk_content_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial data based on the current kiosk content section
INSERT INTO kiosk_content_sections (
  first_section_heading,
  first_section_content,
  first_section_highlight_text,
  second_section_heading,
  second_section_paragraph_1,
  second_section_paragraph_2,
  main_image_url,
  main_image_alt
) VALUES (
  'CUSTOM KIOSK',
  'When it comes to taking part in trade shows exhibitors are nowadays looking for digital, interactive & cost-efficient solutions to represent their brand. Customer satisfaction is the main concern of every exhibitor for a successful trade show experience. This is why their interest is shifting towards customized, self-service & engaging custom Kiosk manufacturers in Dubai solutions to offer convenience to visitors & address the needs of the customers better.',
  'custom Kiosk manufacturers in Dubai',
  'WHAT ARE CUSTOM KIOSKS?',
  'Kiosks are non-permanent display booths used for demonstrating information & advertising products offered by different brands or companies. You can easily find them in public areas that are visited by huge mob-like shopping malls, museums, movie theatres, and large-scale trade shows. Kiosks are a brilliant way to develop a strong connection with the visitors at the trade show as they are packed with digital & interactive features.',
  'Custom kiosks are the best as they are manufactured after an analysis of your business purposes & needs, unlike standard kiosks, customized kiosks are cost-effective as you would pay only for things you need. These kiosks have a lasting impact on the visitors & allow them to interact with your brand.',
  'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop',
  'Custom Kiosk Solutions'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Create function to get kiosk content section with image data
CREATE OR REPLACE FUNCTION get_kiosk_content_section_with_image()
RETURNS TABLE (
  id UUID,
  first_section_heading TEXT,
  first_section_content TEXT,
  first_section_highlight_text TEXT,
  second_section_heading TEXT,
  second_section_paragraph_1 TEXT,
  second_section_paragraph_2 TEXT,
  main_image_id UUID,
  main_image_url TEXT,
  main_image_alt TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  image_file_path TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    kcs.id,
    kcs.first_section_heading,
    kcs.first_section_content,
    kcs.first_section_highlight_text,
    kcs.second_section_heading,
    kcs.second_section_paragraph_1,
    kcs.second_section_paragraph_2,
    kcs.main_image_id,
    kcs.main_image_url,
    kcs.main_image_alt,
    kcs.is_active,
    kcs.created_at,
    kcs.updated_at,
    kci.file_path as image_file_path
  FROM kiosk_content_sections kcs
  LEFT JOIN kiosk_content_images kci ON kci.id = kcs.main_image_id AND kci.is_active = true
  WHERE kcs.is_active = true
  ORDER BY kcs.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION get_kiosk_content_section_with_image() TO authenticated;
GRANT EXECUTE ON FUNCTION get_kiosk_content_section_with_image() TO anon;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE kiosk_content_images IS 'Stores uploaded images for kiosk content section';
COMMENT ON TABLE kiosk_content_sections IS 'Stores content and configuration for kiosk content sections';
COMMENT ON FUNCTION get_kiosk_content_section_with_image() IS 'Returns the active kiosk content section with associated image data';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'kiosk_content%';

-- Verify storage bucket was created
-- SELECT * FROM storage.buckets WHERE id = 'kiosk-content-images';

-- Verify initial data was inserted
-- SELECT * FROM kiosk_content_sections WHERE is_active = true;

-- Test the database function
-- SELECT * FROM get_kiosk_content_section_with_image();
