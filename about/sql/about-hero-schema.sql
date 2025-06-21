-- About Hero Section Schema for Supabase
-- This file contains the SQL schema for the about hero section of the Chronicle Exhibits website
-- 
-- ⚠️  SAFE TO RUN: This script only adds about hero support, preserves existing data
-- 🎯 ADDS: About hero table with dynamic content and image management
-- ✅ RESULT: About hero section supports dynamic content and image management
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for about hero images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'about-hero',
  'about-hero',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DATABASE TABLES
-- ============================================================================

-- Create about_hero_images table
CREATE TABLE IF NOT EXISTS about_hero_images (
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

-- Create about_hero_sections table
CREATE TABLE IF NOT EXISTS about_hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  hero_heading TEXT NOT NULL DEFAULT 'About Us',
  hero_subheading TEXT NOT NULL DEFAULT 'Discover the story behind our passion for creating unforgettable exhibition experiences.',
  
  -- Background Image
  background_image_id UUID REFERENCES about_hero_images(id) ON DELETE SET NULL,
  fallback_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  -- Styling Options
  overlay_opacity DECIMAL(3,2) DEFAULT 0.30 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),
  overlay_color TEXT DEFAULT 'black',
  text_color TEXT DEFAULT 'white',
  
  -- Layout Options
  height_class TEXT DEFAULT 'h-[80vh]',
  show_scroll_indicator BOOLEAN DEFAULT true,
  
  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_hero_heading CHECK (length(trim(hero_heading)) > 0),
  CONSTRAINT valid_hero_subheading CHECK (length(trim(hero_subheading)) > 0),
  CONSTRAINT valid_overlay_color CHECK (length(trim(overlay_color)) > 0),
  CONSTRAINT valid_text_color CHECK (length(trim(text_color)) > 0),
  CONSTRAINT valid_height_class CHECK (length(trim(height_class)) > 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster queries on active about hero images
CREATE INDEX IF NOT EXISTS idx_about_hero_images_active 
ON about_hero_images(is_active, display_order ASC, created_at DESC);

-- Index for faster queries on active about hero sections
CREATE INDEX IF NOT EXISTS idx_about_hero_sections_active 
ON about_hero_sections(is_active, created_at DESC);

-- Index for background image relationship
CREATE INDEX IF NOT EXISTS idx_about_hero_sections_background_image 
ON about_hero_sections(background_image_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on about_hero_images table
ALTER TABLE about_hero_images ENABLE ROW LEVEL SECURITY;

-- Enable RLS on about_hero_sections table
ALTER TABLE about_hero_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to about hero images
CREATE POLICY "Public read access to about hero images"
ON about_hero_images FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage about hero images
CREATE POLICY "Authenticated users can manage about hero images"
ON about_hero_images FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow public read access to about hero sections
CREATE POLICY "Public read access to about hero sections"
ON about_hero_sections FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage about hero sections
CREATE POLICY "Authenticated users can manage about hero sections"
ON about_hero_sections FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy: Allow public read access to about hero storage
CREATE POLICY "Public read access to about hero storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'about-hero');

-- Policy: Allow authenticated users to upload about hero images
CREATE POLICY "Authenticated users can upload about hero images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'about-hero' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'uploads'
);

-- Policy: Allow authenticated users to update about hero images
CREATE POLICY "Authenticated users can update about hero images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'about-hero' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete about hero images
CREATE POLICY "Authenticated users can delete about hero images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'about-hero' 
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

-- Trigger for about_hero_images table
CREATE TRIGGER update_about_hero_images_updated_at
  BEFORE UPDATE ON about_hero_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for about_hero_sections table
CREATE TRIGGER update_about_hero_sections_updated_at
  BEFORE UPDATE ON about_hero_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial data based on the current about hero section
INSERT INTO about_hero_sections (
  hero_heading,
  hero_subheading,
  fallback_image_url,
  overlay_opacity,
  overlay_color,
  text_color,
  height_class,
  show_scroll_indicator
) VALUES (
  'About Us',
  'Discover the story behind our passion for creating unforgettable exhibition experiences.',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  0.30,
  'black',
  'white',
  'h-[80vh]',
  true
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Create function to get about hero section with background image
CREATE OR REPLACE FUNCTION get_about_hero_section()
RETURNS TABLE (
  id UUID,
  hero_heading TEXT,
  hero_subheading TEXT,
  background_image_id UUID,
  background_image_url TEXT,
  background_image_alt TEXT,
  fallback_image_url TEXT,
  overlay_opacity DECIMAL,
  overlay_color TEXT,
  text_color TEXT,
  height_class TEXT,
  show_scroll_indicator BOOLEAN,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ahs.id,
    ahs.hero_heading,
    ahs.hero_subheading,
    ahs.background_image_id,
    CASE
      WHEN ahi.file_path IS NOT NULL
      THEN ahi.file_path  -- Return file path for frontend URL construction
      ELSE NULL
    END as background_image_url,
    ahi.alt_text as background_image_alt,
    ahs.fallback_image_url,
    ahs.overlay_opacity,
    ahs.overlay_color,
    ahs.text_color,
    ahs.height_class,
    ahs.show_scroll_indicator,
    ahs.is_active,
    ahs.created_at,
    ahs.updated_at
  FROM about_hero_sections ahs
  LEFT JOIN about_hero_images ahi ON ahs.background_image_id = ahi.id
  WHERE ahs.is_active = true
  ORDER BY ahs.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all about hero images
CREATE OR REPLACE FUNCTION get_about_hero_images()
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
    ahi.id,
    ahi.file_name,
    ahi.file_path,
    ahi.file_path as file_url,  -- Return file path for frontend URL construction
    ahi.alt_text,
    ahi.file_size,
    ahi.mime_type,
    ahi.width,
    ahi.height,
    ahi.display_order,
    ahi.is_active,
    ahi.created_at,
    ahi.updated_at
  FROM about_hero_images ahi
  WHERE ahi.is_active = true
  ORDER BY ahi.display_order ASC, ahi.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the functions
GRANT EXECUTE ON FUNCTION get_about_hero_section() TO authenticated;
GRANT EXECUTE ON FUNCTION get_about_hero_section() TO anon;
GRANT EXECUTE ON FUNCTION get_about_hero_images() TO authenticated;
GRANT EXECUTE ON FUNCTION get_about_hero_images() TO anon;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to validate image file type
CREATE OR REPLACE FUNCTION validate_image_type(mime_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif');
END;
$$ LANGUAGE plpgsql;

-- Function to validate color format
CREATE OR REPLACE FUNCTION validate_color_format(color TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate hex colors (#ffffff) or common named colors
  RETURN color ~ '^#[0-9a-fA-F]{6}$' OR color ~ '^#[0-9a-fA-F]{3}$' OR
         color IN ('black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'gray', 'grey', 'transparent');
END;
$$ LANGUAGE plpgsql;

-- Function to validate height class format
CREATE OR REPLACE FUNCTION validate_height_class(height_class TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate Tailwind height classes
  RETURN height_class ~ '^h-\[.*\]$' OR height_class ~ '^h-(screen|full|\d+|1/2|1/3|2/3|1/4|3/4)$';
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on helper functions
GRANT EXECUTE ON FUNCTION validate_image_type(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_color_format(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_height_class(TEXT) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE about_hero_images IS 'Stores images for about hero sections with metadata and organization';
COMMENT ON TABLE about_hero_sections IS 'Stores content and configuration for about hero sections';
COMMENT ON FUNCTION get_about_hero_section() IS 'Returns the active about hero section with background image information';
COMMENT ON FUNCTION get_about_hero_images() IS 'Returns all active about hero images with file paths for frontend URL construction';
COMMENT ON FUNCTION validate_image_type(TEXT) IS 'Validates image MIME type for uploads';
COMMENT ON FUNCTION validate_color_format(TEXT) IS 'Validates color format (hex or named colors)';
COMMENT ON FUNCTION validate_height_class(TEXT) IS 'Validates Tailwind CSS height class format';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'about_hero_%';

-- Verify initial data was inserted
-- SELECT * FROM about_hero_sections WHERE is_active = true;

-- Test the database functions
-- SELECT * FROM get_about_hero_section();
-- SELECT * FROM get_about_hero_images();

-- Test validation functions
-- SELECT validate_image_type('image/jpeg');
-- SELECT validate_color_format('#ffffff');
-- SELECT validate_height_class('h-[80vh]');

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'About hero schema setup completed successfully!';
  RAISE NOTICE 'Storage bucket "about-hero" created with proper policies.';
  RAISE NOTICE 'Database tables and functions are ready for use.';
  RAISE NOTICE 'Initial data has been inserted based on current about hero section.';
END $$;
