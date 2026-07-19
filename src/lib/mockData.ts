/**
 * Mock Data untuk Development Lokal
 * Tidak menggunakan Firebase - data diambil dari file ini
 * Data di-persist menggunakan localStorage agar tetap ada setelah refresh
 *
 * Untuk menggunakan mock data:
 * 1. Set NEXT_PUBLIC_USE_MOCK_DATA=true di .env.local
 * 2. Atau biarkan default (akan menggunakan mock data jika Firebase tidak dikonfigurasi)
 */

import { VillageSettings, MenuItem, Document, Accommodation, Destination, Product } from "./mockTypes";
import { VillageSettings as VillageSettingsType } from "./villageSettingsService";

// LocalStorage Keys
const STORAGE_KEYS = {
  VILLAGE_SETTINGS: 'mock_village_settings',
  MENUS: 'mock_menus',
  DOCUMENTS: 'mock_documents',
  ACCOMMODATIONS: 'mock_accommodations',
  DESTINATIONS: 'mock_destinations',
  PRODUCTS: 'mock_products',
} as const;

// Default data (fallback)
const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: "1", name: "Beranda", href: "/", icon: "FiHome", order: 1, isActive: true, isBuiltIn: true, targetBlank: false },
  { id: "2", name: "Profil Desa", href: "/profil-desa", icon: "FiInfo", order: 2, isActive: true, isBuiltIn: true, targetBlank: false },
  { id: "3", name: "Berita", href: "/berita", icon: "FiFileText", order: 3, isActive: true, isBuiltIn: true, targetBlank: false },
  { id: "4", name: "Pengumuman", href: "/pengumuman", icon: "FiBell", order: 4, isActive: true, isBuiltIn: true, targetBlank: false },
  { id: "5", name: "Struktur", href: "/struktur", icon: "FiUsers", order: 5, isActive: true, isBuiltIn: true, targetBlank: false },
  { id: "6", name: "Galeri", href: "/galeri", icon: "FiImage", order: 6, isActive: true, isBuiltIn: true, targetBlank: false },
  { id: "7", name: "Pelayanan", href: "/pelayanan", icon: "FiFile", order: 7, isActive: false, isBuiltIn: true, targetBlank: false },
  { id: "8", name: "Dokumen", href: "/documents", icon: "FiDownload", order: 8, isActive: true, isBuiltIn: false, targetBlank: false },
  { id: "9", name: "Penginapan", href: "/accommodations", icon: "FiHome", order: 9, isActive: true, isBuiltIn: false, targetBlank: false },
  { id: "10", name: "Destinasi", href: "/destinations", icon: "FiMapPin", order: 10, isActive: true, isBuiltIn: false, targetBlank: false },
  { id: "11", name: "Produk UMKM", href: "/products", icon: "FiShoppingBag", order: 11, isActive: true, isBuiltIn: false, targetBlank: false },
];

const DEFAULT_VILLAGE_SETTINGS: VillageSettings = {
  villageName: "Desa Sumberbrantas",
  villageTagline: "Kampung Damai & Budaya Luhur",
  logoUrl: "/logo-mmd.png",
  iconUrl: "/favicon.ico",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  whatsappNumber: "6281234567890",
  whatsappMessage: "Halo, saya ingin bertanya tentang Desa Sumberbrantas",
  address: "Desa Sumberbrantas, Kecamatan Sumberpucung, Kabupaten Malang, Jawa Timur 65163",
  email: "desatasourcebrantas@email.com",
  phone: "0341-123-456",
  socialLinks: {
    instagram: "https://instagram.com/sumberbrantas",
    facebook: "https://facebook.com/sumberbrantas",
    youtube: "https://youtube.com/@sumberbrantas",
  },
  accommodationWhatsapp: "6281234567890",
  accommodationWhatsappMessage: "Halo, saya mau booking penginapan di Desa Sumberbrantas",
};

const DEFAULT_DOCUMENTS: Document[] = [
  {
    id: "doc1",
    title: "Profil Desa Sumberbrantas 2025",
    category: "Profil Desa",
    description: "Dokumen profil lengkap desa meliputi sejarah, geografi, dan demografi",
    fileUrl: "https://drive.google.com/file/d/1example/view",
    fileName: "Profil_Desa_2025.pdf",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "doc2",
    title: "Peta Potensi Desa",
    category: "Peta Potensi",
    description: "Peta sebaran potensi desa meliputi pertanian, wisata, dan UMKM",
    fileUrl: "https://drive.google.com/file/d/2example/view",
    fileName: "Peta_Potensi.pdf",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "doc3",
    title: "Buku Panduan Wisata",
    category: "Destinasi Wisata",
    description: "Panduan lengkap tempat wisata di Desa Sumberbrantas",
    fileUrl: "https://drive.google.com/file/d/3example/view",
    fileName: "Panduan_Wisata.pdf",
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "doc4",
    title: "Formulir Permohonan Surat",
    category: "Layanan",
    description: "Formulir untuk pengajuan surat keterangan dan domisili",
    fileUrl: "https://drive.google.com/file/d/4example/view",
    fileName: "Formulir_Surat.pdf",
    isActive: true,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
];

const DEFAULT_ACCOMMODATIONS: Accommodation[] = [
  {
    id: "acc1",
    name: "Wisma Wisata Sumberbrantas",
    description: "Penginapan nyaman dengan suasana pedesaan yang asri. Cocok untuk keluarga dan kelompok wisata.",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    imagePath: "",
    location: "Jl. Desa No. 5, Sumberbrantas",
    priceRange: "Rp 150.000 - 350.000/malam",
    whatsappNumber: "6281234567890",
    whatsappMessage: "Halo, saya mau booking Wisma Wisata Sumberbrantas",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "acc2",
    name: "Homestay Pak Rahmat",
    description: "Homestay sederhana dengan dapur bersama. Experience otentik kehidupan pedesaan Jawa.",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    imagePath: "",
    location: "Dusun Krajan, Sumberbrantas",
    priceRange: "Rp 75.000 - 150.000/malam",
    whatsappNumber: "6281234567890",
    whatsappMessage: "",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "acc3",
    name: "Villa Alam Damai",
    description: "Villa私人 dengan pemandangan sawah dan pegunungan. Fasilitas lengkap untuk keluarga.",
    imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
    imagePath: "",
    location: "Jl. Pendakian, Sumberbrantas",
    priceRange: "Rp 500.000 - 1.200.000/malam",
    whatsappNumber: "6281234567890",
    whatsappMessage: "",
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
];

const DEFAULT_DESTINATIONS: Destination[] = [
  {
    id: "dest1",
    name: "Air Terjun Sumber Widuri",
    description: "Air terjun cantik dengan ketinggian 15 meter, dikelilingi hutan tropis yang asri. Spot foto yang Instagramable!",
    imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
    imagePath: "",
    location: "Dusun Duren, Sumberbrantas",
    category: "Wisata Alam",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "dest2",
    name: "Kebun Teh Sumberpucung",
    description: "Hamparan kebun teh hijau membentang luas dengan udara sejuk pegunungan. Cocok untuk tracking dan fotografi.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    imagePath: "",
    location: "Kaki Gunung Arjuno, Sumberbrantas",
    category: "Wisata Alam",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "dest3",
    name: "Museum Kayu Tradisional",
    description: "Museum unik yang menyimpan koleksi alat musik dan peralatan rumah tangga khas Jawa tempo dulu.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    imagePath: "",
    location: "Jl. Utama, Sumberbrantas",
    category: "Wisata Budaya",
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "dest4",
    name: "Spot Glamping Lembah Hijau",
    description: "Pengalaman glamping di lembah dengan pemandangan spektakuler. Dilengkapi tenda premium dan api unggun.",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
    imagePath: "",
    location: "Lembah Hijau, Sumberbrantas",
    category: "Wisata Alam",
    isActive: true,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod1",
    name: "Keripik Singkong Original",
    description: "Keripik singkong renyah dengan bumbu original khas Jawa. Dibuat dari singkong pilihan新鲜的.",
    price: 25000,
    imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800",
    imagePath: "",
    category: "Kuliner",
    whatsappMessage: "Halo, saya mau pesan Keripik Singkong Original",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "prod2",
    name: "Kopi Robusta Sumberbrantas",
    description: "Kopi arabika premium dari dataran tinggi. Diproses tradisional dengan rasa yang kaya dan aromatic.",
    price: 45000,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
    imagePath: "",
    category: "Kuliner",
    whatsappMessage: "Halo, saya mau pesan Kopi Robusta Sumberbrantas",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "prod3",
    name: "Batik Desa Sumberbrantas",
    description: "Batik tulis dengan motif khas desa yang unik. Dibuat oleh pengrajin lokal dengan kualitas premium.",
    price: 350000,
    imageUrl: "https://images.unsplash.com/photo-1583302355372-acd85af25ed5?w=800",
    imagePath: "",
    category: "Fashion",
    whatsappMessage: "Halo, saya mau pesan Batik Desa Sumberbrantas",
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "prod4",
    name: "Kerajinan Bambu Hias",
    description: "Berbagai kerajinan bambu inovatif seperti lampu, vas, dan aksesoris rumah. Eco-friendly!",
    price: 75000,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    imagePath: "",
    category: "Kerajinan",
    whatsappMessage: "Halo, saya mau pesan Kerajinan Bambu Hias",
    isActive: true,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "prod5",
    name: "Sayuran Organik Koptan",
    description: "Sayuran segar hasil pertanian organik Koptan Sumberbrantas. Bebas pestisida dan chemical.",
    price: 15000,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800",
    imagePath: "",
    category: "Agribisnis",
    whatsappMessage: "Halo, saya mau pesan Sayuran Organik Koptan",
    isActive: true,
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "prod6",
    name: "Layanan Tour Guide Lokal",
    description: "Jasa pemandu wisata lokal yang mengenal desa dengan baik. Include transportasi dan makanan.",
    price: 250000,
    imageUrl: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800",
    imagePath: "",
    category: "Jasa",
    whatsappMessage: "Halo, saya mau booking Tour Guide Lokal",
    isActive: true,
    order: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "system",
  },
];

// localStorage helper functions
const isBrowser = typeof window !== 'undefined';

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser) return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

const saveToStorage = <T>(key: string, data: T): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Village Settings - Load from localStorage
export let mockVillageSettings: VillageSettings = loadFromStorage(STORAGE_KEYS.VILLAGE_SETTINGS, DEFAULT_VILLAGE_SETTINGS);

// Menu Items - Load from localStorage
export let mockMenus: MenuItem[] = loadFromStorage(STORAGE_KEYS.MENUS, DEFAULT_MENU_ITEMS);

// Documents - Load from localStorage
export let mockDocuments: Document[] = loadFromStorage(STORAGE_KEYS.DOCUMENTS, DEFAULT_DOCUMENTS);

// Accommodations - Load from localStorage
export let mockAccommodations: Accommodation[] = loadFromStorage(STORAGE_KEYS.ACCOMMODATIONS, DEFAULT_ACCOMMODATIONS);

// Destinations - Load from localStorage
export let mockDestinations: Destination[] = loadFromStorage(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS);

// Products - Load from localStorage
export let mockProducts: Product[] = loadFromStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);

// Helper function untuk delay simulasi
export const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function untuk format file size
export const formatMockFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Update village settings
export const mockUpdateVillageSettings = (data: Partial<VillageSettingsType>): VillageSettingsType => {
  console.log("[mockData] Before update, mockVillageSettings:", mockVillageSettings);
  mockVillageSettings = { ...mockVillageSettings, ...data };
  console.log("[mockData] After update, mockVillageSettings:", mockVillageSettings);
  saveToStorage(STORAGE_KEYS.VILLAGE_SETTINGS, mockVillageSettings);
  console.log("[mockData] Saved to localStorage:", STORAGE_KEYS.VILLAGE_SETTINGS);
  return mockVillageSettings;
};

// CRUD operations for mock data

// Menus
export const getMockMenus = () => [...mockMenus];
export const addMockMenu = (menu: Omit<MenuItem, "id">) => {
  const newMenu = { ...menu, id: `mock-${Date.now()}` };
  mockMenus.push(newMenu);
  saveToStorage(STORAGE_KEYS.MENUS, mockMenus);
  return newMenu;
};
export const updateMockMenu = (id: string, data: Partial<MenuItem>) => {
  const index = mockMenus.findIndex(m => m.id === id);
  if (index !== -1) {
    mockMenus[index] = { ...mockMenus[index], ...data };
    saveToStorage(STORAGE_KEYS.MENUS, mockMenus);
    return mockMenus[index];
  }
  return null;
};
export const deleteMockMenu = (id: string) => {
  const index = mockMenus.findIndex(m => m.id === id);
  if (index !== -1) {
    mockMenus.splice(index, 1);
    saveToStorage(STORAGE_KEYS.MENUS, mockMenus);
    return true;
  }
  return false;
};

// Documents
export const getMockDocuments = () => [...mockDocuments];
export const addMockDocument = (doc: Omit<Document, "id">) => {
  const newDoc = { ...doc, id: `mock-doc-${Date.now()}` };
  mockDocuments.push(newDoc);
  saveToStorage(STORAGE_KEYS.DOCUMENTS, mockDocuments);
  return newDoc;
};
export const updateMockDocument = (id: string, data: Partial<Document>) => {
  const index = mockDocuments.findIndex(d => d.id === id);
  if (index !== -1) {
    mockDocuments[index] = { ...mockDocuments[index], ...data };
    saveToStorage(STORAGE_KEYS.DOCUMENTS, mockDocuments);
    return mockDocuments[index];
  }
  return null;
};
export const deleteMockDocument = (id: string) => {
  const index = mockDocuments.findIndex(d => d.id === id);
  if (index !== -1) {
    mockDocuments.splice(index, 1);
    saveToStorage(STORAGE_KEYS.DOCUMENTS, mockDocuments);
    return true;
  }
  return false;
};

// Accommodations
export const getMockAccommodations = () => [...mockAccommodations];
export const addMockAccommodation = (acc: Omit<Accommodation, "id">) => {
  const newAcc = { ...acc, id: `mock-acc-${Date.now()}` };
  mockAccommodations.push(newAcc);
  saveToStorage(STORAGE_KEYS.ACCOMMODATIONS, mockAccommodations);
  return newAcc;
};
export const updateMockAccommodation = (id: string, data: Partial<Accommodation>) => {
  const index = mockAccommodations.findIndex(a => a.id === id);
  if (index !== -1) {
    mockAccommodations[index] = { ...mockAccommodations[index], ...data };
    saveToStorage(STORAGE_KEYS.ACCOMMODATIONS, mockAccommodations);
    return mockAccommodations[index];
  }
  return null;
};
export const deleteMockAccommodation = (id: string) => {
  const index = mockAccommodations.findIndex(a => a.id === id);
  if (index !== -1) {
    mockAccommodations.splice(index, 1);
    saveToStorage(STORAGE_KEYS.ACCOMMODATIONS, mockAccommodations);
    return true;
  }
  return false;
};

// Destinations
export const getMockDestinations = () => [...mockDestinations];
export const addMockDestination = (dest: Omit<Destination, "id">) => {
  const newDest = { ...dest, id: `mock-dest-${Date.now()}` };
  mockDestinations.push(newDest);
  saveToStorage(STORAGE_KEYS.DESTINATIONS, mockDestinations);
  return newDest;
};
export const updateMockDestination = (id: string, data: Partial<Destination>) => {
  const index = mockDestinations.findIndex(d => d.id === id);
  if (index !== -1) {
    mockDestinations[index] = { ...mockDestinations[index], ...data };
    saveToStorage(STORAGE_KEYS.DESTINATIONS, mockDestinations);
    return mockDestinations[index];
  }
  return null;
};
export const deleteMockDestination = (id: string) => {
  const index = mockDestinations.findIndex(d => d.id === id);
  if (index !== -1) {
    mockDestinations.splice(index, 1);
    saveToStorage(STORAGE_KEYS.DESTINATIONS, mockDestinations);
    return true;
  }
  return false;
};

// Products
export const getMockProducts = () => [...mockProducts];
export const addMockProduct = (prod: Omit<Product, "id">) => {
  const newProd = { ...prod, id: `mock-prod-${Date.now()}` };
  mockProducts.push(newProd);
  saveToStorage(STORAGE_KEYS.PRODUCTS, mockProducts);
  return newProd;
};
export const updateMockProduct = (id: string, data: Partial<Product>) => {
  const index = mockProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...data };
    saveToStorage(STORAGE_KEYS.PRODUCTS, mockProducts);
    return mockProducts[index];
  }
  return null;
};
export const deleteMockProduct = (id: string) => {
  const index = mockProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProducts.splice(index, 1);
    saveToStorage(STORAGE_KEYS.PRODUCTS, mockProducts);
    return true;
  }
  return false;
};

// Function to reset all mock data to defaults
export const resetMockData = () => {
  mockVillageSettings = DEFAULT_VILLAGE_SETTINGS;
  mockMenus = DEFAULT_MENU_ITEMS;
  mockDocuments = DEFAULT_DOCUMENTS;
  mockAccommodations = DEFAULT_ACCOMMODATIONS;
  mockDestinations = DEFAULT_DESTINATIONS;
  mockProducts = DEFAULT_PRODUCTS;

  saveToStorage(STORAGE_KEYS.VILLAGE_SETTINGS, mockVillageSettings);
  saveToStorage(STORAGE_KEYS.MENUS, mockMenus);
  saveToStorage(STORAGE_KEYS.DOCUMENTS, mockDocuments);
  saveToStorage(STORAGE_KEYS.ACCOMMODATIONS, mockAccommodations);
  saveToStorage(STORAGE_KEYS.DESTINATIONS, mockDestinations);
  saveToStorage(STORAGE_KEYS.PRODUCTS, mockProducts);
};
