import { useState, useEffect } from "react";
import { ApiKey } from "../types/apiKey";

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys");
      if (response.ok) {
        const data = await response.json();
        // Add default type and usage if not present
        const keysWithDefaults = data.map((key: ApiKey) => ({
          ...key,
          type: key.type || "dev",
          usage: key.usage ?? 0,
        }));
        setApiKeys(keysWithDefaults);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

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

      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch(`/api/keys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch(`/api/keys/${id}`, {
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

