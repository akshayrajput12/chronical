-- Why Section Schema for Supabase
-- This file contains the SQL schema for the why section of the Chronicle Exhibits website

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create why_sections table
CREATE TABLE IF NOT EXISTS why_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  heading TEXT NOT NULL,
  underline_color TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  left_column_text_1 TEXT NOT NULL,
  left_column_text_2 TEXT NOT NULL,
  right_column_text TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  image_overlay_heading TEXT NOT NULL,
  image_overlay_subheading TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_why_sections_updated_at
BEFORE UPDATE ON why_sections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on why_sections table
ALTER TABLE why_sections ENABLE ROW LEVEL SECURITY;

-- Create policies for why_sections
CREATE POLICY "Anyone can view why sections"
ON why_sections FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert why sections"
ON why_sections FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update why sections"
ON why_sections FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete why sections"
ON why_sections FOR DELETE
TO authenticated
USING (true);

-- Create storage bucket for why section images
INSERT INTO storage.buckets (id, name, public) VALUES ('why-section-images', 'why-section-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the why-section-images bucket
-- Allow public access to read images
CREATE POLICY "Public can view why section images"
ON storage.objects FOR SELECT
USING (bucket_id = 'why-section-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload why section images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'why-section-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update why section images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'why-section-images');

-- Allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete why section images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'why-section-images');

-- Insert initial data based on the current why section
INSERT INTO why_sections (
  heading,
  underline_color,
  subtitle,
  left_column_text_1,
  left_column_text_2,
  right_column_text,
  image_url,
  image_alt,
  image_overlay_heading,
  image_overlay_subheading
) VALUES (
  'Why DWTC Free Zone',
  '#a5cd39',
  'Building on a 45 year legacy, DWTC Free Zone connects businesses and communities propelling their potential for success.',
  'DWTC Free Zone provides a unique and highly desirable proposition for businesses seeking a competitive and well-regulated ecosystem to operate in regional and global markets. Offering a range of benefits such as 100% foreign ownership, 0% taxes and customs duties, and streamlined procedures for visas and permits, the DWTC free zone is a future-focused ecosystem designed for transformative business growth.',
  'We are a progressive and welcoming free zone, open to all businesses. Anchored by world-class infrastructure and flexible company formation, licensing and setup solutions, DWTC Free Zone offers an ideal environment, nurturing a sustainable economy from Dubai.',
  'Spanning from the iconic Sheikh Rashid Tower to the neighboring One Central, DWTC Free Zone offers a diverse range of 1,200+ licensed business activities and is home to more than 1,800 small and medium businesses.',
  '/images/office-space.jpg',
  'Premium Commercial Offices',
  '2 MILLION+ SQ FT. OF',
  'PREMIUM COMMERCIAL OFFICES'
) ON CONFLICT DO NOTHING;

-- Create a function to get the active why section data
CREATE OR REPLACE FUNCTION get_why_section()
RETURNS TABLE (
  id UUID,
  heading TEXT,
  underline_color TEXT,
  subtitle TEXT,
  left_column_text_1 TEXT,
  left_column_text_2 TEXT,
  right_column_text TEXT,
  image_url TEXT,
  image_alt TEXT,
  image_overlay_heading TEXT,
  image_overlay_subheading TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ws.id,
    ws.heading,
    ws.underline_color,
    ws.subtitle,
    ws.left_column_text_1,
    ws.left_column_text_2,
    ws.right_column_text,
    ws.image_url,
    ws.image_alt,
    ws.image_overlay_heading,
    ws.image_overlay_subheading
  FROM why_sections ws
  WHERE ws.is_active = true
  ORDER BY ws.updated_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
