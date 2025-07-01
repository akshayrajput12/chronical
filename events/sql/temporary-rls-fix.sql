-- Temporary RLS policies for testing event creation
-- Run this in your Supabase SQL editor to allow anonymous event creation for testing

-- Add temporary policy to allow anonymous inserts for events (for testing only)
CREATE POLICY "Temporary anonymous insert for events" ON events
FOR INSERT WITH CHECK (true);

-- Add temporary policy to allow anonymous inserts for event categories (for testing only)
CREATE POLICY "Temporary anonymous insert for event categories" ON event_categories
FOR INSERT WITH CHECK (true);

-- Add temporary policy to allow anonymous read access to all event categories
CREATE POLICY "Temporary anonymous read for event categories" ON event_categories
FOR SELECT USING (true);

-- Note: These policies should be removed in production and replaced with proper authentication
-- To remove these policies later, run:
-- DROP POLICY "Temporary anonymous insert for events" ON events;
-- DROP POLICY "Temporary anonymous insert for event categories" ON event_categories;
-- DROP POLICY "Temporary anonymous read for event categories" ON event_categories;
