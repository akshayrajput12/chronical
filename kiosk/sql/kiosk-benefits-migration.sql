-- Kiosk Benefits Section Migration Script
-- This script fixes the constraints and validation functions for the kiosk benefits section
-- 
-- ⚠️  SAFE TO RUN: This script only updates constraints and functions, preserves existing data
-- 🎯 FIXES: Constraint issues that prevent saving empty benefit arrays
-- ✅ RESULT: Kiosk benefits section can save with empty or populated benefit items
--
-- Run this script in Supabase SQL Editor

-- ============================================================================
-- DROP EXISTING CONSTRAINTS
-- ============================================================================

-- Drop the existing constraint that requires at least one benefit item
ALTER TABLE kiosk_benefits_sections 
DROP CONSTRAINT IF EXISTS valid_benefit_items;

-- ============================================================================
-- ADD UPDATED CONSTRAINTS
-- ============================================================================

-- Add updated constraint that allows empty benefit arrays
ALTER TABLE kiosk_benefits_sections 
ADD CONSTRAINT valid_benefit_items CHECK (jsonb_array_length(benefit_items) >= 0);

-- ============================================================================
-- UPDATE VALIDATION FUNCTIONS
-- ============================================================================

-- Update the validation function to allow empty arrays
CREATE OR REPLACE FUNCTION validate_benefit_items(items JSONB)
RETURNS BOOLEAN AS $$
DECLARE
  item JSONB;
BEGIN
  -- Allow empty arrays
  IF jsonb_array_length(items) = 0 THEN
    RETURN true;
  END IF;
  
  FOR item IN SELECT jsonb_array_elements(items)
  LOOP
    IF NOT validate_benefit_item(item) THEN
      RETURN false;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify the constraint was updated
-- SELECT conname, consrc FROM pg_constraint WHERE conname = 'valid_benefit_items';

-- Test empty array validation
-- SELECT validate_benefit_items('[]'::jsonb);

-- Test populated array validation
-- SELECT validate_benefit_items('[{"id":"1","title":"Test","description":"Test desc","order":1}]'::jsonb);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON CONSTRAINT valid_benefit_items ON kiosk_benefits_sections IS 'Allows empty benefit arrays (>= 0) for flexible content management';
COMMENT ON FUNCTION validate_benefit_items(JSONB) IS 'Updated to allow empty benefit arrays while validating populated arrays';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Kiosk benefits migration completed successfully!';
  RAISE NOTICE 'The system now supports saving sections with empty benefit arrays.';
END $$;
