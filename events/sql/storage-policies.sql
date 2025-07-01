-- Storage bucket policies for event images
-- Run this in your Supabase SQL editor to allow image uploads

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Allow anonymous uploads to event-images bucket (for testing)
CREATE POLICY "Allow anonymous uploads to event-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'event-images');

-- Allow anonymous reads from event-images bucket
CREATE POLICY "Allow anonymous reads from event-images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

-- Allow anonymous updates to event-images bucket (for admin operations)
CREATE POLICY "Allow anonymous updates to event-images" ON storage.objects
FOR UPDATE USING (bucket_id = 'event-images');

-- Allow anonymous deletes from event-images bucket (for admin operations)
CREATE POLICY "Allow anonymous deletes from event-images" ON storage.objects
FOR DELETE USING (bucket_id = 'event-images');

-- Note: In production, replace these with proper authentication policies
-- Example production policy:
-- CREATE POLICY "Authenticated users can upload to event-images" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');
