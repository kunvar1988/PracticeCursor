import { NextRequest, NextResponse } from "next/server";
import * as storage from "./storage";
import { requireAuth } from "./auth-helper";

// GET - Fetch all API keys for authenticated user
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;
    const apiKeys = await storage.getAllKeys(userId);
    return NextResponse.json(apiKeys);
  } catch (error: unknown) {
    console.error("Error fetching API keys:", error);
    const errorDetails = error instanceof Error ? error.message : "Unknown error";
    const errorCode = (error as { code?: string })?.code || "UNKNOWN";
    return NextResponse.json(
      { 
        error: "Failed to fetch API keys",
        details: errorDetails,
        code: errorCode
      },
      { status: 500 }
    );
  }
}

// POST - Create a new API key for authenticated user
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;
    const body = await request.json();
    const { name, key, value, usage, environment } = body;

    if (!name || !key) {
      return NextResponse.json(
        { error: "Name and key are required" },
        { status: 400 }
      );
    }

    // Determine environment: use provided, or detect from request
    const env = environment || process.env.NODE_ENV || (process.env.VERCEL_ENV === 'production' ? 'production' : 'development');

    const newApiKey = await storage.createKey(name, key, userId, value, usage, env);
    return NextResponse.json(newApiKey, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating API key:", error);
    const errorDetails = error instanceof Error ? error.message : "Unknown error";
    const errorCode = (error as { code?: string })?.code || "UNKNOWN";
    return NextResponse.json(
      { 
        error: "Failed to create API key",
        details: errorDetails,
        code: errorCode
      },
      { status: 500 }
    );
  }
}

