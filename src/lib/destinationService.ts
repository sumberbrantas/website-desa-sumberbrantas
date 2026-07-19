import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, where, getDoc, Timestamp, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db, useMockData } from "@/lib/firebase";
import { uploadToImgbb } from "./imgbbService";
import {
  getMockDestinations,
  addMockDestination,
  updateMockDestination,
  deleteMockDestination,
  mockDestinations
} from "./mockData";

export interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imagePath: string;
  location: string;
  category?: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy: string;
  updatedBy: string;
}

export interface CreateDestinationData {
  name: string;
  description: string;
  image: File;
  location: string;
  category?: string;
  isActive: boolean;
  order: number;
  createdBy: string;
}

export interface UpdateDestinationData {
  name?: string;
  description?: string;
  image?: File;
  location?: string;
  category?: string;
  isActive?: boolean;
  order?: number;
  updatedBy: string;
}

export const uploadDestinationImage = async (file: File, destinationId?: string): Promise<{ url: string; path: string }> => {
  // Mock mode
  if (useMockData) {
    return { url: URL.createObjectURL(file), path: `mock/destinations/${file.name}` };
  }

  // Use imgbb for image hosting (free tier)
  try {
    const result = await uploadToImgbb(file);
    return {
      url: result.url,
      path: result.url,
    };
  } catch (error) {
    console.error("Error uploading destination image to imgbb:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image");
  }
};

export const deleteDestinationImage = async (imagePath: string): Promise<void> => {
  // imgbb images are managed by imgbb, no deletion needed
  // Just log for debugging
  console.log("Image deletion not needed for imgbb URLs:", imagePath);
};

export const createDestination = async (data: CreateDestinationData): Promise<Destination> => {
  // Mock mode
  if (useMockData) {
    const newDest = addMockDestination({
      name: data.name,
      description: data.description,
      imageUrl: URL.createObjectURL(data.image),
      imagePath: `mock/destinations/${data.image.name}`,
      location: data.location,
      category: data.category || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });
    return { ...newDest, createdAt: new Date(), updatedAt: new Date() };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, "destinations"), {
      name: data.name,
      description: data.description,
      imageUrl: "",
      imagePath: "",
      location: data.location,
      category: data.category || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });

    const { url, path } = await uploadDestinationImage(data.image, docRef.id);

    await updateDoc(docRef, {
      imageUrl: url,
      imagePath: path,
    });

    const newDestination: Destination = {
      id: docRef.id,
      name: data.name,
      description: data.description,
      imageUrl: url,
      imagePath: path,
      location: data.location,
      category: data.category || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    };

    return newDestination;
  } catch (error) {
    console.error("Error creating destination:", error);
    throw new Error("Failed to create destination");
  }
};

export const getDestinations = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: "all" | "active" | "inactive"
): Promise<{ destinations: Destination[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  // Mock mode
  if (useMockData) {
    let dests = getMockDestinations();
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      dests = dests.filter(d => d.isActive === isActive);
    }
    return { destinations: dests.slice(0, pageSize), lastVisible: null };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    let q;
    if (lastDoc) {
      q = query(collection(db, "destinations"), orderBy("order", "asc"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize * 2));
    } else {
      q = query(collection(db, "destinations"), orderBy("order", "asc"), orderBy("createdAt", "desc"), limit(pageSize * 2));
    }

    const querySnapshot = await getDocs(q);
    const allDestinations: Destination[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      allDestinations.push({
        id: docSnap.id,
        name: data.name || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        location: data.location || "",
        category: data.category || "",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy,
        updatedBy: data.updatedBy,
      });
    });

    let filteredDestinations = allDestinations;
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filteredDestinations = allDestinations.filter((dest) => dest.isActive === isActive);
    }

    const destinations = filteredDestinations.slice(0, pageSize);
    const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

    return { destinations, lastVisible };
  } catch (error) {
    console.error("Error fetching destinations:", error);
    throw new Error("Gagal memuat destinasi. Silakan coba lagi.");
  }
};

export const getDestinationById = async (id: string): Promise<Destination | null> => {
  // Mock mode
  if (useMockData) {
    return mockDestinations.find(d => d.id === id) || null;
  }

  try {
    if (!db) return null;
    const docRef = doc(db, "destinations", id);
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
      category: data.category || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };
  } catch (error) {
    console.error("Error fetching destination:", error);
    throw new Error("Failed to fetch destination");
  }
};

export const updateDestination = async (id: string, data: UpdateDestinationData): Promise<Destination> => {
  // Mock mode
  if (useMockData) {
    const updated = updateMockDestination(id, {
      name: data.name,
      description: data.description,
      location: data.location,
      category: data.category,
      isActive: data.isActive,
      order: data.order,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    } as any);
    if (!updated) throw new Error("Destination not found");
    return { ...updated, updatedAt: new Date() } as Destination;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "destinations", id);

    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) {
      throw new Error("Destination not found");
    }

    const currentData = currentDoc.data();
    let updateData: any = {
      updatedAt: Timestamp.now(),
      updatedBy: data.updatedBy,
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.order !== undefined) updateData.order = data.order;

    if (data.image) {
      if (currentData.imagePath) {
        await deleteDestinationImage(currentData.imagePath);
      }

      const { url, path } = await uploadDestinationImage(data.image, id);
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
      category: updatedData.category || "",
      isActive: updatedData.isActive,
      order: updatedData.order,
      createdAt: updatedData.createdAt,
      updatedAt: updatedData.updatedAt,
      createdBy: updatedData.createdBy,
      updatedBy: updatedData.updatedBy,
    };
  } catch (error) {
    console.error("Error updating destination:", error);
    throw new Error("Failed to update destination");
  }
};

export const deleteDestinationById = async (id: string): Promise<void> => {
  // Mock mode
  if (useMockData) {
    deleteMockDestination(id);
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "destinations", id);

    const currentDoc = await getDoc(docRef);
    if (currentDoc.exists()) {
      const currentData = currentDoc.data();
      if (currentData.imagePath) {
        await deleteDestinationImage(currentData.imagePath);
      }
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting destination:", error);
    throw new Error("Failed to delete destination");
  }
};

export const getActiveDestinations = async (limitCount?: number): Promise<Destination[]> => {
  // Mock mode
  if (useMockData) {
    const dests = mockDestinations.filter(d => d.isActive);
    dests.sort((a, b) => a.order - b.order);
    return limitCount ? dests.slice(0, limitCount) : dests;
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "destinations"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const destinations: Destination[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.isActive === true) {
        destinations.push({
          id: docSnap.id,
          name: data.name || "Untitled",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          imagePath: data.imagePath || "",
          location: data.location || "",
          category: data.category || "",
          isActive: data.isActive ?? true,
          order: data.order || 0,
          createdAt: data.createdAt || data.updatedAt,
          updatedAt: data.updatedAt,
          createdBy: data.createdBy || data.updatedBy || "",
          updatedBy: data.updatedBy || "",
        });
      }
    });

    destinations.sort((a, b) => a.order - b.order);

    return limitCount ? destinations.slice(0, limitCount) : destinations;
  } catch (error) {
    console.error("Error fetching active destinations:", error);
    return [];
  }
};

export const searchDestinations = async (searchTerm: string): Promise<Destination[]> => {
  // Mock mode
  if (useMockData) {
    const term = searchTerm.toLowerCase();
    return mockDestinations.filter(d =>
      d.name.toLowerCase().includes(term) ||
      d.description.toLowerCase().includes(term) ||
      d.location.toLowerCase().includes(term)
    );
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "destinations"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const destinations: Destination[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const destination: Destination = {
        id: docSnap.id,
        name: data.name || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        location: data.location || "",
        category: data.category || "",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy || "",
        updatedBy: data.updatedBy || "",
      };

      if (
        destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        destinations.push(destination);
      }
    });

    return destinations;
  } catch (error) {
    console.error("Error searching destinations:", error);
    throw new Error("Gagal mencari destinasi");
  }
};

export const getDestinationsWithPagination = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all"): Promise<{ destinations: Destination[]; totalPages: number; totalItems: number }> => {
  // Mock mode
  if (useMockData) {
    let dests = [...mockDestinations];
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      dests = dests.filter(d => d.isActive === isActive);
    }
    const totalItems = dests.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (page - 1) * pageSize;
    return {
      destinations: dests.slice(offset, offset + pageSize),
      totalPages,
      totalItems,
    };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const offset = (page - 1) * pageSize;

    const q = query(collection(db, "destinations"), orderBy("order", "asc"), orderBy("createdAt", "desc"));
    const totalSnapshot = await getDocs(q);

    const allDestinations: Destination[] = [];
    totalSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      allDestinations.push({
        id: docSnap.id,
        name: data.name || "Untitled",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        location: data.location || "",
        category: data.category || "",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy || "",
        updatedBy: data.updatedBy || "",
      });
    });

    let filteredDestinations = allDestinations;
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filteredDestinations = allDestinations.filter((dest) => dest.isActive === isActive);
    }

    const totalItems = filteredDestinations.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedDestinations = filteredDestinations.slice(offset, offset + pageSize);

    return {
      destinations: paginatedDestinations,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching destinations with pagination:", error);
    throw new Error("Gagal memuat destinasi");
  }
};

export const getDestinationCountByStatus = async (statusFilter: "all" | "active" | "inactive" = "all"): Promise<number> => {
  // Mock mode
  if (useMockData) {
    if (statusFilter === "all") return mockDestinations.length;
    const isActive = statusFilter === "active";
    return mockDestinations.filter(d => d.isActive === isActive).length;
  }

  try {
    if (!db) return 0;
    const q = query(collection(db, "destinations"));
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
    console.error("Error counting destinations:", error);
    return 0;
  }
};

export const getDestinationCategories = async (): Promise<string[]> => {
  // Mock mode
  if (useMockData) {
    const categories = new Set(mockDestinations.map(d => d.category).filter(Boolean));
    return Array.from(categories).sort();
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "destinations"));
    const snapshot = await getDocs(q);

    const categories = new Set<string>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.category) {
        categories.add(data.category);
      }
    });

    return Array.from(categories).sort();
  } catch (error) {
    console.error("Error fetching destination categories:", error);
    return [];
  }
};
