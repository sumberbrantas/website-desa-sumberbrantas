"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGalleryImage, useGalleryImageActions } from "@/hooks/useGallery";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/component/common/PageHeader";
import GalleryForm from "@/component/dashboard/GalleryForm";
import ActionButton from "@/component/common/ActionButton";
import CreditsFooter from "@/component/common/CreditsFooter";

const UpdateGalleryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageId = searchParams.get("id");

  const { user, profile } = useAuth();
  const { image, loading: imageLoading, error: imageError } = useGalleryImage(imageId || undefined);
  const { update, loading, error } = useGalleryImageActions();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
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

  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title,
        description: image.description || "",
        imageUrl: image.imageUrl,
        image: null,
        category: image.category || "umum",
        isActive: image.isActive,
        order: image.order,
      });
    }
  }, [image]);

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
      alert("Anda harus login untuk mengupdate gambar.");
      return;
    }

    if (!formData.title.trim()) {
      alert("Judul harus diisi.");
      return;
    }

    if (!imageId) {
      alert("ID gambar tidak ditemukan.");
      return;
    }

    if (formData.image instanceof File && storageError) {
      alert("Tidak dapat memperbarui gambar karena storage penuh. Silakan kosongkan storage terlebih dahulu.");
      return;
    }

    const updateData: any = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      isActive: formData.isActive,
      order: formData.order,
      updatedBy: user.uid,
    };

    if (formData.image instanceof File) {
      updateData.image = formData.image;
    }

    const result = await update(imageId, updateData);

    if (result) {
      setSuccess("Gambar berhasil diupdate!");
      setTimeout(() => {
        router.push("/dashboard/gallery");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/gallery");
  };

  if (!imageId) {
    return (
      <div className="app-content">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">ID gambar tidak ditemukan. Silakan kembali ke halaman daftar galeri.</div>
      </div>
    );
  }

  if (imageLoading) {
    return (
      <div className="app-content">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Memuat data gambar...</div>
        </div>
      </div>
    );
  }

  if (imageError || !image) {
    return (
      <div className="app-content">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{imageError || "Gambar tidak ditemukan"}</div>
      </div>
    );
  }

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
      <PageHeader title="Edit Gambar Galeri" subtitle="Edit gambar yang ada di galeri website" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {storageError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{storageError}</div>}

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <GalleryForm formData={formData} onChange={handleFormChange} onStorageError={handleStorageError} isEditing={true} loading={loading} />
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default UpdateGalleryPage;
