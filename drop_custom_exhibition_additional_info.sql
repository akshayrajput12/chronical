-- Drop Custom Exhibition Additional Info Section Schema
-- This file contains SQL commands to completely remove the additional info section schema
-- 
-- 🎯 PURPOSE: Clean removal of custom exhibition additional info database objects
-- 🗑️ REMOVES: Tables, functions, triggers, indexes, and policies
-- ⚠️  DESTRUCTIVE: This will permanently delete all data and schema objects
-- 🚀 BUILD READY: Safe to run in any environment
--
-- Run this script in Supabase SQL Editor

-- ============================================================================
-- DROP SCHEMA OBJECTS IN CORRECT ORDER
-- ============================================================================

-- Drop helper functions first
DROP FUNCTION IF EXISTS get_custom_exhibition_additional_info();
DROP FUNCTION IF EXISTS update_custom_exhibition_additional_info(TEXT, TEXT, TEXT, TEXT);

-- Drop triggers
DROP TRIGGER IF EXISTS update_custom_exhibition_additional_info_updated_at ON custom_exhibition_additional_info;

-- Drop indexes
DROP INDEX IF EXISTS idx_custom_exhibition_additional_info_active;
DROP INDEX IF EXISTS idx_custom_exhibition_additional_info_created_at;

-- Drop RLS policies
DROP POLICY IF EXISTS "custom_exhibition_additional_info_public_read" ON custom_exhibition_additional_info;

-- Drop the main table (this will cascade and remove all related objects)
DROP TABLE IF EXISTS custom_exhibition_additional_info CASCADE;

-- ============================================================================
-- CLEANUP COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '🗑️ Custom Exhibition Additional Info Section schema has been completely removed!';
    RAISE NOTICE '📊 Dropped: custom_exhibition_additional_info table';
    RAISE NOTICE '🔧 Dropped: Helper functions and triggers';
    RAISE NOTICE '📈 Dropped: Performance indexes';
    RAISE NOTICE '🔒 Dropped: RLS policies';
    RAISE NOTICE '✅ Database cleanup completed successfully!';
    RAISE NOTICE '🚀 Ready for fresh installation or build deployment!';
END $$;
