# Vercel Deployment Fix Guide

## 🚨 Deployment Failed? Follow These Steps

If your Vercel deployment is failing, this guide will help you fix it step by step.

## Step 1: Check Build Logs

1. Go to your Vercel project dashboard
2. Click on the failed deployment
3. Check the **Build Logs** tab for specific error messages

Common error messages you might see:
- `Missing environment variable: GOOGLE_CLIENT_ID`
- `NEXTAUTH_SECRET is missing`
- `Invalid redirect URI`
- `Environment variable not found`

## Step 2: Add Missing Environment Variables

Your deployment is likely failing because **NextAuth environment variables are missing**. 

### Required Environment Variables for Vercel

Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables** and add ALL of these:

| Variable | Description | How to Get It |
|----------|-------------|---------------|
| `OPENAI_API_KEY` | OpenAI API key | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Supabase Dashboard → Settings → API |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Google Cloud Console → Credentials |
| `NEXTAUTH_SECRET` | Random secret key | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL | `https://your-project.vercel.app` |

### Quick Setup Instructions

#### 1. Generate NEXTAUTH_SECRET

**On macOS/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Or use online generator:**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated string

#### 2. Set NEXTAUTH_URL

Use your actual Vercel deployment URL:
```
https://practice-cursor1-6ngnochay-kunvar1988s-projects.vercel.app
```

Or if you have a custom domain:
```
https://yourdomain.com
```

#### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   ```
   https://practice-cursor1-6ngnochay-kunvar1988s-projects.vercel.app/api/auth/callback/google
   ```
   (Replace with your actual Vercel URL)
6. Click **Save**

#### 4. Add Variables to Vercel

For each variable:
1. Click **Add New** in Vercel Environment Variables
2. Enter the variable name (exactly as shown above)
3. Enter the variable value
4. **Important:** Select all environments: **Production**, **Preview**, and **Development**
5. Click **Save**

## Step 3: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment (failed one)
3. Click the three dots (⋯) menu
4. Select **Redeploy**
5. Wait for the build to complete

## Step 4: Verify Deployment

After redeployment:

1. Check if the build succeeded (green checkmark)
2. Visit your deployment URL
3. Test the sign-in functionality
4. Check browser console for any errors

## Common Issues and Solutions

### Issue 1: "NEXTAUTH_SECRET is missing"

**Solution:**
- Generate a random secret (see Step 2.1 above)
- Add it to Vercel environment variables
- Make sure it's set for **Production** environment
- Redeploy

### Issue 2: "Invalid redirect URI" or Google OAuth Error

**Solution:**
- Make sure `NEXTAUTH_URL` in Vercel matches your deployment URL exactly
- Add the callback URL to Google OAuth authorized redirect URIs:
  ```
  https://your-project.vercel.app/api/auth/callback/google
  ```
- Make sure there are no trailing slashes
- Wait a few minutes for Google to update (can take up to 5 minutes)

### Issue 3: "Environment variable not found" during build

**Solution:**
- Make sure variables are set for **Production** environment (not just Preview/Development)
- Check variable names are exactly correct (case-sensitive)
- Redeploy after adding variables
- For `NEXT_PUBLIC_*` variables, they must be set before build

### Issue 4: Build succeeds but app doesn't work

**Solution:**
- Check browser console for errors
- Verify all environment variables are set correctly
- Make sure `NEXTAUTH_URL` matches your actual deployment URL
- Check that Google OAuth redirect URI is configured correctly

### Issue 5: "Missing environment variable" in runtime

**Solution:**
- Server-side variables (like `OPENAI_API_KEY`, `GOOGLE_CLIENT_SECRET`) should be available at runtime
- Make sure they're set for the correct environment
- Check Vercel logs for specific missing variable names

## Verification Checklist

Before considering the deployment fixed, verify:

- [ ] All 7 environment variables are set in Vercel
- [ ] Variables are set for **Production** environment
- [ ] `NEXTAUTH_URL` matches your actual Vercel deployment URL
- [ ] Google OAuth redirect URI is configured correctly
- [ ] Build completes successfully (green checkmark)
- [ ] App loads without errors
- [ ] Sign-in button works
- [ ] Google OAuth flow completes successfully

## Still Having Issues?

1. **Check Vercel Build Logs:**
   - Look for specific error messages
   - Check which variable is missing
   - Look for TypeScript or build errors

2. **Test Locally:**
   ```bash
   # Make sure .env.local has all variables
   npm run check-env
   
   # Build locally to catch errors
   npm run build
   ```

3. **Verify Environment Variables:**
   - Double-check variable names (case-sensitive)
   - Make sure there are no extra spaces
   - Verify values are correct

4. **Check Google OAuth Setup:**
   - Verify Client ID and Secret are correct
   - Make sure redirect URI is added
   - Check OAuth consent screen is configured

5. **Contact Support:**
   - If issues persist, check Vercel documentation
   - Review NextAuth.js documentation
   - Check project-specific issues in GitHub

## Quick Reference: All Required Variables

Copy this list and check off each one in Vercel:

```
✅ OPENAI_API_KEY
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL
```

## Next Steps After Fix

Once deployment is successful:

1. Test all features (sign-in, API keys, dashboard)
2. Set up a custom domain (optional)
3. Configure preview deployments (optional)
4. Set up monitoring and alerts (optional)

---

**Need more help?** See:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
- [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) - Quick setup
- [GOOGLE_SSO_SETUP.md](./GOOGLE_SSO_SETUP.md) - Google OAuth setup details

