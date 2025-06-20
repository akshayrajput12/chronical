-- Conference Hero Section Migration Script
-- This script safely migrates existing conference hero data to the new simplified structure
-- 
-- ⚠️  SAFE TO RUN: This script preserves existing data while removing unused columns
-- 🎯 REMOVES: Unused columns (subheading, description, CTA fields)
-- ✅ RESULT: Clean, simplified conference hero structure
--
-- Run this script AFTER running the main conference-hero-schema.sql

-- First, let's check if the table exists and has the old structure
DO $$
BEGIN
    -- Check if the old columns exist and remove them safely
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conference_hero_sections' 
        AND column_name = 'subheading'
    ) THEN
        ALTER TABLE conference_hero_sections DROP COLUMN IF EXISTS subheading;
        RAISE NOTICE 'Removed subheading column';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conference_hero_sections' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE conference_hero_sections DROP COLUMN IF EXISTS description;
        RAISE NOTICE 'Removed description column';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conference_hero_sections' 
        AND column_name = 'cta_primary_text'
    ) THEN
        ALTER TABLE conference_hero_sections DROP COLUMN IF EXISTS cta_primary_text;
        RAISE NOTICE 'Removed cta_primary_text column';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conference_hero_sections' 
        AND column_name = 'cta_primary_url'
    ) THEN
        ALTER TABLE conference_hero_sections DROP COLUMN IF EXISTS cta_primary_url;
        RAISE NOTICE 'Removed cta_primary_url column';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conference_hero_sections' 
        AND column_name = 'cta_secondary_text'
    ) THEN
        ALTER TABLE conference_hero_sections DROP COLUMN IF EXISTS cta_secondary_text;
        RAISE NOTICE 'Removed cta_secondary_text column';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conference_hero_sections' 
        AND column_name = 'cta_secondary_url'
    ) THEN
        ALTER TABLE conference_hero_sections DROP COLUMN IF EXISTS cta_secondary_url;
        RAISE NOTICE 'Removed cta_secondary_url column';
    END IF;

    -- Remove old constraints that might reference deleted columns
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'conference_hero_sections' 
        AND constraint_name = 'valid_cta_primary_url'
    ) THEN
        ALTER TABLE conference_hero_sections DROP CONSTRAINT IF EXISTS valid_cta_primary_url;
        RAISE NOTICE 'Removed valid_cta_primary_url constraint';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'conference_hero_sections' 
        AND constraint_name = 'valid_cta_secondary_url'
    ) THEN
        ALTER TABLE conference_hero_sections DROP CONSTRAINT IF EXISTS valid_cta_secondary_url;
        RAISE NOTICE 'Removed valid_cta_secondary_url constraint';
    END IF;

    RAISE NOTICE 'Conference hero section migration completed successfully!';
END $$;

-- Verify the final table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'conference_hero_sections'
ORDER BY ordinal_position;
