"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccommodation, useAccommodationActions } from "@/hooks/useAccommodations";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/component/common/PageHeader";
import AccommodationForm from "@/component/dashboard/AccommodationForm";
import ActionButton from "@/component/common/ActionButton";
import CreditsFooter from "@/component/common/CreditsFooter";

const UpdateAccommodationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accommodationId = searchParams.get("id");

  const { user, profile } = useAuth();
  const { accommodation, loading: accommodationLoading, error: accommodationError } = useAccommodation(accommodationId || undefined);
  const { update, loading, error } = useAccommodationActions();
  const [mounted, setMounted] = useState(false);

  const [success, setSuccess] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (data: {
    name: string;
    description: string;
    image?: File;
    location: string;
    priceRange: string;
    whatsappNumber: string;
    whatsappMessage: string;
    isActive: boolean;
    order: number;
  }) => {
    if (!user || !profile) {
      alert("Anda harus login untuk mengupdate penginapan.");
      return;
    }

    if (!data.name.trim()) {
      alert("Nama penginapan harus diisi.");
      return;
    }

    if (!data.location.trim()) {
      alert("Lokasi penginapan harus diisi.");
      return;
    }

    if (!accommodationId) {
      alert("ID penginapan tidak ditemukan.");
      return;
    }

    if (data.image && storageError) {
      alert("Tidak dapat memperbarui penginapan karena storage penuh. Silakan kosongkan storage terlebih dahulu.");
      return;
    }

    const updateData: any = {
      name: data.name,
      description: data.description,
      location: data.location,
      priceRange: data.priceRange,
      whatsappNumber: data.whatsappNumber,
      whatsappMessage: data.whatsappMessage,
      isActive: data.isActive,
      order: data.order,
      updatedBy: user.uid,
    };

    if (data.image) {
      updateData.image = data.image;
    }

    const result = await update(accommodationId, updateData);

    if (result) {
      setSuccess("Penginapan berhasil diupdate!");
      setTimeout(() => {
        router.push("/dashboard/accommodations");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/accommodations");
  };

  if (!accommodationId) {
    return (
      <div className="app-content">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">ID penginapan tidak ditemukan. Silakan kembali ke halaman daftar penginapan.</div>
      </div>
    );
  }

  if (accommodationLoading) {
    return (
      <div className="app-content">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Memuat data penginapan...</div>
        </div>
      </div>
    );
  }

  if (accommodationError || !accommodation) {
    return (
      <div className="app-content">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{accommodationError || "Penginapan tidak ditemukan"}</div>
      </div>
    );
  }

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={loading}>
        Batal
      </ActionButton>
    </>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Edit Penginapan" subtitle="Edit penginapan yang ada di website" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {storageError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{storageError}</div>}

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <AccommodationForm
            accommodation={{
              name: accommodation.name,
              description: accommodation.description,
              imageUrl: accommodation.imageUrl,
              location: accommodation.location,
              priceRange: accommodation.priceRange,
              whatsappNumber: accommodation.whatsappNumber,
              whatsappMessage: accommodation.whatsappMessage,
              isActive: accommodation.isActive,
              order: accommodation.order,
            }}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default UpdateAccommodationPage;
