"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";
import { useDestinationsPagination, useDestinationActions } from "@/hooks/useDestinations";
import { useAuth } from "@/contexts/AuthContext";
import { confirmDelete, showSuccess, showError } from "@/utils/confirmationUtils";
import PageHeader from "@/component/common/PageHeader";
import SearchAndFilterBar from "@/component/common/SearchAndFilterBar";
import ActionButton from "@/component/common/ActionButton";
import Pagination from "@/component/common/Pagination";
import { DataTableWithStates } from "@/component/common/LoadingStates";
import CreditsFooter from "@/component/common/CreditsFooter";

const DestinationsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { destinations, loading, error, currentPage, totalPages, totalItems, itemsPerPage, fetchDestinationsPaginated, searchDestinationsPaginated, goToPage } = useDestinationsPagination();

  const { remove } = useDestinationActions();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        return "all";
      };
      fetchDestinationsPaginated(1, 10, getStatusFilter());
    }
  }, [statusFilter, mounted, user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        searchDestinationsPaginated(searchTerm);
      } else {
        setIsSearching(false);
        if (mounted && user) {
          const getStatusFilter = () => {
            if (statusFilter === "Active") return "active";
            if (statusFilter === "Inactive") return "inactive";
            return "all";
          };
          fetchDestinationsPaginated(1, 10, getStatusFilter());
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, mounted, user]);

  const handleDelete = async (id: string | number) => {
    const dest = destinations.find((d) => d.id === id);
    const destName = dest?.name || "destinasi";

    const confirmed = await confirmDelete("Hapus Destinasi?", `Destinasi "${destName}" akan dihapus secara permanen!`, "Ya, Hapus!");
    if (!confirmed) return;

    const success = await remove(id as string);
    if (success) {
      showSuccess("Destinasi Berhasil Dihapus", `Destinasi "${destName}" berhasil dihapus`);
      if (isSearching) {
        searchDestinationsPaginated(searchTerm);
      } else {
        const getStatusFilter = () => {
          if (statusFilter === "Active") return "active";
          if (statusFilter === "Inactive") return "inactive";
          return "all";
        };
        fetchDestinationsPaginated(currentPage, 10, getStatusFilter());
      }
    } else {
      showError("Gagal Menghapus", "Terjadi kesalahan saat menghapus destinasi");
    }
  };

  const handleEdit = (id: string | number) => {
    router.push(`/dashboard/destinations/update?id=${id}`);
  };

  const handlePageChange = (page: number) => {
    if (!isSearching) {
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        return "all";
      };
      fetchDestinationsPaginated(page, 10, getStatusFilter());
    }
    goToPage(page);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "long", day: "numeric" }).format(date);
    } catch {
      return "";
    }
  };

  const getStatusBadge = (isActive: boolean) => (
    isActive
      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Aktif</span>
      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Nonaktif</span>
  );

  const getCategoryBadge = (category: string) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {category || "Lainnya"}
    </span>
  );

  const columns = [
    {
      key: "imageUrl",
      label: "Gambar",
      className: "w-24",
      render: (value: string) => (
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          <img src={value || "/kantor_desa.jpg"} alt="Destination" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/kantor_desa.jpg"; }} />
        </div>
      ),
    },
    { key: "name", label: "Nama", className: "font-medium text-gray-900" },
    { key: "location", label: "Lokasi", render: (v: string) => <div className="flex items-center gap-1 text-sm text-gray-600"><FiMapPin size={14} /><span>{v || "-"}</span></div> },
    { key: "category", label: "Kategori", render: (v: string) => getCategoryBadge(v) },
    { key: "isActive", label: "Status", render: (v: boolean) => getStatusBadge(v) },
    { key: "createdAt", label: "Dibuat", render: (v: any) => <span className="text-sm text-gray-500">{formatDate(v)}</span> },
  ];

  const headerActions = (
    <ActionButton variant="primary" className="flex items-center gap-2 whitespace-nowrap" onClick={() => router.push("/dashboard/destinations/create")} disabled={loading}>
      <FiPlus size={16} /> Tambah Destinasi
    </ActionButton>
  );

  const statusOptions = [
    { value: "All Status", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Kelola Destinasi" subtitle="Kelola tempat wisata yang ditampilkan di website" actions={headerActions} mounted={mounted} />
      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          <SearchAndFilterBar
            title="Daftar Destinasi"
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
            data={destinations}
            editRoute={handleEdit}
            onDelete={handleDelete}
            mounted={mounted}
            loading={loading && destinations.length === 0}
            error={error}
            onRetry={() => isSearching ? searchDestinationsPaginated(searchTerm) : fetchDestinationsPaginated(currentPage, 10, statusFilter === "Active" ? "active" : statusFilter === "Inactive" ? "inactive" : "all")}
            emptyMessage={searchTerm ? "Tidak ditemukan destinasi yang sesuai" : "Belum ada destinasi yang ditambahkan"}
          />
          {!isSearching && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              loading={loading}
              onItemsPerPageChange={(newSize) => fetchDestinationsPaginated(1, newSize, statusFilter === "Active" ? "active" : statusFilter === "Inactive" ? "inactive" : "all")}
              itemsPerPageOptions={[8, 12, 16, 24]}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Footer = () => (
  <div className={`w-full bg-gray-100 py-4 smooth-transition ${typeof window !== "undefined" ? "smooth-reveal" : ""}`}>
    <CreditsFooter variant="light" />
  </div>
);

export default DestinationsPage;
