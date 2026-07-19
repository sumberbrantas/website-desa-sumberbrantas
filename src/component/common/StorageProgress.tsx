"use client";

import React, { useState } from "react";
import { FiHardDrive, FiInfo, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import { useStorageProgress } from "@/hooks/useStorage";

const StorageProgress = () => {
  const { loading, error, progressData, refreshStats } = useStorageProgress();
  const [showDetails, setShowDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStats();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (loading && !progressData) {
    return (
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center space-x-2 text-white/70">
          <FiHardDrive size={14} />
          <span className="text-xs">Menghitung storage...</span>
        </div>
        <div className="mt-2 w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white/70">
            <FiHardDrive size={14} />
            <span className="text-xs">Storage error</span>
          </div>
          <button onClick={handleRefresh} disabled={isRefreshing} className="text-white/60 hover:text-white transition-colors">
            <FiRefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
    );
  }

  if (!progressData) return null;

  const isNearlyFull = progressData.percentage >= 85;
  const isFull = progressData.percentage >= 95;

  return (
    <div className="px-4 py-3 border-t border-white/10">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white/90">
            <FiHardDrive size={14} />
            <span className="text-xs font-medium">Storage Firebase</span>
            {(isNearlyFull || isFull) && <FiAlertTriangle size={12} className={`${isFull ? "text-red-400" : "text-yellow-400"} animate-pulse`} />}
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={() => setShowDetails(!showDetails)} className="text-white/60 hover:text-white transition-colors">
              <FiInfo size={12} />
            </button>
            <button onClick={handleRefresh} disabled={isRefreshing} className="text-white/60 hover:text-white transition-colors">
              <FiRefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {isFull && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-md p-2">
            <div className="flex items-center space-x-2">
              <FiAlertTriangle size={12} className="text-red-400" />
              <span className="text-xs text-red-200 font-medium">Storage penuh! Upload file diblokir.</span>
            </div>
          </div>
        )}

        {isNearlyFull && !isFull && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-md p-2">
            <div className="flex items-center space-x-2">
              <FiAlertTriangle size={12} className="text-yellow-400" />
              <span className="text-xs text-yellow-200 font-medium">Storage hampir penuh! Tersisa {progressData.remaining}.</span>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/70">
              {progressData.used} / {progressData.total}
            </span>
            <span className="text-xs text-white/70">{progressData.percentage.toFixed(1)}%</span>
          </div>

          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div className={`h-2 rounded-full transition-all duration-500 ease-out ${progressData.color} ${loading ? "storage-progress-bar" : ""}`} style={{ width: `${progressData.percentage}%` }} />
          </div>

          <div className="text-xs text-white/60">Sisa: {progressData.remaining}</div>
        </div>

        {showDetails && (
          <div className="pt-2 space-y-1 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/70">Gambar Berita:</span>
              <span className="text-xs text-white/90">{progressData.articlesSize}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/70">Gambar Galeri:</span>
              <span className="text-xs text-white/90">{progressData.gallerySize}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/70">Gambar Struktur:</span>
              <span className="text-xs text-white/90">{progressData.structuresSize}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/70">Total File:</span>
              <span className="text-xs text-white/90">{progressData.fileCount}</span>
            </div>
          </div>
        )}

        {progressData.percentage > 85 && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-200">{progressData.percentage > 95 ? "Storage hampir penuh!" : "Storage mendekati batas!"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageProgress;
