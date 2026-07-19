"use client";

import { useState, useEffect } from "react";
import {
  Product,
  CreateProductData,
  UpdateProductData,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProductById,
  searchProducts,
  getActiveProducts,
  getProductCategories,
} from "@/lib/productService";

export const useProducts = (statusFilter?: "all" | "active" | "inactive") => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(statusFilter);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  return { products, loading, error, refetch: fetchProducts };
};

export const useProduct = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  return { product, loading, error, fetchProduct, setError };
};

export const useProductActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateProductData): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      return await createProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateProductData): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      return await updateProduct(id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteProductById(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { loading, error, create, update, remove, clearError };
};

export const useActiveProducts = (limit?: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveProducts(limit);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveProducts();
  }, [limit]);

  return { products, loading, error, refetch: fetchActiveProducts };
};

export const useProductCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
};
