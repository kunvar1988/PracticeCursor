-- Add user_id column to api_keys table to associate keys with users
-- This enables user-specific API key management

DO $$ 
BEGIN
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'api_keys' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
    
    -- Create index on user_id for faster lookups
    CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
    
    -- Create composite index for user_id and environment for efficient filtering
    CREATE INDEX IF NOT EXISTS idx_api_keys_user_environment ON api_keys(user_id, environment);
  END IF;
END $$;

