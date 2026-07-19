"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiPhone } from "react-icons/fi";
import { useAccommodationsPagination, useAccommodationActions } from "@/hooks/useAccommodations";
import { useAuth } from "@/contexts/AuthContext";
import { confirmDelete, showSuccess, showError } from "@/utils/confirmationUtils";
import PageHeader from "@/component/common/PageHeader";
import SearchAndFilterBar from "@/component/common/SearchAndFilterBar";
import ActionButton from "@/component/common/ActionButton";
import Pagination from "@/component/common/Pagination";
import { DataTableWithStates } from "@/component/common/LoadingStates";
import CreditsFooter from "@/component/common/CreditsFooter";

const AccommodationsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { accommodations, loading, error, currentPage, totalPages, totalItems, itemsPerPage, fetchAccommodationsPaginated, searchAccommodationsPaginated, goToPage } = useAccommodationsPagination();

  const { remove, loading: deleteLoading } = useAccommodationActions();
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
      fetchAccommodationsPaginated(1, 10, getStatusFilter());
    }
  }, [statusFilter, mounted, user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        searchAccommodationsPaginated(searchTerm);
      } else {
        setIsSearching(false);
        if (mounted && user) {
          const getStatusFilter = () => {
            if (statusFilter === "Active") return "active";
            if (statusFilter === "Inactive") return "inactive";
            return "all";
          };
          fetchAccommodationsPaginated(1, 10, getStatusFilter());
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, mounted, user]);

  const handleDelete = async (id: string | number) => {
    const acc = accommodations.find((a) => a.id === id);
    const accName = acc?.name || "penginapan";

    const confirmed = await confirmDelete("Hapus Penginapan?", `Penginapan "${accName}" akan dihapus secara permanen dan tidak dapat dikembalikan!`, "Ya, Hapus!");
    if (!confirmed) return;

    const success = await remove(id as string);
    if (success) {
      showSuccess("Penginapan Berhasil Dihapus", `Penginapan "${accName}" berhasil dihapus`);
      if (isSearching) {
        searchAccommodationsPaginated(searchTerm);
      } else {
        const getStatusFilter = () => {
          if (statusFilter === "Active") return "active";
          if (statusFilter === "Inactive") return "inactive";
          return "all";
        };
        fetchAccommodationsPaginated(currentPage, 10, getStatusFilter());
      }
    } else {
      showError("Gagal Menghapus Penginapan", "Terjadi kesalahan saat menghapus penginapan");
    }
  };

  const handleEdit = (id: string | number) => {
    router.push(`/dashboard/accommodations/update?id=${id}`);
  };

  const handlePageChange = (page: number) => {
    if (!isSearching) {
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        return "all";
      };
      fetchAccommodationsPaginated(page, 10, getStatusFilter());
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
      }).format(date);
    } catch (error) {
      return "";
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Aktif
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Nonaktif
      </span>
    );
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
            alt="Accommodation"
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
      key: "name",
      label: "Nama",
      className: "font-medium text-gray-900",
    },
    {
      key: "location",
      label: "Lokasi",
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <FiMapPin size={14} />
          <span>{value || "-"}</span>
        </div>
      ),
    },
    {
      key: "priceRange",
      label: "Harga",
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value || "-"}</span>
      ),
    },
    {
      key: "whatsappNumber",
      label: "WhatsApp",
      render: (value: string) => (
        value ? (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <FiPhone size={14} />
            <span>Ada</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean) => getStatusBadge(value),
    },
  ];

  const headerActions = (
    <ActionButton variant="primary" className="flex items-center gap-2 whitespace-nowrap" onClick={() => router.push("/dashboard/accommodations/create")} disabled={loading}>
      <FiPlus size={16} />
      Tambah Penginapan
    </ActionButton>
  );

  const statusOptions = [
    { value: "All Status", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Kelola Penginapan" subtitle="Kelola tempat penginapan yang ditampilkan di website" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          <SearchAndFilterBar
            title="Daftar Penginapan"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Cari berdasarkan nama, lokasi, atau deskripsi..."
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            statusOptions={statusOptions}
            mounted={mounted}
          />

          <DataTableWithStates
            columns={columns}
            data={accommodations}
            editRoute={handleEdit}
            onDelete={handleDelete}
            mounted={mounted}
            loading={loading && accommodations.length === 0}
            error={error}
            onRetry={() => {
              if (isSearching) {
                searchAccommodationsPaginated(searchTerm);
              } else {
                const getStatusFilter = () => {
                  if (statusFilter === "Active") return "active";
                  if (statusFilter === "Inactive") return "inactive";
                  return "all";
                };
                fetchAccommodationsPaginated(currentPage, 10, getStatusFilter());
              }
            }}
            emptyMessage={searchTerm ? "Tidak ditemukan penginapan yang sesuai dengan pencarian" : "Belum ada penginapan yang ditambahkan"}
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
                fetchAccommodationsPaginated(1, newItemsPerPage, getStatusFilter());
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

export default AccommodationsPage;
