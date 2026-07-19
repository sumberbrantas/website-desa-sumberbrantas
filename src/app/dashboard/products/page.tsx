"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useProducts, useProductActions } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { confirmDelete, showSuccess, showError } from "@/utils/confirmationUtils";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import { formatProductPrice } from "@/lib/productService";

const ProductsPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const { products, loading, error, refetch } = useProducts(statusFilter);
  const { remove } = useProductActions();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      refetch();
    }
  }, [statusFilter, mounted, user]);

  const handleDelete = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    const prodName = prod?.name || "produk";

    const confirmed = await confirmDelete("Hapus Produk?", `Produk "${prodName}" akan dihapus!`, "Ya, Hapus!");
    if (!confirmed) return;

    const success = await remove(id);
    if (success) {
      showSuccess("Berhasil", `Produk "${prodName}" dihapus`);
      refetch();
    } else {
      showError("Gagal", "Terjadi kesalahan");
    }
  };

  const handleEdit = (id: string) => router.push(`/dashboard/products/update?id=${id}`);

  const getStatusBadge = (isActive: boolean) => (
    isActive
      ? <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Aktif</span>
      : <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Nonaktif</span>
  );

  const getCategoryBadge = (category: string) => (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{category || "Lainnya"}</span>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Kelola Produk UMKM"
        subtitle="Kelola produk usaha mikro, kecil, dan menengah"
        actions={
          <ActionButton variant="primary" onClick={() => router.push("/dashboard/products/create")}>
            <FiPlus size={16} /> Tambah Produk
          </ActionButton>
        }
        mounted={mounted}
      />

      <div className={`app-content flex-1 ${mounted ? "smooth-reveal stagger-1" : ""}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            {["all", "active", "inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === status ? "text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={statusFilter === status ? { backgroundColor: "var(--primary)" } : {}}
              >
                {status === "all" ? "Semua" : status === "active" ? "Aktif" : "Nonaktif"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Belum ada produk yang ditambahkan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-40 bg-gray-200 overflow-hidden">
                    <img src={product.imageUrl || "/kantor_desa.jpg"} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/kantor_desa.jpg"; }} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryBadge(product.category)}
                      {getStatusBadge(product.isActive)}
                    </div>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <p className="font-bold text-lg mb-3" style={{ color: "var(--primary)" }}>{formatProductPrice(product.price)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product.id)} className="flex-1 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="flex-1 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
