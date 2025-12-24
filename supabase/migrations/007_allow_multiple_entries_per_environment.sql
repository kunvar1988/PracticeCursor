-- Allow multiple entries for the same user from different environments
-- Remove UNIQUE constraint on provider_id and email
-- Add composite UNIQUE constraint on (provider_id, environment)

-- Drop the unique constraint on provider_id
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_provider_id_key;

-- Drop the unique constraint on email (same user can log in from different environments)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;

-- Add composite unique constraint on (provider_id, environment)
-- This allows the same user to have separate entries for local and production
ALTER TABLE users ADD CONSTRAINT users_provider_id_environment_unique 
  UNIQUE (provider_id, environment);

-- Make environment NOT NULL for new entries
ALTER TABLE users ALTER COLUMN environment SET NOT NULL;

-- For existing rows without environment, set a default
UPDATE users SET environment = 'unknown' WHERE environment IS NULL;

