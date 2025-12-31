import { useState } from "react";
import { useToast } from "./useToast";
import { useApiKeys } from "./useApiKeys";
import { ApiKey, FormData } from "../types/apiKey";
import { generateApiKeyValue } from "../lib/utils";

// Detect environment and set default key type
function getDefaultKeyType(): string {
  if (typeof window === "undefined") return "local";
  
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "local";
  }
  return "prod";
}

const initialFormData: FormData = {
  name: "",
  key: "",
  keyType: getDefaultKeyType(),
  limitMonthly: false,
  monthlyLimit: "",
};

export function useDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [payAsYouGo, setPayAsYouGo] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [duplicateNameError, setDuplicateNameError] = useState<string | null>(null);
  // Sidebar state - can be toggled on both mobile and desktop
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { apiKeys, loading, createApiKey, updateApiKey, deleteApiKey } = useApiKeys();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isCreating) return;
    
    setIsCreating(true);
    const startTime = Date.now();
    const minimumDelay = 1000; // 1 second in milliseconds
    
    try {
      // Use the form's keyType, which is already set based on environment
      const keyType = formData.keyType || getDefaultKeyType();
      const generatedKey = formData.key || generateApiKeyValue(keyType);
      
      // Parse limit: if limitMonthly is checked and monthlyLimit is provided, use it; otherwise null
      let limit: number | null = null;
      if (formData.limitMonthly && formData.monthlyLimit && formData.monthlyLimit.trim() !== '') {
        const parsed = parseInt(formData.monthlyLimit.trim(), 10);
        if (!isNaN(parsed) && parsed > 0) {
          limit = parsed;
        }
      }
      
      console.log('Creating API key with limit from form:', { 
        limitMonthly: formData.limitMonthly, 
        monthlyLimit: formData.monthlyLimit, 
        parsedLimit: limit 
      });
      
      // Execute API call and minimum delay in parallel
      const [result] = await Promise.all([
        createApiKey({
          name: formData.name,
          key: generatedKey,
          value: generatedKey,
          usage: 0,
          type: keyType,
          limit: limit,
        }),
        // Ensure loader is visible for at least 1 second
        new Promise(resolve => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, minimumDelay - elapsed);
          setTimeout(resolve, remaining);
        })
      ]);

      if (result.success) {
        setShowModal(false);
        setFormData(initialFormData);
        setDuplicateNameError(null);
        showSuccess("API key created successfully!");
      } else {
        // Check if it's a duplicate name error
        if (result.error === 'DUPLICATE_NAME') {
          const errorMsg = "An API key with this name already exists. Please choose a different name.";
          setDuplicateNameError(errorMsg);
          showError("⚠️ " + errorMsg);
        } else {
          setDuplicateNameError(null);
          showError(result.errorMessage || "Failed to create API key. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      showError("Failed to create API key. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKey) return;

    try {
      const success = await updateApiKey(editingKey.id, {
        name: formData.name,
        key: formData.key || editingKey.key,
      });

      if (success) {
        setShowModal(false);
        setEditingKey(null);
        setFormData(initialFormData);
        showSuccess("API key updated successfully!");
      } else {
        showError("Failed to update API key. Please try again.");
      }
    } catch (error) {
      console.error("Error updating API key:", error);
      showError("Failed to update API key. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    try {
      const success = await deleteApiKey(id);
      if (success) {
        showError("API key deleted successfully!");
      } else {
        showError("Failed to delete API key. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting API key:", error);
      showError("Failed to delete API key. Please try again.");
    }
  };

  const openCreateModal = () => {
    setEditingKey(null);
    setFormData(initialFormData);
    setDuplicateNameError(null);
    setShowModal(true);
  };

  const openEditModal = (key: ApiKey) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      key: key.key,
      keyType: key.type || getDefaultKeyType(),
      limitMonthly: false,
      monthlyLimit: "",
    });
    setShowModal(true);
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    showSuccess("Copied API Key to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingKey(null);
    setFormData(initialFormData);
    setDuplicateNameError(null);
  };

  return {
    // State
    showModal,
    editingKey,
    formData,
    copiedKey,
    payAsYouGo,
    sidebarOpen,
    apiKeys,
    loading,
    isCreating,
    duplicateNameError,
    toast,
    
    // Actions
    setFormData,
    setPayAsYouGo,
    setSidebarOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreateModal,
    openEditModal,
    copyKey,
    closeModal,
    hideToast,
    setDuplicateNameError,
  };
}

