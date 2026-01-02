"use client";

import Toast from "./Toast";
import Sidebar from "./Sidebar";
import Header from "./Header";
import PlanCard from "./PlanCard";
import ApiKeysTable from "./ApiKeysTable";
import ApiKeyModal from "./ApiKeyModal";
import { useDashboard } from "../hooks/useDashboard";

export default function Dashboard() {
  const {
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
  } = useDashboard();

  // Sidebar starts open by default - no need to close it on initial load

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`flex-1 w-full transition-all duration-300 relative z-10 bg-white min-h-screen overflow-x-hidden ${
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      }`}>
        {/* Toggle Button - Mobile only (hidden when sidebar is open) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-[60] p-2.5 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 touch-manipulation lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-10 xl:py-12 pt-16 sm:pt-20 lg:pt-12 bg-white min-h-screen relative z-10 pointer-events-auto">
          <Header />
          <PlanCard payAsYouGo={payAsYouGo} onPayAsYouGoToggle={setPayAsYouGo} apiKeys={apiKeys} />

          {/* API Keys Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 lg:p-10 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3 sm:gap-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">API Keys</h3>
                <button
                  onClick={openCreateModal}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs sm:text-sm transition-colors touch-manipulation w-full sm:w-auto"
                  aria-label="Create API Key"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Create New Key</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                The key is used to authenticate your requests to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Research API
                </a>
                . To learn more, see the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  documentation page
                </a>
                .
              </p>
            </div>

            {loading ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm sm:text-base text-gray-600">Loading...</p>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <svg
                  className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">No API keys</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-600">Get started by creating a new API key.</p>
                <button
                  onClick={openCreateModal}
                  className="mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base touch-manipulation"
                >
                  Create API Key
                </button>
              </div>
            ) : (
              <ApiKeysTable
                apiKeys={apiKeys}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onCopy={copyKey}
                copiedKey={copiedKey}
              />
            )}
          </div>

          {/* Modal */}
          <ApiKeyModal
            showModal={showModal}
            editingKey={editingKey}
            formData={formData}
            onClose={closeModal}
            onSubmit={editingKey ? handleUpdate : handleCreate}
            onFormDataChange={setFormData}
            isCreating={isCreating}
            duplicateNameError={duplicateNameError}
            onClearDuplicateError={() => setDuplicateNameError(null)}
          />
        </div>
      </main>
    </div>
  );
}

