"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ActionButton from "@/component/common/ActionButton";
import DataTable from "@/component/common/DataTable";
import { useMenus, useMenuActions } from "@/hooks/useMenus";
import { MenuItem } from "@/lib/menuService";
import Swal from "sweetalert2";
import { FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown, FiInfo } from "react-icons/fi";

const MenusPage = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { menus, loading, error, refetch } = useMenus(false);
  const { remove, reorder, loading: actionLoading } = useMenuActions();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (menu: MenuItem) => {
    if (menu.isBuiltIn) {
      Swal.fire("Info", "Menu bawaan tidak dapat dihapus.", "info");
      return;
    }

    const result = await Swal.fire({
      title: "Hapus Menu",
      text: `Apakah Anda yakin ingin menghapus menu "${menu.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setDeletingId(menu.id);
      const success = await remove(menu.id);
      setDeletingId(null);

      if (success) {
        Swal.fire("Berhasil", "Menu berhasil dihapus.", "success");
        refetch();
      } else {
        Swal.fire("Error", "Gagal menghapus menu.", "error");
      }
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newMenus = [...menus];
    [newMenus[index - 1], newMenus[index]] = [newMenus[index], newMenus[index - 1]];
    const menuIds = newMenus.map((m) => m.id);
    await reorder(menuIds);
    refetch();
  };

  const handleMoveDown = async (index: number) => {
    if (index === menus.length - 1) return;
    const newMenus = [...menus];
    [newMenus[index], newMenus[index + 1]] = [newMenus[index + 1], newMenus[index]];
    const menuIds = newMenus.map((m) => m.id);
    await reorder(menuIds);
    refetch();
  };

  const columns = [
    {
      key: "name",
      label: "Nama Menu",
      render: (_: any, menu: MenuItem) => (
        <div className="flex items-center gap-2">
          {menu.isBuiltIn && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              <FiInfo size={12} className="mr-1" />
              Bawaan
            </span>
          )}
          <span className="font-medium text-gray-900">{menu.name}</span>
        </div>
      ),
    },
    {
      key: "href",
      label: "URL",
      render: (_: any, menu: MenuItem) => (
        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{menu.href}</code>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (_: any, menu: MenuItem) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            menu.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {menu.isActive ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (_: any, menu: MenuItem) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMoveUp(menus.indexOf(menu))}
            disabled={menus.indexOf(menu) === 0 || actionLoading}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            title="Pindah ke atas"
          >
            <FiChevronUp size={18} />
          </button>
          <button
            onClick={() => handleMoveDown(menus.indexOf(menu))}
            disabled={menus.indexOf(menu) === menus.length - 1 || actionLoading}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            title="Pindah ke bawah"
          >
            <FiChevronDown size={18} />
          </button>
          <button
            onClick={() => router.push(`/dashboard/menus/update?id=${menu.id}`)}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => handleDelete(menu)}
            disabled={menu.isBuiltIn || deletingId === menu.id}
            className={`p-1.5 rounded transition-colors ${
              menu.isBuiltIn
                ? "text-gray-300 cursor-not-allowed"
                : "text-red-600 hover:text-red-800 hover:bg-red-50"
            }`}
            title={menu.isBuiltIn ? "Menu bawaan tidak bisa dihapus" : "Hapus"}
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex justify-between items-center px-4 md:px-6 py-4 bg-white/90 border-b" style={{ borderColor: "#c4b998" }}>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-earth-dark">Manajemen Menu</h1>
          <p className="text-xs text-earth-muted">Kelola menu navigasi website</p>
        </div>
        <ActionButton variant="primary" onClick={() => router.push("/dashboard/menus/create")}>
          <FiPlus className="mr-1" />
          Tambah Menu
        </ActionButton>
      </div>

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm text-gray-600">
              Urutkan menu dengan klik tombol panah. Menu bawaan tidak dapat dihapus.
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: "var(--primary)" }}></div>
              <p className="text-gray-600 text-sm">Memuat menu...</p>
            </div>
          ) : menus.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Belum ada menu. Klik tombol "Tambah Menu" untuk membuat menu baru.</p>
            </div>
          ) : (
            <DataTable columns={columns} data={menus} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MenusPage;
