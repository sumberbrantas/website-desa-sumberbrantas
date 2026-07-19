import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, where, serverTimestamp, QueryDocumentSnapshot, DocumentData, Timestamp } from "firebase/firestore";
import { db, useMockData } from "./firebase";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  priority: "normal" | "penting" | "urgent";
  status: "active" | "inactive" | "expired";
  authorId: string;
  authorName: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  slug: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  priority: "normal" | "penting" | "urgent";
  authorId: string;
  authorName: string;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  priority?: "normal" | "penting" | "urgent";
  status?: "active" | "inactive" | "expired";
}

// Mock announcements data
const mockAnnouncements: Announcement[] = [
  {
    id: "ann1",
    title: "Pendaftaran Bantuan Sosial 2025",
    content: "Pendaftaran bantuan sosial desa akan dibuka mulai 1 Februari 2025. Syarat dan ketentuan dapat dilihat di kantor desa.",
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    priority: "penting",
    status: "active",
    authorId: "mock-uid",
    authorName: "Admin Desa",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
    slug: "pendaftaran-bantuan-sosial-2025",
  },
  {
    id: "ann2",
    title: "Kerja Bakti Bulanan",
    content: "Kerja bakti bulanan akan dilaksanakan pada hari Minggu, 26 Januari 2025 pukul 07.00. Mohon partisipasi seluruh warga.",
    startDate: "2025-01-26",
    endDate: "2025-01-26",
    priority: "normal",
    status: "active",
    authorId: "mock-uid",
    authorName: "Admin Desa",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
    slug: "kerja-bakti-bulanan",
  },
];

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 100);
};

const determineStatus = (startDate: string, endDate: string): "active" | "inactive" | "expired" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return "inactive";
  } else if (now > end) {
    return "expired";
  } else {
    return "active";
  }
};

export const createAnnouncement = async (data: CreateAnnouncementData): Promise<Announcement> => {
  if (useMockData) {
    const slug = generateSlug(data.title);
    const status = determineStatus(data.startDate, data.endDate);
    const now = new Date();
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      ...data,
      slug,
      status,
      createdAt: now,
      updatedAt: now,
    };
    mockAnnouncements.push(newAnn);
    return newAnn;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const slug = generateSlug(data.title);
    const status = determineStatus(data.startDate, data.endDate);

    const announcementData = {
      ...data,
      slug,
      status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "announcements"), announcementData);
    const docSnap = await getDoc(docRef);

    return {
      id: docRef.id,
      ...docSnap.data(),
    } as Announcement;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};

export const getAnnouncements = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: "all" | "active" | "inactive" | "expired"
): Promise<{ announcements: Announcement[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  if (useMockData) {
    let anns = [...mockAnnouncements];
    if (statusFilter && statusFilter !== "all") {
      anns = anns.filter(a => a.status === statusFilter);
    }
    anns.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
      return dateB.getTime() - dateA.getTime();
    });
    return { announcements: anns.slice(0, pageSize), lastVisible: null };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    let q;

    if (statusFilter && statusFilter !== "all") {
      if (lastDoc) {
        q = query(collection(db, "announcements"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
      } else {
        q = query(collection(db, "announcements"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), limit(pageSize));
      }
    } else {
      if (lastDoc) {
        q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
      } else {
        q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(pageSize));
      }
    }

    const querySnapshot = await getDocs(q);
    const announcements: Announcement[] = [];

    querySnapshot.forEach((doc) => {
      announcements.push({
        id: doc.id,
        ...doc.data(),
      } as Announcement);
    });

    return { announcements, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null };
  } catch (error) {
    console.error("Error getting announcements:", error);
    throw new Error("Gagal memuat pengumuman.");
  }
};

export const getAnnouncementById = async (id: string): Promise<Announcement | null> => {
  if (useMockData) {
    return mockAnnouncements.find(a => a.id === id) || null;
  }

  try {
    if (!db) return null;
    const docRef = doc(db, "announcements", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Announcement : null;
  } catch (error) {
    console.error("Error getting announcement:", error);
    throw error;
  }
};

export const updateAnnouncement = async (id: string, data: UpdateAnnouncementData): Promise<Announcement> => {
  if (useMockData) {
    const index = mockAnnouncements.findIndex(a => a.id === id);
    if (index === -1) throw new Error("Announcement not found");

    const updated: Announcement = {
      ...mockAnnouncements[index],
      ...data,
      updatedAt: new Date(),
    };
    if (data.title) {
      updated.slug = generateSlug(data.title);
    }

    mockAnnouncements[index] = updated;
    return updated;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "announcements", id);

    let updateData: any = { ...data, updatedAt: serverTimestamp() };
    if (data.title) {
      updateData.slug = generateSlug(data.title);
    }

    await updateDoc(docRef, updateData);
    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Announcement;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  if (useMockData) {
    const index = mockAnnouncements.findIndex(a => a.id === id);
    if (index !== -1) mockAnnouncements.splice(index, 1);
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    await deleteDoc(doc(db, "announcements", id));
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
};

export const getActiveAnnouncements = async (limitCount: number = 10): Promise<Announcement[]> => {
  if (useMockData) {
    const now = new Date();
    const active = mockAnnouncements.filter(a => {
      const start = new Date(a.startDate);
      const end = new Date(a.endDate);
      return (now >= start && now <= end) || a.status === "active";
    });

    const priorityOrder = { urgent: 3, penting: 2, normal: 1 };
    active.sort((a, b) => {
      const pA = priorityOrder[a.priority] || 1;
      const pB = priorityOrder[b.priority] || 1;
      if (pA !== pB) return pB - pA;
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
      return dateB.getTime() - dateA.getTime();
    });

    return active.slice(0, limitCount);
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const allAnnouncements: Announcement[] = [];

    querySnapshot.forEach((doc) => {
      allAnnouncements.push({ id: doc.id, ...doc.data() } as Announcement);
    });

    const now = new Date();
    const activeAnnouncements = allAnnouncements.filter((announcement) => {
      const startDate = new Date(announcement.startDate);
      const endDate = new Date(announcement.endDate);
      return (now >= startDate && now <= endDate) || announcement.status === "active";
    });

    return activeAnnouncements.slice(0, limitCount);
  } catch (error) {
    return [];
  }
};

export const getAnnouncementsWithPagination = async (
  page: number = 1,
  pageSize: number = 10,
  statusFilter: "all" | "active" | "inactive" | "expired" = "all"
): Promise<{ announcements: Announcement[]; totalPages: number; totalItems: number }> => {
  if (useMockData) {
    let anns = [...mockAnnouncements];
    if (statusFilter !== "all") {
      anns = anns.filter(a => a.status === statusFilter);
    }
    const totalItems = anns.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (page - 1) * pageSize;
    return { announcements: anns.slice(offset, offset + pageSize), totalPages, totalItems };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const totalSnapshot = await getDocs(q);
    const allAnnouncements: Announcement[] = [];
    totalSnapshot.forEach((doc) => {
      allAnnouncements.push({ id: doc.id, ...doc.data() } as Announcement);
    });

    let filteredAnnouncements = allAnnouncements;
    if (statusFilter !== "all") {
      filteredAnnouncements = allAnnouncements.filter((ann) => ann.status === statusFilter);
    }

    const totalItems = filteredAnnouncements.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedAnnouncements = filteredAnnouncements.slice((page - 1) * pageSize, page * pageSize);

    return { announcements: paginatedAnnouncements, totalPages, totalItems };
  } catch (error) {
    console.error("Error fetching announcements with pagination:", error);
    throw new Error("Gagal memuat pengumuman");
  }
};

export const getAnnouncementCountByStatus = async (statusFilter: "all" | "active" | "inactive" | "expired" = "all"): Promise<number> => {
  if (useMockData) {
    if (statusFilter === "all") return mockAnnouncements.length;
    return mockAnnouncements.filter(a => a.status === statusFilter).length;
  }

  try {
    if (!db) return 0;
    const q = query(collection(db, "announcements"));
    const snapshot = await getDocs(q);
    if (statusFilter === "all") return snapshot.size;
    let count = 0;
    snapshot.forEach((doc) => {
      if (doc.data().status === statusFilter) count++;
    });
    return count;
  } catch (error) {
    return 0;
  }
};

export const searchAnnouncements = async (searchTerm: string): Promise<Announcement[]> => {
  if (useMockData) {
    const term = searchTerm.toLowerCase();
    return mockAnnouncements.filter(a =>
      a.title.toLowerCase().includes(term) ||
      a.content.toLowerCase().includes(term)
    );
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const results: Announcement[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.content.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        results.push({ id: doc.id, ...data } as Announcement);
      }
    });
    return results;
  } catch (error) {
    console.error("Error searching announcements:", error);
    return [];
  }
};

export const getAnnouncementBySlug = async (slug: string): Promise<Announcement | null> => {
  if (useMockData) {
    return mockAnnouncements.find(a => a.slug === slug) || null;
  }

  try {
    if (!db) return null;
    const q = query(collection(db, "announcements"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Announcement;
  } catch (error) {
    console.error("Error getting announcement by slug:", error);
    return null;
  }
};
