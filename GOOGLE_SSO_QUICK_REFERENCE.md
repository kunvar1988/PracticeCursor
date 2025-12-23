# Google SSO Quick Reference

## 📁 Files Created/Modified

### ✅ Created Files

1. **`app/api/auth/[...nextauth]/route.ts`**
   - NextAuth.js API route handler
   - Configures Google OAuth provider
   - Handles authentication callbacks

2. **`app/components/SessionProvider.tsx`**
   - Client-side session provider wrapper
   - Wraps NextAuth's SessionProvider

3. **`app/components/SignInButton.tsx`**
   - Reusable sign-in/sign-out button component
   - Shows user info when logged in
   - Handles authentication state

4. **`middleware.ts`**
   - Next.js middleware for session management
   - Protects routes (configurable)
   - Handles authentication checks

5. **`app/types/next-auth.d.ts`**
   - TypeScript type definitions for NextAuth
   - Extends Session and JWT types

### ✅ Modified Files

1. **`app/layout.tsx`**
   - Added `SessionProvider` wrapper around children

2. **`app/page.tsx`**
   - Replaced custom auth hook with `SignInButton` component
   - Simplified authentication UI

## 🔑 Required Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key
```

## 🚀 Quick Start

1. **Get Google OAuth Credentials** (see `GOOGLE_SSO_SETUP.md` for details)
2. **Create `.env.local`** with your credentials
3. **Run the app**: `npm run dev`
4. **Test login**: Click "Login with Google" button

## 📝 Key Components Usage

### Using Session in Components

```tsx
"use client";
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Not signed in</p>;
  
  return <p>Signed in as {session?.user?.email}</p>;
}
```

### Protecting Server Components

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/");
  }
  
  return <div>Protected content</div>;
}
```

## 🔗 Important URLs

- **Sign in page**: `/api/auth/signin`
- **Sign out**: `/api/auth/signout`
- **Session info**: `/api/auth/session` (JSON)
- **Providers**: `/api/auth/providers` (JSON)
- **Callback**: `/api/auth/callback/google` (handled automatically)

## 📚 Documentation

For detailed setup instructions, see: **`GOOGLE_SSO_SETUP.md`**

