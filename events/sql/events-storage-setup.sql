-- ============================================================================
-- EVENTS STORAGE BUCKETS AND POLICIES SETUP
-- ============================================================================
-- This file sets up storage buckets and policies for the events system
-- Run this separately if you need to set up storage only
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE STORAGE BUCKETS
-- ============================================================================

-- Create storage bucket for event images (featured images, thumbnails)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'event-images', 
    'event-images', 
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage bucket for event hero images (large background images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'event-hero-images', 
    'event-hero-images', 
    true,
    104857600, -- 100MB limit for hero images
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage bucket for event gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'event-gallery-images', 
    'event-gallery-images', 
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage bucket for event form attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'event-form-attachments', 
    'event-form-attachments', 
    false, -- Private bucket for form attachments
    20971520, -- 20MB limit
    ARRAY[
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg', 
        'image/png', 
        'image/webp'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- STEP 2: CREATE STORAGE POLICIES
-- ============================================================================

-- ============================================================================
-- EVENT IMAGES BUCKET POLICIES
-- ============================================================================

-- Public read access for event images
CREATE POLICY "Public read access for event images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

-- Authenticated users can upload event images
CREATE POLICY "Authenticated users can upload event images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'event-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN ('featured', 'thumbnails', 'logos')
);

-- Authenticated users can update event images
CREATE POLICY "Authenticated users can update event images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'event-images' 
    AND auth.role() = 'authenticated'
);

-- Authenticated users can delete event images
CREATE POLICY "Authenticated users can delete event images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'event-images' 
    AND auth.role() = 'authenticated'
);

-- ============================================================================
-- EVENT HERO IMAGES BUCKET POLICIES
-- ============================================================================

-- Public read access for event hero images
CREATE POLICY "Public read access for event hero images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-hero-images');

-- Authenticated users can upload event hero images
CREATE POLICY "Authenticated users can upload event hero images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'event-hero-images' 
    AND auth.role() = 'authenticated'
);

-- Authenticated users can update event hero images
CREATE POLICY "Authenticated users can update event hero images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'event-hero-images' 
    AND auth.role() = 'authenticated'
);

-- Authenticated users can delete event hero images
CREATE POLICY "Authenticated users can delete event hero images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'event-hero-images' 
    AND auth.role() = 'authenticated'
);

-- ============================================================================
-- EVENT GALLERY IMAGES BUCKET POLICIES
-- ============================================================================

-- Public read access for event gallery images
CREATE POLICY "Public read access for event gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-gallery-images');

-- Authenticated users can upload event gallery images
CREATE POLICY "Authenticated users can upload event gallery images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'event-gallery-images' 
    AND auth.role() = 'authenticated'
);

-- Authenticated users can update event gallery images
CREATE POLICY "Authenticated users can update event gallery images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'event-gallery-images' 
    AND auth.role() = 'authenticated'
);

-- Authenticated users can delete event gallery images
CREATE POLICY "Authenticated users can delete event gallery images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'event-gallery-images' 
    AND auth.role() = 'authenticated'
);

-- ============================================================================
-- EVENT FORM ATTACHMENTS BUCKET POLICIES (PRIVATE)
-- ============================================================================

-- Only authenticated users can read form attachments
CREATE POLICY "Authenticated users can read form attachments" ON storage.objects
FOR SELECT USING (
    bucket_id = 'event-form-attachments' 
    AND auth.role() = 'authenticated'
);

-- Anyone can upload form attachments (for public form submissions)
CREATE POLICY "Anyone can upload form attachments" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'event-form-attachments'
);

-- Only authenticated users can update form attachments
CREATE POLICY "Authenticated users can update form attachments" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'event-form-attachments' 
    AND auth.role() = 'authenticated'
);

-- Only authenticated users can delete form attachments
CREATE POLICY "Authenticated users can delete form attachments" ON storage.objects
FOR DELETE USING (
    bucket_id = 'event-form-attachments' 
    AND auth.role() = 'authenticated'
);

-- ============================================================================
-- STEP 3: CREATE HELPER FUNCTIONS FOR STORAGE
-- ============================================================================

-- Function to generate unique filename for uploads
CREATE OR REPLACE FUNCTION generate_unique_filename(
    original_filename TEXT,
    file_extension TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    timestamp_str TEXT;
    random_str TEXT;
    extension TEXT;
BEGIN
    -- Get current timestamp
    timestamp_str := to_char(NOW(), 'YYYYMMDDHH24MISS');
    
    -- Generate random string
    random_str := substr(md5(random()::text), 1, 8);
    
    -- Extract extension if not provided
    IF file_extension IS NULL THEN
        extension := lower(substring(original_filename from '\.([^.]*)$'));
        IF extension IS NULL THEN
            extension := '';
        ELSE
            extension := '.' || extension;
        END IF;
    ELSE
        extension := '.' || lower(file_extension);
    END IF;
    
    -- Return unique filename
    RETURN timestamp_str || '_' || random_str || extension;
END;
$$ LANGUAGE plpgsql;

-- Function to get storage URL for a file path
CREATE OR REPLACE FUNCTION get_storage_url(
    bucket_name TEXT,
    file_path TEXT
)
RETURNS TEXT AS $$
BEGIN
    -- Return the public URL for the file
    -- This assumes your Supabase project URL - update accordingly
    RETURN 'https://your-project-id.supabase.co/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up orphaned storage files
CREATE OR REPLACE FUNCTION cleanup_orphaned_event_images()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    file_record RECORD;
BEGIN
    -- Find storage objects that don't have corresponding database records
    FOR file_record IN
        SELECT name, bucket_id
        FROM storage.objects 
        WHERE bucket_id IN ('event-images', 'event-hero-images', 'event-gallery-images')
        AND name NOT IN (
            SELECT DISTINCT unnest(ARRAY[
                featured_image_url,
                hero_image_url,
                logo_image_url
            ])
            FROM events
            WHERE featured_image_url IS NOT NULL 
               OR hero_image_url IS NOT NULL 
               OR logo_image_url IS NOT NULL
            UNION
            SELECT file_path FROM event_images WHERE file_path IS NOT NULL
            UNION
            SELECT background_image_url FROM events_hero WHERE background_image_url IS NOT NULL
        )
    LOOP
        -- Delete the orphaned file
        DELETE FROM storage.objects 
        WHERE bucket_id = file_record.bucket_id AND name = file_record.name;
        
        deleted_count := deleted_count + 1;
    END LOOP;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STORAGE SETUP COMPLETE
-- ============================================================================
-- 
-- This setup provides:
-- ✅ Storage buckets for all event image types
-- ✅ Proper file size limits and MIME type restrictions
-- ✅ Public access for display images
-- ✅ Private access for form attachments
-- ✅ Comprehensive RLS policies
-- ✅ Helper functions for file management
-- ✅ Cleanup functions for orphaned files
--
-- Usage:
-- 1. Run this script in Supabase SQL Editor
-- 2. Update the get_storage_url function with your project ID
-- 3. Test file uploads through the admin interface
-- 4. Use cleanup_orphaned_event_images() periodically to clean up unused files
-- ============================================================================
