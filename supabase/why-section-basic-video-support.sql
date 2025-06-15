-- Why Section Basic Video Support Enhancement
-- This script enhances the existing why-section to support both images AND videos (basic approach)
-- 
-- ⚠️  SAFE TO RUN: This script only adds basic video support, preserves existing data
-- 🎯 ADDS: Video format support in storage bucket, media type field
-- ✅ RESULT: Why section supports both images and videos with simple approach
--
-- Run this script in Supabase SQL Editor after the main why-section schema

-- Update storage bucket to support video formats and larger file sizes
UPDATE storage.buckets 
SET 
  file_size_limit = 52428800, -- 50MB limit for videos
  allowed_mime_types = ARRAY[
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime'
  ]
WHERE id = 'why-section-images';

-- Add basic video support columns to why_sections table
ALTER TABLE why_sections 
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add basic constraint for media type consistency (only if it doesn't exist)
DO $$
BEGIN
    -- Try to add the constraint, ignore if it already exists
    BEGIN
        ALTER TABLE why_sections
        ADD CONSTRAINT media_type_consistency CHECK (
          (media_type = 'image' AND video_url IS NULL) OR
          (media_type = 'video' AND video_url IS NOT NULL)
        );
    EXCEPTION
        WHEN duplicate_object THEN
            -- Constraint already exists, which is fine
            NULL;
    END;
END $$;

-- Create index for better performance (safe creation)
CREATE INDEX IF NOT EXISTS idx_why_sections_media_type ON why_sections(media_type);

-- Drop the existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS get_why_section();

-- Create the updated get_why_section function to include basic video data
CREATE OR REPLACE FUNCTION get_why_section()
RETURNS TABLE (
  id UUID,
  heading TEXT,
  underline_color TEXT,
  subtitle TEXT,
  left_column_text_1 TEXT,
  left_column_text_2 TEXT,
  right_column_text TEXT,
  image_url TEXT,
  image_alt TEXT,
  image_overlay_heading TEXT,
  image_overlay_subheading TEXT,
  media_type TEXT,
  video_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ws.id,
    ws.heading,
    ws.underline_color,
    ws.subtitle,
    ws.left_column_text_1,
    ws.left_column_text_2,
    ws.right_column_text,
    ws.image_url,
    ws.image_alt,
    ws.image_overlay_heading,
    ws.image_overlay_subheading,
    ws.media_type,
    ws.video_url
  FROM why_sections ws
  WHERE ws.is_active = true
  ORDER BY ws.updated_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ✅ BASIC VIDEO ENHANCEMENT COMPLETE
--
-- What this script adds:
-- 1. Video format support in storage bucket (MP4, WebM, MOV, AVI, QuickTime)
-- 2. Increased file size limit to 50MB for video files
-- 3. Basic media_type field to distinguish between 'image' and 'video'
-- 4. Basic video_url field to store video file URLs
-- 5. Simple constraint to ensure data consistency (with safe creation)
-- 6. Enhanced get_why_section() function with basic video data (drops existing function first)
-- 7. Safe index creation to avoid conflicts
--
-- FIXES APPLIED:
-- - Drops existing get_why_section() function before recreating to avoid return type conflicts
-- - Uses DO blocks for constraint creation to handle existing constraints gracefully
-- - Uses IF NOT EXISTS for index creation
--
-- Verification:
-- SELECT * FROM get_why_section();
--
-- Expected result: All existing data preserved + media_type and video_url columns available
