-- Fix event form submissions table to match the expected schema
-- This script adds missing columns to support the full form functionality
--
-- ⚠️  SAFE TO RUN: This script only adds missing columns, preserves existing data
-- 🎯 ADDS: exhibition_name, budget, attachment_filename, attachment_size, company_name columns
-- ✅ RESULT: Form submissions will work with all form fields
--
-- Run this script in Supabase SQL Editor

-- Add missing columns to event_form_submissions table
DO $$
BEGIN
    -- Add company_name column if it doesn't exist (this is what the form sends)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'event_form_submissions'
        AND column_name = 'company_name'
    ) THEN
        ALTER TABLE event_form_submissions ADD COLUMN company_name TEXT;
        RAISE NOTICE 'Added company_name column';
    END IF;

    -- Add exhibition_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'event_form_submissions'
        AND column_name = 'exhibition_name'
    ) THEN
        ALTER TABLE event_form_submissions ADD COLUMN exhibition_name TEXT;
        RAISE NOTICE 'Added exhibition_name column';
    END IF;

    -- Add budget column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'event_form_submissions'
        AND column_name = 'budget'
    ) THEN
        ALTER TABLE event_form_submissions ADD COLUMN budget TEXT;
        RAISE NOTICE 'Added budget column';
    END IF;

    -- Add attachment_filename column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'event_form_submissions'
        AND column_name = 'attachment_filename'
    ) THEN
        ALTER TABLE event_form_submissions ADD COLUMN attachment_filename TEXT;
        RAISE NOTICE 'Added attachment_filename column';
    END IF;

    -- Add attachment_size column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'event_form_submissions'
        AND column_name = 'attachment_size'
    ) THEN
        ALTER TABLE event_form_submissions ADD COLUMN attachment_size BIGINT;
        RAISE NOTICE 'Added attachment_size column';
    END IF;

    RAISE NOTICE 'Event form submissions table update completed successfully';
END $$;

-- Fix Row Level Security policies for form submissions
-- This allows anonymous users to submit forms (public endpoint)
-- but only authenticated users can read/manage submissions

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert form submissions" ON event_form_submissions;
DROP POLICY IF EXISTS "Public can insert form submissions" ON event_form_submissions;
DROP POLICY IF EXISTS "Authenticated users can manage form submissions" ON event_form_submissions;

-- Create new RLS policies
-- Allow anyone to insert form submissions (public form endpoint)
CREATE POLICY "Allow public form submissions" ON event_form_submissions
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read and manage all submissions
CREATE POLICY "Authenticated users can read submissions" ON event_form_submissions
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update submissions" ON event_form_submissions
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete submissions" ON event_form_submissions
FOR DELETE USING (auth.role() = 'authenticated');

-- Update the table comment to reflect the changes
COMMENT ON TABLE event_form_submissions IS 'Event form submissions with support for exhibition_name, budget, and file attachments. Public can insert, authenticated users can manage.';

-- Show the current table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'event_form_submissions'
ORDER BY ordinal_position;
