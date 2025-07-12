-- Double Decker Exhibition Stands Schema for Supabase
-- This file contains the complete SQL schema for the double decker stands page
--
-- ⚠️  SAFE TO RUN: This script only adds double decker stands support, preserves existing data
-- 🎯 ADDS: Storage buckets, section tables, portfolio management, functions
-- ✅ RESULT: Complete double decker stands page with admin functionality
-- 📄 SECTIONS: Hero, Unique Quality, Communication, Portfolio (4 sections total)
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for double decker stands images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'double-decker-stands-images',
  'double-decker-stands-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for double decker portfolio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'double-decker-portfolio-images',
  'double-decker-portfolio-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- HERO SECTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS double_decker_hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content fields
  main_heading TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Background image
  background_image_url TEXT,
  background_image_alt TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- UNIQUE QUALITY SECTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS double_decker_unique_quality_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content fields
  main_heading TEXT NOT NULL,
  paragraph_1 TEXT NOT NULL,
  paragraph_2 TEXT NOT NULL,
  highlighted_text TEXT, -- For the green highlighted text
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- EFFECTIVE COMMUNICATION SECTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS double_decker_communication_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content fields
  main_heading TEXT NOT NULL,
  paragraph_1 TEXT NOT NULL,
  paragraph_2 TEXT NOT NULL,
  
  -- Section image
  section_image_url TEXT,
  section_image_alt TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true
);



-- ============================================================================
-- PORTFOLIO SECTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS double_decker_portfolio_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content fields
  main_heading TEXT NOT NULL,
  description TEXT,
  cta_button_text TEXT DEFAULT 'View All Projects',
  cta_button_url TEXT DEFAULT '#',
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- PORTFOLIO ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS double_decker_portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content fields
  title TEXT,
  description TEXT,
  alt_text TEXT NOT NULL,
  
  -- Image
  image_url TEXT NOT NULL,
  
  -- Layout and ordering
  display_order INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_double_decker_hero_sections_updated_at 
    BEFORE UPDATE ON double_decker_hero_sections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_double_decker_unique_quality_sections_updated_at 
    BEFORE UPDATE ON double_decker_unique_quality_sections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_double_decker_communication_sections_updated_at
    BEFORE UPDATE ON double_decker_communication_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_double_decker_portfolio_sections_updated_at
    BEFORE UPDATE ON double_decker_portfolio_sections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_double_decker_portfolio_items_updated_at
    BEFORE UPDATE ON double_decker_portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function to get hero section data
CREATE OR REPLACE FUNCTION get_double_decker_hero_section()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT row_to_json(hs) INTO result
    FROM double_decker_hero_sections hs
    WHERE hs.is_active = true
    LIMIT 1;

    RETURN result;
END;
$$;

-- Function to get unique quality section data
CREATE OR REPLACE FUNCTION get_double_decker_unique_quality_section()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT row_to_json(uqs) INTO result
    FROM double_decker_unique_quality_sections uqs
    WHERE uqs.is_active = true
    LIMIT 1;

    RETURN result;
END;
$$;

-- Function to get communication section data
CREATE OR REPLACE FUNCTION get_double_decker_communication_section()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT row_to_json(cs) INTO result
    FROM double_decker_communication_sections cs
    WHERE cs.is_active = true
    LIMIT 1;

    RETURN result;
END;
$$;



-- Function to get portfolio section with items
CREATE OR REPLACE FUNCTION get_double_decker_portfolio_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'section', (SELECT row_to_json(ps) FROM double_decker_portfolio_sections ps WHERE ps.is_active = true LIMIT 1),
        'items', (SELECT json_agg(row_to_json(pi) ORDER BY pi.display_order) FROM double_decker_portfolio_items pi WHERE pi.is_active = true)
    ) INTO result;

    RETURN result;
END;
$$;

-- Function to get all double decker page data
CREATE OR REPLACE FUNCTION get_double_decker_page_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'hero', (SELECT get_double_decker_hero_section()),
        'unique_quality', (SELECT get_double_decker_unique_quality_section()),
        'communication', (SELECT get_double_decker_communication_section()),
        'portfolio', (SELECT get_double_decker_portfolio_data())
    ) INTO result;

    RETURN result;
END;
$$;

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- Insert hero section data
INSERT INTO double_decker_hero_sections (
  main_heading,
  description,
  background_image_url,
  background_image_alt
) VALUES (
  'DOUBLE DECKER EXHIBITION STANDS',
  'Make your exhibit stand out and step up with our smartly created Double Decker Exhibition Stands. Engage your visitors with our stunning and innovative double-decker booths.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'Double Decker Exhibition Stands'
) ON CONFLICT DO NOTHING;

-- Insert unique quality section data
INSERT INTO double_decker_unique_quality_sections (
  main_heading,
  paragraph_1,
  paragraph_2,
  highlighted_text
) VALUES (
  'UNIQUE EXCELLENT QUALITY DOUBLE STOREY EXHIBITION BOOTHS',
  'Welcome to Double Decker Exhibition Stands in Dubai – your premier destination for innovative exhibition solutions that elevate your brand presence. As Dubai''s leading provider of double-decker stands, we specialize in creating impactful spaces that leave lasting impressions on your audience.',
  'Our stands offer versatility and sophistication, providing the perfect platform for showcasing your products. Whether it''s a trade show or conference, our team collaborates closely with you to reflecting your brand identity. Every element of these stands is manufactured to upgrade your brand image & meet your specific business requirements. These stands help you achieve your objectives and catch the convinced attention of the visitors.',
  'design customized stands'
) ON CONFLICT DO NOTHING;

-- Insert communication section data
INSERT INTO double_decker_communication_sections (
  main_heading,
  paragraph_1,
  paragraph_2,
  section_image_url,
  section_image_alt
) VALUES (
  'EFFECTIVELY COMMUNICATES YOUR MESSAGE',
  'An exhibition booth makes you look different from other exhibitors & passes on the relevant brand message to the clients. We understand the importance of standing out. That''s why we ensure your stand grabs attention and effectively communicates your message. From innovative layouts to bold graphics, we use the latest technology to create unforgettable experiences.',
  'Our commitment extends beyond design. We provide comprehensive services, including fabrication and installation, ensuring timely delivery and high-quality standards. Trust us to bring your vision to life and achieve your exhibition goals.',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  'Exhibition Communication'
) ON CONFLICT DO NOTHING;



-- Insert portfolio section data
INSERT INTO double_decker_portfolio_sections (
  main_heading,
  description,
  cta_button_text,
  cta_button_url
) VALUES (
  'OUR DOUBLE DECKER EXHIBITION STANDS PORTFOLIO',
  'Explore our impressive collection of double decker exhibition stands that showcase our expertise in creating multi-level displays that captivate and engage.',
  'View All Projects',
  '/portfolio'
) ON CONFLICT DO NOTHING;

-- Insert sample portfolio items
INSERT INTO double_decker_portfolio_items (
  title,
  description,
  alt_text,
  image_url,
  display_order
) VALUES
  ('Modern Double Decker Stand', 'Contemporary design with sleek finishes', 'Modern double decker exhibition stand', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 1),
  ('Corporate Multi-Level Display', 'Professional corporate exhibition booth', 'Corporate double decker display', 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 2),
  ('Interactive Two-Story Booth', 'Engaging interactive exhibition space', 'Interactive double decker booth', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 3),
  ('Luxury Exhibition Stand', 'Premium luxury double decker design', 'Luxury double decker exhibition stand', 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4),
  ('Tech Innovation Display', 'Technology-focused multi-level booth', 'Technology double decker display', 'https://images.unsplash.com/photo-1551818255-e6e10975cd17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 5),
  ('Creative Design Showcase', 'Artistic and creative exhibition space', 'Creative double decker showcase', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 6)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE double_decker_hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE double_decker_unique_quality_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE double_decker_communication_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE double_decker_portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE double_decker_portfolio_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HERO SECTION POLICIES
-- ============================================================================

-- Public read access for active hero sections
CREATE POLICY "Public can view active double decker hero sections"
ON double_decker_hero_sections FOR SELECT
USING (is_active = true);

-- Admin full access to hero sections
CREATE POLICY "Authenticated users can manage double decker hero sections"
ON double_decker_hero_sections FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================================================
-- UNIQUE QUALITY SECTION POLICIES
-- ============================================================================

-- Public read access for active unique quality sections
CREATE POLICY "Public can view active double decker unique quality sections"
ON double_decker_unique_quality_sections FOR SELECT
USING (is_active = true);

-- Admin full access to unique quality sections
CREATE POLICY "Authenticated users can manage double decker unique quality sections"
ON double_decker_unique_quality_sections FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================================================
-- COMMUNICATION SECTION POLICIES
-- ============================================================================

-- Public read access for active communication sections
CREATE POLICY "Public can view active double decker communication sections"
ON double_decker_communication_sections FOR SELECT
USING (is_active = true);

-- Admin full access to communication sections
CREATE POLICY "Authenticated users can manage double decker communication sections"
ON double_decker_communication_sections FOR ALL
USING (auth.role() = 'authenticated');



-- ============================================================================
-- PORTFOLIO SECTION POLICIES
-- ============================================================================

-- Public read access for active portfolio sections
CREATE POLICY "Public can view active double decker portfolio sections"
ON double_decker_portfolio_sections FOR SELECT
USING (is_active = true);

-- Admin full access to portfolio sections
CREATE POLICY "Authenticated users can manage double decker portfolio sections"
ON double_decker_portfolio_sections FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================================================
-- PORTFOLIO ITEMS POLICIES
-- ============================================================================

-- Public read access for active portfolio items
CREATE POLICY "Public can view active double decker portfolio items"
ON double_decker_portfolio_items FOR SELECT
USING (is_active = true);

-- Admin full access to portfolio items
CREATE POLICY "Authenticated users can manage double decker portfolio items"
ON double_decker_portfolio_items FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Double decker stands images bucket policies
CREATE POLICY "Public can view double decker stands images"
ON storage.objects FOR SELECT
USING (bucket_id = 'double-decker-stands-images');

CREATE POLICY "Authenticated users can upload double decker stands images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'double-decker-stands-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update double decker stands images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'double-decker-stands-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete double decker stands images"
ON storage.objects FOR DELETE
USING (bucket_id = 'double-decker-stands-images' AND auth.role() = 'authenticated');

-- Double decker portfolio images bucket policies
CREATE POLICY "Public can view double decker portfolio images"
ON storage.objects FOR SELECT
USING (bucket_id = 'double-decker-portfolio-images');

CREATE POLICY "Authenticated users can upload double decker portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'double-decker-portfolio-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update double decker portfolio images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'double-decker-portfolio-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete double decker portfolio images"
ON storage.objects FOR DELETE
USING (bucket_id = 'double-decker-portfolio-images' AND auth.role() = 'authenticated');

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_double_decker_hero_sections_active ON double_decker_hero_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_double_decker_unique_quality_sections_active ON double_decker_unique_quality_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_double_decker_communication_sections_active ON double_decker_communication_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_double_decker_portfolio_sections_active ON double_decker_portfolio_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_double_decker_portfolio_items_active_order ON double_decker_portfolio_items(is_active, display_order);

-- ============================================================================
-- SCHEMA EXECUTION COMPLETE
-- ============================================================================

-- ✅ SCHEMA EXECUTION COMPLETE
--
-- Verify successful execution by checking:
-- 1. Storage buckets: SELECT * FROM storage.buckets WHERE id LIKE 'double-decker-%';
-- 2. Tables created: \dt double_decker_* (should show 5 tables)
-- 3. Functions created: \df *double_decker* (should show 4 functions)
-- 4. Policies created: \dp double_decker_*
--
-- The double decker stands management system is now ready for use!
--
-- 📊 FINAL STRUCTURE:
-- - 4 Page Sections: Hero, Unique Quality, Communication, Portfolio
-- - 5 Database Tables: 4 section tables + 1 portfolio items table
-- - 4 Database Functions: 3 section functions + 1 portfolio function
-- - 2 Storage Buckets: stands-images + portfolio-images
-- - 4 Admin Pages: Hero, Quality, Communication, Portfolio management
--
-- Next steps:
-- 1. Test content management through the admin panel at /admin/pages/double-decker-stand
-- 2. Verify frontend integration at /double-decker-exhibition-stands-in-dubai
-- 3. Ensure Next.js domains are configured for your Supabase project URL
--
-- Note: All components are fully dynamic with no static fallbacks.
-- Content must be managed through the admin panel for the page to display properly.
