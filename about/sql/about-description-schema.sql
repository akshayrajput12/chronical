-- About Description Section Schema for Supabase
-- This file contains the SQL schema for the about description section of the Chronicle Exhibits website
-- 
-- ⚠️  SAFE TO RUN: This script only adds about description support, preserves existing data
-- 🎯 ADDS: About description table with dynamic content and image management
-- ✅ RESULT: About description section supports dynamic content and image management
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for about description images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'about-description',
  'about-description',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DATABASE TABLES
-- ============================================================================

-- Create about_description_images table
CREATE TABLE IF NOT EXISTS about_description_images (
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

-- Create about_description_sections table
CREATE TABLE IF NOT EXISTS about_description_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Section Content
  section_heading TEXT NOT NULL DEFAULT 'Computer Software and ITES:',
  section_description TEXT NOT NULL DEFAULT 'ESC has emerged as a prime institution spearheading interest of Electronics and IT industry in the country.',
  background_color TEXT DEFAULT '#f9f7f7',
  
  -- Service Items
  service_1_title TEXT DEFAULT 'Customised Software Development',
  service_1_icon_url TEXT DEFAULT '/icons/code.svg',
  service_1_description TEXT DEFAULT '',
  
  service_2_title TEXT DEFAULT 'Software Products', 
  service_2_icon_url TEXT DEFAULT '/icons/computer.svg',
  service_2_description TEXT DEFAULT '',
  
  service_3_title TEXT DEFAULT 'IT Enabled Services',
  service_3_icon_url TEXT DEFAULT '/icons/gear.svg',
  service_3_description TEXT DEFAULT '',
  
  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_section_heading CHECK (length(trim(section_heading)) > 0),
  CONSTRAINT valid_section_description CHECK (length(trim(section_description)) > 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster queries on active about description images
CREATE INDEX IF NOT EXISTS idx_about_description_images_active 
ON about_description_images(is_active, display_order ASC, created_at DESC);

-- Index for faster queries on active about description sections
CREATE INDEX IF NOT EXISTS idx_about_description_sections_active 
ON about_description_sections(is_active, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on about_description_images table
ALTER TABLE about_description_images ENABLE ROW LEVEL SECURITY;

-- Enable RLS on about_description_sections table
ALTER TABLE about_description_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to about description images
CREATE POLICY "Public read access to about description images"
ON about_description_images FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage about description images
CREATE POLICY "Authenticated users can manage about description images"
ON about_description_images FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow public read access to about description sections
CREATE POLICY "Public read access to about description sections"
ON about_description_sections FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage about description sections
CREATE POLICY "Authenticated users can manage about description sections"
ON about_description_sections FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy: Allow public read access to about description storage
CREATE POLICY "Public read access to about description storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'about-description');

-- Policy: Allow authenticated users to upload about description images
CREATE POLICY "Authenticated users can upload about description images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'about-description' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'uploads'
);

-- Policy: Allow authenticated users to update about description images
CREATE POLICY "Authenticated users can update about description images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'about-description' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete about description images
CREATE POLICY "Authenticated users can delete about description images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'about-description' 
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

-- Trigger for about_description_images table
CREATE TRIGGER update_about_description_images_updated_at
  BEFORE UPDATE ON about_description_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for about_description_sections table
CREATE TRIGGER update_about_description_sections_updated_at
  BEFORE UPDATE ON about_description_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial section data based on current static content
INSERT INTO about_description_sections (
  section_heading,
  section_description,
  background_color,
  service_1_title,
  service_1_icon_url,
  service_1_description,
  service_2_title,
  service_2_icon_url,
  service_2_description,
  service_3_title,
  service_3_icon_url,
  service_3_description
) VALUES (
  'Computer Software and ITES:',
  'ESC has emerged as a prime institution spearheading interest of Electronics and IT industry in the country. The Council proactively engages with the Government, both at the Centre and in States, to create a policy and regulatory environment conducive to growth of industry. Council also works in close coordination with India''s Diplomatic Missions in various countries and Missions of various countries in India. ESC has an extensive network of like-minded organizations world over that helps in linking member companies with their counterparts in these economies. Significantly, ESC acts as the implementing agency for Government schemes to promote electronics and IT exports from India. Sectors covered by the Council include:',
  '#f9f7f7',
  'Customised Software Development',
  '/icons/code.svg',
  '',
  'Software Products',
  '/icons/computer.svg', 
  '',
  'IT Enabled Services',
  '/icons/gear.svg',
  ''
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Create function to get about description section
CREATE OR REPLACE FUNCTION get_about_description_section()
RETURNS TABLE (
  id UUID,
  section_heading TEXT,
  section_description TEXT,
  background_color TEXT,
  service_1_title TEXT,
  service_1_icon_url TEXT,
  service_1_description TEXT,
  service_2_title TEXT,
  service_2_icon_url TEXT,
  service_2_description TEXT,
  service_3_title TEXT,
  service_3_icon_url TEXT,
  service_3_description TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ads.id,
    ads.section_heading,
    ads.section_description,
    ads.background_color,
    ads.service_1_title,
    ads.service_1_icon_url,
    ads.service_1_description,
    ads.service_2_title,
    ads.service_2_icon_url,
    ads.service_2_description,
    ads.service_3_title,
    ads.service_3_icon_url,
    ads.service_3_description,
    ads.is_active,
    ads.created_at,
    ads.updated_at
  FROM about_description_sections ads
  WHERE ads.is_active = true
  ORDER BY ads.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all about description images
CREATE OR REPLACE FUNCTION get_about_description_images()
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
    adi.id,
    adi.file_name,
    adi.file_path,
    adi.file_path as file_url,  -- Return file path for frontend URL construction
    adi.alt_text,
    adi.file_size,
    adi.mime_type,
    adi.width,
    adi.height,
    adi.display_order,
    adi.is_active,
    adi.created_at,
    adi.updated_at
  FROM about_description_images adi
  WHERE adi.is_active = true
  ORDER BY adi.display_order ASC, adi.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the functions
GRANT EXECUTE ON FUNCTION get_about_description_section() TO authenticated;
GRANT EXECUTE ON FUNCTION get_about_description_section() TO anon;
GRANT EXECUTE ON FUNCTION get_about_description_images() TO authenticated;
GRANT EXECUTE ON FUNCTION get_about_description_images() TO anon;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to validate image file type
CREATE OR REPLACE FUNCTION validate_description_image_type(mime_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif');
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on helper functions
GRANT EXECUTE ON FUNCTION validate_description_image_type(TEXT) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE about_description_images IS 'Stores images for about description section with metadata and organization';
COMMENT ON TABLE about_description_sections IS 'Stores content and configuration for about description sections including service items';
COMMENT ON FUNCTION get_about_description_section() IS 'Returns the active about description section with all service items';
COMMENT ON FUNCTION get_about_description_images() IS 'Returns all active about description images with file paths for frontend URL construction';
COMMENT ON FUNCTION validate_description_image_type(TEXT) IS 'Validates image MIME type for uploads';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'about_description_%';

-- Verify initial data was inserted
-- SELECT * FROM about_description_sections WHERE is_active = true;

-- Test the database functions
-- SELECT * FROM get_about_description_section();
-- SELECT * FROM get_about_description_images();

-- Test validation functions
-- SELECT validate_description_image_type('image/jpeg');

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'About description schema setup completed successfully!';
  RAISE NOTICE 'Storage bucket "about-description" created with proper policies.';
  RAISE NOTICE 'Database tables and functions are ready for use.';
  RAISE NOTICE 'Initial data has been inserted based on current description section.';
END $$;
