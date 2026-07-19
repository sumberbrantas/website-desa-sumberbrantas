"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import ArticleForm from "@/component/dashboard/ArticleForm";
import { useArticle, useArticleActions } from "@/hooks/useArticles";
import CreditsFooter from "@/component/common/CreditsFooter";

const UpdateArticlePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");

  const { article, loading: fetchLoading, error: fetchError } = useArticle(articleId || undefined);
  const { update, loading: updateLoading, error: updateError } = useArticleActions();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    image: null as File | null,
    status: "draft" as "draft" | "published",
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        imageUrl: article.imageUrl || "",
        image: null,
        status: article.status,
      });
    }
  }, [article]);

  const handleFormChange = (field: string, value: string | File) => {
    if (field === "image" && value instanceof File) {
      setFormData((prev) => ({ ...prev, image: value }));
    } else if (typeof value === "string") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (storageError) {
      setStorageError(null);
    }
  };

  const handleStorageError = (message: string) => {
    setStorageError(message);
  };

  const handleUpdate = async () => {
    if (!articleId) {
      alert("ID artikel tidak ditemukan");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Judul dan konten berita harus diisi");
      return;
    }

    if (formData.image && storageError) {
      alert("Tidak dapat memperbarui artikel karena storage penuh. Silakan kosongkan storage terlebih dahulu.");
      return;
    }

    const updateData: any = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      status: formData.status,
    };

    if (formData.image) {
      updateData.image = formData.image;
    }

    const result = await update(articleId, updateData);

    if (result) {
      setSuccess("Artikel berhasil diperbarui!");
      setTimeout(() => {
        router.push("/dashboard/article");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/article");
  };

  if (!articleId) {
    return (
      <div className="app-content">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">ID artikel tidak ditemukan. Silakan kembali ke halaman daftar artikel.</div>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="app-content">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Memuat data artikel...</div>
        </div>
      </div>
    );
  }

  if (fetchError || !article) {
    return (
      <div className="app-content">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{fetchError || "Artikel tidak ditemukan"}</div>
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
      <PageHeader title="Edit Berita" subtitle="Edit artikel berita yang sudah ada" actions={headerActions} mounted={mounted} />
      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {updateError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{updateError}</div>}

        {storageError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{storageError}</div>}

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <ArticleForm formData={formData} onChange={handleFormChange} onStorageError={handleStorageError} isEditing={true} loading={updateLoading} />
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};
export default UpdateArticlePage;
