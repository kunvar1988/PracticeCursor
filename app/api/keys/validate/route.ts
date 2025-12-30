import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabaseServer";
import { getUserIdFromToken } from "../auth-helper";

// POST - Validate an API key (works with or without authentication)
// If authenticated: validates key for the specific user
// If not authenticated: validates if key exists in database (useful for Postman/testing)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const key = (body.key || body.apiKey)?.trim();

    if (!key) {
      return NextResponse.json(
        { error: "API key is required", valid: false },
        { status: 400 }
      );
    }

    // Try to get userId if authenticated (optional)
    const userId = await getUserIdFromToken(request);
    
    // Build query - if authenticated, filter by user_id; otherwise check all keys
    let query = supabase
      .from('api_keys')
      .select('id, name, key, value, usage, user_id');
    
    // First try to find by 'key' field
    query = query.eq('key', key.trim());
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    let { data, error } = await query.maybeSingle();

    // If not found by 'key', try 'value' field
    if (!data && !error) {
      let valueQuery = supabase
        .from('api_keys')
        .select('id, name, key, value, usage, user_id')
        .eq('value', key.trim());
      
      if (userId) {
        valueQuery = valueQuery.eq('user_id', userId);
      }
      
      const result = await valueQuery.maybeSingle();
      data = result.data;
      error = result.error;
    }

    // Log for debugging
    console.log("[Validate] Key validation attempt:", {
      userId: userId || "unauthenticated",
      keyLength: key.length,
      keyPrefix: key.substring(0, 8) + "...",
      found: !!data,
      error: error?.message,
    });

    if (error || !data) {
      // Key not found
      return NextResponse.json(
        { valid: false, message: "Invalid API key" },
        { status: 200 }
      );
    }

    // Key is valid - optionally update usage count
    const updateQuery = supabase
      .from('api_keys')
      .update({ 
        usage: (data.usage ?? 0) + 1,
        last_used: new Date().toISOString()
      })
      .eq('id', data.id);
    
    if (userId) {
      updateQuery.eq('user_id', userId);
    }
    
    await updateQuery;

    return NextResponse.json({
      valid: true,
      message: "API key is valid",
      key: {
        id: data.id,
        name: data.name,
        key: data.key,
      }
    });
  } catch (error: unknown) {
    console.error("Error validating API key:", error);
    const errorDetails = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        valid: false,
        error: "Failed to validate API key",
        details: errorDetails
      },
      { status: 500 }
    );
  }
}

