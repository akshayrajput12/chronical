-- ============================================================================
-- FIX COMPANY PROFILE SCHEMA
-- ============================================================================
-- This script fixes the database constraint issue and cleans up any invalid data
-- Run this script to resolve the file_size constraint error

-- Drop the table if it exists (this will remove any invalid data)
DROP TABLE IF EXISTS company_profile_documents CASCADE;

-- Drop any existing functions
DROP FUNCTION IF EXISTS update_company_profile_documents_updated_at() CASCADE;
DROP FUNCTION IF EXISTS ensure_single_current_company_profile() CASCADE;
DROP FUNCTION IF EXISTS get_current_company_profile() CASCADE;
DROP FUNCTION IF EXISTS set_current_company_profile(UUID) CASCADE;

-- Now run the corrected schema
-- You can copy and paste the content from company-profile-schema.sql
-- Or run: \i supabase/company-profile-schema.sql

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if the table was created successfully
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'company_profile_documents'
ORDER BY ordinal_position;

-- Check constraints
SELECT 
    constraint_name,
    constraint_type,
    check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'company_profile_documents';

-- Check storage bucket
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE id = 'company-profile-documents';

-- Check storage policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%company%profile%';

-- Check functions
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name LIKE '%company_profile%';

-- Test the get_current_company_profile function
SELECT * FROM get_current_company_profile();

COMMENT ON SCRIPT IS 'Fix script for company profile schema constraint issues';
