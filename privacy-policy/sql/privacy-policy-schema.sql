-- Privacy Policy Schema for Supabase
-- This file contains the complete SQL schema for the privacy policy system
-- 
-- ⚠️  SAFE TO RUN: This script only adds privacy policy support, preserves existing data
-- 🎯 ADDS: Storage buckets, privacy_policy table, functions
-- ✅ RESULT: Complete privacy policy system with admin functionality
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for privacy policy images (if needed)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'privacy-policy-images',
  'privacy-policy-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PRIVACY POLICY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS privacy_policy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content fields
  title TEXT NOT NULL DEFAULT 'Privacy Policy',
  content TEXT NOT NULL,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  
  -- Open Graph fields
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Contact information
  contact_email TEXT DEFAULT 'info@chroniclesexhibits.com',
  
  -- Version tracking
  version INTEGER DEFAULT 1,
  last_updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for active privacy policy
CREATE INDEX IF NOT EXISTS idx_privacy_policy_active ON privacy_policy(is_active);

-- Index for version tracking
CREATE INDEX IF NOT EXISTS idx_privacy_policy_version ON privacy_policy(version DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on privacy_policy table
ALTER TABLE privacy_policy ENABLE ROW LEVEL SECURITY;

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

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy for public read access to privacy policy images
CREATE POLICY "Public can view privacy policy images" ON storage.objects
  FOR SELECT USING (bucket_id = 'privacy-policy-images');

-- Policy for authenticated users to upload privacy policy images
CREATE POLICY "Authenticated users can upload privacy policy images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'privacy-policy-images' AND 
    auth.role() = 'authenticated'
  );

-- Policy for authenticated users to update privacy policy images
CREATE POLICY "Authenticated users can update privacy policy images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'privacy-policy-images' AND 
    auth.role() = 'authenticated'
  );

-- Policy for authenticated users to delete privacy policy images
CREATE POLICY "Authenticated users can delete privacy policy images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'privacy-policy-images' AND 
    auth.role() = 'authenticated'
  );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_privacy_policy_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER privacy_policy_updated_at
  BEFORE UPDATE ON privacy_policy
  FOR EACH ROW
  EXECUTE FUNCTION update_privacy_policy_updated_at();

-- Function to get active privacy policy
CREATE OR REPLACE FUNCTION get_active_privacy_policy()
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  title TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  contact_email TEXT,
  version INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pp.id,
    pp.created_at,
    pp.updated_at,
    pp.title,
    pp.content,
    pp.meta_title,
    pp.meta_description,
    pp.meta_keywords,
    pp.og_title,
    pp.og_description,
    pp.og_image_url,
    pp.contact_email,
    pp.version
  FROM privacy_policy pp
  WHERE pp.is_active = true
  ORDER BY pp.version DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial privacy policy data
INSERT INTO privacy_policy (
  title,
  content,
  meta_title,
  meta_description,
  meta_keywords,
  og_title,
  og_description,
  contact_email,
  is_active,
  version
) VALUES (
  'Privacy Policy',
  '<h1>Privacy Policy</h1>

<p><strong>Chronicle Exhibits LLC</strong> ("Chronicle," "we," "us," or "our") is committed to protecting the privacy of our users ("you" or "your"). This Privacy Policy explains what information we collect, how we use it, and how we protect it.</p>

<h2>Information We Collect</h2>

<p>We collect several different types of information for various purposes to improve our services to you.</p>

<p><strong>Personal Information:</strong> We may collect personal information, such as your name, email address, phone number, and mailing address, when you register for an account, subscribe to our newsletter, or contact us.</p>

<p><strong>Usage Data:</strong> We may also collect information about your use of our website, such as the pages you visit, the links you click, and the searches you conduct. This data is collected anonymously and does not identify you personally.</p>

<h2>We use the information we collect for various purposes, including:</h2>

<ul>
<li>To provide and improve our services</li>
<li>To personalize your experience</li>
<li>To send you marketing communications</li>
<li>To respond to your inquiries and requests</li>
<li>For security and fraud prevention purposes</li>
</ul>

<h2>Sharing of Information</h2>

<p>We may share your information with third-party service providers who help us operate our website and conduct our business. These service providers are contractually obligated to keep your information confidential and secure.</p>

<p>We will not share your personal information with any third-party advertisers or marketing companies without your consent.</p>

<h2>Data Security</h2>

<p>We take reasonable precautions to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no website or internet transmission is completely secure. We cannot guarantee the security of your information.</p>

<h2>Changes to This Privacy Policy</h2>

<p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated "last updated" date.</p>

<h2>Contact Us</h2>

<p>If you have any questions about this Privacy Policy, don''t hesitate to get in touch with us by email at <a href="mailto:info@chroniclesexhibits.com">info@chroniclesexhibits.com</a>.</p>',
  'Privacy Policy - Chronicle Exhibits LLC',
  'Learn about how Chronicle Exhibits LLC protects your privacy and handles your personal information. Read our comprehensive privacy policy.',
  'privacy policy, data protection, personal information, Chronicle Exhibits, privacy rights',
  'Privacy Policy - Chronicle Exhibits LLC',
  'Learn about how Chronicle Exhibits LLC protects your privacy and handles your personal information.',
  'info@chroniclesexhibits.com',
  true,
  1
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE privacy_policy IS 'Stores privacy policy content and metadata';
COMMENT ON COLUMN privacy_policy.title IS 'Privacy policy page title';
COMMENT ON COLUMN privacy_policy.content IS 'HTML content of the privacy policy';
COMMENT ON COLUMN privacy_policy.meta_title IS 'SEO meta title';
COMMENT ON COLUMN privacy_policy.meta_description IS 'SEO meta description';
COMMENT ON COLUMN privacy_policy.meta_keywords IS 'SEO meta keywords';
COMMENT ON COLUMN privacy_policy.og_title IS 'Open Graph title for social sharing';
COMMENT ON COLUMN privacy_policy.og_description IS 'Open Graph description for social sharing';
COMMENT ON COLUMN privacy_policy.og_image_url IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN privacy_policy.is_active IS 'Whether this privacy policy version is active';
COMMENT ON COLUMN privacy_policy.contact_email IS 'Contact email for privacy-related inquiries';
COMMENT ON COLUMN privacy_policy.version IS 'Version number for tracking changes';
COMMENT ON COLUMN privacy_policy.last_updated_by IS 'User who last updated this privacy policy';
