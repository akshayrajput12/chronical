-- =====================================================
-- PORTFOLIO BUCKET AND POLICIES SETUP
-- =====================================================

-- Create portfolio bucket for storing portfolio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'city-portfolio',
    'city-portfolio',
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES FOR PORTFOLIO BUCKET
-- =====================================================

-- Allow public read access to portfolio images
CREATE POLICY "Public read access for portfolio images"
ON storage.objects FOR SELECT
USING (bucket_id = 'city-portfolio');

-- Allow authenticated users to upload portfolio images
CREATE POLICY "Authenticated users can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'city-portfolio' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update portfolio images
CREATE POLICY "Authenticated users can update portfolio images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'city-portfolio' 
    AND auth.role() = 'authenticated'
)
WITH CHECK (
    bucket_id = 'city-portfolio' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete portfolio images
CREATE POLICY "Authenticated users can delete portfolio images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'city-portfolio' 
    AND auth.role() = 'authenticated'
);

-- =====================================================
-- UPDATE PORTFOLIO TABLE STRUCTURE
-- =====================================================

-- No additional columns needed - using existing schema

-- =====================================================
-- PORTFOLIO HELPER FUNCTIONS
-- =====================================================

-- Function to get portfolio items for a city
CREATE OR REPLACE FUNCTION get_city_portfolio_items(city_slug TEXT)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    image_url TEXT,
    alt_text VARCHAR(255),
    category VARCHAR(100),
    project_year INTEGER,
    client_name VARCHAR(255),
    is_featured BOOLEAN,
    sort_order INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.image_url,
        p.alt_text,
        p.category,
        p.project_year,
        p.client_name,
        p.is_featured,
        p.sort_order
    FROM city_portfolio_items p
    JOIN cities c ON p.city_id = c.id
    WHERE c.slug = city_slug
    AND c.is_active = true
    ORDER BY p.sort_order ASC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique portfolio filename
CREATE OR REPLACE FUNCTION generate_portfolio_filename(
    city_id UUID,
    original_filename TEXT
) RETURNS TEXT AS $$
DECLARE
    file_extension TEXT;
    timestamp_str TEXT;
    unique_filename TEXT;
BEGIN
    -- Extract file extension
    file_extension := LOWER(SUBSTRING(original_filename FROM '\.([^.]*)$'));
    
    -- Generate timestamp string
    timestamp_str := TO_CHAR(NOW(), 'YYYYMMDD_HH24MISS');
    
    -- Create unique filename
    unique_filename := city_id::TEXT || '_' || timestamp_str || '_' || EXTRACT(EPOCH FROM NOW())::BIGINT || '.' || file_extension;
    
    RETURN unique_filename;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- INSERT SAMPLE PORTFOLIO DATA
-- =====================================================

-- Insert sample portfolio items for each city
INSERT INTO city_portfolio_items (
    city_id,
    title,
    description,
    image_url,
    alt_text,
    category,
    project_year,
    client_name,
    is_featured,
    sort_order
)
SELECT
    c.id,
    portfolio_data.title,
    portfolio_data.description,
    portfolio_data.image_url,
    portfolio_data.alt_text,
    portfolio_data.category,
    portfolio_data.project_year,
    portfolio_data.client_name,
    portfolio_data.is_featured,
    portfolio_data.sort_order
FROM cities c
CROSS JOIN (
    VALUES
        ('Tech Innovation Pavilion', 'Modern tech exhibition booth with purple lighting and interactive displays showcasing cutting-edge technology solutions', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop', 'Modern tech exhibition booth with purple lighting and interactive displays', 'Technology', 2024, 'TechCorp Solutions', true, 1),
        ('Creative Design Studio', 'Colorful triangular booth design with red and blue elements creating an engaging visual experience', 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=300&fit=crop', 'Colorful triangular booth design with red and blue elements', 'Design', 2024, 'Creative Industries Ltd', false, 2),
        ('Corporate Excellence', 'Professional booth with circular ceiling design and attendees networking in a sophisticated environment', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=500&fit=crop', 'Professional booth with circular ceiling design and attendees', 'Corporate', 2023, 'Excellence Corp', true, 3),
        ('Sustainable Solutions', 'Wooden and modern booth design with clean lines emphasizing eco-friendly business practices', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=500&fit=crop', 'Wooden and modern booth design with clean lines', 'Sustainability', 2023, 'Green Future Inc', false, 4),
        ('Digital Experience', 'Red and white booth with multiple display screens showcasing digital transformation solutions', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=400&fit=crop', 'Red and white booth with multiple display screens', 'Digital', 2024, 'Digital Dynamics', true, 5),
        ('Minimalist Approach', 'White minimalist booth with green accents demonstrating clean and efficient design principles', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 'White minimalist booth with green accents', 'Minimalist', 2023, 'Minimal Design Co', false, 6),
        ('Luxury Pavilion', 'Exhibition hall with golden lighting creating an upscale and premium brand experience', 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop', 'Exhibition hall with golden lighting', 'Luxury', 2024, 'Luxury Brands International', true, 7),
        ('Modern Architecture', 'Modern exhibition space with attendees exploring innovative architectural solutions and designs', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop', 'Modern exhibition space with attendees', 'Architecture', 2023, 'Architectural Innovations', false, 8),
        ('Interactive Experience', 'Trade show booth with interactive displays engaging visitors through hands-on technology demonstrations', 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=400&fit=crop', 'Trade show booth with interactive displays', 'Interactive', 2024, 'Interactive Solutions Ltd', true, 9),
        ('Business Solutions', 'Corporate exhibition stand showcasing comprehensive business solutions and professional services', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop', 'Corporate exhibition stand', 'Business', 2023, 'Business Pro Services', false, 10)
) AS portfolio_data(title, description, image_url, alt_text, category, project_year, client_name, is_featured, sort_order)
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_city_portfolio_city_id ON city_portfolio_items(city_id);
CREATE INDEX IF NOT EXISTS idx_city_portfolio_is_featured ON city_portfolio_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_city_portfolio_sort_order ON city_portfolio_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_city_portfolio_category ON city_portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_city_portfolio_project_year ON city_portfolio_items(project_year);

-- =====================================================
-- PORTFOLIO TABLE TRIGGERS
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_portfolio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS trigger_update_portfolio_updated_at ON city_portfolio_items;
CREATE TRIGGER trigger_update_portfolio_updated_at
    BEFORE UPDATE ON city_portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_portfolio_updated_at();
