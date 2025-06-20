-- Kiosk Benefits Section Verification Script
-- This script verifies that the kiosk benefits system is properly set up
-- 
-- ⚠️  SAFE TO RUN: This script only checks existing setup, makes no changes
-- 🎯 CHECKS: Table existence, functions, constraints, and sample data
-- ✅ RESULT: Comprehensive verification of benefits system setup
--
-- Run this script in Supabase SQL Editor

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if the kiosk_benefits_sections table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'kiosk_benefits_sections';

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'kiosk_benefits_sections'
ORDER BY ordinal_position;

-- Check constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'kiosk_benefits_sections'::regclass;

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'kiosk_benefits_sections';

-- Check RLS policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'kiosk_benefits_sections';

-- Check if database function exists
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'get_kiosk_benefits_section';

-- Check if validation functions exist
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('validate_benefit_item', 'validate_benefit_items');

-- Check existing data
SELECT 
    id,
    section_heading,
    section_description,
    jsonb_array_length(benefit_items) as benefit_count,
    is_active,
    created_at
FROM kiosk_benefits_sections 
ORDER BY created_at DESC;

-- Test the database function
SELECT * FROM get_kiosk_benefits_section();

-- Test validation functions
SELECT 
    'Empty array validation' as test,
    validate_benefit_items('[]'::jsonb) as result
UNION ALL
SELECT 
    'Valid item validation' as test,
    validate_benefit_items('[{"id":"1","title":"Test","description":"Test desc","order":1}]'::jsonb) as result
UNION ALL
SELECT 
    'Invalid item validation' as test,
    validate_benefit_items('[{"id":"1","title":"","description":"","order":1}]'::jsonb) as result;

-- ============================================================================
-- SETUP STATUS SUMMARY
-- ============================================================================

DO $$
DECLARE
    table_exists boolean;
    function_exists boolean;
    data_exists boolean;
    rls_enabled boolean;
BEGIN
    -- Check table existence
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'kiosk_benefits_sections'
    ) INTO table_exists;
    
    -- Check function existence
    SELECT EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'public' AND routine_name = 'get_kiosk_benefits_section'
    ) INTO function_exists;
    
    -- Check data existence
    SELECT EXISTS (
        SELECT 1 FROM kiosk_benefits_sections WHERE is_active = true
    ) INTO data_exists;
    
    -- Check RLS
    SELECT rowsecurity FROM pg_tables 
    WHERE tablename = 'kiosk_benefits_sections' INTO rls_enabled;
    
    -- Report status
    RAISE NOTICE '=== KIOSK BENEFITS SETUP STATUS ===';
    RAISE NOTICE 'Table exists: %', table_exists;
    RAISE NOTICE 'Function exists: %', function_exists;
    RAISE NOTICE 'RLS enabled: %', rls_enabled;
    RAISE NOTICE 'Data exists: %', data_exists;
    
    IF table_exists AND function_exists AND rls_enabled THEN
        RAISE NOTICE '✅ Setup appears complete!';
        IF NOT data_exists THEN
            RAISE NOTICE '⚠️  No data found - run the main schema script to insert initial data';
        END IF;
    ELSE
        RAISE NOTICE '❌ Setup incomplete - run the main schema script first';
    END IF;
END $$;
