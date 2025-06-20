-- Event Management Services Schema
-- Complete database schema for the Event Management Services section
-- 
-- 🎯 PURPOSE: Dynamic content management for event management services section
-- 📊 TABLES: event_management_sections, event_management_images
-- 🗄️ STORAGE: event-management-images bucket
-- 🔒 SECURITY: RLS policies for public read, authenticated write
-- ⚡ PERFORMANCE: Proper indexing and constraints

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for event management images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-management-images', 'event-management-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- IMAGES TABLE (Created first to avoid circular dependency)
-- ============================================================================

-- Create event management images table
CREATE TABLE IF NOT EXISTS event_management_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- File Information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,

    -- Image Metadata
    alt_text TEXT DEFAULT 'Event management service image',
    width INTEGER,
    height INTEGER,

    -- Status and Organization
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT event_management_images_file_size_limit CHECK (file_size <= 10485760), -- 10MB limit
    CONSTRAINT event_management_images_mime_type_check CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')),
    CONSTRAINT event_management_images_filename_length CHECK (char_length(filename) >= 1),
    CONSTRAINT event_management_images_alt_text_length CHECK (char_length(alt_text) >= 3)
);

-- ============================================================================
-- MAIN CONTENT TABLE
-- ============================================================================

-- Create event management sections table
CREATE TABLE IF NOT EXISTS event_management_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Top Section Content
    main_heading TEXT NOT NULL DEFAULT 'EVENT MANAGEMENT SERVICES IN DUBAI, UAE',
    main_description TEXT NOT NULL DEFAULT 'We are licensed & skillful meeting & conference organizers in Dubai, creating unforgettable experiences through our calculated planning services. We plan all sorts of events in every city across the nation.',

    -- Bottom Section Content
    secondary_heading TEXT NOT NULL DEFAULT 'WIDE-SPECTRUM MEETING MANAGEMENT & CONFERENCE SERVICES',
    first_paragraph TEXT NOT NULL DEFAULT 'Being one of the leading Conference Organizing Companies in Dubai, we provide you with an effective plan of action after an in-depth analysis of your event needs & objectives. With years of experience as an event management and conference organizer, we plan your zero-sum corporate meetings attentively, ensuring you higher accuracy.',
    second_paragraph TEXT NOT NULL DEFAULT 'We offer a full-scale range of event management services covering every aspect of your event from planning to execution. We believe in providing prompt & high-quality conference organizing & management services.',

    -- Image Configuration (without foreign key constraint initially)
    main_image_id UUID,
    main_image_url TEXT,
    main_image_alt TEXT DEFAULT 'Conference meeting room with people',

    -- Status and Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT event_management_sections_main_heading_length CHECK (char_length(main_heading) >= 5),
    CONSTRAINT event_management_sections_main_description_length CHECK (char_length(main_description) >= 10)
);

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS (Added after both tables exist)
-- ============================================================================

-- Add foreign key constraint for main_image_id
ALTER TABLE event_management_sections
ADD CONSTRAINT fk_event_management_sections_main_image_id
FOREIGN KEY (main_image_id) REFERENCES event_management_images(id) ON DELETE SET NULL;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes for event_management_sections
CREATE INDEX IF NOT EXISTS idx_event_management_sections_active ON event_management_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_event_management_sections_created_at ON event_management_sections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_management_sections_main_image_id ON event_management_sections(main_image_id);

-- Indexes for event_management_images
CREATE INDEX IF NOT EXISTS idx_event_management_images_active ON event_management_images(is_active);
CREATE INDEX IF NOT EXISTS idx_event_management_images_created_at ON event_management_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_management_images_display_order ON event_management_images(display_order);
CREATE INDEX IF NOT EXISTS idx_event_management_images_file_path ON event_management_images(file_path);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_event_management_sections_updated_at ON event_management_sections;
CREATE TRIGGER update_event_management_sections_updated_at
    BEFORE UPDATE ON event_management_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_management_images_updated_at ON event_management_images;
CREATE TRIGGER update_event_management_images_updated_at
    BEFORE UPDATE ON event_management_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on both tables
ALTER TABLE event_management_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_management_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_management_sections
-- Public read access for active sections
CREATE POLICY "Public read access for active event management sections"
    ON event_management_sections FOR SELECT
    USING (is_active = true);

-- Authenticated users can read all sections
CREATE POLICY "Authenticated read access for event management sections"
    ON event_management_sections FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can insert sections
CREATE POLICY "Authenticated insert access for event management sections"
    ON event_management_sections FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update sections
CREATE POLICY "Authenticated update access for event management sections"
    ON event_management_sections FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete sections
CREATE POLICY "Authenticated delete access for event management sections"
    ON event_management_sections FOR DELETE
    TO authenticated
    USING (true);

-- RLS Policies for event_management_images
-- Public read access for all images (needed for display)
CREATE POLICY "Public read access for event management images"
    ON event_management_images FOR SELECT
    USING (true);

-- Authenticated users can insert images
CREATE POLICY "Authenticated insert access for event management images"
    ON event_management_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update images
CREATE POLICY "Authenticated update access for event management images"
    ON event_management_images FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete images
CREATE POLICY "Authenticated delete access for event management images"
    ON event_management_images FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Storage policies for event-management-images bucket
-- Public read access
CREATE POLICY "Public read access for event management images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'event-management-images');

-- Authenticated upload access
CREATE POLICY "Authenticated upload access for event management images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'event-management-images');

-- Authenticated update access
CREATE POLICY "Authenticated update access for event management images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'event-management-images')
    WITH CHECK (bucket_id = 'event-management-images');

-- Authenticated delete access
CREATE POLICY "Authenticated delete access for event management images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'event-management-images');

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function to get event management section with active image
CREATE OR REPLACE FUNCTION get_event_management_section_with_image()
RETURNS TABLE (
    id UUID,
    main_heading TEXT,
    main_description TEXT,
    secondary_heading TEXT,
    first_paragraph TEXT,
    second_paragraph TEXT,
    main_image_id UUID,
    main_image_url TEXT,
    main_image_alt TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    image_file_path TEXT,
    image_filename TEXT,
    image_alt_text TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ems.id,
    ems.main_heading,
    ems.main_description,
    ems.secondary_heading,
    ems.first_paragraph,
    ems.second_paragraph,
    ems.main_image_id,
    ems.main_image_url,
    ems.main_image_alt,
    ems.is_active,
    ems.created_at,
    ems.updated_at,
    emi.file_path as image_file_path,
    emi.filename as image_filename,
    emi.alt_text as image_alt_text
  FROM event_management_sections ems
  LEFT JOIN event_management_images emi ON ems.main_image_id = emi.id AND emi.is_active = true
  WHERE ems.is_active = true
  ORDER BY ems.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_event_management_section_with_image() TO public;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default event management section if none exists
INSERT INTO event_management_sections (
    main_heading,
    main_description,
    secondary_heading,
    first_paragraph,
    second_paragraph,
    main_image_url,
    main_image_alt,
    is_active
) 
SELECT 
    'EVENT MANAGEMENT SERVICES IN DUBAI, UAE',
    'We are licensed & skillful meeting & conference organizers in Dubai, creating unforgettable experiences through our calculated planning services. We plan all sorts of events in every city across the nation.',
    'WIDE-SPECTRUM MEETING MANAGEMENT & CONFERENCE SERVICES',
    'Being one of the leading Conference Organizing Companies in Dubai, we provide you with an effective plan of action after an in-depth analysis of your event needs & objectives. With years of experience as an event management and conference organizer, we plan your zero-sum corporate meetings attentively, ensuring you higher accuracy.',
    'We offer a full-scale range of event management services covering every aspect of your event from planning to execution. We believe in providing prompt & high-quality conference organizing & management services.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'Conference meeting room with people',
    true
WHERE NOT EXISTS (SELECT 1 FROM event_management_sections WHERE is_active = true);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('event_management_sections', 'event_management_images')
ORDER BY tablename;

-- Verify RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('event_management_sections', 'event_management_images')
ORDER BY tablename, policyname;

-- Verify initial data
SELECT 
    id,
    main_heading,
    is_active,
    created_at
FROM event_management_sections
ORDER BY created_at DESC;
