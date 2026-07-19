import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, useMockData } from "./firebase";
import { uploadToImgbb } from "./imgbbService";
import { mockVillageSettings, mockUpdateVillageSettings } from "./mockData";

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
}

export interface VillageSettings {
  // Basic Info
  villageName: string;
  villageTagline: string;
  villageDescription?: string;

  // Branding
  logoUrl: string;
  iconUrl: string;

  // Video
  videoUrl: string; // YouTube embed URL

  // Contact
  whatsappNumber: string;
  whatsappMessage?: string;
  address: string;
  email: string;
  phone?: string;

  // Social Links
  socialLinks: SocialLinks;

  // WhatsApp for Accommodations
  accommodationWhatsapp?: string;
  accommodationWhatsappMessage?: string;
}

const VILLAGE_SETTINGS_DOC = "settings";

const DEFAULT_SETTINGS: VillageSettings = {
  villageName: "Desa Sumberbrantas",
  villageTagline: "Kecamatan Bumiaji, Kota Batu",
  villageDescription: "",
  logoUrl: "",
  iconUrl: "",
  videoUrl: "",
  whatsappNumber: "",
  whatsappMessage: "Halo, saya tertarik dengan produk dari desa ini.",
  address: "",
  email: "",
  phone: "",
  socialLinks: {},
  accommodationWhatsapp: "",
  accommodationWhatsappMessage: "Halo, saya mau booking penginapan di desa ini.",
};

export const getVillageSettings = async (): Promise<VillageSettings> => {
  // Check if mock mode
  if (useMockData) {
    return mockVillageSettings;
  }

  try {
    if (!db) {
      return DEFAULT_SETTINGS;
    }
    const docRef = doc(db, "village_settings", VILLAGE_SETTINGS_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...DEFAULT_SETTINGS,
        ...docSnap.data(),
      } as VillageSettings;
    } else {
      // Create default settings if not exists
      await setDoc(docRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("Error getting village settings:", error);
    return DEFAULT_SETTINGS;
  }
};

export const updateVillageSettings = async (data: Partial<VillageSettings>): Promise<VillageSettings> => {
  // Check if mock mode
  if (useMockData) {
    return mockUpdateVillageSettings(data);
  }

  try {
    if (!db) {
      throw new Error("Firebase not configured");
    }
    const docRef = doc(db, "village_settings", VILLAGE_SETTINGS_DOC);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Create with default + new data
      const newSettings = { ...DEFAULT_SETTINGS, ...data };
      await setDoc(docRef, newSettings);
      return newSettings as VillageSettings;
    }

    // Update existing
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });

    // Get updated data
    const updatedSnap = await getDoc(docRef);
    return {
      ...DEFAULT_SETTINGS,
      ...updatedSnap.data(),
    } as VillageSettings;
  } catch (error) {
    console.error("Error updating village settings:", error);
    throw new Error("Gagal menyimpan pengaturan");
  }
};

// Logo upload - using imgbb
export const uploadLogo = async (file: File): Promise<{ url: string; path: string }> => {
  if (useMockData) {
    return { url: URL.createObjectURL(file), path: `mock/branding/${file.name}` };
  }

  try {
    // Use imgbb for image hosting (free tier)
    const result = await uploadToImgbb(file);
    return { url: result.url, path: result.url };
  } catch (error) {
    console.error("Error uploading logo to imgbb:", error);
    throw error instanceof Error ? error : new Error("Gagal upload logo");
  }
};

// Icon upload - using imgbb
export const uploadIcon = async (file: File): Promise<{ url: string; path: string }> => {
  if (useMockData) {
    return { url: URL.createObjectURL(file), path: `mock/branding/${file.name}` };
  }

  try {
    // Use imgbb for image hosting (free tier)
    const result = await uploadToImgbb(file);
    return { url: result.url, path: result.url };
  } catch (error) {
    console.error("Error uploading icon to imgbb:", error);
    throw error instanceof Error ? error : new Error("Gagal upload icon");
  }
};

// Delete old logo - no-op for imgbb
export const deleteLogo = async (path: string): Promise<void> => {
  // imgbb images are managed by imgbb, no deletion needed
  console.log("Image deletion not needed for imgbb URLs:", path);
};

// Delete old icon - no-op for imgbb
export const deleteIcon = async (path: string): Promise<void> => {
  // imgbb images are managed by imgbb, no deletion needed
  console.log("Image deletion not needed for imgbb URLs:", path);
};

// Helper: Extract YouTube video ID
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

// Helper: Generate WhatsApp link
export const generateWhatsAppLink = (phone: string, message: string): string | null => {
  if (!phone) return null;

  // Normalize phone number
  let normalizedPhone = phone.replace(/[^0-9]/g, "");

  // Add country code if not present (Indonesia: 62)
  if (normalizedPhone.startsWith("0")) {
    normalizedPhone = "62" + normalizedPhone.substring(1);
  }

  if (!normalizedPhone.startsWith("62")) {
    normalizedPhone = "62" + normalizedPhone;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
};

// Helper: Format phone for display
export const formatPhone = (phone: string): string => {
  if (!phone) return "";

  let normalized = phone.replace(/[^0-9]/g, "");

  if (normalized.startsWith("62")) {
    normalized = "0" + normalized.substring(2);
  }

  // Format: 0812-3456-7890
  if (normalized.length >= 10) {
    return normalized.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
  }

  return phone;
};
