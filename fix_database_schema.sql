-- Quick fix for contact_group_companies table schema
-- Run this in your Supabase SQL Editor

-- Step 1: Rename columns
ALTER TABLE contact_group_companies RENAME COLUMN name TO region;
ALTER TABLE contact_group_companies RENAME COLUMN display_order TO sort_order;

-- Step 2: Update constraints
ALTER TABLE contact_group_companies DROP CONSTRAINT IF EXISTS valid_name;
ALTER TABLE contact_group_companies DROP CONSTRAINT IF EXISTS unique_name;

ALTER TABLE contact_group_companies ADD CONSTRAINT valid_region CHECK (length(trim(region)) > 0);
ALTER TABLE contact_group_companies ADD CONSTRAINT unique_region UNIQUE (region);

-- Step 3: Create index
CREATE INDEX IF NOT EXISTS idx_contact_group_companies_sort_order ON contact_group_companies(sort_order);

-- Step 4: Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contact_group_companies' 
ORDER BY ordinal_position;
