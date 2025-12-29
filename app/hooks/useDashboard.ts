import { useState } from "react";
import { useToast } from "./useToast";
import { useApiKeys } from "./useApiKeys";
import { ApiKey, FormData } from "../types/apiKey";
import { generateApiKeyValue } from "../lib/utils";

const initialFormData: FormData = {
  name: "",
  key: "",
  keyType: "dev",
  limitMonthly: false,
  monthlyLimit: "",
};

export function useDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [payAsYouGo, setPayAsYouGo] = useState(false);
  // Sidebar starts closed on mobile, but will be always visible on desktop (lg+) via CSS
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { apiKeys, loading, createApiKey, updateApiKey, deleteApiKey } = useApiKeys();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generatedKey = formData.key || generateApiKeyValue(formData.keyType);
      const success = await createApiKey({
        name: formData.name,
        key: generatedKey,
        value: generatedKey,
        usage: 0,
        type: formData.keyType,
      });

      if (success) {
        setShowModal(false);
        setFormData(initialFormData);
        showSuccess("API key created successfully!");
      } else {
        showError("Failed to create API key. Please try again.");
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      showError("Failed to create API key. Please try again.");
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
    setShowModal(true);
  };

  const openEditModal = (key: ApiKey) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      key: key.key,
      keyType: key.type || "dev",
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
  };
}

