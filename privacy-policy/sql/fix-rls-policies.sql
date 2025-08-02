-- Fix RLS Policies for Privacy Policy
-- This script fixes the Row Level Security policies to allow authenticated users to perform CRUD operations
-- 
-- ⚠️  SAFE TO RUN: This script only updates RLS policies, preserves existing data
-- 🎯 FIXES: Authentication issues with privacy policy admin operations
-- ✅ RESULT: Authenticated users can create, read, update, and delete privacy policies
--
-- Run this script in Supabase SQL Editor if you're getting "Unauthorized" errors

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read active privacy policy" ON privacy_policy;
DROP POLICY IF EXISTS "Authenticated users can read all privacy policies" ON privacy_policy;
DROP POLICY IF EXISTS "Authenticated users can insert privacy policies" ON privacy_policy;
DROP POLICY IF EXISTS "Authenticated users can update privacy policies" ON privacy_policy;
DROP POLICY IF EXISTS "Authenticated users can delete privacy policies" ON privacy_policy;

-- Create new, more permissive policies for authenticated users

-- Policy for public read access (anyone can read active privacy policy)
CREATE POLICY "Public can read active privacy policy" ON privacy_policy
  FOR SELECT USING (is_active = true);

-- Policy for authenticated users to read all privacy policies
CREATE POLICY "Authenticated users can read all privacy policies" ON privacy_policy
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Policy for authenticated users to insert privacy policies
CREATE POLICY "Authenticated users can insert privacy policies" ON privacy_policy
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for authenticated users to update privacy policies
CREATE POLICY "Authenticated users can update privacy policies" ON privacy_policy
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for authenticated users to delete privacy policies (if needed)
CREATE POLICY "Authenticated users can delete privacy policies" ON privacy_policy
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Verify policies are working
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
WHERE tablename = 'privacy_policy'
ORDER BY policyname;
