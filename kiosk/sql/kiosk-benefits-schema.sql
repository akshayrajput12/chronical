-- Kiosk Benefits Section Schema for Supabase
-- This file contains the SQL schema for the kiosk benefits section of the Chronicle Exhibits website
-- 
-- ⚠️  SAFE TO RUN: This script only adds kiosk benefits support, preserves existing data
-- 🎯 ADDS: Kiosk benefits table with dynamic benefit items
-- ✅ RESULT: Kiosk benefits section supports dynamic content management
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- DATABASE TABLES
-- ============================================================================

-- Create kiosk_benefits_sections table
CREATE TABLE IF NOT EXISTS kiosk_benefits_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Section Content
  section_heading TEXT NOT NULL DEFAULT 'SURE BENEFITS OF CUSTOM KIOSK',
  section_description TEXT NOT NULL DEFAULT 'Nowadays people admire innovation. Anything that is handy & unique appeals to them. Customized kiosk solutions are big thumbs up if you wish to impress visitors coming to the show. Let''s have a quick look at the key benefits:',
  
  -- Benefit Items (stored as JSONB for flexibility)
  benefit_items JSONB NOT NULL DEFAULT '[
    {
      "id": "1",
      "title": "GOOD FOR ENGAGING CONSUMERS",
      "description": "Talking about trade shows the most important factor is the involvement of the visitors. Custom kiosks are greatly interactive displays that come with a clear & well-organized customer interaction system to ensure better customer engagement.",
      "order": 1
    },
    {
      "id": "2", 
      "title": "ENSURE HIGHER EFFICIENCY",
      "description": "Besides better consumer experience, custom kiosks enhance the efficiency of any brand or business group. Customized kiosks are digital & digitalization surely improves the rate of efficiency.",
      "order": 2
    },
    {
      "id": "3",
      "title": "HIGHLY FLEXIBLE CUSTOM KIOSKS", 
      "description": "As customized kiosks are technology-based & manufactured keeping in view your dynamic business needs they are adaptable. You can easily change the information on the KIOSK''s wing touch screens as the business needs change.",
      "order": 3
    }
  ]'::jsonb,
  
  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_section_heading CHECK (length(trim(section_heading)) > 0),
  CONSTRAINT valid_section_description CHECK (length(trim(section_description)) > 0),
  CONSTRAINT valid_benefit_items CHECK (jsonb_array_length(benefit_items) >= 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster queries on active kiosk benefits sections
CREATE INDEX IF NOT EXISTS idx_kiosk_benefits_sections_active 
ON kiosk_benefits_sections(is_active, created_at DESC);

-- Index for faster queries on benefit items
CREATE INDEX IF NOT EXISTS idx_kiosk_benefits_sections_benefit_items 
ON kiosk_benefits_sections USING GIN (benefit_items);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on kiosk_benefits_sections table
ALTER TABLE kiosk_benefits_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to kiosk benefits sections
CREATE POLICY "Public read access to kiosk benefits sections"
ON kiosk_benefits_sections FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage kiosk benefits sections
CREATE POLICY "Authenticated users can manage kiosk benefits sections"
ON kiosk_benefits_sections FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for kiosk_benefits_sections table
CREATE TRIGGER update_kiosk_benefits_sections_updated_at
  BEFORE UPDATE ON kiosk_benefits_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial data based on the current kiosk benefits section
INSERT INTO kiosk_benefits_sections (
  section_heading,
  section_description,
  benefit_items
) VALUES (
  'SURE BENEFITS OF CUSTOM KIOSK',
  'Nowadays people admire innovation. Anything that is handy & unique appeals to them. Customized kiosk solutions are big thumbs up if you wish to impress visitors coming to the show. Let''s have a quick look at the key benefits:',
  '[
    {
      "id": "1",
      "title": "GOOD FOR ENGAGING CONSUMERS",
      "description": "Talking about trade shows the most important factor is the involvement of the visitors. Custom kiosks are greatly interactive displays that come with a clear & well-organized customer interaction system to ensure better customer engagement.",
      "order": 1
    },
    {
      "id": "2", 
      "title": "ENSURE HIGHER EFFICIENCY",
      "description": "Besides better consumer experience, custom kiosks enhance the efficiency of any brand or business group. Customized kiosks are digital & digitalization surely improves the rate of efficiency.",
      "order": 2
    },
    {
      "id": "3",
      "title": "HIGHLY FLEXIBLE CUSTOM KIOSKS", 
      "description": "As customized kiosks are technology-based & manufactured keeping in view your dynamic business needs they are adaptable. You can easily change the information on the KIOSK''s wing touch screens as the business needs change.",
      "order": 3
    }
  ]'::jsonb
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Create function to get kiosk benefits section
CREATE OR REPLACE FUNCTION get_kiosk_benefits_section()
RETURNS TABLE (
  id UUID,
  section_heading TEXT,
  section_description TEXT,
  benefit_items JSONB,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    kbs.id,
    kbs.section_heading,
    kbs.section_description,
    kbs.benefit_items,
    kbs.is_active,
    kbs.created_at,
    kbs.updated_at
  FROM kiosk_benefits_sections kbs
  WHERE kbs.is_active = true
  ORDER BY kbs.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION get_kiosk_benefits_section() TO authenticated;
GRANT EXECUTE ON FUNCTION get_kiosk_benefits_section() TO anon;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to validate benefit item structure
CREATE OR REPLACE FUNCTION validate_benefit_item(item JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    item ? 'id' AND
    item ? 'title' AND 
    item ? 'description' AND
    item ? 'order' AND
    length(trim(item->>'title')) > 0 AND
    length(trim(item->>'description')) > 0 AND
    (item->>'order')::int > 0
  );
END;
$$ LANGUAGE plpgsql;

-- Function to validate all benefit items in array
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
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE kiosk_benefits_sections IS 'Stores content and configuration for kiosk benefits sections';
COMMENT ON FUNCTION get_kiosk_benefits_section() IS 'Returns the active kiosk benefits section with all benefit items';
COMMENT ON FUNCTION validate_benefit_item(JSONB) IS 'Validates the structure of a single benefit item';
COMMENT ON FUNCTION validate_benefit_items(JSONB) IS 'Validates the structure of all benefit items in an array';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table was created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'kiosk_benefits_sections';

-- Verify initial data was inserted
-- SELECT * FROM kiosk_benefits_sections WHERE is_active = true;

-- Test the database function
-- SELECT * FROM get_kiosk_benefits_section();

-- Test benefit items validation
-- SELECT validate_benefit_items('[{"id":"1","title":"Test","description":"Test desc","order":1}]'::jsonb);
