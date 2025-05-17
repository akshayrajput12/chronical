-- Instagram Feed Schema for Supabase
-- This file contains the SQL schema for the Instagram feed section of the Chronicle Exhibits website

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create instagram_feed_section table for general section settings
CREATE TABLE IF NOT EXISTS instagram_feed_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  instagram_handle TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create instagram_posts table for individual posts
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  section_id UUID NOT NULL REFERENCES instagram_feed_section(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  subcaption TEXT,
  tag TEXT,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create storage bucket for Instagram post images
CREATE POLICY "Public Access to instagram-feed-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'instagram-feed-images');

-- Allow authenticated users to upload to the instagram-feed-images bucket
CREATE POLICY "Authenticated users can upload instagram-feed-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'instagram-feed-images');

-- Allow authenticated users to update their own objects in the instagram-feed-images bucket
CREATE POLICY "Authenticated users can update their own instagram-feed-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'instagram-feed-images' AND auth.uid() = owner);

-- Allow authenticated users to delete their own objects in the instagram-feed-images bucket
CREATE POLICY "Authenticated users can delete their own instagram-feed-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'instagram-feed-images' AND auth.uid() = owner);

-- Insert initial data for instagram_feed_section
INSERT INTO instagram_feed_section (
  title,
  subtitle,
  instagram_handle,
  is_active
) VALUES (
  'Follow',
  'for the Latest Updates',
  '@dwtc_freezone',
  true
) ON CONFLICT (id) DO NOTHING;

-- Get the section ID for the foreign key reference
DO $$
DECLARE
  section_id UUID;
BEGIN
  SELECT id INTO section_id FROM instagram_feed_section LIMIT 1;

  -- Insert initial data for Instagram posts
  INSERT INTO instagram_posts (
    section_id,
    image_url,
    caption,
    subcaption,
    tag,
    display_order,
    is_active
  ) VALUES
    (
      section_id,
      'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=2070',
      'DWTC Insider:',
      'Streamlined. Digital.',
      'Hassle-Free',
      1,
      true
    ),
    (
      section_id,
      'https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=2070',
      'WHY HERE?',
      '',
      '',
      2,
      true
    ),
    (
      section_id,
      'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?q=80&w=1974',
      'LIFESTYLE',
      'FREE ZONE',
      '',
      3,
      true
    ),
    (
      section_id,
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070',
      'POV: Your boss just followed',
      'you on social media',
      '',
      4,
      true
    )
  ON CONFLICT DO NOTHING;
END $$;
