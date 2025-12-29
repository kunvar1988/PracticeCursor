/**
 * AUTH ERROR PAGE - Route: /auth/auth-code-error
 * 
 * This page displays authentication errors when OAuth/login fails.
 * It shows user-friendly error messages and provides options to retry or go home.
 * 
 * URL: http://localhost:3000/auth/auth-code-error?error=AccessDenied
 */
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function AuthCodeErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  useEffect(() => {
    if (error) {
      console.error("[Auth Error Page] Authentication error:", {
        error,
        errorDescription,
        allParams: Object.fromEntries(searchParams.entries()),
        timestamp: new Date().toISOString(),
      });
    }
  }, [error, errorDescription, searchParams]);

  const getErrorMessage = () => {
    if (error === "Configuration") {
      return "There is a problem with the server configuration. Please contact support.";
    }
    if (error === "AccessDenied") {
      return "Access denied. You may have cancelled the sign-in or don't have permission.";
    }
    if (error === "Verification") {
      return "The verification token has expired or has already been used.";
    }
    if (error === "OAuthSignin") {
      return "Error in constructing an authorization URL.";
    }
    if (error === "OAuthCallback") {
      return "Error in handling the response from the OAuth provider.";
    }
    if (error === "OAuthCreateAccount") {
      return "Could not create OAuth account in the database.";
    }
    if (error === "EmailCreateAccount") {
      return "Could not create email account in the database.";
    }
    if (error === "Callback") {
      return "Error in the OAuth callback handler route.";
    }
    if (error === "OAuthAccountNotLinked") {
      return "Email on the account is already linked, but not with this OAuth account.";
    }
    if (error === "EmailSignin") {
      return "Sending the e-mail with the verification token failed.";
    }
    if (error === "CredentialsSignin") {
      return "The credentials are invalid.";
    }
    if (error === "SessionRequired") {
      return "The session is required but not available.";
    }
    if (errorDescription) {
      return errorDescription;
    }
    return "There was an error during authentication. Please try again.";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="max-w-md w-full bg-white dark:bg-black rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {getErrorMessage()}
          </p>
          {error && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6 font-mono">
              Error Code: {error}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Return to Home
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-200 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCodeError() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="max-w-md w-full bg-white dark:bg-black rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <AuthCodeErrorContent />
    </Suspense>
  );
}

