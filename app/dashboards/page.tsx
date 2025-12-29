/**
 * DASHBOARD PAGE - Route: /dashboards
 * 
 * This page shows the main dashboard where users can:
 * - View their current plan
 * - Create, edit, and delete API keys
 * - See API key usage statistics
 * 
 * URL: http://localhost:3000/dashboards
 */
"use client";

import Dashboard from "../components/Dashboard";

export default function DashboardPage() {
  return (
    <>
      <Dashboard />
    </>
  );
}
