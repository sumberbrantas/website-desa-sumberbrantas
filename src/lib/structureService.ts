import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, where, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, useMockData } from "./firebase";
import { canUploadFile } from "./storageService";

export interface StructureItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imagePath: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy: string;
  updatedBy: string;
}

export interface CreateStructureData {
  name: string;
  description: string;
  image: File;
  order: number;
  isActive: boolean;
  createdBy: string;
}

export interface UpdateStructureData {
  name?: string;
  description?: string;
  image?: File;
  order?: number;
  isActive?: boolean;
  updatedBy: string;
}

// Mock structure data
const mockStructures: StructureItem[] = [
  {
    id: "struct1",
    name: "Kepala Desa",
    description: "Ir. Budi Santoso - Memimpin pemerintahan desa sejak 2020",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    imagePath: "",
    order: 1,
    isActive: true,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    createdBy: "mock-uid",
    updatedBy: "mock-uid",
  },
  {
    id: "struct2",
    name: "Sekretaris Desa",
    description: "Dewi Kusuma - Mengelola administrasi dan dokumentasi desa",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    imagePath: "",
    order: 2,
    isActive: true,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    createdBy: "mock-uid",
    updatedBy: "mock-uid",
  },
  {
    id: "struct3",
    name: "Kaur Keuangan",
    description: "Ahmad Hidayat - Mengelola keuangan dan kas desa",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    imagePath: "",
    order: 3,
    isActive: true,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    createdBy: "mock-uid",
    updatedBy: "mock-uid",
  },
];

let storageRefreshCallback: (() => void) | null = null;

export const setStorageRefreshCallback = (callback: () => void) => {
  storageRefreshCallback = callback;
};

const refreshStorageStats = () => {
  if (storageRefreshCallback) {
    storageRefreshCallback();
  }
};

const uploadStructureImage = async (file: File, structureId?: string): Promise<{ url: string; path: string }> => {
  if (useMockData) {
    return { url: URL.createObjectURL(file), path: `mock/structures/${file.name}` };
  }

  try {
    if (!storage) throw new Error("Firebase Storage not configured");
    const storageCheck = await canUploadFile(file.size);
    if (!storageCheck.canUpload) {
      throw new Error(storageCheck.message);
    }

    const fileName = structureId ? `${structureId}.${file.name.split(".").pop()}` : `${Date.now()}_${file.name}`;
    const imagePath = `structures/${fileName}`;
    const imageRef = ref(storage, imagePath);

    const uploadResult = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);

    refreshStorageStats();

    return { url: downloadURL, path: imagePath };
  } catch (error) {
    console.error("Error uploading structure image:", error);
    throw error instanceof Error ? error : new Error("Failed to upload structure image");
  }
};

const deleteStructureImage = async (imagePath: string): Promise<void> => {
  if (useMockData) return;

  try {
    if (!storage) return;
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    refreshStorageStats();
  } catch (error) {
    console.error("Error deleting structure image:", error);
  }
};

export const createStructure = async (data: CreateStructureData): Promise<StructureItem> => {
  if (useMockData) {
    const now = new Date();
    const newItem: StructureItem = {
      id: `struct-${Date.now()}`,
      name: data.name,
      description: data.description,
      imageUrl: URL.createObjectURL(data.image),
      imagePath: `mock/structures/${data.image.name}`,
      order: data.order,
      isActive: data.isActive,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    };
    mockStructures.push(newItem);
    return newItem;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, "structures"), {
      name: data.name,
      description: data.description,
      imageUrl: "",
      imagePath: "",
      order: data.order,
      isActive: data.isActive,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });

    const { url, path } = await uploadStructureImage(data.image, docRef.id);
    await updateDoc(docRef, { imageUrl: url, imagePath: path });

    return {
      id: docRef.id,
      name: data.name,
      description: data.description,
      imageUrl: url,
      imagePath: path,
      order: data.order,
      isActive: data.isActive,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    };
  } catch (error) {
    console.error("Error creating structure:", error);
    throw new Error("Failed to create structure");
  }
};

export const getStructures = async (): Promise<StructureItem[]> => {
  if (useMockData) {
    return [...mockStructures].sort((a, b) => a.order - b.order);
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "structures"));
    const querySnapshot = await getDocs(q);

    const structures: StructureItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      structures.push({
        id: doc.id,
        name: data.name || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        order: data.order || 0,
        isActive: data.isActive ?? true,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || "",
        updatedBy: data.updatedBy || "",
      });
    });

    return structures.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error getting structures:", error);
    return [];
  }
};

export const getStructureById = async (id: string): Promise<StructureItem | null> => {
  if (useMockData) {
    return mockStructures.find(s => s.id === id) || null;
  }

  try {
    if (!db) return null;
    const docRef = doc(db, "structures", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name || "",
      description: data.description || "",
      imageUrl: data.imageUrl || "",
      imagePath: data.imagePath || "",
      order: data.order || 0,
      isActive: data.isActive ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy || "",
      updatedBy: data.updatedBy || "",
    };
  } catch (error) {
    console.error("Error getting structure:", error);
    throw new Error("Failed to get structure");
  }
};

export const updateStructure = async (id: string, data: UpdateStructureData): Promise<StructureItem> => {
  if (useMockData) {
    const index = mockStructures.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Structure not found");

    mockStructures[index] = {
      ...mockStructures[index],
      name: data.name ?? mockStructures[index].name,
      description: data.description ?? mockStructures[index].description,
      order: data.order ?? mockStructures[index].order,
      isActive: data.isActive ?? mockStructures[index].isActive,
      updatedAt: new Date(),
      updatedBy: data.updatedBy,
    };
    return mockStructures[index];
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "structures", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("Structure not found");

    const currentData = docSnap.data();
    let updateData: any = {
      updatedAt: Timestamp.now(),
      updatedBy: data.updatedBy,
    };

    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.image) {
      if (currentData.imagePath) await deleteStructureImage(currentData.imagePath);
      const { url, path } = await uploadStructureImage(data.image, id);
      updateData.imageUrl = url;
      updateData.imagePath = path;
    }

    await updateDoc(docRef, updateData);
    const updatedDoc = await getDoc(docRef);
    const updatedData = updatedDoc.data()!;

    return {
      id: updatedDoc.id,
      name: updatedData.name,
      description: updatedData.description,
      imageUrl: updatedData.imageUrl,
      imagePath: updatedData.imagePath,
      order: updatedData.order,
      isActive: updatedData.isActive,
      createdAt: updatedData.createdAt,
      updatedAt: updatedData.updatedAt,
      createdBy: updatedData.createdBy,
      updatedBy: updatedData.updatedBy,
    };
  } catch (error) {
    console.error("Error updating structure:", error);
    throw new Error("Failed to update structure");
  }
};

export const deleteStructure = async (id: string): Promise<void> => {
  if (useMockData) {
    const index = mockStructures.findIndex(s => s.id === id);
    if (index !== -1) mockStructures.splice(index, 1);
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "structures", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().imagePath) {
      await deleteStructureImage(docSnap.data().imagePath);
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting structure:", error);
    throw new Error("Failed to delete structure");
  }
};

export const getActiveStructures = async (): Promise<StructureItem[]> => {
  if (useMockData) {
    return mockStructures.filter(s => s.isActive).sort((a, b) => a.order - b.order);
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "structures"), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    const structures: StructureItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      structures.push({
        id: doc.id,
        name: data.name || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        order: data.order || 0,
        isActive: true,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || "",
        updatedBy: data.updatedBy || "",
      });
    });

    return structures.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error getting active structures:", error);
    return [];
  }
};
