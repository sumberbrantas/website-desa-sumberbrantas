"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDocument, useDocumentActions } from "@/hooks/useDocuments";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/component/common/PageHeader";
import DocumentForm from "@/component/dashboard/DocumentForm";
import ActionButton from "@/component/common/ActionButton";
import CreditsFooter from "@/component/common/CreditsFooter";

const UpdateDocumentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");

  const { user, profile } = useAuth();
  const { document, loading: documentLoading, error: documentError } = useDocument(documentId || undefined);
  const { update, loading, error } = useDocumentActions();
  const [mounted, setMounted] = useState(false);

  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (data: {
    title: string;
    category: string;
    description: string;
    fileUrl: string;
    isActive: boolean;
    order: number;
  }) => {
    if (!user || !profile) {
      alert("Anda harus login untuk mengupdate dokumen.");
      return;
    }

    if (!data.title.trim()) {
      alert("Judul harus diisi.");
      return;
    }

    if (!data.category.trim()) {
      alert("Kategori harus diisi.");
      return;
    }

    if (!documentId) {
      alert("ID dokumen tidak ditemukan.");
      return;
    }

    const updateData: any = {
      title: data.title,
      category: data.category,
      description: data.description,
      fileUrl: data.fileUrl,
      isActive: data.isActive,
      order: data.order,
      updatedBy: user.uid,
    };

    const result = await update(documentId, updateData);

    if (result) {
      setSuccess("Dokumen berhasil diupdate!");
      setTimeout(() => {
        router.push("/dashboard/documents");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/documents");
  };

  if (!documentId) {
    return (
      <div className="app-content">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">ID dokumen tidak ditemukan. Silakan kembali ke halaman daftar dokumen.</div>
      </div>
    );
  }

  if (documentLoading) {
    return (
      <div className="app-content">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Memuat data dokumen...</div>
        </div>
      </div>
    );
  }

  if (documentError || !document) {
    return (
      <div className="app-content">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{documentError || "Dokumen tidak ditemukan"}</div>
      </div>
    );
  }

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={loading}>
        Batal
      </ActionButton>
    </>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Edit Dokumen" subtitle="Edit dokumen yang ada di website" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <DocumentForm
            document={{
              title: document.title,
              category: document.category,
              description: document.description,
              fileUrl: document.fileUrl,
              fileName: document.fileName,
              isActive: document.isActive,
              order: document.order,
            }}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default UpdateDocumentPage;
