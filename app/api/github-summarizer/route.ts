import { NextRequest, NextResponse } from "next/server";
import { validateSupabaseConfig } from "../../lib/supabaseClient";
import { summarizeRepoChain } from "./chain";
import { validateApiKey, checkAndIncrementUsage } from "../keys/rate-limit";


// POST - GitHub Summarizer endpoint with API key validation
export async function POST(request: NextRequest) {
  try {
    // Validate environment variables at runtime
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          valid: false,
          error: "OpenAI API key not configured",
          details: "Please set the 'OPENAI_API_KEY' environment variable. See ENV_SETUP.md for instructions."
        },
        { status: 500 }
      );
    }

    // Validate Supabase configuration at runtime
    try {
      validateSupabaseConfig();
    } catch (error) {
      return NextResponse.json(
        { 
          valid: false,
          error: "Supabase configuration error",
          details: error instanceof Error ? error.message : "Missing Supabase environment variables"
        },
        { status: 500 }
      );
    }

    // Validate API key
    const validationResult = await validateApiKey(request);
    if (!validationResult.success) {
      return validationResult.response;
    }

    // Check rate limit and increment usage
    const usageResult = await checkAndIncrementUsage(validationResult.apiKey);
    if (!usageResult.success) {
      return usageResult.response;
    }

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
    
    if (!readmeContent) {
      return NextResponse.json(
        { error: "Could not fetch README content from the GitHub repository", valid: false },
        { status: 404 }
      );
    }

    // Use the chain to summarize the repository
    const result = await summarizeRepoChain.invoke({
      readmeContent: readmeContent,
    });

    // Return the summarized result
    return NextResponse.json({
      valid: true,
      ...result
    });
  } catch (error: unknown) {
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Check if it's an OpenAI API key error
    if (errorMessage.includes("OPENAI_API_KEY") || errorMessage.includes("Missing credentials")) {
      return NextResponse.json(
        { 
          valid: false,
          error: "OpenAI API key not configured",
          details: "Please set the 'OPENAI_API_KEY' environment variable in your .env.local file. See ENV_SETUP.md for instructions."
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        valid: false,
        error: "Failed to process request",
        details: errorMessage
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


