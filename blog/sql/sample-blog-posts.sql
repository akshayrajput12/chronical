-- ============================================================================
-- SAMPLE BLOG POSTS FOR TESTING
-- ============================================================================
-- This script inserts sample blog posts to test the blog functionality
-- Run this after the main blog-schema.sql has been executed

-- Insert sample blog posts
INSERT INTO blog_posts (
    title,
    slug,
    excerpt,
    content,
    featured_image_url,
    featured_image_alt,
    status,
    is_featured,
    published_at,
    category_id,
    view_count
) VALUES
(
    'The Future of Exhibition Design: Trends to Watch in 2024',
    'future-exhibition-design-trends-2024',
    'Discover the latest trends shaping the exhibition industry, from sustainable materials to interactive digital experiences.',
    '<h2>Introduction</h2><p>The exhibition industry is constantly evolving, with new technologies and design philosophies reshaping how brands connect with their audiences. In 2024, we''re seeing several key trends that are transforming the landscape of exhibition design.</p><h2>Sustainable Materials</h2><p>Environmental consciousness is driving the adoption of eco-friendly materials and reusable stand components. Companies are increasingly choosing sustainable options that reduce their carbon footprint while maintaining visual impact.</p><h2>Digital Integration</h2><p>Interactive displays, AR experiences, and IoT sensors are becoming standard features in modern exhibition stands, creating immersive experiences that engage visitors on multiple levels.</p>',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'Modern exhibition hall with innovative design',
    'published',
    true,
    NOW() - INTERVAL '2 days',
    (SELECT id FROM blog_categories WHERE slug = 'business' LIMIT 1),
    156
),
(
    'Dubai World Trade Centre: A Hub for Global Business',
    'dubai-world-trade-centre-global-business-hub',
    'Explore how DWTC has become one of the world''s leading exhibition and conference venues, attracting businesses from around the globe.',
    '<h2>A Legacy of Excellence</h2><p>Dubai World Trade Centre has been at the forefront of the Middle East''s business landscape for decades, hosting some of the region''s most prestigious events and exhibitions.</p><h2>World-Class Facilities</h2><p>With state-of-the-art facilities spanning multiple halls and conference rooms, DWTC provides the perfect backdrop for businesses to showcase their innovations and connect with global audiences.</p><h2>Strategic Location</h2><p>Located in the heart of Dubai, DWTC offers unparalleled accessibility and connectivity, making it the preferred choice for international exhibitors and visitors alike.</p>',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'Dubai World Trade Centre exterior view',
    'published',
    false,
    NOW() - INTERVAL '5 days',
    (SELECT id FROM blog_categories WHERE slug = 'events' LIMIT 1),
    89
),
(
    'Maximizing ROI: How to Measure Exhibition Success',
    'maximizing-roi-measure-exhibition-success',
    'Learn the key metrics and strategies for evaluating the success of your exhibition participation and maximizing your return on investment.',
    '<h2>Setting Clear Objectives</h2><p>Before participating in any exhibition, it''s crucial to establish clear, measurable objectives that align with your overall business goals.</p><h2>Key Performance Indicators</h2><p>Track important metrics such as lead generation, brand awareness, sales conversions, and networking opportunities to gauge your exhibition''s success.</p><h2>Post-Event Analysis</h2><p>Conduct thorough post-event analysis to identify what worked well and areas for improvement in future exhibitions.</p>',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'Business analytics dashboard showing ROI metrics',
    'published',
    false,
    NOW() - INTERVAL '1 week',
    (SELECT id FROM blog_categories WHERE slug = 'business' LIMIT 1),
    234
),
(
    'Technology Innovations Transforming the Exhibition Industry',
    'technology-innovations-exhibition-industry',
    'From virtual reality to AI-powered analytics, discover how cutting-edge technology is revolutionizing the exhibition experience.',
    '<h2>Virtual and Augmented Reality</h2><p>VR and AR technologies are creating immersive experiences that allow visitors to interact with products and services in entirely new ways.</p><h2>AI and Data Analytics</h2><p>Artificial intelligence is helping exhibitors better understand visitor behavior and optimize their stand layouts and presentations for maximum impact.</p><h2>Smart Connectivity</h2><p>IoT devices and smart sensors are providing real-time insights into foot traffic, engagement levels, and visitor preferences.</p>',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'Person using VR headset at technology exhibition',
    'published',
    true,
    NOW() - INTERVAL '3 days',
    (SELECT id FROM blog_categories WHERE slug = 'technology' LIMIT 1),
    178
),
(
    'Sustainable Exhibition Practices: Building a Greener Future',
    'sustainable-exhibition-practices-greener-future',
    'Explore eco-friendly approaches to exhibition design and management that reduce environmental impact while maintaining effectiveness.',
    '<h2>Eco-Friendly Materials</h2><p>The shift towards sustainable materials like bamboo, recycled plastics, and biodegradable components is gaining momentum in the exhibition industry.</p><h2>Waste Reduction Strategies</h2><p>Implementing comprehensive waste reduction strategies, including reusable components and digital alternatives to printed materials.</p><h2>Carbon Footprint Management</h2><p>Understanding and minimizing the carbon footprint of exhibitions through efficient logistics, local sourcing, and renewable energy usage.</p>',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'Green exhibition stand made from sustainable materials',
    'published',
    false,
    NOW() - INTERVAL '4 days',
    (SELECT id FROM blog_categories WHERE slug = 'business' LIMIT 1),
    145
),
(
    'The Art of Stand Design: Creating Memorable Brand Experiences',
    'art-stand-design-memorable-brand-experiences',
    'Discover the principles of effective stand design that capture attention, engage visitors, and create lasting brand impressions.',
    '<h2>Visual Impact</h2><p>Creating strong visual impact through strategic use of color, lighting, and spatial design that draws visitors from across the exhibition floor.</p><h2>Interactive Elements</h2><p>Incorporating interactive elements that encourage visitor participation and create memorable experiences that extend beyond the event.</p><h2>Brand Storytelling</h2><p>Using design elements to tell your brand story in a compelling and engaging way that resonates with your target audience.</p>',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'Creative exhibition stand with modern design elements',
    'published',
    false,
    NOW() - INTERVAL '6 days',
    (SELECT id FROM blog_categories WHERE slug = 'events' LIMIT 1),
    201
);

-- Verify the inserted posts
SELECT 
    title,
    slug,
    status,
    published_at,
    category_id,
    view_count
FROM blog_posts 
WHERE status = 'published' 
ORDER BY published_at DESC;

-- ============================================================================
-- SAMPLE DATA INSERTION COMPLETE
-- ============================================================================
