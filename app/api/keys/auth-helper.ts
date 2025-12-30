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
    // Try to get token from NextAuth (reads from cookies)
    const token = await getToken({ 
      req: request, 
      secret: authOptions.secret 
    });

    // Log for debugging in production
    if (process.env.NODE_ENV === "production") {
      console.log("[Auth Helper] Token check:", {
        hasToken: !!token,
        hasSub: !!token?.sub,
        cookies: request.cookies.getAll().map(c => c.name),
        url: request.url,
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
    return NextResponse.json(
      { error: "Unauthorized", details: "Authentication required" },
      { status: 401 }
    );
  }

  return { userId };
}

