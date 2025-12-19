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
```

**Select environments:** Production, Preview, Development

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

---

## 🔍 Verify Setup Locally

Before deploying, test that everything works:

```bash
# Check environment variables
npm run check-env

# Build the project
npm run build

# Test production build locally
npm start
```

---

## 📚 Need More Details?

- **Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Local setup:** See [ENV_SETUP.md](./ENV_SETUP.md)
- **Supabase setup:** See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## 🆘 Common Issues

**"Missing environment variable" error?**
- Make sure variables are set in your deployment platform
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

**Variables not working?**
- `NEXT_PUBLIC_*` variables are embedded at build time - rebuild after changes
- Server variables (like `OPENAI_API_KEY`) are available at runtime

