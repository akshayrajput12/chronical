-- Create new_company_section table
CREATE TABLE IF NOT EXISTS new_company_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description_1 TEXT NOT NULL,
  description_2 TEXT NOT NULL,
  button_text TEXT NOT NULL,
  button_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create new_company_images table for the image grid
CREATE TABLE IF NOT EXISTS new_company_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  section_id UUID NOT NULL REFERENCES new_company_section(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  column_number INTEGER NOT NULL CHECK (column_number BETWEEN 1 AND 3),
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create storage bucket for new company images
CREATE POLICY "Public Access to new_company_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'new_company_images');

-- Allow authenticated users to upload to the new_company_images bucket
CREATE POLICY "Authenticated users can upload new_company_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'new_company_images');

-- Allow authenticated users to update their own objects in the new_company_images bucket
CREATE POLICY "Authenticated users can update their own new_company_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'new_company_images' AND auth.uid() = owner);

-- Allow authenticated users to delete their own objects in the new_company_images bucket
CREATE POLICY "Authenticated users can delete their own new_company_images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'new_company_images' AND auth.uid() = owner);

-- Insert initial data for new_company_section
INSERT INTO new_company_section (
  title,
  subtitle,
  description_1,
  description_2,
  button_text,
  button_url,
  is_active
) VALUES (
  'New Company',
  'Formation',
  'Forming a new company has never been easier and can be done online from anywhere in the world using our simple eServices platform. If you are a startup or SME looking to gain traction in a highly competitive landscape, we offer a range of packages that can be customised to suit your specific needs.',
  'From determining your new company structure to defining different business activities or more regulated licenses and exploring the most cost-effective working environment for your operation, our free zone team is on hand to support you every step of the way for a hassle-free experience that gets you up and running without delay.',
  'LEARN MORE',
  '/services/company-formation',
  true
) ON CONFLICT (id) DO NOTHING;

-- Get the section ID for the foreign key reference
DO $$
DECLARE
  section_id UUID;
BEGIN
  SELECT id INTO section_id FROM new_company_section LIMIT 1;

  -- Insert initial data for column 1 images
  INSERT INTO new_company_images (section_id, image_url, image_alt, column_number, display_order, is_active)
  VALUES
    (section_id, 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf', 'Business professional in suit', 1, 1, true),
    (section_id, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', 'Business woman with laptop', 1, 2, true),
    (section_id, 'https://images.unsplash.com/photo-1560250097-0b93528c311a', 'Business man with briefcase', 1, 3, true),
    (section_id, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', 'Team collaboration', 1, 4, true),
    (section_id, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72', 'Modern office space', 1, 5, true),
    (section_id, 'https://images.unsplash.com/photo-1497215842964-222b430dc094', 'Office with natural light', 1, 6, true),
    (section_id, 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', 'Business meeting', 1, 7, true),
    (section_id, 'https://images.unsplash.com/photo-1552664730-d307ca884978', 'Team planning session', 1, 8, true);

  -- Insert initial data for column 2 images
  INSERT INTO new_company_images (section_id, image_url, image_alt, column_number, display_order, is_active)
  VALUES
    (section_id, 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21', 'Professional woman in business', 2, 1, true),
    (section_id, 'https://images.unsplash.com/photo-1600878459138-e1123b37cb30', 'Business woman with phone', 2, 2, true),
    (section_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf', 'Business man smiling', 2, 3, true),
    (section_id, 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e', 'Professional woman with tablet', 2, 4, true),
    (section_id, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', 'Urban business district', 2, 5, true),
    (section_id, 'https://images.unsplash.com/photo-1462396240927-52058a6a84ec', 'City skyscrapers', 2, 6, true),
    (section_id, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', 'Business technology', 2, 7, true),
    (section_id, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', 'Person working on laptop', 2, 8, true);

  -- Insert initial data for column 3 images
  INSERT INTO new_company_images (section_id, image_url, image_alt, column_number, display_order, is_active)
  VALUES
    (section_id, 'https://images.unsplash.com/photo-1560250097-0b93528c311a', 'Business professional', 3, 1, true),
    (section_id, 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf', 'Business man in suit', 3, 2, true),
    (section_id, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', 'Business woman smiling', 3, 3, true),
    (section_id, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', 'Team meeting', 3, 4, true),
    (section_id, 'https://images.unsplash.com/photo-1554469384-e58fac16e23a', 'Modern architecture', 3, 5, true),
    (section_id, 'https://images.unsplash.com/photo-1577760258779-e787a1733016', 'Glass building', 3, 6, true),
    (section_id, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7', 'Business collaboration', 3, 7, true),
    (section_id, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', 'Team working together', 3, 8, true);
END $$;
