import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db, useMockData } from "./firebase";
import {
  getMockMenus,
  addMockMenu,
  updateMockMenu,
  deleteMockMenu,
  mockMenus
} from "./mockData";

export interface MenuItem {
  id: string;
  name: string;
  href: string;
  icon?: string;
  order: number;
  isActive: boolean;
  isBuiltIn: boolean;
  targetBlank: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMenuData {
  name: string;
  href: string;
  icon?: string;
  order: number;
  isActive: boolean;
  targetBlank?: boolean;
}

export interface UpdateMenuData {
  name?: string;
  href?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  targetBlank?: boolean;
}

// Default menu items
const DEFAULT_MENU_ITEMS: Omit<MenuItem, "id">[] = [
  { name: "Beranda", href: "/", icon: "FiHome", order: 1, isActive: true, isBuiltIn: true, targetBlank: false },
  { name: "Profil Desa", href: "/profil-desa", icon: "FiInfo", order: 2, isActive: true, isBuiltIn: true, targetBlank: false },
  { name: "Berita", href: "/berita", icon: "FiFileText", order: 3, isActive: true, isBuiltIn: true, targetBlank: false },
  { name: "Pengumuman", href: "/pengumuman", icon: "FiBell", order: 4, isActive: true, isBuiltIn: true, targetBlank: false },
  { name: "Struktur", href: "/struktur", icon: "FiUsers", order: 5, isActive: true, isBuiltIn: true, targetBlank: false },
  { name: "Pelayanan", href: "/pelayanan", icon: "FiFilePlus", order: 6, isActive: true, isBuiltIn: true, targetBlank: false },
];

export const initializeDefaultMenus = async (): Promise<void> => {
  // No-op in mock mode
  if (useMockData) return;

  try {
    if (!db) return;
    const existingMenus = await getMenus(false);
    if (existingMenus.length === 0 || existingMenus.every(m => m.id.startsWith("default-"))) {
      // Create default menus
      for (const menu of DEFAULT_MENU_ITEMS) {
        await addDoc(collection(db, "menus"), {
          ...menu,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error initializing default menus:", error);
  }
};

export const getMenus = async (activeOnly: boolean = false): Promise<MenuItem[]> => {
  // Mock mode - return mock data
  if (useMockData) {
    const menus = getMockMenus();
    if (activeOnly) {
      return menus.filter(menu => menu.isActive);
    }
    return menus;
  }

  try {
    if (!db) {
      return DEFAULT_MENU_ITEMS.map((menu, index) => ({
        ...menu,
        id: `default-${index}`,
      }));
    }
    const menusRef = collection(db, "menus");
    const q = query(menusRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const menus: MenuItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      menus.push({
        id: doc.id,
        name: data.name,
        href: data.href,
        icon: data.icon,
        order: data.order,
        isActive: data.isActive,
        isBuiltIn: data.isBuiltIn || false,
        targetBlank: data.targetBlank || false,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      });
    });

    // If no menus exist, initialize defaults
    if (menus.length === 0) {
      await initializeDefaultMenus();
      return getMenus(activeOnly);
    }

    if (activeOnly) {
      return menus.filter(menu => menu.isActive);
    }

    return menus;
  } catch (error) {
    console.error("Error getting menus:", error);
    // Return default menus on error
    return DEFAULT_MENU_ITEMS.map((menu, index) => ({
      ...menu,
      id: `default-${index}`,
    }));
  }
};

export const getMenuById = async (id: string): Promise<MenuItem | null> => {
  // Mock mode
  if (useMockData) {
    return mockMenus.find(m => m.id === id) || null;
  }

  try {
    if (!db) return null;
    const docRef = doc(db, "menus", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        href: data.href,
        icon: data.icon,
        order: data.order,
        isActive: data.isActive,
        isBuiltIn: data.isBuiltIn || false,
        targetBlank: data.targetBlank || false,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting menu:", error);
    return null;
  }
};

export const createMenu = async (data: CreateMenuData): Promise<MenuItem> => {
  // Mock mode
  if (useMockData) {
    const newMenu = addMockMenu({
      name: data.name,
      href: data.href,
      icon: data.icon || "",
      order: data.order,
      isActive: data.isActive,
      isBuiltIn: false,
      targetBlank: data.targetBlank || false,
    });
    return newMenu as MenuItem;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = await addDoc(collection(db, "menus"), {
      name: data.name,
      href: data.href,
      icon: data.icon || "",
      order: data.order,
      isActive: data.isActive,
      isBuiltIn: false,
      targetBlank: data.targetBlank || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      id: docRef.id,
      name: data.name,
      href: data.href,
      icon: data.icon,
      order: data.order,
      isActive: data.isActive,
      isBuiltIn: false,
      targetBlank: data.targetBlank || false,
    };
  } catch (error) {
    console.error("Error creating menu:", error);
    throw new Error("Gagal membuat menu");
  }
};

export const updateMenu = async (id: string, data: UpdateMenuData): Promise<MenuItem> => {
  // Mock mode
  if (useMockData) {
    const updated = updateMockMenu(id, data as any);
    if (!updated) throw new Error("Menu tidak ditemukan");
    return updated as MenuItem;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "menus", id);

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.href !== undefined) updateData.href = data.href;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.targetBlank !== undefined) updateData.targetBlank = data.targetBlank;

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    const updatedData = updatedDoc.data()!;

    return {
      id: updatedDoc.id,
      name: updatedData.name,
      href: updatedData.href,
      icon: updatedData.icon,
      order: updatedData.order,
      isActive: updatedData.isActive,
      isBuiltIn: updatedData.isBuiltIn || false,
      targetBlank: updatedData.targetBlank || false,
    };
  } catch (error) {
    console.error("Error updating menu:", error);
    throw new Error("Gagal mengupdate menu");
  }
};

export const deleteMenu = async (id: string): Promise<void> => {
  // Mock mode
  if (useMockData) {
    const menu = mockMenus.find(m => m.id === id);
    if (menu?.isBuiltIn) {
      throw new Error("Menu bawaan tidak bisa dihapus");
    }
    deleteMockMenu(id);
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    // Check if menu is built-in
    const menu = await getMenuById(id);
    if (menu?.isBuiltIn) {
      throw new Error("Menu bawaan tidak bisa dihapus");
    }

    const docRef = doc(db, "menus", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error instanceof Error ? error : new Error("Gagal menghapus menu");
  }
};

export const reorderMenus = async (menuIds: string[]): Promise<void> => {
  // Mock mode - no-op for now
  if (useMockData) return;

  try {
    if (!db) throw new Error("Firebase not configured");
    const updates = menuIds.map(async (id, index) => {
      const docRef = doc(db!, "menus", id);
      await updateDoc(docRef, {
        order: index + 1,
        updatedAt: new Date(),
      });
    });

    await Promise.all(updates);
  } catch (error) {
    console.error("Error reordering menus:", error);
    throw new Error("Gagal mengurutkan menu");
  }
};

// Available icons for menu (React Icons)
export const AVAILABLE_ICONS = [
  { name: "FiHome", label: "Home" },
  { name: "FiInfo", label: "Info" },
  { name: "FiFileText", label: "File/Document" },
  { name: "FiBell", label: "Bell/Announcement" },
  { name: "FiUsers", label: "Users/Team" },
  { name: "FiFilePlus", label: "File Plus" },
  { name: "FiImage", label: "Image/Gallery" },
  { name: "FiMapPin", label: "Map Pin" },
  { name: "FiMap", label: "Map" },
  { name: "FiPhone", label: "Phone" },
  { name: "FiMail", label: "Mail" },
  { name: "FiGlobe", label: "Globe" },
  { name: "FiShoppingBag", label: "Shopping" },
  { name: "FiCoffee", label: "Coffee" },
  { name: "FiStar", label: "Star" },
  { name: "FiHeart", label: "Heart" },
  { name: "FiAward", label: "Award" },
  { name: "FiBook", label: "Book" },
  { name: "FiBriefcase", label: "Briefcase" },
  { name: "FiCompass", label: "Compass" },
];
