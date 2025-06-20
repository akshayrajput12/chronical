-- Conference Management Services Schema
-- Complete database schema for the Conference Management Services section
-- 
-- 🎯 PURPOSE: Dynamic content management for conference management services section
-- 📊 TABLES: conference_management_sections, conference_management_services, conference_management_images
-- 🗄️ STORAGE: conference-management-images bucket
-- 🔒 SECURITY: RLS policies for public read, authenticated write
-- ⚡ PERFORMANCE: Proper indexing and constraints

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for conference management images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('conference-management-images', 'conference-management-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- IMAGES TABLE (Created first to avoid circular dependency)
-- ============================================================================

-- Create conference management images table
CREATE TABLE IF NOT EXISTS conference_management_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- File Information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    
    -- Image Metadata
    alt_text TEXT DEFAULT 'Conference management service image',
    width INTEGER,
    height INTEGER,
    
    -- Status and Organization
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT conference_management_images_file_size_limit CHECK (file_size <= 10485760), -- 10MB limit
    CONSTRAINT conference_management_images_mime_type_check CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')),
    CONSTRAINT conference_management_images_filename_length CHECK (char_length(filename) >= 1),
    CONSTRAINT conference_management_images_alt_text_length CHECK (char_length(alt_text) >= 3)
);

-- ============================================================================
-- SERVICES TABLE (For individual service items)
-- ============================================================================

-- Create conference management services table
CREATE TABLE IF NOT EXISTS conference_management_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Service Content
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Display Configuration
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT conference_management_services_title_length CHECK (char_length(title) >= 3),
    CONSTRAINT conference_management_services_description_length CHECK (char_length(description) >= 10)
);

-- ============================================================================
-- MAIN CONTENT TABLE
-- ============================================================================

-- Create conference management sections table
CREATE TABLE IF NOT EXISTS conference_management_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Section Content
    main_heading TEXT NOT NULL DEFAULT 'CONFERENCE MANAGEMENT SERVICES IN DUBAI',
    main_description TEXT NOT NULL DEFAULT 'We are specialized in planning, designing, organizing & managing all kinds of meetings, promotional events and conferences in Dubai, UAE.',
    
    -- Image Configuration (without foreign key constraint initially)
    main_image_id UUID,
    main_image_url TEXT,
    main_image_alt TEXT DEFAULT 'Conference management services',
    
    -- Status and Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT conference_management_sections_main_heading_length CHECK (char_length(main_heading) >= 5),
    CONSTRAINT conference_management_sections_main_description_length CHECK (char_length(main_description) >= 10)
);

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS (Added after both tables exist)
-- ============================================================================

-- Add foreign key constraint for main_image_id
ALTER TABLE conference_management_sections 
ADD CONSTRAINT fk_conference_management_sections_main_image_id 
FOREIGN KEY (main_image_id) REFERENCES conference_management_images(id) ON DELETE SET NULL;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes for conference_management_sections
CREATE INDEX IF NOT EXISTS idx_conference_management_sections_active ON conference_management_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_conference_management_sections_created_at ON conference_management_sections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conference_management_sections_main_image_id ON conference_management_sections(main_image_id);

-- Indexes for conference_management_services
CREATE INDEX IF NOT EXISTS idx_conference_management_services_active ON conference_management_services(is_active);
CREATE INDEX IF NOT EXISTS idx_conference_management_services_display_order ON conference_management_services(display_order);
CREATE INDEX IF NOT EXISTS idx_conference_management_services_created_at ON conference_management_services(created_at DESC);

-- Indexes for conference_management_images
CREATE INDEX IF NOT EXISTS idx_conference_management_images_active ON conference_management_images(is_active);
CREATE INDEX IF NOT EXISTS idx_conference_management_images_created_at ON conference_management_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conference_management_images_display_order ON conference_management_images(display_order);
CREATE INDEX IF NOT EXISTS idx_conference_management_images_file_path ON conference_management_images(file_path);

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
DROP TRIGGER IF EXISTS update_conference_management_sections_updated_at ON conference_management_sections;
CREATE TRIGGER update_conference_management_sections_updated_at
    BEFORE UPDATE ON conference_management_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conference_management_services_updated_at ON conference_management_services;
CREATE TRIGGER update_conference_management_services_updated_at
    BEFORE UPDATE ON conference_management_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conference_management_images_updated_at ON conference_management_images;
CREATE TRIGGER update_conference_management_images_updated_at
    BEFORE UPDATE ON conference_management_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE conference_management_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conference_management_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE conference_management_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conference_management_sections
-- Public read access for active sections
CREATE POLICY "Public read access for active conference management sections"
    ON conference_management_sections FOR SELECT
    USING (is_active = true);

-- Authenticated users can read all sections
CREATE POLICY "Authenticated read access for conference management sections"
    ON conference_management_sections FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can insert sections
CREATE POLICY "Authenticated insert access for conference management sections"
    ON conference_management_sections FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update sections
CREATE POLICY "Authenticated update access for conference management sections"
    ON conference_management_sections FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete sections
CREATE POLICY "Authenticated delete access for conference management sections"
    ON conference_management_sections FOR DELETE
    TO authenticated
    USING (true);

-- RLS Policies for conference_management_services
-- Public read access for active services
CREATE POLICY "Public read access for active conference management services"
    ON conference_management_services FOR SELECT
    USING (is_active = true);

-- Authenticated users can read all services
CREATE POLICY "Authenticated read access for conference management services"
    ON conference_management_services FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can insert services
CREATE POLICY "Authenticated insert access for conference management services"
    ON conference_management_services FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update services
CREATE POLICY "Authenticated update access for conference management services"
    ON conference_management_services FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete services
CREATE POLICY "Authenticated delete access for conference management services"
    ON conference_management_services FOR DELETE
    TO authenticated
    USING (true);

-- RLS Policies for conference_management_images
-- Public read access for all images (needed for display)
CREATE POLICY "Public read access for conference management images"
    ON conference_management_images FOR SELECT
    USING (true);

-- Authenticated users can insert images
CREATE POLICY "Authenticated insert access for conference management images"
    ON conference_management_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update images
CREATE POLICY "Authenticated update access for conference management images"
    ON conference_management_images FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete images
CREATE POLICY "Authenticated delete access for conference management images"
    ON conference_management_images FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Storage policies for conference-management-images bucket
-- Public read access
CREATE POLICY "Public read access for conference management images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'conference-management-images');

-- Authenticated upload access
CREATE POLICY "Authenticated upload access for conference management images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'conference-management-images');

-- Authenticated update access
CREATE POLICY "Authenticated update access for conference management images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'conference-management-images')
    WITH CHECK (bucket_id = 'conference-management-images');

-- Authenticated delete access
CREATE POLICY "Authenticated delete access for conference management images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'conference-management-images');

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function to get conference management section with active image and services
CREATE OR REPLACE FUNCTION get_conference_management_section_with_data()
RETURNS TABLE (
    id UUID,
    main_heading TEXT,
    main_description TEXT,
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
    cms.id,
    cms.main_heading,
    cms.main_description,
    cms.main_image_id,
    cms.main_image_url,
    cms.main_image_alt,
    cms.is_active,
    cms.created_at,
    cms.updated_at,
    cmi.file_path as image_file_path,
    cmi.filename as image_filename,
    cmi.alt_text as image_alt_text
  FROM conference_management_sections cms
  LEFT JOIN conference_management_images cmi ON cms.main_image_id = cmi.id AND cmi.is_active = true
  WHERE cms.is_active = true
  ORDER BY cms.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_conference_management_section_with_data() TO public;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default conference management section if none exists
INSERT INTO conference_management_sections (
    main_heading,
    main_description,
    main_image_alt,
    is_active
)
SELECT
    'CONFERENCE MANAGEMENT SERVICES IN DUBAI',
    'We are specialized in planning, designing, organizing & managing all kinds of meetings, promotional events and conferences in Dubai, UAE.',
    'Conference management services',
    true
WHERE NOT EXISTS (SELECT 1 FROM conference_management_sections WHERE is_active = true);

-- Insert default services if none exist
INSERT INTO conference_management_services (title, description, display_order, is_active)
SELECT * FROM (VALUES
    ('SYSTEMATIC PLANNING', 'Make an impactful strategy covering all event components, ensuring high-rate success.', 1, true),
    ('VENUE SELECTION', 'Help you find an easy-to-access location for the conference or meeting.', 2, true),
    ('REGISTRATION PROCESS', 'As efficient event planners, we suggest user-friendly registration solutions reducing your workload.', 3, true),
    ('PRESENTATION MANAGEMENT', 'Assign the responsibility of sharing the information to trained speakers & provide them with all the essential presentation-related guidelines.', 4, true),
    ('FOOD & BEVERAGE', 'Take care of food needs & look after everything including menus, workforce, and other important elements.', 5, true),
    ('PROGRAM DESIGN', 'Well aware of the latest trends & colour schemes needed to create a vibrant stage. Our powerful program designs are an assurance of success.', 6, true)
) AS v(title, description, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM conference_management_services WHERE is_active = true);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE tablename IN ('conference_management_sections', 'conference_management_services', 'conference_management_images')
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
WHERE tablename IN ('conference_management_sections', 'conference_management_services', 'conference_management_images')
ORDER BY tablename, policyname;

-- Verify initial data
SELECT
    id,
    main_heading,
    is_active,
    created_at
FROM conference_management_sections
ORDER BY created_at DESC;

-- Verify services data
SELECT
    id,
    title,
    display_order,
    is_active,
    created_at
FROM conference_management_services
ORDER BY display_order;
