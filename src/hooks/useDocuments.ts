"use client";

import { useState, useEffect } from "react";
import {
  Document,
  CreateDocumentData,
  UpdateDocumentData,
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocumentById,
  searchDocuments,
  getActiveDocuments,
  getDocumentsWithPagination,
  getDocumentCountByStatus,
  getDocumentCategories,
} from "@/lib/documentService";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchDocuments = async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all", reset: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const { documents: newDocuments, lastVisible: newLastVisible } = await getDocuments(pageSize, reset ? undefined : lastVisible || undefined, statusFilter);

      if (reset) {
        setDocuments(newDocuments);
      } else {
        setDocuments((prev) => [...prev, ...newDocuments]);
      }

      setLastVisible(newLastVisible);
      setHasMore(newDocuments.length === pageSize);
    } catch (err) {
      console.error("Error fetching documents:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat dokumen";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      if (reset) {
        setDocuments([]);
        setLastVisible(null);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all") => {
    if (!hasMore || loading) return;
    await fetchDocuments(pageSize, statusFilter, false);
  };

  const searchDocumentsList = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchDocuments();
        return;
      }

      const searchResults = await searchDocuments(searchTerm);
      setDocuments(searchResults);
      setHasMore(false);
    } catch (err) {
      console.error("Error searching documents:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal mencari dokumen";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      setDocuments([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    fetchDocuments();
  };

  return {
    documents,
    loading,
    error,
    hasMore,
    fetchDocuments,
    loadMore,
    searchDocumentsList,
    clearSearch,
    setError,
  };
};

export const useDocument = (id?: string) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const documentData = await getDocumentById(documentId);
      setDocument(documentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch document");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDocument(id);
    }
  }, [id]);

  return {
    document,
    loading,
    error,
    fetchDocument,
    setError,
  };
};

export const useDocumentActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateDocumentData): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);

      const newDocument = await createDocument(data);
      return newDocument;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create document");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateDocumentData): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedDocument = await updateDocument(id, data);
      return updatedDocument;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update document");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteDocumentById(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    create,
    update,
    remove,
    clearError,
  };
};

export const useActiveDocuments = (limit?: number) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchActiveDocuments = async (isRetry: boolean = false) => {
    if (!isRetry) {
      setLoading(true);
    }
    setError(null);

    try {
      const activeDocuments = await getActiveDocuments(limit);
      setDocuments(activeDocuments);
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching active documents:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat dokumen";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      setDocuments([]);

      if (retryCount < 2 && !isRetry) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchActiveDocuments(true);
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActiveDocuments();
    }, 100);

    return () => clearTimeout(timer);
  }, [limit]);

  const refetch = () => {
    setRetryCount(0);
    fetchActiveDocuments();
  };

  return {
    documents,
    loading,
    error,
    refetch,
    retryCount,
  };
};

export const useDocumentsPagination = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchDocumentsPaginated = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all") => {
    try {
      setLoading(true);
      setError(null);

      const { documents: newDocuments, totalPages: newTotalPages, totalItems: newTotalItems } = await getDocumentsWithPagination(page, pageSize, statusFilter);

      setDocuments(newDocuments);
      setCurrentPage(page);
      setTotalPages(newTotalPages);
      setTotalItems(newTotalItems);
      setItemsPerPage(pageSize);
    } catch (err) {
      console.error("Error fetching documents with pagination:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat dokumen";
      setError(errorMessage);

      setDocuments([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const searchDocumentsPaginated = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchDocumentsPaginated(1, itemsPerPage);
        return;
      }

      const searchResults = await searchDocuments(searchTerm);
      setDocuments(searchResults);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(searchResults.length);
    } catch (err) {
      console.error("Error searching documents:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal mencari dokumen";
      setError(errorMessage);

      setDocuments([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    documents,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchDocumentsPaginated,
    searchDocumentsPaginated,
    goToPage,
    setError,
  };
};

export const useDocumentCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const documentCategories = await getDocumentCategories();
      setCategories(documentCategories);
    } catch (err) {
      console.error("Error fetching document categories:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};
