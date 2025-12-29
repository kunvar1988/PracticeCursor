-- Add environment column to api_keys table to track local vs production
-- This helps identify which environment the API key was created in

DO $$ 
BEGIN
  -- Add environment column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'api_keys' 
    AND column_name = 'environment'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN environment TEXT;
    
    -- Set default value for existing rows (only for rows that are NULL)
    -- This migration runs once, so existing rows will be set to 'unknown'
    -- New rows will have their environment set during creation
    UPDATE api_keys SET environment = 'unknown' WHERE environment IS NULL;
    
    -- Create index on environment for faster filtering
    CREATE INDEX IF NOT EXISTS idx_api_keys_environment ON api_keys(environment);
  END IF;
END $$;

