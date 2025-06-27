-- Test Script for Fixed Custom Exhibition Stands Schema
-- Run this in Supabase SQL Editor to verify the implementation

-- ============================================================================
-- BASIC VERIFICATION QUERIES
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
    file_size_limit
FROM storage.buckets 
WHERE id = 'custom-exhibition-images';

-- 3. Check if functions exist and work
SELECT routine_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%custom_exhibition%'
ORDER BY routine_name;

-- 4. Test the main function
SELECT get_custom_exhibition_page_data();

-- 5. Test FAQ items function
SELECT * FROM get_custom_exhibition_faq_items();

-- 6. Check sample data exists
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

-- ============================================================================
-- EXPECTED RESULTS
-- ============================================================================

/*
Expected Results:

1. Tables: Should show 9 tables starting with 'custom_exhibition'
   - custom_exhibition_faq_items
   - custom_exhibition_faq_section
   - custom_exhibition_hero
   - custom_exhibition_images
   - custom_exhibition_leading_contractor
   - custom_exhibition_looking_for_stands
   - custom_exhibition_promote_brand
   - custom_exhibition_reasons_to_choose
   - custom_exhibition_striking_customized

2. Storage bucket: Should show 'custom-exhibition-images' bucket with public=true

3. Functions: Should show 2 functions
   - get_custom_exhibition_faq_items
   - get_custom_exhibition_page_data

4. Main function: Should return JSON with all sections populated

5. FAQ function: Should return 4 FAQ items in order

6. Sample data: Each section should have 1 record, FAQ items should have 4 records

If all checks pass, the schema is working correctly!
*/
