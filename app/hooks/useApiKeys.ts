import { useState, useEffect } from "react";
import { ApiKey } from "../types/apiKey";
import { useSession } from "next-auth/react";

/**
 * Helper function to make authenticated API requests
 * NextAuth cookies are automatically sent with fetch requests
 */
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  // NextAuth stores JWT in cookies, which are automatically sent with fetch
  // The server will verify the JWT from cookies using getToken
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Ensure cookies are sent (critical for production)
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // Ensure cookies are sent in cross-origin requests
    mode: "cors",
  });

  // Log authentication failures for debugging
  if (!response.ok && response.status === 401) {
    console.error("[authenticatedFetch] Authentication failed:", {
      url,
      status: response.status,
      statusText: response.statusText,
      cookies: document.cookie ? document.cookie.split(';').map(c => c.trim().split('=')[0]) : 'No cookies',
    });
  }

  return response;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const fetchApiKeys = async () => {
    try {
      const response = await authenticatedFetch("/api/keys");
      if (response.ok) {
        const data = await response.json();
        // Add default type and usage if not present
        // Map "dev" to "local" and "prod" to "Prod" for display
        const keysWithDefaults = data.map((key: ApiKey) => {
          let displayType = key.type || "local";
          // Normalize old "dev" keys to "local" for display
          if (displayType === "dev") {
            displayType = "local";
          }
          // Capitalize "prod" to "Prod" for display
          if (displayType === "prod") {
            displayType = "Prod";
          }
          return {
            ...key,
            type: displayType,
            usage: key.usage ?? 0,
          };
        });
        setApiKeys(keysWithDefaults);
      } else if (response.status === 401) {
        console.error("Unauthorized: Please sign in");
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchApiKeys();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const createApiKey = async (data: {
    name: string;
    key: string;
    value: string;
    usage: number;
    type: string;
  }): Promise<boolean> => {
    try {
      // Detect environment: localhost = 'local', otherwise 'production'
      const environment = typeof window !== 'undefined' 
        ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'local' 
            : 'production')
        : 'production';

      const response = await authenticatedFetch("/api/keys", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          environment, // Include environment in the request
        }),
      });

      if (response.ok) {
        await fetchApiKeys();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating API key:", error);
      return false;
    }
  };

  const updateApiKey = async (id: string, data: { name: string; key: string }): Promise<boolean> => {
    try {
      const response = await authenticatedFetch(`/api/keys/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchApiKeys();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating API key:", error);
      return false;
    }
  };

  const deleteApiKey = async (id: string): Promise<boolean> => {
    try {
      const response = await authenticatedFetch(`/api/keys/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchApiKeys();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting API key:", error);
      return false;
    }
  };

  return {
    apiKeys,
    loading,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
}

