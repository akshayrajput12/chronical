-- =====================================================
-- CREATE CONTACT ATTACHMENTS STORAGE BUCKET
-- =====================================================
-- This script creates the contact-attachments storage bucket for
-- storing file attachments from contact forms and booth requirements

-- Create the contact-attachments bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'contact-attachments',
    'contact-attachments',
    true,  -- Make bucket public so files can be accessed via URL
    52428800,  -- 50MB file size limit
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'text/plain',
        'application/zip',
        'application/x-zip-compressed'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create RLS policies for the contact-attachments bucket
-- Allow public uploads (for contact forms)
CREATE POLICY "Public can upload contact attachments" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'contact-attachments');

-- Allow public read access to contact attachments
CREATE POLICY "Public can view contact attachments" ON storage.objects
    FOR SELECT USING (bucket_id = 'contact-attachments');

-- Allow admin full access to contact attachments
CREATE POLICY "Admin full access to contact attachments" ON storage.objects
    FOR ALL USING (
        bucket_id = 'contact-attachments' AND 
        (auth.role() = 'admin' OR auth.role() = 'service_role')
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_contact_attachments 
    ON storage.objects(bucket_id, name) 
    WHERE bucket_id = 'contact-attachments';

-- Grant necessary permissions
GRANT ALL ON storage.objects TO public;
GRANT ALL ON storage.buckets TO public;
