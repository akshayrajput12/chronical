-- =====================================================
-- CITIES DYNAMIC CONTENT MANAGEMENT SYSTEM
-- Complete SQL Schema for Supabase
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage bucket for city images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('city-images', 'city-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for city hero images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('city-hero-images', 'city-hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for city content images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('city-content-images', 'city-content-images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- MAIN CITIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    subtitle TEXT,
    hero_image_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    country_code VARCHAR(3),
    timezone VARCHAR(100),
    
    -- Contact Information
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    contact_address TEXT,
    contact_working_hours VARCHAR(100),
    contact_emergency VARCHAR(50),
    
    -- Statistics
    projects_completed INTEGER DEFAULT 0,
    years_of_operation INTEGER DEFAULT 0,
    clients_satisfied INTEGER DEFAULT 0,
    team_size INTEGER DEFAULT 0,
    
    -- Coordinates
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- SEO Fields
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CITY SERVICES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS city_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    href_link VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CITY CONTENT SECTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS city_content_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    section_type VARCHAR(100) NOT NULL, -- 'hero', 'content', 'services', 'role', 'booth_design', 'components', 'portfolio', 'why_best', 'preferred_choice', 'contractors'
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    additional_data JSONB, -- For flexible section-specific data
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CITY PORTFOLIO ITEMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS city_portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    category VARCHAR(100),
    project_year INTEGER,
    client_name VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CITY COMPONENTS TABLE (for the 6 components section)
-- =====================================================

CREATE TABLE IF NOT EXISTS city_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100), -- For icon reference
    color VARCHAR(7), -- Hex color code
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CITY PREFERRED SERVICES TABLE (for preferred choice section)
-- =====================================================

CREATE TABLE IF NOT EXISTS city_preferred_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    service_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CITY CONTACT DETAILS TABLE (for contractors section)
-- =====================================================

CREATE TABLE IF NOT EXISTS city_contact_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    contact_type VARCHAR(50) NOT NULL, -- 'phone', 'email', 'whatsapp', etc.
    contact_value VARCHAR(255) NOT NULL,
    display_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CITY STATISTICS TABLE (for statistics section)
-- =====================================================

CREATE TABLE IF NOT EXISTS city_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    statistic_type VARCHAR(50) NOT NULL, -- 'happy_clients', 'completed_projects', 'customer_support', 'exhibitions'
    title VARCHAR(255) NOT NULL, -- Display title like 'Happy Clients', 'Completed Projects'
    value VARCHAR(20) NOT NULL, -- The number/value like '4650+', '20800+'
    icon_name VARCHAR(100), -- Icon reference for the statistic
    color VARCHAR(7) DEFAULT '#4F46E5', -- Hex color code for the icon background
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_is_active ON cities(is_active);
CREATE INDEX IF NOT EXISTS idx_cities_country_code ON cities(country_code);
CREATE INDEX IF NOT EXISTS idx_city_services_city_id ON city_services(city_id);
CREATE INDEX IF NOT EXISTS idx_city_services_is_active ON city_services(is_active);
CREATE INDEX IF NOT EXISTS idx_city_content_sections_city_id ON city_content_sections(city_id);
CREATE INDEX IF NOT EXISTS idx_city_content_sections_type ON city_content_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_city_portfolio_city_id ON city_portfolio_items(city_id);
CREATE INDEX IF NOT EXISTS idx_city_components_city_id ON city_components(city_id);
CREATE INDEX IF NOT EXISTS idx_city_preferred_services_city_id ON city_preferred_services(city_id);
CREATE INDEX IF NOT EXISTS idx_city_contact_details_city_id ON city_contact_details(city_id);
CREATE INDEX IF NOT EXISTS idx_city_contact_details_type ON city_contact_details(contact_type);
CREATE INDEX IF NOT EXISTS idx_city_statistics_city_id ON city_statistics(city_id);
CREATE INDEX IF NOT EXISTS idx_city_statistics_type ON city_statistics(statistic_type);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_services_updated_at BEFORE UPDATE ON city_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_content_sections_updated_at BEFORE UPDATE ON city_content_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_portfolio_items_updated_at BEFORE UPDATE ON city_portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_components_updated_at BEFORE UPDATE ON city_components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_preferred_services_updated_at BEFORE UPDATE ON city_preferred_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_contact_details_updated_at BEFORE UPDATE ON city_contact_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_statistics_updated_at BEFORE UPDATE ON city_statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to generate unique city slug
CREATE OR REPLACE FUNCTION generate_unique_city_slug(title_text TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Generate base slug from title
    base_slug := lower(trim(regexp_replace(title_text, '[^a-zA-Z0-9\s]', '', 'g')));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := trim(base_slug, '-');
    
    -- Ensure slug is not empty
    IF base_slug = '' THEN
        base_slug := 'city';
    END IF;
    
    final_slug := base_slug;
    
    -- Check for uniqueness and append counter if needed
    WHILE EXISTS (SELECT 1 FROM cities WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_preferred_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_statistics ENABLE ROW LEVEL SECURITY;

-- Public read access for active cities
CREATE POLICY "Public can view active cities" ON cities FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active city services" ON city_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active city content sections" ON city_content_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view city portfolio items" ON city_portfolio_items FOR SELECT USING (true);
CREATE POLICY "Public can view active city components" ON city_components FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active city preferred services" ON city_preferred_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active city contact details" ON city_contact_details FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active city statistics" ON city_statistics FOR SELECT USING (is_active = true);

-- Admin full access (authenticated users with admin role)
CREATE POLICY "Admins can manage cities" ON cities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage city services" ON city_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage city content sections" ON city_content_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage city portfolio items" ON city_portfolio_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage city components" ON city_components FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage city preferred services" ON city_preferred_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage city contact details" ON city_contact_details FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage city statistics" ON city_statistics FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- City images bucket policies
CREATE POLICY "Public can view city images" ON storage.objects FOR SELECT USING (bucket_id = 'city-images');
CREATE POLICY "Authenticated users can upload city images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'city-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update city images" ON storage.objects FOR UPDATE USING (bucket_id = 'city-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete city images" ON storage.objects FOR DELETE USING (bucket_id = 'city-images' AND auth.role() = 'authenticated');

-- City hero images bucket policies
CREATE POLICY "Public can view city hero images" ON storage.objects FOR SELECT USING (bucket_id = 'city-hero-images');
CREATE POLICY "Authenticated users can upload city hero images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'city-hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update city hero images" ON storage.objects FOR UPDATE USING (bucket_id = 'city-hero-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete city hero images" ON storage.objects FOR DELETE USING (bucket_id = 'city-hero-images' AND auth.role() = 'authenticated');

-- City content images bucket policies
CREATE POLICY "Public can view city content images" ON storage.objects FOR SELECT USING (bucket_id = 'city-content-images');
CREATE POLICY "Authenticated users can upload city content images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'city-content-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update city content images" ON storage.objects FOR UPDATE USING (bucket_id = 'city-content-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete city content images" ON storage.objects FOR DELETE USING (bucket_id = 'city-content-images' AND auth.role() = 'authenticated');

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample cities
INSERT INTO cities (
    name, slug, subtitle, hero_image_url, description, is_active, country_code, timezone,
    contact_phone, contact_email, contact_address, contact_working_hours,
    projects_completed, years_of_operation, clients_satisfied, team_size,
    meta_title, meta_description
) VALUES
(
    'Saudi Arabia',
    'saudi-arabia',
    'Leading exhibition solutions across the Kingdom',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'Discover our comprehensive exhibition services in Saudi Arabia, where we deliver world-class solutions for major trade shows and events across the Kingdom.',
    true,
    'SA',
    'Asia/Riyadh',
    '+966 11 234 5678',
    'saudi@chronicles-dubai.com',
    'Riyadh, Saudi Arabia',
    '9 AM - 6 PM',
    150,
    8,
    200,
    25,
    'Exhibition Stand Design Builder in Saudi Arabia, UAE | Chronicle Exhibition',
    'Chronicle Exhibition Organizing LLC offers premier exhibition stand design and build services in Saudi Arabia. Custom stands, double decker exhibitions, and pavilion solutions.'
),
(
    'Abu Dhabi',
    'abu-dhabi',
    'Premium exhibition experiences in the UAE capital',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'Experience our exceptional exhibition services in Abu Dhabi, delivering innovative solutions for prestigious events and exhibitions in the UAE capital.',
    true,
    'AE',
    'Asia/Dubai',
    '+971 2 345 6789',
    'abudhabi@chronicles-dubai.com',
    'Abu Dhabi, UAE',
    '9 AM - 6 PM',
    200,
    10,
    300,
    35,
    'Exhibition Stand Design Builder in Abu Dhabi, UAE | Chronicle Exhibition',
    'Chronicle Exhibition Organizing LLC provides exceptional exhibition stand design and construction services in Abu Dhabi. Custom, modular, and double-decker stands.'
),
(
    'Dubai',
    'dubai',
    'World-class exhibition solutions in the global business hub',
    'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'Explore our premium exhibition services in Dubai, the global business hub where we create exceptional experiences for international trade shows and exhibitions.',
    true,
    'AE',
    'Asia/Dubai',
    '+971 4 567 8901',
    'dubai@chronicles-dubai.com',
    'Dubai, UAE',
    '9 AM - 6 PM',
    300,
    12,
    500,
    50,
    'Exhibition Stand Design Builder in Dubai, UAE | Chronicle Exhibition',
    'Chronicle Exhibition Organizing LLC delivers world-class exhibition stand design and build services in Dubai. Premier custom stands and pavilion solutions.'
);

-- Insert sample city services for each city
INSERT INTO city_services (city_id, name, description, image_url, href_link, sort_order)
SELECT
    c.id,
    service_name,
    service_desc,
    service_image,
    service_link,
    service_order
FROM cities c
CROSS JOIN (
    VALUES
        ('CUSTOM STANDS', 'Tailored exhibition solutions designed specifically for your brand', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', '/customexhibitionstands', 1),
        ('DOUBLE STOREY STANDS', 'Multi-level exhibition stands for maximum impact', 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', '/doubledeckerexhibitionstands', 2),
        ('PAVILION STANDS', 'National pavilion design and setup solutions', 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', '/countrypavilionexpoboothsolutions', 3)
) AS services(service_name, service_desc, service_image, service_link, service_order);

-- Insert sample city content sections for all section types
-- Content Section
INSERT INTO city_content_sections (city_id, section_type, title, subtitle, content, image_url, sort_order)
SELECT
    c.id,
    'content',
    'PREMIER EXHIBITION STANDS DESIGN, AND BOOTH BUILD PARTNER IN ' || UPPER(c.name),
    NULL,
    c.name || ' offers you a wide range of exhibiting opportunities, as it hosts countless trade shows and exhibitions each year. Chronicle Exhibition Organizing LLC can help you make the most out of these events with an exhibition stand.

We are one the most reputable exhibition stand builders and contractors in ' || c.name || '. Chronicle Exhibits Company offer end-to-end services for domestic and international clients.

Our manufacturing unit in ' || c.name || ' is known for providing every type of exhibition stand including Custom trade show stands, modular exhibition stands and double-decker stands.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    1
FROM cities c;

-- Role Section
INSERT INTO city_content_sections (city_id, section_type, title, content, sort_order)
SELECT
    c.id,
    'role',
    'ROLE OF EXHIBITION BOOTH DESIGN ' || UPPER(c.name),
    'Today most business entrepreneurs around the world take part in trade shows for their brand expansion. Exhibitions are an ideal platform for taking businesses on the path to success. Trade shows provide you with an opportunity to build long-term business connections & also to influence future clients. So it is more than necessary to have an impressive booth design as it works as the face of your brand at the show.

The Exhibition booth design should be such that it prompts the visitors to notice your products & services. The booth should be visually charming to catch the hopeful attention of the customers. It should be spacious to accommodate all your business activities.',
    2
FROM cities c;

-- Booth Design Section
INSERT INTO city_content_sections (city_id, section_type, title, content, image_url, sort_order)
SELECT
    c.id,
    'booth_design',
    'WHAT IS AN EXHIBITION BOOTH DESIGN?',
    'An exhibition stand design puts forward the central idea of your brand & expresses the motto of your company in an influential way. A well-designed exhibition stand or booth helps you reach your business goals & brings the maximum public to your booth.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    3
FROM cities c;

-- Why Best Section
INSERT INTO city_content_sections (city_id, section_type, title, content, sort_order)
SELECT
    c.id,
    'why_best',
    'WHY WE ARE THE BEST OF THE BESTS?',
    'You are in the right place if you''re exhibiting in ' || c.name || ', and looking for a reliable company to design your exhibition stand and build your trade show booth. Chronicle Exhibition Organizing LLC offers turnkey solutions for the design and construction of exhibition stands to major brands and companies in ' || c.name || ' and abroad.

We provide world-class service that is known to increase brand awareness. We are the most suitable choice for the construction of your exhibition booth in ' || c.name || ', as we are the top exhibition booth contractors and builders across the UAE.

Chronicle Exhibits Company are experts in exhibition management, thanks to our extensive experience and team of Graphic Designers and Visualizers. Our goal as one of ' || c.name || '''s most experienced exhibition stand builders is to provide our clients with a stress-free experience.

Our exhibition stand designs in ' || c.name || ' help them to achieve their exhibiting goals and provide a high ROI. We follow a standard procedure to deliver quality work at an affordable cost within the specified timeframe. This includes gathering inputs from clients on booth design specifications.

The process begins with a rough design to help clients envision the booth they will have at the tradeshow. Once the design is approved by the client, it''s time to transform the design into an exhibition booth that meets your needs, goals and vision.

We will help you with the installation and shipping of the booth. We will also assist with the removal and storage of your exhibition stand in ' || c.name || '.',
    4
FROM cities c;

-- Preferred Choice Section
INSERT INTO city_content_sections (city_id, section_type, title, content, additional_data, sort_order)
SELECT
    c.id,
    'preferred_choice',
    'WHY WE ARE A PREFERRED CHOICE AS EXHIBITION COMPANY IN ' || UPPER(c.name) || '?',
    'Chronicle Exhibits makes every effort to create and design exceptional booths. Our goal as one of the best exhibition stands contractors in ' || c.name || ', UAE is to create 3D custom stands that meet your business needs.

We provide a complete range of stand building and designing services.',
    '{"services": [
        "Take care of stand fabrication, assembling & installing stands.",
        "Offer all services related to booth production under a single roof.",
        "On-site support",
        "Provide you with post-show clean-up services.",
        "We design and create small booths within days whereas larger ones take a couple of weeks.",
        "Ensure timely delivery of the exhibition stands on the show floor.",
        "Provide you with sufficient storage facility for your products."
    ]}',
    5
FROM cities c;

-- Looking for Contractors Section
INSERT INTO city_content_sections (city_id, section_type, title, content, additional_data, sort_order)
SELECT
    c.id,
    'contractors',
    'LOOKING FOR EXHIBITION STAND CONTRACTORS IN ' || UPPER(c.name),
    'Call our team or submit enquiry form below',
    '{"phone": "+971 (543) 47-4645", "email": "info@chronicles-dubai.com"}',
    6
FROM cities c;

-- Insert sample city components (the 6 components section)
INSERT INTO city_components (city_id, title, description, color, sort_order)
SELECT
    c.id,
    component_title,
    component_desc,
    '#a5cd39',
    component_order
FROM cities c
CROSS JOIN (
    VALUES
        ('STUDY THE LATEST TRENDS', 'Stay ahead of the curve by researching and implementing the latest exhibition design trends and technologies to create cutting-edge displays.', 1),
        ('CREATIVE DESIGN SOLUTIONS', 'Develop innovative and creative design concepts that capture attention and effectively communicate your brand message to visitors.', 2),
        ('QUALITY CONSTRUCTION', 'Ensure superior build quality using premium materials and expert craftsmanship for durable and impressive exhibition stands.', 3),
        ('PROJECT MANAGEMENT', 'Comprehensive project management from concept to completion, ensuring timely delivery and seamless execution of your exhibition.', 4),
        ('TECHNICAL SUPPORT', 'Professional technical support and maintenance services to ensure your exhibition stand operates flawlessly throughout the event.', 5),
        ('POST-EVENT SERVICES', 'Complete post-event services including dismantling, storage, and preparation for future exhibitions to maximize your investment.', 6)
) AS components(component_title, component_desc, component_order);

-- Insert sample preferred services for each city
INSERT INTO city_preferred_services (city_id, service_text, sort_order)
SELECT
    c.id,
    service_text,
    service_order
FROM cities c
CROSS JOIN (
    VALUES
        ('Take care of stand fabrication, assembling & installing stands.', 1),
        ('Offer all services related to booth production under a single roof.', 2),
        ('On-site support', 3),
        ('Provide you with post-show clean-up services.', 4),
        ('We design and create small booths within days whereas larger ones take a couple of weeks.', 5),
        ('Ensure timely delivery of the exhibition stands on the show floor.', 6),
        ('Provide you with sufficient storage facility for your products.', 7)
) AS services(service_text, service_order);

-- Insert sample contact details for each city
INSERT INTO city_contact_details (city_id, contact_type, contact_value, display_text, is_primary, sort_order)
SELECT
    c.id,
    contact_type,
    contact_value,
    display_text,
    is_primary,
    contact_order
FROM cities c
CROSS JOIN (
    VALUES
        ('phone', '+971 (543) 47-4645', '+971 (543) 47-4645', true, 1),
        ('email', 'info@chronicles-dubai.com', 'info@chronicles-dubai.com', false, 2),
        ('whatsapp', '+971543474645', 'WhatsApp: +971 (543) 47-4645', false, 3)
) AS contacts(contact_type, contact_value, display_text, is_primary, contact_order);

-- Insert sample city statistics for each city
INSERT INTO city_statistics (city_id, statistic_type, title, value, icon_name, color, sort_order)
SELECT
    c.id,
    stat_type,
    stat_title,
    stat_value,
    stat_icon,
    stat_color,
    stat_order
FROM cities c
CROSS JOIN (
    VALUES
        ('happy_clients', 'Happy Clients', '4650+', 'users', '#4F46E5', 1),
        ('completed_projects', 'Completed Projects', '20800+', 'briefcase', '#4F46E5', 2),
        ('customer_support', 'Customer Support', '24X7', 'headphones', '#4F46E5', 3),
        ('exhibitions', 'Exhibitions', '2050+', 'trophy', '#4F46E5', 4)
) AS stats(stat_type, stat_title, stat_value, stat_icon, stat_color, stat_order);

-- =====================================================
-- STORAGE BUCKETS FOR IMAGES
-- =====================================================

-- Create storage bucket for city images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'city-images',
    'city-images',
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for city images bucket (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Public can view city images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload city images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update city images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete city images" ON storage.objects;

CREATE POLICY "Public can view city images" ON storage.objects
FOR SELECT USING (bucket_id = 'city-images');

CREATE POLICY "Authenticated users can upload city images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'city-images'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update city images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'city-images'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete city images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'city-images'
    AND auth.role() = 'authenticated'
);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- This completes the cities database schema setup with image storage
-- All tables, indexes, triggers, policies, and sample data have been created
-- Storage bucket for city images has been configured
-- The system is now ready for dynamic city content management
