-- Blog System Schema for Supabase
-- This file contains the complete SQL schema for the dynamic blog system
-- 
-- ⚠️  SAFE TO RUN: This script only adds blog support, preserves existing data
-- 🎯 ADDS: Storage buckets, blog tables, categories, image management, functions
-- ✅ RESULT: Complete blog system with admin functionality and slug-based routing
--
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for blog featured images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-featured-images',
  'blog-featured-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- BLOG CATEGORIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#a5cd39',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- ============================================================================
-- BLOG POSTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Content fields
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  
  -- Media fields
  featured_image_url TEXT,
  featured_image_alt TEXT,
  hero_image_url TEXT,
  hero_image_alt TEXT,
  
  -- Status and visibility
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  
  -- SEO and social
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  
  -- Author and categorization
  author_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES blog_categories(id),
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  scheduled_publish_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- BLOG TAGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6b7280'
);

-- ============================================================================
-- BLOG POST TAGS JUNCTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_post_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  blog_tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  UNIQUE(blog_post_id, blog_tag_id)
);

-- ============================================================================
-- BLOG IMAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- File information
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  
  -- Metadata
  alt_text TEXT,
  caption TEXT,
  
  -- Relationships
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured);

-- Blog categories indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_active ON blog_categories(is_active);

-- Blog tags indexes
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);

-- Blog post tags indexes
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post ON blog_post_tags(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag ON blog_post_tags(blog_tag_id);

-- Blog images indexes
CREATE INDEX IF NOT EXISTS idx_blog_images_post ON blog_images(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_images_active ON blog_images(is_active);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_images_updated_at BEFORE UPDATE ON blog_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_blog_slug(title_text TEXT, post_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Generate base slug from title
    base_slug := lower(trim(regexp_replace(title_text, '[^a-zA-Z0-9\s]', '', 'g')));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := trim(base_slug, '-');
    
    -- Ensure slug is not empty
    IF base_slug = '' THEN
        base_slug := 'blog-post';
    END IF;
    
    final_slug := base_slug;
    
    -- Check for uniqueness and increment if needed
    WHILE EXISTS (
        SELECT 1 FROM blog_posts 
        WHERE slug = final_slug 
        AND (post_id IS NULL OR id != post_id)
    ) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to get published blog posts with pagination
CREATE OR REPLACE FUNCTION get_published_blog_posts(
    page_size INTEGER DEFAULT 10,
    page_offset INTEGER DEFAULT 0,
    filter_category_slug TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    featured_image_alt TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category_name TEXT,
    category_slug TEXT,
    category_color TEXT,
    view_count INTEGER,
    tags TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.featured_image_url,
        bp.featured_image_alt,
        bp.published_at,
        bc.name as category_name,
        bc.slug as category_slug,
        bc.color as category_color,
        bp.view_count,
        COALESCE(
            ARRAY(
                SELECT bt.name
                FROM blog_post_tags bpt
                JOIN blog_tags bt ON bpt.blog_tag_id = bt.id
                WHERE bpt.blog_post_id = bp.id
                ORDER BY bt.name
            ),
            ARRAY[]::TEXT[]
        ) as tags
    FROM blog_posts bp
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id
    WHERE bp.status = 'published'
    AND bp.published_at <= NOW()
    AND (filter_category_slug IS NULL OR bc.slug = filter_category_slug)
    ORDER BY bp.published_at DESC
    LIMIT page_size OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get blog post by slug with enhanced data
CREATE OR REPLACE FUNCTION get_blog_post_by_slug(post_slug TEXT)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    content TEXT,
    excerpt TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    featured_image_url TEXT,
    featured_image_alt TEXT,
    hero_image_url TEXT,
    hero_image_alt TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    author_id UUID,
    category_name TEXT,
    category_slug TEXT,
    category_color TEXT,
    view_count INTEGER,
    tags TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.content,
        bp.excerpt,
        bp.meta_description,
        bp.meta_keywords,
        bp.featured_image_url,
        bp.featured_image_alt,
        bp.hero_image_url,
        bp.hero_image_alt,
        bp.og_title,
        bp.og_description,
        bp.og_image_url,
        bp.published_at,
        bp.updated_at,
        bp.created_at,
        bp.author_id,
        bc.name as category_name,
        bc.slug as category_slug,
        bc.color as category_color,
        bp.view_count,
        COALESCE(
            ARRAY(
                SELECT bt.name
                FROM blog_post_tags bpt
                JOIN blog_tags bt ON bpt.blog_tag_id = bt.id
                WHERE bpt.blog_post_id = bp.id
                ORDER BY bt.name
            ),
            ARRAY[]::TEXT[]
        ) as tags
    FROM blog_posts bp
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id
    WHERE bp.slug = post_slug
    AND bp.status = 'published'
    AND bp.published_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get blog images for a post
CREATE OR REPLACE FUNCTION get_blog_post_images(post_id UUID)
RETURNS TABLE (
    id UUID,
    filename TEXT,
    file_path TEXT,
    alt_text TEXT,
    caption TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bi.id,
        bi.filename,
        bi.file_path,
        bi.alt_text,
        bi.caption,
        bi.width,
        bi.height,
        bi.file_size,
        bi.mime_type,
        bi.created_at
    FROM blog_images bi
    WHERE bi.blog_post_id = post_id
    AND bi.is_active = true
    ORDER BY bi.created_at;
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE blog_posts
    SET view_count = view_count + 1
    WHERE slug = post_slug
    AND status = 'published';
END;
$$ LANGUAGE plpgsql;

-- Function to get related blog posts
CREATE OR REPLACE FUNCTION get_related_blog_posts(current_post_id UUID, limit_count INTEGER DEFAULT 3)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    featured_image_alt TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category_name TEXT,
    category_slug TEXT,
    category_color TEXT,
    view_count INTEGER,
    tags TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.featured_image_url,
        bp.featured_image_alt,
        bp.published_at,
        bc.name as category_name,
        bc.slug as category_slug,
        bc.color as category_color,
        bp.view_count,
        COALESCE(
            ARRAY(
                SELECT bt.name
                FROM blog_post_tags bpt
                JOIN blog_tags bt ON bpt.blog_tag_id = bt.id
                WHERE bpt.blog_post_id = bp.id
                ORDER BY bt.name
            ),
            ARRAY[]::TEXT[]
        ) as tags
    FROM blog_posts bp
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id
    WHERE bp.id != current_post_id
    AND bp.status = 'published'
    AND bp.published_at <= NOW()
    AND (
        -- Same category
        bp.category_id = (SELECT category_id FROM blog_posts WHERE id = current_post_id)
        OR
        -- Shared tags
        EXISTS (
            SELECT 1 FROM blog_post_tags bpt1
            JOIN blog_post_tags bpt2 ON bpt1.blog_tag_id = bpt2.blog_tag_id
            WHERE bpt1.blog_post_id = bp.id
            AND bpt2.blog_post_id = current_post_id
        )
    )
    ORDER BY
        -- Prioritize same category
        CASE WHEN bp.category_id = (SELECT category_id FROM blog_posts WHERE id = current_post_id) THEN 1 ELSE 2 END,
        bp.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- BLOG CATEGORIES POLICIES
-- ============================================================================

-- Public read access for active categories
CREATE POLICY "Public can view active blog categories"
ON blog_categories FOR SELECT
USING (is_active = true);

-- Admin full access to categories
CREATE POLICY "Authenticated users can manage blog categories"
ON blog_categories FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================================================
-- BLOG POSTS POLICIES
-- ============================================================================

-- Public read access for published posts
CREATE POLICY "Public can view published blog posts"
ON blog_posts FOR SELECT
USING (status = 'published' AND published_at <= NOW());

-- Admin full access to all posts
CREATE POLICY "Authenticated users can manage all blog posts"
ON blog_posts FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================================================
-- BLOG TAGS POLICIES
-- ============================================================================

-- Public read access to tags
CREATE POLICY "Public can view blog tags"
ON blog_tags FOR SELECT
USING (true);

-- Admin full access to tags
CREATE POLICY "Authenticated users can manage blog tags"
ON blog_tags FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================================================
-- BLOG POST TAGS POLICIES
-- ============================================================================

-- Public read access to post-tag relationships
CREATE POLICY "Public can view blog post tags"
ON blog_post_tags FOR SELECT
USING (true);

-- Admin full access to post-tag relationships
CREATE POLICY "Authenticated users can manage blog post tags"
ON blog_post_tags FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================================================
-- BLOG IMAGES POLICIES
-- ============================================================================

-- Public read access to active images
CREATE POLICY "Public can view active blog images"
ON blog_images FOR SELECT
USING (is_active = true);

-- Admin full access to images
CREATE POLICY "Authenticated users can manage blog images"
ON blog_images FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Blog images bucket policies
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Blog featured images bucket policies
CREATE POLICY "Public can view blog featured images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-featured-images');

CREATE POLICY "Authenticated users can upload blog featured images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-featured-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog featured images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-featured-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog featured images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-featured-images' AND auth.role() = 'authenticated');

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color, sort_order) VALUES
('Business', 'business', 'Business and industry news', '#3b82f6', 1),
('Events', 'events', 'Event announcements and coverage', '#10b981', 2),
('Technology', 'technology', 'Technology and innovation updates', '#8b5cf6', 3),
('Hospitality', 'hospitality', 'Hospitality industry insights', '#f59e0b', 4),
('Press Release', 'press-release', 'Official press releases', '#ef4444', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert default blog tags
INSERT INTO blog_tags (name, slug, color) VALUES
('Exhibition', 'exhibition', '#a5cd39'),
('Conference', 'conference', '#3b82f6'),
('Innovation', 'innovation', '#8b5cf6'),
('Dubai', 'dubai', '#f59e0b'),
('DWTC', 'dwtc', '#ef4444'),
('Industry', 'industry', '#10b981'),
('Networking', 'networking', '#6366f1'),
('Business', 'business', '#ec4899')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'blog_%';

-- Verify storage buckets were created
-- SELECT * FROM storage.buckets WHERE id IN ('blog-images', 'blog-featured-images');

-- Verify sample data was inserted
-- SELECT * FROM blog_categories WHERE is_active = true ORDER BY sort_order;
-- SELECT * FROM blog_tags ORDER BY name;

-- Test the database functions
-- SELECT * FROM get_published_blog_posts(5, 0);

-- ============================================================================
-- SCHEMA EXECUTION COMPLETE
-- ============================================================================

-- ✅ SCHEMA EXECUTION COMPLETE
--
-- Verify successful execution by checking:
-- 1. Storage buckets: SELECT * FROM storage.buckets WHERE id LIKE 'blog-%';
-- 2. Tables created: \dt blog_*
-- 3. Functions created: \df *blog*
-- 4. Policies created: \dp blog_*
--
-- The blog management system is now ready for use!
--
-- Next steps:
-- 1. Test blog creation through the admin panel
-- 2. Verify frontend integration with the blog components
-- 3. Ensure Next.js domains are configured for your Supabase project URL
--
-- Note: The functions return file paths, not full URLs.
-- The frontend components construct the full Supabase URLs using the storage client.
