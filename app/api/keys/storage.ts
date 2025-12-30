// Database storage for API keys using Supabase

import { createClient } from '../../lib/supabaseServer';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  value?: string;
  usage?: number;
  environment?: string;
  createdAt: string;
  lastUsed?: string;
}

// Database row type (snake_case from Supabase)
interface ApiKeyRow {
  id: string;
  name: string;
  key: string;
  value?: string;
  usage?: number;
  environment?: string;
  created_at: string;
  last_used?: string;
  updated_at?: string;
}

// Convert database row to ApiKey interface
function rowToApiKey(row: ApiKeyRow): ApiKey {
  return {
    id: row.id,
    name: row.name,
    key: row.key,
    value: row.value || row.key, // Fallback to key if value is not set
    usage: row.usage ?? 0,
    environment: row.environment || undefined,
    createdAt: row.created_at,
    lastUsed: row.last_used || undefined,
  };
}

export async function getAllKeys(userId: string): Promise<ApiKey[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching API keys:', error);
    throw error;
  }

  return data ? data.map(rowToApiKey) : [];
}

export async function getKeyById(id: string, userId: string): Promise<ApiKey | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return undefined;
    }
    console.error('Error fetching API key:', error);
    throw error;
  }

  return data ? rowToApiKey(data) : undefined;
}

export async function createKey(
  name: string,
  key: string,
  userId: string,
  value?: string,
  usage?: number,
  environment?: string
): Promise<ApiKey> {
  const supabase = await createClient();
  // Build insert object
  const insertData: any = {
    name,
    key,
    user_id: userId,
    value: value || key, // Use provided value or default to key
    usage: usage ?? 0, // Default to 0 if not provided
  };
  
  // Only add environment if it's provided (column may not exist yet if migration hasn't run)
  // Try to insert with environment, but if it fails due to missing column, retry without it
  if (environment !== undefined) {
    insertData.environment = environment;
  }

  let data, error;
  
  // First attempt: try with environment if provided
  const result = await supabase
    .from('api_keys')
    .insert(insertData)
    .select()
    .single();
    
  data = result.data;
  error = result.error;

  // If error is PGRST204 (column not found), retry without environment
  if (error && error.code === 'PGRST204' && environment !== undefined) {
    console.warn('Environment column not found, creating API key without environment field');
    const insertDataWithoutEnv = { ...insertData };
    delete insertDataWithoutEnv.environment;
    
    const retryResult = await supabase
      .from('api_keys')
      .insert(insertDataWithoutEnv)
      .select()
      .single();
      
    data = retryResult.data;
    error = retryResult.error;
  }

  if (error) {
    console.error('Error creating API key:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to create API key');
  }

  return rowToApiKey(data);
}

export async function updateKey(
  id: string,
  name: string,
  key: string,
  userId: string,
  value?: string,
  usage?: number
): Promise<ApiKey | null> {
  const supabase = await createClient();
  // First, get the existing key to preserve environment and verify ownership
  const existingKey = await getKeyById(id, userId);
  if (!existingKey) {
    return null;
  }

  const updateData: any = {
    name,
    key,
    updated_at: new Date().toISOString(),
  };
  
  // Only update value if provided
  if (value !== undefined) {
    updateData.value = value;
  }
  
  // Only update usage if provided
  if (usage !== undefined) {
    updateData.usage = usage;
  }
  
  // Preserve existing environment value - don't overwrite it
  // Only include environment in update if the column exists and has a value
  if (existingKey.environment !== undefined) {
    updateData.environment = existingKey.environment;
  }

  let result = await supabase
    .from('api_keys')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  // If error is PGRST204 (column not found), retry without environment
  if (result.error && result.error.code === 'PGRST204' && existingKey.environment !== undefined) {
    const updateDataWithoutEnv = { ...updateData };
    delete updateDataWithoutEnv.environment;
    
    result = await supabase
      .from('api_keys')
      .update(updateDataWithoutEnv)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
  }

  const { data, error } = result;

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows updated
      return null;
    }
    console.error('Error updating API key:', error);
    throw error;
  }

  return data ? rowToApiKey(data) : null;
}

export async function deleteKey(id: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }

  // Return true if a row was deleted, false otherwise
  return data !== null && data.length > 0;
}

