# Google SSO Implementation - Step-by-Step Instructions

Follow these steps to implement Google Single Sign-On (SSO) in your Next.js application.

## Step 1: Set up Google OAuth Credentials

1. **Go to the Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a new project or select an existing one**
   - Click on the project dropdown at the top of the page
   - Click "New Project" if creating a new one
   - Enter a project name (e.g., "My Next.js App")
   - Click "Create"

3. **Navigate to "APIs & Services" > "Credentials"**
   - In the left sidebar, click "APIs & Services"
   - Click "Credentials" from the submenu

4. **Configure OAuth Consent Screen (if not already done)**
   - Click "OAuth consent screen" in the left sidebar
   - Choose "External" (unless you have a Google Workspace account)
   - Click "Create"
   - Fill in the required information:
     - **App name**: Your application name
     - **User support email**: Your email address
     - **Developer contact information**: Your email address
   - Click "Save and Continue" through the remaining steps
   - Click "Back to Dashboard" when done

5. **Click "Create Credentials" > "OAuth client ID"**
   - In the Credentials page, click the "+ CREATE CREDENTIALS" button
   - Select "OAuth client ID" from the dropdown

6. **Choose "Web application" as the application type**
   - If prompted, select "Web application"

7. **Configure the OAuth client**
   - **Name**: Give it a descriptive name (e.g., "Next.js App Client")
   - **Authorized JavaScript origins**: 
     - For development: `http://localhost:3000`
     - For production: `https://yourdomain.com` (add this later)
   - **Authorized redirect URIs**:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google` (add this later)

8. **Click "Create"**
   - A popup will appear with your credentials

9. **Copy your credentials**
   - **Client ID**: Copy this value (ends with `.apps.googleusercontent.com`)
   - **Client Secret**: Copy this value
   - **IMPORTANT**: Save these securely - you'll need them in the next step

## Step 2: Configure Environment Variables

1. **Create a `.env.local` file in your project root**
   - Navigate to your project root directory
   - Create a new file named `.env.local`

2. **Add the following environment variables:**
   ```
   GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-key-here
   ```

3. **Replace the placeholder values:**
   - Replace `your-google-client-id-here.apps.googleusercontent.com` with your actual Client ID from Step 1
   - Replace `your-google-client-secret-here` with your actual Client Secret from Step 1
   - Keep `NEXTAUTH_URL=http://localhost:3000` for development
   - Generate a random secret for `NEXTAUTH_SECRET` (see next step)

4. **Generate NEXTAUTH_SECRET:**
   - **Option A: Using OpenSSL (recommended)**
     - Open your terminal/command prompt
     - Run: `openssl rand -base64 32`
     - Copy the output and use it as your `NEXTAUTH_SECRET`
   
   - **Option B: Using Node.js**
     - Open your terminal/command prompt
     - Run: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
     - Copy the output and use it as your `NEXTAUTH_SECRET`
   
   - **Option C: Online generator**
     - Visit: https://generate-secret.vercel.app/32
     - Copy the generated secret

5. **Verify your `.env.local` file:**
   - Make sure there are no quotes around the values
   - Make sure there are no extra spaces
   - The file should look like:
     ```
     GOOGLE_CLIENT_ID=123456789-abcdefgh.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz=
     ```

## Step 3: Install Required Dependencies

1. **Open your terminal/command prompt**
   - Navigate to your project root directory

2. **Install NextAuth.js:**
   ```
   npm install next-auth
   ```
   - Wait for the installation to complete

3. **Verify installation:**
   - Check that `next-auth` appears in your `package.json` dependencies

## Step 4: Create NextAuth API Route

1. **Navigate to your project structure:**
   - Go to: `app/api/auth/[...nextauth]/`

2. **Create or verify the `route.ts` file exists:**
   - The file should be at: `app/api/auth/[...nextauth]/route.ts`

3. **Configure the NextAuth handler:**
   - Import NextAuth and GoogleProvider
   - Set up the authOptions with Google provider
   - Configure callbacks for session and JWT
   - Export GET and POST handlers

## Step 5: Create Session Provider Component

1. **Navigate to your components directory:**
   - Go to: `app/components/`

2. **Create a `SessionProvider.tsx` file:**
   - This will wrap your app with NextAuth's SessionProvider
   - Make it a client component (use "use client" directive)
   - Import SessionProvider from "next-auth/react"
   - Export a component that wraps children with SessionProvider

## Step 6: Create Sign-In Button Component

1. **Navigate to your components directory:**
   - Go to: `app/components/`

2. **Create a `SignInButton.tsx` file:**
   - Make it a client component (use "use client" directive)
   - Import useSession and signIn/signOut from "next-auth/react"
   - Create a button that:
     - Shows "Login with Google" when not authenticated
     - Shows user info and "Logout" when authenticated
     - Handles sign in and sign out actions

## Step 7: Update Layout to Include Session Provider

1. **Open `app/layout.tsx`**

2. **Import your SessionProvider component**

3. **Wrap the children with SessionProvider:**
   - Find where your app content is rendered
   - Wrap it with `<SessionProvider>...</SessionProvider>`

## Step 8: Add Login Button to Home Page

1. **Open `app/page.tsx`**

2. **Import your SignInButton component**

3. **Add the SignInButton to your page:**
   - Place it wherever you want the login button to appear
   - Typically in the main content area or header

## Step 9: Test the Implementation

1. **Start your development server:**
   - Open terminal/command prompt
   - Navigate to project root
   - Run: `npm run dev`
   - Wait for the server to start (usually on port 3000)

2. **Open your browser:**
   - Navigate to: `http://localhost:3000`

3. **Test the login flow:**
   - You should see a "Login with Google" button
   - Click the button
   - You should be redirected to Google's login page
   - Sign in with your Google account
   - Grant permissions if prompted
   - You should be redirected back to your app
   - You should see your name/email and a "Logout" button

4. **Test the logout flow:**
   - Click the "Logout" button
   - You should be signed out and see the "Login with Google" button again

## Step 10: Production Deployment (When Ready)

1. **Create production OAuth credentials:**
   - Go back to Google Cloud Console
   - Create a new OAuth client ID for production
   - Add your production domain to authorized origins
   - Add your production callback URL to authorized redirect URIs

2. **Update environment variables:**
   - In your hosting platform (Vercel, Netlify, etc.), add:
     - `GOOGLE_CLIENT_ID` (production client ID)
     - `GOOGLE_CLIENT_SECRET` (production client secret)
     - `NEXTAUTH_URL` (your production domain, e.g., `https://yourdomain.com`)
     - `NEXTAUTH_SECRET` (same or new secret)

3. **Verify HTTPS:**
   - Ensure your production site uses HTTPS
   - Google OAuth requires HTTPS for production

## Troubleshooting Tips

- **"Invalid credentials" error:**
  - Double-check your Client ID and Client Secret in `.env.local`
  - Make sure there are no extra spaces or quotes
  - Restart your development server after changing `.env.local`

- **"Redirect URI mismatch" error:**
  - Verify the redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`
  - Check for typos or trailing slashes

- **"NEXTAUTH_SECRET is missing" error:**
  - Make sure `NEXTAUTH_SECRET` is set in your `.env.local` file
  - Restart your development server

- **Button not appearing:**
  - Check that you've imported and added the SignInButton component
  - Verify the component is exported correctly
  - Check browser console for errors

- **Session not persisting:**
  - Verify SessionProvider wraps your app in layout.tsx
  - Check that middleware is properly configured (if using protected routes)

## Important Notes

- **Never commit `.env.local` to version control**
  - Make sure `.env.local` is in your `.gitignore` file

- **Use different credentials for development and production**
  - Create separate OAuth clients for each environment

- **Keep your secrets secure**
  - Never share your Client Secret or NEXTAUTH_SECRET
  - Rotate secrets if they're ever exposed

## Verification Checklist

After completing all steps, verify:

- [ ] Google OAuth credentials are created
- [ ] `.env.local` file exists with all required variables
- [ ] NextAuth is installed
- [ ] API route is configured at `app/api/auth/[...nextauth]/route.ts`
- [ ] SessionProvider component exists and wraps the app
- [ ] SignInButton component exists and is added to the page
- [ ] Development server runs without errors
- [ ] Login button appears on the home page
- [ ] Clicking login redirects to Google
- [ ] After Google login, user is redirected back
- [ ] User info is displayed when logged in
- [ ] Logout button works correctly

---

**You're all set!** Follow these steps in order, and you'll have Google SSO working in your Next.js application.

