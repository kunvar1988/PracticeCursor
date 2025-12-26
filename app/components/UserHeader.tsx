"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Toast from "./Toast";
import { useToast } from "../hooks/useToast";

export default function UserHeader() {
  const { data: session } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { toast, showError, showSuccess, hideToast } = useToast();

  // Check for authentication errors in URL parameters
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get("error");
      if (error) {
        console.error("[UserHeader] Authentication error detected in URL:", {
          error,
          errorDescription: urlParams.get("error_description"),
          timestamp: new Date().toISOString(),
        });
        showError(`Authentication failed: ${error}`);
        // Clean up URL by removing error parameters
        urlParams.delete("error");
        urlParams.delete("error_description");
        const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : "");
        window.history.replaceState({}, "", newUrl);
      }
    } catch (err) {
      console.warn("[UserHeader] Could not check for URL error parameters:", err);
    }
  }, [showError]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Practice Cursor</h1>
        </div>
        {session?.user && (
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
            <span className="text-blue-600 font-medium">
              {session.user.name || session.user.email?.split("@")[0] || "User"}
            </span>
            <button
              onClick={async () => {
                try {
                  setIsSigningOut(true);
                  console.log("[UserHeader] Sign out initiated for user:", session.user?.email);
                  
                  const result = await signOut({ 
                    callbackUrl: "/",
                    redirect: true 
                  });
                  
                  console.log("[UserHeader] Sign out successful");
                  showSuccess("Signed out successfully");
                } catch (error) {
                  const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
                  console.error("[UserHeader] Sign out error:", {
                    error,
                    message: errorMessage,
                    stack: error instanceof Error ? error.stack : undefined,
                    timestamp: new Date().toISOString(),
                  });
                  showError(`Failed to sign out: ${errorMessage}`);
                } finally {
                  setIsSigningOut(false);
                }
              }}
              disabled={isSigningOut}
              className="text-red-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        )}
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </header>
  );
}

