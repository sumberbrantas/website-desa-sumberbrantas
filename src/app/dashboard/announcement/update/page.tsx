"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import AnnouncementForm from "@/component/dashboard/AnnouncementForm";
import { useAuth } from "@/contexts/AuthContext";
import { useAnnouncement, useAnnouncementActions } from "@/hooks/useAnnouncements";
import CreditsFooter from "@/component/common/CreditsFooter";

const UpdateAnnouncementPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const announcementId = searchParams.get("id");

  const { user, profile } = useAuth();
  const { announcement, loading: fetchLoading, error: fetchError } = useAnnouncement(announcementId || undefined);
  const { update, loading: updateLoading, error: updateError } = useAnnouncementActions();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    startDate: "",
    endDate: "",
    priority: "normal" as "normal" | "penting" | "urgent",
  });

  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || "",
        content: announcement.content || "",
        startDate: announcement.startDate || "",
        endDate: announcement.endDate || "",
        priority: announcement.priority || "normal",
      });
    }
  }, [announcement]);

  useEffect(() => {
    if (!announcementId) {
      router.push("/dashboard/announcement");
    }
  }, [announcementId, router]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (success) {
      setSuccess(null);
    }
  };

  const handleUpdate = async () => {
    if (!user || !profile) {
      alert("Anda harus login untuk memperbarui pengumuman");
      return;
    }

    if (!announcementId) {
      alert("ID pengumuman tidak ditemukan");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Judul dan isi pengumuman harus diisi");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert("Tanggal mulai dan berakhir harus diisi");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert("Tanggal mulai tidak boleh lebih besar dari tanggal berakhir");
      return;
    }

    const updateData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      priority: formData.priority,
    };

    const result = await update(announcementId, updateData);

    if (result) {
      setSuccess("Pengumuman berhasil diperbarui!");
      setTimeout(() => {
        router.push("/dashboard/announcement");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/announcement");
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Memuat data pengumuman...</div>
      </div>
    );
  }

  if (fetchError || !announcement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">{fetchError || "Pengumuman tidak ditemukan"}</div>
          <ActionButton variant="primary" onClick={() => router.push("/dashboard/announcement")}>
            Kembali ke Daftar Pengumuman
          </ActionButton>
        </div>
      </div>
    );
  }

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={updateLoading}>
        Batal
      </ActionButton>
      <ActionButton variant="primary" onClick={handleUpdate} disabled={updateLoading}>
        {updateLoading ? "Memperbarui..." : "Update"}
      </ActionButton>
    </>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Edit Pengumuman" subtitle="Edit pengumuman yang sudah ada" actions={headerActions} mounted={mounted} />
      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100">
          {updateError && <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">{updateError}</div>}

          {success && <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">{success}</div>}

          <AnnouncementForm formData={formData} onChange={handleFormChange} isEditing={true} />
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default UpdateAnnouncementPage;
