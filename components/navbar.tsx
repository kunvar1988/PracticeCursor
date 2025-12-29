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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className="border-b border-border bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5 sm:h-6 sm:w-6" />
            <Link href="/" className="text-base sm:text-lg font-bold">
              <span className="hidden sm:inline-block font-bold">
                <span className="block font-bold">PracticeCursor</span>
                <span className="block font-bold">Github Analyzer</span>
              </span>
              <span className="sm:hidden font-bold">PracticeCursor</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            <div className="flex flex-col space-y-2">
              <Link 
                href="#features" 
                className="px-4 py-2 text-sm text-foreground hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#pricing" 
                className="px-4 py-2 text-sm text-foreground hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="#about" 
                className="px-4 py-2 text-sm text-foreground hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
            
            <div className="pt-4 border-t border-border space-y-2">
              {status === "loading" ? (
                <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
              ) : session?.user ? (
                <>
                  <Link href="/dashboards" className="block">
                    <Button size="sm" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3 px-4 py-2">
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
                    <span className="text-blue-600 font-medium text-sm flex-1">
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
                <div className="flex flex-col gap-2 px-4">
                  <Button 
                    variant="blue" 
                    size="sm" 
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="w-full"
                  >
                    {isSigningIn ? "Signing in..." : "Log In"}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="w-full"
                  >
                    {isSigningIn ? "Signing in..." : "Sign Up"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
