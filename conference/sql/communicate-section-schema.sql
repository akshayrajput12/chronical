-- Communicate Section Schema
-- Complete database schema for the Communicate Section of the conference page
-- 
-- 🎯 PURPOSE: Dynamic content management for communicate section
-- 📊 TABLES: communicate_sections, communicate_images
-- 🗄️ STORAGE: communicate-section-images bucket
-- 🔒 SECURITY: RLS policies for public read, authenticated write
-- ⚡ PERFORMANCE: Proper indexing and constraints

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for communicate section images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('communicate-section-images', 'communicate-section-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- IMAGES TABLE (Created first to avoid circular dependency)
-- ============================================================================

-- Create communicate section images table
CREATE TABLE IF NOT EXISTS communicate_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- File Information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    
    -- Image Metadata
    alt_text TEXT DEFAULT 'Professional conference presentation',
    width INTEGER,
    height INTEGER,
    
    -- Status and Organization
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT communicate_images_file_size_limit CHECK (file_size <= 10485760), -- 10MB limit
    CONSTRAINT communicate_images_mime_type_check CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')),
    CONSTRAINT communicate_images_filename_length CHECK (char_length(filename) >= 1),
    CONSTRAINT communicate_images_alt_text_length CHECK (char_length(alt_text) >= 3)
);

-- ============================================================================
-- MAIN CONTENT TABLE
-- ============================================================================

-- Create communicate sections table
CREATE TABLE IF NOT EXISTS communicate_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Section Content
    main_heading TEXT NOT NULL DEFAULT 'COMMUNICATE TO PROFICIENT MEETING & CONFERENCE PLANNERS',
    company_name TEXT NOT NULL DEFAULT 'Chronicle Exhibition Organizing LLC',
    first_paragraph TEXT NOT NULL DEFAULT 'is one of the most well-liked event organizing & management companies in Dubai & UAE. We as conference organizers in Dubai, UAE have a close-knit & active team of dedicated professionals capable of planning & executing corporate meetings & events successfully.',
    second_paragraph TEXT NOT NULL DEFAULT 'Our event management experts are packed with innovative ideas & are there for your continuous support.',
    
    -- Image Configuration (without foreign key constraint initially)
    main_image_id UUID,
    main_image_url TEXT,
    main_image_alt TEXT DEFAULT 'Professional conference presentation',
    
    -- Status and Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT communicate_sections_main_heading_length CHECK (char_length(main_heading) >= 5),
    CONSTRAINT communicate_sections_company_name_length CHECK (char_length(company_name) >= 3),
    CONSTRAINT communicate_sections_first_paragraph_length CHECK (char_length(first_paragraph) >= 10),
    CONSTRAINT communicate_sections_second_paragraph_length CHECK (char_length(second_paragraph) >= 10)
);

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS (Added after both tables exist)
-- ============================================================================

-- Add foreign key constraint for main_image_id
ALTER TABLE communicate_sections 
ADD CONSTRAINT fk_communicate_sections_main_image_id 
FOREIGN KEY (main_image_id) REFERENCES communicate_images(id) ON DELETE SET NULL;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes for communicate_sections
CREATE INDEX IF NOT EXISTS idx_communicate_sections_active ON communicate_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_communicate_sections_created_at ON communicate_sections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_communicate_sections_main_image_id ON communicate_sections(main_image_id);

-- Indexes for communicate_images
CREATE INDEX IF NOT EXISTS idx_communicate_images_active ON communicate_images(is_active);
CREATE INDEX IF NOT EXISTS idx_communicate_images_created_at ON communicate_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_communicate_images_display_order ON communicate_images(display_order);
CREATE INDEX IF NOT EXISTS idx_communicate_images_file_path ON communicate_images(file_path);

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
DROP TRIGGER IF EXISTS update_communicate_sections_updated_at ON communicate_sections;
CREATE TRIGGER update_communicate_sections_updated_at
    BEFORE UPDATE ON communicate_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_communicate_images_updated_at ON communicate_images;
CREATE TRIGGER update_communicate_images_updated_at
    BEFORE UPDATE ON communicate_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE communicate_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE communicate_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for communicate_sections
-- Public read access for active sections
CREATE POLICY "Public read access for active communicate sections"
    ON communicate_sections FOR SELECT
    USING (is_active = true);

-- Authenticated users can read all sections
CREATE POLICY "Authenticated read access for communicate sections"
    ON communicate_sections FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can insert sections
CREATE POLICY "Authenticated insert access for communicate sections"
    ON communicate_sections FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update sections
CREATE POLICY "Authenticated update access for communicate sections"
    ON communicate_sections FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete sections
CREATE POLICY "Authenticated delete access for communicate sections"
    ON communicate_sections FOR DELETE
    TO authenticated
    USING (true);

-- RLS Policies for communicate_images
-- Public read access for all images (needed for display)
CREATE POLICY "Public read access for communicate images"
    ON communicate_images FOR SELECT
    USING (true);

-- Authenticated users can insert images
CREATE POLICY "Authenticated insert access for communicate images"
    ON communicate_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update images
CREATE POLICY "Authenticated update access for communicate images"
    ON communicate_images FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete images
CREATE POLICY "Authenticated delete access for communicate images"
    ON communicate_images FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Storage policies for communicate-section-images bucket
-- Public read access
CREATE POLICY "Public read access for communicate section images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'communicate-section-images');

-- Authenticated upload access
CREATE POLICY "Authenticated upload access for communicate section images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'communicate-section-images');

-- Authenticated update access
CREATE POLICY "Authenticated update access for communicate section images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'communicate-section-images')
    WITH CHECK (bucket_id = 'communicate-section-images');

-- Authenticated delete access
CREATE POLICY "Authenticated delete access for communicate section images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'communicate-section-images');

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function to get communicate section with active image
CREATE OR REPLACE FUNCTION get_communicate_section_with_image()
RETURNS TABLE (
    id UUID,
    main_heading TEXT,
    company_name TEXT,
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
    cs.id,
    cs.main_heading,
    cs.company_name,
    cs.first_paragraph,
    cs.second_paragraph,
    cs.main_image_id,
    cs.main_image_url,
    cs.main_image_alt,
    cs.is_active,
    cs.created_at,
    cs.updated_at,
    ci.file_path as image_file_path,
    ci.filename as image_filename,
    ci.alt_text as image_alt_text
  FROM communicate_sections cs
  LEFT JOIN communicate_images ci ON cs.main_image_id = ci.id AND ci.is_active = true
  WHERE cs.is_active = true
  ORDER BY cs.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_communicate_section_with_image() TO public;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default communicate section if none exists
INSERT INTO communicate_sections (
    main_heading,
    company_name,
    first_paragraph,
    second_paragraph,
    main_image_url,
    main_image_alt,
    is_active
)
SELECT
    'COMMUNICATE TO PROFICIENT MEETING & CONFERENCE PLANNERS',
    'Chronicle Exhibition Organizing LLC',
    'is one of the most well-liked event organizing & management companies in Dubai & UAE. We as conference organizers in Dubai, UAE have a close-knit & active team of dedicated professionals capable of planning & executing corporate meetings & events successfully.',
    'Our event management experts are packed with innovative ideas & are there for your continuous support.',
    'https://images.unsplash.com/photo-1559223607-b4d0555ae227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'Professional conference presentation',
    true
WHERE NOT EXISTS (SELECT 1 FROM communicate_sections WHERE is_active = true);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE tablename IN ('communicate_sections', 'communicate_images')
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
WHERE tablename IN ('communicate_sections', 'communicate_images')
ORDER BY tablename, policyname;

-- Verify initial data
SELECT
    id,
    main_heading,
    company_name,
    is_active,
    created_at
FROM communicate_sections
ORDER BY created_at DESC;

-- Verify storage bucket
SELECT
    id,
    name,
    public
FROM storage.buckets
WHERE id = 'communicate-section-images';

-- Test database function
SELECT * FROM get_communicate_section_with_image();

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT 'Communicate Section schema setup completed successfully!' as status;
