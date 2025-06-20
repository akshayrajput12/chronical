-- Cleanup Duplicate Conference Hero Sections
-- This script removes duplicate hero sections and keeps only the most recent one
-- 
-- ⚠️  SAFE TO RUN: This script preserves the most recent hero section and removes duplicates
-- 🎯 FIXES: Multiple active hero sections causing "multiple rows returned" error
-- ✅ RESULT: Only one active hero section remains
--
-- Run this script in Supabase SQL Editor if you have multiple hero sections

-- First, let's see how many active hero sections we have
SELECT 
    id, 
    heading, 
    created_at, 
    is_active 
FROM conference_hero_sections 
WHERE is_active = true 
ORDER BY created_at DESC;

-- Keep only the most recent hero section active, deactivate the rest
WITH most_recent AS (
    SELECT id
    FROM conference_hero_sections
    WHERE is_active = true
    ORDER BY created_at DESC
    LIMIT 1
)
UPDATE conference_hero_sections 
SET is_active = false 
WHERE is_active = true 
AND id NOT IN (SELECT id FROM most_recent);

-- Verify the result - should show only 1 active hero section
SELECT 
    id, 
    heading, 
    created_at, 
    is_active 
FROM conference_hero_sections 
WHERE is_active = true 
ORDER BY created_at DESC;

-- Optional: Delete old inactive hero sections (uncomment if you want to remove them completely)
-- DELETE FROM conference_hero_sections 
-- WHERE is_active = false 
-- AND created_at < (
--     SELECT created_at 
--     FROM conference_hero_sections 
--     WHERE is_active = true 
--     ORDER BY created_at DESC 
--     LIMIT 1
-- );

-- Show final count
SELECT 
    COUNT(*) as total_sections,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_sections,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_sections
FROM conference_hero_sections;
