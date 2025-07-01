-- ============================================================================
-- EVENTS SCHEMA ENHANCEMENTS
-- ============================================================================
-- This file contains enhancements to the existing events schema:
-- - Add detailed_description field for rich content
-- - Enhance event_images table with more metadata
-- - Add image browser functionality
-- - Create functions for image management
-- ============================================================================

-- ============================================================================
-- STEP 1: ADD DETAILED DESCRIPTION FIELD TO EVENTS
-- ============================================================================

-- Add detailed_description field for rich text content (separate from basic description)
ALTER TABLE events ADD COLUMN IF NOT EXISTS detailed_description TEXT;

-- Add comment to clarify the difference between description fields
COMMENT ON COLUMN events.description IS 'Basic text description for listings and previews';
COMMENT ON COLUMN events.detailed_description IS 'Rich HTML content for detailed event page sections';

-- ============================================================================
-- STEP 2: ENHANCE EVENT_IMAGES TABLE
-- ============================================================================

-- Add additional metadata fields to event_images table
ALTER TABLE event_images ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE event_images ADD COLUMN IF NOT EXISTS photographer TEXT;
ALTER TABLE event_images ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE event_images ADD COLUMN IF NOT EXISTS event_date DATE;
ALTER TABLE event_images ADD COLUMN IF NOT EXISTS is_featured_in_gallery BOOLEAN DEFAULT false;
ALTER TABLE event_images ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE event_images ADD COLUMN IF NOT EXISTS medium_url TEXT;
ALTER TABLE event_images ADD COLUMN IF NOT EXISTS large_url TEXT;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_event_images_featured_gallery ON event_images(is_featured_in_gallery);
CREATE INDEX IF NOT EXISTS idx_event_images_tags ON event_images USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_event_images_event_date ON event_images(event_date);

-- ============================================================================
-- STEP 3: CREATE IMAGE LIBRARY TABLE
-- ============================================================================

-- Create a global image library for reusable images across events
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

-- Create indexes for image library
CREATE INDEX IF NOT EXISTS idx_image_library_active ON image_library(is_active);
CREATE INDEX IF NOT EXISTS idx_image_library_public ON image_library(is_public);
CREATE INDEX IF NOT EXISTS idx_image_library_category ON image_library(category);
CREATE INDEX IF NOT EXISTS idx_image_library_bucket ON image_library(bucket_name);
CREATE INDEX IF NOT EXISTS idx_image_library_tags ON image_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_image_library_usage ON image_library(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_image_library_created ON image_library(created_at DESC);

-- Enable RLS on image library
ALTER TABLE image_library ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for image library
CREATE POLICY "Public read access for active public images" ON image_library
FOR SELECT USING (is_active = true AND is_public = true);

CREATE POLICY "Authenticated users can manage images" ON image_library
FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_image_library_updated_at 
BEFORE UPDATE ON image_library 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 4: CREATE EVENT-IMAGE RELATIONSHIP TABLE
-- ============================================================================

-- Create junction table for event-image relationships (many-to-many)
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

-- Create indexes for event-image relations
CREATE INDEX IF NOT EXISTS idx_event_image_relations_event ON event_image_relations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_image_relations_image ON event_image_relations(image_id);
CREATE INDEX IF NOT EXISTS idx_event_image_relations_type ON event_image_relations(image_type);
CREATE INDEX IF NOT EXISTS idx_event_image_relations_active ON event_image_relations(is_active);
CREATE INDEX IF NOT EXISTS idx_event_image_relations_order ON event_image_relations(display_order);

-- Enable RLS
ALTER TABLE event_image_relations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access for active event image relations" ON event_image_relations
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage event image relations" ON event_image_relations
FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_event_image_relations_updated_at 
BEFORE UPDATE ON event_image_relations 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 5: CREATE ENHANCED FUNCTIONS
-- ============================================================================

-- Function to get event with all images
CREATE OR REPLACE FUNCTION get_event_with_images(p_event_id UUID)
RETURNS TABLE (
    -- Event data
    id UUID,
    title TEXT,
    slug TEXT,
    description TEXT,
    detailed_description TEXT,
    short_description TEXT,
    category_name TEXT,
    category_color TEXT,
    organizer TEXT,
    venue TEXT,
    date_range TEXT,
    is_active BOOLEAN,
    
    -- Images data
    featured_image JSON,
    hero_image JSON,
    logo_image JSON,
    gallery_images JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.slug,
        e.description,
        e.detailed_description,
        e.short_description,
        ec.name as category_name,
        ec.color as category_color,
        e.organizer,
        e.venue,
        e.date_range,
        e.is_active,
        
        -- Featured image
        (SELECT row_to_json(img_data) FROM (
            SELECT il.id, il.file_path, il.alt_text, il.title, il.width, il.height
            FROM event_image_relations eir
            JOIN image_library il ON eir.image_id = il.id
            WHERE eir.event_id = e.id AND eir.image_type = 'featured' AND eir.is_active = true
            ORDER BY eir.display_order
            LIMIT 1
        ) img_data) as featured_image,
        
        -- Hero image
        (SELECT row_to_json(img_data) FROM (
            SELECT il.id, il.file_path, il.alt_text, il.title, il.width, il.height
            FROM event_image_relations eir
            JOIN image_library il ON eir.image_id = il.id
            WHERE eir.event_id = e.id AND eir.image_type = 'hero' AND eir.is_active = true
            ORDER BY eir.display_order
            LIMIT 1
        ) img_data) as hero_image,
        
        -- Logo image
        (SELECT row_to_json(img_data) FROM (
            SELECT il.id, il.file_path, il.alt_text, il.title, il.width, il.height
            FROM event_image_relations eir
            JOIN image_library il ON eir.image_id = il.id
            WHERE eir.event_id = e.id AND eir.image_type = 'logo' AND eir.is_active = true
            ORDER BY eir.display_order
            LIMIT 1
        ) img_data) as logo_image,
        
        -- Gallery images
        (SELECT json_agg(img_data ORDER BY display_order) FROM (
            SELECT 
                il.id, 
                il.file_path, 
                il.alt_text, 
                il.title, 
                il.width, 
                il.height,
                il.thumbnail_url,
                il.medium_url,
                il.large_url,
                eir.caption,
                eir.display_order
            FROM event_image_relations eir
            JOIN image_library il ON eir.image_id = il.id
            WHERE eir.event_id = e.id AND eir.image_type = 'gallery' AND eir.is_active = true
            ORDER BY eir.display_order
        ) img_data) as gallery_images
        
    FROM events e
    LEFT JOIN event_categories ec ON e.category_id = ec.id
    WHERE e.id = p_event_id AND e.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search images in library
CREATE OR REPLACE FUNCTION search_image_library(
    p_search_term TEXT DEFAULT NULL,
    p_category TEXT DEFAULT NULL,
    p_tags TEXT[] DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    filename TEXT,
    file_path TEXT,
    title TEXT,
    alt_text TEXT,
    description TEXT,
    tags TEXT[],
    category TEXT,
    width INTEGER,
    height INTEGER,
    thumbnail_url TEXT,
    medium_url TEXT,
    file_size BIGINT,
    usage_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        il.id,
        il.filename,
        il.file_path,
        il.title,
        il.alt_text,
        il.description,
        il.tags,
        il.category,
        il.width,
        il.height,
        il.thumbnail_url,
        il.medium_url,
        il.file_size,
        il.usage_count,
        il.created_at
    FROM image_library il
    WHERE 
        il.is_active = true 
        AND il.is_public = true
        AND (p_search_term IS NULL OR (
            il.title ILIKE '%' || p_search_term || '%' OR
            il.description ILIKE '%' || p_search_term || '%' OR
            il.filename ILIKE '%' || p_search_term || '%' OR
            il.alt_text ILIKE '%' || p_search_term || '%'
        ))
        AND (p_category IS NULL OR il.category = p_category)
        AND (p_tags IS NULL OR il.tags && p_tags)
    ORDER BY 
        il.usage_count DESC,
        il.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment image usage
CREATE OR REPLACE FUNCTION increment_image_usage(p_image_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE image_library 
    SET 
        usage_count = usage_count + 1,
        last_used_at = NOW()
    WHERE id = p_image_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ENHANCEMENT COMPLETE
-- ============================================================================
