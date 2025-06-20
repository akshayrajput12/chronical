-- Cleanup Conference Solution Section
-- Run this script if you need to reset or fix the conference solution section setup
-- 
-- ⚠️  WARNING: This script will delete all existing data
-- 🎯 PURPOSE: Clean slate for conference solution section setup
-- ✅ SAFE TO RUN: Only affects conference solution section tables
--
-- Run this script in Supabase SQL Editor if you need to start fresh

-- ============================================================================
-- STEP 1: DROP EXISTING POLICIES (if they exist)
-- ============================================================================

-- Drop RLS policies for conference_solution_sections
DROP POLICY IF EXISTS "Public read access for active conference solution sections" ON conference_solution_sections;
DROP POLICY IF EXISTS "Authenticated read access for conference solution sections" ON conference_solution_sections;
DROP POLICY IF EXISTS "Authenticated insert access for conference solution sections" ON conference_solution_sections;
DROP POLICY IF EXISTS "Authenticated update access for conference solution sections" ON conference_solution_sections;
DROP POLICY IF EXISTS "Authenticated delete access for conference solution sections" ON conference_solution_sections;

-- Drop RLS policies for conference_solution_images
DROP POLICY IF EXISTS "Public read access for conference solution images" ON conference_solution_images;
DROP POLICY IF EXISTS "Authenticated insert access for conference solution images" ON conference_solution_images;
DROP POLICY IF EXISTS "Authenticated update access for conference solution images" ON conference_solution_images;
DROP POLICY IF EXISTS "Authenticated delete access for conference solution images" ON conference_solution_images;

-- Drop storage policies (these might have naming conflicts)
DROP POLICY IF EXISTS "Public read access for conference solution section images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access for conference solution section images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access for conference solution section images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access for conference solution section images" ON storage.objects;

-- ============================================================================
-- STEP 2: DROP EXISTING TRIGGERS
-- ============================================================================

-- Drop triggers
DROP TRIGGER IF EXISTS update_conference_solution_sections_updated_at ON conference_solution_sections;
DROP TRIGGER IF EXISTS update_conference_solution_images_updated_at ON conference_solution_images;

-- ============================================================================
-- STEP 3: DROP EXISTING INDEXES
-- ============================================================================

-- Drop indexes for conference_solution_sections
DROP INDEX IF EXISTS idx_conference_solution_sections_active;
DROP INDEX IF EXISTS idx_conference_solution_sections_created_at;
DROP INDEX IF EXISTS idx_conference_solution_sections_main_image_id;

-- Drop indexes for conference_solution_images
DROP INDEX IF EXISTS idx_conference_solution_images_active;
DROP INDEX IF EXISTS idx_conference_solution_images_created_at;
DROP INDEX IF EXISTS idx_conference_solution_images_display_order;
DROP INDEX IF EXISTS idx_conference_solution_images_file_path;

-- ============================================================================
-- STEP 4: DROP EXISTING TABLES
-- ============================================================================

-- Drop tables in correct order (sections first due to foreign key)
DROP TABLE IF EXISTS conference_solution_sections CASCADE;
DROP TABLE IF EXISTS conference_solution_images CASCADE;

-- ============================================================================
-- STEP 5: CLEAN UP STORAGE BUCKET
-- ============================================================================

-- Delete all files from the storage bucket (optional)
-- Uncomment the next line if you want to delete all uploaded images
-- DELETE FROM storage.objects WHERE bucket_id = 'conference-solution-section-images';

-- Delete the storage bucket (optional)
-- Uncomment the next line if you want to completely remove the bucket
-- DELETE FROM storage.buckets WHERE id = 'conference-solution-section-images';

-- ============================================================================
-- STEP 6: DROP FUNCTIONS (if they exist)
-- ============================================================================

-- Drop any custom functions
DROP FUNCTION IF EXISTS get_conference_solution_section_with_image();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify tables are dropped
SELECT 
    schemaname,
    tablename
FROM pg_tables 
WHERE tablename IN ('conference_solution_sections', 'conference_solution_images');

-- Verify storage bucket status
SELECT 
    id,
    name,
    public
FROM storage.buckets 
WHERE id = 'conference-solution-section-images';

-- Show any remaining policies
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE tablename IN ('conference_solution_sections', 'conference_solution_images');

-- ============================================================================
-- NEXT STEPS
-- ============================================================================

-- After running this cleanup script:
-- 1. Run the main schema file: conference-solution-section-schema.sql
-- 2. Or run the simple version step by step: conference-solution-section-schema-simple.sql
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
