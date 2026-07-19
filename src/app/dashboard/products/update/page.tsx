"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProduct, useProductActions } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/component/common/PageHeader";
import ProductForm from "@/component/dashboard/ProductForm";
import ActionButton from "@/component/common/ActionButton";

const UpdateProductPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const { user, profile } = useAuth();
  const { product, loading: loadingProduct, error: errorProduct } = useProduct(productId || undefined);
  const { update, loading, error } = useProductActions();
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
      alert("Anda harus login untuk mengupdate produk.");
      return;
    }
    if (!data.name.trim()) {
      alert("Nama produk harus diisi.");
      return;
    }
    if (!productId) {
      alert("ID produk tidak ditemukan.");
      return;
    }

    const updateData: any = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      whatsappMessage: data.whatsappMessage,
      isActive: data.isActive,
      order: data.order,
      updatedBy: user.uid,
    };
    if (data.image) {
      updateData.image = data.image;
    }

    const result = await update(productId, updateData);
    if (result) {
      setSuccess("Produk berhasil diupdate!");
      setTimeout(() => router.push("/dashboard/products"), 1500);
    }
  };

  const handleCancel = () => router.push("/dashboard/products");

  if (!productId) {
    return <div className="app-content"><div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">ID produk tidak ditemukan.</div></div>;
  }

  if (loadingProduct) {
    return <div className="app-content"><div className="flex items-center justify-center py-8">Memuat data...</div></div>;
  }

  if (errorProduct || !product) {
    return <div className="app-content"><div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{errorProduct || "Produk tidak ditemukan"}</div></div>;
  }

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={loading}>Batal</ActionButton>
    </>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Edit Produk" subtitle="Edit produk UMKM yang ada" actions={headerActions} mounted={mounted} />
      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}
        <div className="bg-white app-card shadow-sm border border-gray-100">
          <ProductForm
            product={{
              name: product.name,
              description: product.description,
              price: product.price,
              imageUrl: product.imageUrl,
              category: product.category,
              whatsappMessage: product.whatsappMessage,
              isActive: product.isActive,
              order: product.order,
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

export default UpdateProductPage;
