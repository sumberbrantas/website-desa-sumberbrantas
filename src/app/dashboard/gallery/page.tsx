"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiImage } from "react-icons/fi";
import { useGalleryImagesPagination, useGalleryImageActions } from "@/hooks/useGallery";
import { useAuth } from "@/contexts/AuthContext";
import { confirmDelete, showSuccess, showError } from "@/utils/confirmationUtils";
import PageHeader from "@/component/common/PageHeader";
import SearchAndFilterBar from "@/component/common/SearchAndFilterBar";
import ActionButton from "@/component/common/ActionButton";
import Pagination from "@/component/common/Pagination";
import { LoadingSpinner, ErrorState, DataTableWithStates } from "@/component/common/LoadingStates";
import CreditsFooter from "@/component/common/CreditsFooter";

const GalleryPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { images, loading, error, currentPage, totalPages, totalItems, itemsPerPage, fetchImagesPaginated, searchImagesPaginated, goToPage } = useGalleryImagesPagination();

  const { remove, loading: deleteLoading } = useGalleryImageActions();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        return "all";
      };
      fetchImagesPaginated(1, 10, getStatusFilter());
    }
  }, [statusFilter, mounted, user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        searchImagesPaginated(searchTerm);
      } else {
        setIsSearching(false);
        if (mounted && user) {
          const getStatusFilter = () => {
            if (statusFilter === "Active") return "active";
            if (statusFilter === "Inactive") return "inactive";
            return "all";
          };
          fetchImagesPaginated(1, 10, getStatusFilter());
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, mounted, user]);

  const handleDelete = async (id: string | number) => {
    const image = images.find((img) => img.id === id);
    const imageTitle = image?.title || "gambar";

    const confirmed = await confirmDelete("Hapus Gambar?", `Gambar "${imageTitle}" akan dihapus secara permanen dan tidak dapat dikembalikan!`, "Ya, Hapus Gambar!");
    if (!confirmed) return;

    const success = await remove(id as string);
    if (success) {
      showSuccess("Gambar Berhasil Dihapus", `Gambar "${imageTitle}" berhasil dihapus dari galeri`);
      if (isSearching) {
        searchImagesPaginated(searchTerm);
      } else {
        const getStatusFilter = () => {
          if (statusFilter === "Active") return "active";
          if (statusFilter === "Inactive") return "inactive";
          return "all";
        };
        fetchImagesPaginated(currentPage, 10, getStatusFilter());
      }
    } else {
      showError("Gagal Menghapus Gambar", "Terjadi kesalahan saat menghapus gambar");
    }
  };

  const handleEdit = (id: string | number) => {
    router.push(`/dashboard/gallery/update?id=${id}`);
  };

  const handlePageChange = (page: number) => {
    if (!isSearching) {
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        return "all";
      };
      fetchImagesPaginated(page, 10, getStatusFilter());
    }
    goToPage(page);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return "";
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FiEye className="mr-1" size={12} />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <FiEyeOff className="mr-1" size={12} />
        Inactive
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      umum: "bg-blue-100 text-blue-800",
      kegiatan: "bg-green-100 text-green-800",
      fasilitas: "bg-purple-100 text-purple-800",
      wisata: "bg-yellow-100 text-yellow-800",
      pembangunan: "bg-orange-100 text-orange-800",
    };

    const colorClass = categoryColors[category] || "bg-gray-100 text-gray-800";

    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>;
  };

  const columns = [
    {
      key: "imageUrl",
      label: "Gambar",
      className: "w-24",
      render: (value: string) => (
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={value || "/kantor_desa.jpg"}
            alt="Gallery"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = "/kantor_desa.jpg";
            }}
          />
        </div>
      ),
    },
    {
      key: "title",
      label: "Judul",
      className: "font-medium text-gray-900",
    },
    {
      key: "category",
      label: "Kategori",
      render: (value: string) => getCategoryBadge(value),
    },
    {
      key: "order",
      label: "Urutan",
      className: "text-center",
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      key: "createdAt",
      label: "Dibuat",
      render: (value: any) => <span className="text-sm text-gray-500">{formatDate(value)}</span>,
    },
  ];

  const headerActions = (
    <ActionButton variant="primary" className="flex items-center gap-2 whitespace-nowrap" onClick={() => router.push("/dashboard/gallery/create")} disabled={loading}>
      <FiPlus size={16} />
      Tambah Gambar
    </ActionButton>
  );

  const statusOptions = [
    { value: "All Status", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Kelola Galeri" subtitle="Kelola gambar-gambar yang ditampilkan di galeri website" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          <SearchAndFilterBar
            title="Daftar Gambar Galeri"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Cari berdasarkan judul, deskripsi, atau kategori..."
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            statusOptions={statusOptions}
            mounted={mounted}
          />

          <DataTableWithStates
            columns={columns}
            data={images}
            editRoute={handleEdit}
            onDelete={handleDelete}
            mounted={mounted}
            loading={loading && images.length === 0}
            error={error}
            onRetry={() => {
              if (isSearching) {
                searchImagesPaginated(searchTerm);
              } else {
                const getStatusFilter = () => {
                  if (statusFilter === "Active") return "active";
                  if (statusFilter === "Inactive") return "inactive";
                  return "all";
                };
                fetchImagesPaginated(currentPage, 10, getStatusFilter());
              }
            }}
            emptyMessage={searchTerm ? "Tidak ditemukan gambar yang sesuai dengan pencarian" : "Belum ada gambar yang diunggah"}
          />

          {!isSearching && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              loading={loading}
              onItemsPerPageChange={(newItemsPerPage) => {
                const getStatusFilter = () => {
                  if (statusFilter === "Active") return "active";
                  if (statusFilter === "Inactive") return "inactive";
                  return "all";
                };
                fetchImagesPaginated(1, newItemsPerPage, getStatusFilter());
              }}
              itemsPerPageOptions={[8, 12, 16, 24]}
            />
          )}
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default GalleryPage;
