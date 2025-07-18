-- ============================================================================
-- EVENTS PORTFOLIO SCHEMA
-- ============================================================================
-- This schema manages events portfolio images for the "Check Out Our Latest Events Portfolio" section
-- Created: 2025-07-18
-- Purpose: Store and manage events portfolio images with admin upload functionality

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for events portfolio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'events-portfolio-images',
  'events-portfolio-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Allow public read access to events portfolio images
CREATE POLICY "Public can view events portfolio images" ON storage.objects
  FOR SELECT USING (bucket_id = 'events-portfolio-images');

-- Allow authenticated users (admins) to upload events portfolio images
CREATE POLICY "Authenticated users can upload events portfolio images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'events-portfolio-images');

-- Allow authenticated users (admins) to update events portfolio images
CREATE POLICY "Authenticated users can update events portfolio images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'events-portfolio-images');

-- Allow authenticated users (admins) to delete events portfolio images
CREATE POLICY "Authenticated users can delete events portfolio images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'events-portfolio-images');

-- ============================================================================
-- MAIN TABLE
-- ============================================================================

-- Create events_portfolio_images table
CREATE TABLE IF NOT EXISTS events_portfolio_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- File Information
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  
  -- Image Metadata
  title TEXT NOT NULL,
  description TEXT,
  alt_text TEXT NOT NULL,
  caption TEXT,
  
  -- Event Information
  event_name TEXT,
  event_date DATE,
  event_location TEXT,
  event_type TEXT, -- 'conference', 'exhibition', 'trade_show', 'corporate', 'other'
  
  -- Display Settings
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- SEO and Tags
  tags TEXT[], -- Array of tags for filtering
  seo_keywords TEXT,
  
  -- Admin Management
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_filename CHECK (length(trim(filename)) > 0),
  CONSTRAINT valid_original_filename CHECK (length(trim(original_filename)) > 0),
  CONSTRAINT valid_file_path CHECK (length(trim(file_path)) > 0),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 52428800), -- 50MB max
  CONSTRAINT valid_title CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_alt_text CHECK (length(trim(alt_text)) > 0),
  CONSTRAINT valid_display_order CHECK (display_order >= 0),
  CONSTRAINT valid_dimensions CHECK (
    (width IS NULL AND height IS NULL) OR 
    (width > 0 AND height > 0)
  ),
  CONSTRAINT valid_event_type CHECK (
    event_type IS NULL OR 
    event_type IN ('conference', 'exhibition', 'trade_show', 'corporate', 'other')
  )
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for active images ordered by display_order
CREATE INDEX IF NOT EXISTS idx_events_portfolio_images_active_order 
ON events_portfolio_images (is_active, display_order, created_at DESC) 
WHERE is_active = true;

-- Index for featured images
CREATE INDEX IF NOT EXISTS idx_events_portfolio_images_featured 
ON events_portfolio_images (is_featured, display_order) 
WHERE is_featured = true AND is_active = true;

-- Index for event type filtering
CREATE INDEX IF NOT EXISTS idx_events_portfolio_images_event_type 
ON events_portfolio_images (event_type, is_active, display_order);

-- Index for admin management queries
CREATE INDEX IF NOT EXISTS idx_events_portfolio_images_admin 
ON events_portfolio_images (uploaded_by, created_at DESC);

-- Index for file path lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_portfolio_images_file_path 
ON events_portfolio_images (file_path);

-- Index for tags (GIN index for array operations)
CREATE INDEX IF NOT EXISTS idx_events_portfolio_images_tags 
ON events_portfolio_images USING GIN (tags);

-- Index for text search
CREATE INDEX IF NOT EXISTS idx_events_portfolio_images_search 
ON events_portfolio_images USING GIN (
  to_tsvector('english', 
    COALESCE(title, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(event_name, '') || ' ' || 
    COALESCE(event_location, '')
  )
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_events_portfolio_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_events_portfolio_images_updated_at
  BEFORE UPDATE ON events_portfolio_images
  FOR EACH ROW
  EXECUTE FUNCTION update_events_portfolio_images_updated_at();

-- Trigger to auto-generate alt_text if not provided
CREATE OR REPLACE FUNCTION auto_generate_alt_text_events_portfolio()
RETURNS TRIGGER AS $$
BEGIN
  -- If alt_text is empty, generate from title and event_name
  IF NEW.alt_text IS NULL OR trim(NEW.alt_text) = '' THEN
    NEW.alt_text = COALESCE(NEW.title, 'Events portfolio image');
    IF NEW.event_name IS NOT NULL AND trim(NEW.event_name) != '' THEN
      NEW.alt_text = NEW.alt_text || ' - ' || NEW.event_name;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_alt_text_events_portfolio
  BEFORE INSERT OR UPDATE ON events_portfolio_images
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_alt_text_events_portfolio();

-- Trigger to manage display_order automatically
CREATE OR REPLACE FUNCTION manage_events_portfolio_display_order()
RETURNS TRIGGER AS $$
BEGIN
  -- If display_order is 0 or not set, set it to max + 1
  IF NEW.display_order = 0 OR NEW.display_order IS NULL THEN
    SELECT COALESCE(MAX(display_order), 0) + 1 
    INTO NEW.display_order 
    FROM events_portfolio_images 
    WHERE is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_manage_events_portfolio_display_order
  BEFORE INSERT ON events_portfolio_images
  FOR EACH ROW
  EXECUTE FUNCTION manage_events_portfolio_display_order();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE events_portfolio_images ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to active images
CREATE POLICY "Public can view active events portfolio images" ON events_portfolio_images
  FOR SELECT USING (is_active = true);

-- Policy for authenticated users (admins) to manage all images
CREATE POLICY "Authenticated users can manage events portfolio images" ON events_portfolio_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get active events portfolio images
CREATE OR REPLACE FUNCTION get_active_events_portfolio_images(
  limit_count INTEGER DEFAULT NULL,
  offset_count INTEGER DEFAULT 0,
  event_type_filter TEXT DEFAULT NULL,
  featured_only BOOLEAN DEFAULT false
)
RETURNS TABLE (
  id UUID,
  filename TEXT,
  original_filename TEXT,
  file_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  title TEXT,
  description TEXT,
  alt_text TEXT,
  caption TEXT,
  event_name TEXT,
  event_date DATE,
  event_location TEXT,
  event_type TEXT,
  is_featured BOOLEAN,
  display_order INTEGER,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    epi.id,
    epi.filename,
    epi.original_filename,
    epi.file_path,
    epi.file_size,
    epi.mime_type,
    epi.width,
    epi.height,
    epi.title,
    epi.description,
    epi.alt_text,
    epi.caption,
    epi.event_name,
    epi.event_date,
    epi.event_location,
    epi.event_type,
    epi.is_featured,
    epi.display_order,
    epi.tags,
    epi.created_at,
    epi.updated_at
  FROM events_portfolio_images epi
  WHERE epi.is_active = true
    AND (event_type_filter IS NULL OR epi.event_type = event_type_filter)
    AND (featured_only = false OR epi.is_featured = true)
  ORDER BY epi.display_order ASC, epi.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reorder events portfolio images
CREATE OR REPLACE FUNCTION reorder_events_portfolio_images(
  image_ids UUID[],
  new_orders INTEGER[]
)
RETURNS BOOLEAN AS $$
DECLARE
  i INTEGER;
BEGIN
  -- Validate input arrays have same length
  IF array_length(image_ids, 1) != array_length(new_orders, 1) THEN
    RETURN false;
  END IF;

  -- Update display orders
  FOR i IN 1..array_length(image_ids, 1) LOOP
    UPDATE events_portfolio_images
    SET display_order = new_orders[i], updated_at = NOW()
    WHERE id = image_ids[i] AND is_active = true;
  END LOOP;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle featured status
CREATE OR REPLACE FUNCTION toggle_events_portfolio_featured(image_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_featured BOOLEAN;
BEGIN
  -- Get current featured status
  SELECT is_featured INTO current_featured
  FROM events_portfolio_images
  WHERE id = image_id AND is_active = true;

  IF current_featured IS NULL THEN
    RETURN false;
  END IF;

  -- Toggle featured status
  UPDATE events_portfolio_images
  SET is_featured = NOT current_featured, updated_at = NOW()
  WHERE id = image_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search events portfolio images
CREATE OR REPLACE FUNCTION search_events_portfolio_images(
  search_term TEXT,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  event_name TEXT,
  event_location TEXT,
  file_path TEXT,
  alt_text TEXT,
  is_featured BOOLEAN,
  display_order INTEGER,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    epi.id,
    epi.title,
    epi.description,
    epi.event_name,
    epi.event_location,
    epi.file_path,
    epi.alt_text,
    epi.is_featured,
    epi.display_order,
    ts_rank(
      to_tsvector('english',
        COALESCE(epi.title, '') || ' ' ||
        COALESCE(epi.description, '') || ' ' ||
        COALESCE(epi.event_name, '') || ' ' ||
        COALESCE(epi.event_location, '')
      ),
      plainto_tsquery('english', search_term)
    ) as rank
  FROM events_portfolio_images epi
  WHERE epi.is_active = true
    AND to_tsvector('english',
      COALESCE(epi.title, '') || ' ' ||
      COALESCE(epi.description, '') || ' ' ||
      COALESCE(epi.event_name, '') || ' ' ||
      COALESCE(epi.event_location, '')
    ) @@ plainto_tsquery('english', search_term)
  ORDER BY rank DESC, epi.display_order ASC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get portfolio statistics
CREATE OR REPLACE FUNCTION get_events_portfolio_stats()
RETURNS TABLE (
  total_images INTEGER,
  active_images INTEGER,
  featured_images INTEGER,
  total_size_bytes BIGINT,
  event_types_count JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_images,
    COUNT(*) FILTER (WHERE is_active = true)::INTEGER as active_images,
    COUNT(*) FILTER (WHERE is_featured = true AND is_active = true)::INTEGER as featured_images,
    COALESCE(SUM(file_size), 0)::BIGINT as total_size_bytes,
    json_object_agg(
      COALESCE(event_type, 'unspecified'),
      type_count
    ) as event_types_count
  FROM events_portfolio_images epi
  LEFT JOIN (
    SELECT
      COALESCE(event_type, 'unspecified') as event_type,
      COUNT(*) as type_count
    FROM events_portfolio_images
    WHERE is_active = true
    GROUP BY COALESCE(event_type, 'unspecified')
  ) type_counts ON true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE events_portfolio_images IS 'Stores events portfolio images for the "Check Out Our Latest Events Portfolio" section';
COMMENT ON COLUMN events_portfolio_images.is_featured IS 'Whether the image should be prominently displayed';
COMMENT ON COLUMN events_portfolio_images.display_order IS 'Order in which images are displayed (lower numbers first)';
COMMENT ON COLUMN events_portfolio_images.event_type IS 'Type of event: conference, exhibition, trade_show, corporate, other';
COMMENT ON COLUMN events_portfolio_images.tags IS 'Array of tags for filtering and categorization';
COMMENT ON FUNCTION get_active_events_portfolio_images IS 'Retrieves active portfolio images with optional filtering';
COMMENT ON FUNCTION reorder_events_portfolio_images IS 'Updates display order for multiple images';
COMMENT ON FUNCTION search_events_portfolio_images IS 'Full-text search across portfolio images';
