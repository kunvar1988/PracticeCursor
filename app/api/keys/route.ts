import { NextRequest, NextResponse } from "next/server";
import * as storage from "./storage";

// GET - Fetch all API keys
export async function GET() {
  try {
    const apiKeys = await storage.getAllKeys();
    return NextResponse.json(apiKeys);
  } catch (error: any) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch API keys",
        details: error?.message || "Unknown error",
        code: error?.code || "UNKNOWN"
      },
      { status: 500 }
    );
  }
}

// POST - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, key, value, usage } = body;

    if (!name || !key) {
      return NextResponse.json(
        { error: "Name and key are required" },
        { status: 400 }
      );
    }

    const newApiKey = await storage.createKey(name, key, value, usage);
    return NextResponse.json(newApiKey, { status: 201 });
  } catch (error: any) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      { 
        error: "Failed to create API key",
        details: error?.message || "Unknown error",
        code: error?.code || "UNKNOWN"
      },
      { status: 500 }
    );
  }
}

