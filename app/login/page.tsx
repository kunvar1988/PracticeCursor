"use client";

import { useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

/**
 * LOGIN PAGE - Route: /login
 * 
 * This page handles user authentication by redirecting to NextAuth sign-in.
 * After successful login, users are redirected to the callback URL or home page.
 * 
 * URL: http://localhost:3000/login
 */
function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/api-playground";

  useEffect(() => {
    // Redirect to NextAuth sign-in with callback URL
    signIn("google", { 
      callbackUrl: callbackUrl as string,
      redirect: true 
    });
  }, [callbackUrl]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

