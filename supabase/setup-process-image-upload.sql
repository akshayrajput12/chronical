-- Setup Process Image Upload Enhancement
-- This script adds image upload functionality to the setup process section
-- 
-- ⚠️  SAFE TO RUN: This script only adds image upload support, preserves existing data
-- 🎯 ADDS: Storage bucket, image management table, updated section table
-- ✅ RESULT: Setup process supports image upload with static dimensions
--
-- Run this script in Supabase SQL Editor after the main setup-process schema

-- Create storage bucket for setup process images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'setup-process-images',
  'setup-process-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Safely drop existing setup process storage policies to avoid conflicts
DO $$
BEGIN
    -- Safely drop policies only if they exist and are for our specific bucket
    BEGIN
        DROP POLICY IF EXISTS "setup_process_public_select" ON storage.objects;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;

    BEGIN
        DROP POLICY IF EXISTS "setup_process_authenticated_insert" ON storage.objects;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;

    BEGIN
        DROP POLICY IF EXISTS "setup_process_authenticated_update" ON storage.objects;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;

    BEGIN
        DROP POLICY IF EXISTS "setup_process_authenticated_delete" ON storage.objects;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
END $$;

-- Create storage policies for setup process images bucket
-- Allow public viewing of images
CREATE POLICY "setup_process_public_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'setup-process-images');

-- Allow authenticated users to upload images
CREATE POLICY "setup_process_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'setup-process-images');

-- Allow authenticated users to update images
CREATE POLICY "setup_process_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'setup-process-images')
  WITH CHECK (bucket_id = 'setup-process-images');

-- Allow authenticated users to delete images
CREATE POLICY "setup_process_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'setup-process-images');

-- Create setup_process_images table for tracking uploaded images
CREATE TABLE IF NOT EXISTS setup_process_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT 'Setup process background image',
  is_active BOOLEAN NOT NULL DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 10485760),
  CONSTRAINT valid_mime_type CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')),
  CONSTRAINT valid_filename CHECK (length(trim(filename)) > 0),
  CONSTRAINT valid_original_filename CHECK (length(trim(original_filename)) > 0),
  CONSTRAINT valid_file_path CHECK (length(trim(file_path)) > 0)
);

-- Add background_image_id column to setup_process_section table
ALTER TABLE setup_process_section 
ADD COLUMN IF NOT EXISTS background_image_id UUID REFERENCES setup_process_images(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_setup_process_images_active ON setup_process_images(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_setup_process_images_created_at ON setup_process_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_setup_process_images_uploaded_by ON setup_process_images(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_setup_process_images_file_path ON setup_process_images(file_path);

-- Enable Row Level Security (RLS) on setup_process_images table
ALTER TABLE setup_process_images ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies for setup_process_images if they exist
DO $$
BEGIN
    DROP POLICY IF EXISTS "setup_process_images_select_policy" ON setup_process_images;
    DROP POLICY IF EXISTS "setup_process_images_insert_policy" ON setup_process_images;
    DROP POLICY IF EXISTS "setup_process_images_update_policy" ON setup_process_images;
    DROP POLICY IF EXISTS "setup_process_images_delete_policy" ON setup_process_images;
EXCEPTION
    WHEN undefined_table THEN
        -- Table doesn't exist yet, which is fine
        NULL;
END $$;

-- Create RLS policies for setup_process_images
-- Allow public to view image records
CREATE POLICY "setup_process_images_select_policy" ON setup_process_images
  FOR SELECT USING (true);

-- Allow authenticated users to insert image records
CREATE POLICY "setup_process_images_insert_policy" ON setup_process_images
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update image records
CREATE POLICY "setup_process_images_update_policy" ON setup_process_images
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete image records
CREATE POLICY "setup_process_images_delete_policy" ON setup_process_images
  FOR DELETE TO authenticated
  USING (true);

-- Create function to set active background image
CREATE OR REPLACE FUNCTION set_setup_process_active_image(image_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set all images to inactive
  UPDATE setup_process_images
  SET is_active = false, updated_at = NOW()
  WHERE is_active = true;

  -- Set the specified image as active
  UPDATE setup_process_images
  SET is_active = true, updated_at = NOW()
  WHERE id = image_id;

  -- Update the section to reference the active image
  UPDATE setup_process_section
  SET background_image_id = image_id, updated_at = NOW()
  WHERE is_active = true;

  RETURN FOUND;
END;
$$;

-- Create function to get setup process section with image data
CREATE OR REPLACE FUNCTION get_setup_process_section_with_image()
RETURNS TABLE (
  id UUID,
  title TEXT,
  subtitle TEXT,
  background_image_url TEXT,
  background_image_id UUID,
  steps JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sps.id,
    sps.title,
    sps.subtitle,
    COALESCE(
      (SELECT storage.get_public_url('setup-process-images', spi.file_path)::text
       FROM setup_process_images spi
       WHERE spi.id = sps.background_image_id AND spi.is_active = true),
      sps.background_image_url
    ) AS background_image_url,
    sps.background_image_id,
    (
      SELECT json_agg(json_build_object(
        'id', step.id,
        'title', step.title,
        'description', step.description,
        'step_number', step.step_number,
        'step_type', step.step_type,
        'category', step.category,
        'display_order', step.display_order
      ) ORDER BY step.display_order)
      FROM setup_process_steps step
      WHERE step.section_id = sps.id AND step.is_active = true
    ) AS steps
  FROM setup_process_section sps
  WHERE sps.is_active = true
  ORDER BY sps.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to cleanup unused images
CREATE OR REPLACE FUNCTION cleanup_setup_process_unused_images()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER := 0;
  image_record RECORD;
BEGIN
  -- Find images that are not referenced by any active section
  FOR image_record IN
    SELECT spi.id, spi.file_path
    FROM setup_process_images spi
    LEFT JOIN setup_process_section sps ON sps.background_image_id = spi.id
    WHERE sps.id IS NULL AND spi.is_active = false
  LOOP
    -- Delete from storage
    DELETE FROM storage.objects 
    WHERE bucket_id = 'setup-process-images' AND name = image_record.file_path;
    
    -- Delete from database
    DELETE FROM setup_process_images WHERE id = image_record.id;
    
    deleted_count := deleted_count + 1;
  END LOOP;
  
  RETURN deleted_count;
END;
$$;

-- Create trigger to update updated_at timestamp for setup_process_images
CREATE TRIGGER update_setup_process_images_updated_at
    BEFORE UPDATE ON setup_process_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON setup_process_images TO authenticated;
GRANT EXECUTE ON FUNCTION get_setup_process_section_with_image() TO authenticated;
GRANT EXECUTE ON FUNCTION set_setup_process_active_image(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_setup_process_unused_images() TO authenticated;

-- ✅ SCHEMA EXECUTION COMPLETE
--
-- Verify successful execution by checking:
-- 1. Storage bucket: SELECT * FROM storage.buckets WHERE id = 'setup-process-images';
-- 2. Tables created: \dt setup_process*
-- 3. Functions created: \df *setup_process*
-- 4. Policies created: \dp setup_process*
--
-- The setup process image management system is now ready for use!
--
-- Next steps:
-- 1. Test image upload through the admin panel
-- 2. Update the frontend components to use the new image upload functionality
-- 3. Ensure the background image displays correctly with static dimensions 