"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductActions } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/component/common/PageHeader";
import ProductForm from "@/component/dashboard/ProductForm";
import ActionButton from "@/component/common/ActionButton";

const CreateProductPage = () => {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { create, loading, error } = useProductActions();
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (data: {
    name: string;
    description: string;
    price: number;
    image?: File;
    category: string;
    whatsappMessage: string;
    isActive: boolean;
    order: number;
  }) => {
    if (!user || !profile) {
      alert("Anda harus login untuk menambahkan produk.");
      return;
    }
    if (!data.name.trim()) {
      alert("Nama produk harus diisi.");
      return;
    }
    if (!data.image) {
      alert("Gambar produk wajib diupload.");
      return;
    }

    const result = await create({
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      category: data.category,
      whatsappMessage: data.whatsappMessage,
      isActive: data.isActive,
      order: data.order,
      createdBy: user.uid,
    });

    if (result) {
      setSuccess("Produk berhasil ditambahkan!");
      setTimeout(() => router.push("/dashboard/products"), 1500);
    }
  };

  const handleCancel = () => router.push("/dashboard/products");

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={loading}>Batal</ActionButton>
    </>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Tambah Produk" subtitle="Tambahkan produk UMKM baru" actions={headerActions} mounted={mounted} />
      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}
        <div className="bg-white app-card shadow-sm border border-gray-100">
          <ProductForm onSave={handleSave} onCancel={handleCancel} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
