# Environment Setup

## Required Environment Variables

To run this application, you need to set up the following environment variables:

### 1. Create `.env.local` file

**Option A (Recommended):** Copy the example file:
```bash
cp .env.example .env.local
```

**Option B:** Create a file named `.env.local` in the root of the `practicecursor` directory manually.

### 2. Add Required Environment Variables

Fill in the actual values in your `.env.local` file. You need to add:

#### OpenAI API Key
```
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

**To get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env.local` file

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**To get your Supabase credentials:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. Paste them in your `.env.local` file

### 3. Restart Development Server

After creating/updating the `.env.local` file, you **must restart** your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## File Structure

Your `.env.local` file should look like this:

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important Notes:**
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Replace `sk-your-actual-openai-api-key-here` with your actual API key
- The API key should start with `sk-` for OpenAI keys

## Deployment

For setting up environment variables on your deployment platform (Vercel, Netlify, Railway, etc.), see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed platform-specific instructions.

## Troubleshooting

If you're still seeing errors after setting up the environment variable:

1. **Verify the file exists**: Make sure `.env.local` is in the `practicecursor` directory (same level as `package.json`)
2. **Check the key format**: Ensure there are no extra spaces or quotes around the API key
3. **Restart the server**: Environment variables are only loaded when the server starts
4. **Check the key is valid**: Make sure your OpenAI API key is active and has credits

