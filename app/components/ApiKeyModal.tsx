"use client";

import { FormData, ApiKey } from "../types/apiKey";

interface ApiKeyModalProps {
  showModal: boolean;
  editingKey: ApiKey | null;
  formData: FormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: FormData) => void;
}

export default function ApiKeyModal({
  showModal,
  editingKey,
  formData,
  onClose,
  onSubmit,
  onFormDataChange,
}: ApiKeyModalProps) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto">
        {editingKey ? (
          // Edit Modal (simpler version)
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit API Key</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          // Create Modal (full design)
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create a new API key</h2>
            <p className="text-sm text-gray-600 mb-6">
              Enter a name and limit for the new API key.
            </p>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Key Name */}
              <div>
                <label
                  htmlFor="key-name"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Key Name — A unique name to identify this key
                </label>
                <input
                  type="text"
                  id="key-name"
                  value={formData.name}
                  onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                  placeholder="Key Name"
                  className="w-full px-4 py-2 border-2 border-blue-500 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Key Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Key Type — Choose the environment for this key
                </label>
                <div className="space-y-3">
                  {/* Development Option */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.keyType === "dev"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="keyType"
                      value="dev"
                      checked={formData.keyType === "dev"}
                      onChange={(e) =>
                        onFormDataChange({ ...formData, keyType: e.target.value })
                      }
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                          </svg>
                        </div>
                        <div>
                          <div
                            className={`font-semibold ${
                              formData.keyType === "dev" ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            Development
                          </div>
                          <div
                            className={`text-sm ${
                              formData.keyType === "dev" ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            Rate limited to 100 requests/minute
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Production Option */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.keyType === "prod"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="keyType"
                      value="prod"
                      checked={formData.keyType === "prod"}
                      onChange={(e) =>
                        onFormDataChange({ ...formData, keyType: e.target.value })
                      }
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div
                            className={`font-semibold ${
                              formData.keyType === "prod" ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            Production
                          </div>
                          <div
                            className={`text-sm ${
                              formData.keyType === "prod" ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            Rate limited to 1,000 requests/minute
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Limit Monthly Usage */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.limitMonthly}
                    onChange={(e) =>
                      onFormDataChange({ ...formData, limitMonthly: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Limit monthly usage*</span>
                </label>
                {formData.limitMonthly && (
                  <input
                    type="number"
                    value={formData.monthlyLimit}
                    onChange={(e) =>
                      onFormDataChange({ ...formData, monthlyLimit: e.target.value })
                    }
                    placeholder="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 leading-relaxed">
                * If the combined usage of all your keys exceeds your account&apos;s allocated usage
                limit (plan, add-ons, and any pay-as-you-go limit), all requests will be rejected.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

