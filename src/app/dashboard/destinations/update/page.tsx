"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDestination, useDestinationActions } from "@/hooks/useDestinations";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/component/common/PageHeader";
import DestinationForm from "@/component/dashboard/DestinationForm";
import ActionButton from "@/component/common/ActionButton";

const UpdateDestinationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destinationId = searchParams.get("id");

  const { user, profile } = useAuth();
  const { destination, loading: loadingDest, error: errorDest } = useDestination(destinationId || undefined);
  const { update, loading, error } = useDestinationActions();
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (data: {
    name: string;
    description: string;
    image?: File;
    location: string;
    category: string;
    isActive: boolean;
    order: number;
  }) => {
    if (!user || !profile) {
      alert("Anda harus login untuk mengupdate destinasi.");
      return;
    }
    if (!data.name.trim()) {
      alert("Nama destinasi harus diisi.");
      return;
    }
    if (!data.location.trim()) {
      alert("Lokasi destinasi harus diisi.");
      return;
    }
    if (!destinationId) {
      alert("ID destinasi tidak ditemukan.");
      return;
    }

    const updateData: any = {
      name: data.name,
      description: data.description,
      location: data.location,
      category: data.category,
      isActive: data.isActive,
      order: data.order,
      updatedBy: user.uid,
    };
    if (data.image) {
      updateData.image = data.image;
    }

    const result = await update(destinationId, updateData);
    if (result) {
      setSuccess("Destinasi berhasil diupdate!");
      setTimeout(() => router.push("/dashboard/destinations"), 1500);
    }
  };

  const handleCancel = () => router.push("/dashboard/destinations");

  if (!destinationId) {
    return <div className="app-content"><div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">ID destinasi tidak ditemukan.</div></div>;
  }

  if (loadingDest) {
    return <div className="app-content"><div className="flex items-center justify-center py-8">Memuat data...</div></div>;
  }

  if (errorDest || !destination) {
    return <div className="app-content"><div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{errorDest || "Destinasi tidak ditemukan"}</div></div>;
  }

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={loading}>Batal</ActionButton>
    </>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Edit Destinasi" subtitle="Edit destinasi yang ada di website" actions={headerActions} mounted={mounted} />
      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}
        <div className="bg-white app-card shadow-sm border border-gray-100">
          <DestinationForm
            destination={{
              name: destination.name,
              description: destination.description,
              imageUrl: destination.imageUrl,
              location: destination.location,
              category: destination.category,
              isActive: destination.isActive,
              order: destination.order,
            }}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateDestinationPage;
