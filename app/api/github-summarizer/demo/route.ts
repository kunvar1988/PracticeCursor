import { NextRequest, NextResponse } from "next/server";
import { summarizeRepoChain } from "../chain";

/**
 * Public demo endpoint for "Try It Out" section
 * This endpoint doesn't require API key authentication
 * but has rate limiting considerations for production
 */
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
 */
async function getReadmeContent(githubUrl: string): Promise<string | null> {
  try {
    // Parse the GitHub repository owner and name from the URL
    const match = githubUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
    if (!match) {
      return null;
    }
    const owner = match[1];
    const repo = match[2];

    // Try main branch first, then fallback to master if needed
    const branches = ['main', 'master'];
    for (const branch of branches) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      const response = await fetch(rawUrl);
      if (response.ok) {
        return await response.text();
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

