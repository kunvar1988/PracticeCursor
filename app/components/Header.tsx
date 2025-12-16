"use client";

export default function Header() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">Pages / Overview</p>
          <h1 className="text-4xl font-bold text-gray-900">Overview</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-700">Operational</span>
        </div>
      </div>
    </div>
  );
}

