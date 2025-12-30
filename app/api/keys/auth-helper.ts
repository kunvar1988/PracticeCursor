import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Gets the user_id from the JWT token in the Authorization header or session cookie
 * @param request - The NextRequest object containing headers
 * @returns Promise with user_id or null if not authenticated
 */
export async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  try {
    // Get all cookies for debugging
    const allCookies = request.cookies.getAll();
    const cookieMap = Object.fromEntries(allCookies.map(c => [c.name, c.value]));
    
    // Try to get token - getToken should auto-detect cookie name
    // But we'll try both possible cookie names to be safe
    let token = await getToken({ 
      req: request, 
      secret: authOptions.secret,
    });

    // If token not found, try with explicit cookie name (for __Secure- prefix in production)
    if (!token) {
      const secureCookieName = "__Secure-next-auth.session-token";
      const regularCookieName = "next-auth.session-token";
      
      // Check which cookie exists
      const hasSecureCookie = !!cookieMap[secureCookieName];
      const hasRegularCookie = !!cookieMap[regularCookieName];
      
      if (hasSecureCookie) {
        token = await getToken({ 
          req: request, 
          secret: authOptions.secret,
          cookieName: secureCookieName,
        });
      } else if (hasRegularCookie) {
        token = await getToken({ 
          req: request, 
          secret: authOptions.secret,
          cookieName: regularCookieName,
        });
      }
    }

    // Log for debugging in production
    if (process.env.NODE_ENV === "production") {
      console.log("[Auth Helper] Token check:", {
        hasToken: !!token,
        hasSub: !!token?.sub,
        cookies: allCookies.map(c => c.name),
        sessionCookieValue: cookieMap["__Secure-next-auth.session-token"]?.substring(0, 20) + "..." || 
                            cookieMap["next-auth.session-token"]?.substring(0, 20) + "..." || "not found",
        url: request.url,
        secretLength: authOptions.secret?.length || 0,
      });
    }

    if (!token?.sub) {
      return null;
    }

    // The token.sub contains the user ID (UUID from database)
    return token.sub as string;
  } catch (error) {
    console.error("Error in getUserIdFromToken:", error);
    return null;
  }
}

/**
 * Middleware helper to check authentication and return user_id
 * Verifies JWT token from NextAuth session (via cookies)
 * Returns NextResponse with error if not authenticated, or user_id if authenticated
 */
export async function requireAuth(request: NextRequest): Promise<{ userId: string } | NextResponse> {
  const userId = await getUserIdFromToken(request);
  
  if (!userId) {
    // Enhanced logging for production debugging
    const cookies = request.cookies.getAll();
    const cookieNames = cookies.map(c => c.name);
    const hasNextAuthCookie = cookieNames.some(name => 
      name.includes('next-auth') || name.includes('authjs')
    );
    
    console.error("[requireAuth] Authentication failed:", {
      hasUserId: !!userId,
      cookieCount: cookies.length,
      cookieNames,
      hasNextAuthCookie,
      url: request.url,
      method: request.method,
      headers: {
        host: request.headers.get('host'),
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      },
    });
    
    return NextResponse.json(
      { error: "Unauthorized", details: "Authentication required" },
      { status: 401 }
    );
  }

  return { userId };
}

