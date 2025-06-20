-- Kiosk Consultancy Section Schema for Supabase
-- This file contains the SQL schema for the kiosk consultancy section of the Chronicle Exhibits website
-- 
-- ⚠️  SAFE TO RUN: This script only adds kiosk consultancy support, preserves existing data
-- 🎯 ADDS: Kiosk consultancy table with dynamic content management
-- ✅ RESULT: Kiosk consultancy section supports dynamic content management
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- DATABASE TABLES
-- ============================================================================

-- Create kiosk_consultancy_sections table
CREATE TABLE IF NOT EXISTS kiosk_consultancy_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Section Content
  section_heading TEXT NOT NULL DEFAULT 'FREE KIOSK DESIGN CONSULTANCY NOW',
  phone_number TEXT NOT NULL DEFAULT '+971 (543) 47-6649',
  phone_display_text TEXT NOT NULL DEFAULT 'Call +971 (543) 47-6649',
  phone_href TEXT NOT NULL DEFAULT 'tel:+971554974645',
  additional_text TEXT NOT NULL DEFAULT 'or submit inquiry form below',
  
  -- Button Styling (optional customization)
  button_bg_color TEXT DEFAULT 'black',
  button_text_color TEXT DEFAULT 'white',
  section_bg_color TEXT DEFAULT '#a5cd39',
  section_text_color TEXT DEFAULT 'black',
  
  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_section_heading CHECK (length(trim(section_heading)) > 0),
  CONSTRAINT valid_phone_number CHECK (length(trim(phone_number)) > 0),
  CONSTRAINT valid_phone_display_text CHECK (length(trim(phone_display_text)) > 0),
  CONSTRAINT valid_phone_href CHECK (length(trim(phone_href)) > 0),
  CONSTRAINT valid_additional_text CHECK (length(trim(additional_text)) > 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster queries on active kiosk consultancy sections
CREATE INDEX IF NOT EXISTS idx_kiosk_consultancy_sections_active 
ON kiosk_consultancy_sections(is_active, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on kiosk_consultancy_sections table
ALTER TABLE kiosk_consultancy_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to kiosk consultancy sections
CREATE POLICY "Public read access to kiosk consultancy sections"
ON kiosk_consultancy_sections FOR SELECT
USING (true);

-- Policy: Allow authenticated users to manage kiosk consultancy sections
CREATE POLICY "Authenticated users can manage kiosk consultancy sections"
ON kiosk_consultancy_sections FOR ALL
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

-- Trigger for kiosk_consultancy_sections table
CREATE TRIGGER update_kiosk_consultancy_sections_updated_at
  BEFORE UPDATE ON kiosk_consultancy_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial data based on the current kiosk consultancy section
INSERT INTO kiosk_consultancy_sections (
  section_heading,
  phone_number,
  phone_display_text,
  phone_href,
  additional_text,
  button_bg_color,
  button_text_color,
  section_bg_color,
  section_text_color
) VALUES (
  'FREE KIOSK DESIGN CONSULTANCY NOW',
  '+971 (543) 47-6649',
  'Call +971 (543) 47-6649',
  'tel:+971554974645',
  'or submit inquiry form below',
  'black',
  'white',
  '#a5cd39',
  'black'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Create function to get kiosk consultancy section
CREATE OR REPLACE FUNCTION get_kiosk_consultancy_section()
RETURNS TABLE (
  id UUID,
  section_heading TEXT,
  phone_number TEXT,
  phone_display_text TEXT,
  phone_href TEXT,
  additional_text TEXT,
  button_bg_color TEXT,
  button_text_color TEXT,
  section_bg_color TEXT,
  section_text_color TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    kcs.id,
    kcs.section_heading,
    kcs.phone_number,
    kcs.phone_display_text,
    kcs.phone_href,
    kcs.additional_text,
    kcs.button_bg_color,
    kcs.button_text_color,
    kcs.section_bg_color,
    kcs.section_text_color,
    kcs.is_active,
    kcs.created_at,
    kcs.updated_at
  FROM kiosk_consultancy_sections kcs
  WHERE kcs.is_active = true
  ORDER BY kcs.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users and anon
GRANT EXECUTE ON FUNCTION get_kiosk_consultancy_section() TO authenticated;
GRANT EXECUTE ON FUNCTION get_kiosk_consultancy_section() TO anon;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to validate phone number format
CREATE OR REPLACE FUNCTION validate_phone_number(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Basic validation for phone number (contains digits and common phone characters)
  RETURN phone ~ '^[\+\-\(\)\s\d]+$' AND length(trim(phone)) >= 10;
END;
$$ LANGUAGE plpgsql;

-- Function to validate phone href format
CREATE OR REPLACE FUNCTION validate_phone_href(href TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate that href starts with 'tel:' and contains valid characters
  RETURN href ~ '^tel:[\+\-\d]+$' AND length(trim(href)) >= 8;
END;
$$ LANGUAGE plpgsql;

-- Function to validate color format (hex or named colors)
CREATE OR REPLACE FUNCTION validate_color(color TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate hex colors (#ffffff) or common named colors
  RETURN color ~ '^#[0-9a-fA-F]{6}$' OR color ~ '^#[0-9a-fA-F]{3}$' OR 
         color IN ('black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'gray', 'grey');
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on helper functions
GRANT EXECUTE ON FUNCTION validate_phone_number(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_phone_href(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_color(TEXT) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE kiosk_consultancy_sections IS 'Stores content and configuration for kiosk consultancy sections';
COMMENT ON FUNCTION get_kiosk_consultancy_section() IS 'Returns the active kiosk consultancy section with all content and styling';
COMMENT ON FUNCTION validate_phone_number(TEXT) IS 'Validates phone number format';
COMMENT ON FUNCTION validate_phone_href(TEXT) IS 'Validates phone href format for tel: links';
COMMENT ON FUNCTION validate_color(TEXT) IS 'Validates color format (hex or named colors)';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table was created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'kiosk_consultancy_sections';

-- Verify initial data was inserted
-- SELECT * FROM kiosk_consultancy_sections WHERE is_active = true;

-- Test the database function
-- SELECT * FROM get_kiosk_consultancy_section();

-- Test validation functions
-- SELECT validate_phone_number('+971 (543) 47-6649');
-- SELECT validate_phone_href('tel:+971554974645');
-- SELECT validate_color('#a5cd39');
