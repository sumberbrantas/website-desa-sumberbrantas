import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, where, getDoc, Timestamp, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db, useMockData } from "@/lib/firebase";
import { getMockDocuments, addMockDocument, updateMockDocument, deleteMockDocument, mockDocuments } from "./mockData";
import { formatMockFileSize } from "./mockData";

export interface Document {
  id: string;
  title: string;
  category: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy: string;
  updatedBy: string;
}

export interface CreateDocumentData {
  title: string;
  category: string;
  description?: string;
  fileUrl: string;
  isActive: boolean;
  order: number;
  createdBy: string;
}

export interface UpdateDocumentData {
  title?: string;
  category?: string;
  description?: string;
  fileUrl?: string;
  isActive?: boolean;
  order?: number;
  updatedBy: string;
}

// Extract Google Drive file ID from URL
export const extractDriveFileId = (url: string): string | null => {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Convert Google Drive URL to embed URL
export const convertToEmbedUrl = (url: string): string | null => {
  const fileId = extractDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

// Convert Google Drive URL to download URL
export const convertToDownloadUrl = (url: string): string | null => {
  const fileId = extractDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

// Validate Google Drive URL
export const isValidDriveUrl = (url: string): boolean => {
  return extractDriveFileId(url) !== null;
};

export const createDocument = async (data: CreateDocumentData): Promise<Document> => {
  // Mock mode
  if (useMockData) {
    const newDoc = addMockDocument({
      title: data.title,
      category: data.category,
      description: data.description || "",
      fileUrl: data.fileUrl,
      fileName: `document_${Date.now()}`,
      isActive: data.isActive,
      order: data.order,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });
    return {
      ...newDoc,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    if (!db) throw new Error("Firebase not configured");

    // Validate Google Drive URL
    if (!isValidDriveUrl(data.fileUrl)) {
      throw new Error("URL Google Drive tidak valid");
    }

    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, "documents"), {
      title: data.title,
      category: data.category,
      description: data.description || "",
      fileUrl: data.fileUrl,
      fileName: data.fileUrl.split("/").pop() || "document",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });

    return {
      id: docRef.id,
      title: data.title,
      category: data.category,
      description: data.description || "",
      fileUrl: data.fileUrl,
      fileName: data.fileUrl.split("/").pop() || "document",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    };
  } catch (error) {
    console.error("Error creating document:", error);
    throw error instanceof Error ? error : new Error("Failed to create document");
  }
};

export const getDocuments = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: "all" | "active" | "inactive"
): Promise<{ documents: Document[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  // Mock mode
  if (useMockData) {
    let docs = getMockDocuments();
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      docs = docs.filter(d => d.isActive === isActive);
    }
    return { documents: docs.slice(0, pageSize), lastVisible: null };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    let q;
    if (lastDoc) {
      q = query(collection(db, "documents"), orderBy("order", "asc"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize * 2));
    } else {
      q = query(collection(db, "documents"), orderBy("order", "asc"), orderBy("createdAt", "desc"), limit(pageSize * 2));
    }

    const querySnapshot = await getDocs(q);
    const allDocuments: Document[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      allDocuments.push({
        id: docSnap.id,
        title: data.title,
        category: data.category,
        description: data.description || "",
        fileUrl: data.fileUrl || "",
        fileName: data.fileName || "",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy,
        updatedBy: data.updatedBy,
      });
    });

    let filteredDocuments = allDocuments;
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filteredDocuments = allDocuments.filter((doc) => doc.isActive === isActive);
    }

    const documents = filteredDocuments.slice(0, pageSize);
    const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

    return { documents, lastVisible };
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Gagal memuat dokumen. Silakan coba lagi.");
  }
};

export const getDocumentById = async (id: string): Promise<Document | null> => {
  // Mock mode
  if (useMockData) {
    return mockDocuments.find(d => d.id === id) || null;
  }

  try {
    if (!db) return null;
    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      category: data.category,
      description: data.description || "",
      fileUrl: data.fileUrl || "",
      fileName: data.fileName || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };
  } catch (error) {
    console.error("Error fetching document:", error);
    throw new Error("Failed to fetch document");
  }
};

export const updateDocument = async (id: string, data: UpdateDocumentData): Promise<Document> => {
  // Mock mode
  if (useMockData) {
    const updated = updateMockDocument(id, {
      title: data.title,
      category: data.category,
      description: data.description,
      fileUrl: data.fileUrl,
      isActive: data.isActive,
      order: data.order,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    } as any);
    if (!updated) throw new Error("Document not found");
    return { ...updated, updatedAt: new Date() } as Document;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "documents", id);

    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) {
      throw new Error("Document not found");
    }

    const currentData = currentDoc.data();
    let updateData: any = {
      updatedAt: Timestamp.now(),
      updatedBy: data.updatedBy,
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.fileUrl !== undefined) {
      if (!isValidDriveUrl(data.fileUrl)) {
        throw new Error("URL Google Drive tidak valid");
      }
      updateData.fileUrl = data.fileUrl;
      updateData.fileName = data.fileUrl.split("/").pop() || "document";
    }
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.order !== undefined) updateData.order = data.order;

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    const updatedData = updatedDoc.data()!;

    return {
      id: updatedDoc.id,
      title: updatedData.title,
      category: updatedData.category,
      description: updatedData.description || "",
      fileUrl: updatedData.fileUrl || "",
      fileName: updatedData.fileName || "",
      isActive: updatedData.isActive,
      order: updatedData.order,
      createdAt: updatedData.createdAt,
      updatedAt: updatedData.updatedAt,
      createdBy: updatedData.createdBy,
      updatedBy: updatedData.updatedBy,
    };
  } catch (error) {
    console.error("Error updating document:", error);
    throw error instanceof Error ? error : new Error("Failed to update document");
  }
};

export const deleteDocumentById = async (id: string): Promise<void> => {
  // Mock mode
  if (useMockData) {
    deleteMockDocument(id);
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "documents", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }
};

export const getActiveDocuments = async (limitCount?: number): Promise<Document[]> => {
  // Mock mode
  if (useMockData) {
    const docs = mockDocuments.filter(d => d.isActive);
    docs.sort((a, b) => a.order - b.order);
    return limitCount ? docs.slice(0, limitCount) : docs;
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "documents"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const documents: Document[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.isActive === true) {
        documents.push({
          id: docSnap.id,
          title: data.title || "Untitled",
          category: data.category || "umum",
          description: data.description || "",
          fileUrl: data.fileUrl || "",
          fileName: data.fileName || "",
          isActive: data.isActive ?? true,
          order: data.order || 0,
          createdAt: data.createdAt || data.updatedAt,
          updatedAt: data.updatedAt,
          createdBy: data.createdBy || data.updatedBy || "",
          updatedBy: data.updatedBy || "",
        });
      }
    });

    documents.sort((a, b) => a.order - b.order);

    return limitCount ? documents.slice(0, limitCount) : documents;
  } catch (error) {
    console.error("Error fetching active documents:", error);
    return [];
  }
};

export const searchDocuments = async (searchTerm: string): Promise<Document[]> => {
  // Mock mode
  if (useMockData) {
    const term = searchTerm.toLowerCase();
    return mockDocuments.filter(d =>
      d.title.toLowerCase().includes(term) ||
      (d.description && d.description.toLowerCase().includes(term)) ||
      d.category.toLowerCase().includes(term)
    );
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "documents"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const documents: Document[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const document: Document = {
        id: docSnap.id,
        title: data.title || "Untitled",
        category: data.category || "umum",
        description: data.description || "",
        fileUrl: data.fileUrl || "",
        fileName: data.fileName || "",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy || "",
        updatedBy: data.updatedBy || "",
      };

      if (
        document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (document.description && document.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (document.category && document.category.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        documents.push(document);
      }
    });

    return documents;
  } catch (error) {
    console.error("Error searching documents:", error);
    throw new Error("Gagal mencari dokumen");
  }
};

export const getDocumentsWithPagination = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all"): Promise<{ documents: Document[]; totalPages: number; totalItems: number }> => {
  // Mock mode
  if (useMockData) {
    let docs = [...mockDocuments];
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      docs = docs.filter(d => d.isActive === isActive);
    }
    const totalItems = docs.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (page - 1) * pageSize;
    return {
      documents: docs.slice(offset, offset + pageSize),
      totalPages,
      totalItems,
    };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const offset = (page - 1) * pageSize;

    const q = query(collection(db, "documents"), orderBy("order", "asc"), orderBy("createdAt", "desc"));
    const totalSnapshot = await getDocs(q);

    const allDocuments: Document[] = [];
    totalSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      allDocuments.push({
        id: docSnap.id,
        title: data.title || "Untitled",
        category: data.category || "umum",
        description: data.description || "",
        fileUrl: data.fileUrl || "",
        fileName: data.fileName || "",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy || "",
        updatedBy: data.updatedBy || "",
      });
    });

    let filteredDocuments = allDocuments;
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filteredDocuments = allDocuments.filter((doc) => doc.isActive === isActive);
    }

    const totalItems = filteredDocuments.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedDocuments = filteredDocuments.slice(offset, offset + pageSize);

    return {
      documents: paginatedDocuments,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching documents with pagination:", error);
    throw new Error("Gagal memuat dokumen");
  }
};

export const getDocumentCountByStatus = async (statusFilter: "all" | "active" | "inactive" = "all"): Promise<number> => {
  // Mock mode
  if (useMockData) {
    if (statusFilter === "all") return mockDocuments.length;
    const isActive = statusFilter === "active";
    return mockDocuments.filter(d => d.isActive === isActive).length;
  }

  try {
    if (!db) return 0;
    const q = query(collection(db, "documents"));
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
    console.error("Error counting documents:", error);
    return 0;
  }
};

export const getDocumentCategories = async (): Promise<string[]> => {
  // Mock mode
  if (useMockData) {
    const categories = new Set(mockDocuments.map(d => d.category));
    return Array.from(categories).sort();
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "documents"));
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
    console.error("Error fetching document categories:", error);
    return [];
  }
};

// Format file size (kept for backward compatibility)
export const formatFileSize = (bytes: number): string => {
  // Try mock format first
  try {
    return formatMockFileSize(bytes);
  } catch {
    // Fallback
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
};
