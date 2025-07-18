-- Complete setup script for contact companies with URL functionality
-- Run this script to set up everything needed for the URL feature

-- ============================================================================
-- STEP 1: ADD URL COLUMN
-- ============================================================================

-- Add the URL column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contact_group_companies' 
        AND column_name = 'company_url'
    ) THEN
        ALTER TABLE contact_group_companies 
        ADD COLUMN company_url TEXT;
        
        -- Add comment
        COMMENT ON COLUMN contact_group_companies.company_url IS 'Optional URL that makes the company card clickable (e.g., company website)';
    END IF;
END $$;

-- ============================================================================
-- STEP 2: ADD URL VALIDATION CONSTRAINT
-- ============================================================================

-- Add constraint to ensure valid URLs
DO $$
BEGIN
    -- Check if constraint doesn't exist, then add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'contact_group_companies' 
        AND constraint_name = 'valid_company_url'
    ) THEN
        ALTER TABLE contact_group_companies 
        ADD CONSTRAINT valid_company_url 
        CHECK (
            company_url IS NULL OR 
            company_url = '' OR 
            company_url ~* '^https?://[^\s/$.?#].[^\s]*$'
        );
    END IF;
END $$;

-- ============================================================================
-- STEP 3: FIX EMAIL TYPO
-- ============================================================================

-- Update the email typo in contact_form_settings
UPDATE contact_form_settings 
SET sidebar_email = 'info@chronicleexhibits.ae'
WHERE sidebar_email = 'info@chronicleexhibts.ae';

-- ============================================================================
-- STEP 4: UPDATE EXISTING COMPANIES WITH SAMPLE URLS (OPTIONAL)
-- ============================================================================

-- Update existing companies with example URLs
-- Remove this section if you don't want sample URLs
UPDATE contact_group_companies 
SET company_url = CASE 
    WHEN region = 'Europe' THEN 'https://triumfo.de'
    WHEN region = 'United States' THEN 'https://triumfo.us'
    WHEN region = 'India' THEN 'https://triumfo.in'
    ELSE NULL
END
WHERE company_url IS NULL;

-- ============================================================================
-- STEP 5: VERIFY SETUP
-- ============================================================================

-- Verify the changes
SELECT 
    id, 
    region, 
    company_url, 
    is_active,
    CASE 
        WHEN company_url IS NOT NULL AND company_url != '' THEN 'Clickable'
        ELSE 'Not Clickable'
    END as card_status
FROM contact_group_companies 
ORDER BY sort_order;

-- Verify email fix
SELECT id, sidebar_email, is_active 
FROM contact_form_settings 
WHERE is_active = true;

-- ============================================================================
-- STEP 6: GRANT NECESSARY PERMISSIONS (IF NEEDED)
-- ============================================================================

-- Ensure RLS policies are in place
-- These should already exist from the original schema, but just in case:

-- Enable RLS if not already enabled
ALTER TABLE contact_group_companies ENABLE ROW LEVEL SECURITY;

-- Ensure public can read active companies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_group_companies' 
        AND policyname = 'Public can view active group companies'
    ) THEN
        CREATE POLICY "Public can view active group companies" ON contact_group_companies
            FOR SELECT USING (is_active = true);
    END IF;
END $$;

-- Ensure admins can manage all companies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_group_companies' 
        AND policyname = 'Admin full access to group companies'
    ) THEN
        CREATE POLICY "Admin full access to group companies" ON contact_group_companies
            FOR ALL USING (auth.role() = 'admin' OR auth.role() = 'service_role');
    END IF;
END $$;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'CONTACT COMPANIES URL SETUP COMPLETE!';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Go to /admin/pages/contact/info to add URLs to companies';
    RAISE NOTICE '2. Visit /contact-us to see clickable company cards';
    RAISE NOTICE '3. Test that cards with URLs redirect properly';
    RAISE NOTICE '4. Verify phone/email links still work independently';
    RAISE NOTICE '============================================================================';
END $$;
