/**
 * API PLAYGROUND PAGE - Route: /playground
 * 
 * This page allows users to:
 * - Enter an API key for testing
 * - Validate API keys before using them
 * - Navigate to protected page after validation
 * 
 * URL: http://localhost:3000/playground
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Store the API key in sessionStorage to pass to protected page
    sessionStorage.setItem("apiKeyToValidate", apiKey.trim());
    
    // Navigate to protected page
    router.push("/protected");
  };

  return (
    <>
      <div className="min-h-screen bg-white flex relative overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className={`flex-1 w-full transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}>
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
          
          <main className="p-4 sm:p-6 md:p-8 lg:p-10 pt-16 sm:pt-20 lg:pt-8">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">API Playground</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Enter your API key to validate and access protected resources.
              </p>

              <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="text"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !apiKey.trim()}
                  className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base touch-manipulation"
                >
                  {isSubmitting ? "Validating..." : "Validate API Key"}
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

