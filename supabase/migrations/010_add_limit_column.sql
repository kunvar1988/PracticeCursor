-- Add limit column to api_keys table for rate limiting
-- limit: maximum number of requests allowed for this API key (NULL means unlimited)

DO $$ 
BEGIN
  -- Add limit column if it doesn't exist
  -- Note: "limit" is a reserved keyword, so we must quote it
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'api_keys' 
    AND column_name = 'limit'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN "limit" BIGINT;
    -- NULL means unlimited, so we don't set a default value
    -- Existing rows will have NULL (unlimited)
  END IF;
END $$;

