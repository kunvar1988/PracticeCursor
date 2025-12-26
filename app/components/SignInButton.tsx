"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function SignInButton() {
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gray-200 px-5 text-gray-600 md:w-[158px]">
        Loading...
      </div>
    );
  }

  if (session?.user) {
    return (
      <>
        <div className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-green-600 px-5 text-white md:w-[158px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          {session.user.name || session.user.email?.split("@")[0] || "User"}
        </div>
        <button
          onClick={async () => {
            try {
              setIsSigningOut(true);
              console.log("[SignInButton] Sign out initiated for user:", session.user?.email);
              
              const result = await signOut({ 
                callbackUrl: "/",
                redirect: true 
              });
              
              console.log("[SignInButton] Sign out successful");
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
              console.error("[SignInButton] Sign out error:", {
                error,
                message: errorMessage,
                stack: error instanceof Error ? error.stack : undefined,
                timestamp: new Date().toISOString(),
              });
              alert(`Failed to sign out: ${errorMessage}`);
            } finally {
              setIsSigningOut(false);
            }
          }}
          disabled={isSigningOut}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 md:w-[158px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
            </svg>
          {isSigningOut ? "Logging out..." : "Logout"}
        </button>
      </>
    );
  }

  return (
    <button
      onClick={async () => {
        try {
          setIsSigningIn(true);
          console.log("[SignInButton] Sign in initiated with Google OAuth");
          
          // Use redirect: false to catch errors, then redirect manually on success
          const result = await signIn("google", { 
            callbackUrl: "/",
            redirect: false 
          });
          
          if (result?.error) {
            console.error("[SignInButton] Sign in error from NextAuth:", {
              error: result.error,
              ok: result.ok,
              status: result.status,
              url: result.url,
              timestamp: new Date().toISOString(),
            });
            alert(`Sign in failed: ${result.error}`);
            setIsSigningIn(false);
          } else if (result?.url) {
            // If we have a URL (even if ok is not explicitly true), redirect to it
            // This handles OAuth flows where NextAuth returns a redirect URL
            console.log("[SignInButton] Redirecting to OAuth provider:", result.url);
            window.location.href = result.url;
          } else if (result === undefined || result === null) {
            // OAuth flow might have been initiated - NextAuth will handle the redirect
            // Don't show error, just let the flow proceed
            console.log("[SignInButton] OAuth flow may have been initiated");
            // Reset state after a short delay in case redirect doesn't happen
            setTimeout(() => {
              setIsSigningIn(false);
            }, 2000);
          } else {
            // Result exists but no URL - this shouldn't happen with OAuth
            // But don't show error alert as the flow might still work
            console.warn("[SignInButton] Unexpected sign in result (no URL):", result);
            setIsSigningIn(false);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
          console.error("[SignInButton] Sign in error:", {
            error,
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
          });
          alert(`Failed to sign in: ${errorMessage}`);
          setIsSigningIn(false);
        }
      }}
      disabled={isSigningIn}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 md:w-[158px] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      {isSigningIn ? "Signing in..." : "Login with Google"}
    </button>
  );
}

