"use client";

import { useState, useEffect } from "react";
import FormInput from "@/component/common/FormInput";
import FormTextarea from "@/component/common/FormTextarea";
import { FiLink, FiAlertTriangle, FiExternalLink } from "react-icons/fi";

interface DocumentFormProps {
  document?: {
    title?: string;
    category?: string;
    description?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    isActive?: boolean;
    order?: number;
  };
  onSave: (data: {
    title: string;
    category: string;
    description: string;
    fileUrl: string;
    isActive: boolean;
    order: number;
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const DocumentForm = ({ document, onSave, onCancel, loading }: DocumentFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    fileUrl: "",
    isActive: true,
    order: 1,
  });
  const [urlError, setUrlError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || "",
        category: document.category || "",
        description: document.description || "",
        fileUrl: document.fileUrl || "",
        isActive: document.isActive ?? true,
        order: document.order || 1,
      });
    }
  }, [document]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (name === "fileUrl") {
      setUrlError(null);
    }
  };

  // Extract Google Drive file ID from various URL formats
  const extractDriveId = (url: string): string | null => {
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
      /\/open\?id=([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Convert Google Drive URL to embed URL
  const convertToEmbedUrl = (url: string): string | null => {
    const fileId = extractDriveId(url);
    if (!fileId) return null;
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  const handleUrlValidation = () => {
    if (!formData.fileUrl) {
      setUrlError("Link Google Drive wajib diisi!");
      return false;
    }

    const fileId = extractDriveId(formData.fileUrl);
    if (!fileId) {
      setUrlError("Link bukan format Google Drive yang valid!");
      return false;
    }

    return true;
  };

  const handlePreview = () => {
    if (handleUrlValidation()) {
      setShowPreview(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fileUrl && !document?.fileUrl) {
      setUrlError("Link Google Drive wajib diisi!");
      return;
    }

    const finalUrl = formData.fileUrl || document?.fileUrl || "";
    if (finalUrl && !extractDriveId(finalUrl)) {
      setUrlError("Link bukan format Google Drive yang valid!");
      return;
    }

    await onSave({
      title: formData.title,
      category: formData.category,
      description: formData.description,
      fileUrl: finalUrl,
      isActive: formData.isActive,
      order: Number(formData.order),
    });
  };

  const categories = [
    { value: "Profil Desa", label: "Profil Desa" },
    { value: "Peta Potensi", label: "Peta Potensi" },
    { value: "Destinasi Wisata", label: "Destinasi Wisata" },
    { value: "Penginapan", label: "Penginapan" },
    { value: "UMKM", label: "UMKM" },
    { value: "Layanan", label: "Layanan" },
    { value: "Regulasi", label: "Regulasi" },
    { value: "Lainnya", label: "Lainnya" },
  ];

  const embedUrl = formData.fileUrl ? convertToEmbedUrl(formData.fileUrl) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Judul Dokumen"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Contoh: Profil Desa 2025"
          required
        />

        <div>
          <label className="block text-xs font-medium text-black mb-2">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            required
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FormTextarea
        label="Deskripsi"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Deskripsi singkat tentang dokumen ini..."
        rows={3}
      />

      {/* Google Drive Link Input */}
      <div>
        <label className="block text-xs font-medium text-black mb-2">
          Link Google Drive <span className="text-red-500">*</span>
        </label>

        {urlError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 mb-3">
            <FiAlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
            <div>
              <p className="text-sm font-medium text-red-800 mb-1">Error!</p>
              <p className="text-xs text-red-700">{urlError}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <FormInput
                label=""
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/..."
                type="url"
              />
            </div>
            {formData.fileUrl && (
              <button
                type="button"
                onClick={() => window.open(formData.fileUrl, "_blank")}
                className="mt-7 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
              >
                <FiExternalLink size={14} />
                Buka
              </button>
            )}
          </div>

          {/* Preview Button */}
          {formData.fileUrl && embedUrl && (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiLink className="text-[var(--primary)]" size={18} />
                  <span className="text-sm font-medium text-gray-700">Preview Dokumen</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-[var(--primary)] hover:underline"
                >
                  {showPreview ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>

              {showPreview && (
                <div className="mt-2">
                  <iframe
                    src={embedUrl}
                    className="w-full h-64 rounded border border-gray-200"
                    title="Document Preview"
                    allow="autoplay"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Existing Document Preview */}
          {document?.fileUrl && !formData.fileUrl && (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiLink className="text-[var(--primary)]" size={18} />
                  <span className="text-sm font-medium text-gray-700">Dokumen Tersimpan</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.open(document.fileUrl, "_blank")}
                  className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  <FiExternalLink size={12} />
                  Buka di Google Drive
                </button>
              </div>
              <p className="text-xs text-gray-500 break-all">{document.fileUrl}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Cara mendapatkan link:</strong>
            </p>
            <ol className="text-xs text-blue-700 mt-1 list-decimal list-inside space-y-1">
              <li>Buka file di Google Drive</li>
              <li>Klik tombol &quot;Share&quot; / &quot;Bagikan&quot;</li>
              <li>Pilih &quot;Anyone with the link&quot; atau &quot;Semua orang yang memiliki link&quot;</li>
              <li>Copy link dan paste di form ini</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="text-sm text-gray-700">Dokumen Aktif</span>
          </label>
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

export default DocumentForm;
