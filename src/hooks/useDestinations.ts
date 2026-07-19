"use client";

import { useState, useEffect } from "react";
import {
  Destination,
  CreateDestinationData,
  UpdateDestinationData,
  createDestination,
  getDestinations,
  getDestinationById,
  updateDestination,
  deleteDestinationById,
  searchDestinations,
  getActiveDestinations,
  getDestinationsWithPagination,
  getDestinationCountByStatus,
  getDestinationCategories,
} from "@/lib/destinationService";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const useDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchDestinations = async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all", reset: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const { destinations: newDestinations, lastVisible: newLastVisible } = await getDestinations(pageSize, reset ? undefined : lastVisible || undefined, statusFilter);

      if (reset) {
        setDestinations(newDestinations);
      } else {
        setDestinations((prev) => [...prev, ...newDestinations]);
      }

      setLastVisible(newLastVisible);
      setHasMore(newDestinations.length === pageSize);
    } catch (err) {
      console.error("Error fetching destinations:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat destinasi";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      if (reset) {
        setDestinations([]);
        setLastVisible(null);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all") => {
    if (!hasMore || loading) return;
    await fetchDestinations(pageSize, statusFilter, false);
  };

  const searchDestinationsList = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchDestinations();
        return;
      }

      const searchResults = await searchDestinations(searchTerm);
      setDestinations(searchResults);
      setHasMore(false);
    } catch (err) {
      console.error("Error searching destinations:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal mencari destinasi";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      setDestinations([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    fetchDestinations();
  };

  return {
    destinations,
    loading,
    error,
    hasMore,
    fetchDestinations,
    loadMore,
    searchDestinationsList,
    clearSearch,
    setError,
  };
};

export const useDestination = (id?: string) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDestination = async (destinationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const destinationData = await getDestinationById(destinationId);
      setDestination(destinationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch destination");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDestination(id);
    }
  }, [id]);

  return {
    destination,
    loading,
    error,
    fetchDestination,
    setError,
  };
};

export const useDestinationActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateDestinationData): Promise<Destination | null> => {
    try {
      setLoading(true);
      setError(null);

      const newDestination = await createDestination(data);
      return newDestination;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create destination");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateDestinationData): Promise<Destination | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedDestination = await updateDestination(id, data);
      return updatedDestination;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update destination");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteDestinationById(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete destination");
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

export const useActiveDestinations = (limit?: number) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchActiveDestinations = async (isRetry: boolean = false) => {
    if (!isRetry) {
      setLoading(true);
    }
    setError(null);

    try {
      const activeDestinations = await getActiveDestinations(limit);
      setDestinations(activeDestinations);
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching active destinations:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat destinasi";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      setDestinations([]);

      if (retryCount < 2 && !isRetry) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchActiveDestinations(true);
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActiveDestinations();
    }, 100);

    return () => clearTimeout(timer);
  }, [limit]);

  const refetch = () => {
    setRetryCount(0);
    fetchActiveDestinations();
  };

  return {
    destinations,
    loading,
    error,
    refetch,
    retryCount,
  };
};

export const useDestinationsPagination = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchDestinationsPaginated = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all") => {
    try {
      setLoading(true);
      setError(null);

      const { destinations: newDestinations, totalPages: newTotalPages, totalItems: newTotalItems } = await getDestinationsWithPagination(page, pageSize, statusFilter);

      setDestinations(newDestinations);
      setCurrentPage(page);
      setTotalPages(newTotalPages);
      setTotalItems(newTotalItems);
      setItemsPerPage(pageSize);
    } catch (err) {
      console.error("Error fetching destinations with pagination:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat destinasi";
      setError(errorMessage);

      setDestinations([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const searchDestinationsPaginated = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchDestinationsPaginated(1, itemsPerPage);
        return;
      }

      const searchResults = await searchDestinations(searchTerm);
      setDestinations(searchResults);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(searchResults.length);
    } catch (err) {
      console.error("Error searching destinations:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal mencari destinasi";
      setError(errorMessage);

      setDestinations([]);
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
    destinations,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchDestinationsPaginated,
    searchDestinationsPaginated,
    goToPage,
    setError,
  };
};

export const useDestinationCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const destinationCategories = await getDestinationCategories();
      setCategories(destinationCategories);
    } catch (err) {
      console.error("Error fetching destination categories:", err);
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
