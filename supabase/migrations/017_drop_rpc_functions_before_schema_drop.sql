-- Drop RPC functions that reference local and production schemas
-- Run this BEFORE dropping the schemas to avoid dependency issues

-- Drop functions that insert into local schema
DROP FUNCTION IF EXISTS public.insert_api_key_local CASCADE;
DROP FUNCTION IF EXISTS public.insert_user_local CASCADE;
DROP FUNCTION IF EXISTS public.get_api_keys_local CASCADE;

-- Drop functions that insert into production schema
DROP FUNCTION IF EXISTS public.insert_api_key_prod CASCADE;
DROP FUNCTION IF EXISTS public.insert_user_prod CASCADE;
DROP FUNCTION IF EXISTS public.get_api_keys_prod CASCADE;

-- Drop function that gets all keys from both schemas
DROP FUNCTION IF EXISTS public.get_all_api_keys CASCADE;

-- Drop function for public schema (if it exists)
DROP FUNCTION IF EXISTS public.insert_api_key_local_public CASCADE;

-- Verify functions are dropped
-- Run this query to verify: 
-- SELECT routine_name FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name LIKE '%local%' OR routine_name LIKE '%prod%';

