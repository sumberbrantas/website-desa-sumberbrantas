"use client";

import { useState, useEffect } from "react";
import { StorageStats, getStorageStats, formatBytes, getStoragePercentage, getMaxStorageFormatted, getRemainingStorage, getStorageColor, isStorageFull, canUploadFile } from "@/lib/storageService";
import { useStorageContext } from "@/contexts/StorageContext";

export const useStorageStats = () => {
  const { stats, loading, error, refreshStats, invalidateStats } = useStorageContext();

  useEffect(() => {
    if (!stats) {
      refreshStats();
    }
  }, [stats, refreshStats]);

  return {
    stats,
    loading,
    error,
    refreshStats,
    invalidateStats,
    formatBytes,
    getStoragePercentage,
    getMaxStorageFormatted,
    getRemainingStorage,
    getStorageColor,
  };
};

export const useStorageProgress = () => {
  const { stats, loading, error, refreshStats } = useStorageContext();

  const getProgressData = () => {
    if (!stats) return null;

    const percentage = getStoragePercentage(stats.totalSize);
    const used = formatBytes(stats.totalSize);
    const total = getMaxStorageFormatted();
    const remaining = formatBytes(getRemainingStorage(stats.totalSize));
    const color = getStorageColor(percentage);

    return {
      percentage,
      used,
      total,
      remaining,
      color,
      articlesSize: formatBytes(stats.articleImagesSize),
      gallerySize: formatBytes(stats.galleryImagesSize),
      structuresSize: formatBytes(stats.structureImagesSize),
      fileCount: stats.fileCount,
    };
  };

  return {
    loading,
    error,
    progressData: getProgressData(),
    refreshStats,
  };
};

export const useStorageValidation = () => {
  const { stats, refreshStats } = useStorageContext();

  const validateUpload = async (file: File): Promise<{ canUpload: boolean; message?: string }> => {
    if (!file) {
      return { canUpload: false, message: "File tidak valid" };
    }

    await refreshStats();

    return await canUploadFile(file.size);
  };

  const checkStorageStatus = () => {
    if (!stats) return { isFull: false, percentage: 0 };

    const percentage = getStoragePercentage(stats.totalSize);
    const isFull = isStorageFull(stats.totalSize);

    return { isFull, percentage };
  };

  return {
    validateUpload,
    checkStorageStatus,
    stats,
  };
};
