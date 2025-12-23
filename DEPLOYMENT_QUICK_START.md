# Quick Deployment Setup Guide

## 🚀 Fastest Way: Vercel (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings

### Step 3: Add Environment Variables
In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
OPENAI_API_KEY = [your-openai-key]
NEXT_PUBLIC_SUPABASE_URL = [your-supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-supabase-key]
GOOGLE_CLIENT_ID = [your-google-client-id]
GOOGLE_CLIENT_SECRET = [your-google-client-secret]
NEXTAUTH_SECRET = [generate-random-secret]
NEXTAUTH_URL = https://your-project.vercel.app
```

**Select environments:** Production, Preview, Development

**Important:**
- For `NEXTAUTH_URL`, use your actual Vercel deployment URL
- For `NEXTAUTH_SECRET`, generate a random string (see [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions)
- Make sure to add the Vercel URL to your Google OAuth authorized redirect URIs

### Step 4: Redeploy
- Go to Deployments tab
- Click "..." on latest deployment → "Redeploy"

✅ Done! Your app is live.

---

## 📋 Environment Variables Checklist

Before deploying, make sure you have:

- [ ] OpenAI API Key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- [ ] Supabase URL from your Supabase project (Settings → API)
- [ ] Supabase Anon Key from your Supabase project (Settings → API)
- [ ] Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Google OAuth Client Secret from Google Cloud Console
- [ ] NEXTAUTH_SECRET (generate random string - see [DEPLOYMENT.md](./DEPLOYMENT.md))
- [ ] NEXTAUTH_URL (your Vercel deployment URL: `https://your-project.vercel.app`)

---

## 🔍 Verify Setup Locally

Before deploying, test that everything works:

```bash
# Run comprehensive diagnostic check
npm run diagnose

# Check environment variables
npm run check-env

# Build the project
npm run build

# Test production build locally
npm start
```

**💡 Tip:** The `diagnose` command checks all environment variables, dependencies, and configuration issues that could cause deployment failures.

---

## 📚 Need More Details?

- **Deployment failed?** See [VERCEL_DEPLOYMENT_FIX.md](./VERCEL_DEPLOYMENT_FIX.md) for troubleshooting
- **Can't read Vercel logs?** See [VERCEL_LOG_ANALYSIS.md](./VERCEL_LOG_ANALYSIS.md) for log analysis guide
- **Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Local setup:** See [ENV_SETUP.md](./ENV_SETUP.md)
- **Supabase setup:** See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## 🆘 Common Issues

**"Missing environment variable" error?**
- Make sure ALL variables are set in your deployment platform (including NextAuth variables)
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- Common missing variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

**"NEXTAUTH_SECRET is missing" error?**
- Generate a random secret: `openssl rand -base64 32` (or see [DEPLOYMENT.md](./DEPLOYMENT.md))
- Add it to Vercel environment variables
- Redeploy

**"Invalid redirect URI" error?**
- Make sure `NEXTAUTH_URL` matches your Vercel deployment URL
- Add the callback URL to Google OAuth: `https://your-project.vercel.app/api/auth/callback/google`

**Variables not working?**
- `NEXT_PUBLIC_*` variables are embedded at build time - rebuild after changes
- Server variables (like `OPENAI_API_KEY`) are available at runtime
- NextAuth variables are required at build time

