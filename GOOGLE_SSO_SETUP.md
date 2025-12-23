# Google SSO Setup Guide - Step by Step

This guide will walk you through setting up Google Single Sign-On (SSO) using NextAuth.js in your Next.js application.

## 📋 Prerequisites

- A Google Cloud Platform (GCP) account
- A Next.js application (already set up)
- Node.js and npm installed

## 🔧 Step-by-Step Configuration

### Step 1: Create a Google OAuth 2.0 Client ID

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Click "New Project" or select an existing project
   - Give it a name (e.g., "My Next.js App")
   - Click "Create"

3. **Enable Google+ API**
   - In the left sidebar, go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click on it and click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" (unless you have a Google Workspace account)
   - Click "Create"
   - Fill in the required information:
     - **App name**: Your application name
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Click "Save and Continue"
   - On "Scopes" page, click "Save and Continue"
   - On "Test users" page, add test users if needed, then click "Save and Continue"
   - Review and click "Back to Dashboard"

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application" as the application type
   - Give it a name (e.g., "Next.js App Client")
   - **Authorized JavaScript origins**:
     - For development: `http://localhost:3000`
     - For production: `https://yourdomain.com`
   - **Authorized redirect URIs**:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google`
   - Click "Create"
   - **IMPORTANT**: Copy the **Client ID** and **Client Secret** - you'll need these in the next step

### Step 2: Configure Environment Variables

1. **Create or Update `.env.local` file** in your project root:
   ```env
   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-key-here
   ```

2. **Generate NEXTAUTH_SECRET**:
   - You can generate a random secret using one of these methods:
   
   **Option A: Using OpenSSL (recommended)**
   ```bash
   openssl rand -base64 32
   ```
   
   **Option B: Using Node.js**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   
   **Option C: Online generator**
   - Visit: https://generate-secret.vercel.app/32
   - Copy the generated secret

3. **For Production**:
   - Update `NEXTAUTH_URL` to your production domain:
     ```env
     NEXTAUTH_URL=https://yourdomain.com
     ```
   - Make sure to add your production URLs to Google OAuth credentials (Step 1.5)

### Step 3: Verify File Structure

Make sure you have the following files in place:

```
practicecursor/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          ✅ NextAuth API route
│   ├── components/
│   │   ├── SessionProvider.tsx        ✅ Session provider wrapper
│   │   └── SignInButton.tsx           ✅ Sign in/out button component
│   ├── layout.tsx                     ✅ Updated with SessionProvider
│   └── page.tsx                       ✅ Updated with SignInButton
├── middleware.ts                      ✅ Auth middleware
└── .env.local                         ⚠️  Create this file with your credentials
```

### Step 4: Install Dependencies (if needed)

The required packages should already be installed, but verify:

```bash
npm install next-auth
```

### Step 5: Test the Implementation

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - You should see a "Login with Google" button

3. **Test the login flow**:
   - Click "Login with Google"
   - You'll be redirected to Google's login page
   - Sign in with your Google account
   - Grant permissions if prompted
   - You'll be redirected back to your app
   - You should see your name/email and a "Logout" button

## 🔒 Security Best Practices

1. **Never commit `.env.local` to version control**
   - Make sure `.env.local` is in your `.gitignore`

2. **Use different credentials for development and production**
   - Create separate OAuth clients for each environment

3. **Rotate secrets regularly**
   - Update `NEXTAUTH_SECRET` periodically
   - Regenerate OAuth credentials if compromised

4. **Use HTTPS in production**
   - OAuth requires HTTPS for production environments

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Create production OAuth credentials in Google Cloud Console
- [ ] Add production URLs to authorized origins and redirect URIs
- [ ] Set environment variables in your hosting platform (Vercel, Netlify, etc.)
- [ ] Update `NEXTAUTH_URL` to your production domain
- [ ] Test the login flow in production
- [ ] Verify HTTPS is enabled

## 🐛 Troubleshooting

### Issue: "Error: Invalid credentials"
- **Solution**: Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Make sure there are no extra spaces or quotes

### Issue: "Redirect URI mismatch"
- **Solution**: Verify the redirect URI in Google Console matches exactly:
  - Development: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://yourdomain.com/api/auth/callback/google`

### Issue: "NEXTAUTH_SECRET is missing"
- **Solution**: Generate and add `NEXTAUTH_SECRET` to your `.env.local` file

### Issue: Session not persisting
- **Solution**: Check that `SessionProvider` is wrapping your app in `layout.tsx`
- Verify middleware is properly configured

### Issue: CORS errors
- **Solution**: Make sure your `NEXTAUTH_URL` matches your actual domain
- Check that authorized origins in Google Console include your domain

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Guide](https://nextjs.org/docs/app/building-your-application/authentication)

## ✅ Verification

After setup, verify these endpoints work:

- `http://localhost:3000/api/auth/signin` - Sign in page
- `http://localhost:3000/api/auth/session` - Current session (JSON)
- `http://localhost:3000/api/auth/providers` - Available providers (JSON)

## 🎉 You're All Set!

Your Google SSO implementation is now complete. Users can sign in with their Google accounts, and sessions will be managed automatically by NextAuth.js.

