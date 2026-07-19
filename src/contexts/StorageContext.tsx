"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { StorageStats, getStorageStats } from "@/lib/storageService";

interface StorageContextType {
  stats: StorageStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  invalidateStats: () => void;
}

const StorageContext = createContext<StorageContextType>({
  stats: null,
  loading: false,
  error: null,
  refreshStats: async () => {},
  invalidateStats: () => {},
});

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorageContext must be used within a StorageProvider");
  }
  return context;
};

interface StorageProviderProps {
  children: ReactNode;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const storageStats = await getStorageStats();
      setStats(storageStats);
    } catch (err) {
      console.error("Error fetching storage stats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch storage stats");
    } finally {
      setLoading(false);
    }
  }, []);

  const invalidateStats = useCallback(() => {
    setStats(null);
  }, []);

  useEffect(() => {
    refreshStats();

    const interval = setInterval(refreshStats, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshStats]);

  const value = {
    stats,
    loading,
    error,
    refreshStats,
    invalidateStats,
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};

