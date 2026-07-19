"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import StructureForm from "@/component/dashboard/StructureForm";
import { useAuth } from "@/contexts/AuthContext";
import { useStructureActions } from "@/hooks/useStructure";
import CreditsFooter from "@/component/common/CreditsFooter";

const CreateStructurePage = () => {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { create, loading, error } = useStructureActions();

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
      alert("Anda harus login untuk menambahkan struktur.");
      return;
    }

    if (!formData.name.trim()) {
      alert("Nama struktur harus diisi.");
      return;
    }

    if (!formData.image) {
      alert("Gambar struktur harus dipilih.");
      return;
    }

    if (storageError) {
      alert("Tidak dapat menyimpan struktur karena storage penuh. Silakan kosongkan storage terlebih dahulu.");
      return;
    }

    const result = await create({
      name: formData.name.trim(),
      description: formData.description.trim(),
      image: formData.image,
      order: formData.order,
      isActive: formData.isActive,
      createdBy: user.uid,
    });

    if (result) {
      setSuccess("Struktur berhasil ditambahkan!");
      setTimeout(() => {
        router.push("/dashboard/structure");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/structure");
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
      <PageHeader title="Tambah Struktur" subtitle="Buat struktur organisasi baru untuk desa" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {storageError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{storageError}</div>}

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <StructureForm formData={formData} onChange={handleFormChange} onStorageError={handleStorageError} loading={loading} />
        </div>
      </div>


      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default CreateStructurePage;

