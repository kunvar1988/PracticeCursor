"use client";

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"

export function Navbar() {
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      console.log("[Navbar] Sign in initiated with Google OAuth");
      
      const result = await signIn("google", { 
        callbackUrl: "/",
        redirect: false 
      });
      
      if (result?.error) {
        console.error("[Navbar] Sign in error from NextAuth:", {
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
        console.log("[Navbar] Redirecting to OAuth provider:", result.url);
        window.location.href = result.url;
      } else if (result === undefined || result === null) {
        // OAuth flow might have been initiated - NextAuth will handle the redirect
        // Don't show error, just let the flow proceed
        console.log("[Navbar] OAuth flow may have been initiated");
        // Reset state after a short delay in case redirect doesn't happen
        setTimeout(() => {
          setIsSigningIn(false);
        }, 2000);
      } else {
        // Result exists but no URL - this shouldn't happen with OAuth
        // But don't show error alert as the flow might still work
        console.warn("[Navbar] Unexpected sign in result (no URL):", result);
        setIsSigningIn(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("[Navbar] Sign in error:", {
        error,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      alert(`Failed to sign in: ${errorMessage}`);
      setIsSigningIn(false);
    }
  };

  return (
    <nav className="border-b border-border bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <Link href="/" className="text-lg font-semibold">
              PracticeCursor Github Analyzer
            </Link>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-foreground hover:text-foreground/80 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-foreground hover:text-foreground/80 transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-sm text-foreground hover:text-foreground/80 transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <Button variant="ghost" size="sm" className="text-foreground" disabled>
                Loading...
              </Button>
            ) : session?.user ? (
              <>
                <Link href="/dashboards">
                  <Button size="sm">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <span className="text-blue-600 font-medium hidden sm:inline">
                    {session.user.name || session.user.email?.split("@")[0] || "User"}
                  </span>
                  <button
                    onClick={async () => {
                      try {
                        setIsSigningOut(true);
                        await signOut({ 
                          callbackUrl: "/",
                          redirect: true 
                        });
                      } catch (error) {
                        console.error("[Navbar] Sign out error:", error);
                        setIsSigningOut(false);
                      }
                    }}
                    disabled={isSigningOut}
                    className="text-red-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Button 
                  variant="blue" 
                  size="sm" 
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                >
                  {isSigningIn ? "Signing in..." : "Log In"}
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                >
                  {isSigningIn ? "Signing in..." : "Sign Up"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
