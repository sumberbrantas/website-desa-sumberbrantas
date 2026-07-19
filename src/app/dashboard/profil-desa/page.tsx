"use client";

import React from "react";
import PageHeader from "@/component/common/PageHeader";
import StatusBar from "@/component/common/StatusBar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfilDesaForm from "@/component/dashboard/ProfilDesaForm";

export default function ProfilDesaDashboardPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !profile) {
      router.push("/login");
    }
  }, [profile, loading, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <StatusBar onMenuClick={() => setSidebarOpen(true)} />
      <PageHeader
        title="Kelola Profil Desa"
        subtitle="Kelola konten halaman Profil Desa termasuk Visi, Misi, Peta Lokasi, dan Data Demografi"
        mounted={mounted}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <ProfilDesaForm />
      </main>
    </div>
  );
}
