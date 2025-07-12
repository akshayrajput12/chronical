-- Kiosk Manufacturers Section Schema for Supabase
-- This file contains the SQL schema for the kiosk manufacturers section of the Chronicle Exhibits website
-- 
-- ⚠️  SAFE TO RUN: This script only adds kiosk manufacturers support, preserves existing data
-- 🎯 ADDS: Kiosk manufacturers tables with image management and dynamic content
-- ✅ RESULT: Kiosk manufacturers section supports dynamic content and image management
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for kiosk manufacturers images (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kiosk-manufacturers',
  'kiosk-manufacturers',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DATABASE TABLES
-- ============================================================================

-- Create kiosk_manufacturers_images table
CREATE TABLE IF NOT EXISTS kiosk_manufacturers_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Image Details
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  
  -- Image Metadata
  width INTEGER,
  height INTEGER,
  
  -- Organization
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Constraints
  CONSTRAINT valid_file_name CHECK (length(trim(file_name)) > 0),
  CONSTRAINT valid_file_path CHECK (length(trim(file_path)) > 0),
  CONSTRAINT valid_file_size CHECK (file_size > 0),
  CONSTRAINT valid_dimensions CHECK (width > 0 AND height > 0)
);

-- Create kiosk_manufacturers_sections table
CREATE TABLE IF NOT EXISTS kiosk_manufacturers_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Section Content
  section_heading TEXT NOT NULL DEFAULT 'LOOKING FOR CUSTOM KIOSK MANUFACTURERS IN DUBAI?',
  content_paragraph_1 TEXT NOT NULL DEFAULT 'We are one of the topmost companies involved in custom kiosk manufacturing in Dubai & UAE, offering a broad range of kiosks including mall kiosks, jewelry showcases, and museums, cosmetics, Watch, perfume, electronic displays & much more. Have kiosks in different sizes & styles for you to choose from. Chronicle has showcased our top technology products. Consider all the factors such as floor position, the height of kiosk, safety, security & durability while designing the kiosk.',
  content_paragraph_2 TEXT NOT NULL DEFAULT 'Chronicle as Exhibition Stand Builders in UAE has years of experience & expertise as a custom kiosk manufacturers in Dubai. A proficient team of kiosk designers & engineers who have the caliber to build creative & innovative kiosks for your specific requirements. Also, deal in the manufacture of retail window exhibits, kiosk stands, exhibition stands & graphic displays. Reach out if you need performance-oriented & advanced custom kiosk solutions for trade shows & any of your business requirements.',
  
  -- Link Configuration
  link_text TEXT DEFAULT 'Exhibition Stand Builders in UAE',
  link_url TEXT DEFAULT '/about-us',
  
  -- Image Association
  main_image_id UUID REFERENCES kiosk_manufacturers_images(id) ON DELETE SET NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_section_heading CHECK (length(trim(section_heading)) > 0),
  CONSTRAINT valid_content_paragraph_1 CHECK (length(trim(content_paragraph_1)) > 0),
  CONSTRAINT valid_content_paragraph_2 CHECK (length(trim(content_paragraph_2)) > 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster queries on active kiosk manufacturers images
CREATE INDEX IF NOT EXISTS idx_kiosk_manufacturers_images_active 
ON kiosk_manufacturers_images(is_active, display_order, created_at DESC);

-- Index for faster queries on active kiosk manufacturers sections
CREATE INDEX IF NOT EXISTS idx_kiosk_manufacturers_sections_active 
ON kiosk_manufacturers_sections(is_active, created_at DESC);

-- Index for image-section relationships
CREATE INDEX IF NOT EXISTS idx_kiosk_manufacturers_sections_main_image 
ON kiosk_manufacturers_sections(main_image_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on kiosk_manufacturers_images table
ALTER TABLE kiosk_manufacturers_images ENABLE ROW LEVEL SECURITY;

-- Enable RLS on kiosk_manufacturers_sections table
ALTER TABLE kiosk_manufacturers_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to kiosk manufacturers images
CREATE POLICY "Public read access to kiosk manufacturers images"
ON kiosk_manufacturers_images FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage kiosk manufacturers images
CREATE POLICY "Authenticated users can manage kiosk manufacturers images"
ON kiosk_manufacturers_images FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow public read access to kiosk manufacturers sections
CREATE POLICY "Public read access to kiosk manufacturers sections"
ON kiosk_manufacturers_sections FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage kiosk manufacturers sections
CREATE POLICY "Authenticated users can manage kiosk manufacturers sections"
ON kiosk_manufacturers_sections FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy: Allow public read access to kiosk manufacturers images in storage
CREATE POLICY "Public read access to kiosk manufacturers images in storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'kiosk-manufacturers');

-- Policy: Allow authenticated users to upload kiosk manufacturers images
CREATE POLICY "Authenticated users can upload kiosk manufacturers images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kiosk-manufacturers' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'uploads'
);

-- Policy: Allow authenticated users to update kiosk manufacturers images
CREATE POLICY "Authenticated users can update kiosk manufacturers images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'kiosk-manufacturers' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete kiosk manufacturers images
CREATE POLICY "Authenticated users can delete kiosk manufacturers images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'kiosk-manufacturers' 
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

-- Trigger for kiosk_manufacturers_images table
CREATE TRIGGER update_kiosk_manufacturers_images_updated_at
  BEFORE UPDATE ON kiosk_manufacturers_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for kiosk_manufacturers_sections table
CREATE TRIGGER update_kiosk_manufacturers_sections_updated_at
  BEFORE UPDATE ON kiosk_manufacturers_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial data based on the current kiosk manufacturers section
INSERT INTO kiosk_manufacturers_sections (
  section_heading,
  content_paragraph_1,
  content_paragraph_2,
  link_text,
  link_url
) VALUES (
  'LOOKING FOR CUSTOM KIOSK MANUFACTURERS IN DUBAI?',
  'We are one of the topmost companies involved in custom kiosk manufacturing in Dubai & UAE, offering a broad range of kiosks including mall kiosks, jewelry showcases, and museums, cosmetics, Watch, perfume, electronic displays & much more. Have kiosks in different sizes & styles for you to choose from. Chronicle has showcased our top technology products. Consider all the factors such as floor position, the height of kiosk, safety, security & durability while designing the kiosk.',
  'Chronicle as Exhibition Stand Builders in UAE has years of experience & expertise as a custom kiosk manufacturers in Dubai. A proficient team of kiosk designers & engineers who have the caliber to build creative & innovative kiosks for your specific requirements. Also, deal in the manufacture of retail window exhibits, kiosk stands, exhibition stands & graphic displays. Reach out if you need performance-oriented & advanced custom kiosk solutions for trade shows & any of your business requirements.',
  'Exhibition Stand Builders in UAE',
  '/about-us'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Create function to get kiosk manufacturers section with images
CREATE OR REPLACE FUNCTION get_kiosk_manufacturers_section()
RETURNS TABLE (
  id UUID,
  section_heading TEXT,
  content_paragraph_1 TEXT,
  content_paragraph_2 TEXT,
  link_text TEXT,
  link_url TEXT,
  main_image_id UUID,
  main_image_url TEXT,
  main_image_alt TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    kms.id,
    kms.section_heading,
    kms.content_paragraph_1,
    kms.content_paragraph_2,
    kms.link_text,
    kms.link_url,
    kms.main_image_id,
    CASE
      WHEN kmi.file_path IS NOT NULL
      THEN CONCAT('https://your-supabase-url.supabase.co/storage/v1/object/public/kiosk-manufacturers/', kmi.file_path)
      ELSE NULL
    END as main_image_url,
    kmi.alt_text as main_image_alt,
    kms.is_active,
    kms.created_at,
    kms.updated_at
  FROM kiosk_manufacturers_sections kms
  LEFT JOIN kiosk_manufacturers_images kmi ON kms.main_image_id = kmi.id
  WHERE kms.is_active = true
  ORDER BY kms.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all kiosk manufacturers images
CREATE OR REPLACE FUNCTION get_kiosk_manufacturers_images()
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
    kmi.id,
    kmi.file_name,
    kmi.file_path,
    CONCAT('https://your-supabase-url.supabase.co/storage/v1/object/public/kiosk-manufacturers/', kmi.file_path) as file_url,
    kmi.alt_text,
    kmi.file_size,
    kmi.mime_type,
    kmi.width,
    kmi.height,
    kmi.display_order,
    kmi.is_active,
    kmi.created_at,
    kmi.updated_at
  FROM kiosk_manufacturers_images kmi
  WHERE kmi.is_active = true
  ORDER BY kmi.display_order ASC, kmi.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the functions to authenticated users and anon
GRANT EXECUTE ON FUNCTION get_kiosk_manufacturers_section() TO authenticated;
GRANT EXECUTE ON FUNCTION get_kiosk_manufacturers_section() TO anon;
GRANT EXECUTE ON FUNCTION get_kiosk_manufacturers_images() TO authenticated;
GRANT EXECUTE ON FUNCTION get_kiosk_manufacturers_images() TO anon;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to cleanup orphaned images
CREATE OR REPLACE FUNCTION cleanup_orphaned_manufacturers_images()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete images that are not referenced by any section and are older than 1 hour
  DELETE FROM kiosk_manufacturers_images
  WHERE id NOT IN (
    SELECT main_image_id
    FROM kiosk_manufacturers_sections
    WHERE main_image_id IS NOT NULL
  )
  AND created_at < NOW() - INTERVAL '1 hour'
  AND is_active = false;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update image display order
CREATE OR REPLACE FUNCTION update_manufacturers_image_order(image_id UUID, new_order INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE kiosk_manufacturers_images
  SET display_order = new_order, updated_at = NOW()
  WHERE id = image_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on helper functions
GRANT EXECUTE ON FUNCTION cleanup_orphaned_manufacturers_images() TO authenticated;
GRANT EXECUTE ON FUNCTION update_manufacturers_image_order(UUID, INTEGER) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE kiosk_manufacturers_images IS 'Stores images for kiosk manufacturers sections with Supabase storage integration';
COMMENT ON TABLE kiosk_manufacturers_sections IS 'Stores content and configuration for kiosk manufacturers sections';
COMMENT ON FUNCTION get_kiosk_manufacturers_section() IS 'Returns the active kiosk manufacturers section with associated main image';
COMMENT ON FUNCTION get_kiosk_manufacturers_images() IS 'Returns all active kiosk manufacturers images ordered by display order';
COMMENT ON FUNCTION cleanup_orphaned_manufacturers_images() IS 'Removes orphaned images that are not referenced by any section';
COMMENT ON FUNCTION update_manufacturers_image_order(UUID, INTEGER) IS 'Updates the display order of a specific image';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'kiosk_manufacturers_%';

-- Verify storage bucket was created
-- SELECT * FROM storage.buckets WHERE id = 'kiosk-manufacturers';

-- Verify initial data was inserted
-- SELECT * FROM kiosk_manufacturers_sections WHERE is_active = true;

-- Test the database functions
-- SELECT * FROM get_kiosk_manufacturers_section();
-- SELECT * FROM get_kiosk_manufacturers_images();
