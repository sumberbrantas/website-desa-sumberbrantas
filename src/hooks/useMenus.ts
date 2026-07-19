"use client";

import { useState, useEffect } from "react";
import {
  MenuItem,
  CreateMenuData,
  UpdateMenuData,
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  reorderMenus,
  initializeDefaultMenus,
} from "@/lib/menuService";

export const useMenus = (activeOnly: boolean = false) => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      // Initialize default menus if Firestore is empty
      await initializeDefaultMenus();
      const data = await getMenus(activeOnly);
      setMenus(data);
    } catch (err) {
      console.error("Error fetching menus:", err);
      setError(err instanceof Error ? err.message : "Gagal memuat menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [activeOnly]);

  const refetch = () => {
    fetchMenus();
  };

  return {
    menus,
    loading,
    error,
    refetch,
  };
};

export const useMenuActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateMenuData): Promise<MenuItem | null> => {
    try {
      setLoading(true);
      setError(null);
      const newMenu = await createMenu(data);
      return newMenu;
    } catch (err) {
      console.error("Error creating menu:", err);
      setError(err instanceof Error ? err.message : "Gagal membuat menu");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateMenuData): Promise<MenuItem | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedMenu = await updateMenu(id, data);
      return updatedMenu;
    } catch (err) {
      console.error("Error updating menu:", err);
      setError(err instanceof Error ? err.message : "Gagal mengupdate menu");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteMenu(id);
      return true;
    } catch (err) {
      console.error("Error deleting menu:", err);
      setError(err instanceof Error ? err.message : "Gagal menghapus menu");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reorder = async (menuIds: string[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await reorderMenus(menuIds);
      return true;
    } catch (err) {
      console.error("Error reordering menus:", err);
      setError(err instanceof Error ? err.message : "Gagal mengurutkan menu");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const initialize = async (): Promise<void> => {
    try {
      setLoading(true);
      await initializeDefaultMenus();
    } catch (err) {
      console.error("Error initializing menus:", err);
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
    reorder,
    initialize,
    clearError,
  };
};
