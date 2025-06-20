-- Event Management Services Schema - Simple Version
-- Run this if the main schema file has issues
-- Execute each section separately in Supabase SQL Editor

-- ============================================================================
-- STEP 1: CREATE STORAGE BUCKET
-- ============================================================================

-- Create storage bucket for event management images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-management-images', 'event-management-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: CREATE IMAGES TABLE FIRST
-- ============================================================================

-- Create event management images table
CREATE TABLE IF NOT EXISTS event_management_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    alt_text TEXT DEFAULT 'Event management service image',
    width INTEGER,
    height INTEGER,
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraints to images table
ALTER TABLE event_management_images 
ADD CONSTRAINT event_management_images_file_size_limit 
CHECK (file_size <= 10485760);

ALTER TABLE event_management_images 
ADD CONSTRAINT event_management_images_mime_type_check 
CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp'));

-- ============================================================================
-- STEP 3: CREATE SECTIONS TABLE
-- ============================================================================

-- Create event management sections table
CREATE TABLE IF NOT EXISTS event_management_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    main_heading TEXT NOT NULL DEFAULT 'EVENT MANAGEMENT SERVICES IN DUBAI, UAE',
    main_description TEXT NOT NULL DEFAULT 'We are licensed & skillful meeting & conference organizers in Dubai, creating unforgettable experiences through our calculated planning services. We plan all sorts of events in every city across the nation.',
    secondary_heading TEXT NOT NULL DEFAULT 'WIDE-SPECTRUM MEETING MANAGEMENT & CONFERENCE SERVICES',
    first_paragraph TEXT NOT NULL DEFAULT 'Being one of the leading Conference Organizing Companies in Dubai, we provide you with an effective plan of action after an in-depth analysis of your event needs & objectives. With years of experience as an event management and conference organizer, we plan your zero-sum corporate meetings attentively, ensuring you higher accuracy.',
    second_paragraph TEXT NOT NULL DEFAULT 'We offer a full-scale range of event management services covering every aspect of your event from planning to execution. We believe in providing prompt & high-quality conference organizing & management services.',
    main_image_id UUID,
    main_image_url TEXT,
    main_image_alt TEXT DEFAULT 'Conference meeting room with people',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraints to sections table
ALTER TABLE event_management_sections 
ADD CONSTRAINT event_management_sections_main_heading_length 
CHECK (char_length(main_heading) >= 5);

ALTER TABLE event_management_sections 
ADD CONSTRAINT event_management_sections_main_description_length 
CHECK (char_length(main_description) >= 10);

-- ============================================================================
-- STEP 4: ADD FOREIGN KEY CONSTRAINT
-- ============================================================================

-- Add foreign key constraint
ALTER TABLE event_management_sections 
ADD CONSTRAINT fk_event_management_sections_main_image_id 
FOREIGN KEY (main_image_id) REFERENCES event_management_images(id) ON DELETE SET NULL;

-- ============================================================================
-- STEP 5: CREATE INDEXES
-- ============================================================================

-- Indexes for event_management_sections
CREATE INDEX IF NOT EXISTS idx_event_management_sections_active 
ON event_management_sections(is_active);

CREATE INDEX IF NOT EXISTS idx_event_management_sections_created_at 
ON event_management_sections(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_management_sections_main_image_id 
ON event_management_sections(main_image_id);

-- Indexes for event_management_images
CREATE INDEX IF NOT EXISTS idx_event_management_images_active 
ON event_management_images(is_active);

CREATE INDEX IF NOT EXISTS idx_event_management_images_created_at 
ON event_management_images(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_management_images_file_path 
ON event_management_images(file_path);

-- ============================================================================
-- STEP 6: CREATE TRIGGERS
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
-- STEP 7: ENABLE RLS
-- ============================================================================

-- Enable RLS on both tables
ALTER TABLE event_management_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_management_images ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 8: CREATE RLS POLICIES FOR SECTIONS
-- ============================================================================

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

-- ============================================================================
-- STEP 9: CREATE RLS POLICIES FOR IMAGES
-- ============================================================================

-- Public read access for all images
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
-- STEP 10: CREATE STORAGE POLICIES
-- ============================================================================

-- Storage policies for event-management-images bucket
CREATE POLICY "Public read access for event management images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'event-management-images');

CREATE POLICY "Authenticated upload access for event management images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'event-management-images');

CREATE POLICY "Authenticated update access for event management images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'event-management-images')
    WITH CHECK (bucket_id = 'event-management-images');

CREATE POLICY "Authenticated delete access for event management images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'event-management-images');

-- ============================================================================
-- STEP 11: INSERT INITIAL DATA
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
-- STEP 12: VERIFICATION
-- ============================================================================

-- Verify table creation
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('event_management_sections', 'event_management_images')
ORDER BY tablename;

-- Verify initial data
SELECT 
    id,
    main_heading,
    is_active,
    created_at
FROM event_management_sections
ORDER BY created_at DESC;
