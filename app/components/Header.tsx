"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Link
              href="/"
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Home
            </Link>
            <span className="text-xs sm:text-sm text-gray-400">/</span>
            <p className="text-xs sm:text-sm text-gray-400">Pages / Overview</p>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Overview</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full self-start sm:self-auto">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs sm:text-sm font-medium text-green-700">Operational</span>
        </div>
      </div>
    </div>
  );
}

