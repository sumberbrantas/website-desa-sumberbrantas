"use client";

import { FiPlus, FiEdit2, FiTrash2, FiImage, FiCalendar, FiUser } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import { DataTableWithStates } from "@/component/common/LoadingStates";
import { useStructures, useStructureActions } from "@/hooks/useStructure";
import { confirmDelete, showSuccess, showError } from "@/utils/confirmationUtils";
import CreditsFooter from "@/component/common/CreditsFooter";

const StructurePage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { structures, loading, error, refetch, clearError } = useStructures();
  const { remove } = useStructureActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id: string | number) => {
    const structure = structures.find((s) => s.id === id);
    const structureName = structure?.name || "item ini";

    const confirmed = await confirmDelete("Hapus Struktur?", `Struktur "${structureName}" akan dihapus secara permanen dan tidak dapat dikembalikan!`, "Ya, Hapus Struktur!");

    if (!confirmed) return;

    const success = await remove(String(id));
    if (success) {
      showSuccess("Struktur Berhasil Dihapus", `Struktur "${structureName}" berhasil dihapus dari sistem`);
      refetch();
    } else {
      showError("Gagal Menghapus Struktur", "Terjadi kesalahan saat menghapus struktur");
    }
  };

  const handleEdit = (id: string | number) => {
    router.push(`/dashboard/structure/update?id=${id}`);
  };

  const handleViewPublic = (structure: any) => {
    if (structure.isActive) {
      return `/struktur?id=${structure.id}`;
    }
    return null;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "dd MMM yyyy", { locale: idLocale });
    } catch (error) {
      return "-";
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{isActive ? "Aktif" : "Nonaktif"}</span>;
  };

  const columns = [
    {
      key: "imageUrl",
      label: "Gambar",
      render: (value: string) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt="Structure"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = "/struktur-desa.png";
              }}
            />
          ) : (
            <FiImage className="text-gray-400" size={24} />
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Nama Struktur",
      className: "font-medium text-gray-900",
    },
    {
      key: "description",
      label: "Deskripsi",
      render: (value: string) => <span className="text-sm text-gray-600 line-clamp-2 max-w-xs">{value ? (value.length > 100 ? `${value.substring(0, 100)}...` : value) : "-"}</span>,
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
      key: "updatedAt",
      label: "Terakhir Diubah",
      render: (value: any) => (
        <div className="flex items-center text-sm text-gray-900">
          <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
          {formatDate(value)}
        </div>
      ),
    },
  ];

  const headerActions = (
    <Link href="/dashboard/structure/create">
      <ActionButton variant="primary" className="flex items-center gap-2 whitespace-nowrap">
        <FiPlus size={14} />
        Tambah Struktur
      </ActionButton>
    </Link>
  );

  if (error && !error.includes("tidak ditemukan") && structures.length === 0) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader title="Kelola Struktur" subtitle="Kelola struktur organisasi desa" actions={headerActions} mounted={mounted} />
        <div className="app-content">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Kelola Struktur" subtitle="Kelola struktur organisasi desa" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          <DataTableWithStates
            columns={columns}
            data={structures}
            editRoute={handleEdit}
            onDelete={handleDelete}
            viewRoute={handleViewPublic}
            mounted={mounted}
            loading={loading && structures.length === 0}
            error={null}
            onRetry={refetch}
            emptyMessage="Tidak ada data
Belum ada struktur yang dibuat."
          />
        </div>
      </div>


      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default StructurePage;

