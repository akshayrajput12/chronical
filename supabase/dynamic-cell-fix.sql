-- Dynamic Cell Image Management - Fix Script
-- This script fixes the hardcoded URL issue in get_dynamic_cell_section() function
-- 
-- ⚠️  SAFE TO RUN: This script only updates the function, no table changes
-- 🎯 FIXES: Removes hardcoded "your-project.supabase.co" URL
-- ✅ RESULT: Function returns file paths, frontend constructs proper URLs
--
-- Run this script in Supabase SQL Editor after running the main schema

-- Update the get_dynamic_cell_section function to return file paths instead of hardcoded URLs
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

-- ✅ FIX COMPLETE
--
-- What this script does:
-- 1. Updates get_dynamic_cell_section() function only
-- 2. Removes hardcoded "your-project.supabase.co" URL
-- 3. Returns file paths instead of full URLs
-- 4. Frontend components will construct proper Supabase URLs
--
-- Verification:
-- SELECT * FROM get_dynamic_cell_section();
-- 
-- Expected result: background_image_url should be a file path like "filename.jpg"
-- not a full URL with "your-project.supabase.co"
