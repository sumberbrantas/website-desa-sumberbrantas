"use client";

import { useEffect } from "react";
import { setStorageRefreshCallback } from "@/lib/articleService";
import { setStorageRefreshCallback as setGalleryStorageRefreshCallback } from "@/lib/galleryService";
import { setStorageRefreshCallback as setStructureStorageRefreshCallback } from "@/lib/structureService";
import { useStorageContext } from "@/contexts/StorageContext";

export const useStorageRefreshInitializer = () => {
  const { refreshStats } = useStorageContext();

  useEffect(() => {
    const refreshCallback = () => {
      setTimeout(() => {
        refreshStats();
      }, 2000);
    };

    try {
      setStorageRefreshCallback(refreshCallback);
      setGalleryStorageRefreshCallback(refreshCallback);
      setStructureStorageRefreshCallback(refreshCallback);
    } catch (error) {
      console.error("Error setting storage refresh callbacks:", error);
    }

    return () => {
      try {
        setStorageRefreshCallback(() => {});
        setGalleryStorageRefreshCallback(() => {});
        setStructureStorageRefreshCallback(() => {});
      } catch (error) {
        console.error("Error cleaning up storage refresh callbacks:", error);
      }
    };
  }, [refreshStats]);
};

export default useStorageRefreshInitializer;
