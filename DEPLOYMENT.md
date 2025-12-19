# Deployment Environment Variables Setup

This guide will help you set up environment variables for your deployment platform.

## Required Environment Variables

Your application requires the following environment variables:

| Variable Name | Description | Required | Example |
|--------------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key for the GitHub summarizer | ✅ Yes | `sk-proj-...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | ✅ Yes | `eyJhbGci...` |
| `DB_URL` | Database connection URL (if using direct DB connection) | ❌ No | Optional |

## Platform-Specific Setup Instructions

### 🚀 Vercel (Recommended for Next.js)

Vercel is the recommended platform for Next.js applications.

#### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project:**
   - Visit [vercel.com](https://vercel.com) and sign in
   - Select your project (or create a new one)

2. **Navigate to Environment Variables:**
   - Go to **Settings** → **Environment Variables**

3. **Add each variable:**
   - Click **Add New**
   - Enter the variable name (e.g., `OPENAI_API_KEY`)
   - Enter the variable value
   - Select environments: **Production**, **Preview**, and **Development** (or as needed)
   - Click **Save**

4. **Add all required variables:**
   ```
   OPENAI_API_KEY
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

5. **Redeploy:**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**

#### Option 2: Via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link your project:**
   ```bash
   vercel link
   ```

4. **Set environment variables:**
   ```bash
   # For production
   vercel env add OPENAI_API_KEY production
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

   # For preview/development (optional)
   vercel env add OPENAI_API_KEY preview
   vercel env add NEXT_PUBLIC_SUPABASE_URL preview
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
   ```

5. **Deploy:**
   ```bash
   vercel --prod
   ```

#### Option 3: Using `.vercel/.env.production` (Local file, not recommended)

⚠️ **Note:** This file should be in `.gitignore` and is only for local Vercel CLI testing.

Create `.vercel/.env.production`:
```env
OPENAI_API_KEY=your-key-here
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

---

### 🌐 Netlify

1. **Go to your Netlify site:**
   - Visit [netlify.com](https://netlify.com) and sign in
   - Select your site

2. **Navigate to Environment Variables:**
   - Go to **Site configuration** → **Environment variables**

3. **Add variables:**
   - Click **Add a variable**
   - Enter key and value
   - Select scope: **All scopes** or specific (Production, Deploy previews, Branch deploys)
   - Click **Add variable**

4. **Redeploy:**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

---

### 🚂 Railway

1. **Go to your Railway project:**
   - Visit [railway.app](https://railway.app) and sign in
   - Select your project

2. **Navigate to Variables:**
   - Click on your service
   - Go to **Variables** tab

3. **Add variables:**
   - Click **New Variable**
   - Enter key and value
   - Click **Add**

4. **Redeploy:**
   - Railway will automatically redeploy when variables are added

---

### ☁️ AWS (Amplify/ECS/Lambda)

#### AWS Amplify

1. **Go to AWS Amplify Console:**
   - Visit [console.aws.amazon.com/amplify](https://console.aws.amazon.com/amplify)
   - Select your app

2. **Navigate to Environment Variables:**
   - Go to **App settings** → **Environment variables**

3. **Add variables:**
   - Click **Manage variables**
   - Add each variable with its value
   - Save changes

4. **Redeploy:**
   - Go to **Deployments**
   - Click **Redeploy this version**

#### AWS ECS/Lambda

Use AWS Systems Manager Parameter Store or AWS Secrets Manager:

```bash
# Using AWS CLI
aws ssm put-parameter --name "/myapp/OPENAI_API_KEY" --value "your-key" --type "SecureString"
aws ssm put-parameter --name "/myapp/SUPABASE_URL" --value "your-url" --type "String"
aws ssm put-parameter --name "/myapp/SUPABASE_ANON_KEY" --value "your-key" --type "SecureString"
```

---

### 🐳 Docker / Docker Compose

Create a `.env` file (not committed to Git):

```env
OPENAI_API_KEY=your-key-here
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

In your `docker-compose.yml`:
```yaml
services:
  app:
    build: .
    env_file:
      - .env
    environment:
      - NODE_ENV=production
```

---

### 🔧 Generic Server (PM2, systemd, etc.)

1. **Create a `.env.production` file** on your server (not in Git):
   ```env
   OPENAI_API_KEY=your-key-here
   NEXT_PUBLIC_SUPABASE_URL=your-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   ```

2. **Load environment variables:**
   - Next.js automatically loads `.env.production` in production
   - Or use a process manager like PM2 with ecosystem file

3. **PM2 Example (`ecosystem.config.js`):**
   ```javascript
   module.exports = {
     apps: [{
       name: 'practicecursor',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         OPENAI_API_KEY: 'your-key-here',
         NEXT_PUBLIC_SUPABASE_URL: 'your-url-here',
         NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-key-here',
       }
     }]
   };
   ```

---

## Quick Reference: Getting Your API Keys

### OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-`)

### Supabase Credentials
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Verification

After setting up environment variables, verify they're working:

1. **Check build logs** - Look for any "Missing environment variable" errors
2. **Test API endpoints** - Try calling your API routes
3. **Check browser console** - For `NEXT_PUBLIC_*` variables, check if they're accessible

### Testing Locally Before Deployment

You can test with production-like environment:

```bash
# Create .env.production.local (not committed)
cp .env.local .env.production.local

# Build and start
npm run build
npm start
```

---

## Security Best Practices

✅ **DO:**
- Use environment variables for all secrets
- Use different keys for development and production
- Rotate keys regularly
- Use platform-specific secret management tools
- Review who has access to environment variables

❌ **DON'T:**
- Commit `.env.local` or `.env.production` to Git
- Share API keys in chat, email, or screenshots
- Use production keys in development
- Hardcode secrets in your code

---

## Troubleshooting

### Variables not working after deployment?

1. **Check variable names** - Must match exactly (case-sensitive)
2. **Redeploy** - Some platforms require redeploy after adding variables
3. **Check environment scope** - Make sure variables are set for the right environment (production/preview)
4. **Check for typos** - `NEXT_PUBLIC_` prefix is required for client-side variables
5. **Restart services** - Some platforms need a restart

### Next.js specific notes:

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Server-only variables (like `OPENAI_API_KEY`) are NOT exposed to the browser
- Environment variables are embedded at build time for `NEXT_PUBLIC_*` variables
- You may need to rebuild after changing environment variables

---

## Need Help?

- Check your platform's documentation for environment variables
- Review Next.js environment variables docs: [https://nextjs.org/docs/app/building-your-application/configuring/environment-variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- Check build logs for specific error messages

