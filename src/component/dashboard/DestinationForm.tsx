"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiX, FiImage, FiAlertTriangle } from "react-icons/fi";
import FormInput from "@/component/common/FormInput";
import FormTextarea from "@/component/common/FormTextarea";
import { useStorageValidation } from "@/hooks/useStorage";

interface DestinationFormProps {
  destination?: {
    name?: string;
    description?: string;
    imageUrl?: string;
    location?: string;
    category?: string;
    isActive?: boolean;
    order?: number;
  };
  onSave: (data: {
    name: string;
    description: string;
    image?: File;
    location: string;
    category: string;
    isActive: boolean;
    order: number;
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const DestinationForm = ({ destination, onSave, onCancel, loading }: DestinationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    category: "",
    isActive: true,
    order: 1,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateUpload } = useStorageValidation();

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination.name || "",
        description: destination.description || "",
        location: destination.location || "",
        category: destination.category || "",
        isActive: destination.isActive ?? true,
        order: destination.order || 1,
      });
    }
  }, [destination]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setStorageError("Hanya file gambar yang diizinkan!");
        return;
      }

      const validation = await validateUpload(file);
      if (!validation.canUpload) {
        setStorageError(validation.message || "Storage penuh!");
        return;
      }

      setStorageError(null);
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination && !selectedImage) {
      setStorageError("Gambar destinasi wajib diupload!");
      return;
    }

    await onSave({
      ...formData,
      image: selectedImage || undefined,
      order: Number(formData.order),
    });
  };

  const categories = [
    { value: "", label: "Pilih Kategori" },
    { value: "Wisata Alam", label: "Wisata Alam" },
    { value: "Wisata Budaya", label: "Wisata Budaya" },
    { value: "Wisata Sejarah", label: "Wisata Sejarah" },
    { value: "Wisata Edukasi", label: "Wisata Edukasi" },
    { value: "Wisata Religious", label: "Wisata Religious" },
    { value: "Lainnya", label: "Lainnya" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <label className="block text-xs font-medium text-black">
            Gambar Destinasi {!destination && <span className="text-red-500">*</span>}
          </label>

          {storageError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <FiAlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">Error!</p>
                <p className="text-xs text-red-700">{storageError}</p>
              </div>
            </div>
          )}

          {previewUrl ? (
            <div>
              <div className="relative w-full h-64 lg:h-80 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">Preview Baru</div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={clearImage}
                  disabled={loading}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FiX size={16} />
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex-1 border border-[var(--primary)] text-[var(--primary)] px-4 py-2 rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FiUpload size={16} />
                  Ganti
                </button>
              </div>
            </div>
          ) : destination?.imageUrl ? (
            <div>
              <div className="relative w-full h-64 lg:h-80 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <img src={destination.imageUrl} alt="Current" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">Gambar Saat Ini</div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex-1 border border-[var(--primary)] text-[var(--primary)] px-4 py-2 rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FiUpload size={16} />
                  Ganti Gambar
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Upload gambar baru untuk mengganti yang lama</p>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-6 lg:p-8 text-center transition-colors cursor-pointer h-64 lg:h-80 flex flex-col justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : "border-gray-300 hover:border-[var(--primary)] hover:bg-gray-50"
              }`}
              onClick={() => !loading && fileInputRef.current?.click()}
            >
              <FiImage className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-sm text-gray-600 font-medium mb-1">Drag & drop gambar atau klik untuk upload</p>
              <p className="text-xs text-gray-500">Format: JPG, PNG, GIF (Max: 5MB)</p>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={loading} />
        </div>

        {/* Right Column - Form Fields */}
        <div className="space-y-4">
          <FormInput
            label="Nama Destinasi"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Air Terjun Widara"
            required
          />

          <FormTextarea
            label="Deskripsi"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Deskripsi destinasi wisata..."
            rows={3}
          />

          <FormInput
            label="Lokasi"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Contoh: Desa Ngebruk, Kecamatan Sumberpucung"
            required
          />

          <div>
            <label className="block text-xs font-medium text-black mb-2">
              Kategori
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label="Urutan Tampil"
            name="order"
            type="number"
            value={String(formData.order)}
            onChange={handleChange}
            placeholder="1"
            min={1}
            required
          />

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <span className="text-sm text-gray-700">Destinasi Aktif</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: "var(--primary)" }}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default DestinationForm;
