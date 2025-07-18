-- Fix email typo in contact form settings
-- This updates the existing database to use the correct email address

-- Update the default email in contact_form_settings table
UPDATE contact_form_settings 
SET sidebar_email = 'info@chronicleexhibits.ae'
WHERE sidebar_email = 'info@chronicleexhibts.ae';

-- Verify the update
SELECT id, sidebar_email, is_active 
FROM contact_form_settings 
WHERE is_active = true;
