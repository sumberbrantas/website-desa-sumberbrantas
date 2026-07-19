import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, where, getDoc, Timestamp, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db, useMockData } from "@/lib/firebase";
import { uploadToImgbb, getPlaceholderImage } from "./imgbbService";
import {
  getMockAccommodations,
  addMockAccommodation,
  updateMockAccommodation,
  deleteMockAccommodation,
  mockAccommodations
} from "./mockData";

export interface Accommodation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imagePath: string;
  location: string;
  priceRange?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy: string;
  updatedBy: string;
}

export interface CreateAccommodationData {
  name: string;
  description: string;
  image: File;
  location: string;
  priceRange?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  isActive: boolean;
  order: number;
  createdBy: string;
}

export interface UpdateAccommodationData {
  name?: string;
  description?: string;
  image?: File;
  location?: string;
  priceRange?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  isActive?: boolean;
  order?: number;
  updatedBy: string;
}

// Helper function to normalize WhatsApp number
export const normalizeWhatsAppNumber = (phone: string): string => {
  // Remove all non-digit characters
  let normalized = phone.replace(/\D/g, "");

  // If starts with 0, replace with 62
  if (normalized.startsWith("0")) {
    normalized = "62" + normalized.substring(1);
  }

  // If doesn't start with 62, add it
  if (!normalized.startsWith("62")) {
    normalized = "62" + normalized;
  }

  return normalized;
};

// Helper function to generate WhatsApp link
export const getAccommodationWhatsAppLink = (
  accommodation: Accommodation,
  globalWhatsApp?: string
): string | null => {
  const phone = accommodation.whatsappNumber || globalWhatsApp;
  if (!phone) return null;

  const normalizedPhone = normalizeWhatsAppNumber(phone);

  const defaultMessage = `Halo, saya mau booking:\n${accommodation.name}\nLokasi: ${accommodation.location}`;
  const message = accommodation.whatsappMessage || defaultMessage;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
};

export const uploadAccommodationImage = async (file: File, accommodationId?: string): Promise<{ url: string; path: string }> => {
  // Mock mode
  if (useMockData) {
    return { url: URL.createObjectURL(file), path: `mock/accommodations/${file.name}` };
  }

  // Use imgbb for image hosting (free tier)
  try {
    const result = await uploadToImgbb(file);
    return {
      url: result.url,
      path: result.url,
    };
  } catch (error) {
    console.error("Error uploading accommodation image to imgbb:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image");
  }
};

export const deleteAccommodationImage = async (imagePath: string): Promise<void> => {
  // imgbb images are managed by imgbb, no deletion needed
  // Just log for debugging
  console.log("Image deletion not needed for imgbb URLs:", imagePath);
};

export const createAccommodation = async (data: CreateAccommodationData): Promise<Accommodation> => {
  // Mock mode
  if (useMockData) {
    const newAcc = addMockAccommodation({
      name: data.name,
      description: data.description,
      imageUrl: URL.createObjectURL(data.image),
      imagePath: `mock/accommodations/${data.image.name}`,
      location: data.location,
      priceRange: data.priceRange || "",
      whatsappNumber: data.whatsappNumber || "",
      whatsappMessage: data.whatsappMessage || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });
    return { ...newAcc, createdAt: new Date(), updatedAt: new Date() };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, "accommodations"), {
      name: data.name,
      description: data.description,
      imageUrl: "",
      imagePath: "",
      location: data.location,
      priceRange: data.priceRange || "",
      whatsappNumber: data.whatsappNumber || "",
      whatsappMessage: data.whatsappMessage || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });

    const { url, path } = await uploadAccommodationImage(data.image, docRef.id);

    await updateDoc(docRef, {
      imageUrl: url,
      imagePath: path,
    });

    const newAccommodation: Accommodation = {
      id: docRef.id,
      name: data.name,
      description: data.description,
      imageUrl: url,
      imagePath: path,
      location: data.location,
      priceRange: data.priceRange || "",
      whatsappNumber: data.whatsappNumber || "",
      whatsappMessage: data.whatsappMessage || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    };

    return newAccommodation;
  } catch (error) {
    console.error("Error creating accommodation:", error);
    throw new Error("Failed to create accommodation");
  }
};

export const getAccommodations = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: "all" | "active" | "inactive"
): Promise<{ accommodations: Accommodation[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  // Mock mode
  if (useMockData) {
    let accs = getMockAccommodations();
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      accs = accs.filter(a => a.isActive === isActive);
    }
    return { accommodations: accs.slice(0, pageSize), lastVisible: null };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    let q;
    if (lastDoc) {
      q = query(collection(db, "accommodations"), orderBy("order", "asc"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize * 2));
    } else {
      q = query(collection(db, "accommodations"), orderBy("order", "asc"), orderBy("createdAt", "desc"), limit(pageSize * 2));
    }

    const querySnapshot = await getDocs(q);
    const allAccommodations: Accommodation[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      allAccommodations.push({
        id: docSnap.id,
        name: data.name || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        location: data.location || "",
        priceRange: data.priceRange || "",
        whatsappNumber: data.whatsappNumber || "",
        whatsappMessage: data.whatsappMessage || "",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy,
        updatedBy: data.updatedBy,
      });
    });

    let filteredAccommodations = allAccommodations;
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filteredAccommodations = allAccommodations.filter((acc) => acc.isActive === isActive);
    }

    const accommodations = filteredAccommodations.slice(0, pageSize);
    const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

    return { accommodations, lastVisible };
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    throw new Error("Gagal memuat penginapan. Silakan coba lagi.");
  }
};

export const getAccommodationById = async (id: string): Promise<Accommodation | null> => {
  // Mock mode
  if (useMockData) {
    return mockAccommodations.find(a => a.id === id) || null;
  }

  try {
    if (!db) return null;
    const docRef = doc(db, "accommodations", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      imagePath: data.imagePath,
      location: data.location,
      priceRange: data.priceRange || "",
      whatsappNumber: data.whatsappNumber || "",
      whatsappMessage: data.whatsappMessage || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    throw new Error("Failed to fetch accommodation");
  }
};

export const updateAccommodation = async (id: string, data: UpdateAccommodationData): Promise<Accommodation> => {
  // Mock mode
  if (useMockData) {
    const updated = updateMockAccommodation(id, {
      name: data.name,
      description: data.description,
      location: data.location,
      priceRange: data.priceRange,
      whatsappNumber: data.whatsappNumber,
      whatsappMessage: data.whatsappMessage,
      isActive: data.isActive,
      order: data.order,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    } as any);
    if (!updated) throw new Error("Accommodation not found");
    return { ...updated, updatedAt: new Date() } as Accommodation;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "accommodations", id);

    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) {
      throw new Error("Accommodation not found");
    }

    const currentData = currentDoc.data();
    let updateData: any = {
      updatedAt: Timestamp.now(),
      updatedBy: data.updatedBy,
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.priceRange !== undefined) updateData.priceRange = data.priceRange;
    if (data.whatsappNumber !== undefined) updateData.whatsappNumber = data.whatsappNumber;
    if (data.whatsappMessage !== undefined) updateData.whatsappMessage = data.whatsappMessage;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.order !== undefined) updateData.order = data.order;

    if (data.image) {
      if (currentData.imagePath) {
        await deleteAccommodationImage(currentData.imagePath);
      }

      const { url, path } = await uploadAccommodationImage(data.image, id);
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
      location: updatedData.location,
      priceRange: updatedData.priceRange || "",
      whatsappNumber: updatedData.whatsappNumber || "",
      whatsappMessage: updatedData.whatsappMessage || "",
      isActive: updatedData.isActive,
      order: updatedData.order,
      createdAt: updatedData.createdAt,
      updatedAt: updatedData.updatedAt,
      createdBy: updatedData.createdBy,
      updatedBy: updatedData.updatedBy,
    };
  } catch (error) {
    console.error("Error updating accommodation:", error);
    throw new Error("Failed to update accommodation");
  }
};

export const deleteAccommodationById = async (id: string): Promise<void> => {
  // Mock mode
  if (useMockData) {
    deleteMockAccommodation(id);
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "accommodations", id);

    const currentDoc = await getDoc(docRef);
    if (currentDoc.exists()) {
      const currentData = currentDoc.data();
      if (currentData.imagePath) {
        await deleteAccommodationImage(currentData.imagePath);
      }
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting accommodation:", error);
    throw new Error("Failed to delete accommodation");
  }
};

export const getActiveAccommodations = async (limitCount?: number): Promise<Accommodation[]> => {
  // Mock mode
  if (useMockData) {
    const accs = mockAccommodations.filter(a => a.isActive);
    accs.sort((a, b) => a.order - b.order);
    return limitCount ? accs.slice(0, limitCount) : accs;
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "accommodations"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const accommodations: Accommodation[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.isActive === true) {
        accommodations.push({
          id: docSnap.id,
          name: data.name || "Untitled",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          imagePath: data.imagePath || "",
          location: data.location || "",
          priceRange: data.priceRange || "",
          whatsappNumber: data.whatsappNumber || "",
          whatsappMessage: data.whatsappMessage || "",
          isActive: data.isActive ?? true,
          order: data.order || 0,
          createdAt: data.createdAt || data.updatedAt,
          updatedAt: data.updatedAt,
          createdBy: data.createdBy || data.updatedBy || "",
          updatedBy: data.updatedBy || "",
        });
      }
    });

    accommodations.sort((a, b) => a.order - b.order);

    return limitCount ? accommodations.slice(0, limitCount) : accommodations;
  } catch (error) {
    console.error("Error fetching active accommodations:", error);
    return [];
  }
};

export const searchAccommodations = async (searchTerm: string): Promise<Accommodation[]> => {
  // Mock mode
  if (useMockData) {
    const term = searchTerm.toLowerCase();
    return mockAccommodations.filter(a =>
      a.name.toLowerCase().includes(term) ||
      a.description.toLowerCase().includes(term) ||
      a.location.toLowerCase().includes(term)
    );
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "accommodations"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const accommodations: Accommodation[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const accommodation: Accommodation = {
        id: docSnap.id,
        name: data.name || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        location: data.location || "",
        priceRange: data.priceRange || "",
        whatsappNumber: data.whatsappNumber || "",
        whatsappMessage: data.whatsappMessage || "",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy || "",
        updatedBy: data.updatedBy || "",
      };

      if (
        accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accommodation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accommodation.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        accommodations.push(accommodation);
      }
    });

    return accommodations;
  } catch (error) {
    console.error("Error searching accommodations:", error);
    throw new Error("Gagal mencari penginapan");
  }
};

export const getAccommodationsWithPagination = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all"): Promise<{ accommodations: Accommodation[]; totalPages: number; totalItems: number }> => {
  // Mock mode
  if (useMockData) {
    let accs = [...mockAccommodations];
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      accs = accs.filter(a => a.isActive === isActive);
    }
    const totalItems = accs.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (page - 1) * pageSize;
    return {
      accommodations: accs.slice(offset, offset + pageSize),
      totalPages,
      totalItems,
    };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const offset = (page - 1) * pageSize;

    const q = query(collection(db, "accommodations"), orderBy("order", "asc"), orderBy("createdAt", "desc"));
    const totalSnapshot = await getDocs(q);

    const allAccommodations: Accommodation[] = [];
    totalSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      allAccommodations.push({
        id: docSnap.id,
        name: data.name || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        location: data.location || "",
        priceRange: data.priceRange || "",
        whatsappNumber: data.whatsappNumber || "",
        whatsappMessage: data.whatsappMessage || "",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy || "",
        updatedBy: data.updatedBy || "",
      });
    });

    let filteredAccommodations = allAccommodations;
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filteredAccommodations = allAccommodations.filter((acc) => acc.isActive === isActive);
    }

    const totalItems = filteredAccommodations.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedAccommodations = filteredAccommodations.slice(offset, offset + pageSize);

    return {
      accommodations: paginatedAccommodations,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching accommodations with pagination:", error);
    throw new Error("Gagal memuat penginapan");
  }
};

export const getAccommodationCountByStatus = async (statusFilter: "all" | "active" | "inactive" = "all"): Promise<number> => {
  // Mock mode
  if (useMockData) {
    if (statusFilter === "all") return mockAccommodations.length;
    const isActive = statusFilter === "active";
    return mockAccommodations.filter(a => a.isActive === isActive).length;
  }

  try {
    if (!db) return 0;
    const q = query(collection(db, "accommodations"));
    const snapshot = await getDocs(q);

    if (statusFilter === "all") {
      return snapshot.size;
    }

    const isActive = statusFilter === "active";
    let count = 0;
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if ((data.isActive ?? true) === isActive) {
        count++;
      }
    });

    return count;
  } catch (error) {
    console.error("Error counting accommodations:", error);
    return 0;
  }
};
