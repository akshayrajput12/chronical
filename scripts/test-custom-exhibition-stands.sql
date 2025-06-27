-- Test Script for Custom Exhibition Stands Implementation
-- Run this in Supabase SQL Editor to verify the implementation

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- 1. Check if all tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'custom_exhibition%'
ORDER BY table_name;

-- 2. Check storage bucket
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE id = 'custom-exhibition-images';

-- 3. Check if functions exist
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%custom_exhibition%'
ORDER BY routine_name;

-- 4. Check sample data exists
SELECT 'Hero Section' as section, COUNT(*) as records FROM custom_exhibition_hero
UNION ALL
SELECT 'Leading Contractor', COUNT(*) FROM custom_exhibition_leading_contractor
UNION ALL
SELECT 'Promote Brand', COUNT(*) FROM custom_exhibition_promote_brand
UNION ALL
SELECT 'Striking Customized', COUNT(*) FROM custom_exhibition_striking_customized
UNION ALL
SELECT 'Reasons to Choose', COUNT(*) FROM custom_exhibition_reasons_to_choose
UNION ALL
SELECT 'FAQ Section', COUNT(*) FROM custom_exhibition_faq_section
UNION ALL
SELECT 'FAQ Items', COUNT(*) FROM custom_exhibition_faq_items
UNION ALL
SELECT 'Looking for Stands', COUNT(*) FROM custom_exhibition_looking_for_stands;

-- 5. Test the main function
SELECT get_custom_exhibition_page_data();

-- 6. Test FAQ items function
SELECT * FROM get_custom_exhibition_faq_items();

-- 7. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename LIKE 'custom_exhibition%'
ORDER BY tablename, policyname;

-- 8. Check triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table LIKE 'custom_exhibition%'
ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- SAMPLE DATA VERIFICATION
-- ============================================================================

-- Check hero section data
SELECT 
    title,
    LEFT(subtitle, 50) || '...' as subtitle_preview,
    background_image_url IS NOT NULL as has_image,
    is_active
FROM custom_exhibition_hero;

-- Check FAQ items with list items
SELECT 
    question,
    LEFT(answer, 50) || '...' as answer_preview,
    CASE 
        WHEN list_items IS NOT NULL AND array_length(list_items, 1) > 0 
        THEN array_length(list_items, 1) 
        ELSE 0 
    END as list_item_count,
    display_order,
    is_active
FROM custom_exhibition_faq_items
ORDER BY display_order;

-- ============================================================================
-- PERFORMANCE CHECKS
-- ============================================================================

-- Check indexes
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename LIKE 'custom_exhibition%'
ORDER BY tablename, indexname;

-- ============================================================================
-- EXPECTED RESULTS
-- ============================================================================

/*
Expected Results:

1. Tables: Should show 9 tables starting with 'custom_exhibition'
2. Storage bucket: Should show 'custom-exhibition-images' bucket
3. Functions: Should show 2 functions (get_custom_exhibition_page_data, get_custom_exhibition_faq_items)
4. Sample data: Each section should have at least 1 record
5. Main function: Should return JSON with all sections
6. FAQ function: Should return 4 FAQ items in order
7. RLS policies: Should show public read and authenticated write policies
8. Triggers: Should show update triggers for all tables
9. Indexes: Should show performance indexes

If any of these checks fail, review the schema file and ensure it was executed completely.
*/
