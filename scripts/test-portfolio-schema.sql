-- Test Script for Custom Exhibition Portfolio Schema
-- Run this in Supabase SQL Editor to verify the portfolio implementation

-- ============================================================================
-- BASIC VERIFICATION QUERIES
-- ============================================================================

-- 1. Check if portfolio tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'custom_exhibition_portfolio%'
ORDER BY table_name;

-- 2. Check portfolio storage bucket
SELECT 
    id,
    name,
    public,
    file_size_limit
FROM storage.buckets 
WHERE id = 'custom-exhibition-portfolio';

-- 3. Check if portfolio functions exist
SELECT routine_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%custom_exhibition_portfolio%'
ORDER BY routine_name;

-- 4. Test portfolio functions
SELECT get_custom_exhibition_portfolio_section();
SELECT * FROM get_custom_exhibition_portfolio_items();
SELECT get_custom_exhibition_portfolio_data();

-- 5. Check sample data exists
SELECT 'Portfolio Section' as section, COUNT(*) as records FROM custom_exhibition_portfolio_section
UNION ALL
SELECT 'Portfolio Items', COUNT(*) FROM custom_exhibition_portfolio_items;

-- 6. Check portfolio items details
SELECT 
    title,
    client_name,
    project_year,
    category,
    is_featured,
    display_order,
    is_active
FROM custom_exhibition_portfolio_items
ORDER BY display_order;

-- 7. Check RLS policies for portfolio tables
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename LIKE 'custom_exhibition_portfolio%'
ORDER BY tablename, policyname;

-- 8. Check indexes for portfolio tables
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename LIKE 'custom_exhibition_portfolio%'
ORDER BY tablename, indexname;

-- ============================================================================
-- PORTFOLIO DATA VERIFICATION
-- ============================================================================

-- Check portfolio section data
SELECT 
    section_title,
    main_title,
    LEFT(description, 50) || '...' as description_preview,
    cta_text,
    cta_url,
    is_active
FROM custom_exhibition_portfolio_section;

-- Check featured portfolio items
SELECT 
    title,
    client_name,
    project_year,
    category,
    is_featured,
    display_order
FROM custom_exhibition_portfolio_items
WHERE is_featured = true
ORDER BY display_order;

-- Check portfolio items by category
SELECT 
    category,
    COUNT(*) as item_count
FROM custom_exhibition_portfolio_items
WHERE is_active = true
GROUP BY category
ORDER BY item_count DESC;

-- ============================================================================
-- EXPECTED RESULTS
-- ============================================================================

/*
Expected Results:

1. Tables: Should show 2 tables
   - custom_exhibition_portfolio_section
   - custom_exhibition_portfolio_items

2. Storage bucket: Should show 'custom-exhibition-portfolio' bucket with public=true

3. Functions: Should show 3 functions
   - get_custom_exhibition_portfolio_data
   - get_custom_exhibition_portfolio_items
   - get_custom_exhibition_portfolio_section

4. Functions test: Should return JSON data with portfolio content

5. Sample data: 
   - Portfolio Section: 1 record
   - Portfolio Items: 6 records

6. Portfolio items: Should show 6 sample projects with different categories

7. RLS policies: Should show public read and authenticated write policies

8. Indexes: Should show performance indexes on key columns

If all checks pass, the portfolio schema is working correctly!
*/
