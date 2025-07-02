-- Migration to fix contact_group_companies table schema
-- This migration updates the column names to match the application code

-- Step 1: Check if the old columns exist and rename them
DO $$
BEGIN
    -- Rename 'name' column to 'region' if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contact_group_companies' 
        AND column_name = 'name'
    ) THEN
        ALTER TABLE contact_group_companies RENAME COLUMN name TO region;
    END IF;

    -- Rename 'display_order' column to 'sort_order' if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contact_group_companies' 
        AND column_name = 'display_order'
    ) THEN
        ALTER TABLE contact_group_companies RENAME COLUMN display_order TO sort_order;
    END IF;
END $$;

-- Step 2: Update constraints to match new column names
DO $$
BEGIN
    -- Drop old constraints if they exist
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'contact_group_companies' 
        AND constraint_name = 'valid_name'
    ) THEN
        ALTER TABLE contact_group_companies DROP CONSTRAINT valid_name;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'contact_group_companies' 
        AND constraint_name = 'unique_name'
    ) THEN
        ALTER TABLE contact_group_companies DROP CONSTRAINT unique_name;
    END IF;

    -- Add new constraints
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'contact_group_companies' 
        AND constraint_name = 'valid_region'
    ) THEN
        ALTER TABLE contact_group_companies ADD CONSTRAINT valid_region CHECK (length(trim(region)) > 0);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'contact_group_companies' 
        AND constraint_name = 'unique_region'
    ) THEN
        ALTER TABLE contact_group_companies ADD CONSTRAINT unique_region UNIQUE (region);
    END IF;
END $$;

-- Step 3: Create index on sort_order if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_contact_group_companies_sort_order 
ON contact_group_companies(sort_order);

-- Step 4: Update any existing data to ensure consistency
UPDATE contact_group_companies 
SET sort_order = COALESCE(sort_order, 0) 
WHERE sort_order IS NULL;
