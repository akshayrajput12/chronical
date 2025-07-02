-- Fix Row Level Security policy for event form submissions
-- This allows public form submissions while keeping admin access secure
--
-- ⚠️  SAFE TO RUN: This only updates RLS policies, no data changes
-- 🎯 FIXES: RLS policy violation error when submitting forms
-- ✅ RESULT: Public users can submit forms, authenticated users can manage them
--
-- Run this script in Supabase SQL Editor

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert form submissions" ON event_form_submissions;
DROP POLICY IF EXISTS "Public can insert form submissions" ON event_form_submissions;
DROP POLICY IF EXISTS "Allow public form submissions" ON event_form_submissions;
DROP POLICY IF EXISTS "Authenticated users can manage form submissions" ON event_form_submissions;
DROP POLICY IF EXISTS "Authenticated users can read submissions" ON event_form_submissions;
DROP POLICY IF EXISTS "Authenticated users can update submissions" ON event_form_submissions;
DROP POLICY IF EXISTS "Authenticated users can delete submissions" ON event_form_submissions;

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

-- Verify RLS is enabled on the table
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    hasrls
FROM pg_tables 
WHERE tablename = 'event_form_submissions';

-- Show current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'event_form_submissions';
