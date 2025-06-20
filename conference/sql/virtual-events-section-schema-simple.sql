-- Virtual Events Section Schema - Simple Step-by-Step Version
-- Use this file if the main schema file fails due to dependency issues
-- 
-- 🎯 PURPOSE: Step-by-step setup for virtual events section
-- 📊 APPROACH: Create each component separately to avoid circular dependencies
-- ✅ SAFE: Run each step individually if needed

-- ============================================================================
-- STEP 1: CREATE STORAGE BUCKET
-- ============================================================================

-- Create storage bucket for virtual events section images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('virtual-events-section-images', 'virtual-events-section-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: CREATE IMAGES TABLE FIRST (No dependencies)
-- ============================================================================

-- Create virtual events section images table
CREATE TABLE IF NOT EXISTS virtual_events_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- File Information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    
    -- Image Metadata
    alt_text TEXT DEFAULT 'Virtual conference and online meeting',
    width INTEGER,
    height INTEGER,
    
    -- Status and Organization
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT virtual_events_images_file_size_limit CHECK (file_size <= 10485760), -- 10MB limit
    CONSTRAINT virtual_events_images_mime_type_check CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')),
    CONSTRAINT virtual_events_images_filename_length CHECK (char_length(filename) >= 1),
    CONSTRAINT virtual_events_images_alt_text_length CHECK (char_length(alt_text) >= 3)
);

-- ============================================================================
-- STEP 3: CREATE SECTIONS TABLE (Without foreign key initially)
-- ============================================================================

-- Create virtual events sections table
CREATE TABLE IF NOT EXISTS virtual_events_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Section Content
    main_heading TEXT NOT NULL DEFAULT 'TROUBLE-FREE VIRTUAL EVENTS',
    first_paragraph TEXT NOT NULL DEFAULT 'Looking for eleventh-hour virtual meeting & conference solutions? Connect with us. The pandemic situation made online events really popular.',
    second_paragraph TEXT NOT NULL DEFAULT 'We being a notable name in the event management sector, create an impressive virtual environment allowing you to have a meaningful interaction.',
    third_paragraph TEXT NOT NULL DEFAULT 'We pay attention to everything including software, streaming, & participant support to ensure you a hassle-free experience.',
    
    -- Image Configuration (without foreign key constraint initially)
    main_image_id UUID,
    main_image_url TEXT,
    main_image_alt TEXT DEFAULT 'Virtual conference and online meeting',
    
    -- Status and Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT virtual_events_sections_main_heading_length CHECK (char_length(main_heading) >= 5),
    CONSTRAINT virtual_events_sections_first_paragraph_length CHECK (char_length(first_paragraph) >= 10),
    CONSTRAINT virtual_events_sections_second_paragraph_length CHECK (char_length(second_paragraph) >= 10),
    CONSTRAINT virtual_events_sections_third_paragraph_length CHECK (char_length(third_paragraph) >= 10)
);

-- ============================================================================
-- STEP 4: ADD FOREIGN KEY CONSTRAINT (After both tables exist)
-- ============================================================================

-- Add foreign key constraint for main_image_id
ALTER TABLE virtual_events_sections 
ADD CONSTRAINT fk_virtual_events_sections_main_image_id 
FOREIGN KEY (main_image_id) REFERENCES virtual_events_images(id) ON DELETE SET NULL;

-- ============================================================================
-- STEP 5: CREATE INDEXES
-- ============================================================================

-- Indexes for virtual_events_sections
CREATE INDEX IF NOT EXISTS idx_virtual_events_sections_active ON virtual_events_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_virtual_events_sections_created_at ON virtual_events_sections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_virtual_events_sections_main_image_id ON virtual_events_sections(main_image_id);

-- Indexes for virtual_events_images
CREATE INDEX IF NOT EXISTS idx_virtual_events_images_active ON virtual_events_images(is_active);
CREATE INDEX IF NOT EXISTS idx_virtual_events_images_created_at ON virtual_events_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_virtual_events_images_display_order ON virtual_events_images(display_order);
CREATE INDEX IF NOT EXISTS idx_virtual_events_images_file_path ON virtual_events_images(file_path);

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
DROP TRIGGER IF EXISTS update_virtual_events_sections_updated_at ON virtual_events_sections;
CREATE TRIGGER update_virtual_events_sections_updated_at
    BEFORE UPDATE ON virtual_events_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_virtual_events_images_updated_at ON virtual_events_images;
CREATE TRIGGER update_virtual_events_images_updated_at
    BEFORE UPDATE ON virtual_events_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 7: ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE virtual_events_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_events_images ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 8: CREATE RLS POLICIES FOR SECTIONS
-- ============================================================================

-- RLS Policies for virtual_events_sections
-- Public read access for active sections
CREATE POLICY "Public read access for active virtual events sections"
    ON virtual_events_sections FOR SELECT
    USING (is_active = true);

-- Authenticated users can read all sections
CREATE POLICY "Authenticated read access for virtual events sections"
    ON virtual_events_sections FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can insert sections
CREATE POLICY "Authenticated insert access for virtual events sections"
    ON virtual_events_sections FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update sections
CREATE POLICY "Authenticated update access for virtual events sections"
    ON virtual_events_sections FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete sections
CREATE POLICY "Authenticated delete access for virtual events sections"
    ON virtual_events_sections FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- STEP 9: CREATE RLS POLICIES FOR IMAGES
-- ============================================================================

-- RLS Policies for virtual_events_images
-- Public read access for all images (needed for display)
CREATE POLICY "Public read access for virtual events images"
    ON virtual_events_images FOR SELECT
    USING (true);

-- Authenticated users can insert images
CREATE POLICY "Authenticated insert access for virtual events images"
    ON virtual_events_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update images
CREATE POLICY "Authenticated update access for virtual events images"
    ON virtual_events_images FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete images
CREATE POLICY "Authenticated delete access for virtual events images"
    ON virtual_events_images FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- STEP 10: CREATE STORAGE POLICIES
-- ============================================================================

-- Storage policies for virtual-events-section-images bucket
-- Public read access
CREATE POLICY "Public read access for virtual events section images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'virtual-events-section-images');

-- Authenticated upload access
CREATE POLICY "Authenticated upload access for virtual events section images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'virtual-events-section-images');

-- Authenticated update access
CREATE POLICY "Authenticated update access for virtual events section images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'virtual-events-section-images')
    WITH CHECK (bucket_id = 'virtual-events-section-images');

-- Authenticated delete access
CREATE POLICY "Authenticated delete access for virtual events section images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'virtual-events-section-images');

-- ============================================================================
-- STEP 11: CREATE DATABASE FUNCTIONS
-- ============================================================================

-- Function to get virtual events section with active image
CREATE OR REPLACE FUNCTION get_virtual_events_section_with_image()
RETURNS TABLE (
    id UUID,
    main_heading TEXT,
    first_paragraph TEXT,
    second_paragraph TEXT,
    third_paragraph TEXT,
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
    ves.id,
    ves.main_heading,
    ves.first_paragraph,
    ves.second_paragraph,
    ves.third_paragraph,
    ves.main_image_id,
    ves.main_image_url,
    ves.main_image_alt,
    ves.is_active,
    ves.created_at,
    ves.updated_at,
    vei.file_path as image_file_path,
    vei.filename as image_filename,
    vei.alt_text as image_alt_text
  FROM virtual_events_sections ves
  LEFT JOIN virtual_events_images vei ON ves.main_image_id = vei.id AND vei.is_active = true
  WHERE ves.is_active = true
  ORDER BY ves.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_virtual_events_section_with_image() TO public;

-- ============================================================================
-- STEP 12: INSERT INITIAL DATA
-- ============================================================================

-- Insert default virtual events section if none exists
INSERT INTO virtual_events_sections (
    main_heading,
    first_paragraph,
    second_paragraph,
    third_paragraph,
    main_image_url,
    main_image_alt,
    is_active
) 
SELECT 
    'TROUBLE-FREE VIRTUAL EVENTS',
    'Looking for eleventh-hour virtual meeting & conference solutions? Connect with us. The pandemic situation made online events really popular.',
    'We being a notable name in the event management sector, create an impressive virtual environment allowing you to have a meaningful interaction.',
    'We pay attention to everything including software, streaming, & participant support to ensure you a hassle-free experience.',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'Virtual conference and online meeting',
    true
WHERE NOT EXISTS (SELECT 1 FROM virtual_events_sections WHERE is_active = true);

-- ============================================================================
-- STEP 13: VERIFICATION
-- ============================================================================

-- Verify table creation
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('virtual_events_sections', 'virtual_events_images')
ORDER BY tablename;

-- Verify RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('virtual_events_sections', 'virtual_events_images')
ORDER BY tablename, policyname;

-- Verify initial data
SELECT 
    id,
    main_heading,
    is_active,
    created_at
FROM virtual_events_sections
ORDER BY created_at DESC;

-- Verify storage bucket
SELECT 
    id,
    name,
    public
FROM storage.buckets 
WHERE id = 'virtual-events-section-images';

-- Test database function
SELECT * FROM get_virtual_events_section_with_image();

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT 'Virtual Events Section schema setup completed successfully!' as status;
