-- About Dedication Section Schema for Supabase
-- This file contains the SQL schema for the about dedication section of the Chronicle Exhibits website
-- 
-- ⚠️  SAFE TO RUN: This script only adds about dedication support, preserves existing data
-- 🎯 ADDS: About dedication table with dynamic content and image management
-- ✅ RESULT: About dedication section supports dynamic content and image management
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for about dedication images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'about-dedication',
  'about-dedication',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DATABASE TABLES
-- ============================================================================

-- Create about_dedication_images table
CREATE TABLE IF NOT EXISTS about_dedication_images (
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

-- Create about_dedication_sections table
CREATE TABLE IF NOT EXISTS about_dedication_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Section Content
  section_heading TEXT NOT NULL DEFAULT 'DEDICATION TO QUALITY AND PRECISION',
  section_description TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_section_heading CHECK (length(trim(section_heading)) > 0)
);

-- Create about_dedication_items table for individual dedication cards
CREATE TABLE IF NOT EXISTS about_dedication_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Image
  image_id UUID REFERENCES about_dedication_images(id) ON DELETE SET NULL,
  fallback_image_url TEXT,
  
  -- Organization
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Foreign Key
  section_id UUID REFERENCES about_dedication_sections(id) ON DELETE CASCADE,

  -- Constraints
  CONSTRAINT valid_title CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_description CHECK (length(trim(description)) > 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster queries on active about dedication images
CREATE INDEX IF NOT EXISTS idx_about_dedication_images_active 
ON about_dedication_images(is_active, display_order ASC, created_at DESC);

-- Index for faster queries on active about dedication sections
CREATE INDEX IF NOT EXISTS idx_about_dedication_sections_active 
ON about_dedication_sections(is_active, created_at DESC);

-- Index for faster queries on dedication items
CREATE INDEX IF NOT EXISTS idx_about_dedication_items_section 
ON about_dedication_items(section_id, is_active, display_order ASC);

-- Index for image relationship in dedication items
CREATE INDEX IF NOT EXISTS idx_about_dedication_items_image 
ON about_dedication_items(image_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on about_dedication_images table
ALTER TABLE about_dedication_images ENABLE ROW LEVEL SECURITY;

-- Enable RLS on about_dedication_sections table
ALTER TABLE about_dedication_sections ENABLE ROW LEVEL SECURITY;

-- Enable RLS on about_dedication_items table
ALTER TABLE about_dedication_items ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to about dedication images
CREATE POLICY "Public read access to about dedication images"
ON about_dedication_images FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage about dedication images
CREATE POLICY "Authenticated users can manage about dedication images"
ON about_dedication_images FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow public read access to about dedication sections
CREATE POLICY "Public read access to about dedication sections"
ON about_dedication_sections FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage about dedication sections
CREATE POLICY "Authenticated users can manage about dedication sections"
ON about_dedication_sections FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow public read access to about dedication items
CREATE POLICY "Public read access to about dedication items"
ON about_dedication_items FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage about dedication items
CREATE POLICY "Authenticated users can manage about dedication items"
ON about_dedication_items FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy: Allow public read access to about dedication storage
CREATE POLICY "Public read access to about dedication storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'about-dedication');

-- Policy: Allow authenticated users to upload about dedication images
CREATE POLICY "Authenticated users can upload about dedication images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'about-dedication' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'uploads'
);

-- Policy: Allow authenticated users to update about dedication images
CREATE POLICY "Authenticated users can update about dedication images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'about-dedication' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete about dedication images
CREATE POLICY "Authenticated users can delete about dedication images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'about-dedication' 
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

-- Trigger for about_dedication_images table
CREATE TRIGGER update_about_dedication_images_updated_at
  BEFORE UPDATE ON about_dedication_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for about_dedication_sections table
CREATE TRIGGER update_about_dedication_sections_updated_at
  BEFORE UPDATE ON about_dedication_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for about_dedication_items table
CREATE TRIGGER update_about_dedication_items_updated_at
  BEFORE UPDATE ON about_dedication_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial section data
INSERT INTO about_dedication_sections (
  section_heading,
  section_description
) VALUES (
  'DEDICATION TO QUALITY AND PRECISION',
  NULL
) ON CONFLICT DO NOTHING;

-- Insert initial dedication items based on the current dedication section
DO $$
DECLARE
  section_uuid UUID;
BEGIN
  -- Get the section ID
  SELECT id INTO section_uuid FROM about_dedication_sections WHERE section_heading = 'DEDICATION TO QUALITY AND PRECISION' LIMIT 1;

  -- Insert dedication items
  INSERT INTO about_dedication_items (
    section_id,
    title,
    description,
    fallback_image_url,
    display_order
  ) VALUES
  (
    section_uuid,
    'INNOVATION',
    'At Chronicle Exhibits, we believe in pushing the boundaries of creativity and technology to design trade show booths that captivate and inspire. Our commitment to innovation ensures that we deliver cutting-edge solutions tailored to our clients'' unique needs.',
    'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?q=80&w=1470&auto=format&fit=crop',
    1
  ),
  (
    section_uuid,
    'QUALITY',
    'Quality is at the heart of everything we do. From the materials we choose to the craftsmanship we employ, Chronicle Exhibits is dedicated to delivering exceptional booths that stand the test of time and make a lasting impression.',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1470&auto=format&fit=crop',
    2
  ),
  (
    section_uuid,
    'CUSTOMER FOCUS',
    'Our clients are our top priority. We work closely with each client to understand their vision and objectives, ensuring that every booth we create not only meets but exceeds their expectations. Your success is our success.',
    'https://images.unsplash.com/photo-1599642080669-0e7eaa5a2e18?q=80&w=1470&auto=format&fit=crop',
    3
  ),
  (
    section_uuid,
    'SUSTAINABILITY',
    'We are committed to environmentally responsible practices. Chronicle Exhibits strives to minimize our ecological footprint by using sustainable materials and processes, contributing to a greener future for the trade show industry.',
    'https://images.unsplash.com/photo-1582037928769-351659e8b8ba?q=80&w=1470&auto=format&fit=crop',
    4
  ),
  (
    section_uuid,
    'COLLABORATION',
    'Teamwork and collaboration are essential to our process. By fostering a collaborative environment, we harness the diverse talents of our team to deliver exceptional results for our clients.',
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1470&auto=format&fit=crop',
    5
  ) ON CONFLICT DO NOTHING;
END $$;

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Create function to get about dedication section with items and images
CREATE OR REPLACE FUNCTION get_about_dedication_section()
RETURNS TABLE (
  id UUID,
  section_heading TEXT,
  section_description TEXT,
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
    ads.is_active,
    ads.created_at,
    ads.updated_at
  FROM about_dedication_sections ads
  WHERE ads.is_active = true
  ORDER BY ads.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get dedication items with images
CREATE OR REPLACE FUNCTION get_about_dedication_items()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  image_id UUID,
  image_url TEXT,
  image_alt TEXT,
  fallback_image_url TEXT,
  display_order INTEGER,
  is_active BOOLEAN,
  section_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    adi.id,
    adi.title,
    adi.description,
    adi.image_id,
    CASE
      WHEN adimg.file_path IS NOT NULL
      THEN adimg.file_path  -- Return file path for frontend URL construction
      ELSE NULL
    END as image_url,
    adimg.alt_text as image_alt,
    adi.fallback_image_url,
    adi.display_order,
    adi.is_active,
    adi.section_id,
    adi.created_at,
    adi.updated_at
  FROM about_dedication_items adi
  LEFT JOIN about_dedication_images adimg ON adi.image_id = adimg.id
  WHERE adi.is_active = true
  ORDER BY adi.display_order ASC, adi.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all about dedication images
CREATE OR REPLACE FUNCTION get_about_dedication_images()
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
  FROM about_dedication_images adi
  WHERE adi.is_active = true
  ORDER BY adi.display_order ASC, adi.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the functions
GRANT EXECUTE ON FUNCTION get_about_dedication_section() TO authenticated;
GRANT EXECUTE ON FUNCTION get_about_dedication_section() TO anon;
GRANT EXECUTE ON FUNCTION get_about_dedication_items() TO authenticated;
GRANT EXECUTE ON FUNCTION get_about_dedication_items() TO anon;
GRANT EXECUTE ON FUNCTION get_about_dedication_images() TO authenticated;
GRANT EXECUTE ON FUNCTION get_about_dedication_images() TO anon;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to validate image file type
CREATE OR REPLACE FUNCTION validate_dedication_image_type(mime_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif');
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on helper functions
GRANT EXECUTE ON FUNCTION validate_dedication_image_type(TEXT) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE about_dedication_images IS 'Stores images for about dedication items with metadata and organization';
COMMENT ON TABLE about_dedication_sections IS 'Stores content and configuration for about dedication sections';
COMMENT ON TABLE about_dedication_items IS 'Stores individual dedication items (cards) with titles, descriptions, and images';
COMMENT ON FUNCTION get_about_dedication_section() IS 'Returns the active about dedication section';
COMMENT ON FUNCTION get_about_dedication_items() IS 'Returns all active dedication items with image information';
COMMENT ON FUNCTION get_about_dedication_images() IS 'Returns all active about dedication images with file paths for frontend URL construction';
COMMENT ON FUNCTION validate_dedication_image_type(TEXT) IS 'Validates image MIME type for uploads';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'about_dedication_%';

-- Verify initial data was inserted
-- SELECT * FROM about_dedication_sections WHERE is_active = true;
-- SELECT * FROM about_dedication_items WHERE is_active = true ORDER BY display_order;

-- Test the database functions
-- SELECT * FROM get_about_dedication_section();
-- SELECT * FROM get_about_dedication_items();
-- SELECT * FROM get_about_dedication_images();

-- Test validation functions
-- SELECT validate_dedication_image_type('image/jpeg');

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'About dedication schema setup completed successfully!';
  RAISE NOTICE 'Storage bucket "about-dedication" created with proper policies.';
  RAISE NOTICE 'Database tables and functions are ready for use.';
  RAISE NOTICE 'Initial data has been inserted based on current dedication section.';
END $$;
