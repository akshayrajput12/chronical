-- Add URL column to contact_group_companies table
-- This allows admin to add clickable URLs for each company card

-- Add the URL column
ALTER TABLE contact_group_companies 
ADD COLUMN IF NOT EXISTS company_url TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN contact_group_companies.company_url IS 'Optional URL that makes the company card clickable (e.g., company website)';

-- Add a constraint to ensure valid URLs (optional but recommended)
-- Note: PostgreSQL doesn't support IF NOT EXISTS for constraints, so we'll use DO block
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

-- Update existing companies with example URLs (optional - remove if not needed)
UPDATE contact_group_companies 
SET company_url = CASE 
    WHEN region = 'Europe' THEN 'https://triumfo.de'
    WHEN region = 'United States' THEN 'https://triumfo.us'
    WHEN region = 'India' THEN 'https://triumfo.in'
    ELSE NULL
END
WHERE company_url IS NULL;

-- Verify the changes
SELECT id, region, company_url, is_active 
FROM contact_group_companies 
ORDER BY sort_order;
