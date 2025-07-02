-- =====================================================
-- FIX CONTACT FORM SUBMISSIONS RLS POLICY
-- =====================================================
-- This script fixes the Row Level Security policy issue
-- for contact form submissions to allow public inserts

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can insert form submissions" ON contact_form_submissions;

-- Recreate the policy to allow public inserts
CREATE POLICY "Public can insert form submissions" ON contact_form_submissions
    FOR INSERT WITH CHECK (true);

-- Also ensure the table has RLS enabled
ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;

-- Verify the policy exists
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'contact_form_submissions' AND policyname = 'Public can insert form submissions';
