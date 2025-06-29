-- Expo Pavilion Stand - Paragraph Section Schema
-- This file adds paragraph section support to the expo pavilion stands page
--
-- ⚠️  SAFE TO RUN: This script only adds paragraph section support, preserves existing data
-- 🎯 ADDS: Paragraph section table and functions
-- ✅ RESULT: Complete paragraph section management for expo pavilion stands
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PARAGRAPH SECTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS expo_pavilion_paragraph_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  paragraph_content TEXT NOT NULL DEFAULT 'Chronicle Exhibits excels in designing and constructing country pavilion expo booths that authentically represent national identity and cultural heritage on the global stage. Our pavilion solutions create immersive environments that showcase your country''s unique offerings, from traditional craftsmanship to cutting-edge innovations, while fostering international trade relationships and cultural exchange that leave lasting impressions on visitors from around the world.',
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  CONSTRAINT valid_paragraph_content CHECK (length(trim(paragraph_content)) > 0)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE expo_pavilion_paragraph_section ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Allow public read access to expo pavilion paragraph section"
ON expo_pavilion_paragraph_section FOR SELECT
TO public
USING (is_active = true);

-- Policy for authenticated users to manage content
CREATE POLICY "Allow authenticated users to manage expo pavilion paragraph section"
ON expo_pavilion_paragraph_section FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function to get active paragraph section
CREATE OR REPLACE FUNCTION get_expo_pavilion_paragraph_section()
RETURNS TABLE (
    id UUID,
    paragraph_content TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.paragraph_content,
        p.is_active,
        p.created_at,
        p.updated_at
    FROM expo_pavilion_paragraph_section p
    WHERE p.is_active = true
    ORDER BY p.updated_at DESC
    LIMIT 1;
END;
$$;

-- Function to save paragraph section (deactivates others and creates/updates active one)
CREATE OR REPLACE FUNCTION save_expo_pavilion_paragraph_section(
    p_paragraph_content TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    section_id UUID;
BEGIN
    -- Deactivate all existing sections
    UPDATE expo_pavilion_paragraph_section 
    SET is_active = false, updated_at = NOW()
    WHERE is_active = true;
    
    -- Insert new active section
    INSERT INTO expo_pavilion_paragraph_section (
        paragraph_content,
        is_active
    ) VALUES (
        p_paragraph_content,
        true
    ) RETURNING id INTO section_id;
    
    RETURN section_id;
END;
$$;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_expo_pavilion_paragraph_section_active 
ON expo_pavilion_paragraph_section(is_active);

CREATE INDEX IF NOT EXISTS idx_expo_pavilion_paragraph_section_updated 
ON expo_pavilion_paragraph_section(updated_at DESC);

-- ============================================================================
-- DEFAULT DATA
-- ============================================================================

-- Insert default paragraph section data
INSERT INTO expo_pavilion_paragraph_section (
    id, 
    paragraph_content, 
    is_active
) VALUES (
    uuid_generate_v4(),
    'Chronicle Exhibits excels in designing and constructing country pavilion expo booths that authentically represent national identity and cultural heritage on the global stage. Our pavilion solutions create immersive environments that showcase your country''s unique offerings, from traditional craftsmanship to cutting-edge innovations, while fostering international trade relationships and cultural exchange that leave lasting impressions on visitors from around the world.',
    true
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
-- SELECT * FROM expo_pavilion_paragraph_section;

-- Verify function works
-- SELECT * FROM get_expo_pavilion_paragraph_section();

-- Test save function
-- SELECT save_expo_pavilion_paragraph_section('Test paragraph content');

-- ✅ EXPO PAVILION PARAGRAPH SECTION SCHEMA COMPLETE
