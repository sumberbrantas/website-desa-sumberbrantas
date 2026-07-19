"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiX, FiImage, FiAlertTriangle } from "react-icons/fi";
import FormInput from "@/component/common/FormInput";
import FormTextarea from "@/component/common/FormTextarea";
import { useStorageValidation } from "@/hooks/useStorage";

interface ProductFormProps {
  product?: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    category?: string;
    whatsappMessage?: string;
    isActive?: boolean;
    order?: number;
  };
  onSave: (data: {
    name: string;
    description: string;
    price: number;
    image?: File;
    category: string;
    whatsappMessage: string;
    isActive: boolean;
    order: number;
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ProductForm = ({ product, onSave, onCancel, loading }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    whatsappMessage: "",
    isActive: true,
    order: 1,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateUpload } = useStorageValidation();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        category: product.category || "",
        whatsappMessage: product.whatsappMessage || "",
        isActive: product.isActive ?? true,
        order: product.order || 1,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, price: parseInt(rawValue) || 0 }));
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
      reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product && !selectedImage) {
      setStorageError("Gambar produk wajib diupload!");
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
    { value: "Kuliner", label: "Kuliner" },
    { value: "Kerajinan", label: "Kerajinan" },
    { value: "Fashion", label: "Fashion" },
    { value: "Agribisnis", label: "Agribisnis" },
    { value: "Jasa", label: "Jasa" },
    { value: "Lainnya", label: "Lainnya" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-xs font-medium text-black">
            Gambar Produk {!product && <span className="text-red-500">*</span>}
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
              <div className="relative w-full h-64 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">Preview Baru</div>
              </div>
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={clearImage} disabled={loading} className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium">
                  <FiX size={16} /> Hapus
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading} className="flex-1 border border-[var(--primary)] text-[var(--primary)] px-4 py-2 rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium">
                  <FiUpload size={16} /> Ganti
                </button>
              </div>
            </div>
          ) : product?.imageUrl ? (
            <div>
              <div className="relative w-full h-64 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <img src={product.imageUrl} alt="Current" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">Gambar Saat Ini</div>
              </div>
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading} className="flex-1 border border-[var(--primary)] text-[var(--primary)] px-4 py-2 rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium">
                  <FiUpload size={16} /> Ganti Gambar
                </button>
              </div>
            </div>
          ) : (
            <div onClick={() => !loading && fileInputRef.current?.click()} className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer h-64 flex flex-col justify-center ${loading ? "opacity-50 cursor-not-allowed" : "border-gray-300 hover:border-[var(--primary)] hover:bg-gray-50"}`}>
              <FiImage className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-sm text-gray-600 font-medium mb-1">Drag & drop gambar atau klik untuk upload</p>
              <p className="text-xs text-gray-500">Format: JPG, PNG, GIF (Max: 5MB)</p>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={loading} />
        </div>

        <div className="space-y-4">
          <FormInput label="Nama Produk" name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Keripik Singkong" required />

          <div>
            <label className="block text-xs font-medium text-black mb-2">Harga (Rp)</label>
            <input
              type="text"
              name="price"
              value={formData.price ? `Rp ${formData.price.toLocaleString("id-ID")}` : ""}
              onChange={handlePriceChange}
              placeholder="Contoh: 25000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-black mb-2">Kategori</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent">
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <FormTextarea label="Deskripsi" name="description" value={formData.description} onChange={handleChange} placeholder="Deskripsi produk..." rows={3} />

          <FormInput label="Urutan Tampil" name="order" type="number" value={String(formData.order)} onChange={handleChange} placeholder="1" min={1} required />
        </div>
      </div>

      <div className="border-t pt-6">
        <FormTextarea
          label="Pesan WhatsApp (Opsional)"
          name="whatsappMessage"
          value={formData.whatsappMessage}
          onChange={handleChange}
          placeholder="Pesan otomatis yang akan dikirim saat tombol WhatsApp diklik..."
          rows={2}
        />
        <p className="text-xs text-gray-500 mt-1">Pesan default: "Halo, saya mau pesan [Nama Produk]"</p>

        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]" />
            <span className="text-sm text-gray-700">Produk Aktif</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" disabled={loading}>Batal</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50" style={{ backgroundColor: "var(--primary)" }} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
