"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import MenuForm from "@/component/dashboard/MenuForm";
import { useMenus, useMenuActions } from "@/hooks/useMenus";
import Swal from "sweetalert2";

const CreateMenuPage = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { menus, refetch } = useMenus(false);
  const { create, loading, clearError } = useMenuActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (data: {
    name: string;
    href: string;
    icon: string;
    order: number;
    isActive: boolean;
    targetBlank: boolean;
  }) => {
    const result = await create(data);
    if (result) {
      Swal.fire("Berhasil", "Menu berhasil dibuat!", "success");
      refetch();
      router.push("/dashboard/menus");
    } else {
      Swal.fire("Error", "Gagal membuat menu.", "error");
    }
  };

  // Calculate next order number
  const nextOrder = menus.length > 0 ? Math.max(...menus.map((m) => m.order)) + 1 : 1;

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Tambah Menu Baru"
        subtitle="Buat menu navigasi baru untuk website"
        mounted={mounted}
      />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <MenuForm
            onSave={handleSave}
            onCancel={() => router.push("/dashboard/menus")}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateMenuPage;
