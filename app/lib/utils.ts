export const generateApiKeyValue = (keyType: string): string => {
  // Normalize keyType: "dev" -> "dev", "local" -> "local", "prod" -> "prod"
  // This ensures the prefix matches the type
  const normalizedType = keyType === "dev" ? "dev" : keyType === "local" ? "local" : "prod";
  // Use just the type as prefix (e.g., "prod-xxxxx" instead of "test-prod-xxxxx")
  return `${normalizedType}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};

export const maskKey = (key: string): string => {
  if (key.length <= 8) return "•".repeat(key.length);
  const prefix = key.substring(0, 8);
  return prefix + "•".repeat(24);
};

