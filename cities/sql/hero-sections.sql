-- =====================================================
-- CITY HERO SECTIONS (for dynamic hero content)
-- =====================================================

-- Insert hero sections for all existing cities
INSERT INTO city_content_sections (city_id, section_type, title, subtitle, content, image_url, is_active, sort_order)
SELECT
    c.id,
    'hero',
    'EXHIBITION STAND DESIGN BUILDER IN ' || UPPER(c.name) || ', UAE.',
    'World-class exhibition solutions in the global business hub',
    'Chronicle Exhibition Organizing LLC is one of the most reputable exhibition stand design manufacturers, and contractors located in ' || c.name || ' offering an exhaustive array of stand-up services for exhibitions. We provide complete display stand solutions, including designing, planning, fabricating and erecting and putting up.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    true,
    1
FROM cities c
WHERE NOT EXISTS (
    SELECT 1 FROM city_content_sections ccs 
    WHERE ccs.city_id = c.id AND ccs.section_type = 'hero'
);

