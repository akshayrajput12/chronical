-- ============================================================================
-- EVENTS HERO SCHEMA UPDATE
-- ============================================================================
-- This file adds missing fields to the events_hero table to support
-- the full admin interface functionality
-- ============================================================================

-- Add missing fields to events_hero table
ALTER TABLE events_hero ADD COLUMN IF NOT EXISTS subheading_font_size TEXT DEFAULT 'medium';
ALTER TABLE events_hero ADD COLUMN IF NOT EXISTS text_alignment TEXT DEFAULT 'center';
ALTER TABLE events_hero ADD COLUMN IF NOT EXISTS button_text TEXT DEFAULT 'Explore Events';
ALTER TABLE events_hero ADD COLUMN IF NOT EXISTS button_url TEXT DEFAULT '/whats-on';
ALTER TABLE events_hero ADD COLUMN IF NOT EXISTS button_style TEXT DEFAULT 'primary';

-- Update the heading_font_size field to support the new values
ALTER TABLE events_hero ALTER COLUMN heading_font_size SET DEFAULT 'large';

-- Add comments to clarify field usage
COMMENT ON COLUMN events_hero.heading_font_size IS 'Font size for main heading: small, medium, large, xlarge';
COMMENT ON COLUMN events_hero.subheading_font_size IS 'Font size for sub heading: small, medium, large, xlarge';
COMMENT ON COLUMN events_hero.text_alignment IS 'Text alignment: left, center, right';
COMMENT ON COLUMN events_hero.button_style IS 'Button style: primary, secondary, outline';

-- Update existing records to have the new default values
UPDATE events_hero 
SET 
    subheading_font_size = 'medium',
    text_alignment = 'center',
    button_text = 'Explore Events',
    button_url = '/whats-on',
    button_style = 'primary',
    heading_font_size = 'large'
WHERE 
    subheading_font_size IS NULL 
    OR text_alignment IS NULL 
    OR button_text IS NULL 
    OR button_url IS NULL 
    OR button_style IS NULL
    OR heading_font_size = 'responsive';

-- ============================================================================
-- HERO SCHEMA UPDATE COMPLETE
-- ============================================================================
