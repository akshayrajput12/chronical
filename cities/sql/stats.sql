
-- =====================================================
-- CITY STATISTICS TABLE (for statistics section)
-- =====================================================

CREATE TABLE IF NOT EXISTS city_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    statistic_type VARCHAR(50) NOT NULL, -- 'happy_clients', 'completed_projects', 'customer_support', 'exhibitions'
    title VARCHAR(255) NOT NULL, -- Display title like 'Happy Clients', 'Completed Projects'
    value VARCHAR(20) NOT NULL, -- The number/value like '4650+', '20800+'
    icon_name VARCHAR(100), -- Icon reference for the statistic
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_city_statistics_city_id ON city_statistics(city_id);
CREATE INDEX IF NOT EXISTS idx_city_statistics_type ON city_statistics(statistic_type);
CREATE TRIGGER update_city_statistics_updated_at BEFORE UPDATE ON city_statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE city_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active city statistics" ON city_statistics FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage city statistics" ON city_statistics FOR ALL USING (auth.role() = 'authenticated');


-- Insert sample city statistics for each city
INSERT INTO city_statistics (city_id, statistic_type, title, value, icon_name, sort_order)
SELECT
    c.id,
    stat_type,
    stat_title,
    stat_value,
    stat_icon,
    stat_order
FROM cities c
CROSS JOIN (
    VALUES
        ('happy_clients', 'Happy Clients', '4650+', 'users', 1),
        ('completed_projects', 'Completed Projects', '20800+', 'briefcase', 2),
        ('customer_support', 'Customer Support', '24X7', 'headphones', 3),
        ('exhibitions', 'Exhibitions', '2050+', 'trophy', 4)
) AS stats(stat_type, stat_title, stat_value, stat_icon, stat_order);

