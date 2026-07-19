"use client";

import { useState, useEffect } from "react";
import {
  Accommodation,
  CreateAccommodationData,
  UpdateAccommodationData,
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodationById,
  searchAccommodations,
  getActiveAccommodations,
  getAccommodationsWithPagination,
  getAccommodationCountByStatus,
} from "@/lib/accommodationService";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const useAccommodations = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchAccommodations = async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all", reset: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const { accommodations: newAccommodations, lastVisible: newLastVisible } = await getAccommodations(pageSize, reset ? undefined : lastVisible || undefined, statusFilter);

      if (reset) {
        setAccommodations(newAccommodations);
      } else {
        setAccommodations((prev) => [...prev, ...newAccommodations]);
      }

      setLastVisible(newLastVisible);
      setHasMore(newAccommodations.length === pageSize);
    } catch (err) {
      console.error("Error fetching accommodations:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat penginapan";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      if (reset) {
        setAccommodations([]);
        setLastVisible(null);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all") => {
    if (!hasMore || loading) return;
    await fetchAccommodations(pageSize, statusFilter, false);
  };

  const searchAccommodationsList = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchAccommodations();
        return;
      }

      const searchResults = await searchAccommodations(searchTerm);
      setAccommodations(searchResults);
      setHasMore(false);
    } catch (err) {
      console.error("Error searching accommodations:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal mencari penginapan";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      setAccommodations([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    fetchAccommodations();
  };

  return {
    accommodations,
    loading,
    error,
    hasMore,
    fetchAccommodations,
    loadMore,
    searchAccommodationsList,
    clearSearch,
    setError,
  };
};

export const useAccommodation = (id?: string) => {
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccommodation = async (accommodationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const accommodationData = await getAccommodationById(accommodationId);
      setAccommodation(accommodationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch accommodation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAccommodation(id);
    }
  }, [id]);

  return {
    accommodation,
    loading,
    error,
    fetchAccommodation,
    setError,
  };
};

export const useAccommodationActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateAccommodationData): Promise<Accommodation | null> => {
    try {
      setLoading(true);
      setError(null);

      const newAccommodation = await createAccommodation(data);
      return newAccommodation;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create accommodation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateAccommodationData): Promise<Accommodation | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedAccommodation = await updateAccommodation(id, data);
      return updatedAccommodation;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update accommodation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteAccommodationById(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete accommodation");
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

export const useActiveAccommodations = (limit?: number) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchActiveAccommodations = async (isRetry: boolean = false) => {
    if (!isRetry) {
      setLoading(true);
    }
    setError(null);

    try {
      const activeAccommodations = await getActiveAccommodations(limit);
      setAccommodations(activeAccommodations);
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching active accommodations:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat penginapan";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      setAccommodations([]);

      if (retryCount < 2 && !isRetry) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchActiveAccommodations(true);
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActiveAccommodations();
    }, 100);

    return () => clearTimeout(timer);
  }, [limit]);

  const refetch = () => {
    setRetryCount(0);
    fetchActiveAccommodations();
  };

  return {
    accommodations,
    loading,
    error,
    refetch,
    retryCount,
  };
};

export const useAccommodationsPagination = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchAccommodationsPaginated = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all") => {
    try {
      setLoading(true);
      setError(null);

      const { accommodations: newAccommodations, totalPages: newTotalPages, totalItems: newTotalItems } = await getAccommodationsWithPagination(page, pageSize, statusFilter);

      setAccommodations(newAccommodations);
      setCurrentPage(page);
      setTotalPages(newTotalPages);
      setTotalItems(newTotalItems);
      setItemsPerPage(pageSize);
    } catch (err) {
      console.error("Error fetching accommodations with pagination:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat penginapan";
      setError(errorMessage);

      setAccommodations([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const searchAccommodationsPaginated = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchAccommodationsPaginated(1, itemsPerPage);
        return;
      }

      const searchResults = await searchAccommodations(searchTerm);
      setAccommodations(searchResults);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(searchResults.length);
    } catch (err) {
      console.error("Error searching accommodations:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal mencari penginapan";
      setError(errorMessage);

      setAccommodations([]);
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
    accommodations,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchAccommodationsPaginated,
    searchAccommodationsPaginated,
    goToPage,
    setError,
  };
};
