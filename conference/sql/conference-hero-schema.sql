-- Conference Hero Section Schema for Supabase
-- This file contains the SQL schema for the conference hero section of the Chronicle Exhibits website
-- 
-- ⚠️  SAFE TO RUN: This script only adds conference hero support, preserves existing data
-- 🎯 ADDS: Storage bucket, conference hero table, image management
-- ✅ RESULT: Conference hero section supports dynamic content and image upload
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for conference hero images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'conference-hero-images',
  'conference-hero-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the conference-hero-images bucket
-- Allow public access to read images
CREATE POLICY "conference_hero_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'conference-hero-images');

-- Allow authenticated users to upload images
CREATE POLICY "conference_hero_authenticated_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'conference-hero-images');

-- Allow authenticated users to update images
CREATE POLICY "conference_hero_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'conference-hero-images');

-- Allow authenticated users to delete images
CREATE POLICY "conference_hero_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'conference-hero-images');

-- Create conference_hero_images table for tracking uploaded images
CREATE TABLE IF NOT EXISTS conference_hero_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT 'Conference hero background image',
  is_active BOOLEAN NOT NULL DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Constraints
  CONSTRAINT valid_filename CHECK (length(trim(filename)) > 0),
  CONSTRAINT valid_file_path CHECK (length(trim(file_path)) > 0),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 10485760),
  CONSTRAINT valid_mime_type CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'image/jpg'))
);

-- Create conference_hero_sections table
CREATE TABLE IF NOT EXISTS conference_hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  heading TEXT NOT NULL,
  background_image_url TEXT,
  background_image_id UUID REFERENCES conference_hero_images(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,

  -- Constraints
  CONSTRAINT valid_heading CHECK (length(trim(heading)) > 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conference_hero_sections_active ON conference_hero_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_conference_hero_sections_created_at ON conference_hero_sections(created_at);
CREATE INDEX IF NOT EXISTS idx_conference_hero_images_active ON conference_hero_images(is_active);
CREATE INDEX IF NOT EXISTS idx_conference_hero_images_created_at ON conference_hero_images(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_conference_hero_sections_updated_at ON conference_hero_sections;
CREATE TRIGGER update_conference_hero_sections_updated_at
    BEFORE UPDATE ON conference_hero_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conference_hero_images_updated_at ON conference_hero_images;
CREATE TRIGGER update_conference_hero_images_updated_at
    BEFORE UPDATE ON conference_hero_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE conference_hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conference_hero_images ENABLE ROW LEVEL SECURITY;

-- Create policies for conference_hero_sections
CREATE POLICY "Anyone can view conference hero sections"
ON conference_hero_sections
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert conference hero sections"
ON conference_hero_sections
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update conference hero sections"
ON conference_hero_sections
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete conference hero sections"
ON conference_hero_sections
FOR DELETE
TO authenticated
USING (true);

-- Create policies for conference_hero_images
CREATE POLICY "Anyone can view conference hero images"
ON conference_hero_images
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert conference hero images"
ON conference_hero_images
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update conference hero images"
ON conference_hero_images
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete conference hero images"
ON conference_hero_images
FOR DELETE
TO authenticated
USING (true);

-- Insert initial data based on the current conference hero section
INSERT INTO conference_hero_sections (
  heading,
  background_image_url
) VALUES (
  'CONFERENCE ORGANIZERS IN DUBAI',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
) ON CONFLICT DO NOTHING;

-- Create function to get conference hero section with image data
CREATE OR REPLACE FUNCTION get_conference_hero_section_with_image()
RETURNS TABLE (
  id UUID,
  heading TEXT,
  background_image_url TEXT,
  background_image_id UUID,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  image_file_path TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    chs.id,
    chs.heading,
    chs.background_image_url,
    chs.background_image_id,
    chs.is_active,
    chs.created_at,
    chs.updated_at,
    chi.file_path as image_file_path
  FROM conference_hero_sections chs
  LEFT JOIN conference_hero_images chi ON chi.id = chs.background_image_id AND chi.is_active = true
  WHERE chs.is_active = true
  ORDER BY chs.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_conference_hero_section_with_image() TO public;
