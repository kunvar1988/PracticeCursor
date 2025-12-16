"use client";

interface PlanCardProps {
  payAsYouGo: boolean;
  onPayAsYouGoToggle: (value: boolean) => void;
}

export default function PlanCard({ payAsYouGo, onPayAsYouGoToggle }: PlanCardProps) {
  return (
    <div className="mb-8 rounded-lg p-8 bg-gradient-to-r from-pink-500 via-pink-400 to-blue-400 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
            CURRENT PLAN
          </span>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
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
        <h2 className="text-5xl font-bold mb-8">Researcher</h2>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base font-medium">API Usage</span>
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
            </div>
            <p className="text-sm text-white/90 mb-3">Monthly plan</p>
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/95 font-medium">0/1,000 Credits</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div className="bg-white rounded-full h-1.5" style={{ width: "0%" }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-base font-medium">Pay as you go</span>
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                payAsYouGo ? "bg-white" : "bg-white/30"
              }`}
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

