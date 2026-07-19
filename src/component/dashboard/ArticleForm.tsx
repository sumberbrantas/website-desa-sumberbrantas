import React, { useState, useRef, useEffect } from "react";
import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";
import FormSelect from "../common/FormSelect";
import { FiUpload, FiX, FiImage, FiAlertTriangle } from "react-icons/fi";
import { useStorageValidation } from "@/hooks/useStorage";

interface ArticleFormProps {
  formData?: {
    title?: string;
    content?: string;
    imageUrl?: string;
    status?: "draft" | "published";
  };
  onChange?: (field: string, value: string | File) => void;
  onStorageError?: (message: string) => void;
  isEditing?: boolean;
  loading?: boolean;
}

const ArticleForm = ({ formData = {}, onChange, onStorageError, isEditing = false, loading = false }: ArticleFormProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateUpload, checkStorageStatus } = useStorageValidation();

  useEffect(() => {
    if (!isEditing) {
      setPreviewUrl(formData.imageUrl || null);
    }
  }, [formData.imageUrl, isEditing]);

  const handleChange = (field: string, value: string | File) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  const handleImageChange = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const validation = await validateUpload(file);

      if (!validation.canUpload) {
        setStorageError(validation.message || "Storage penuh!");
        if (onStorageError) {
          onStorageError(validation.message || "Storage penuh!");
        }
        return;
      }

      setStorageError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      handleChange("image", file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setStorageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handleChange("image", "" as any);
  };

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Gambar Berita {!isEditing && <span className="text-red-500">*</span>}</label>

          {storageError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <FiAlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">Storage Penuh!</p>
                <p className="text-xs text-red-700">{storageError}</p>
              </div>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-600 mb-2">
              {isEditing && formData.imageUrl && !previewUrl ? "Gambar saat ini:" : previewUrl ? (isEditing ? "Gambar baru:" : "Preview:") : isEditing && formData.imageUrl ? "Upload gambar baru:" : ""}
            </p>

            {(isEditing && formData.imageUrl && !previewUrl) || previewUrl ? (
              <div>
                <div className="relative w-full h-64 lg:h-80 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={previewUrl || formData.imageUrl}
                    alt={previewUrl ? "Preview" : "Current image"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                      const container = target.parentElement;
                      if (container && !container.querySelector(".error-placeholder")) {
                        const errorDiv = document.createElement("div");
                        errorDiv.className = "error-placeholder absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500";
                        errorDiv.innerHTML = `
                          <div class="text-center">
                            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-sm">Gambar tidak dapat dimuat</p>
                          </div>
                        `;
                        container.appendChild(errorDiv);
                      }
                    }}
                  />

                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">{previewUrl ? (isEditing ? "Gambar baru" : "Preview") : "Gambar sebelumnya"}</div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      const imageUrl = previewUrl || formData.imageUrl;
                      if (imageUrl) {
                        const newWindow = window.open();
                        if (newWindow) {
                          newWindow.document.write(`
                            <html>
                              <head>
                                <title>Preview Gambar - ${formData.title || "Article Image"}</title>
                                <style>
                                  body { margin: 0; padding: 20px; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                                  img { max-width: 100%; max-height: 100vh; object-fit: contain; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: white; }
                                </style>
                              </head>
                              <body>
                                <img src="${imageUrl}" alt="Preview ${formData.title || "Article Image"}" />
                              </body>
                            </html>
                          `);
                          newWindow.document.close();
                        }
                      }
                    }}
                    disabled={loading}
                    className="flex-1 bg-[#1B3A6D] text-white px-4 py-2 rounded-lg hover:bg-[#152f5a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <FiImage size={16} />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="flex-1 border border-[#1B3A6D] text-[#1B3A6D] px-4 py-2 rounded-lg hover:bg-[#1B3A6D] hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <FiUpload size={16} />
                    Ganti Gambar
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-6 lg:p-8 text-center transition-colors cursor-pointer h-64 lg:h-80 flex flex-col justify-center ${
                  dragActive ? "border-[#1B3A6D] bg-[#1B3A6D]/5" : "border-gray-300 hover:border-[#1B3A6D] hover:bg-gray-50"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !loading && fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <FiImage className="text-gray-400 mb-4" size={48} />
                  <div className="flex items-center gap-2 mb-2">
                    <FiUpload size={16} />
                    <span className="text-gray-600 font-medium">{dragActive ? "Lepaskan gambar di sini" : "Drag & drop gambar atau klik untuk upload"}</span>
                  </div>
                  <p className="text-xs text-gray-500">{isEditing ? "Upload gambar baru untuk mengganti yang lama" : "Mendukung format: JPG, PNG, GIF (Max: 5MB)"}</p>
                </div>
              </div>
            )}

            {((isEditing && formData.imageUrl && !previewUrl) || previewUrl) && <p className="text-xs text-gray-500 mt-2">Klik "Preview" untuk melihat gambar ukuran penuh di tab baru, atau "Ganti Gambar" untuk memilih gambar lain</p>}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={loading} />
        </div>

        <div className="space-y-6">
          <FormInput label="Judul Berita" name="title" value={formData.title || ""} placeholder="Masukkan judul berita..." onChange={(e) => handleChange("title", e.target.value)} disabled={loading} required />

          <FormTextarea label="Konten Berita" name="content" value={formData.content || ""} placeholder="Tulis konten berita di sini..." rows={10} onChange={(e) => handleChange("content", e.target.value)} disabled={loading} required />

          <FormSelect label="Status" name="status" value={formData.status || "draft"} options={statusOptions} onChange={(e) => handleChange("status", e.target.value)} disabled={loading} required />
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
