-- Custom Exhibition Portfolio Schema for Supabase
-- This file contains the SQL schema for the portfolio section of custom exhibition stands page
-- 
-- 🎯 PURPOSE: Dynamic portfolio management for custom exhibition stands page
-- 📊 TABLES: Portfolio section and portfolio items tables
-- 🗄️ STORAGE: custom-exhibition-portfolio bucket for portfolio images
-- 🔒 SECURITY: RLS policies for public read, authenticated write
-- ⚡ PERFORMANCE: Proper indexing and constraints
--
-- ⚠️  SAFE TO RUN: This script preserves existing database objects
-- 🚀 IDEMPOTENT: Can be executed multiple times without errors
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for custom exhibition portfolio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'custom-exhibition-portfolio',
  'custom-exhibition-portfolio',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES (Drop existing first to avoid conflicts)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "custom_portfolio_public_read" ON storage.objects;
DROP POLICY IF EXISTS "custom_portfolio_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "custom_portfolio_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "custom_portfolio_authenticated_delete" ON storage.objects;

-- Allow public read access to custom exhibition portfolio images
CREATE POLICY "custom_portfolio_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'custom-exhibition-portfolio');

-- Allow authenticated users to upload images
CREATE POLICY "custom_portfolio_authenticated_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'custom-exhibition-portfolio');

-- Allow authenticated users to update images
CREATE POLICY "custom_portfolio_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'custom-exhibition-portfolio');

-- Allow authenticated users to delete images
CREATE POLICY "custom_portfolio_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'custom-exhibition-portfolio');

-- ============================================================================
-- PORTFOLIO SECTION TABLE
-- ============================================================================

-- Create custom_exhibition_portfolio_section table
CREATE TABLE IF NOT EXISTS custom_exhibition_portfolio_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  section_title TEXT NOT NULL DEFAULT 'PORTFOLIO',
  main_title TEXT NOT NULL DEFAULT 'OUR RECENT WORK',
  description TEXT NOT NULL DEFAULT 'Check out our portfolio for the success stories of brands that trusted us as their custom exhibition stand contractor. Our recent work includes a diverse range of custom stand designs.',
  
  -- CTA Button
  cta_text TEXT NOT NULL DEFAULT 'View All Projects',
  cta_url TEXT NOT NULL DEFAULT '#',
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  CONSTRAINT valid_section_title CHECK (length(trim(section_title)) > 0),
  CONSTRAINT valid_main_title CHECK (length(trim(main_title)) > 0),
  CONSTRAINT valid_description CHECK (length(trim(description)) > 0),
  CONSTRAINT valid_cta_text CHECK (length(trim(cta_text)) > 0)
);

-- ============================================================================
-- PORTFOLIO ITEMS TABLE
-- ============================================================================

-- Create custom_exhibition_portfolio_items table
CREATE TABLE IF NOT EXISTS custom_exhibition_portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  project_year INTEGER,
  project_location TEXT,
  
  -- Image
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL DEFAULT 'Portfolio project image',
  
  -- Metadata
  category TEXT DEFAULT 'Exhibition Stand',
  tags TEXT[], -- Array of tags for filtering
  
  -- Ordering and Status
  display_order INTEGER NOT NULL DEFAULT 1,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- File tracking (if uploaded to Supabase storage)
  image_file_path TEXT,
  image_file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Constraints
  CONSTRAINT valid_title_portfolio CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_image_url CHECK (length(trim(image_url)) > 0),
  CONSTRAINT valid_image_alt CHECK (length(trim(image_alt)) > 0),
  CONSTRAINT positive_display_order_portfolio CHECK (display_order > 0),
  CONSTRAINT valid_project_year CHECK (project_year IS NULL OR (project_year >= 2000 AND project_year <= EXTRACT(YEAR FROM NOW()) + 1)),
  CONSTRAINT unique_display_order_portfolio UNIQUE (display_order)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE custom_exhibition_portfolio_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_exhibition_portfolio_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "custom_portfolio_section_public_read" ON custom_exhibition_portfolio_section;
DROP POLICY IF EXISTS "custom_portfolio_items_public_read" ON custom_exhibition_portfolio_items;
DROP POLICY IF EXISTS "custom_portfolio_section_authenticated_write" ON custom_exhibition_portfolio_section;
DROP POLICY IF EXISTS "custom_portfolio_items_authenticated_write" ON custom_exhibition_portfolio_items;

-- Public read policies for all tables
CREATE POLICY "custom_portfolio_section_public_read" ON custom_exhibition_portfolio_section FOR SELECT TO public USING (true);
CREATE POLICY "custom_portfolio_items_public_read" ON custom_exhibition_portfolio_items FOR SELECT TO public USING (true);

-- Authenticated write policies for all tables
CREATE POLICY "custom_portfolio_section_authenticated_write" ON custom_exhibition_portfolio_section FOR ALL TO authenticated USING (true);
CREATE POLICY "custom_portfolio_items_authenticated_write" ON custom_exhibition_portfolio_items FOR ALL TO authenticated USING (true);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Create or update the update_updated_at_column function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Drop existing triggers if they exist to avoid conflicts
DROP TRIGGER IF EXISTS update_custom_portfolio_section_updated_at ON custom_exhibition_portfolio_section;
DROP TRIGGER IF EXISTS update_custom_portfolio_items_updated_at ON custom_exhibition_portfolio_items;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_custom_portfolio_section_updated_at
    BEFORE UPDATE ON custom_exhibition_portfolio_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_portfolio_items_updated_at
    BEFORE UPDATE ON custom_exhibition_portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function to get portfolio section data
CREATE OR REPLACE FUNCTION get_custom_exhibition_portfolio_section()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT row_to_json(ps) INTO result
    FROM custom_exhibition_portfolio_section ps 
    WHERE ps.is_active = true 
    LIMIT 1;
    
    RETURN result;
END;
$$;

-- Function to get portfolio items with proper ordering
CREATE OR REPLACE FUNCTION get_custom_exhibition_portfolio_items()
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    client_name TEXT,
    project_year INTEGER,
    project_location TEXT,
    image_url TEXT,
    image_alt TEXT,
    category TEXT,
    tags TEXT[],
    display_order INTEGER,
    is_featured BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pi.id,
        pi.title,
        pi.description,
        pi.client_name,
        pi.project_year,
        pi.project_location,
        pi.image_url,
        pi.image_alt,
        pi.category,
        pi.tags,
        pi.display_order,
        pi.is_featured
    FROM custom_exhibition_portfolio_items pi
    WHERE pi.is_active = true
    ORDER BY pi.display_order ASC;
END;
$$;

-- Function to get complete portfolio data
CREATE OR REPLACE FUNCTION get_custom_exhibition_portfolio_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'section', (SELECT row_to_json(ps) FROM custom_exhibition_portfolio_section ps WHERE ps.is_active = true LIMIT 1),
        'items', (SELECT json_agg(row_to_json(pi) ORDER BY pi.display_order) FROM custom_exhibition_portfolio_items pi WHERE pi.is_active = true)
    ) INTO result;
    
    RETURN result;
END;
$$;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_custom_portfolio_items_display_order ON custom_exhibition_portfolio_items(display_order);
CREATE INDEX IF NOT EXISTS idx_custom_portfolio_items_is_active ON custom_exhibition_portfolio_items(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_portfolio_items_is_featured ON custom_exhibition_portfolio_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_custom_portfolio_items_category ON custom_exhibition_portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_custom_portfolio_section_is_active ON custom_exhibition_portfolio_section(is_active);

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- Insert default portfolio section data
INSERT INTO custom_exhibition_portfolio_section (id, section_title, main_title, description, cta_text, cta_url, is_active)
VALUES (
    uuid_generate_v4(),
    'PORTFOLIO',
    'OUR RECENT WORK',
    'Check out our portfolio for the success stories of brands that trusted us as their custom exhibition stand contractor. Our recent work includes a diverse range of custom stand designs.',
    'View All Projects',
    '#',
    true
) ON CONFLICT DO NOTHING;

-- Insert sample portfolio items
INSERT INTO custom_exhibition_portfolio_items (id, title, description, client_name, project_year, project_location, image_url, image_alt, category, tags, display_order, is_featured, is_active)
VALUES
(
    uuid_generate_v4(),
    'Modern Tech Exhibition Stand',
    'A sleek and modern exhibition stand designed for a leading technology company, featuring interactive displays and cutting-edge design elements.',
    'TechCorp Solutions',
    2024,
    'Dubai World Trade Centre',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Modern tech exhibition stand with interactive displays',
    'Technology',
    ARRAY['Modern', 'Interactive', 'Technology', 'LED'],
    1,
    true,
    true
),
(
    uuid_generate_v4(),
    'Luxury Brand Showcase',
    'An elegant and sophisticated exhibition stand for a luxury brand, emphasizing premium materials and refined aesthetics.',
    'Luxury Brands International',
    2024,
    'Abu Dhabi National Exhibition Centre',
    'https://images.unsplash.com/photo-1559223607-b4d0555ae227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Luxury brand exhibition stand with premium finishes',
    'Luxury',
    ARRAY['Luxury', 'Premium', 'Elegant', 'Sophisticated'],
    2,
    true,
    true
),
(
    uuid_generate_v4(),
    'Healthcare Innovation Hub',
    'A clean and professional exhibition stand designed for a healthcare company, featuring product demonstration areas and consultation spaces.',
    'MedTech Innovations',
    2023,
    'Dubai International Convention Centre',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Healthcare exhibition stand with consultation areas',
    'Healthcare',
    ARRAY['Healthcare', 'Clean', 'Professional', 'Innovation'],
    3,
    false,
    true
),
(
    uuid_generate_v4(),
    'Automotive Excellence Display',
    'A dynamic exhibition stand for an automotive company, featuring vehicle displays and immersive brand experiences.',
    'AutoMax Motors',
    2023,
    'Sharjah Expo Centre',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Automotive exhibition stand with vehicle displays',
    'Automotive',
    ARRAY['Automotive', 'Dynamic', 'Vehicle Display', 'Immersive'],
    4,
    false,
    true
),
(
    uuid_generate_v4(),
    'Sustainable Energy Pavilion',
    'An eco-friendly exhibition stand showcasing renewable energy solutions with sustainable materials and green technology.',
    'GreenTech Energy',
    2023,
    'Dubai World Trade Centre',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Sustainable energy exhibition stand with green technology',
    'Energy',
    ARRAY['Sustainable', 'Green', 'Energy', 'Eco-friendly'],
    5,
    false,
    true
),
(
    uuid_generate_v4(),
    'Fashion & Lifestyle Showcase',
    'A stylish and trendy exhibition stand for a fashion brand, featuring runway-style displays and interactive fashion experiences.',
    'Style & Co Fashion',
    2024,
    'Dubai Design District',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Fashion exhibition stand with runway displays',
    'Fashion',
    ARRAY['Fashion', 'Stylish', 'Trendy', 'Runway', 'Lifestyle'],
    6,
    false,
    true
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- SCHEMA COMPLETION MESSAGE
-- ============================================================================

-- ✅ PORTFOLIO SCHEMA EXECUTION COMPLETE
--
-- Verify successful execution by checking:
-- 1. Storage bucket: SELECT * FROM storage.buckets WHERE id = 'custom-exhibition-portfolio';
-- 2. Tables created: \dt custom_exhibition_portfolio*
-- 3. Functions created: \df *custom_exhibition_portfolio*
-- 4. Policies created: \dp custom_exhibition_portfolio*
-- 5. Sample data: SELECT * FROM get_custom_exhibition_portfolio_data();
--
-- The custom exhibition portfolio management system is now ready for use!
--
-- Next steps:
-- 1. Create admin panel components for portfolio management
-- 2. Update frontend portfolio component to fetch data from database
-- 3. Test image upload functionality
-- 4. Verify portfolio displays correctly
--
-- Note: All functions return data in JSON format for easy frontend consumption.
-- The admin panel can use individual table queries for CRUD operations.
