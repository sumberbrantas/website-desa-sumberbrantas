"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDestinationActions } from "@/hooks/useDestinations";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/component/common/PageHeader";
import DestinationForm from "@/component/dashboard/DestinationForm";
import ActionButton from "@/component/common/ActionButton";

const CreateDestinationPage = () => {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { create, loading, error } = useDestinationActions();
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
      alert("Anda harus login untuk menambahkan destinasi.");
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
    if (!data.image) {
      alert("Gambar destinasi wajib diupload.");
      return;
    }

    const result = await create({
      name: data.name,
      description: data.description,
      image: data.image,
      location: data.location,
      category: data.category,
      isActive: data.isActive,
      order: data.order,
      createdBy: user.uid,
    });

    if (result) {
      setSuccess("Destinasi berhasil ditambahkan!");
      setTimeout(() => router.push("/dashboard/destinations"), 1500);
    }
  };

  const handleCancel = () => router.push("/dashboard/destinations");

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={loading}>Batal</ActionButton>
    </>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Tambah Destinasi" subtitle="Tambahkan tempat wisata baru di website" actions={headerActions} mounted={mounted} />
      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}
        <div className="bg-white app-card shadow-sm border border-gray-100">
          <DestinationForm onSave={handleSave} onCancel={handleCancel} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreateDestinationPage;
