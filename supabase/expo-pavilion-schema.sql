-- =====================================================
-- EXPO PAVILION STAND PAGE - DATABASE SCHEMA
-- =====================================================
-- This schema supports the Country Pavilion Expo Booth Solutions page
-- Route: /country-pavilion-expo-booth-solutions-in-dubai
-- Organized section-wise for better management

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage bucket for expo pavilion images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('expo-pavilion-images', 'expo-pavilion-images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 1. HERO SECTION
-- =====================================================

-- Table for Country Pavilion Hero Section
CREATE TABLE IF NOT EXISTS expo_pavilion_hero (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'COUNTRY PAVILION EXPO BOOTH DESIGN IN UAE',
    subtitle TEXT NOT NULL DEFAULT 'Chronicle Exhibition Organizing LLC masters the art of designing for country pavilion expo booth. Let your brand shine at international events by using our unique country pavilion exhibition stands. Explore stunning designs that captivate and engage.',
    background_image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    background_image_alt TEXT NOT NULL DEFAULT 'Country Pavilion Expo Booth Design',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for expo_pavilion_hero
ALTER TABLE expo_pavilion_hero ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON expo_pavilion_hero
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON expo_pavilion_hero
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 2. INTRO SECTION
-- =====================================================

-- Table for Country Pavilion Intro Section
CREATE TABLE IF NOT EXISTS expo_pavilion_intro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading TEXT NOT NULL DEFAULT 'COUNTRY PAVILION EXPO BOOTH',
    paragraph_1 TEXT NOT NULL DEFAULT 'Top choice for showcasing national excellence on a global stage. As the premier provider of country pavilion expo booth in Dubai, we specialize in creating immersive and impactful spaces that highlight the unique offerings of your nation. Our booths offer unparalleled visibility and serve as powerful platforms for promoting your country''s culture, industry, and innovation.',
    paragraph_2 TEXT NOT NULL DEFAULT 'With Chronicle Exhibits Dubai comprehensive services and attention to detail, you can trust us to elevate your country''s presence at any event. Whether you''re promoting trade, tourism, investment opportunities, our country pavilion exhibition booths provide the perfect platform for showcasing the best of what your nation has to offer.',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for expo_pavilion_intro
ALTER TABLE expo_pavilion_intro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON expo_pavilion_intro
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON expo_pavilion_intro
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. EXCEPTIONAL DESIGN SECTION
-- =====================================================

-- Table for Exceptional Design Section
CREATE TABLE IF NOT EXISTS expo_pavilion_exceptional_design (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading TEXT NOT NULL DEFAULT 'EXCEPTIONAL DESIGN SERVICES FOR PAVILION BOOTHS',
    paragraph_1 TEXT NOT NULL DEFAULT 'Country Pavilion Expo Booth reflects a particular nation''s culture, religion & way of living. It is a chain of small exhibition stands where you can display your products with the member exhibitors of your country. Explore companies across the globe pick out pavilion booths to promote their brand & sell out their products.',
    paragraph_2 TEXT NOT NULL DEFAULT 'Pavilion booths are highly beneficial for promoting brands & products. Let''s quickly look into its pros →',
    image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    image_alt TEXT NOT NULL DEFAULT 'Country Pavilion Exhibition Booth',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Exceptional Design Benefits (bullet points)
CREATE TABLE IF NOT EXISTS expo_pavilion_design_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_section_id UUID REFERENCES expo_pavilion_exceptional_design(id) ON DELETE CASCADE,
    benefit_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for expo_pavilion_exceptional_design
ALTER TABLE expo_pavilion_exceptional_design ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON expo_pavilion_exceptional_design
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON expo_pavilion_exceptional_design
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS for expo_pavilion_design_benefits
ALTER TABLE expo_pavilion_design_benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON expo_pavilion_design_benefits
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON expo_pavilion_design_benefits
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 4. PORTFOLIO SECTION
-- =====================================================

-- Table for Portfolio Section Configuration
CREATE TABLE IF NOT EXISTS expo_pavilion_portfolio_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    main_heading TEXT NOT NULL DEFAULT 'OUR RECENT WORK',
    sub_heading TEXT NOT NULL DEFAULT 'PORTFOLIO',
    description TEXT NOT NULL DEFAULT 'Check out our portfolio for the success stories of brands that trusted us as their custom exhibition stand contractor. Our recent work includes a diverse range of custom stand designs.',
    cta_button_text TEXT NOT NULL DEFAULT 'View All Projects',
    cta_button_url TEXT NOT NULL DEFAULT '/portfolio',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Portfolio Items
CREATE TABLE IF NOT EXISTS expo_pavilion_portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    project_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for expo_pavilion_portfolio_sections
ALTER TABLE expo_pavilion_portfolio_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON expo_pavilion_portfolio_sections
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON expo_pavilion_portfolio_sections
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS for expo_pavilion_portfolio_items
ALTER TABLE expo_pavilion_portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON expo_pavilion_portfolio_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON expo_pavilion_portfolio_items
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 5. REASONS TO SELECT SECTION (Optional - Not Currently Used)
-- =====================================================

-- Table for Reasons to Select Section
CREATE TABLE IF NOT EXISTS expo_pavilion_reasons_to_select (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading TEXT NOT NULL DEFAULT 'REASONS TO SELECT OUR SERVICES FOR COUNTRY PAVILION EXPO BOOTH',
    paragraph_1 TEXT NOT NULL DEFAULT 'In Chronicle Exhibition Organizing LLC, we go beyond the traditional exhibition stand We create experiences. Our pavilions for country events are carefully designed to reflect the distinctiveness of your nation. With a singular emphasis on the richness of culture and contemporary design Our pavilions make an impression that lasts.',
    paragraph_2 TEXT NOT NULL DEFAULT 'Let us make your vision an unforgettable reality on the world stage. Attract the maximum amount of attention and guarantee an effective presence at events and trade fairs in the UAE by partnering with us.',
    is_active BOOLEAN NOT NULL DEFAULT false, -- Not currently used on page
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for expo_pavilion_reasons_to_select
ALTER TABLE expo_pavilion_reasons_to_select ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON expo_pavilion_reasons_to_select
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON expo_pavilion_reasons_to_select
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. LOOKING FOR PAVILION SECTION (Optional - Not Currently Used)
-- =====================================================

-- Table for Looking for Pavilion CTA Section
CREATE TABLE IF NOT EXISTS expo_pavilion_looking_for_cta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'LOOKING FOR COUNTRY PAVILION EXPO BOOTH SOLUTIONS IN DUBAI',
    phone_number TEXT NOT NULL DEFAULT '+971543474645',
    phone_display TEXT NOT NULL DEFAULT 'Call +971 (543) 47-4645',
    cta_text TEXT NOT NULL DEFAULT 'or submit enquiry form below',
    background_color TEXT NOT NULL DEFAULT '#a5cd39',
    is_active BOOLEAN NOT NULL DEFAULT false, -- Not currently used on page
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for expo_pavilion_looking_for_cta
ALTER TABLE expo_pavilion_looking_for_cta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON expo_pavilion_looking_for_cta
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON expo_pavilion_looking_for_cta
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert default hero section data
INSERT INTO expo_pavilion_hero (
    title,
    subtitle,
    background_image_url,
    background_image_alt,
    is_active
)
SELECT
    'COUNTRY PAVILION EXPO BOOTH DESIGN IN UAE',
    'Chronicle Exhibition Organizing LLC masters the art of designing for country pavilion expo booth. Let your brand shine at international events by using our unique country pavilion exhibition stands. Explore stunning designs that captivate and engage.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'Country Pavilion Expo Booth Design',
    true
WHERE NOT EXISTS (SELECT 1 FROM expo_pavilion_hero WHERE is_active = true);

-- Insert default intro section data
INSERT INTO expo_pavilion_intro (
    heading,
    paragraph_1,
    paragraph_2,
    is_active
)
SELECT
    'COUNTRY PAVILION EXPO BOOTH',
    'Top choice for showcasing national excellence on a global stage. As the premier provider of country pavilion expo booth in Dubai, we specialize in creating immersive and impactful spaces that highlight the unique offerings of your nation. Our booths offer unparalleled visibility and serve as powerful platforms for promoting your country''s culture, industry, and innovation.',
    'With Chronicle Exhibits Dubai comprehensive services and attention to detail, you can trust us to elevate your country''s presence at any event. Whether you''re promoting trade, tourism, investment opportunities, our country pavilion exhibition booths provide the perfect platform for showcasing the best of what your nation has to offer.',
    true
WHERE NOT EXISTS (SELECT 1 FROM expo_pavilion_intro WHERE is_active = true);

-- Insert default exceptional design section data
INSERT INTO expo_pavilion_exceptional_design (
    heading,
    paragraph_1,
    paragraph_2,
    image_url,
    image_alt,
    is_active
)
SELECT
    'EXCEPTIONAL DESIGN SERVICES FOR PAVILION BOOTHS',
    'Country Pavilion Expo Booth reflects a particular nation''s culture, religion & way of living. It is a chain of small exhibition stands where you can display your products with the member exhibitors of your country. Explore companies across the globe pick out pavilion booths to promote their brand & sell out their products.',
    'Pavilion booths are highly beneficial for promoting brands & products. Let''s quickly look into its pros →',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'Country Pavilion Exhibition Booth',
    true
WHERE NOT EXISTS (SELECT 1 FROM expo_pavilion_exceptional_design WHERE is_active = true);

-- Insert design benefits (bullet points)
INSERT INTO expo_pavilion_design_benefits (design_section_id, benefit_text, display_order, is_active)
SELECT
    design_section.id,
    benefit_text,
    display_order,
    true
FROM expo_pavilion_exceptional_design design_section,
(VALUES
    ('You can target a vast number of potential consumers.', 1),
    ('Enrich brand value by creating positive brand awareness.', 2),
    ('Gives you an excellent chance to interact with new consumers who may become your future clients.', 3),
    ('Allow you to make strong business networks and discover the latest business ideas.', 4)
) AS benefits(benefit_text, display_order)
WHERE design_section.is_active = true
AND NOT EXISTS (
    SELECT 1 FROM expo_pavilion_design_benefits
    WHERE design_section_id = design_section.id
    AND is_active = true
);

-- Insert default portfolio section configuration
INSERT INTO expo_pavilion_portfolio_sections (
    main_heading,
    sub_heading,
    description,
    cta_button_text,
    cta_button_url,
    is_active
)
SELECT
    'OUR RECENT WORK',
    'PORTFOLIO',
    'Check out our portfolio for the success stories of brands that trusted us as their custom exhibition stand contractor. Our recent work includes a diverse range of custom stand designs.',
    'View All Projects',
    '/portfolio',
    true
WHERE NOT EXISTS (SELECT 1 FROM expo_pavilion_portfolio_sections WHERE is_active = true);

-- Insert sample portfolio items
INSERT INTO expo_pavilion_portfolio_items (title, description, image_url, image_alt, display_order, is_featured, is_active)
SELECT title, description, image_url, image_alt, display_order, is_featured, is_active
FROM (VALUES
    ('Modern Exhibition Stand', 'Contemporary design for tech company', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s', 'Modern Exhibition Stand Design', 1, true, true),
    ('Country Pavilion Design', 'National pavilion for international expo', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s', 'Country Pavilion Design', 2, true, true),
    ('Corporate Exhibition Booth', 'Professional booth for business expo', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s', 'Corporate Exhibition Booth', 3, true, true),
    ('Interactive Display Stand', 'Engaging interactive exhibition space', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s', 'Interactive Display Stand', 4, true, true),
    ('Luxury Brand Pavilion', 'Premium pavilion for luxury brands', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s', 'Luxury Brand Pavilion', 5, true, true),
    ('Trade Show Booth', 'Professional trade show exhibition stand', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyr2IcenNve1bBD7AhPlYHBiEsIR5UjqzcEw&s', 'Trade Show Booth', 6, true, true)
) AS portfolio_data(title, description, image_url, image_alt, display_order, is_featured, is_active)
WHERE NOT EXISTS (SELECT 1 FROM expo_pavilion_portfolio_items WHERE is_active = true);

-- Insert optional sections (currently not used on page)
INSERT INTO expo_pavilion_reasons_to_select (
    heading,
    paragraph_1,
    paragraph_2,
    is_active
)
SELECT
    'REASONS TO SELECT OUR SERVICES FOR COUNTRY PAVILION EXPO BOOTH',
    'In Chronicle Exhibition Organizing LLC, we go beyond the traditional exhibition stand We create experiences. Our pavilions for country events are carefully designed to reflect the distinctiveness of your nation. With a singular emphasis on the richness of culture and contemporary design Our pavilions make an impression that lasts.',
    'Let us make your vision an unforgettable reality on the world stage. Attract the maximum amount of attention and guarantee an effective presence at events and trade fairs in the UAE by partnering with us.',
    false
WHERE NOT EXISTS (SELECT 1 FROM expo_pavilion_reasons_to_select);

INSERT INTO expo_pavilion_looking_for_cta (
    title,
    phone_number,
    phone_display,
    cta_text,
    background_color,
    is_active
)
SELECT
    'LOOKING FOR COUNTRY PAVILION EXPO BOOTH SOLUTIONS IN DUBAI',
    '+971543474645',
    'Call +971 (543) 47-4645',
    'or submit enquiry form below',
    '#a5cd39',
    false
WHERE NOT EXISTS (SELECT 1 FROM expo_pavilion_looking_for_cta);

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_expo_pavilion_hero_updated_at
    BEFORE UPDATE ON expo_pavilion_hero
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expo_pavilion_intro_updated_at
    BEFORE UPDATE ON expo_pavilion_intro
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expo_pavilion_exceptional_design_updated_at
    BEFORE UPDATE ON expo_pavilion_exceptional_design
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expo_pavilion_portfolio_sections_updated_at
    BEFORE UPDATE ON expo_pavilion_portfolio_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expo_pavilion_portfolio_items_updated_at
    BEFORE UPDATE ON expo_pavilion_portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expo_pavilion_reasons_to_select_updated_at
    BEFORE UPDATE ON expo_pavilion_reasons_to_select
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expo_pavilion_looking_for_cta_updated_at
    BEFORE UPDATE ON expo_pavilion_looking_for_cta
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get active expo pavilion page data
CREATE OR REPLACE FUNCTION get_expo_pavilion_page_data()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'hero', (SELECT row_to_json(h) FROM (SELECT * FROM expo_pavilion_hero WHERE is_active = true LIMIT 1) h),
        'intro', (SELECT row_to_json(i) FROM (SELECT * FROM expo_pavilion_intro WHERE is_active = true LIMIT 1) i),
        'exceptional_design', (
            SELECT json_build_object(
                'section', (SELECT row_to_json(ed) FROM (SELECT * FROM expo_pavilion_exceptional_design WHERE is_active = true LIMIT 1) ed),
                'benefits', (SELECT json_agg(row_to_json(b)) FROM (SELECT * FROM expo_pavilion_design_benefits WHERE is_active = true ORDER BY display_order) b)
            )
        ),
        'portfolio', (
            SELECT json_build_object(
                'section', (SELECT row_to_json(ps) FROM (SELECT * FROM expo_pavilion_portfolio_sections WHERE is_active = true LIMIT 1) ps),
                'items', (SELECT json_agg(row_to_json(pi)) FROM (SELECT * FROM expo_pavilion_portfolio_items WHERE is_active = true ORDER BY display_order) pi)
            )
        ),
        'reasons_to_select', (SELECT row_to_json(r) FROM (SELECT * FROM expo_pavilion_reasons_to_select WHERE is_active = true LIMIT 1) r),
        'looking_for_cta', (SELECT row_to_json(l) FROM (SELECT * FROM expo_pavilion_looking_for_cta WHERE is_active = true LIMIT 1) l)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Storage policies for expo-pavilion-images bucket
CREATE POLICY "Allow public read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'expo-pavilion-images');

CREATE POLICY "Allow authenticated upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'expo-pavilion-images'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated update" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'expo-pavilion-images'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'expo-pavilion-images'
        AND auth.role() = 'authenticated'
    );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_expo_pavilion_hero_active ON expo_pavilion_hero(is_active);
CREATE INDEX IF NOT EXISTS idx_expo_pavilion_intro_active ON expo_pavilion_intro(is_active);
CREATE INDEX IF NOT EXISTS idx_expo_pavilion_exceptional_design_active ON expo_pavilion_exceptional_design(is_active);
CREATE INDEX IF NOT EXISTS idx_expo_pavilion_design_benefits_active ON expo_pavilion_design_benefits(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_expo_pavilion_portfolio_sections_active ON expo_pavilion_portfolio_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_expo_pavilion_portfolio_items_active ON expo_pavilion_portfolio_items(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_expo_pavilion_reasons_to_select_active ON expo_pavilion_reasons_to_select(is_active);
CREATE INDEX IF NOT EXISTS idx_expo_pavilion_looking_for_cta_active ON expo_pavilion_looking_for_cta(is_active);

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
-- This schema provides complete database support for the
-- Expo Pavilion Stand page with all sections organized
-- for easy management through the admin panel.
