-- Add redirect_url column to instagram_posts table
ALTER TABLE instagram_posts 
ADD COLUMN redirect_url TEXT;

-- Update existing posts with default empty redirect URLs
UPDATE instagram_posts
SET redirect_url = '';

-- Create or replace function to handle Instagram post creation with redirect URL
CREATE OR REPLACE FUNCTION create_instagram_post(
  p_section_id UUID,
  p_image_url TEXT,
  p_caption TEXT,
  p_subcaption TEXT,
  p_tag TEXT,
  p_redirect_url TEXT,
  p_display_order INTEGER,
  p_is_active BOOLEAN
) RETURNS SETOF instagram_posts AS $$
BEGIN
  RETURN QUERY
  INSERT INTO instagram_posts (
    section_id,
    image_url,
    caption,
    subcaption,
    tag,
    redirect_url,
    display_order,
    is_active
  ) VALUES (
    p_section_id,
    p_image_url,
    p_caption,
    p_subcaption,
    p_tag,
    p_redirect_url,
    p_display_order,
    p_is_active
  )
  RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Create or replace function to handle Instagram post updates with redirect URL
CREATE OR REPLACE FUNCTION update_instagram_post(
  p_id UUID,
  p_image_url TEXT,
  p_caption TEXT,
  p_subcaption TEXT,
  p_tag TEXT,
  p_redirect_url TEXT,
  p_display_order INTEGER,
  p_is_active BOOLEAN
) RETURNS SETOF instagram_posts AS $$
BEGIN
  RETURN QUERY
  UPDATE instagram_posts
  SET
    image_url = p_image_url,
    caption = p_caption,
    subcaption = p_subcaption,
    tag = p_tag,
    redirect_url = p_redirect_url,
    display_order = p_display_order,
    is_active = p_is_active,
    updated_at = NOW()
  WHERE id = p_id
  RETURNING *;
END;
$$ LANGUAGE plpgsql;
