-- Kiosk Hero Section Schema for Supabase
-- This file contains the SQL schema for the kiosk hero section of the Chronicle Exhibits website
-- 
-- ⚠️  SAFE TO RUN: This script only adds kiosk hero support, preserves existing data
-- 🎯 ADDS: Storage bucket, kiosk hero table, image management
-- ✅ RESULT: Kiosk hero section supports dynamic content and image upload
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for kiosk hero images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kiosk-hero-images',
  'kiosk-hero-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy: Allow public read access to kiosk hero images
CREATE POLICY "Public read access for kiosk hero images"
ON storage.objects FOR SELECT
USING (bucket_id = 'kiosk-hero-images');

-- Policy: Allow authenticated users to upload kiosk hero images
CREATE POLICY "Authenticated users can upload kiosk hero images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kiosk-hero-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to update kiosk hero images
CREATE POLICY "Authenticated users can update kiosk hero images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'kiosk-hero-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete kiosk hero images
CREATE POLICY "Authenticated users can delete kiosk hero images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'kiosk-hero-images' 
  AND auth.role() = 'authenticated'
);

-- ============================================================================
-- DATABASE TABLES
-- ============================================================================

-- Create kiosk_hero_images table for tracking uploaded images
CREATE TABLE IF NOT EXISTS kiosk_hero_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT 'Kiosk hero background image',
  is_active BOOLEAN NOT NULL DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT valid_filename CHECK (length(trim(filename)) > 0),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 52428800)
);

-- Create kiosk_hero_sections table
CREATE TABLE IF NOT EXISTS kiosk_hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  heading TEXT NOT NULL,
  background_image_url TEXT,
  background_image_id UUID REFERENCES kiosk_hero_images(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_heading CHECK (length(trim(heading)) > 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster queries on active kiosk hero sections
CREATE INDEX IF NOT EXISTS idx_kiosk_hero_sections_active 
ON kiosk_hero_sections(is_active, created_at DESC);

-- Index for faster queries on active kiosk hero images
CREATE INDEX IF NOT EXISTS idx_kiosk_hero_images_active 
ON kiosk_hero_images(is_active, created_at DESC);

-- Index for faster queries on kiosk hero images by file path
CREATE INDEX IF NOT EXISTS idx_kiosk_hero_images_file_path 
ON kiosk_hero_images(file_path);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on kiosk_hero_images table
ALTER TABLE kiosk_hero_images ENABLE ROW LEVEL SECURITY;

-- Enable RLS on kiosk_hero_sections table
ALTER TABLE kiosk_hero_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to kiosk hero images
CREATE POLICY "Public read access to kiosk hero images"
ON kiosk_hero_images FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage kiosk hero images
CREATE POLICY "Authenticated users can manage kiosk hero images"
ON kiosk_hero_images FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow public read access to kiosk hero sections
CREATE POLICY "Public read access to kiosk hero sections"
ON kiosk_hero_sections FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage kiosk hero sections
CREATE POLICY "Authenticated users can manage kiosk hero sections"
ON kiosk_hero_sections FOR ALL
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

-- Trigger for kiosk_hero_images table
CREATE TRIGGER update_kiosk_hero_images_updated_at
  BEFORE UPDATE ON kiosk_hero_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for kiosk_hero_sections table
CREATE TRIGGER update_kiosk_hero_sections_updated_at
  BEFORE UPDATE ON kiosk_hero_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial data based on the current kiosk hero section
INSERT INTO kiosk_hero_sections (
  heading,
  background_image_url
) VALUES (
  'KIOSK MANUFACTURERS IN DUBAI',
  'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2069&auto=format&fit=crop'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Create function to get kiosk hero section with image data
CREATE OR REPLACE FUNCTION get_kiosk_hero_section_with_image()
RETURNS TABLE (
  id UUID,
  heading TEXT,
  background_image_url TEXT,
  background_image_id UUID,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  image_file_path TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    khs.id,
    khs.heading,
    khs.background_image_url,
    khs.background_image_id,
    khs.is_active,
    khs.created_at,
    khs.updated_at,
    khi.file_path as image_file_path
  FROM kiosk_hero_sections khs
  LEFT JOIN kiosk_hero_images khi ON khi.id = khs.background_image_id AND khi.is_active = true
  WHERE khs.is_active = true
  ORDER BY khs.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION get_kiosk_hero_section_with_image() TO authenticated;
GRANT EXECUTE ON FUNCTION get_kiosk_hero_section_with_image() TO anon;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE kiosk_hero_images IS 'Stores uploaded images for kiosk hero section backgrounds';
COMMENT ON TABLE kiosk_hero_sections IS 'Stores content and configuration for kiosk hero sections';
COMMENT ON FUNCTION get_kiosk_hero_section_with_image() IS 'Returns the active kiosk hero section with associated image data';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'kiosk_hero%';

-- Verify storage bucket was created
-- SELECT * FROM storage.buckets WHERE id = 'kiosk-hero-images';

-- Verify initial data was inserted
-- SELECT * FROM kiosk_hero_sections WHERE is_active = true;

-- Test the database function
-- SELECT * FROM get_kiosk_hero_section_with_image();
