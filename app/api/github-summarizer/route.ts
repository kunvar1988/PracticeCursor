import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";

// POST - GitHub Summarizer endpoint with API key validation
export async function POST(request: NextRequest) {
  try {
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
        { status: 401 }
      );
    }

    // Key is valid - update usage count
    await supabase
      .from('api_keys')
      .update({ 
        usage: (data.usage ?? 0) + 1,
        last_used: new Date().toISOString()
      })
      .eq('id', data.id);

    // Parse request body to get GitHub URL
    const body = await request.json();
    const githubUrl = body.githubUrl || body.url;

    if (!githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL is required", valid: false },
        { status: 400 }
      );
    }

    // Fetch README content
    const readmeContent = await getReadmeContent(githubUrl);
    console.log(readmeContent);

    // TODO: Add GitHub summarization logic here
    // For now, return success response
    return NextResponse.json({
      valid: true,
      message: "GitHub summarization completed",
      // Add your GitHub summarization response here
    });
  } catch (error: any) {
    console.error("Error in github-summarizer:", error);
    return NextResponse.json(
      { 
        valid: false,
        error: "Failed to process request",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
/**
 * Fetches the README.md content for a given GitHub repository URL.
 * 
 * @param {string} githubUrl - The URL of the GitHub repository, e.g., https://github.com/owner/repo
 * @returns {Promise<string | null>} The README content as plain text, or null if not found/error.
 */
async function getReadmeContent(githubUrl: string): Promise<string | null> {
  try {
    // Parse the GitHub repository owner and name from the URL
    // Supports URLs like: https://github.com/owner/repo, with or without trailing slash
    const match = githubUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
    if (!match) {
      return null;
    }
    const owner = match[1];
    const repo = match[2];

    // Try main branch first, then fallback to master if needed
    const branches = ['main', 'master'];
    let response, rawContent;
    for (const branch of branches) {
      // The raw content URL
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      response = await fetch(rawUrl);
      if (response.ok) {
        rawContent = await response.text();
        return rawContent;
      }
    }
    // If not found in either branch, return null
    return null;
  } catch (e) {
    // Log error only in development for debugging
    // console.error("Error fetching README.md:", e);
    return null;
  }
}

