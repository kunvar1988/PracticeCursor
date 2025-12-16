-- Add value and usage columns to api_keys table
-- value: stores the API key value (same as key column, for compatibility)
-- usage: tracks the number of times the API key has been used

DO $$ 
BEGIN
  -- Add value column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'api_keys' 
    AND column_name = 'value'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN value TEXT;
    -- Populate existing rows: set value to key if key exists
    UPDATE api_keys SET value = key WHERE value IS NULL AND key IS NOT NULL;
  END IF;
  
  -- Add usage column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'api_keys' 
    AND column_name = 'usage'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN usage BIGINT DEFAULT 0;
    -- Set existing rows to 0 if they're NULL
    UPDATE api_keys SET usage = 0 WHERE usage IS NULL;
  END IF;
END $$;

