"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * API PLAYGROUND PAGE - Route: /api-playground
 * 
 * This page redirects to /playground which is the main API playground page.
 * 
 * URL: http://localhost:3000/api-playground
 */
export default function ApiPlaygroundPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to playground
    router.replace("/playground");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to playground...</p>
      </div>
    </div>
  );
}

