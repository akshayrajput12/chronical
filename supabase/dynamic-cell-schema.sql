-- Dynamic Cell Image Management Schema for Supabase
-- This file contains the SQL schema for the dynamic cell section image management
--
-- ⚠️  DEPENDENCY-SAFE EXECUTION ⚠️
-- This script is designed to run safely without breaking existing database objects
--
-- WHAT THIS SCRIPT PRESERVES:
-- ✅ update_updated_at_column() function (used by multiple tables)
-- ✅ All existing triggers on other tables (hero_sections, business_sections, etc.)
-- ✅ All existing storage policies for other buckets
-- ✅ All existing RLS policies on other tables
--
-- WHAT THIS SCRIPT MANAGES:
-- 🎯 Only dynamic-cell-images storage bucket and policies
-- 🎯 Only dynamic_cell_images and dynamic_cell_section tables
-- 🎯 Only triggers specific to dynamic cell tables
-- 🎯 Only functions specific to dynamic cell functionality
--
-- 🚀 SAFE TO RUN: This script can be executed multiple times without errors
--
-- Run this script in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for dynamic cell images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dynamic-cell-images',
  'dynamic-cell-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Safely drop existing dynamic cell storage policies to avoid conflicts
-- IMPORTANT: Only dropping policies specific to dynamic-cell-images bucket
-- This will NOT affect other storage policies for different buckets
DO $$
BEGIN
    -- Safely drop policies only if they exist and are for our specific bucket
    BEGIN
        DROP POLICY IF EXISTS "dynamic_cell_public_select" ON storage.objects;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;

    BEGIN
        DROP POLICY IF EXISTS "dynamic_cell_authenticated_insert" ON storage.objects;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;

    BEGIN
        DROP POLICY IF EXISTS "dynamic_cell_authenticated_update" ON storage.objects;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;

    BEGIN
        DROP POLICY IF EXISTS "dynamic_cell_authenticated_delete" ON storage.objects;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
END $$;

-- Create storage policies for dynamic cell images bucket
-- Allow public viewing of images
CREATE POLICY "dynamic_cell_public_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'dynamic-cell-images');

-- Allow authenticated users to upload images
CREATE POLICY "dynamic_cell_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'dynamic-cell-images');

-- Allow authenticated users to update images
CREATE POLICY "dynamic_cell_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'dynamic-cell-images')
  WITH CHECK (bucket_id = 'dynamic-cell-images');

-- Allow authenticated users to delete images
CREATE POLICY "dynamic_cell_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'dynamic-cell-images');

-- Safely drop existing dynamic cell tables if they exist
-- Using CASCADE only for our specific tables to clean up their dependencies
-- This will NOT affect other tables or their dependencies
DROP TABLE IF EXISTS dynamic_cell_images CASCADE;
DROP TABLE IF EXISTS dynamic_cell_section CASCADE;

-- Create dynamic_cell_images table for tracking uploaded images
CREATE TABLE dynamic_cell_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER NOT NULL DEFAULT 1920, -- Static width for consistency
  height INTEGER NOT NULL DEFAULT 1080, -- Static height for consistency
  alt_text TEXT NOT NULL DEFAULT 'Dynamic cell background image',
  is_active BOOLEAN NOT NULL DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 10485760),
  CONSTRAINT valid_mime_type CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')),
  CONSTRAINT valid_dimensions CHECK (width = 1920 AND height = 1080),
  CONSTRAINT valid_filename CHECK (length(trim(filename)) > 0),
  CONSTRAINT valid_original_filename CHECK (length(trim(original_filename)) > 0),
  CONSTRAINT valid_file_path CHECK (length(trim(file_path)) > 0)
);

-- Create dynamic_cell_section table for section content
CREATE TABLE dynamic_cell_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL DEFAULT 'Business Hub',
  description TEXT DEFAULT 'Dynamic business statistics and information center',
  background_image_id UUID REFERENCES dynamic_cell_images(id) ON DELETE SET NULL,
  background_image_url TEXT,
  fallback_image_url TEXT NOT NULL DEFAULT '/images/home.jpg',
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Constraints
  CONSTRAINT valid_title CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_fallback_url CHECK (length(trim(fallback_image_url)) > 0)
);

-- Create unique partial index to ensure only one active section
CREATE UNIQUE INDEX idx_dynamic_cell_section_active
ON dynamic_cell_section (is_active)
WHERE is_active = true;

-- Create indexes for better performance
CREATE INDEX idx_dynamic_cell_images_active ON dynamic_cell_images(is_active) WHERE is_active = true;
CREATE INDEX idx_dynamic_cell_images_created_at ON dynamic_cell_images(created_at DESC);
CREATE INDEX idx_dynamic_cell_images_uploaded_by ON dynamic_cell_images(uploaded_by);
CREATE INDEX idx_dynamic_cell_images_file_path ON dynamic_cell_images(file_path);

-- Enable Row Level Security (RLS)
ALTER TABLE dynamic_cell_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_cell_section ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies for dynamic cell tables if they exist
-- Note: Using DO block to safely check and drop policies
DO $$
BEGIN
    -- Drop policies for dynamic_cell_images table
    DROP POLICY IF EXISTS "dynamic_cell_images_select_policy" ON dynamic_cell_images;
    DROP POLICY IF EXISTS "dynamic_cell_images_insert_policy" ON dynamic_cell_images;
    DROP POLICY IF EXISTS "dynamic_cell_images_update_policy" ON dynamic_cell_images;
    DROP POLICY IF EXISTS "dynamic_cell_images_delete_policy" ON dynamic_cell_images;

    -- Drop policies for dynamic_cell_section table
    DROP POLICY IF EXISTS "dynamic_cell_section_select_policy" ON dynamic_cell_section;
    DROP POLICY IF EXISTS "dynamic_cell_section_insert_policy" ON dynamic_cell_section;
    DROP POLICY IF EXISTS "dynamic_cell_section_update_policy" ON dynamic_cell_section;
    DROP POLICY IF EXISTS "dynamic_cell_section_delete_policy" ON dynamic_cell_section;
EXCEPTION
    WHEN undefined_table THEN
        -- Tables don't exist yet, which is fine
        NULL;
END $$;

-- Create RLS policies for dynamic_cell_images
-- Allow public to view image records
CREATE POLICY "dynamic_cell_images_select_policy" ON dynamic_cell_images
  FOR SELECT USING (true);

-- Allow authenticated users to insert image records
CREATE POLICY "dynamic_cell_images_insert_policy" ON dynamic_cell_images
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update image records
CREATE POLICY "dynamic_cell_images_update_policy" ON dynamic_cell_images
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete image records
CREATE POLICY "dynamic_cell_images_delete_policy" ON dynamic_cell_images
  FOR DELETE TO authenticated
  USING (true);

-- Create RLS policies for dynamic_cell_section
-- Allow public to view section data
CREATE POLICY "dynamic_cell_section_select_policy" ON dynamic_cell_section
  FOR SELECT USING (true);

-- Allow authenticated users to manage section data
CREATE POLICY "dynamic_cell_section_insert_policy" ON dynamic_cell_section
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "dynamic_cell_section_update_policy" ON dynamic_cell_section
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "dynamic_cell_section_delete_policy" ON dynamic_cell_section
  FOR DELETE TO authenticated USING (true);

-- Insert initial data for dynamic_cell_section
INSERT INTO dynamic_cell_section (
  title,
  description,
  background_image_url,
  fallback_image_url,
  is_active
) VALUES (
  'Business Hub',
  'Dynamic business statistics and information center',
  '/images/home.jpg',
  '/images/home.jpg',
  true
);

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_dynamic_cell_section();
DROP FUNCTION IF EXISTS set_active_background_image(UUID);
DROP FUNCTION IF EXISTS cleanup_unused_images();

-- Create function to get active dynamic cell section with image data
CREATE OR REPLACE FUNCTION get_dynamic_cell_section()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  background_image_url TEXT,
  fallback_image_url TEXT,
  image_data JSON
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dcs.id,
    dcs.title,
    dcs.description,
    COALESCE(
      dci.file_path,  -- Return just the file path, frontend will construct URL
      dcs.background_image_url,
      dcs.fallback_image_url
    ) AS background_image_url,
    dcs.fallback_image_url,
    CASE
      WHEN dci.id IS NOT NULL
      THEN json_build_object(
        'id', dci.id,
        'filename', dci.filename,
        'original_filename', dci.original_filename,
        'file_size', dci.file_size,
        'mime_type', dci.mime_type,
        'width', dci.width,
        'height', dci.height,
        'alt_text', dci.alt_text,
        'created_at', dci.created_at,
        'is_active', dci.is_active,
        'file_path', dci.file_path
      )
      ELSE NULL
    END AS image_data
  FROM dynamic_cell_section dcs
  LEFT JOIN dynamic_cell_images dci ON dcs.background_image_id = dci.id AND dci.is_active = true
  WHERE dcs.is_active = true
  ORDER BY dcs.created_at DESC
  LIMIT 1;
END;
$$;

-- Create function to set active background image
CREATE OR REPLACE FUNCTION set_active_background_image(image_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  section_id UUID;
  image_exists BOOLEAN;
BEGIN
  -- Check if image exists
  SELECT EXISTS(SELECT 1 FROM dynamic_cell_images WHERE id = image_id) INTO image_exists;

  IF NOT image_exists THEN
    RAISE EXCEPTION 'Image with ID % does not exist', image_id;
  END IF;

  -- Get active section
  SELECT id INTO section_id FROM dynamic_cell_section WHERE is_active = true LIMIT 1;

  IF section_id IS NULL THEN
    RAISE EXCEPTION 'No active dynamic cell section found';
  END IF;

  -- Update all images to inactive
  UPDATE dynamic_cell_images SET is_active = false, updated_at = NOW();

  -- Set the selected image as active
  UPDATE dynamic_cell_images
  SET is_active = true, updated_at = NOW()
  WHERE id = image_id;

  -- Update section to reference the new image
  UPDATE dynamic_cell_section
  SET background_image_id = image_id, updated_at = NOW()
  WHERE id = section_id;

  RETURN true;
END;
$$;

-- Create function to clean up unused images
CREATE OR REPLACE FUNCTION cleanup_unused_images()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Delete image records that are not referenced by any section and are not active
  DELETE FROM dynamic_cell_images
  WHERE id NOT IN (
    SELECT background_image_id
    FROM dynamic_cell_section
    WHERE background_image_id IS NOT NULL
  )
  AND is_active = false
  AND created_at < NOW() - INTERVAL '7 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  RETURN deleted_count;
END;
$$;

-- Drop existing triggers for dynamic cell tables only (preserve shared functions)
DROP TRIGGER IF EXISTS update_dynamic_cell_images_updated_at ON dynamic_cell_images;
DROP TRIGGER IF EXISTS update_dynamic_cell_section_updated_at ON dynamic_cell_section;
DROP TRIGGER IF EXISTS ensure_single_active_section_trigger ON dynamic_cell_section;

-- Drop only the ensure_single_active_section function (specific to dynamic cell)
DROP FUNCTION IF EXISTS ensure_single_active_section();

-- DO NOT DROP update_updated_at_column() as it's used by other tables:
-- - hero_sections, hero_typing_texts, business_sections, business_paragraphs
-- - business_stats, why_sections, essential_support_data, setup_process_section, setup_process_steps
--
-- The function should already exist, but we'll ensure it exists without dropping it
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_dynamic_cell_images_updated_at
    BEFORE UPDATE ON dynamic_cell_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dynamic_cell_section_updated_at
    BEFORE UPDATE ON dynamic_cell_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to ensure only one active section
CREATE OR REPLACE FUNCTION ensure_single_active_section()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_active = true THEN
    -- Deactivate all other sections
    UPDATE dynamic_cell_section
    SET is_active = false, updated_at = NOW()
    WHERE id != NEW.id AND is_active = true;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to ensure only one active section
CREATE TRIGGER ensure_single_active_section_trigger
    BEFORE INSERT OR UPDATE ON dynamic_cell_section
    FOR EACH ROW
    WHEN (NEW.is_active = true)
    EXECUTE FUNCTION ensure_single_active_section();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON dynamic_cell_images TO authenticated;
GRANT ALL ON dynamic_cell_section TO authenticated;
GRANT EXECUTE ON FUNCTION get_dynamic_cell_section() TO authenticated;
GRANT EXECUTE ON FUNCTION set_active_background_image(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_unused_images() TO authenticated;

-- ✅ SCHEMA EXECUTION COMPLETE
--
-- Verify successful execution by checking:
-- 1. Storage bucket: SELECT * FROM storage.buckets WHERE id = 'dynamic-cell-images';
-- 2. Tables created: \dt dynamic_cell*
-- 3. Functions created: \df *dynamic_cell*
-- 4. Policies created: \dp dynamic_cell*
--
-- The dynamic cell image management system is now ready for use!
--
-- Next steps:
-- 1. Test image upload through the admin panel
-- 2. Verify frontend integration with the dynamic cell component
-- 3. Ensure Next.js domains are configured for your Supabase project URL
--
-- Note: The get_dynamic_cell_section() function returns file paths, not full URLs.
-- The frontend components construct the full Supabase URLs using the storage client.
