-- SQL script to add the Countries stat to your existing business section
-- Run this in your Supabase SQL editor or database client

-- Add the Countries stat to the existing business section
WITH business_section AS (
  SELECT id FROM business_sections WHERE is_active = true LIMIT 1
)
INSERT INTO business_stats (
  business_section_id,
  value,
  label,
  sublabel,
  display_order
)
SELECT 
  business_section.id,
  50,
  'Countries',
  'WORLDWIDE PRESENCE',
  4
FROM business_section
WHERE NOT EXISTS (
  SELECT 1 FROM business_stats bs 
  WHERE bs.business_section_id = business_section.id 
  AND bs.label = 'Countries'
);

-- Verify the insertion
SELECT 
  bs.label,
  bs.value,
  bs.sublabel,
  bs.display_order
FROM business_stats bs
JOIN business_sections bsec ON bs.business_section_id = bsec.id
WHERE bsec.is_active = true
ORDER BY bs.display_order;
