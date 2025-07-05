-- Migration: Add budget field to contact_form_submissions table
-- Date: 2025-01-05
-- Description: Add budget column to support booth requirements form submissions

-- Add budget column to contact_form_submissions table
ALTER TABLE contact_form_submissions 
ADD COLUMN IF NOT EXISTS budget TEXT;

-- Add comment to the column
COMMENT ON COLUMN contact_form_submissions.budget IS 'Budget range for booth requirements submissions';
