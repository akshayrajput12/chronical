-- Hero Section Schema for Supabase
-- This file contains the SQL schema for the hero section of the Chronicle Exhibits website

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hero_sections table
CREATE TABLE IF NOT EXISTS hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  heading TEXT NOT NULL,
  subheading TEXT NOT NULL,
  description TEXT NOT NULL,
  cta_primary_text TEXT NOT NULL,
  cta_primary_url TEXT NOT NULL,
  cta_secondary_text TEXT NOT NULL,
  cta_secondary_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create hero_typing_texts table
CREATE TABLE IF NOT EXISTS hero_typing_texts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hero_section_id UUID NOT NULL REFERENCES hero_sections(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  UNIQUE(hero_section_id, display_order)
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
CREATE TRIGGER update_hero_sections_updated_at
BEFORE UPDATE ON hero_sections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_typing_texts_updated_at
BEFORE UPDATE ON hero_typing_texts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Note: Video is now static and not stored in the database

-- Enable Row Level Security on hero_sections and hero_typing_texts
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_typing_texts ENABLE ROW LEVEL SECURITY;

-- Create policies for hero_sections
CREATE POLICY "Anyone can view hero sections"
ON hero_sections
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert hero sections"
ON hero_sections
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update hero sections"
ON hero_sections
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete hero sections"
ON hero_sections
FOR DELETE
TO authenticated
USING (true);

-- Create policies for hero_typing_texts
CREATE POLICY "Anyone can view hero typing texts"
ON hero_typing_texts
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert hero typing texts"
ON hero_typing_texts
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update hero typing texts"
ON hero_typing_texts
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete hero typing texts"
ON hero_typing_texts
FOR DELETE
TO authenticated
USING (true);

-- Insert initial data based on the current hero section
INSERT INTO hero_sections (
  heading,
  subheading,
  description,
  cta_primary_text,
  cta_primary_url,
  cta_secondary_text,
  cta_secondary_url
) VALUES (
  'Launch, Grow and Thrive in the Free Zone',
  'for Business Game Changers',
  'Welcome to Chronicle Exhibits - a connected, collaborative world-class exhibition stand builder for pioneering entrepreneurs, startups and multinationals, in the heart of Dubai''s central business district.',
  'GET STARTED',
  '#',
  'LEARN MORE',
  '#'
) ON CONFLICT DO NOTHING
RETURNING id;

-- Insert initial typing texts
WITH hero_section AS (
  SELECT id FROM hero_sections LIMIT 1
)
INSERT INTO hero_typing_texts (
  hero_section_id,
  text,
  display_order
)
SELECT
  hero_section.id,
  text,
  display_order
FROM
  hero_section,
  (VALUES
    ('Exhibition Stands', 1),
    ('Congress Services', 2),
    ('Kiosk Solutions', 3),
    ('Custom Designs', 4),
    ('Event Management', 5)
  ) AS texts(text, display_order)
ON CONFLICT DO NOTHING;

-- Create a function to get the complete hero section data
CREATE OR REPLACE FUNCTION get_hero_section()
RETURNS TABLE (
  id UUID,
  heading TEXT,
  subheading TEXT,
  description TEXT,
  cta_primary_text TEXT,
  cta_primary_url TEXT,
  cta_secondary_text TEXT,
  cta_secondary_url TEXT,
  typing_texts JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    hs.id,
    hs.heading,
    hs.subheading,
    hs.description,
    hs.cta_primary_text,
    hs.cta_primary_url,
    hs.cta_secondary_text,
    hs.cta_secondary_url,
    (
      SELECT json_agg(json_build_object(
        'id', htt.id,
        'text', htt.text,
        'display_order', htt.display_order
      ) ORDER BY htt.display_order)
      FROM hero_typing_texts htt
      WHERE htt.hero_section_id = hs.id
    ) AS typing_texts
  FROM hero_sections hs
  WHERE hs.is_active = true
  ORDER BY hs.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
