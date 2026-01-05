    -- Migration: Drop local and production schemas
    -- WARNING: This will delete all data in the local and production schemas
    -- Make sure you have a backup if you need to preserve any data

    -- Step 1: Drop the schemas and all their contents (CASCADE will drop all tables, functions, etc.)
    DROP SCHEMA IF EXISTS local CASCADE;
    DROP SCHEMA IF EXISTS production CASCADE;

    -- Step 2: Verify schemas are dropped
    -- Run this query to verify: SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('local', 'production');

    -- Note: This will also drop all RPC functions that reference these schemas
    -- If you have functions in the public schema that reference local/production tables,
    -- you may need to drop those functions first or they will prevent schema deletion

