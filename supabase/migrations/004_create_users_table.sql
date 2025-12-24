-- Create users table to store user information from OAuth providers
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id TEXT UNIQUE NOT NULL, -- Google/OAuth provider user ID
  name TEXT,
  email TEXT UNIQUE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on provider_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust based on your authentication needs)
-- For now, we'll allow all operations. In production, you should add proper authentication
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;

