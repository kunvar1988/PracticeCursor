import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./supabaseClient";

export interface ApiKeyData {
  id: string;
  name: string;
  key: string;
  value?: string;
  usage: number;
  limit: number | null;
}

export interface ApiKeyValidationResult {
  success: true;
  apiKey: ApiKeyData;
}

export interface ApiKeyValidationError {
  success: false;
  response: NextResponse;
}

export type ApiKeyValidationResponse = ApiKeyValidationResult | ApiKeyValidationError;

export interface UsageCheckResult {
  success: true;
  apiKey: ApiKeyData;
}

export interface UsageCheckError {
  success: false;
  response: NextResponse;
}

export type UsageCheckResponse = UsageCheckResult | UsageCheckError;

/**
 * Extracts API key from request headers
 * Supports both 'x-api-key' header and 'Authorization' header (Bearer token or plain)
 */
function extractApiKey(request: NextRequest): string | null {
  // Get API key from x-api-key header
  let key = request.headers.get('x-api-key');
  
  // Extract key from Authorization header (supports "Bearer <key>" or just "<key>")
  if (!key) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      key = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;
    }
  }

  return key?.trim() || null;
}

/**
 * Validates if the API key exists and is valid
 * 
 * @param request - The NextRequest object containing headers
 * @returns ApiKeyValidationResponse with either API key data or error response
 */
export async function validateApiKey(
  request: NextRequest
): Promise<ApiKeyValidationResponse> {
  // Extract API key from headers
  const key = extractApiKey(request);

  if (!key) {
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "API key is required",
          message: "Please provide an API key in the 'x-api-key' header or 'Authorization' header",
          valid: false 
        },
        { status: 400 }
      ),
    };
  }

  // Check if the key exists in the database
  // We check both 'key' and 'value' fields since value might contain the actual key
  // First try to find by 'key' field
  let { data, error } = await supabase
    .from('api_keys')
    .select('id, name, key, value, usage, limit')
    .eq('key', key)
    .maybeSingle();

  // If not found by 'key', try 'value' field
  if (!data && !error) {
    const result = await supabase
      .from('api_keys')
      .select('id, name, key, value, usage, limit')
      .eq('value', key)
      .maybeSingle();
    data = result.data;
    error = result.error;
  }

  if (error) {
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "Database error",
          message: "An error occurred while validating your API key. Please try again later.",
          valid: false 
        },
        { status: 500 }
      ),
    };
  }

  if (!data) {
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "Invalid API key",
          message: "The provided API key does not exist or is invalid. Please check your API key and try again.",
          valid: false 
        },
        { status: 401 }
      ),
    };
  }

  // Key is valid
  const apiKeyData: ApiKeyData = {
    id: data.id,
    name: data.name,
    key: data.key,
    value: data.value,
    usage: data.usage ?? 0,
    limit: data.limit,
  };

  return {
    success: true,
    apiKey: apiKeyData,
  };
}

/**
 * Increments usage counter for a validated API key
 * This is an alias for checkAndIncrementUsage for consistency
 * 
 * @param apiKey - The validated API key data from validateApiKey()
 * @returns UsageCheckResponse with either updated API key data or rate limit error
 */
export async function incrementApiKeyUsage(
  apiKey: ApiKeyData
): Promise<UsageCheckResponse> {
  const currentUsage = apiKey.usage;
  const rateLimit = apiKey.limit;
  
  // Check if rate limit is set and if usage has reached or exceeded the limit
  if (rateLimit !== null && rateLimit !== undefined && currentUsage >= rateLimit) {
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "Rate limit exceeded",
          message: `Your API key has reached its usage limit. Current usage: ${currentUsage} of ${rateLimit} requests. Please upgrade your plan or wait for the limit to reset.`,
          currentUsage,
          limit: rateLimit,
          valid: false 
        },
        { status: 429 }
      ),
    };
  }

  // Increment usage count and update last_used timestamp
  const newUsage = currentUsage + 1;
  const { error } = await supabase
    .from('api_keys')
    .update({ 
      usage: newUsage,
      last_used: new Date().toISOString()
    })
    .eq('id', apiKey.id);

  if (error) {
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "Failed to update usage",
          message: "An error occurred while updating API key usage. Please try again.",
          valid: false 
        },
        { status: 500 }
      ),
    };
  }

  // Return updated API key data with incremented usage
  return {
    success: true,
    apiKey: {
      ...apiKey,
      usage: newUsage,
    },
  };
}

