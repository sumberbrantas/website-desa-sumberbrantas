"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import StructureForm from "@/component/dashboard/StructureForm";
import { useAuth } from "@/contexts/AuthContext";
import { useStructureActions, useStructureDetail } from "@/hooks/useStructure";
import CreditsFooter from "@/component/common/CreditsFooter";

const UpdateStructurePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const structureId = searchParams.get("id");

  const { user, profile } = useAuth();
  const { update, loading: updateLoading, error: updateError } = useStructureActions();
  const { structure, loading: fetchLoading, error: fetchError } = useStructureDetail(structureId);

  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (structure) {
      setFormData({
        name: structure.name,
        description: structure.description,
        image: null,
        order: structure.order,
        isActive: structure.isActive,
      });
    }
  }, [structure]);

  const handleFormChange = (field: string, value: string | File | number | boolean) => {
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
      alert("Anda harus login untuk memperbarui struktur.");
      return;
    }

    if (!structureId) {
      alert("ID struktur tidak ditemukan.");
      return;
    }

    if (!formData.name.trim()) {
      alert("Nama struktur harus diisi.");
      return;
    }

    if (formData.image instanceof File && storageError) {
      alert("Tidak dapat memperbarui struktur karena storage penuh. Silakan kosongkan storage terlebih dahulu.");
      return;
    }

    const updateData: any = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      order: formData.order,
      isActive: formData.isActive,
      updatedBy: user.uid,
    };

    if (formData.image instanceof File) {
      updateData.image = formData.image;
    }

    const result = await update(structureId, updateData);

    if (result) {
      setSuccess("Struktur berhasil diperbarui!");
      setTimeout(() => {
        router.push("/dashboard/structure");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/structure");
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Memuat data struktur...</div>
      </div>
    );
  }

  if (fetchError || !structure) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">{fetchError || "Struktur tidak ditemukan"}</div>
          <ActionButton variant="primary" onClick={() => router.push("/dashboard/structure")}>
            Kembali ke Daftar Struktur
          </ActionButton>
        </div>
      </div>
    );
  }

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={updateLoading}>
        Batal
      </ActionButton>
      <ActionButton variant="primary" onClick={handleSave} disabled={updateLoading}>
        {updateLoading ? "Menyimpan..." : "Simpan Perubahan"}
      </ActionButton>
    </>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Edit Struktur" subtitle="Perbarui struktur organisasi desa" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {updateError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{updateError}</div>}

        {storageError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{storageError}</div>}

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <StructureForm formData={formData} onChange={handleFormChange} onStorageError={handleStorageError} loading={updateLoading} editMode={true} currentImageUrl={structure.imageUrl} />
        </div>
      </div>


      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default UpdateStructurePage;

