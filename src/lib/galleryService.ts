import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, where, getDoc, Timestamp, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, useMockData } from "@/lib/firebase";
import { canUploadFile } from "./storageService";

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imagePath: string;
  category?: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy: string;
  updatedBy: string;
}

export interface CreateGalleryImageData {
  title: string;
  description?: string;
  image: File;
  category?: string;
  isActive: boolean;
  order: number;
  createdBy: string;
}

export interface UpdateGalleryImageData {
  title?: string;
  description?: string;
  image?: File;
  category?: string;
  isActive?: boolean;
  order?: number;
  updatedBy: string;
}

// Mock gallery images
const mockGalleryImages: GalleryImage[] = [
  {
    id: "gallery1",
    title: "Pemandangan Desa Sumberbrantas",
    description: "Hamparan sawah dan pegunungan di Desa Sumberbrantas",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    imagePath: "",
    category: "Pemandangan",
    isActive: true,
    order: 1,
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
    createdBy: "mock-uid",
    updatedBy: "mock-uid",
  },
  {
    id: "gallery2",
    title: "Kerajinan Bambu Lokal",
    description: "Proses pembuatan kerajinan bambu oleh pengrajin lokal",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    imagePath: "",
    category: "Kerajinan",
    isActive: true,
    order: 2,
    createdAt: new Date("2025-01-08"),
    updatedAt: new Date("2025-01-08"),
    createdBy: "mock-uid",
    updatedBy: "mock-uid",
  },
  {
    id: "gallery3",
    title: "Festival Budaya Desa",
    description: "Pertunjukan seni tradisional pada festival desa",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    imagePath: "",
    category: "Budaya",
    isActive: true,
    order: 3,
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05"),
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

export const uploadGalleryImage = async (file: File, imageId?: string): Promise<{ url: string; path: string }> => {
  if (useMockData) {
    return { url: URL.createObjectURL(file), path: `mock/gallery/${file.name}` };
  }

  try {
    if (!storage) throw new Error("Firebase Storage not configured");
    const storageCheck = await canUploadFile(file.size);
    if (!storageCheck.canUpload) {
      throw new Error(storageCheck.message || "Storage penuh!");
    }

    const fileName = `${Date.now()}_${file.name}`;
    const imagePath = `gallery/${imageId || "temp"}_${fileName}`;
    const imageRef = ref(storage, imagePath);

    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    refreshStorageStats();

    return { url: downloadURL, path: imagePath };
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image");
  }
};

export const deleteGalleryImage = async (imagePath: string): Promise<void> => {
  if (useMockData) return;

  try {
    if (!storage) return;
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    refreshStorageStats();
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw new Error("Failed to delete image");
  }
};

export const createGalleryImage = async (data: CreateGalleryImageData): Promise<GalleryImage> => {
  if (useMockData) {
    const now = new Date();
    const newImage: GalleryImage = {
      id: `gallery-${Date.now()}`,
      title: data.title,
      description: data.description || "",
      imageUrl: URL.createObjectURL(data.image),
      imagePath: `mock/gallery/${data.image.name}`,
      category: data.category || "umum",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    };
    mockGalleryImages.push(newImage);
    return newImage;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, "gallery"), {
      title: data.title,
      description: data.description || "",
      imageUrl: "",
      imagePath: "",
      category: data.category || "umum",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });

    const { url, path } = await uploadGalleryImage(data.image, docRef.id);
    await updateDoc(docRef, { imageUrl: url, imagePath: path });

    return {
      id: docRef.id,
      title: data.title,
      description: data.description || "",
      imageUrl: url,
      imagePath: path,
      category: data.category || "umum",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    };
  } catch (error) {
    console.error("Error creating gallery image:", error);
    throw new Error("Failed to create gallery image");
  }
};

export const getGalleryImages = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: "all" | "active" | "inactive"
): Promise<{ images: GalleryImage[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  if (useMockData) {
    let imgs = [...mockGalleryImages];
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      imgs = imgs.filter(i => i.isActive === isActive);
    }
    return { images: imgs.slice(0, pageSize), lastVisible: null };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    let q;
    if (lastDoc) {
      q = query(collection(db, "gallery"), orderBy("updatedAt", "desc"), startAfter(lastDoc), limit(pageSize * 2));
    } else {
      q = query(collection(db, "gallery"), orderBy("updatedAt", "desc"), limit(pageSize * 2));
    }

    const querySnapshot = await getDocs(q);
    const allImages: GalleryImage[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allImages.push({
        id: doc.id,
        title: data.title,
        description: data.description || "",
        imageUrl: data.imageUrl,
        imagePath: data.imagePath,
        category: data.category || "umum",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy,
        updatedBy: data.updatedBy,
      });
    });

    let filteredImages = allImages;
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filteredImages = allImages.filter((image) => image.isActive === isActive);
    }

    return { images: filteredImages.slice(0, pageSize), lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null };
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    throw new Error("Gagal memuat galeri.");
  }
};

export const getGalleryImageById = async (id: string): Promise<GalleryImage | null> => {
  if (useMockData) {
    return mockGalleryImages.find(i => i.id === id) || null;
  }

  try {
    if (!db) return null;
    const docRef = doc(db, "gallery", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      imagePath: data.imagePath,
      category: data.category,
      isActive: data.isActive,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    throw new Error("Failed to fetch gallery image");
  }
};

export const updateGalleryImage = async (id: string, data: UpdateGalleryImageData): Promise<GalleryImage> => {
  if (useMockData) {
    const index = mockGalleryImages.findIndex(i => i.id === id);
    if (index === -1) throw new Error("Gallery image not found");

    mockGalleryImages[index] = {
      ...mockGalleryImages[index],
      title: data.title ?? mockGalleryImages[index].title,
      description: data.description ?? mockGalleryImages[index].description,
      category: data.category ?? mockGalleryImages[index].category,
      isActive: data.isActive ?? mockGalleryImages[index].isActive,
      order: data.order ?? mockGalleryImages[index].order,
      updatedAt: new Date(),
      updatedBy: data.updatedBy,
    };
    return mockGalleryImages[index];
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "gallery", id);
    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) throw new Error("Gallery image not found");

    const currentData = currentDoc.data();
    let updateData: any = { updatedAt: Timestamp.now(), updatedBy: data.updatedBy };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.order !== undefined) updateData.order = data.order;

    if (data.image) {
      if (currentData.imagePath) await deleteGalleryImage(currentData.imagePath);
      const { url, path } = await uploadGalleryImage(data.image, id);
      updateData.imageUrl = url;
      updateData.imagePath = path;
    }

    await updateDoc(docRef, updateData);
    const updatedDoc = await getDoc(docRef);
    const updatedData = updatedDoc.data()!;

    return {
      id: updatedDoc.id,
      title: updatedData.title,
      description: updatedData.description,
      imageUrl: updatedData.imageUrl,
      imagePath: updatedData.imagePath,
      category: updatedData.category,
      isActive: updatedData.isActive,
      order: updatedData.order,
      createdAt: updatedData.createdAt,
      updatedAt: updatedData.updatedAt,
      createdBy: updatedData.createdBy,
      updatedBy: updatedData.updatedBy,
    };
  } catch (error) {
    console.error("Error updating gallery image:", error);
    throw new Error("Failed to update gallery image");
  }
};

export const deleteGalleryImageById = async (id: string): Promise<void> => {
  if (useMockData) {
    const index = mockGalleryImages.findIndex(i => i.id === id);
    if (index !== -1) mockGalleryImages.splice(index, 1);
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "gallery", id);
    const currentDoc = await getDoc(docRef);
    if (currentDoc.exists() && currentDoc.data().imagePath) {
      await deleteGalleryImage(currentDoc.data().imagePath);
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw new Error("Failed to delete gallery image");
  }
};

export const getActiveGalleryImages = async (limitCount?: number): Promise<GalleryImage[]> => {
  if (useMockData) {
    const imgs = mockGalleryImages.filter(i => i.isActive);
    imgs.sort((a, b) => {
      const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date();
      const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date();
      return dateB.getTime() - dateA.getTime();
    });
    return limitCount ? imgs.slice(0, limitCount) : imgs;
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "gallery"));
    const querySnapshot = await getDocs(q);
    const images: GalleryImage[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.isActive === true) {
        images.push({
          id: doc.id,
          title: data.title || "Untitled",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          imagePath: data.imagePath || "",
          category: data.category || "umum",
          isActive: true,
          order: data.order || 0,
          createdAt: data.createdAt || data.updatedAt,
          updatedAt: data.updatedAt,
          createdBy: data.createdBy || data.updatedBy || "",
          updatedBy: data.updatedBy || "",
        });
      }
    });

    images.sort((a, b) => {
      const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt as any);
      const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt as any);
      return dateB.getTime() - dateA.getTime();
    });

    return limitCount ? images.slice(0, limitCount) : images;
  } catch (error) {
    console.error("Error fetching active gallery images:", error);
    return [];
  }
};

export const getGalleryImagesWithPagination = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all"): Promise<{ images: GalleryImage[]; totalPages: number; totalItems: number }> => {
  if (useMockData) {
    let imgs = [...mockGalleryImages];
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      imgs = imgs.filter(i => i.isActive === isActive);
    }
    const totalItems = imgs.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (page - 1) * pageSize;
    return { images: imgs.slice(offset, offset + pageSize), totalPages, totalItems };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const q = query(collection(db, "gallery"), orderBy("updatedAt", "desc"));
    const totalSnapshot = await getDocs(q);
    const allImages: GalleryImage[] = [];

    totalSnapshot.forEach((doc) => {
      const data = doc.data();
      allImages.push({
        id: doc.id,
        title: data.title || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        category: data.category || "umum",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy || "",
        updatedBy: data.updatedBy || "",
      });
    });

    let filteredImages = allImages;
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filteredImages = allImages.filter((image) => image.isActive === isActive);
    }

    const totalItems = filteredImages.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedImages = filteredImages.slice((page - 1) * pageSize, page * pageSize);

    return { images: paginatedImages, totalPages, totalItems };
  } catch (error) {
    console.error("Error fetching gallery images with pagination:", error);
    throw new Error("Gagal memuat gambar galeri");
  }
};

export const getGalleryImageCountByStatus = async (statusFilter: "all" | "active" | "inactive" = "all"): Promise<number> => {
  if (useMockData) {
    if (statusFilter === "all") return mockGalleryImages.length;
    const isActive = statusFilter === "active";
    return mockGalleryImages.filter(i => i.isActive === isActive).length;
  }

  try {
    if (!db) return 0;
    const q = query(collection(db, "gallery"));
    const snapshot = await getDocs(q);
    if (statusFilter === "all") return snapshot.size;

    const isActive = statusFilter === "active";
    let count = 0;
    snapshot.forEach((doc) => {
      if ((doc.data().isActive ?? true) === isActive) count++;
    });
    return count;
  } catch (error) {
    return 0;
  }
};

export const searchGalleryImages = async (searchTerm: string): Promise<GalleryImage[]> => {
  if (useMockData) {
    const term = searchTerm.toLowerCase();
    return mockGalleryImages.filter(img =>
      img.title.toLowerCase().includes(term) ||
      (img.description && img.description.toLowerCase().includes(term)) ||
      (img.category && img.category.toLowerCase().includes(term))
    );
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const results: GalleryImage[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (data.description && data.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (data.category && data.category.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        results.push({ id: doc.id, ...data } as GalleryImage);
      }
    });
    return results;
  } catch (error) {
    console.error("Error searching gallery images:", error);
    return [];
  }
};
