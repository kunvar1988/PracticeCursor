import { NextRequest, NextResponse } from 'next/server';
import { summarizeReadme } from './chain';
import { validateApiKey, incrementApiKeyUsage } from '../../lib/apiKeyUtils';
import { getRepoInfo } from '../../lib/githubUtils';
import { getReadmeContent } from './github-utils';

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

    // Check if API key is provided (optional for public demo, required for authenticated requests)
    const apiKeyHeader = request.headers.get('x-api-key') || request.headers.get('Authorization');
    
    // Debug logging (remove in production)
    console.log('[GitHub Summarizer] API Key check:', {
      hasXApiKey: !!request.headers.get('x-api-key'),
      hasAuthorization: !!request.headers.get('Authorization'),
      apiKeyHeader: apiKeyHeader ? `${apiKeyHeader.substring(0, 10)}...` : null,
      allHeaders: Object.fromEntries(request.headers.entries())
    });
    
    // If API key is provided, validate and enforce rate limits
    if (apiKeyHeader && apiKeyHeader.trim()) {
      const validationResult = await validateApiKey(request);
      if (!validationResult.success) {
        console.log('[GitHub Summarizer] API Key validation failed');
        return validationResult.response;
      }

      console.log('[GitHub Summarizer] API Key validated, checking rate limit:', {
        usage: validationResult.apiKey.usage,
        limit: validationResult.apiKey.limit,
        willExceed: validationResult.apiKey.usage >= (validationResult.apiKey.limit || Infinity)
      });

      // Check rate limit and increment usage BEFORE processing the request
      const usageResult = await incrementApiKeyUsage(validationResult.apiKey);
      if (!usageResult.success) {
        console.log('[GitHub Summarizer] Rate limit exceeded - returning error response');
        // Ensure the response is properly formatted
        return usageResult.response;
      }

      console.log('[GitHub Summarizer] Rate limit check passed, new usage:', usageResult.apiKey.usage);
    } else {
      console.log('[GitHub Summarizer] No API key provided, proceeding without rate limiting');
    }
    // If no API key is provided, allow the request to proceed (public demo mode)

    // Parse request body to get GitHub URL
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          valid: false,
          error: "Invalid JSON format in request payload",
          details: "Please ensure your request body is valid JSON."
        },
        { status: 400 }
      );
    }
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
    const result = await summarizeReadme.invoke({
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

