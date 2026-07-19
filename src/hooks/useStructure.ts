"use client";

import { useState, useEffect } from "react";
import { StructureItem, CreateStructureData, UpdateStructureData, createStructure, getStructures, getStructureById, updateStructure, deleteStructure, getActiveStructures } from "@/lib/structureService";

export const useStructures = () => {
  const [structures, setStructures] = useState<StructureItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStructures = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStructures();
      setStructures(data);
    } catch (err) {
      console.error("Error fetching structures:", err);
      setError("Gagal memuat struktur desa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  const refetch = () => {
    fetchStructures();
  };

  const clearError = () => {
    setError(null);
  };

  return {
    structures,
    loading,
    error,
    refetch,
    clearError,
  };
};

export const useStructureActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateStructureData): Promise<StructureItem | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await createStructure(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal membuat struktur desa";
      setError(errorMessage);
      console.error("Error creating structure:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateStructureData): Promise<StructureItem | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateStructure(id, data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memperbarui struktur desa";
      setError(errorMessage);
      console.error("Error updating structure:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteStructure(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menghapus struktur desa";
      setError(errorMessage);
      console.error("Error deleting structure:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    create,
    update,
    remove,
    loading,
    error,
    clearError,
  };
};

export const useStructureDetail = (id: string | null) => {
  const [structure, setStructure] = useState<StructureItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setStructure(null);
      return;
    }

    const fetchStructure = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStructureById(id);
        setStructure(data);
      } catch (err) {
        setError("Gagal memuat detail struktur desa");
        console.error("Error fetching structure detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStructure();
  }, [id]);

  return {
    structure,
    loading,
    error,
  };
};

export const useActiveStructures = () => {
  const [structures, setStructures] = useState<StructureItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveStructures = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getActiveStructures();
        setStructures(data);
      } catch (err) {
        console.error("Error fetching active structures:", err);
        setError("Gagal memuat struktur desa aktif");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveStructures();
  }, []);

  return {
    structures,
    loading,
    error,
  };
};

