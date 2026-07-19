"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  mockVillageSettings,
  mockMenus,
  mockDocuments,
  mockAccommodations,
  mockDestinations,
  mockProducts,
} from "@/lib/mockData";
import {
  VillageSettings,
  MenuItem,
  Document,
  Accommodation,
  Destination,
  Product,
} from "@/lib/mockTypes";

/**
 * Mock Data Context Provider
 * Menggunakan mock data saat NEXT_PUBLIC_USE_MOCK_DATA=true
 * atau saat Firebase tidak dikonfigurasi
 */

interface MockDataContextType {
  // Settings
  settings: VillageSettings;
  updateSettings: (data: Partial<VillageSettings>) => void;

  // Menus
  menus: MenuItem[];
  addMenu: (menu: MenuItem) => void;
  updateMenu: (id: string, data: Partial<MenuItem>) => void;
  deleteMenu: (id: string) => void;

  // Documents
  documents: Document[];
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, data: Partial<Document>) => void;
  deleteDocument: (id: string) => void;

  // Accommodations
  accommodations: Accommodation[];
  addAccommodation: (acc: Accommodation) => void;
  updateAccommodation: (id: string, data: Partial<Accommodation>) => void;
  deleteAccommodation: (id: string) => void;

  // Destinations
  destinations: Destination[];
  addDestination: (dest: Destination) => void;
  updateDestination: (id: string, data: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;

  // Products
  products: Product[];
  addProduct: (prod: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Mode
  isMockMode: boolean;
}

const MockDataContext = createContext<MockDataContextType | null>(null);

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error("useMockData must be used within MockDataProvider");
  }
  return context;
};

interface MockDataProviderProps {
  children: ReactNode;
  forceMock?: boolean;
}

export const MockDataProvider: React.FC<MockDataProviderProps> = ({
  children,
  forceMock = false,
}) => {
  const [isMockMode, setIsMockMode] = useState(false);

  // State untuk semua data
  const [settings, setSettings] = useState<VillageSettings>(mockVillageSettings);
  const [menus, setMenus] = useState<MenuItem[]>(mockMenus);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [accommodations, setAccommodations] = useState<Accommodation[]>(mockAccommodations);
  const [destinations, setDestinations] = useState<Destination[]>(mockDestinations);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  useEffect(() => {
    // Cek apakah menggunakan mock data
    const checkMockMode = () => {
      if (forceMock) {
        setIsMockMode(true);
        return;
      }
      const mockEnabled =
        process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo";
      setIsMockMode(mockEnabled);
    };

    checkMockMode();
  }, [forceMock]);

  // Settings actions
  const updateSettings = (data: Partial<VillageSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }));
  };

  // Menu actions
  const addMenu = (menu: MenuItem) => {
    setMenus((prev) => [...prev, menu]);
  };

  const updateMenu = (id: string, data: Partial<MenuItem>) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
  };

  const deleteMenu = (id: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
  };

  // Document actions
  const addDocument = (doc: Document) => {
    setDocuments((prev) => [...prev, doc]);
  };

  const updateDocument = (id: string, data: Partial<Document>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Accommodation actions
  const addAccommodation = (acc: Accommodation) => {
    setAccommodations((prev) => [...prev, acc]);
  };

  const updateAccommodation = (id: string, data: Partial<Accommodation>) => {
    setAccommodations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  };

  const deleteAccommodation = (id: string) => {
    setAccommodations((prev) => prev.filter((a) => a.id !== id));
  };

  // Destination actions
  const addDestination = (dest: Destination) => {
    setDestinations((prev) => [...prev, dest]);
  };

  const updateDestination = (id: string, data: Partial<Destination>) => {
    setDestinations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );
  };

  const deleteDestination = (id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  // Product actions
  const addProduct = (prod: Product) => {
    setProducts((prev) => [...prev, prod]);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const value: MockDataContextType = {
    settings,
    updateSettings,
    menus,
    addMenu,
    updateMenu,
    deleteMenu,
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    accommodations,
    addAccommodation,
    updateAccommodation,
    deleteAccommodation,
    destinations,
    addDestination,
    updateDestination,
    deleteDestination,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    isMockMode,
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
};

// Hook untuk cek mode
export const useIsMockMode = () => {
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    const mockEnabled =
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo";
    setIsMockMode(mockEnabled);
  }, []);

  return isMockMode;
};
