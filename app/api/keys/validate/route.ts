import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

// POST - Validate an API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const key = body.key || body.apiKey;

    if (!key) {
      return NextResponse.json(
        { error: "API key is required", valid: false },
        { status: 400 }
      );
    }

    // Check if the key exists in the database
    // We check both 'key' and 'value' fields since value might contain the actual key
    // First try to find by 'key' field
    let { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key, value, usage')
      .eq('key', key)
      .maybeSingle();

    // If not found by 'key', try 'value' field
    if (!data && !error) {
      const result = await supabase
        .from('api_keys')
        .select('id, name, key, value, usage')
        .eq('value', key)
        .maybeSingle();
      data = result.data;
      error = result.error;
    }

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
      .eq('id', data.id);

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

