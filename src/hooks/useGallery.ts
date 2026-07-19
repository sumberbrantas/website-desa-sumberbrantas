"use client";

import { useState, useEffect, useCallback } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import {
  GalleryImage,
  CreateGalleryImageData,
  UpdateGalleryImageData,
  createGalleryImage,
  getGalleryImages,
  getGalleryImageById,
  updateGalleryImage,
  deleteGalleryImage,
  getActiveGalleryImages,
  searchGalleryImages,
  getGalleryImagesWithPagination,
  getGalleryImageCountByStatus,
} from "@/lib/galleryService";

export const useGalleryImages = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchImages = useCallback(
    async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all", reset: boolean = true) => {
      setLoading(true);
      setError(null);

      try {
        const { images: newImages, lastVisible: newLastVisible } = await getGalleryImages(pageSize, reset ? undefined : lastVisible || undefined, statusFilter);

        if (reset) {
          setImages(newImages);
          setLastVisible(newLastVisible);
        } else {
          setImages((prev) => [...prev, ...newImages]);
          setLastVisible(newLastVisible);
        }

        setHasMore(newImages.length === pageSize);
      } catch (err) {
        console.error("Gallery fetch error:", err);

        const errorMessage = err instanceof Error ? err.message : "Gagal memuat galeri";
        if (errorMessage.includes("index") || errorMessage.includes("Index")) {
          setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
        } else {
          setError(errorMessage);
        }

        if (reset) {
          setImages([]);
          setLastVisible(null);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [lastVisible]
  );

  const loadMore = useCallback(
    async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all") => {
      if (!hasMore || loading) return;
      await fetchImages(pageSize, statusFilter, false);
    },
    [hasMore, loading, fetchImages]
  );

  const searchImages = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      clearSearch();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { images: allImages } = await getGalleryImages(1000);
      const filtered = allImages.filter(
        (image) =>
          image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (image.category && image.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      setImages(filtered);
      setLastVisible(null);
      setHasMore(false);
    } catch (err) {
      console.error("Gallery search error:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal mencari gambar";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      setImages([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setImages([]);
    setLastVisible(null);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    images,
    loading,
    error,
    hasMore,
    fetchImages,
    loadMore,
    searchImages,
    clearSearch,
  };
};

export const useGalleryImage = (id?: string) => {
  const [image, setImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchImage = async () => {
      setLoading(true);
      setError(null);

      try {
        const imageData = await getGalleryImageById(id);
        setImage(imageData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch gallery image");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  return { image, loading, error };
};

export const useGalleryImageActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateGalleryImageData): Promise<GalleryImage | null> => {
    setLoading(true);
    setError(null);

    try {
      const image = await createGalleryImage(data);
      return image;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create gallery image");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateGalleryImageData): Promise<GalleryImage | null> => {
    setLoading(true);
    setError(null);

    try {
      const image = await updateGalleryImage(id, data);
      return image;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update gallery image");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteGalleryImage(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete gallery image");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    create,
    update,
    remove,
    loading,
    error,
    clearError,
  };
};

export const useActiveGalleryImages = (limit?: number) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveImages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching active gallery images...");
      const activeImages = await getActiveGalleryImages(limit);
      console.log("Active gallery images fetched:", activeImages.length, activeImages);
      setImages(activeImages);
    } catch (err) {
      console.error("Error fetching active gallery images:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat galeri";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else if (errorMessage.includes("collection")) {
        setError("Galeri sedang dimuat. Silakan coba lagi.");
      } else {
        setError(errorMessage);
      }

      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActiveImages();
  }, [fetchActiveImages]);

  const refetch = useCallback(() => {
    fetchActiveImages();
  }, [fetchActiveImages]);

  return {
    images,
    loading,
    error,
    refetch,
  };
};

export const useGalleryImagesPagination = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchImagesPaginated = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all") => {
    try {
      setLoading(true);
      setError(null);

      const { images: newImages, totalPages: newTotalPages, totalItems: newTotalItems } = await getGalleryImagesWithPagination(page, pageSize, statusFilter);

      setImages(newImages);
      setCurrentPage(page);
      setTotalPages(newTotalPages);
      setTotalItems(newTotalItems);
      setItemsPerPage(pageSize);
    } catch (err) {
      console.error("Error fetching gallery images with pagination:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat gambar galeri";
      setError(errorMessage);

      setImages([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const searchImagesPaginated = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchImagesPaginated(1, itemsPerPage);
        return;
      }

      const searchResults = await searchGalleryImages(searchTerm);
      setImages(searchResults);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(searchResults.length);
    } catch (err) {
      console.error("Error searching gallery images:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal mencari gambar";
      setError(errorMessage);

      setImages([]);
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
    images,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchImagesPaginated,
    searchImagesPaginated,
    goToPage,
    setError,
  };
};
