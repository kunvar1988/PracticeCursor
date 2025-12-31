"use client";

import { ApiKey } from "../types/apiKey";

interface PlanCardProps {
  payAsYouGo: boolean;
  onPayAsYouGoToggle: (value: boolean) => void;
  apiKeys?: ApiKey[];
}

export default function PlanCard({ payAsYouGo, onPayAsYouGoToggle, apiKeys = [] }: PlanCardProps) {
  // Calculate total usage from all API keys
  const totalUsage = apiKeys.reduce((sum, key) => sum + (key.usage || 0), 0);
  const totalLimit = 1000; // Default limit, can be made configurable later
  return (
    <div className="mb-6 sm:mb-8 rounded-lg p-4 sm:p-6 md:p-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
            CURRENT PLAN
          </span>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation self-start sm:self-auto">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Manage Plan
          </button>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">PracticeCursor API</h2>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm sm:text-base font-medium">API Limit</span>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <span className="text-white/95 font-medium">{totalUsage.toLocaleString()} / {totalLimit.toLocaleString()} Requests</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div 
                  className="bg-white rounded-full h-1.5 transition-all duration-300" 
                  style={{ width: `${Math.min((totalUsage / totalLimit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 pt-2">
            <span className="text-sm sm:text-base font-medium">Pay as you go</span>
            <svg
              className="w-4 h-4 text-white/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <button
              onClick={() => onPayAsYouGoToggle(!payAsYouGo)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors touch-manipulation ${
                payAsYouGo ? "bg-white" : "bg-white/30"
              }`}
              aria-label="Toggle pay as you go"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-pink-600 transition-transform ${
                  payAsYouGo ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

