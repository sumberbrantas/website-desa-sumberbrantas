"use client";

import { useState, useEffect, useCallback } from "react";
import {
  VillageSettings,
  getVillageSettings,
  updateVillageSettings,
  uploadLogo,
  uploadIcon,
  deleteLogo,
  deleteIcon,
  extractYouTubeId,
  generateWhatsAppLink,
} from "@/lib/villageSettingsService";

import { mockVillageSettings, mockUpdateVillageSettings } from "@/lib/mockData";

// Check if we should use mock data
const shouldUseMockData = () => {
  if (typeof window === "undefined") return false;
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo"
  );
};

export const useVillageSettings = () => {
  const [settings, setSettings] = useState<VillageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (shouldUseMockData()) {
        // Simulasi delay network untuk mock data
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("[MockMode] Loading settings from mockVillageSettings:", mockVillageSettings);
        setSettings({ ...mockVillageSettings }); // Spread to create new reference
      } else {
        const data = await getVillageSettings();
        setSettings(data);
      }
    } catch (err) {
      console.error("Error fetching village settings:", err);
      // Fallback ke mock data jika Firebase error
      setSettings(mockVillageSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const refetch = () => {
    fetchSettings();
  };

  return {
    settings,
    loading,
    error,
    refetch,
  };
};

export const useVillageSettingsActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    setIsMockMode(shouldUseMockData());
  }, []);

  const updateSettings = async (data: Partial<VillageSettings>): Promise<VillageSettings | null> => {
    try {
      setLoading(true);
      setError(null);

      if (shouldUseMockData()) {
        // Mock mode - update and save to localStorage
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("[MockMode] Updating settings:", data);
        const updated = mockUpdateVillageSettings(data);
        console.log("[MockMode] Settings updated, new value:", updated);
        return updated;
      }

      const updated = await updateVillageSettings(data);
      return updated;
    } catch (err) {
      console.error("Error updating settings:", err);
      setError(err instanceof Error ? err.message : "Gagal menyimpan pengaturan");
      return null;
    } finally {
      setLoading(false);
    }
  };

// Helper function to convert file to base64 for localStorage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

  const uploadNewLogo = async (file: File, currentPath?: string): Promise<{ url: string; path: string } | null> => {
    try {
      setLoading(true);
      setError(null);

      if (shouldUseMockData()) {
        // Mock mode - convert to base64 for localStorage persistence
        await new Promise(resolve => setTimeout(resolve, 500));
        const base64 = await fileToBase64(file);
        return { url: base64, path: `mock/logo_${Date.now()}_${file.name}` };
      }

      // Delete old logo if exists
      if (currentPath) {
        await deleteLogo(currentPath);
      }

      const result = await uploadLogo(file);
      return result;
    } catch (err) {
      console.error("Error uploading logo:", err);
      setError(err instanceof Error ? err.message : "Gagal upload logo");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadNewIcon = async (file: File, currentPath?: string): Promise<{ url: string; path: string } | null> => {
    try {
      setLoading(true);
      setError(null);

      if (shouldUseMockData()) {
        // Mock mode - convert to base64 for localStorage persistence
        await new Promise(resolve => setTimeout(resolve, 500));
        const base64 = await fileToBase64(file);
        return { url: base64, path: `mock/icon_${Date.now()}_${file.name}` };
      }

      // Delete old icon if exists
      if (currentPath) {
        await deleteIcon(currentPath);
      }

      const result = await uploadIcon(file);
      return result;
    } catch (err) {
      console.error("Error uploading icon:", err);
      setError(err instanceof Error ? err.message : "Gagal upload icon");
      return null;
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
    isMockMode,
    updateSettings,
    uploadNewLogo,
    uploadNewIcon,
    clearError,
  };
};

// Helper hooks
export const useVideoEmbed = (videoUrl: string) => {
  const videoId = extractYouTubeId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return {
    videoId,
    embedUrl,
    isValid: !!videoId,
  };
};

export const useWhatsAppLink = (phone: string, customMessage?: string) => {
  const link = generateWhatsAppLink(phone, customMessage || "");

  return {
    link,
    isValid: !!link,
  };
};
