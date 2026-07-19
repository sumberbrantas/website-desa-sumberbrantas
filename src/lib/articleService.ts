import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where, limit as firestoreLimit, startAfter, Timestamp, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, useMockData } from "./firebase";
import { canUploadFile } from "./storageService";

export interface Article {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  imagePath?: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  status: "draft" | "published";
  slug: string;
  excerpt?: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  image?: File;
  authorId: string;
  authorName: string;
  status: "draft" | "published";
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
  image?: File;
  status?: "draft" | "published";
}

// Mock articles data
const mockArticles: Article[] = [
  {
    id: "article1",
    title: "Gotong Royong Bersihkan Sungai Desa",
    content: "<p>Warga Desa Sumberbrantas bersama-sama membersihkan sungai yang melintasi desa. Kegiatan ini dilakukan pada hari Minggu pagi dengan partisipasi lebih dari 50 warga.</p>",
    imageUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800",
    imagePath: "",
    authorId: "mock-uid",
    authorName: "Admin Desa",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
    status: "published",
    slug: "gotong-royong-bersihkan-sungai-desa",
    excerpt: "Warga Desa Sumberbrantas bersama-sama membersihkan sungai yang melintasi desa...",
  },
  {
    id: "article2",
    title: "Panen Raya Padi Organik Koptan",
    content: "<p>Kelompok Tani Organik Sumberbrantas berhasil panen raya padi organik dengan hasil yang memuaskan. Hasil panen tahun ini meningkat 20% dari tahun sebelumnya.</p>",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    imagePath: "",
    authorId: "mock-uid",
    authorName: "Admin Desa",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
    status: "published",
    slug: "panen-raya-padi-organik-koptan",
    excerpt: "Kelompok Tani Organik Sumberbrantas berhasil panen raya padi organik...",
  },
  {
    id: "article3",
    title: "Pembukaan Desa Wisata Agrowisata",
    content: "<p>Desa Sumberbrantas resmi membuka objek wisata agrowisata yang menyajikan pengalaman pertanian tradisional Jawa kepada pengunjung.</p>",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
    imagePath: "",
    authorId: "mock-uid",
    authorName: "Admin Desa",
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05"),
    status: "published",
    slug: "pembukaan-desa-wisata-agrowisata",
    excerpt: "Desa Sumberbrantas resmi membuka objek wisata agrowisata...",
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

const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const createExcerpt = (content: string, maxLength: number = 150): string => {
  const textContent = content.replace(/<[^>]*>/g, "");
  return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent;
};

export const uploadArticleImage = async (file: File, articleId?: string): Promise<{ url: string; path: string }> => {
  // Mock mode
  if (useMockData) {
    return { url: URL.createObjectURL(file), path: `mock/articles/${file.name}` };
  }

  try {
    if (!storage) throw new Error("Firebase Storage not configured");
    const storageCheck = await canUploadFile(file.size);
    if (!storageCheck.canUpload) {
      throw new Error(storageCheck.message || "Storage penuh!");
    }

    const fileName = `${Date.now()}_${file.name}`;
    const imagePath = `articles/${articleId || "temp"}/${fileName}`;
    const imageRef = ref(storage, imagePath);

    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    refreshStorageStats();

    return { url, path: imagePath };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image");
  }
};

export const deleteArticleImage = async (imagePath: string): Promise<void> => {
  if (useMockData) return;

  try {
    if (!storage) return;
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);

    refreshStorageStats();
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export const createArticle = async (data: CreateArticleData): Promise<Article> => {
  // Mock mode
  if (useMockData) {
    const slug = createSlug(data.title);
    const excerpt = createExcerpt(data.content);
    const now = new Date();
    const newArticle: Article = {
      id: `article-${Date.now()}`,
      title: data.title,
      content: data.content,
      imageUrl: data.image ? URL.createObjectURL(data.image) : undefined,
      imagePath: data.image ? `mock/articles/${data.image.name}` : undefined,
      authorId: data.authorId,
      authorName: data.authorName,
      createdAt: now,
      updatedAt: now,
      status: data.status,
      slug,
      excerpt,
    };
    mockArticles.push(newArticle);
    return newArticle;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const slug = createSlug(data.title);
    const excerpt = createExcerpt(data.content);
    const now = Timestamp.now();

    const articleData = {
      title: data.title,
      content: data.content,
      slug,
      excerpt,
      authorId: data.authorId,
      authorName: data.authorName,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, "articles"), articleData);

    let imageUrl = "";
    let imagePath = "";

    if (data.image) {
      const uploadResult = await uploadArticleImage(data.image, docRef.id);
      imageUrl = uploadResult.url;
      imagePath = uploadResult.path;

      await updateDoc(docRef, {
        imageUrl,
        imagePath,
      });
    }

    return {
      id: docRef.id,
      imageUrl,
      imagePath,
      ...articleData,
    };
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error("Failed to create article");
  }
};

export const getArticles = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  statusFilter?: "all" | "published" | "draft"
): Promise<{ articles: Article[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  // Mock mode
  if (useMockData) {
    let articles = [...mockArticles];
    if (statusFilter && statusFilter !== "all") {
      articles = articles.filter(a => a.status === statusFilter);
    }
    articles.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
      return dateB.getTime() - dateA.getTime();
    });
    return { articles: articles.slice(0, pageSize), lastVisible: null };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    let q;

    if (statusFilter && statusFilter !== "all") {
      if (lastDoc) {
        q = query(collection(db, "articles"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), startAfter(lastDoc), firestoreLimit(pageSize));
      } else {
        q = query(collection(db, "articles"), where("status", "==", statusFilter), orderBy("createdAt", "desc"), firestoreLimit(pageSize));
      }
    } else {
      if (lastDoc) {
        q = query(collection(db, "articles"), orderBy("createdAt", "desc"), startAfter(lastDoc), firestoreLimit(pageSize));
      } else {
        q = query(collection(db, "articles"), orderBy("createdAt", "desc"), firestoreLimit(pageSize));
      }
    }

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
      } as Article);
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return { articles, lastVisible };
  } catch (error) {
    console.error("Error getting articles:", error);
    throw new Error("Gagal memuat artikel. Silakan coba lagi.");
  }
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  // Mock mode
  if (useMockData) {
    return mockArticles.find(a => a.id === id) || null;
  }

  try {
    if (!db) return null;
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Article;
    }

    return null;
  } catch (error) {
    console.error("Error getting article:", error);
    throw new Error("Failed to get article");
  }
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  // Mock mode
  if (useMockData) {
    return mockArticles.find(a => a.slug === slug) || null;
  }

  try {
    if (!db) return null;
    const q = query(collection(db, "articles"), where("slug", "==", slug), firestoreLimit(1));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Article;
    }

    return null;
  } catch (error) {
    console.error("Error getting article by slug:", error);
    throw new Error("Failed to get article");
  }
};

export const updateArticle = async (id: string, data: UpdateArticleData): Promise<Article> => {
  // Mock mode
  if (useMockData) {
    const index = mockArticles.findIndex(a => a.id === id);
    if (index === -1) throw new Error("Article not found");

    const updated: Article = {
      ...mockArticles[index],
      title: data.title || mockArticles[index].title,
      content: data.content || mockArticles[index].content,
      status: data.status || mockArticles[index].status,
      updatedAt: new Date(),
    };

    if (data.title && data.title !== mockArticles[index].title) {
      updated.slug = createSlug(data.title);
    }
    if (data.content) {
      updated.excerpt = createExcerpt(data.content);
    }

    mockArticles[index] = updated;
    return updated;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Article not found");
    }

    const currentData = docSnap.data() as Article;
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };

    if (data.title && data.title !== currentData.title) {
      updateData.title = data.title;
      updateData.slug = createSlug(data.title);
    }

    if (data.content && data.content !== currentData.content) {
      updateData.content = data.content;
      updateData.excerpt = createExcerpt(data.content);
    }

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.image) {
      if (currentData.imagePath) {
        await deleteArticleImage(currentData.imagePath);
      }

      const uploadResult = await uploadArticleImage(data.image, id);
      updateData.imageUrl = uploadResult.url;
      updateData.imagePath = uploadResult.path;
    }

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as Article;
  } catch (error) {
    console.error("Error updating article:", error);
    throw new Error("Failed to update article");
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  // Mock mode
  if (useMockData) {
    const index = mockArticles.findIndex(a => a.id === id);
    if (index !== -1) {
      mockArticles.splice(index, 1);
    }
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Article not found");
    }

    const articleData = docSnap.data() as Article;

    if (articleData.imagePath) {
      await deleteArticleImage(articleData.imagePath);
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting article:", error);
    throw new Error("Failed to delete article");
  }
};

export const searchArticles = async (searchTerm: string): Promise<Article[]> => {
  // Mock mode
  if (useMockData) {
    const term = searchTerm.toLowerCase();
    return mockArticles.filter(a =>
      a.title.toLowerCase().includes(term) ||
      a.content.toLowerCase().includes(term) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(term))
    );
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      const articleData = doc.data() as Article;
      const article = {
        id: doc.id,
        ...articleData,
      };

      if (article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.content.toLowerCase().includes(searchTerm.toLowerCase()) || (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))) {
        articles.push(article);
      }
    });

    return articles;
  } catch (error) {
    console.error("Error searching articles:", error);
    throw new Error("Gagal mencari artikel. Silakan coba lagi.");
  }
};

export const getPublishedArticles = async (limit?: number): Promise<Article[]> => {
  // Mock mode
  if (useMockData) {
    const published = mockArticles
      .filter(a => a.status === "published")
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
        return dateB.getTime() - dateA.getTime();
      });
    return limit ? published.slice(0, limit) : published;
  }

  try {
    if (!db) return [];
    let q;
    if (limit) {
      q = query(collection(db, "articles"), where("status", "==", "published"), orderBy("createdAt", "desc"), firestoreLimit(limit));
    } else {
      q = query(collection(db, "articles"), where("status", "==", "published"), orderBy("createdAt", "desc"));
    }

    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        ...data,
      } as Article);
    });

    return articles;
  } catch (error) {
    console.error("Error getting published articles:", error);
    return [];
  }
};

export const getArticlesWithPagination = async (page: number = 1, pageSize: number = 10, statusFilter: "all" | "published" | "draft" = "all"): Promise<{ articles: Article[]; totalPages: number; totalItems: number }> => {
  // Mock mode
  if (useMockData) {
    let articles = [...mockArticles];
    if (statusFilter !== "all") {
      articles = articles.filter(a => a.status === statusFilter);
    }
    articles.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
      return dateB.getTime() - dateA.getTime();
    });
    const totalItems = articles.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (page - 1) * pageSize;
    return {
      articles: articles.slice(offset, offset + pageSize),
      totalPages,
      totalItems,
    };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const offset = (page - 1) * pageSize;

    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    const totalSnapshot = await getDocs(q);

    const allArticles: Article[] = [];
    totalSnapshot.forEach((doc) => {
      const data = doc.data();
      allArticles.push({
        id: doc.id,
        ...data,
      } as Article);
    });

    let filteredArticles = allArticles;
    if (statusFilter !== "all") {
      filteredArticles = allArticles.filter((article) => article.status === statusFilter);
    }

    const totalItems = filteredArticles.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedArticles = filteredArticles.slice(offset, offset + pageSize);

    return {
      articles: paginatedArticles,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching articles with pagination:", error);
    throw new Error("Gagal memuat artikel");
  }
};

export const getArticleCountByStatus = async (statusFilter: "all" | "published" | "draft" = "all"): Promise<number> => {
  // Mock mode
  if (useMockData) {
    if (statusFilter === "all") return mockArticles.length;
    return mockArticles.filter(a => a.status === statusFilter).length;
  }

  try {
    if (!db) return 0;
    const q = query(collection(db, "articles"));
    const snapshot = await getDocs(q);

    if (statusFilter === "all") {
      return snapshot.size;
    }

    let count = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === statusFilter) {
        count++;
      }
    });

    return count;
  } catch (error) {
    console.error("Error counting articles:", error);
    return 0;
  }
};
