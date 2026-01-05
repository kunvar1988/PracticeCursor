/**
 * API PLAYGROUND PAGE - Route: /playground
 * 
 * This page allows users to:
 * - Enter an API key for testing
 * - Enter a GitHub URL to summarize
 * - Make requests to /api/github-summarizer
 * - View the summarization results
 * 
 * URL: http://localhost:3000/playground
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { GitHubResponseDisplay } from "@/components/github-response-display";

interface SummarizerResponse {
  valid: boolean;
  summary?: string;
  cool_facts?: string[];
  stars?: number | null;
  latestVersion?: string | null;
  websiteUrl?: string | null;
  licenseType?: string | null;
  error?: string;
  details?: string;
}

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [summaryResult, setSummaryResult] = useState<SummarizerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!githubUrl.trim()) {
      setError("Please enter a GitHub URL");
      return;
    }

    setIsSummarizing(true);
    setError(null);
    setSummaryResult(null);

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (apiKey.trim()) {
        headers["x-api-key"] = apiKey.trim();
      }

      const response = await fetch("/api/github-summarizer", {
        method: "POST",
        headers,
        body: JSON.stringify({ githubUrl: githubUrl.trim() }),
      });

      const data: SummarizerResponse = await response.json();

      if (!response.ok || !data.valid) {
        // Store the error response to show as JSON
        setSummaryResult(data);
        setError(data.error || data.details || "Failed to summarize repository");
      } else {
        setSummaryResult(data);
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      // Create error response object for JSON display
      setSummaryResult({
        valid: false,
        error: "Failed to process request",
        details: errorMessage
      });
      setError(errorMessage);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex relative overflow-hidden">
        {/* Subtle gray gradient at the very top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 z-10"></div>
        
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
          
          <main className="p-4 sm:p-6 md:p-8 lg:p-10 pt-16 sm:pt-20 lg:pt-8 bg-white">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">API Playground</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* API Key Input */}
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="text"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm sm:text-base"
                    disabled={isSummarizing}
                  />
                </div>

                {/* GitHub URL Input */}
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm sm:text-base"
                    disabled={isSummarizing}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSummarizing || !githubUrl.trim()}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base shadow-sm"
                >
                  {isSummarizing ? "Loading..." : "Submit"}
                </button>
              </form>

              {/* Results Section */}
              {(summaryResult || error) && (
                <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Response</h2>
                  <GitHubResponseDisplay response={summaryResult} error={error} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

