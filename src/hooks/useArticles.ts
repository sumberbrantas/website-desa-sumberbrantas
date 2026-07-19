"use client";

import { useState, useEffect } from "react";
import {
  Article,
  CreateArticleData,
  UpdateArticleData,
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
  getPublishedArticles,
  getArticlesWithPagination,
  getArticleCountByStatus,
} from "@/lib/articleService";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = async (pageSize: number = 10, statusFilter: "all" | "published" | "draft" = "all", reset: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const { articles: newArticles, lastVisible: newLastVisible } = await getArticles(pageSize, reset ? undefined : lastVisible || undefined, statusFilter);

      if (reset) {
        setArticles(newArticles);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
      }

      setLastVisible(newLastVisible);
      setHasMore(newArticles.length === pageSize);
    } catch (err) {
      console.error("Error fetching articles:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat artikel";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      if (reset) {
        setArticles([]);
        setLastVisible(null);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async (pageSize: number = 10, statusFilter: "all" | "published" | "draft" = "all") => {
    if (!hasMore || loading) return;
    await fetchArticles(pageSize, statusFilter, false);
  };

  const searchArticlesList = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchArticles();
        return;
      }

      const searchResults = await searchArticles(searchTerm);
      setArticles(searchResults);
      setHasMore(false);
    } catch (err) {
      console.error("Error searching articles:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal mencari artikel";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      setArticles([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    fetchArticles();
  };

  return {
    articles,
    loading,
    error,
    hasMore,
    fetchArticles,
    loadMore,
    searchArticlesList,
    clearSearch,
    setError,
  };
};

export const useArticle = (id?: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = async (articleId: string) => {
    try {
      setLoading(true);
      setError(null);

      const articleData = await getArticleById(articleId);
      setArticle(articleData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch article");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  return {
    article,
    loading,
    error,
    fetchArticle,
    setError,
  };
};

export const useArticleActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateArticleData): Promise<Article | null> => {
    try {
      setLoading(true);
      setError(null);

      const newArticle = await createArticle(data);
      return newArticle;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create article");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateArticleData): Promise<Article | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedArticle = await updateArticle(id, data);
      return updatedArticle;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update article");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteArticle(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
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

export const usePublishedArticles = (limit?: number) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchPublishedArticles = async (isRetry: boolean = false) => {
    if (!isRetry) {
      setLoading(true);
    }
    setError(null);

    try {
      const publishedArticles = await getPublishedArticles(limit);
      setArticles(publishedArticles);
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching published articles:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat artikel";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError(errorMessage);
      }

      setArticles([]);

      if (retryCount < 2 && !isRetry) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchPublishedArticles(true);
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPublishedArticles();
    }, 100);

    return () => clearTimeout(timer);
  }, [limit]);

  const refetch = () => {
    setRetryCount(0);
    fetchPublishedArticles();
  };

  return {
    articles,
    loading,
    error,
    refetch,
    retryCount,
  };
};

export const useArticlesPagination = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchArticlesPaginated = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "published" | "draft" = "all") => {
    try {
      setLoading(true);
      setError(null);

      const { articles: newArticles, totalPages: newTotalPages, totalItems: newTotalItems } = await getArticlesWithPagination(page, pageSize, statusFilter);

      setArticles(newArticles);
      setCurrentPage(page);
      setTotalPages(newTotalPages);
      setTotalItems(newTotalItems);
      setItemsPerPage(pageSize);
    } catch (err) {
      console.error("Error fetching articles with pagination:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal memuat artikel";
      setError(errorMessage);

      setArticles([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const searchArticlesPaginated = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchArticlesPaginated(1, itemsPerPage);
        return;
      }

      const searchResults = await searchArticles(searchTerm);
      setArticles(searchResults);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(searchResults.length);
    } catch (err) {
      console.error("Error searching articles:", err);

      const errorMessage = err instanceof Error ? err.message : "Gagal mencari artikel";
      setError(errorMessage);

      setArticles([]);
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
    articles,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchArticlesPaginated,
    searchArticlesPaginated,
    goToPage,
    setError,
  };
};
