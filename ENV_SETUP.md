# Environment Setup

## Required Environment Variables

To run this application, you need to set up the following environment variables:

### 1. Create `.env.local` file

Create a file named `.env.local` in the root of the `practicecursor` directory.

### 2. Add OpenAI API Key

Add the following line to your `.env.local` file:

```
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

**To get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env.local` file

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

## Troubleshooting

If you're still seeing errors after setting up the environment variable:

1. **Verify the file exists**: Make sure `.env.local` is in the `practicecursor` directory (same level as `package.json`)
2. **Check the key format**: Ensure there are no extra spaces or quotes around the API key
3. **Restart the server**: Environment variables are only loaded when the server starts
4. **Check the key is valid**: Make sure your OpenAI API key is active and has credits

