"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}

// Default export for use in server components
export default function Providers({ children }: SessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

