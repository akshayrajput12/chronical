-- Update the get_related_blog_posts function to include content for reading time calculation
-- Run this in Supabase SQL Editor to update the existing function

CREATE OR REPLACE FUNCTION get_related_blog_posts(current_post_id UUID, limit_count INTEGER DEFAULT 3)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    content TEXT,
    featured_image_url TEXT,
    featured_image_alt TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category_name TEXT,
    category_slug TEXT,
    category_color TEXT,
    view_count INTEGER,
    tags TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.content,
        bp.featured_image_url,
        bp.featured_image_alt,
        bp.published_at,
        bc.name as category_name,
        bc.slug as category_slug,
        bc.color as category_color,
        bp.view_count,
        COALESCE(
            ARRAY(
                SELECT bt.name
                FROM blog_post_tags bpt
                JOIN blog_tags bt ON bpt.blog_tag_id = bt.id
                WHERE bpt.blog_post_id = bp.id
                ORDER BY bt.name
            ),
            ARRAY[]::TEXT[]
        ) as tags
    FROM blog_posts bp
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id
    WHERE bp.id != current_post_id
    AND bp.status = 'published'
    AND bp.published_at <= NOW()
    AND (
        -- Same category
        bp.category_id = (SELECT category_id FROM blog_posts WHERE id = current_post_id)
        OR
        -- Shared tags
        EXISTS (
            SELECT 1 FROM blog_post_tags bpt1
            JOIN blog_post_tags bpt2 ON bpt1.blog_tag_id = bpt2.blog_tag_id
            WHERE bpt1.blog_post_id = bp.id
            AND bpt2.blog_post_id = current_post_id
        )
    )
    ORDER BY
        -- Prioritize same category
        CASE WHEN bp.category_id = (SELECT category_id FROM blog_posts WHERE id = current_post_id) THEN 1 ELSE 2 END,
        bp.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
