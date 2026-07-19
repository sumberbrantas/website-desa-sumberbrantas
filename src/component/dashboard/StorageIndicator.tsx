"use client";

import React from "react";
import { FiHardDrive, FiAlertTriangle } from "react-icons/fi";
import { useStorageValidation } from "@/hooks/useStorage";

const StorageIndicator = () => {
  const { checkStorageStatus } = useStorageValidation();
  const { isFull, percentage } = checkStorageStatus();

  if (percentage < 85) return null;

  return (
    <div className={`p-3 rounded-lg border ${isFull ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>
      <div className="flex items-center gap-3">
        <FiAlertTriangle className={`${isFull ? "text-red-500" : "text-yellow-500"}`} size={20} />
        <div>
          <p className={`text-sm font-medium ${isFull ? "text-red-800" : "text-yellow-800"}`}>{isFull ? "Storage Penuh!" : "Storage Hampir Penuh"}</p>
          <p className={`text-xs ${isFull ? "text-red-600" : "text-yellow-600"}`}>
            {isFull ? "Upload gambar telah diblokir. Silakan hapus beberapa file untuk mengosongkan storage." : `Storage terpakai ${percentage.toFixed(1)}%. Pertimbangkan untuk menghapus file yang tidak diperlukan.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorageIndicator;
