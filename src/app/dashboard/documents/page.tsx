"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiFile, FiDownload } from "react-icons/fi";
import { useDocumentsPagination, useDocumentActions } from "@/hooks/useDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { confirmDelete, showSuccess, showError } from "@/utils/confirmationUtils";
import PageHeader from "@/component/common/PageHeader";
import SearchAndFilterBar from "@/component/common/SearchAndFilterBar";
import ActionButton from "@/component/common/ActionButton";
import Pagination from "@/component/common/Pagination";
import { DataTableWithStates } from "@/component/common/LoadingStates";
import { formatFileSize } from "@/lib/documentService";
import CreditsFooter from "@/component/common/CreditsFooter";

const DocumentsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { documents, loading, error, currentPage, totalPages, totalItems, itemsPerPage, fetchDocumentsPaginated, searchDocumentsPaginated, goToPage } = useDocumentsPagination();

  const { remove, loading: deleteLoading } = useDocumentActions();
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
      fetchDocumentsPaginated(1, 10, getStatusFilter());
    }
  }, [statusFilter, mounted, user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        searchDocumentsPaginated(searchTerm);
      } else {
        setIsSearching(false);
        if (mounted && user) {
          const getStatusFilter = () => {
            if (statusFilter === "Active") return "active";
            if (statusFilter === "Inactive") return "inactive";
            return "all";
          };
          fetchDocumentsPaginated(1, 10, getStatusFilter());
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, mounted, user]);

  const handleDelete = async (id: string | number) => {
    const doc = documents.find((d) => d.id === id);
    const docTitle = doc?.title || "dokumen";

    const confirmed = await confirmDelete("Hapus Dokumen?", `Dokumen "${docTitle}" akan dihapus secara permanen dan tidak dapat dikembalikan!`, "Ya, Hapus!");
    if (!confirmed) return;

    const success = await remove(id as string);
    if (success) {
      showSuccess("Dokumen Berhasil Dihapus", `Dokumen "${docTitle}" berhasil dihapus`);
      if (isSearching) {
        searchDocumentsPaginated(searchTerm);
      } else {
        const getStatusFilter = () => {
          if (statusFilter === "Active") return "active";
          if (statusFilter === "Inactive") return "inactive";
          return "all";
        };
        fetchDocumentsPaginated(currentPage, 10, getStatusFilter());
      }
    } else {
      showError("Gagal Menghapus Dokumen", "Terjadi kesalahan saat menghapus dokumen");
    }
  };

  const handleEdit = (id: string | number) => {
    router.push(`/dashboard/documents/update?id=${id}`);
  };

  const handlePageChange = (page: number) => {
    if (!isSearching) {
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        return "all";
      };
      fetchDocumentsPaginated(page, 10, getStatusFilter());
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

  const getCategoryBadge = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      "Profil Desa": "bg-blue-100 text-blue-800",
      "Peta Potensi": "bg-green-100 text-green-800",
      "Destinasi Wisata": "bg-yellow-100 text-yellow-800",
      "Penginapan": "bg-purple-100 text-purple-800",
      "UMKM": "bg-pink-100 text-pink-800",
      "Layanan": "bg-cyan-100 text-cyan-800",
      "Regulasi": "bg-orange-100 text-orange-800",
      "Lainnya": "bg-gray-100 text-gray-800",
    };

    const colorClass = categoryColors[category] || "bg-gray-100 text-gray-800";

    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>{category}</span>;
  };

  const columns = [
    {
      key: "fileUrl",
      label: "Link",
      render: (_: any, item: any) => (
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <FiFile className="text-red-600" size={20} />
          </div>
          <div className="max-w-xs">
            <p className="font-medium text-gray-900 truncate">{item.fileName || "Google Drive Document"}</p>
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline truncate block max-w-xs"
            >
              {item.fileUrl ? "Buka di Google Drive" : "-"}
            </a>
          </div>
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
    <ActionButton variant="primary" className="flex items-center gap-2 whitespace-nowrap" onClick={() => router.push("/dashboard/documents/create")} disabled={loading}>
      <FiPlus size={16} />
      Tambah Dokumen
    </ActionButton>
  );

  const statusOptions = [
    { value: "All Status", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Kelola Dokumen" subtitle="Kelola dokumen-dokumen PDF yang dapat diunduh di website" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          <SearchAndFilterBar
            title="Daftar Dokumen"
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
            data={documents}
            editRoute={handleEdit}
            onDelete={handleDelete}
            mounted={mounted}
            loading={loading && documents.length === 0}
            error={error}
            onRetry={() => {
              if (isSearching) {
                searchDocumentsPaginated(searchTerm);
              } else {
                const getStatusFilter = () => {
                  if (statusFilter === "Active") return "active";
                  if (statusFilter === "Inactive") return "inactive";
                  return "all";
                };
                fetchDocumentsPaginated(currentPage, 10, getStatusFilter());
              }
            }}
            emptyMessage={searchTerm ? "Tidak ditemukan dokumen yang sesuai dengan pencarian" : "Belum ada dokumen yang diunggah"}
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
                fetchDocumentsPaginated(1, newItemsPerPage, getStatusFilter());
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

export default DocumentsPage;
