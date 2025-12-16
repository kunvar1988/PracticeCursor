-- Fix migration: Ensure api_keys table has all required columns
-- This migration handles the case where the table exists but is missing the 'key' column

-- First, ensure the table exists with all columns
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add the 'key' column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'api_keys' 
    AND column_name = 'key'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN key TEXT NOT NULL DEFAULT '';
    -- Update existing rows if any (you may want to set actual values)
    -- ALTER TABLE api_keys ALTER COLUMN key DROP DEFAULT;
  END IF;
END $$;

-- Ensure all other columns exist
DO $$ 
BEGIN
  -- Add created_at if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'api_keys' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  -- Add last_used if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'api_keys' AND column_name = 'last_used'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN last_used TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- Add updated_at if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'api_keys' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(name);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at DESC);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and recreate (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on api_keys" ON api_keys;
CREATE POLICY "Allow all operations on api_keys" ON api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON api_keys TO anon;
GRANT ALL ON api_keys TO authenticated;

