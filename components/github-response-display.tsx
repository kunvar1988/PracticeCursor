"use client";

interface GitHubResponse {
  valid: boolean;
  summary?: string;
  cool_facts?: string[];
  stars?: number | null;
  latestVersion?: string | null;
  websiteUrl?: string | null;
  licenseType?: string | null;
  error?: string;
  details?: string;
}

interface GitHubResponseDisplayProps {
  response: GitHubResponse | null;
  error?: string | null;
}

export function GitHubResponseDisplay({ response, error }: GitHubResponseDisplayProps) {
  // If there's an error or invalid response, show JSON format
  if (error || !response || !response.valid) {
    // Use the actual response object if available, otherwise create error object
    const errorResponse = response || { 
      valid: false, 
      error: error || "Failed to process request", 
      details: error || "No response received" 
    };
    
    return (
      <div className="w-full">
        <pre className="p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-x-auto text-xs sm:text-sm font-mono whitespace-pre-wrap">
          <code className="text-gray-900">
            {JSON.stringify(errorResponse, null, 2)}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      {response.summary && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Summary</h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
            {response.summary}
          </p>
        </div>
      )}

      {/* Cool Facts Section */}
      {response.cool_facts && response.cool_facts.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Cool Facts</h3>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
            {response.cool_facts.map((fact, index) => (
              <li key={index} className="leading-relaxed">{fact}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Repository Metadata Section */}
      {(response.stars != null || response.latestVersion || response.websiteUrl || response.licenseType) && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Repository Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {response.stars != null && (
              <div>
                <span className="text-sm font-medium text-gray-600">Stars:</span>
                <span className="ml-2 text-sm sm:text-base text-gray-900">{response.stars.toLocaleString()}</span>
              </div>
            )}
            {response.latestVersion && (
              <div>
                <span className="text-sm font-medium text-gray-600">Latest Version:</span>
                <span className="ml-2 text-sm sm:text-base text-gray-900">{response.latestVersion}</span>
              </div>
            )}
            {response.websiteUrl && (
              <div>
                <span className="text-sm font-medium text-gray-600">Website:</span>
                <a
                  href={response.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-sm sm:text-base text-blue-600 hover:text-blue-800 underline"
                >
                  {response.websiteUrl}
                </a>
              </div>
            )}
            {response.licenseType && (
              <div>
                <span className="text-sm font-medium text-gray-600">License:</span>
                <span className="ml-2 text-sm sm:text-base text-gray-900">{response.licenseType}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

