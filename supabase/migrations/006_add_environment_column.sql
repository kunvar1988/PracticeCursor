-- Add environment column to track local vs production requests
ALTER TABLE users ADD COLUMN IF NOT EXISTS environment TEXT;

-- Create index on environment for faster filtering
CREATE INDEX IF NOT EXISTS idx_users_environment ON users(environment);

-- Update existing rows to set environment based on created_at or default to 'unknown'
-- You may want to manually update existing rows if needed
UPDATE users SET environment = 'unknown' WHERE environment IS NULL;

