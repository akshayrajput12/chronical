-- =====================================================
-- CONTACT US PAGE DYNAMIC SCHEMA
-- =====================================================
-- This schema creates all necessary tables for dynamic contact us page management
-- including hero section, contact information, group companies, form submissions,
-- and map settings with proper RLS policies and constraints.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CONTACT PAGE HERO SECTION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_hero_section (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    title TEXT NOT NULL DEFAULT 'Contact Us',
    subtitle TEXT DEFAULT 'Our team is standing by to answer your questions and direct you to the expertise you need for your next event',
    background_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_title CHECK (length(trim(title)) > 0),
    CONSTRAINT valid_subtitle CHECK (length(trim(subtitle)) > 0)
);

-- =====================================================
-- CONTACT FORM SETTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_form_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Form Content
    form_title TEXT NOT NULL DEFAULT 'Feel Free To Write',
    form_subtitle TEXT,
    success_message TEXT DEFAULT 'Thank You for Your Message!',
    success_description TEXT DEFAULT 'We''ve received your inquiry and will get back to you within 24 hours.',
    
    -- Contact Info Sidebar
    sidebar_phone TEXT DEFAULT '+971 54 347 4645',
    sidebar_email TEXT DEFAULT 'info@chronicleexhibts.ae',
    sidebar_address TEXT DEFAULT 'Al Qouz Industrial Area 1st. No. 5B, Warehouse 14 P.O. Box 128046, Dubai – UAE',
    
    -- Form Settings
    enable_file_upload BOOLEAN DEFAULT true,
    max_file_size_mb INTEGER DEFAULT 10,
    allowed_file_types TEXT[] DEFAULT ARRAY['.pdf','.doc','.docx','.jpg','.jpeg','.png'],
    require_terms_agreement BOOLEAN DEFAULT true,
    terms_text TEXT DEFAULT 'By clicking submit, you agree to our Terms and Conditions',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_form_title CHECK (length(trim(form_title)) > 0),
    CONSTRAINT valid_success_message CHECK (length(trim(success_message)) > 0),
    CONSTRAINT positive_file_size CHECK (max_file_size_mb > 0)
);

-- =====================================================
-- GROUP COMPANIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_group_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Company Details
    region TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,

    -- Display Settings
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_region CHECK (length(trim(region)) > 0),
    CONSTRAINT valid_address CHECK (length(trim(address)) > 0),
    CONSTRAINT valid_phone CHECK (length(trim(phone)) > 0),
    CONSTRAINT valid_email CHECK (length(trim(email)) > 0 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT unique_region UNIQUE (region)
);

-- =====================================================
-- CONTACT FORM SUBMISSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Form Data
    name TEXT NOT NULL,
    exhibition_name TEXT,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    
    -- File Upload
    attachment_url TEXT,
    attachment_filename TEXT,
    attachment_size BIGINT,
    attachment_type TEXT,
    
    -- Terms Agreement
    agreed_to_terms BOOLEAN DEFAULT false,
    
    -- Status & Processing
    status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived', 'spam'
    is_spam BOOLEAN DEFAULT false,
    spam_score DECIMAL(3,2) DEFAULT 0.0,
    
    -- Admin Management
    admin_notes TEXT,
    handled_by UUID, -- Reference to admin user
    handled_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_name CHECK (length(trim(name)) > 0),
    CONSTRAINT valid_email CHECK (length(trim(email)) > 0 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_message CHECK (length(trim(message)) > 0),
    CONSTRAINT valid_status CHECK (status IN ('new', 'read', 'replied', 'archived', 'spam')),
    CONSTRAINT valid_spam_score CHECK (spam_score >= 0.0 AND spam_score <= 1.0),
    CONSTRAINT positive_attachment_size CHECK (attachment_size IS NULL OR attachment_size > 0)
);

-- =====================================================
-- MAP AND PARKING SETTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_map_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Map Configuration
    map_embed_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5139890547107!2d55.38061577600814!3d25.28692967765328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f42e5a9ddaf97%3A0x563a582dbda7f14c!2sChronicle%20Exhibition%20Organizing%20L.L.C%20%7C%20Exhibition%20Stand%20Builder%20in%20Dubai%2C%20UAE%20-%20Middle%20East!5e0!3m2!1sen!2sin!4v1750325309116!5m2!1sen!2sin',
    map_title TEXT DEFAULT 'Dubai World Trade Centre Location',
    map_height INTEGER DEFAULT 400,
    
    -- Parking Section
    parking_title TEXT DEFAULT 'On-site parking at Dubai World Trade Centre',
    parking_description TEXT DEFAULT 'PLAN YOUR ARRIVAL BY EXPLORING OUR USEFUL PARKING AND ACCESSIBILITY MAPS.',
    parking_background_image TEXT DEFAULT 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    parking_maps_download_url TEXT DEFAULT '#',
    google_maps_url TEXT DEFAULT 'https://maps.google.com',
    
    -- Display Settings
    show_parking_section BOOLEAN DEFAULT true,
    show_map_section BOOLEAN DEFAULT true,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_map_embed_url CHECK (length(trim(map_embed_url)) > 0),
    CONSTRAINT valid_map_title CHECK (length(trim(map_title)) > 0),
    CONSTRAINT positive_map_height CHECK (map_height > 0)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Contact form submissions indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_form_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_is_spam ON contact_form_submissions(is_spam);

-- Group companies indexes
CREATE INDEX IF NOT EXISTS idx_group_companies_sort_order ON contact_group_companies(sort_order);
CREATE INDEX IF NOT EXISTS idx_group_companies_active ON contact_group_companies(is_active);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE contact_hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_form_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_group_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_map_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for content tables (hero, form settings, group companies, map settings)
CREATE POLICY "Public can read contact hero section" ON contact_hero_section
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read contact form settings" ON contact_form_settings
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read group companies" ON contact_group_companies
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read map settings" ON contact_map_settings
    FOR SELECT USING (is_active = true);

-- Public can insert form submissions (for contact form)
DROP POLICY IF EXISTS "Public can insert form submissions" ON contact_form_submissions;
CREATE POLICY "Public can insert form submissions" ON contact_form_submissions
    FOR INSERT WITH CHECK (true);

-- Admin full access policies (assuming admin role exists)
CREATE POLICY "Admin full access to contact hero section" ON contact_hero_section
    FOR ALL USING (auth.role() = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admin full access to contact form settings" ON contact_form_settings
    FOR ALL USING (auth.role() = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admin full access to group companies" ON contact_group_companies
    FOR ALL USING (auth.role() = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admin full access to form submissions" ON contact_form_submissions
    FOR ALL USING (auth.role() = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admin full access to map settings" ON contact_map_settings
    FOR ALL USING (auth.role() = 'admin' OR auth.role() = 'service_role');

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_contact_hero_section_updated_at
    BEFORE UPDATE ON contact_hero_section
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_form_settings_updated_at
    BEFORE UPDATE ON contact_form_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_group_companies_updated_at
    BEFORE UPDATE ON contact_group_companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_form_submissions_updated_at
    BEFORE UPDATE ON contact_form_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_map_settings_updated_at
    BEFORE UPDATE ON contact_map_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA INSERTION
-- =====================================================

-- Insert default hero section data
INSERT INTO contact_hero_section (title, subtitle, background_image_url, is_active)
VALUES (
    'Contact Us',
    'Our team is standing by to answer your questions and direct you to the expertise you need for your next event',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    true
) ON CONFLICT DO NOTHING;

-- Insert default form settings
INSERT INTO contact_form_settings (
    form_title,
    success_message,
    success_description,
    sidebar_phone,
    sidebar_email,
    sidebar_address,
    enable_file_upload,
    max_file_size_mb,
    allowed_file_types,
    require_terms_agreement,
    terms_text,
    is_active
) VALUES (
    'Feel Free To Write',
    'Thank You for Your Message!',
    'We''ve received your inquiry and will get back to you within 24 hours.',
    '+971 54 347 4645',
    'info@chronicleexhibts.ae',
    'Al Qouz Industrial Area 1st. No. 5B, Warehouse 14 P.O. Box 128046, Dubai – UAE',
    true,
    10,
    ARRAY['.pdf','.doc','.docx','.jpg','.jpeg','.png'],
    true,
    'By clicking submit, you agree to our Terms and Conditions',
    true
) ON CONFLICT DO NOTHING;

-- Insert group companies data
INSERT INTO contact_group_companies (region, address, phone, email, sort_order, is_active)
VALUES
    (
        'Europe',
        'Zum see 7, 14542 Werder (Havel), Germany',
        '+49 (0) 33 2774 99-100',
        'enquiry@triumfo.de',
        1,
        true
    ),
    (
        'United States',
        '2782 Abels Ln, Las Vegas, NV 89115, USA',
        '+1 702 992 0440',
        'enquiry@triumfo.us',
        2,
        true
    ),
    (
        'India',
        'A-65 Sector-83, Phase II, Noida – 201305, India',
        '+91-0120-4690699',
        'enquiry@triumfo.in',
        3,
        true
    )
ON CONFLICT (region) DO NOTHING;

-- Insert default map settings
INSERT INTO contact_map_settings (
    map_embed_url,
    map_title,
    map_height,
    parking_title,
    parking_description,
    parking_background_image,
    parking_maps_download_url,
    google_maps_url,
    show_parking_section,
    show_map_section,
    is_active
) VALUES (
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5139890547107!2d55.38061577600814!3d25.28692967765328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f42e5a9ddaf97%3A0x563a582dbda7f14c!2sChronicle%20Exhibition%20Organizing%20L.L.C%20%7C%20Exhibition%20Stand%20Builder%20in%20Dubai%2C%20UAE%20-%20Middle%20East!5e0!3m2!1sen!2sin!4v1750325309116!5m2!1sen!2sin',
    'Dubai World Trade Centre Location',
    400,
    'On-site parking at Dubai World Trade Centre',
    'PLAN YOUR ARRIVAL BY EXPLORING OUR USEFUL PARKING AND ACCESSIBILITY MAPS.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    '#',
    'https://maps.google.com',
    true,
    true,
    true
) ON CONFLICT DO NOTHING;

-- =====================================================
-- STORAGE BUCKET SETUP
-- =====================================================

-- Create storage bucket for contact images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'contact-images',
    'contact-images',
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for contact form attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'contact-attachments',
    'contact-attachments',
    false,
    10485760, -- 10MB limit
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for contact admin uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'contact-admin-uploads',
    'contact-admin-uploads',
    false,
    104857600, -- 100MB limit
    ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for contact images
CREATE POLICY "Public can view contact images" ON storage.objects
    FOR SELECT USING (bucket_id = 'contact-images');

CREATE POLICY "Authenticated users can upload contact images" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'contact-images');

CREATE POLICY "Authenticated users can update contact images" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'contact-images');

CREATE POLICY "Authenticated users can delete contact images" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'contact-images');

-- Storage policies for contact attachments
CREATE POLICY "Public can upload contact attachments" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'contact-attachments');

CREATE POLICY "Admin can view contact attachments" ON storage.objects
    FOR SELECT USING (bucket_id = 'contact-attachments' AND (auth.role() = 'admin' OR auth.role() = 'service_role'));

CREATE POLICY "Admin can delete contact attachments" ON storage.objects
    FOR DELETE USING (bucket_id = 'contact-attachments' AND (auth.role() = 'admin' OR auth.role() = 'service_role'));

-- Storage policies for contact admin uploads
CREATE POLICY "Authenticated users can view admin uploads" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'contact-admin-uploads');

CREATE POLICY "Authenticated users can upload admin files" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'contact-admin-uploads');

CREATE POLICY "Authenticated users can update admin files" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'contact-admin-uploads');

CREATE POLICY "Authenticated users can delete admin files" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'contact-admin-uploads');
