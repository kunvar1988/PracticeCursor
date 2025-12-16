export const generateApiKeyValue = (keyType: string): string => {
  return `test-${keyType}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};

export const maskKey = (key: string): string => {
  if (key.length <= 8) return "•".repeat(key.length);
  const prefix = key.substring(0, 8);
  return prefix + "•".repeat(24);
};

