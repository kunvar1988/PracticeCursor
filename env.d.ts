/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    // OpenAI
    OPENAI_API_KEY?: string;

    // Supabase
    NEXT_PUBLIC_SUPABASE_URL?: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;

    // NextAuth
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    NEXTAUTH_SECRET?: string;
    NEXTAUTH_URL?: string;

    // Vercel
    VERCEL?: string;
    VERCEL_ENV?: "development" | "preview" | "production";

    // Node
    NODE_ENV?: "development" | "production" | "test";
  }
}

