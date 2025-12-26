import { createClient } from '@/app/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  const errorParam = requestUrl.searchParams.get('error');

  // Log callback request
  console.log("[Auth Callback] Callback received:", {
    hasCode: !!code,
    hasError: !!errorParam,
    error: errorParam,
    next,
    timestamp: new Date().toISOString(),
  });

  // Check for OAuth error
  if (errorParam) {
    console.error("[Auth Callback] OAuth error received:", {
      error: errorParam,
      errorDescription: requestUrl.searchParams.get('error_description'),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
  }

  if (code) {
    try {
      const supabase = await createClient();
      console.log("[Auth Callback] Exchanging code for session...");
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("[Auth Callback] Error exchanging code for session:", {
          error: error.message,
          code: error.status,
          timestamp: new Date().toISOString(),
        });
        return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
      }
      
      console.log("[Auth Callback] Session exchange successful:", {
        userEmail: data?.user?.email,
        userId: data?.user?.id,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[Auth Callback] Unexpected error in callback:", {
        error,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
    }
  }

  // No code provided
  console.warn("[Auth Callback] No code provided in callback:", {
    searchParams: Object.fromEntries(requestUrl.searchParams),
    timestamp: new Date().toISOString(),
  });
  
  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
}

