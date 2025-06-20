  -- Portfolio Gallery Schema
-- Complete database schema for the Portfolio Gallery management system
-- 
-- 🎯 PURPOSE: Dynamic content management for portfolio gallery
-- 📊 TABLES: portfolio_items, portfolio_images
-- 🗄️ STORAGE: portfolio-gallery-images bucket
-- 🔒 SECURITY: RLS policies for public read, authenticated write
-- ⚡ PERFORMANCE: Proper indexing and constraints

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage bucket for portfolio gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-gallery-images', 'portfolio-gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- IMAGES TABLE (Created first to avoid circular dependency)
-- ============================================================================

-- Create portfolio images table
CREATE TABLE IF NOT EXISTS portfolio_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- File Information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    
    -- Image Metadata
    alt_text TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    
    -- Status and Organization
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT portfolio_images_file_size_limit CHECK (file_size <= 10485760), -- 10MB limit
    CONSTRAINT portfolio_images_mime_type_check CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')),
    CONSTRAINT portfolio_images_filename_length CHECK (char_length(filename) >= 1),
    CONSTRAINT portfolio_images_alt_text_length CHECK (char_length(alt_text) >= 3)
);

-- ============================================================================
-- MAIN PORTFOLIO ITEMS TABLE
-- ============================================================================

-- Create portfolio items table
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Display Information
    title TEXT,
    description TEXT,
    alt_text TEXT NOT NULL,
    
    -- Layout Configuration
    grid_class TEXT NOT NULL DEFAULT 'row-span-1',
    display_order INTEGER NOT NULL DEFAULT 0,
    
    -- Image Configuration (without foreign key constraint initially)
    image_id UUID,
    image_url TEXT,
    
    -- Status and Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT portfolio_items_alt_text_length CHECK (char_length(alt_text) >= 3),
    CONSTRAINT portfolio_items_grid_class_check CHECK (grid_class IN ('row-span-1', 'row-span-2', 'row-span-3')),
    CONSTRAINT portfolio_items_display_order_positive CHECK (display_order >= 0)
);

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS (Added after both tables exist)
-- ============================================================================

-- Add foreign key constraint for image_id
ALTER TABLE portfolio_items 
ADD CONSTRAINT fk_portfolio_items_image_id 
FOREIGN KEY (image_id) REFERENCES portfolio_images(id) ON DELETE SET NULL;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes for portfolio_items
CREATE INDEX IF NOT EXISTS idx_portfolio_items_active ON portfolio_items(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_display_order ON portfolio_items(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_created_at ON portfolio_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_image_id ON portfolio_items(image_id);

-- Indexes for portfolio_images
CREATE INDEX IF NOT EXISTS idx_portfolio_images_active ON portfolio_images(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_created_at ON portfolio_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_display_order ON portfolio_images(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_file_path ON portfolio_images(file_path);

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
DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
CREATE TRIGGER update_portfolio_items_updated_at
    BEFORE UPDATE ON portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_images_updated_at ON portfolio_images;
CREATE TRIGGER update_portfolio_images_updated_at
    BEFORE UPDATE ON portfolio_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_items
-- Public read access for active items
CREATE POLICY "Public read access for active portfolio items"
    ON portfolio_items FOR SELECT
    USING (is_active = true);

-- Authenticated users can read all items
CREATE POLICY "Authenticated read access for portfolio items"
    ON portfolio_items FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can insert items
CREATE POLICY "Authenticated insert access for portfolio items"
    ON portfolio_items FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update items
CREATE POLICY "Authenticated update access for portfolio items"
    ON portfolio_items FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete items
CREATE POLICY "Authenticated delete access for portfolio items"
    ON portfolio_items FOR DELETE
    TO authenticated
    USING (true);

-- RLS Policies for portfolio_images
-- Public read access for all images (needed for display)
CREATE POLICY "Public read access for portfolio images"
    ON portfolio_images FOR SELECT
    USING (true);

-- Authenticated users can insert images
CREATE POLICY "Authenticated insert access for portfolio images"
    ON portfolio_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated users can update images
CREATE POLICY "Authenticated update access for portfolio images"
    ON portfolio_images FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete images
CREATE POLICY "Authenticated delete access for portfolio images"
    ON portfolio_images FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Storage policies for portfolio-gallery-images bucket
-- Public read access
CREATE POLICY "Public read access for portfolio gallery images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-gallery-images');

-- Authenticated upload access
CREATE POLICY "Authenticated upload access for portfolio gallery images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-gallery-images');

-- Authenticated update access
CREATE POLICY "Authenticated update access for portfolio gallery images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-gallery-images')
    WITH CHECK (bucket_id = 'portfolio-gallery-images');

-- Authenticated delete access
CREATE POLICY "Authenticated delete access for portfolio gallery images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-gallery-images');

-- ============================================================================
-- DATABASE FUNCTIONS
-- ============================================================================

-- Function to get portfolio items with images
CREATE OR REPLACE FUNCTION get_portfolio_items_with_images()
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    alt_text TEXT,
    grid_class TEXT,
    display_order INTEGER,
    image_id UUID,
    image_url TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    image_file_path TEXT,
    image_filename TEXT,
    image_alt_text TEXT,
    image_width INTEGER,
    image_height INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pi.id,
    pi.title,
    pi.description,
    pi.alt_text,
    pi.grid_class,
    pi.display_order,
    pi.image_id,
    pi.image_url,
    pi.is_active,
    pi.created_at,
    pi.updated_at,
    pimg.file_path as image_file_path,
    pimg.filename as image_filename,
    pimg.alt_text as image_alt_text,
    pimg.width as image_width,
    pimg.height as image_height
  FROM portfolio_items pi
  LEFT JOIN portfolio_images pimg ON pi.image_id = pimg.id AND pimg.is_active = true
  WHERE pi.is_active = true
  ORDER BY pi.display_order ASC, pi.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_portfolio_items_with_images() TO public;

-- ============================================================================
-- INITIAL DATA INSERTION
-- ============================================================================

-- Insert initial portfolio items with external image URLs (matching current data)
INSERT INTO portfolio_items (
    title,
    description,
    alt_text,
    grid_class,
    display_order,
    image_url,
    is_active
) VALUES
    ('Modern Tech Exhibition', 'Purple lighting and interactive displays', 'Modern tech exhibition booth with purple lighting and interactive displays', 'row-span-2', 1, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop', true),
    ('Colorful Triangular Booth', 'Red and blue design elements', 'Colorful triangular booth design with red and blue elements', 'row-span-1', 2, 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=300&fit=crop', true),
    ('Professional Circular Design', 'Circular ceiling with attendees', 'Professional booth with circular ceiling design and attendees', 'row-span-2', 3, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=500&fit=crop', true),
    ('Wooden Modern Booth', 'Clean lines and modern design', 'Wooden and modern booth design with clean lines', 'row-span-2', 4, 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=500&fit=crop', true),
    ('Red and White Display', 'Multiple display screens', 'Red and white booth with multiple display screens', 'row-span-2', 5, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=400&fit=crop', true),
    ('White Minimalist Booth', 'Green accent elements', 'White minimalist booth with green accents', 'row-span-1', 6, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', true),
    ('Exhibition Hall', 'Golden lighting atmosphere', 'Exhibition hall with golden lighting', 'row-span-1', 7, 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop', true),
    ('Modern Exhibition Space', 'Attendees and displays', 'Modern exhibition space with attendees', 'row-span-1', 8, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop', true),
    ('Trade Show Interactive', 'Interactive display booth', 'Trade show booth with interactive displays', 'row-span-2', 9, 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=400&fit=crop', true),
    ('Corporate Exhibition', 'Professional corporate stand', 'Corporate exhibition stand', 'row-span-1', 10, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop', true),
    ('Large Scale Exhibition', 'Multiple booth setup', 'Large scale exhibition with multiple booths', 'row-span-2', 11, 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=500&fit=crop', true),
    ('Professional Conference', 'Conference and exhibition setup', 'Professional conference and exhibition setup', 'row-span-1', 12, 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE tablename IN ('portfolio_items', 'portfolio_images')
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
WHERE tablename IN ('portfolio_items', 'portfolio_images')
ORDER BY tablename, policyname;

-- Verify initial data
SELECT
    id,
    title,
    alt_text,
    grid_class,
    display_order,
    is_active,
    created_at
FROM portfolio_items
ORDER BY display_order;

-- Verify storage bucket
SELECT
    id,
    name,
    public
FROM storage.buckets
WHERE id = 'portfolio-gallery-images';

-- Test database function
SELECT * FROM get_portfolio_items_with_images();

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT 'Portfolio Gallery schema setup completed successfully!' as status;
