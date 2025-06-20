-- Cleanup Communicate Section
-- Run this script if you need to reset or fix the communicate section setup
-- 
-- ⚠️  WARNING: This script will delete all existing data
-- 🎯 PURPOSE: Clean slate for communicate section setup
-- ✅ SAFE TO RUN: Only affects communicate section tables
--
-- Run this script in Supabase SQL Editor if you need to start fresh

-- ============================================================================
-- STEP 1: DROP EXISTING POLICIES (if they exist)
-- ============================================================================

-- Drop RLS policies for communicate_sections
DROP POLICY IF EXISTS "Public read access for active communicate sections" ON communicate_sections;
DROP POLICY IF EXISTS "Authenticated read access for communicate sections" ON communicate_sections;
DROP POLICY IF EXISTS "Authenticated insert access for communicate sections" ON communicate_sections;
DROP POLICY IF EXISTS "Authenticated update access for communicate sections" ON communicate_sections;
DROP POLICY IF EXISTS "Authenticated delete access for communicate sections" ON communicate_sections;

-- Drop RLS policies for communicate_images
DROP POLICY IF EXISTS "Public read access for communicate images" ON communicate_images;
DROP POLICY IF EXISTS "Authenticated insert access for communicate images" ON communicate_images;
DROP POLICY IF EXISTS "Authenticated update access for communicate images" ON communicate_images;
DROP POLICY IF EXISTS "Authenticated delete access for communicate images" ON communicate_images;

-- Drop storage policies (these might have naming conflicts)
DROP POLICY IF EXISTS "Public read access for communicate section images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access for communicate section images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access for communicate section images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access for communicate section images" ON storage.objects;

-- ============================================================================
-- STEP 2: DROP EXISTING TRIGGERS
-- ============================================================================

-- Drop triggers
DROP TRIGGER IF EXISTS update_communicate_sections_updated_at ON communicate_sections;
DROP TRIGGER IF EXISTS update_communicate_images_updated_at ON communicate_images;

-- ============================================================================
-- STEP 3: DROP EXISTING INDEXES
-- ============================================================================

-- Drop indexes for communicate_sections
DROP INDEX IF EXISTS idx_communicate_sections_active;
DROP INDEX IF EXISTS idx_communicate_sections_created_at;
DROP INDEX IF EXISTS idx_communicate_sections_main_image_id;

-- Drop indexes for communicate_images
DROP INDEX IF EXISTS idx_communicate_images_active;
DROP INDEX IF EXISTS idx_communicate_images_created_at;
DROP INDEX IF EXISTS idx_communicate_images_display_order;
DROP INDEX IF EXISTS idx_communicate_images_file_path;

-- ============================================================================
-- STEP 4: DROP EXISTING TABLES
-- ============================================================================

-- Drop tables in correct order (sections first due to foreign key)
DROP TABLE IF EXISTS communicate_sections CASCADE;
DROP TABLE IF EXISTS communicate_images CASCADE;

-- ============================================================================
-- STEP 5: CLEAN UP STORAGE BUCKET
-- ============================================================================

-- Delete all files from the storage bucket (optional)
-- Uncomment the next line if you want to delete all uploaded images
-- DELETE FROM storage.objects WHERE bucket_id = 'communicate-section-images';

-- Delete the storage bucket (optional)
-- Uncomment the next line if you want to completely remove the bucket
-- DELETE FROM storage.buckets WHERE id = 'communicate-section-images';

-- ============================================================================
-- STEP 6: DROP FUNCTIONS (if they exist)
-- ============================================================================

-- Drop any custom functions
DROP FUNCTION IF EXISTS get_communicate_section_with_image();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify tables are dropped
SELECT 
    schemaname,
    tablename
FROM pg_tables 
WHERE tablename IN ('communicate_sections', 'communicate_images');

-- Verify storage bucket status
SELECT 
    id,
    name,
    public
FROM storage.buckets 
WHERE id = 'communicate-section-images';

-- Show any remaining policies
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE tablename IN ('communicate_sections', 'communicate_images');

-- ============================================================================
-- NEXT STEPS
-- ============================================================================

-- After running this cleanup script:
-- 1. Run the main schema file: communicate-section-schema.sql
-- 2. Or run the simple version step by step: communicate-section-schema-simple.sql
-- 3. Verify the setup is working correctly
-- 4. Test the admin interface

-- ============================================================================
-- TROUBLESHOOTING NOTES
-- ============================================================================

-- If you get "relation does not exist" errors:
-- - This is normal if the tables were already dropped
-- - Continue with the schema creation

-- If you get foreign key constraint errors:
-- - Use the simple schema file and run each step separately
-- - Make sure to create images table before sections table

-- If you get RLS policy conflicts:
-- - Check for existing policies with similar names
-- - Use unique policy names if needed

-- If storage bucket issues:
-- - Check if bucket already exists
-- - Verify bucket permissions in Supabase dashboard
-- - Make sure bucket is set to public

SELECT 'Cleanup completed. You can now run the schema creation script.' as status;
