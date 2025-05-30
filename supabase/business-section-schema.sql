-- Business Section Schema for Supabase
-- This file contains the SQL schema for the business hub section of the Chronicle Exhibits website

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create business_sections table
CREATE TABLE IF NOT EXISTS business_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  heading TEXT NOT NULL,
  subheading TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create business_paragraphs table for description paragraphs
CREATE TABLE IF NOT EXISTS business_paragraphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_section_id UUID NOT NULL REFERENCES business_sections(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  UNIQUE(business_section_id, display_order)
);

-- Create business_stats table for statistics
CREATE TABLE IF NOT EXISTS business_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  business_section_id UUID NOT NULL REFERENCES business_sections(id) ON DELETE CASCADE,
  value INTEGER NOT NULL,
  label TEXT NOT NULL,
  sublabel TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  UNIQUE(business_section_id, display_order)
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_business_sections_updated_at
BEFORE UPDATE ON business_sections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_paragraphs_updated_at
BEFORE UPDATE ON business_paragraphs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_stats_updated_at
BEFORE UPDATE ON business_stats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE business_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_paragraphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for business_sections
CREATE POLICY "Anyone can view business sections"
ON business_sections
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert business sections"
ON business_sections
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update business sections"
ON business_sections
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete business sections"
ON business_sections
FOR DELETE
TO authenticated
USING (true);

-- Create policies for business_paragraphs
CREATE POLICY "Anyone can view business paragraphs"
ON business_paragraphs
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert business paragraphs"
ON business_paragraphs
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update business paragraphs"
ON business_paragraphs
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete business paragraphs"
ON business_paragraphs
FOR DELETE
TO authenticated
USING (true);

-- Create policies for business_stats
CREATE POLICY "Anyone can view business stats"
ON business_stats
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert business stats"
ON business_stats
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update business stats"
ON business_stats
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete business stats"
ON business_stats
FOR DELETE
TO authenticated
USING (true);

-- Insert initial data based on the current business section
INSERT INTO business_sections (
  heading,
  subheading
) VALUES (
  'A progressive business hub',
  'where companies can thrive'
) ON CONFLICT DO NOTHING
RETURNING id;

-- Insert initial paragraphs
WITH business_section AS (
  SELECT id FROM business_sections LIMIT 1
)
INSERT INTO business_paragraphs (
  business_section_id,
  content,
  display_order
)
SELECT 
  business_section.id,
  content,
  display_order
FROM 
  business_section,
  (VALUES 
    ('Dubai World Trade Centre stands at the centre of commerce, laying the foundation for Dubai''s ascent as a global hub and future economy enabler. We are your business gateway to the region, and beyond.', 1),
    ('A highly sought-after global business address and a vibrant destination, featuring premium commercial offices, co-working communities, the region''s leading exhibition and convention centre, in addition to hospitality and retail options Dubai World Trade Centre is where the world comes to meet and do business.', 2),
    ('With attractive benefits, facilities and tailored services for companies looking to shape the future of business, we offer a well-regulated and supportive environment, empowering startups, SMEs and multinationals to succeed.', 3)
  ) AS paragraphs(content, display_order)
ON CONFLICT DO NOTHING;

-- Insert initial stats
WITH business_section AS (
  SELECT id FROM business_sections LIMIT 1
)
INSERT INTO business_stats (
  business_section_id,
  value,
  label,
  sublabel,
  display_order
)
SELECT 
  business_section.id,
  value,
  label,
  sublabel,
  display_order
FROM 
  business_section,
  (VALUES 
    (2000, 'Companies', 'AND GROWING', 1),
    (40, 'Industries', 'REPRESENTED', 2),
    (2000000, 'Sq Ft.', 'OF PREMIUM OFFICE SPACE', 3)
  ) AS stats(value, label, sublabel, display_order)
ON CONFLICT DO NOTHING;

-- Create a function to get the complete business section data
CREATE OR REPLACE FUNCTION get_business_section()
RETURNS TABLE (
  id UUID,
  heading TEXT,
  subheading TEXT,
  paragraphs JSON,
  stats JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bs.id,
    bs.heading,
    bs.subheading,
    (
      SELECT json_agg(json_build_object(
        'id', bp.id,
        'content', bp.content,
        'display_order', bp.display_order
      ) ORDER BY bp.display_order)
      FROM business_paragraphs bp
      WHERE bp.business_section_id = bs.id
    ) AS paragraphs,
    (
      SELECT json_agg(json_build_object(
        'id', bst.id,
        'value', bst.value,
        'label', bst.label,
        'sublabel', bst.sublabel,
        'display_order', bst.display_order
      ) ORDER BY bst.display_order)
      FROM business_stats bst
      WHERE bst.business_section_id = bs.id
    ) AS stats
  FROM business_sections bs
  WHERE bs.is_active = true
  ORDER BY bs.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
