-- ============================================================================
-- EVENTS MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This schema creates a comprehensive events management system with:
-- - Events with categories, images, and gallery
-- - Hero section management
-- - Form submissions tracking
-- - Storage buckets and policies
-- - Database functions for complex queries
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE STORAGE BUCKETS
-- ============================================================================

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for event hero images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-hero-images', 'event-hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for event gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-gallery-images', 'event-gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: CREATE TABLES
-- ============================================================================

-- Create event categories table
CREATE TABLE IF NOT EXISTS event_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Category Information
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#22c55e',
    
    -- Status and Organization
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    created_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Information
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    
    -- Event Details
    category_id UUID REFERENCES event_categories(id) ON DELETE SET NULL,
    organizer TEXT,
    organized_by TEXT,
    venue TEXT,
    event_type TEXT,
    industry TEXT,
    audience TEXT,
    
    -- Date and Time
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    date_range TEXT, -- For display purposes
    
    -- Images
    featured_image_url TEXT,
    hero_image_url TEXT,
    logo_image_url TEXT,
    logo_text TEXT,
    logo_subtext TEXT,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    
    -- Status and Organization
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id)
);

-- Create event images table (for additional event images)
CREATE TABLE IF NOT EXISTS event_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Event Reference
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    -- File Information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    
    -- Image Metadata
    alt_text TEXT DEFAULT 'Event image',
    caption TEXT,
    width INTEGER,
    height INTEGER,
    
    -- Status and Organization
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    image_type TEXT DEFAULT 'gallery', -- 'gallery', 'featured', 'hero', 'logo'
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    uploaded_by UUID REFERENCES admin_users(id)
);

-- Create events hero section table
CREATE TABLE IF NOT EXISTS events_hero (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Content
    main_heading TEXT NOT NULL DEFAULT 'Welcome to Dubai World Trade Centre',
    sub_heading TEXT DEFAULT 'Dubai''s epicentre for events and business in the heart of the city',
    
    -- Background
    background_image_url TEXT,
    background_overlay_opacity DECIMAL(3,2) DEFAULT 0.30,
    background_overlay_color TEXT DEFAULT '#000000',
    
    -- Styling
    text_color TEXT DEFAULT '#ffffff',
    heading_font_size TEXT DEFAULT 'responsive', -- 'small', 'medium', 'large', 'responsive'
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    created_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id)
);

-- Create event form submissions table
CREATE TABLE IF NOT EXISTS event_form_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Event Reference
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    -- Form Data
    name TEXT NOT NULL,
    exhibition_name TEXT,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    budget TEXT,
    message TEXT,
    
    -- File Upload
    attachment_url TEXT,
    attachment_filename TEXT,
    attachment_size BIGINT,
    
    -- Status
    status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
    is_spam BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    referrer TEXT
);

-- ============================================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Event categories indexes
CREATE INDEX IF NOT EXISTS idx_event_categories_active ON event_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_event_categories_order ON event_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_event_categories_slug ON event_categories(slug);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(published_at);

-- Event images indexes
CREATE INDEX IF NOT EXISTS idx_event_images_event ON event_images(event_id);
CREATE INDEX IF NOT EXISTS idx_event_images_active ON event_images(is_active);
CREATE INDEX IF NOT EXISTS idx_event_images_type ON event_images(image_type);
CREATE INDEX IF NOT EXISTS idx_event_images_order ON event_images(display_order);

-- Form submissions indexes
CREATE INDEX IF NOT EXISTS idx_form_submissions_event ON event_form_submissions(event_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON event_form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created ON event_form_submissions(created_at);

-- ============================================================================
-- STEP 4: CREATE TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_event_categories_updated_at BEFORE UPDATE ON event_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_images_updated_at BEFORE UPDATE ON event_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_hero_updated_at BEFORE UPDATE ON events_hero FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_form_submissions_updated_at BEFORE UPDATE ON event_form_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 5: INSERT DEFAULT DATA
-- ============================================================================

-- Insert default event categories
INSERT INTO event_categories (name, slug, description, color, display_order) VALUES
('Consumer Goods', 'consumer-goods', 'Consumer goods and retail events', '#22c55e', 1),
('Technology', 'technology', 'Technology and innovation events', '#3b82f6', 2),
('Healthcare', 'healthcare', 'Healthcare and medical events', '#ef4444', 3),
('Education', 'education', 'Education and training events', '#f59e0b', 4),
('Business', 'business', 'Business and networking events', '#8b5cf6', 5),
('Trade Shows', 'trade-shows', 'Trade shows and exhibitions', '#06b6d4', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert default hero content
INSERT INTO events_hero (main_heading, sub_heading, is_active) VALUES
('Welcome to Dubai World Trade Centre', 'Dubai''s epicentre for events and business in the heart of the city', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 6: CREATE STORAGE POLICIES
-- ============================================================================

-- Event images bucket policies
CREATE POLICY "Public read access for event images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'event-images'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update event images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'event-images'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete event images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'event-images'
    AND auth.role() = 'authenticated'
);

-- Event hero images bucket policies
CREATE POLICY "Public read access for event hero images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-hero-images');

CREATE POLICY "Authenticated users can upload event hero images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'event-hero-images'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update event hero images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'event-hero-images'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete event hero images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'event-hero-images'
    AND auth.role() = 'authenticated'
);

-- Event gallery images bucket policies
CREATE POLICY "Public read access for event gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-gallery-images');

CREATE POLICY "Authenticated users can upload event gallery images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'event-gallery-images'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update event gallery images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'event-gallery-images'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete event gallery images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'event-gallery-images'
    AND auth.role() = 'authenticated'
);

-- ============================================================================
-- STEP 7: CREATE ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE events_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_form_submissions ENABLE ROW LEVEL SECURITY;

-- Event categories policies
CREATE POLICY "Public read access for active event categories" ON event_categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage event categories" ON event_categories
FOR ALL USING (auth.role() = 'authenticated');

-- Events policies
CREATE POLICY "Public read access for active events" ON events
FOR SELECT USING (is_active = true AND published_at IS NOT NULL);

CREATE POLICY "Authenticated users can manage events" ON events
FOR ALL USING (auth.role() = 'authenticated');

-- Event images policies
CREATE POLICY "Public read access for active event images" ON event_images
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage event images" ON event_images
FOR ALL USING (auth.role() = 'authenticated');

-- Events hero policies
CREATE POLICY "Public read access for active hero content" ON events_hero
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage hero content" ON events_hero
FOR ALL USING (auth.role() = 'authenticated');

-- Event form submissions policies
CREATE POLICY "Authenticated users can manage form submissions" ON event_form_submissions
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can insert form submissions" ON event_form_submissions
FOR INSERT WITH CHECK (true);

-- ============================================================================
-- STEP 8: CREATE DATABASE FUNCTIONS
-- ============================================================================

-- Function to get events with category information
CREATE OR REPLACE FUNCTION get_events_with_categories(
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0,
    p_category_slug TEXT DEFAULT NULL,
    p_is_featured BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    description TEXT,
    short_description TEXT,
    organizer TEXT,
    organized_by TEXT,
    venue TEXT,
    event_type TEXT,
    industry TEXT,
    audience TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    date_range TEXT,
    featured_image_url TEXT,
    hero_image_url TEXT,
    logo_image_url TEXT,
    logo_text TEXT,
    logo_subtext TEXT,
    is_active BOOLEAN,
    is_featured BOOLEAN,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    category_name TEXT,
    category_slug TEXT,
    category_color TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.slug,
        e.description,
        e.short_description,
        e.organizer,
        e.organized_by,
        e.venue,
        e.event_type,
        e.industry,
        e.audience,
        e.start_date,
        e.end_date,
        e.date_range,
        e.featured_image_url,
        e.hero_image_url,
        e.logo_image_url,
        e.logo_text,
        e.logo_subtext,
        e.is_active,
        e.is_featured,
        e.display_order,
        e.created_at,
        e.updated_at,
        e.published_at,
        ec.name as category_name,
        ec.slug as category_slug,
        ec.color as category_color
    FROM events e
    LEFT JOIN event_categories ec ON e.category_id = ec.id
    WHERE
        e.is_active = true
        AND e.published_at IS NOT NULL
        AND (p_category_slug IS NULL OR ec.slug = p_category_slug)
        AND (p_is_featured IS NULL OR e.is_featured = p_is_featured)
    ORDER BY
        e.display_order ASC,
        e.start_date ASC,
        e.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get related events (excluding current event)
CREATE OR REPLACE FUNCTION get_related_events(
    p_event_id UUID,
    p_limit INTEGER DEFAULT 3
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    short_description TEXT,
    featured_image_url TEXT,
    date_range TEXT,
    category_name TEXT,
    category_slug TEXT,
    category_color TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.slug,
        e.short_description,
        e.featured_image_url,
        e.date_range,
        ec.name as category_name,
        ec.slug as category_slug,
        ec.color as category_color
    FROM events e
    LEFT JOIN event_categories ec ON e.category_id = ec.id
    WHERE
        e.is_active = true
        AND e.published_at IS NOT NULL
        AND e.id != p_event_id
        AND e.category_id = (
            SELECT category_id FROM events WHERE id = p_event_id
        )
    ORDER BY
        e.start_date ASC,
        e.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get event statistics
CREATE OR REPLACE FUNCTION get_event_statistics()
RETURNS TABLE (
    total_events BIGINT,
    active_events BIGINT,
    featured_events BIGINT,
    total_categories BIGINT,
    active_categories BIGINT,
    total_submissions BIGINT,
    new_submissions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM events) as total_events,
        (SELECT COUNT(*) FROM events WHERE is_active = true) as active_events,
        (SELECT COUNT(*) FROM events WHERE is_featured = true AND is_active = true) as featured_events,
        (SELECT COUNT(*) FROM event_categories) as total_categories,
        (SELECT COUNT(*) FROM event_categories WHERE is_active = true) as active_categories,
        (SELECT COUNT(*) FROM event_form_submissions) as total_submissions,
        (SELECT COUNT(*) FROM event_form_submissions WHERE status = 'new') as new_submissions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search events
CREATE OR REPLACE FUNCTION search_events(
    p_search_term TEXT,
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    description TEXT,
    short_description TEXT,
    featured_image_url TEXT,
    date_range TEXT,
    category_name TEXT,
    category_slug TEXT,
    category_color TEXT,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.slug,
        e.description,
        e.short_description,
        e.featured_image_url,
        e.date_range,
        ec.name as category_name,
        ec.slug as category_slug,
        ec.color as category_color,
        (
            CASE
                WHEN e.title ILIKE '%' || p_search_term || '%' THEN 3.0
                ELSE 0.0
            END +
            CASE
                WHEN e.description ILIKE '%' || p_search_term || '%' THEN 2.0
                ELSE 0.0
            END +
            CASE
                WHEN e.organizer ILIKE '%' || p_search_term || '%' THEN 1.5
                ELSE 0.0
            END +
            CASE
                WHEN e.venue ILIKE '%' || p_search_term || '%' THEN 1.0
                ELSE 0.0
            END +
            CASE
                WHEN ec.name ILIKE '%' || p_search_term || '%' THEN 1.0
                ELSE 0.0
            END
        ) as relevance_score
    FROM events e
    LEFT JOIN event_categories ec ON e.category_id = ec.id
    WHERE
        e.is_active = true
        AND e.published_at IS NOT NULL
        AND (
            e.title ILIKE '%' || p_search_term || '%' OR
            e.description ILIKE '%' || p_search_term || '%' OR
            e.organizer ILIKE '%' || p_search_term || '%' OR
            e.venue ILIKE '%' || p_search_term || '%' OR
            ec.name ILIKE '%' || p_search_term || '%'
        )
    ORDER BY
        relevance_score DESC,
        e.start_date ASC,
        e.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get upcoming events
CREATE OR REPLACE FUNCTION get_upcoming_events(
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    short_description TEXT,
    featured_image_url TEXT,
    date_range TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    category_name TEXT,
    category_color TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.slug,
        e.short_description,
        e.featured_image_url,
        e.date_range,
        e.start_date,
        ec.name as category_name,
        ec.color as category_color
    FROM events e
    LEFT JOIN event_categories ec ON e.category_id = ec.id
    WHERE
        e.is_active = true
        AND e.published_at IS NOT NULL
        AND (e.start_date IS NULL OR e.start_date >= NOW())
    ORDER BY
        e.start_date ASC NULLS LAST,
        e.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 9: CREATE SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================================================

-- Insert sample events (uncomment to use)

INSERT INTO events (
    title, slug, description, short_description, category_id, organizer, organized_by,
    venue, event_type, industry, audience, date_range, featured_image_url,
    hero_image_url, logo_image_url, logo_text, logo_subtext, is_active, is_featured, published_at
) VALUES
(
    'Concept Big Brands Carnival - CBBC',
    'concept-big-brands-carnival-cbbc',
    'The CBBC brand with heritage celebrates deals, showcasing over 200 fashion and luxury brands with discounts of upto 70%.',
    'Fashion and luxury brands carnival with up to 70% discounts',
    (SELECT id FROM event_categories WHERE slug = 'consumer-goods'),
    'EXCELLENT BRANDS LLC',
    'GENERAL TRADING',
    'SHEIKH MAKTOUM HALL',
    'BRAND SALE',
    'CONSUMER GOODS',
    'PUBLIC',
    '24 MAY - 1 JUN 2025',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    '/event-logo.jpg',
    'CBBC',
    'Big Brands Carnival',
    true,
    true,
    NOW()
);


-- ============================================================================
-- SCHEMA SETUP COMPLETE
-- ============================================================================
--
-- This schema provides:
-- ✅ Complete events management system
-- ✅ Categories with hierarchical organization
-- ✅ Image management with multiple types
-- ✅ Hero section management
-- ✅ Form submissions tracking
-- ✅ Storage buckets with proper policies
-- ✅ Row Level Security (RLS) policies
-- ✅ Database functions for complex queries
-- ✅ Performance indexes
-- ✅ Automatic timestamp updates
-- ✅ Sample data structure
--
-- Next Steps:
-- 1. Run this schema in Supabase SQL Editor
-- 2. Create TypeScript interfaces
-- 3. Build admin interfaces
-- 4. Create API routes
-- 5. Convert frontend components to dynamic
-- ============================================================================
