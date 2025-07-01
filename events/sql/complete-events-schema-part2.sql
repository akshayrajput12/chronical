-- ============================================================================
-- COMPLETE EVENTS MANAGEMENT SYSTEM - PART 2
-- ============================================================================
-- This file continues from complete-events-schema.sql and includes:
-- - Storage policies and RLS
-- - Advanced database functions
-- - Search and analytics functions
-- ============================================================================

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

-- Event form attachments bucket policies (private)
CREATE POLICY "Authenticated users can upload form attachments" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'event-form-attachments'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can access form attachments" ON storage.objects
FOR SELECT USING (
    bucket_id = 'event-form-attachments'
    AND auth.role() = 'authenticated'
);

-- ============================================================================
-- STEP 7: ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_image_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_form_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 8: CREATE RLS POLICIES
-- ============================================================================

-- Event categories policies
CREATE POLICY "Public read access for active event categories" ON event_categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage event categories" ON event_categories
FOR ALL USING (auth.role() = 'authenticated');

-- Events policies
CREATE POLICY "Public read access for published events" ON events
FOR SELECT USING (is_active = true AND published_at IS NOT NULL);

CREATE POLICY "Authenticated users can manage events" ON events
FOR ALL USING (auth.role() = 'authenticated');

-- Image library policies
CREATE POLICY "Public read access for active public images" ON image_library
FOR SELECT USING (is_active = true AND is_public = true);

CREATE POLICY "Authenticated users can manage images" ON image_library
FOR ALL USING (auth.role() = 'authenticated');

-- Event image relations policies
CREATE POLICY "Public read access for active event image relations" ON event_image_relations
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage event image relations" ON event_image_relations
FOR ALL USING (auth.role() = 'authenticated');

-- Events hero policies
CREATE POLICY "Public read access for active hero content" ON events_hero
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage hero content" ON events_hero
FOR ALL USING (auth.role() = 'authenticated');

-- Form submissions policies
CREATE POLICY "Authenticated users can manage form submissions" ON event_form_submissions
FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- STEP 9: CREATE ADVANCED DATABASE FUNCTIONS
-- ============================================================================

-- Function to get events with category information
CREATE OR REPLACE FUNCTION get_events_with_categories(
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0,
    p_category_id UUID DEFAULT NULL,
    p_is_featured BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    description TEXT,
    detailed_description TEXT,
    short_description TEXT,
    organizer TEXT,
    organized_by TEXT,
    venue TEXT,
    date_range TEXT,
    featured_image_url TEXT,
    hero_image_url TEXT,
    logo_image_url TEXT,
    logo_text TEXT,
    logo_subtext TEXT,
    is_featured BOOLEAN,
    published_at TIMESTAMP WITH TIME ZONE,
    category_name TEXT,
    category_color TEXT,
    category_slug TEXT
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
        e.organizer,
        e.organized_by,
        e.venue,
        e.date_range,
        e.featured_image_url,
        e.hero_image_url,
        e.logo_image_url,
        e.logo_text,
        e.logo_subtext,
        e.is_featured,
        e.published_at,
        ec.name as category_name,
        ec.color as category_color,
        ec.slug as category_slug
    FROM events e
    LEFT JOIN event_categories ec ON e.category_id = ec.id
    WHERE 
        e.is_active = true 
        AND e.published_at IS NOT NULL
        AND (p_category_id IS NULL OR e.category_id = p_category_id)
        AND (p_is_featured IS NULL OR e.is_featured = p_is_featured)
        AND (ec.is_active = true OR ec.is_active IS NULL)
    ORDER BY 
        e.is_featured DESC,
        e.published_at DESC,
        e.display_order ASC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
-- SCHEMA COMPLETE - READY FOR PRODUCTION USE
-- ============================================================================
