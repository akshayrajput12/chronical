-- ============================================================================
-- COMPLETE EVENTS MANAGEMENT SYSTEM - FULL DATABASE SCHEMA
-- ============================================================================
-- This is the complete, production-ready schema that includes:
-- - Original events management system
-- - Enhanced image management with library
-- - Rich content support with detailed descriptions
-- - Advanced gallery and media management
-- - Performance optimizations and security
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE STORAGE BUCKETS
-- ============================================================================

-- Create storage bucket for event images (featured, thumbnails, logos)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for event hero images (large background images)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-hero-images', 'event-hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for event gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-gallery-images', 'event-gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for event form attachments (private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-form-attachments', 'event-form-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: CREATE CORE TABLES
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
    detailed_description TEXT, -- Rich HTML content for detailed pages
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
    date_range TEXT,
    
    -- Images (legacy support - will be migrated to image_library)
    featured_image_url TEXT,
    hero_image_url TEXT,
    hero_image_credit TEXT, -- Image credit for hero image
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
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    created_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id)
);

-- Create image library table (centralized image management)
CREATE TABLE IF NOT EXISTS image_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- File Information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    
    -- Image Metadata
    title TEXT,
    alt_text TEXT DEFAULT 'Image',
    description TEXT,
    tags TEXT[],
    photographer TEXT,
    location TEXT,
    taken_date DATE,
    
    -- Dimensions and Variants
    width INTEGER,
    height INTEGER,
    thumbnail_url TEXT,
    medium_url TEXT,
    large_url TEXT,
    
    -- Organization
    category TEXT DEFAULT 'general', -- 'events', 'venues', 'people', 'products', 'general'
    bucket_name TEXT NOT NULL,
    folder_path TEXT,
    
    -- Usage Tracking
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    uploaded_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id)
);

-- Create event-image relationship table (many-to-many)
CREATE TABLE IF NOT EXISTS event_image_relations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Relationships
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    image_id UUID NOT NULL REFERENCES image_library(id) ON DELETE CASCADE,
    
    -- Relationship Metadata
    image_type TEXT NOT NULL DEFAULT 'gallery', -- 'featured', 'hero', 'logo', 'gallery', 'thumbnail'
    display_order INTEGER DEFAULT 0,
    caption TEXT,
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    added_by UUID REFERENCES admin_users(id),
    
    -- Ensure unique combination of event, image, and type
    UNIQUE(event_id, image_id, image_type)
);

-- Create events hero content table
CREATE TABLE IF NOT EXISTS events_hero (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Content
    title TEXT DEFAULT 'Upcoming Events',
    subtitle TEXT DEFAULT 'Discover amazing events happening around you',
    background_image_url TEXT,
    
    -- Styling
    overlay_opacity DECIMAL(3,2) DEFAULT 0.6,
    text_color TEXT DEFAULT '#ffffff',
    title_size TEXT DEFAULT 'large',
    
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
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    attachment_url TEXT,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    
    -- Status
    status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'spam'
    is_spam BOOLEAN DEFAULT false,
    spam_score DECIMAL(3,2) DEFAULT 0.0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Admin Notes
    admin_notes TEXT,
    handled_by UUID REFERENCES admin_users(id)
);

-- ============================================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Event categories indexes
CREATE INDEX IF NOT EXISTS idx_event_categories_active ON event_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_event_categories_order ON event_categories(display_order);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(published_at);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Image library indexes
CREATE INDEX IF NOT EXISTS idx_image_library_active ON image_library(is_active);
CREATE INDEX IF NOT EXISTS idx_image_library_public ON image_library(is_public);
CREATE INDEX IF NOT EXISTS idx_image_library_category ON image_library(category);
CREATE INDEX IF NOT EXISTS idx_image_library_bucket ON image_library(bucket_name);
CREATE INDEX IF NOT EXISTS idx_image_library_tags ON image_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_image_library_usage ON image_library(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_image_library_created ON image_library(created_at DESC);

-- Event image relations indexes
CREATE INDEX IF NOT EXISTS idx_event_image_relations_event ON event_image_relations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_image_relations_image ON event_image_relations(image_id);
CREATE INDEX IF NOT EXISTS idx_event_image_relations_type ON event_image_relations(image_type);
CREATE INDEX IF NOT EXISTS idx_event_image_relations_active ON event_image_relations(is_active);
CREATE INDEX IF NOT EXISTS idx_event_image_relations_order ON event_image_relations(display_order);

-- Form submissions indexes
CREATE INDEX IF NOT EXISTS idx_form_submissions_event ON event_form_submissions(event_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON event_form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created ON event_form_submissions(created_at DESC);

-- ============================================================================
-- STEP 4: CREATE TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_event_categories_updated_at BEFORE UPDATE ON event_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_image_library_updated_at BEFORE UPDATE ON image_library FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_image_relations_updated_at BEFORE UPDATE ON event_image_relations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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
('Automotive', 'automotive', 'Automotive industry events', '#f59e0b', 4),
('Fashion', 'fashion', 'Fashion and lifestyle events', '#ec4899', 5),
('Food & Beverage', 'food-beverage', 'Food and beverage industry events', '#10b981', 6),
('Construction', 'construction', 'Construction and building events', '#6b7280', 7),
('Education', 'education', 'Educational and training events', '#8b5cf6', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert default hero content
INSERT INTO events_hero (title, subtitle, background_image_url, is_active) VALUES
('Upcoming Events', 'Discover amazing events happening around you', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 6: CONTINUE IN NEXT FILE DUE TO LENGTH LIMIT
-- ============================================================================
