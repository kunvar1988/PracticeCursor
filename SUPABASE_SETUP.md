# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details and create the project

## 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 3. Set Up Environment Variables

1. Create a `.env.local` file in the root of your project (same level as `package.json`)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from step 2.

## 4. Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/migrations/001_create_api_keys_table.sql`
4. Click "Run" to execute the migration

Alternatively, you can run the migration using the Supabase CLI if you have it installed.

## 5. Verify the Setup

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Test the API endpoints:
   - Create a new API key via POST request
   - Fetch all keys via GET request
   - Update a key via PUT request
   - Delete a key via DELETE request

## Database Schema

The `api_keys` table has the following structure:

- `id` (UUID, Primary Key) - Auto-generated unique identifier
- `name` (TEXT) - Name of the API key
- `key` (TEXT) - The actual API key value
- `created_at` (TIMESTAMP) - When the key was created
- `last_used` (TIMESTAMP, nullable) - When the key was last used
- `updated_at` (TIMESTAMP) - When the key was last updated

## Security Notes

- The current RLS (Row Level Security) policy allows all operations. In production, you should:
  - Add proper authentication
  - Create more restrictive policies based on user roles
  - Consider encrypting sensitive data like API keys

