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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="min-h-screen bg-white flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className={`flex-1 w-full transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Toggle Button - Mobile and Desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed top-16 sm:top-4 lg:top-4 z-50 p-2 sm:p-2.5 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-300 touch-manipulation ${
            sidebarOpen ? "left-[260px] lg:left-[260px]" : "left-4 lg:left-4"
          }`}
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
              d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        
        <main className="p-4 sm:p-6 md:p-8 pt-20 sm:pt-24 lg:pt-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">API Playground</h1>
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
                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base touch-manipulation"
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

