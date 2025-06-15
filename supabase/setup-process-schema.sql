-- Setup Process Schema for Supabase
-- This file contains the SQL schema for the setup process section of the Chronicle Exhibits website

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create setup_process_section table for general section settings
CREATE TABLE IF NOT EXISTS setup_process_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Create setup_process_steps table for individual steps
CREATE TABLE IF NOT EXISTS setup_process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  section_id UUID NOT NULL REFERENCES setup_process_section(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  step_number INTEGER NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('diamond', 'circle')),
  category TEXT NOT NULL CHECK (category IN ('how_to_apply', 'getting_started')),
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(section_id, display_order),
  UNIQUE(section_id, step_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_setup_process_steps_section_id ON setup_process_steps(section_id);
CREATE INDEX IF NOT EXISTS idx_setup_process_steps_display_order ON setup_process_steps(display_order);
CREATE INDEX IF NOT EXISTS idx_setup_process_steps_category ON setup_process_steps(category);

-- Enable Row Level Security (RLS)
ALTER TABLE setup_process_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup_process_steps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for setup_process_section
CREATE POLICY "Public can view setup process section" ON setup_process_section
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage setup process section" ON setup_process_section
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create RLS policies for setup_process_steps
CREATE POLICY "Public can view setup process steps" ON setup_process_steps
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage setup process steps" ON setup_process_steps
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert initial data for setup_process_section
INSERT INTO setup_process_section (
  title,
  subtitle,
  background_image_url,
  is_active
) VALUES (
  'Setting Up Your Business',
  'Form a new company with quick and easy steps via our eServices platform.',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
  true
) ON CONFLICT DO NOTHING;

-- Get the section ID for the foreign key reference
DO $$
DECLARE
  section_id UUID;
BEGIN
  SELECT id INTO section_id FROM setup_process_section WHERE is_active = true LIMIT 1;

  -- Insert initial data for setup process steps
  INSERT INTO setup_process_steps (
    section_id,
    title,
    description,
    step_number,
    step_type,
    category,
    display_order,
    is_active
  ) VALUES
    (
      section_id,
      'Determine Company Type',
      'Choose the right company structure for your business needs',
      1,
      'diamond',
      'how_to_apply',
      1,
      true
    ),
    (
      section_id,
      'Select Business Activity & License Type',
      'Pick your business activities and required licenses',
      2,
      'diamond',
      'how_to_apply',
      2,
      true
    ),
    (
      section_id,
      'Consider Your Office Solutions',
      'Explore office space and virtual office options',
      3,
      'diamond',
      'how_to_apply',
      3,
      true
    ),
    (
      section_id,
      'Submit Your Application',
      'Complete and submit your business setup application',
      4,
      'circle',
      'getting_started',
      4,
      true
    ),
    (
      section_id,
      'Receive Initial Approval',
      'Get your initial approval and start your business journey',
      5,
      'circle',
      'getting_started',
      5,
      true
    )
  ON CONFLICT DO NOTHING;
END $$;

-- Create a function to get the complete setup process data
CREATE OR REPLACE FUNCTION get_setup_process_section()
RETURNS TABLE (
  id UUID,
  title TEXT,
  subtitle TEXT,
  background_image_url TEXT,
  steps JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sps.id,
    sps.title,
    sps.subtitle,
    sps.background_image_url,
    (
      SELECT json_agg(json_build_object(
        'id', step.id,
        'title', step.title,
        'description', step.description,
        'step_number', step.step_number,
        'step_type', step.step_type,
        'category', step.category,
        'display_order', step.display_order
      ) ORDER BY step.display_order)
      FROM setup_process_steps step
      WHERE step.section_id = sps.id AND step.is_active = true
    ) AS steps
  FROM setup_process_section sps
  WHERE sps.is_active = true
  ORDER BY sps.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_setup_process_section_updated_at
    BEFORE UPDATE ON setup_process_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setup_process_steps_updated_at
    BEFORE UPDATE ON setup_process_steps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
