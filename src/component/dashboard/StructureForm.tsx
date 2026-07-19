"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiImage, FiUpload, FiX } from "react-icons/fi";

interface StructureFormData {
  name: string;
  description: string;
  image: File | null;
  order: number;
  isActive: boolean;
}

interface StructureFormProps {
  formData: StructureFormData;
  onChange: (field: string, value: string | File | number | boolean) => void;
  onStorageError: (message: string) => void;
  loading?: boolean;
  editMode?: boolean;
  currentImageUrl?: string;
}

const StructureForm = ({ formData, onChange, onStorageError, loading = false, editMode = false, currentImageUrl }: StructureFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editMode && currentImageUrl && !imagePreview) {
      setImagePreview(currentImageUrl);
    }
  }, [editMode, currentImageUrl, imagePreview]);

  const handleImageChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      onStorageError("File harus berupa gambar");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      onStorageError("Ukuran file tidak boleh lebih dari 5MB");
      return;
    }

    onChange("image", file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    setImagePreview(null);
    onChange("image", null as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Gambar Struktur {!editMode && <span className="text-red-500">*</span>}</label>

          {imagePreview ? (
            <div>
              <div className="relative w-full h-64 lg:h-80 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
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
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">{editMode ? "Gambar baru" : "Preview"}</div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (imagePreview) {
                      const newWindow = window.open();
                      if (newWindow) {
                        newWindow.document.write(`
                          <html>
                            <head>
                              <title>Preview Gambar - ${formData.name || "Structure Image"}</title>
                              <style>
                                body { margin: 0; padding: 20px; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                                img { max-width: 100%; max-height: 100vh; object-fit: contain; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: white; }
                              </style>
                            </head>
                            <body>
                              <img src="${imagePreview}" alt="Preview ${formData.name || "Structure Image"}" />
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
                <button type="button" onClick={removeImage} disabled={loading} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                  <FiX size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-6 lg:p-8 text-center transition-colors cursor-pointer h-64 lg:h-80 flex flex-col justify-center ${
                dragActive ? "border-[#1B3A6D] bg-[#1B3A6D]/5" : "border-gray-300 hover:border-[#1B3A6D] hover:bg-gray-50"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !loading && fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <FiImage className="text-gray-400 mb-4" size={48} />
                <div className="flex items-center gap-2 mb-2">
                  <FiUpload size={16} />
                  <span className="text-gray-600 font-medium">{dragActive ? "Lepaskan gambar di sini" : "Drag & drop gambar atau klik untuk upload"}</span>
                </div>
                <p className="text-xs text-gray-500">{editMode ? "Upload gambar baru untuk mengganti yang lama" : "Mendukung format: JPG, PNG, GIF (Max: 5MB)"}</p>
              </div>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={loading} />
        </div>


        <div className="space-y-6">

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nama Struktur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Contoh: PKK, BPD, LPMD, dll"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-[#1B3A6D] transition-colors"
              disabled={loading}
              maxLength={100}
            />
            <p className="text-xs text-gray-500">Maksimal 100 karakter</p>
          </div>


          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Deskripsi tentang struktur organisasi ini..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-[#1B3A6D] transition-colors resize-none"
              disabled={loading}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">Maksimal 500 karakter</p>
          </div>


          <div className="space-y-2">
            <label htmlFor="order" className="block text-sm font-medium text-gray-700">
              Urutan Tampil
            </label>
            <input
              type="number"
              id="order"
              value={formData.order}
              onChange={(e) => onChange("order", parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-[#1B3A6D] transition-colors"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">Angka lebih kecil akan ditampilkan lebih dulu</p>
          </div>


          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input type="radio" name="isActive" checked={formData.isActive} onChange={() => onChange("isActive", true)} className="h-4 w-4 text-[#1B3A6D] focus:ring-[#1B3A6D] border-gray-300" disabled={loading} />
                <span className="ml-2 text-sm text-gray-700">Aktif</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="isActive" checked={!formData.isActive} onChange={() => onChange("isActive", false)} className="h-4 w-4 text-[#1B3A6D] focus:ring-[#1B3A6D] border-gray-300" disabled={loading} />
                <span className="ml-2 text-sm text-gray-700">Nonaktif</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">Struktur nonaktif tidak akan ditampilkan di halaman publik</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureForm;

