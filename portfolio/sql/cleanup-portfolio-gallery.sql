-- Cleanup Portfolio Gallery
-- Run this script if you need to reset or fix the portfolio gallery setup
-- 
-- ⚠️  WARNING: This script will delete all existing data
-- 🎯 PURPOSE: Clean slate for portfolio gallery setup
-- ✅ SAFE TO RUN: Only affects portfolio gallery tables
--
-- Run this script in Supabase SQL Editor if you need to start fresh

-- ============================================================================
-- STEP 1: DROP EXISTING POLICIES (if they exist)
-- ============================================================================

-- Drop RLS policies for portfolio_items
DROP POLICY IF EXISTS "Public read access for active portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Authenticated read access for portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Authenticated insert access for portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Authenticated update access for portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Authenticated delete access for portfolio items" ON portfolio_items;

-- Drop RLS policies for portfolio_images
DROP POLICY IF EXISTS "Public read access for portfolio images" ON portfolio_images;
DROP POLICY IF EXISTS "Authenticated insert access for portfolio images" ON portfolio_images;
DROP POLICY IF EXISTS "Authenticated update access for portfolio images" ON portfolio_images;
DROP POLICY IF EXISTS "Authenticated delete access for portfolio images" ON portfolio_images;

-- Drop storage policies
DROP POLICY IF EXISTS "Public read access for portfolio gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access for portfolio gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access for portfolio gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access for portfolio gallery images" ON storage.objects;

-- ============================================================================
-- STEP 2: DROP EXISTING TRIGGERS
-- ============================================================================

-- Drop triggers
DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
DROP TRIGGER IF EXISTS update_portfolio_images_updated_at ON portfolio_images;

-- ============================================================================
-- STEP 3: DROP EXISTING INDEXES
-- ============================================================================

-- Drop indexes for portfolio_items
DROP INDEX IF EXISTS idx_portfolio_items_active;
DROP INDEX IF EXISTS idx_portfolio_items_display_order;
DROP INDEX IF EXISTS idx_portfolio_items_created_at;
DROP INDEX IF EXISTS idx_portfolio_items_image_id;

-- Drop indexes for portfolio_images
DROP INDEX IF EXISTS idx_portfolio_images_active;
DROP INDEX IF EXISTS idx_portfolio_images_created_at;
DROP INDEX IF EXISTS idx_portfolio_images_display_order;
DROP INDEX IF EXISTS idx_portfolio_images_file_path;

-- ============================================================================
-- STEP 4: DROP EXISTING FUNCTIONS
-- ============================================================================

-- Drop any custom functions
DROP FUNCTION IF EXISTS get_portfolio_items_with_images();

-- ============================================================================
-- STEP 5: DROP EXISTING TABLES
-- ============================================================================

-- Drop tables in correct order (items first due to foreign key)
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS portfolio_images CASCADE;

-- ============================================================================
-- STEP 6: CLEAN UP STORAGE BUCKET
-- ============================================================================

-- Delete all files from the storage bucket (optional)
-- Uncomment the next line if you want to delete all uploaded images
-- DELETE FROM storage.objects WHERE bucket_id = 'portfolio-gallery-images';

-- Delete the storage bucket (optional)
-- Uncomment the next line if you want to completely remove the bucket
-- DELETE FROM storage.buckets WHERE id = 'portfolio-gallery-images';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify tables are dropped
SELECT 
    schemaname,
    tablename
FROM pg_tables 
WHERE tablename IN ('portfolio_items', 'portfolio_images');

-- Verify storage bucket status
SELECT 
    id,
    name,
    public
FROM storage.buckets 
WHERE id = 'portfolio-gallery-images';

-- Show any remaining policies
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE tablename IN ('portfolio_items', 'portfolio_images');

-- ============================================================================
-- NEXT STEPS
-- ============================================================================

-- After running this cleanup script:
-- 1. Run the main schema file: portfolio-gallery-schema.sql
-- 2. Verify the setup is working correctly
-- 3. Test the admin interface

-- ============================================================================
-- TROUBLESHOOTING NOTES
-- ============================================================================

-- If you get "relation does not exist" errors:
-- - This is normal if the tables were already dropped
-- - Continue with the schema creation

-- If you get foreign key constraint errors:
-- - Make sure to create images table before items table
-- - The schema file handles this correctly

-- If you get RLS policy conflicts:
-- - Check for existing policies with similar names
-- - Use unique policy names if needed

-- If storage bucket issues:
-- - Check if bucket already exists
-- - Verify bucket permissions in Supabase dashboard
-- - Make sure bucket is set to public

SELECT 'Portfolio Gallery cleanup completed. You can now run the schema creation script.' as status;
