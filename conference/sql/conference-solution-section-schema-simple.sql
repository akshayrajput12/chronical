-- Conference Solution Section Schema - Simple Step-by-Step Version
-- Use this file if the main schema file fails due to dependency issues
-- 
-- 🎯 PURPOSE: Step-by-step setup for conference solution section
-- 📊 APPROACH: Create each component separately to avoid circular dependencies
-- ✅ SAFE: Run each step individually if needed

-- ============================================================================
-- STEP 1: CREATE STORAGE BUCKET
-- ============================================================================

-- Create storage bucket for conference solution section images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('conference-solution-section-images', 'conference-solution-section-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: CREATE IMAGES TABLE FIRST (No dependencies)
-- ============================================================================

-- Create conference solution section images table
CREATE TABLE IF NOT EXISTS conference_solution_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- File Information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    
    -- Image Metadata
    alt_text TEXT DEFAULT 'Conference solution call to action',
    width INTEGER,
    height INTEGER,
    
    -- Status and Organization
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT conference_solution_images_file_size_limit CHECK (file_size <= 10485760), -- 10MB limit
    CONSTRAINT conference_solution_images_mime_type_check CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')),
    CONSTRAINT conference_solution_images_filename_length CHECK (char_length(filename) >= 1),
    CONSTRAINT conference_solution_images_alt_text_length CHECK (char_length(alt_text) >= 3)
);

-- ============================================================================
-- STEP 3: CREATE SECTIONS TABLE (Without foreign key initially)
-- ============================================================================

-- Create conference solution sections table
CREATE TABLE IF NOT EXISTS conference_solution_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Section Content
    main_heading TEXT NOT NULL DEFAULT 'NEED CONFERENCE SOLUTION?',
    phone_number TEXT NOT NULL DEFAULT '+971 (543) 47-4645',
    call_to_action_text TEXT NOT NULL DEFAULT 'or submit enquiry form below',
    
    -- Background Configuration
    background_color TEXT NOT NULL DEFAULT '#a5cd39',
    
    -- Image Configuration (without foreign key constraint initially)
    main_image_id UUID,
    main_image_url TEXT,
    main_image_alt TEXT DEFAULT 'Conference solution call to action',
    
    -- Status and Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT conference_solution_sections_main_heading_length CHECK (char_length(main_heading) >= 5),
    CONSTRAINT conference_solution_sections_phone_number_length CHECK (char_length(phone_number) >= 5),
    CONSTRAINT conference_solution_sections_call_to_action_text_length CHECK (char_length(call_to_action_text) >= 5),
    CONSTRAINT conference_solution_sections_background_color_format CHECK (background_color ~ '^#[0-9a-fA-F]{6}$')
);

-- ============================================================================
-- STEP 4: ADD FOREIGN KEY CONSTRAINT (After both tables exist)
-- ============================================================================

-- Add foreign key constraint for main_image_id
ALTER TABLE conference_solution_sections 
ADD CONSTRAINT fk_conference_solution_sections_main_image_id 
FOREIGN KEY (main_image_id) REFERENCES conference_solution_images(id) ON DELETE SET NULL;

-- ============================================================================
-- STEP 5: CREATE INDEXES
-- ============================================================================

-- Indexes for conference_solution_sections
CREATE INDEX IF NOT EXISTS idx_conference_solution_sections_active ON conference_solution_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_conference_solution_sections_created_at ON conference_solution_sections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conference_solution_sections_main_image_id ON conference_solution_sections(main_image_id);

-- Indexes for conference_solution_images
CREATE INDEX IF NOT EXISTS idx_conference_solution_images_active ON conference_solution_images(is_active);
CREATE INDEX IF NOT EXISTS idx_conference_solution_images_created_at ON conference_solution_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conference_solution_images_display_order ON conference_solution_images(display_order);
CREATE INDEX IF NOT EXISTS idx_conference_solution_images_file_path ON conference_solution_images(file_path);

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
DROP TRIGGER IF EXISTS update_conference_solution_sections_updated_at ON conference_solution_sections;
CREATE TRIGGER update_conference_solution_sections_updated_at
    BEFORE UPDATE ON conference_solution_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conference_solution_images_updated_at ON conference_solution_images;
CREATE TRIGGER update_conference_solution_images_updated_at
    BEFORE UPDATE ON conference_solution_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 7: ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE conference_solution_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conference_solution_images ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 8: CREATE RLS POLICIES FOR SECTIONS
-- ============================================================================

-- RLS Policies for conference_solution_sections
-- Public read access for active sections
CREATE POLICY "Public read access for active conference solution sections"
    ON conference_solution_sections FOR SELECT
    USING (is_active = true);

-- Authenticated users can read all sections
CREATE POLICY "Authenticated read access for conference solution sections"
    ON conference_solution_sections FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can insert sections
CREATE POLICY "Authenticated insert access for conference solution sections"
    ON conference_solution_sections FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update sections
CREATE POLICY "Authenticated update access for conference solution sections"
    ON conference_solution_sections FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete sections
CREATE POLICY "Authenticated delete access for conference solution sections"
    ON conference_solution_sections FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- STEP 9: CREATE RLS POLICIES FOR IMAGES
-- ============================================================================

-- RLS Policies for conference_solution_images
-- Public read access for all images (needed for display)
CREATE POLICY "Public read access for conference solution images"
    ON conference_solution_images FOR SELECT
    USING (true);

-- Authenticated users can insert images
CREATE POLICY "Authenticated insert access for conference solution images"
    ON conference_solution_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update images
CREATE POLICY "Authenticated update access for conference solution images"
    ON conference_solution_images FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete images
CREATE POLICY "Authenticated delete access for conference solution images"
    ON conference_solution_images FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- STEP 10: CREATE STORAGE POLICIES
-- ============================================================================

-- Storage policies for conference-solution-section-images bucket
-- Public read access
CREATE POLICY "Public read access for conference solution section images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'conference-solution-section-images');

-- Authenticated upload access
CREATE POLICY "Authenticated upload access for conference solution section images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'conference-solution-section-images');

-- Authenticated update access
CREATE POLICY "Authenticated update access for conference solution section images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'conference-solution-section-images')
    WITH CHECK (bucket_id = 'conference-solution-section-images');

-- Authenticated delete access
CREATE POLICY "Authenticated delete access for conference solution section images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'conference-solution-section-images');

-- ============================================================================
-- STEP 11: CREATE DATABASE FUNCTIONS
-- ============================================================================

-- Function to get conference solution section with active image
CREATE OR REPLACE FUNCTION get_conference_solution_section_with_image()
RETURNS TABLE (
    id UUID,
    main_heading TEXT,
    phone_number TEXT,
    call_to_action_text TEXT,
    background_color TEXT,
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
    css.id,
    css.main_heading,
    css.phone_number,
    css.call_to_action_text,
    css.background_color,
    css.main_image_id,
    css.main_image_url,
    css.main_image_alt,
    css.is_active,
    css.created_at,
    css.updated_at,
    csi.file_path as image_file_path,
    csi.filename as image_filename,
    csi.alt_text as image_alt_text
  FROM conference_solution_sections css
  LEFT JOIN conference_solution_images csi ON css.main_image_id = csi.id AND csi.is_active = true
  WHERE css.is_active = true
  ORDER BY css.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_conference_solution_section_with_image() TO public;

-- ============================================================================
-- STEP 12: INSERT INITIAL DATA
-- ============================================================================

-- Insert default conference solution section if none exists
INSERT INTO conference_solution_sections (
    main_heading,
    phone_number,
    call_to_action_text,
    background_color,
    main_image_alt,
    is_active
) 
SELECT 
    'NEED CONFERENCE SOLUTION?',
    '+971 (543) 47-4645',
    'or submit enquiry form below',
    '#a5cd39',
    'Conference solution call to action',
    true
WHERE NOT EXISTS (SELECT 1 FROM conference_solution_sections WHERE is_active = true);

-- ============================================================================
-- STEP 13: VERIFICATION
-- ============================================================================

-- Verify table creation
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('conference_solution_sections', 'conference_solution_images')
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
WHERE tablename IN ('conference_solution_sections', 'conference_solution_images')
ORDER BY tablename, policyname;

-- Verify initial data
SELECT 
    id,
    main_heading,
    phone_number,
    call_to_action_text,
    background_color,
    is_active,
    created_at
FROM conference_solution_sections
ORDER BY created_at DESC;

-- Verify storage bucket
SELECT 
    id,
    name,
    public
FROM storage.buckets 
WHERE id = 'conference-solution-section-images';

-- Test database function
SELECT * FROM get_conference_solution_section_with_image();

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT 'Conference Solution Section schema setup completed successfully!' as status;
