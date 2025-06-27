-- Custom Exhibition Stands Schema for Supabase (Fixed Version)
-- This file contains the complete SQL schema for the custom exhibition stands page
-- 
-- 🎯 PURPOSE: Dynamic content management for custom exhibition stands page
-- 📊 TABLES: Multiple tables for each page section
-- 🗄️ STORAGE: custom-exhibition-images bucket for all images
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

-- Create storage bucket for custom exhibition stands images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'custom-exhibition-images',
  'custom-exhibition-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES (Drop existing first to avoid conflicts)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "custom_exhibition_public_read" ON storage.objects;
DROP POLICY IF EXISTS "custom_exhibition_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "custom_exhibition_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "custom_exhibition_authenticated_delete" ON storage.objects;

-- Allow public read access to custom exhibition images
CREATE POLICY "custom_exhibition_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'custom-exhibition-images');

-- Allow authenticated users to upload images
CREATE POLICY "custom_exhibition_authenticated_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'custom-exhibition-images');

-- Allow authenticated users to update images
CREATE POLICY "custom_exhibition_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'custom-exhibition-images');

-- Allow authenticated users to delete images
CREATE POLICY "custom_exhibition_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'custom-exhibition-images');

-- ============================================================================
-- IMAGE MANAGEMENT TABLE
-- ============================================================================

-- Create custom_exhibition_images table for tracking uploaded images
CREATE TABLE IF NOT EXISTS custom_exhibition_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- File information
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  
  -- Metadata
  alt_text TEXT NOT NULL DEFAULT 'Custom exhibition stands image',
  caption TEXT,
  
  -- Usage tracking
  section_type TEXT CHECK (section_type IN ('hero', 'promote_brand', 'striking_customized')),
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Constraints
  CONSTRAINT valid_filename CHECK (length(trim(filename)) > 0),
  CONSTRAINT valid_file_path CHECK (length(trim(file_path)) > 0),
  CONSTRAINT positive_file_size CHECK (file_size > 0)
);

-- ============================================================================
-- HERO SECTION TABLE
-- ============================================================================

-- Create custom_exhibition_hero table
CREATE TABLE IF NOT EXISTS custom_exhibition_hero (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  title TEXT NOT NULL DEFAULT 'CUSTOM EXHIBITION STANDS',
  subtitle TEXT NOT NULL DEFAULT 'Increase the value of your brand with Chronicle Exhibition Organizing LLC, the leading source for custom-designed exhibit stand solutions in the UAE. We create visually compelling exhibition displays. Our team of skilled designers work to custom exhibition stands that transform your appearance at exhibitions.',
  
  -- Background image
  background_image_id UUID REFERENCES custom_exhibition_images(id) ON DELETE SET NULL,
  background_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  background_image_alt TEXT DEFAULT 'Custom Exhibition Stands',
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  CONSTRAINT valid_title CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_subtitle CHECK (length(trim(subtitle)) > 0)
);

-- ============================================================================
-- LEADING CONTRACTOR SECTION TABLE
-- ============================================================================

-- Create custom_exhibition_leading_contractor table
CREATE TABLE IF NOT EXISTS custom_exhibition_leading_contractor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  title TEXT NOT NULL DEFAULT 'LEADING CONTRACTOR FOR CUSTOM EXHIBITION STANDS',
  paragraph_1 TEXT NOT NULL DEFAULT 'The ultimate destination for bespoke, eye-catching, and innovative custom exhibition stands in Dubai that catapult your brand presence to new heights. Chronicle Exhibits is the leading provider of customized exhibition solutions in Dubai, we excel in crafting unforgettable experiences that catch the audiences and leave a lasting impression.',
  paragraph_2 TEXT NOT NULL DEFAULT 'At Custom Exhibition Stands, we recognize the uniqueness of every brand and commit ourselves to transforming your vision into reality. Whether you''re gearing up for a trade show, conference, or any other event, our team actively collaborate with you to conceive and construct tailor-made exhibition stands that mirror your brand identity and objectives.',
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  CONSTRAINT valid_title_leading CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_paragraph_1 CHECK (length(trim(paragraph_1)) > 0),
  CONSTRAINT valid_paragraph_2 CHECK (length(trim(paragraph_2)) > 0)
);

-- ============================================================================
-- PROMOTE BRAND SECTION TABLE
-- ============================================================================

-- Create custom_exhibition_promote_brand table
CREATE TABLE IF NOT EXISTS custom_exhibition_promote_brand (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  title TEXT NOT NULL DEFAULT 'PROMOTE YOUR BRAND AND SERVICES',
  paragraph_1 TEXT NOT NULL DEFAULT 'Participating in a trade show is an appreciable approach to promoting your product & services. These events are a superb platform to make new clients, establish long-term business networks & study consumer behavior. Leading and skillful brands go for custom exhibition stands to step up their business & catch the eye of the visitors on the show floor.',
  paragraph_2 TEXT NOT NULL DEFAULT 'A custom-built exhibition stands design in Dubai is specifically crafted around your business aspirations & goals. Every element of these stands is manufactured to upgrade your brand image & meet your specific business requirements. These stands help you achieve your objectives and catch the convinced attention of the visitors.',
  paragraph_3 TEXT NOT NULL DEFAULT 'A custom exhibition booth makes you look different from other exhibitors & passes on the relevant brand message to the clients.',
  
  -- CTA Button
  cta_text TEXT NOT NULL DEFAULT 'Request Quotation',
  cta_url TEXT NOT NULL DEFAULT '#',
  
  -- Image
  image_id UUID REFERENCES custom_exhibition_images(id) ON DELETE SET NULL,
  image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  image_alt TEXT DEFAULT 'Promote your brand exhibition stand',
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  CONSTRAINT valid_title_promote CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_cta_text CHECK (length(trim(cta_text)) > 0)
);

-- ============================================================================
-- STRIKING CUSTOMIZED SECTION TABLE
-- ============================================================================

-- Create custom_exhibition_striking_customized table
CREATE TABLE IF NOT EXISTS custom_exhibition_striking_customized (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  title TEXT NOT NULL DEFAULT 'STRIKING CUSTOMIZED EXHIBITION STANDS',
  paragraph_1 TEXT NOT NULL DEFAULT 'Interactive displays and eye-catching designs will help you communicate your company''s message effectively and convincingly. From materials and colors, to dimensions, shapes and design, your display is completely tailored to your brand and business which allows you to present your services and products in the most effective and appealing manner possible.',
  paragraph_2 TEXT NOT NULL DEFAULT 'You can use our custom exhibit stands for various branding and exhibit needs, such as portable fitting rooms, entry spaces, custom workspaces, and pop-up stores. The distinctive stand designed by Chronicle creates an unforgettable impression on the people who visit your stand. As more than 50% of business decision makers would like sales representatives to visit their business following the event, you''ll need a stand to showcase your product in the best way possible. Our stand is distinct and appealing design which is sure to draw attention.',
  
  -- Image
  image_id UUID REFERENCES custom_exhibition_images(id) ON DELETE SET NULL,
  image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  image_alt TEXT DEFAULT 'Striking customized exhibition stands',
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  CONSTRAINT valid_title_striking CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_paragraph_1_striking CHECK (length(trim(paragraph_1)) > 0),
  CONSTRAINT valid_paragraph_2_striking CHECK (length(trim(paragraph_2)) > 0)
);

-- ============================================================================
-- REASONS TO CHOOSE SECTION TABLE
-- ============================================================================

-- Create custom_exhibition_reasons_to_choose table
CREATE TABLE IF NOT EXISTS custom_exhibition_reasons_to_choose (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Content
  title TEXT NOT NULL DEFAULT 'REASONS TO CHOOSE OUR CUSTOM EXHIBITION STAND SERVICES',
  paragraph_1 TEXT NOT NULL DEFAULT 'As your dedicated custom exhibition stand builder, we focus on combining creativity and functionality seamlessly. Our expert designers create stands that reflect your brand identity, ensuring a perfect balance of aesthetics and branding.',
  paragraph_2 TEXT NOT NULL DEFAULT 'Elevate your expo experience with our exceptional craftsmanship and attention to detail. Explore our services to discover why we are the most trusted provider of impressive custom trade show displays in the UAE.',
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  CONSTRAINT valid_title_reasons CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_paragraph_1_reasons CHECK (length(trim(paragraph_1)) > 0),
  CONSTRAINT valid_paragraph_2_reasons CHECK (length(trim(paragraph_2)) > 0)
);

-- ============================================================================
-- FAQ SECTION TABLES
-- ============================================================================

-- Create custom_exhibition_faq_section table
CREATE TABLE IF NOT EXISTS custom_exhibition_faq_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Content
  title TEXT NOT NULL DEFAULT 'FREQUENTLY ASKED QUESTION (FAQ)',

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Constraints
  CONSTRAINT valid_title_faq CHECK (length(trim(title)) > 0)
);

-- Create custom_exhibition_faq_items table
CREATE TABLE IF NOT EXISTS custom_exhibition_faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Content
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  list_items TEXT[], -- Array of list items for answers that need bullet points

  -- Ordering
  display_order INTEGER NOT NULL DEFAULT 1,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Constraints
  CONSTRAINT valid_question CHECK (length(trim(question)) > 0),
  CONSTRAINT valid_answer CHECK (length(trim(answer)) > 0),
  CONSTRAINT positive_display_order CHECK (display_order > 0),
  CONSTRAINT unique_display_order UNIQUE (display_order)
);

-- ============================================================================
-- LOOKING FOR STANDS SECTION TABLE
-- ============================================================================

-- Create custom_exhibition_looking_for_stands table
CREATE TABLE IF NOT EXISTS custom_exhibition_looking_for_stands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Content
  title TEXT NOT NULL DEFAULT 'LOOKING FOR CUSTOM EXHIBITION STANDS IN DUBAI',
  phone_number TEXT NOT NULL DEFAULT '+971543474645',
  phone_display TEXT NOT NULL DEFAULT 'Call +971 (543) 47-4645',
  cta_text TEXT NOT NULL DEFAULT 'or submit enquiry form below',

  -- Styling
  background_color TEXT NOT NULL DEFAULT '#a5cd39',

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Constraints
  CONSTRAINT valid_title_looking CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_phone_number CHECK (length(trim(phone_number)) > 0),
  CONSTRAINT valid_phone_display CHECK (length(trim(phone_display)) > 0),
  CONSTRAINT valid_cta_text_looking CHECK (length(trim(cta_text)) > 0),
  CONSTRAINT valid_background_color CHECK (length(trim(background_color)) > 0)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE custom_exhibition_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_exhibition_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_exhibition_leading_contractor ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_exhibition_promote_brand ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_exhibition_striking_customized ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_exhibition_reasons_to_choose ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_exhibition_faq_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_exhibition_faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_exhibition_looking_for_stands ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "custom_exhibition_images_public_read" ON custom_exhibition_images;
DROP POLICY IF EXISTS "custom_exhibition_hero_public_read" ON custom_exhibition_hero;
DROP POLICY IF EXISTS "custom_exhibition_leading_contractor_public_read" ON custom_exhibition_leading_contractor;
DROP POLICY IF EXISTS "custom_exhibition_promote_brand_public_read" ON custom_exhibition_promote_brand;
DROP POLICY IF EXISTS "custom_exhibition_striking_customized_public_read" ON custom_exhibition_striking_customized;
DROP POLICY IF EXISTS "custom_exhibition_reasons_to_choose_public_read" ON custom_exhibition_reasons_to_choose;
DROP POLICY IF EXISTS "custom_exhibition_faq_section_public_read" ON custom_exhibition_faq_section;
DROP POLICY IF EXISTS "custom_exhibition_faq_items_public_read" ON custom_exhibition_faq_items;
DROP POLICY IF EXISTS "custom_exhibition_looking_for_stands_public_read" ON custom_exhibition_looking_for_stands;

-- Public read policies for all tables
CREATE POLICY "custom_exhibition_images_public_read" ON custom_exhibition_images FOR SELECT TO public USING (true);
CREATE POLICY "custom_exhibition_hero_public_read" ON custom_exhibition_hero FOR SELECT TO public USING (true);
CREATE POLICY "custom_exhibition_leading_contractor_public_read" ON custom_exhibition_leading_contractor FOR SELECT TO public USING (true);
CREATE POLICY "custom_exhibition_promote_brand_public_read" ON custom_exhibition_promote_brand FOR SELECT TO public USING (true);
CREATE POLICY "custom_exhibition_striking_customized_public_read" ON custom_exhibition_striking_customized FOR SELECT TO public USING (true);
CREATE POLICY "custom_exhibition_reasons_to_choose_public_read" ON custom_exhibition_reasons_to_choose FOR SELECT TO public USING (true);
CREATE POLICY "custom_exhibition_faq_section_public_read" ON custom_exhibition_faq_section FOR SELECT TO public USING (true);
CREATE POLICY "custom_exhibition_faq_items_public_read" ON custom_exhibition_faq_items FOR SELECT TO public USING (true);
CREATE POLICY "custom_exhibition_looking_for_stands_public_read" ON custom_exhibition_looking_for_stands FOR SELECT TO public USING (true);

-- Drop existing authenticated write policies if they exist
DROP POLICY IF EXISTS "custom_exhibition_images_authenticated_write" ON custom_exhibition_images;
DROP POLICY IF EXISTS "custom_exhibition_hero_authenticated_write" ON custom_exhibition_hero;
DROP POLICY IF EXISTS "custom_exhibition_leading_contractor_authenticated_write" ON custom_exhibition_leading_contractor;
DROP POLICY IF EXISTS "custom_exhibition_promote_brand_authenticated_write" ON custom_exhibition_promote_brand;
DROP POLICY IF EXISTS "custom_exhibition_striking_customized_authenticated_write" ON custom_exhibition_striking_customized;
DROP POLICY IF EXISTS "custom_exhibition_reasons_to_choose_authenticated_write" ON custom_exhibition_reasons_to_choose;
DROP POLICY IF EXISTS "custom_exhibition_faq_section_authenticated_write" ON custom_exhibition_faq_section;
DROP POLICY IF EXISTS "custom_exhibition_faq_items_authenticated_write" ON custom_exhibition_faq_items;
DROP POLICY IF EXISTS "custom_exhibition_looking_for_stands_authenticated_write" ON custom_exhibition_looking_for_stands;

-- Authenticated write policies for all tables
CREATE POLICY "custom_exhibition_images_authenticated_write" ON custom_exhibition_images FOR ALL TO authenticated USING (true);
CREATE POLICY "custom_exhibition_hero_authenticated_write" ON custom_exhibition_hero FOR ALL TO authenticated USING (true);
CREATE POLICY "custom_exhibition_leading_contractor_authenticated_write" ON custom_exhibition_leading_contractor FOR ALL TO authenticated USING (true);
CREATE POLICY "custom_exhibition_promote_brand_authenticated_write" ON custom_exhibition_promote_brand FOR ALL TO authenticated USING (true);
CREATE POLICY "custom_exhibition_striking_customized_authenticated_write" ON custom_exhibition_striking_customized FOR ALL TO authenticated USING (true);
CREATE POLICY "custom_exhibition_reasons_to_choose_authenticated_write" ON custom_exhibition_reasons_to_choose FOR ALL TO authenticated USING (true);
CREATE POLICY "custom_exhibition_faq_section_authenticated_write" ON custom_exhibition_faq_section FOR ALL TO authenticated USING (true);
CREATE POLICY "custom_exhibition_faq_items_authenticated_write" ON custom_exhibition_faq_items FOR ALL TO authenticated USING (true);
CREATE POLICY "custom_exhibition_looking_for_stands_authenticated_write" ON custom_exhibition_looking_for_stands FOR ALL TO authenticated USING (true);

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
DROP TRIGGER IF EXISTS update_custom_exhibition_images_updated_at ON custom_exhibition_images;
DROP TRIGGER IF EXISTS update_custom_exhibition_hero_updated_at ON custom_exhibition_hero;
DROP TRIGGER IF EXISTS update_custom_exhibition_leading_contractor_updated_at ON custom_exhibition_leading_contractor;
DROP TRIGGER IF EXISTS update_custom_exhibition_promote_brand_updated_at ON custom_exhibition_promote_brand;
DROP TRIGGER IF EXISTS update_custom_exhibition_striking_customized_updated_at ON custom_exhibition_striking_customized;
DROP TRIGGER IF EXISTS update_custom_exhibition_reasons_to_choose_updated_at ON custom_exhibition_reasons_to_choose;
DROP TRIGGER IF EXISTS update_custom_exhibition_faq_section_updated_at ON custom_exhibition_faq_section;
DROP TRIGGER IF EXISTS update_custom_exhibition_faq_items_updated_at ON custom_exhibition_faq_items;
DROP TRIGGER IF EXISTS update_custom_exhibition_looking_for_stands_updated_at ON custom_exhibition_looking_for_stands;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_custom_exhibition_images_updated_at
    BEFORE UPDATE ON custom_exhibition_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_exhibition_hero_updated_at
    BEFORE UPDATE ON custom_exhibition_hero
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_exhibition_leading_contractor_updated_at
    BEFORE UPDATE ON custom_exhibition_leading_contractor
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_exhibition_promote_brand_updated_at
    BEFORE UPDATE ON custom_exhibition_promote_brand
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_exhibition_striking_customized_updated_at
    BEFORE UPDATE ON custom_exhibition_striking_customized
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_exhibition_reasons_to_choose_updated_at
    BEFORE UPDATE ON custom_exhibition_reasons_to_choose
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_exhibition_faq_section_updated_at
    BEFORE UPDATE ON custom_exhibition_faq_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_exhibition_faq_items_updated_at
    BEFORE UPDATE ON custom_exhibition_faq_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_exhibition_looking_for_stands_updated_at
    BEFORE UPDATE ON custom_exhibition_looking_for_stands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function to get all custom exhibition stands page data
CREATE OR REPLACE FUNCTION get_custom_exhibition_page_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'hero', (SELECT row_to_json(h) FROM custom_exhibition_hero h WHERE h.is_active = true LIMIT 1),
        'leading_contractor', (SELECT row_to_json(lc) FROM custom_exhibition_leading_contractor lc WHERE lc.is_active = true LIMIT 1),
        'promote_brand', (SELECT row_to_json(pb) FROM custom_exhibition_promote_brand pb WHERE pb.is_active = true LIMIT 1),
        'striking_customized', (SELECT row_to_json(sc) FROM custom_exhibition_striking_customized sc WHERE sc.is_active = true LIMIT 1),
        'reasons_to_choose', (SELECT row_to_json(rtc) FROM custom_exhibition_reasons_to_choose rtc WHERE rtc.is_active = true LIMIT 1),
        'faq_section', (SELECT row_to_json(fs) FROM custom_exhibition_faq_section fs WHERE fs.is_active = true LIMIT 1),
        'faq_items', (SELECT json_agg(row_to_json(fi) ORDER BY fi.display_order) FROM custom_exhibition_faq_items fi WHERE fi.is_active = true),
        'looking_for_stands', (SELECT row_to_json(lfs) FROM custom_exhibition_looking_for_stands lfs WHERE lfs.is_active = true LIMIT 1)
    ) INTO result;

    RETURN result;
END;
$$;

-- Function to get FAQ items with proper ordering
CREATE OR REPLACE FUNCTION get_custom_exhibition_faq_items()
RETURNS TABLE (
    id UUID,
    question TEXT,
    answer TEXT,
    list_items TEXT[],
    display_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        fi.id,
        fi.question,
        fi.answer,
        fi.list_items,
        fi.display_order
    FROM custom_exhibition_faq_items fi
    WHERE fi.is_active = true
    ORDER BY fi.display_order ASC;
END;
$$;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_custom_exhibition_images_section_type ON custom_exhibition_images(section_type);
CREATE INDEX IF NOT EXISTS idx_custom_exhibition_images_is_active ON custom_exhibition_images(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_exhibition_faq_items_display_order ON custom_exhibition_faq_items(display_order);
CREATE INDEX IF NOT EXISTS idx_custom_exhibition_faq_items_is_active ON custom_exhibition_faq_items(is_active);

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- Insert default hero section data
INSERT INTO custom_exhibition_hero (id, title, subtitle, background_image_url, background_image_alt, is_active)
VALUES (
    uuid_generate_v4(),
    'CUSTOM EXHIBITION STANDS',
    'Increase the value of your brand with Chronicle Exhibition Organizing LLC, the leading source for custom-designed exhibit stand solutions in the UAE. We create visually compelling exhibition displays. Our team of skilled designers work to custom exhibition stands that transform your appearance at exhibitions.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'Custom Exhibition Stands',
    true
) ON CONFLICT DO NOTHING;

-- Insert default leading contractor section data
INSERT INTO custom_exhibition_leading_contractor (id, title, paragraph_1, paragraph_2, is_active)
VALUES (
    uuid_generate_v4(),
    'LEADING CONTRACTOR FOR CUSTOM EXHIBITION STANDS',
    'The ultimate destination for bespoke, eye-catching, and innovative custom exhibition stands in Dubai that catapult your brand presence to new heights. Chronicle Exhibits is the leading provider of customized exhibition solutions in Dubai, we excel in crafting unforgettable experiences that catch the audiences and leave a lasting impression.',
    'At Custom Exhibition Stands, we recognize the uniqueness of every brand and commit ourselves to transforming your vision into reality. Whether you''re gearing up for a trade show, conference, or any other event, our team actively collaborate with you to conceive and construct tailor-made exhibition stands that mirror your brand identity and objectives.',
    true
) ON CONFLICT DO NOTHING;

-- Insert default promote brand section data
INSERT INTO custom_exhibition_promote_brand (id, title, paragraph_1, paragraph_2, paragraph_3, cta_text, cta_url, image_url, image_alt, is_active)
VALUES (
    uuid_generate_v4(),
    'PROMOTE YOUR BRAND AND SERVICES',
    'Participating in a trade show is an appreciable approach to promoting your product & services. These events are a superb platform to make new clients, establish long-term business networks & study consumer behavior. Leading and skillful brands go for custom exhibition stands to step up their business & catch the eye of the visitors on the show floor.',
    'A custom-built exhibition stands design in Dubai is specifically crafted around your business aspirations & goals. Every element of these stands is manufactured to upgrade your brand image & meet your specific business requirements. These stands help you achieve your objectives and catch the convinced attention of the visitors.',
    'A custom exhibition booth makes you look different from other exhibitors & passes on the relevant brand message to the clients.',
    'Request Quotation',
    '#',
    'https://images.unsplash.com/photo-1559223607-b4d0555ae227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'Promote your brand exhibition stand',
    true
) ON CONFLICT DO NOTHING;

-- Insert default striking customized section data
INSERT INTO custom_exhibition_striking_customized (id, title, paragraph_1, paragraph_2, image_url, image_alt, is_active)
VALUES (
    uuid_generate_v4(),
    'STRIKING CUSTOMIZED EXHIBITION STANDS',
    'Interactive displays and eye-catching designs will help you communicate your company''s message effectively and convincingly. From materials and colors, to dimensions, shapes and design, your display is completely tailored to your brand and business which allows you to present your services and products in the most effective and appealing manner possible.',
    'You can use our custom exhibit stands for various branding and exhibit needs, such as portable fitting rooms, entry spaces, custom workspaces, and pop-up stores. The distinctive stand designed by Chronicle creates an unforgettable impression on the people who visit your stand. As more than 50% of business decision makers would like sales representatives to visit their business following the event, you''ll need a stand to showcase your product in the best way possible. Our stand is distinct and appealing design which is sure to draw attention.',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'Striking customized exhibition stands',
    true
) ON CONFLICT DO NOTHING;

-- Insert default reasons to choose section data
INSERT INTO custom_exhibition_reasons_to_choose (id, title, paragraph_1, paragraph_2, is_active)
VALUES (
    uuid_generate_v4(),
    'REASONS TO CHOOSE OUR CUSTOM EXHIBITION STAND SERVICES',
    'As your dedicated custom exhibition stand builder, we focus on combining creativity and functionality seamlessly. Our expert designers create stands that reflect your brand identity, ensuring a perfect balance of aesthetics and branding.',
    'Elevate your expo experience with our exceptional craftsmanship and attention to detail. Explore our services to discover why we are the most trusted provider of impressive custom trade show displays in the UAE.',
    true
) ON CONFLICT DO NOTHING;

-- Insert default FAQ section data
INSERT INTO custom_exhibition_faq_section (id, title, is_active)
VALUES (
    uuid_generate_v4(),
    'FREQUENTLY ASKED QUESTION (FAQ)',
    true
) ON CONFLICT DO NOTHING;

-- Insert default FAQ items
INSERT INTO custom_exhibition_faq_items (id, question, answer, list_items, display_order, is_active)
VALUES
(
    uuid_generate_v4(),
    'What is the time it will take to create and construct an exhibition stand that is custom-designed?',
    'The time needed to create the custom display stand will depend on the dimensions and demands. The process of creating a custom display a skill; The method and plan for designing and constructing a custom display stand must be explained.',
    NULL,
    1,
    true
),
(
    uuid_generate_v4(),
    'Can I reuse my custom-designed exhibition stand in different shows?',
    'Yes, you can! There are many benefits to reuse of custom-designed exhibition stands at the upcoming shows in Europe the most significant is that it will make you cost. A lot of companies and brands both small and large continue to believe that purchasing disposable displays is the most effective option to make the perfect impression. Also, invest in reusable exhibit stands.',
    NULL,
    2,
    true
),
(
    uuid_generate_v4(),
    'What is the cost to employ an expert builder of exhibition stands?',
    'Cost of hiring an experienced builder of exhibition stands is contingent upon a variety of elements. However, Chronicle Exhibition offers cost-effective exhibition services.',
    NULL,
    3,
    true
),
(
    uuid_generate_v4(),
    'How can I measure the performance of my custom exhibit stand at an exhibition?',
    'Going to an exhibition can be costly. Expos are often a major amount of an organization''s budget, which can include travel expenses and exhibiting costs along with branding items, stand design and build. What is the best way to measure the ROI of your investment? Every brand is unique and a company''s worth of exhibiting may differ from other. But, in order to calculate his ROI from an show, here are a few indicators that can be used across all types of exhibitions:',
    ARRAY['The feedback from the visitor', 'Survey', 'ROI (ROI) Cost: Show the cost divided by the revenue that is generated.', 'Offers and Sales', 'After exhibit engagement', 'The result of the leads and contacts'],
    4,
    true
) ON CONFLICT DO NOTHING;

-- Insert default looking for stands section data
INSERT INTO custom_exhibition_looking_for_stands (id, title, phone_number, phone_display, cta_text, background_color, is_active)
VALUES (
    uuid_generate_v4(),
    'LOOKING FOR CUSTOM EXHIBITION STANDS IN DUBAI',
    '+971543474645',
    'Call +971 (543) 47-4645',
    'or submit enquiry form below',
    '#a5cd39',
    true
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- SCHEMA COMPLETION MESSAGE
-- ============================================================================

-- ✅ SCHEMA EXECUTION COMPLETE
--
-- Verify successful execution by checking:
-- 1. Storage bucket: SELECT * FROM storage.buckets WHERE id = 'custom-exhibition-images';
-- 2. Tables created: \dt custom_exhibition*
-- 3. Functions created: \df *custom_exhibition*
-- 4. Policies created: \dp custom_exhibition*
-- 5. Sample data: SELECT * FROM get_custom_exhibition_page_data();
--
-- The custom exhibition stands content management system is now ready for use!
--
-- Next steps:
-- 1. Create admin panel components for content management
-- 2. Update frontend components to fetch data from database
-- 3. Test image upload functionality
-- 4. Verify all sections display correctly
--
-- Note: All functions return data in JSON format for easy frontend consumption.
-- The admin panel can use individual table queries for CRUD operations.
