"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="mb-6 sm:mb-8 md:mb-12">
      <div className="flex items-start gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-1 flex-wrap">
            <Link
              href="/"
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline active:text-blue-800 transition-colors"
            >
              Home
            </Link>
            <span className="text-xs sm:text-sm text-gray-400">/</span>
            <p className="text-xs sm:text-sm text-gray-400">Pages / Overview</p>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Overview</h1>
        </div>
      </div>
    </div>
  );
}

