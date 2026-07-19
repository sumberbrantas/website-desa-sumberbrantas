import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, getDoc, Timestamp } from "firebase/firestore";
import { db, useMockData } from "@/lib/firebase";
import { uploadToImgbb } from "./imgbbService";
import {
  getMockProducts,
  addMockProduct,
  updateMockProduct,
  deleteMockProduct,
  mockProducts
} from "./mockData";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imagePath: string;
  category: string;
  whatsappMessage?: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy: string;
  updatedBy: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image: File;
  category: string;
  whatsappMessage?: string;
  isActive: boolean;
  order: number;
  createdBy: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  image?: File;
  category?: string;
  whatsappMessage?: string;
  isActive?: boolean;
  order?: number;
  updatedBy: string;
}

// Helper function to format price
export const formatProductPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const uploadProductImage = async (file: File, productId?: string): Promise<{ url: string; path: string }> => {
  // Mock mode
  if (useMockData) {
    return { url: URL.createObjectURL(file), path: `mock/products/${file.name}` };
  }

  // Use imgbb for image hosting (free tier)
  try {
    const result = await uploadToImgbb(file);
    return { url: result.url, path: result.url };
  } catch (error) {
    console.error("Error uploading product image to imgbb:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image");
  }
};

export const deleteProductImage = async (imagePath: string): Promise<void> => {
  // imgbb images are managed by imgbb, no deletion needed
  // Just log for debugging
  console.log("Image deletion not needed for imgbb URLs:", imagePath);
};

export const createProduct = async (data: CreateProductData): Promise<Product> => {
  // Mock mode
  if (useMockData) {
    const newProd = addMockProduct({
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: URL.createObjectURL(data.image),
      imagePath: `mock/products/${data.image.name}`,
      category: data.category,
      whatsappMessage: data.whatsappMessage || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });
    return { ...newProd, createdAt: new Date(), updatedAt: new Date() };
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, "products"), {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: "",
      imagePath: "",
      category: data.category,
      whatsappMessage: data.whatsappMessage || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    });

    const { url, path } = await uploadProductImage(data.image, docRef.id);

    await updateDoc(docRef, { imageUrl: url, imagePath: path });

    return {
      id: docRef.id,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: url,
      imagePath: path,
      category: data.category,
      whatsappMessage: data.whatsappMessage || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: now,
      updatedAt: now,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};

export const getProducts = async (statusFilter?: "all" | "active" | "inactive"): Promise<Product[]> => {
  // Mock mode
  if (useMockData) {
    let prods = getMockProducts();
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      prods = prods.filter(p => p.isActive === isActive);
    }
    return prods;
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "products"), orderBy("order", "asc"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const allProducts: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      allProducts.push({
        id: docSnap.id,
        name: data.name || "Untitled",
        description: data.description || "",
        price: data.price || 0,
        imageUrl: data.imageUrl || "",
        imagePath: data.imagePath || "",
        category: data.category || "",
        whatsappMessage: data.whatsappMessage || "",
        isActive: data.isActive ?? true,
        order: data.order || 0,
        createdAt: data.createdAt || data.updatedAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy || data.updatedBy,
        updatedBy: data.updatedBy,
      });
    });

    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      return allProducts.filter((p) => p.isActive === isActive);
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  // Mock mode
  if (useMockData) {
    return mockProducts.find(p => p.id === id) || null;
  }

  try {
    if (!db) return null;
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      imagePath: data.imagePath,
      category: data.category,
      whatsappMessage: data.whatsappMessage || "",
      isActive: data.isActive,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

export const updateProduct = async (id: string, data: UpdateProductData): Promise<Product> => {
  // Mock mode
  if (useMockData) {
    const updated = updateMockProduct(id, {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      whatsappMessage: data.whatsappMessage,
      isActive: data.isActive,
      order: data.order,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    } as any);
    if (!updated) throw new Error("Product not found");
    return { ...updated, updatedAt: new Date() } as Product;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "products", id);
    const currentDoc = await getDoc(docRef);

    if (!currentDoc.exists()) {
      throw new Error("Product not found");
    }

    const currentData = currentDoc.data();
    let updateData: any = {
      updatedAt: Timestamp.now(),
      updatedBy: data.updatedBy,
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.whatsappMessage !== undefined) updateData.whatsappMessage = data.whatsappMessage;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.order !== undefined) updateData.order = data.order;

    if (data.image) {
      if (currentData.imagePath) {
        await deleteProductImage(currentData.imagePath);
      }
      const { url, path } = await uploadProductImage(data.image, id);
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
      price: updatedData.price,
      imageUrl: updatedData.imageUrl,
      imagePath: updatedData.imagePath,
      category: updatedData.category,
      whatsappMessage: updatedData.whatsappMessage || "",
      isActive: updatedData.isActive,
      order: updatedData.order,
      createdAt: updatedData.createdAt,
      updatedAt: updatedData.updatedAt,
      createdBy: updatedData.createdBy,
      updatedBy: updatedData.updatedBy,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};

export const deleteProductById = async (id: string): Promise<void> => {
  // Mock mode
  if (useMockData) {
    deleteMockProduct(id);
    return;
  }

  try {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "products", id);
    const currentDoc = await getDoc(docRef);

    if (currentDoc.exists()) {
      const currentData = currentDoc.data();
      if (currentData.imagePath) {
        await deleteProductImage(currentData.imagePath);
      }
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

export const getActiveProducts = async (limitCount?: number): Promise<Product[]> => {
  // Mock mode
  if (useMockData) {
    const prods = mockProducts.filter(p => p.isActive);
    prods.sort((a, b) => a.order - b.order);
    return limitCount ? prods.slice(0, limitCount) : prods;
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "products"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.isActive === true) {
        products.push({
          id: docSnap.id,
          name: data.name || "Untitled",
          description: data.description || "",
          price: data.price || 0,
          imageUrl: data.imageUrl || "",
          imagePath: data.imagePath || "",
          category: data.category || "",
          whatsappMessage: data.whatsappMessage || "",
          isActive: true,
          order: data.order || 0,
          createdAt: data.createdAt || data.updatedAt,
          updatedAt: data.updatedAt,
          createdBy: data.createdBy || data.updatedBy || "",
          updatedBy: data.updatedBy || "",
        });
      }
    });

    products.sort((a, b) => a.order - b.order);
    return limitCount ? products.slice(0, limitCount) : products;
  } catch (error) {
    console.error("Error fetching active products:", error);
    return [];
  }
};

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  // Mock mode
  if (useMockData) {
    const term = searchTerm.toLowerCase();
    return mockProducts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "products"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (
        data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.category.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        products.push({
          id: docSnap.id,
          name: data.name || "Untitled",
          description: data.description || "",
          price: data.price || 0,
          imageUrl: data.imageUrl || "",
          imagePath: data.imagePath || "",
          category: data.category || "",
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

    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

export const getProductCategories = async (): Promise<string[]> => {
  // Mock mode
  if (useMockData) {
    const categories = new Set(mockProducts.map(p => p.category));
    return Array.from(categories).sort();
  }

  try {
    if (!db) return [];
    const q = query(collection(db, "products"));
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
    console.error("Error fetching product categories:", error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  // Mock mode
  if (useMockData) {
    return mockProducts.filter(p => p.category === category && p.isActive);
  }

  try {
    const products = await getActiveProducts();
    return products.filter((p) => p.category === category);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};
