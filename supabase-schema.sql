-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  clerk_id TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT
);

-- Enable Row Level Security (RLS) on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Admin users can view all admin users"
  ON admin_users FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert admin users"
  ON admin_users FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update admin users"
  ON admin_users FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete admin users"
  ON admin_users FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert a sample admin user (optional)
-- INSERT INTO admin_users (email, role, clerk_id, full_name)
-- VALUES ('admin@example.com', 'admin', 'clerk_user_id', 'Admin User')
-- ON CONFLICT DO NOTHING;

-- You can add more tables later as needed
