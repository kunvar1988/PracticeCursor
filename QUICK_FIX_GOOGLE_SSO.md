# Quick Fix: "Provider is not enabled" Error

## The Error
```
{"code":400,"error_code":"validation_failed","msg": "Unsupported provider: provider is not enabled"}
```

This means Google OAuth is not enabled in your Supabase project.

## Step-by-Step Fix (5 minutes)

### Step 1: Get Google OAuth Credentials (if you haven't already)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select a project
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure OAuth consent screen (if prompted)
6. Create OAuth Client ID:
   - Type: **Web application**
   - **Authorized redirect URIs**: 
     ```
     https://rfgdstekbckhfzzjhnax.supabase.co/auth/v1/callback
     ```
   - Click **Create**
7. **Copy** the **Client ID** and **Client Secret**

### Step 2: Enable Google in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **rfgdstekbckhfzzjhnax**
3. Click **Authentication** in left sidebar
4. Click **Providers** tab
5. Find **Google** and click on it
6. **Toggle ON** "Enable Google provider"
7. Paste your credentials:
   - **Client ID (for OAuth)**: [Paste your Google Client ID]
   - **Client Secret (for OAuth)**: [Paste your Google Client Secret]
8. Click **Save**

### Step 3: Configure URLs in Supabase

1. Still in **Authentication** section
2. Click **URL Configuration**
3. Set **Site URL**: `http://localhost:3000`
4. Under **Redirect URLs**, click **Add URL**:
   ```
   http://localhost:3000/api/auth/callback
   ```
5. Click **Save**

### Step 4: Test

1. Go back to your app: `http://localhost:3000`
2. Click **Login with Google**
3. You should now be redirected to Google login (not the error page)

## Common Issues

### "I don't have Google OAuth credentials yet"
- Follow Step 1 above to create them
- Takes about 5 minutes

### "Where do I find my Supabase project ref?"
- It's in your Supabase dashboard URL: `https://supabase.com/dashboard/project/rfgdstekbckhfzzjhnax`
- Your project ref is: **rfgdstekbckhfzzjhnax**

### "The redirect URI doesn't match"
- Make sure the redirect URI in Google Console is EXACTLY:
  ```
  https://rfgdstekbckhfzzjhnax.supabase.co/auth/v1/callback
  ```
- No trailing slash, exact match required

## Still Having Issues?

Check the full guide: `GOOGLE_SSO_SETUP.md`

