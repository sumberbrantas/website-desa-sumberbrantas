"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import MenuForm from "@/component/dashboard/MenuForm";
import { useMenuActions } from "@/hooks/useMenus";
import { getMenuById } from "@/lib/menuService";
import Swal from "sweetalert2";

const UpdateMenuPage = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const menuId = searchParams.get("id");
  const { update, loading: saving } = useMenuActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!menuId) {
        router.push("/dashboard/menus");
        return;
      }

      setLoading(true);
      const data = await getMenuById(menuId);

      if (!data) {
        Swal.fire("Error", "Menu tidak ditemukan.", "error");
        router.push("/dashboard/menus");
        return;
      }

      setMenu(data);
      setLoading(false);
    };

    fetchMenu();
  }, [menuId, router]);

  const handleSave = async (data: {
    name: string;
    href: string;
    icon: string;
    order: number;
    isActive: boolean;
    targetBlank: boolean;
  }) => {
    if (!menuId) return;

    const result = await update(menuId, data);
    if (result) {
      Swal.fire("Berhasil", "Menu berhasil diperbarui!", "success");
      router.push("/dashboard/menus");
    } else {
      Swal.fire("Error", "Gagal memperbarui menu.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: "var(--primary)" }}></div>
          <p className="text-gray-600 text-sm">Memuat data menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Edit Menu"
        subtitle={`Edit menu: ${menu?.name || ""}`}
        mounted={mounted}
      />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <MenuForm
            menu={menu}
            onSave={handleSave}
            onCancel={() => router.push("/dashboard/menus")}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateMenuPage;
