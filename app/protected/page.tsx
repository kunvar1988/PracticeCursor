/**
 * PROTECTED PAGE - Route: /protected
 * 
 * This page validates API keys and shows access status.
 * Users are redirected here from the playground after entering an API key.
 * 
 * Features:
 * - Validates API key from sessionStorage
 * - Shows success/error messages
 * - Redirects to playground if no key provided
 * 
 * URL: http://localhost:3000/protected
 */
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

export default function ProtectedPage() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const hasValidated = useRef(false);

  useEffect(() => {
    // Prevent duplicate validation calls
    if (hasValidated.current) {
      return;
    }

    // Get API key from sessionStorage
    const keyToValidate = sessionStorage.getItem("apiKeyToValidate");
    
    if (!keyToValidate) {
      // No API key provided, redirect to playground
      router.push("/playground");
      return;
    }

    hasValidated.current = true;
    setApiKey(keyToValidate);
    validateApiKey(keyToValidate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateApiKey = async (key: string) => {
    try {
      setIsValidating(true);
      
      // Validate the API key using the dedicated validate endpoint
      const response = await fetch("/api/keys/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({ key }),
      });

      const result = await response.json();
      
      // Check for authentication errors
      if (response.status === 401) {
        setIsValid(false);
        showError("Authentication required. Please sign in to validate API keys.");
        sessionStorage.removeItem("apiKeyToValidate");
        return;
      }
      
      // Check for other errors
      if (!response.ok) {
        throw new Error(result.error || "Failed to validate API key");
      }
      
      setIsValid(result.valid);
      
      if (result.valid) {
        showSuccess("Valid API key, /protected can be accessed");
      } else {
        showError(result.message || "Invalid API key");
      }

      // Clear the sessionStorage after validation
      sessionStorage.removeItem("apiKeyToValidate");
    } catch (error) {
      console.error("Error validating API key:", error);
      setIsValid(false);
      showError("Invalid API key");
      sessionStorage.removeItem("apiKeyToValidate");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex relative overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      <div className={`flex-1 w-full transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Toggle Button - Mobile (hidden when sidebar is open) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-[60] p-2.5 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 touch-manipulation lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {/* Toggle Button - Desktop (when sidebar is closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex fixed top-4 left-4 z-[60] p-2.5 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-all duration-300"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        
        <main className="p-4 sm:p-6 md:p-8 pt-20 sm:pt-24 lg:pt-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Protected Page</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              This page validates your API key before allowing access.
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
              {isValidating ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Validating API key...</p>
                  </div>
                </div>
              ) : isValid ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    Access Granted
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                    Your API key is valid. You can now access protected resources.
                  </p>
                  <button
                    onClick={() => router.push("/playground")}
                    className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base touch-manipulation"
                  >
                    Try Another Key
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-red-600"
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
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    Access Denied
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                    The provided API key is invalid. Please check your key and try again.
                  </p>
                  <button
                    onClick={() => router.push("/playground")}
                    className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base touch-manipulation"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
    </>
  );
}

