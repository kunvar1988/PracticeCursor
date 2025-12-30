import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabaseServer";
import { requireAuth } from "../auth-helper";

// POST - Validate an API key for authenticated user
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;
    const supabase = await createClient();
    const body = await request.json();
    const key = (body.key || body.apiKey)?.trim();

    if (!key) {
      return NextResponse.json(
        { error: "API key is required", valid: false },
        { status: 400 }
      );
    }

    // Check if the key exists in the database for this user
    // We check both 'key' and 'value' fields since value might contain the actual key
    // First try to find by 'key' field
    let { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key, value, usage')
      .eq('key', key.trim())
      .eq('user_id', userId)
      .maybeSingle();

    // If not found by 'key', try 'value' field
    if (!data && !error) {
      const result = await supabase
        .from('api_keys')
        .select('id, name, key, value, usage')
        .eq('value', key.trim())
        .eq('user_id', userId)
        .maybeSingle();
      data = result.data;
      error = result.error;
    }

    // Log for debugging
    console.log("[Validate] Key validation attempt:", {
      userId,
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
    await supabase
      .from('api_keys')
      .update({ 
        usage: (data.usage ?? 0) + 1,
        last_used: new Date().toISOString()
      })
      .eq('id', data.id)
      .eq('user_id', userId);

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

