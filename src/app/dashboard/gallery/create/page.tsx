"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGalleryImageActions } from "@/hooks/useGallery";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/component/common/PageHeader";
import GalleryForm from "@/component/dashboard/GalleryForm";
import ActionButton from "@/component/common/ActionButton";
import CreditsFooter from "@/component/common/CreditsFooter";

const CreateGalleryPage = () => {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { create, loading, error } = useGalleryImageActions();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    category: "umum",
    isActive: true,
    order: 0,
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFormChange = (field: string, value: string | File | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (success) {
      setSuccess(null);
    }

    if (storageError) {
      setStorageError(null);
    }
  };

  const handleStorageError = (message: string) => {
    setStorageError(message);
  };

  const handleSave = async () => {
    if (!user || !profile) {
      alert("Anda harus login untuk menambahkan gambar.");
      return;
    }

    if (!formData.title.trim()) {
      alert("Judul harus diisi.");
      return;
    }

    if (!formData.image) {
      alert("Gambar harus dipilih.");
      return;
    }

    if (storageError) {
      alert("Tidak dapat menyimpan gambar karena storage penuh. Silakan kosongkan storage terlebih dahulu.");
      return;
    }

    const result = await create({
      title: formData.title,
      description: formData.description,
      image: formData.image,
      category: formData.category,
      isActive: formData.isActive,
      order: formData.order,
      createdBy: user.uid,
    });

    if (result) {
      setSuccess("Gambar berhasil ditambahkan!");
      setTimeout(() => {
        router.push("/dashboard/gallery");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/gallery");
  };

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={loading}>
        Batal
      </ActionButton>
      <ActionButton variant="primary" onClick={handleSave} disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan"}
      </ActionButton>
    </>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Tambah Gambar Galeri" subtitle="Tambahkan gambar baru ke galeri website" actions={headerActions} mounted={mounted} />
      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {storageError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{storageError}</div>}

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <GalleryForm formData={formData} onChange={handleFormChange} onStorageError={handleStorageError} loading={loading} />
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};
export default CreateGalleryPage;
