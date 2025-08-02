-- Privacy Policy Initial Data
-- This file contains the initial privacy policy content based on the provided requirements
-- 
-- ⚠️  SAFE TO RUN: This script only inserts initial data if it doesn't exist
-- 🎯 ADDS: Initial privacy policy content with proper HTML formatting
-- ✅ RESULT: Privacy policy page with content matching the provided image
--
-- Run this script in Supabase SQL Editor after running privacy-policy-schema.sql

-- Insert initial privacy policy data (only if no active policy exists)
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
) 
SELECT 
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
WHERE NOT EXISTS (
  SELECT 1 FROM privacy_policy WHERE is_active = true
);

-- Update existing privacy policy if needed (optional - uncomment if you want to update existing data)
/*
UPDATE privacy_policy 
SET 
  content = '<h1>Privacy Policy</h1>

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
  updated_at = NOW()
WHERE is_active = true;
*/
