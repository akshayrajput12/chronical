-- Kiosk Manufacturers Schema Fix for Image URLs
-- This script fixes the image URL generation in database functions
-- 
-- ⚠️  SAFE TO RUN: This script only updates functions, preserves existing data
-- 🎯 FIXES: Image URL generation to use proper Supabase storage URLs
-- ✅ RESULT: Images will display correctly in admin and frontend
--
-- Run this script in Supabase SQL Editor

-- ============================================================================
-- UPDATE DATABASE FUNCTIONS WITH PROPER URL GENERATION
-- ============================================================================

-- Update function to get kiosk manufacturers section with proper image URLs
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
      THEN kmi.file_path  -- Return just the file path, let frontend handle URL construction
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

-- Update function to get all kiosk manufacturers images with proper URLs
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
    kmi.file_path as file_url,  -- Return just the file path, let frontend handle URL construction
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

-- Grant execute permission on the updated functions
GRANT EXECUTE ON FUNCTION get_kiosk_manufacturers_section() TO authenticated;
GRANT EXECUTE ON FUNCTION get_kiosk_manufacturers_section() TO anon;
GRANT EXECUTE ON FUNCTION get_kiosk_manufacturers_images() TO authenticated;
GRANT EXECUTE ON FUNCTION get_kiosk_manufacturers_images() TO anon;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION get_kiosk_manufacturers_section() IS 'Returns the active kiosk manufacturers section with file paths for frontend URL construction';
COMMENT ON FUNCTION get_kiosk_manufacturers_images() IS 'Returns all active kiosk manufacturers images with file paths for frontend URL construction';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Test the updated database functions
-- SELECT * FROM get_kiosk_manufacturers_section();
-- SELECT * FROM get_kiosk_manufacturers_images();

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Kiosk manufacturers schema fix completed successfully!';
  RAISE NOTICE 'Database functions now return file paths for proper URL construction.';
  RAISE NOTICE 'Frontend components will handle Supabase URL generation.';
END $$;
