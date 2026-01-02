"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function TryItOutSection() {
  const [requestPayload, setRequestPayload] = useState(`{
  "githubUrl": "https://github.com/assafelovic/gpt-researcher"
}`)
  const [apiKey, setApiKey] = useState<string>("")
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendRequest = async () => {
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Parse the JSON payload
      const payload = JSON.parse(requestPayload)
      
      if (!payload.githubUrl) {
        setError("githubUrl is required in the payload")
        setIsLoading(false)
        return
      }

      // Build headers - include API key if provided
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      
      if (apiKey.trim()) {
        headers["x-api-key"] = apiKey.trim()
      }

      // Use the public demo endpoint (API key optional for rate limiting)
      const apiResponse = await fetch("/api/github-summarizer", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })

      const data = await apiResponse.json()

      if (!apiResponse.ok) {
        // For rate limit errors (429), show the specific error message
        if (apiResponse.status === 429 && data.error === "Rate limit exceeded") {
          setError(data.message || data.error)
        } else {
          setError(data.error || data.message || data.details || "Failed to process request")
        }
        setResponse(JSON.stringify(data, null, 2))
      } else {
        setResponse(JSON.stringify(data, null, 2))
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format in request payload")
      } else {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentation = () => {
    // Open documentation or scroll to a docs section
    window.open("/playground", "_blank")
  }

  return (
    <section id="try-it-out" className="bg-gray-50 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold px-4"
            style={{
              color: '#14b8a6',
              textShadow: '2px 2px 0px rgba(20, 184, 166, 0.4), 1px 1px 0px rgba(20, 184, 166, 0.3)'
            }}
          >
            Try It Out
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* API Request Card */}
          <Card className="bg-white border border-gray-200 shadow-sm flex flex-col">
            <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">API Request</h3>
              <p className="text-sm sm:text-base text-gray-600">Edit the payload and send a request</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key (Optional - for rate limiting)
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key to test rate limiting..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <textarea
                value={requestPayload}
                onChange={(e) => setRequestPayload(e.target.value)}
                className="w-full h-48 sm:h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder='{\n  "githubUrl": "https://github.com/owner/repo"\n}'
              />
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="flex-1 bg-black text-white hover:bg-gray-800 active:bg-gray-900 touch-manipulation"
                >
                  {isLoading ? "Sending..." : "Send Request"}
                </Button>
                <Button
                  onClick={handleDocumentation}
                  variant="outline"
                  className="flex-1 border-gray-300 text-black hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                >
                  Documentation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Response Card */}
          <Card className="bg-white border border-gray-200 shadow-sm flex flex-col">
            <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">API Response</h3>
              <p className="text-sm sm:text-base text-gray-600">View the response from the API</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6">
              <textarea
                value={response || (error ? JSON.stringify({ error }, null, 2) : "")}
                readOnly
                className="w-full h-48 sm:h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-gray-50 focus:outline-none overflow-y-auto"
                placeholder="Response will appear here..."
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

