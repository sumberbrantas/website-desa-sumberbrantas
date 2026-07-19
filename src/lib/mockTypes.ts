/**
 * Type definitions untuk Mock Data
 * Digunakan untuk development lokal tanpa Firebase
 */

export interface VillageSettings {
  villageName: string;
  villageTagline: string;
  logoUrl: string;
  iconUrl: string;
  videoUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  address: string;
  email: string;
  phone: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  accommodationWhatsapp: string;
  accommodationWhatsappMessage: string;
}

export interface MenuItem {
  id: string;
  name: string;
  href: string;
  icon?: string;
  order: number;
  isActive: boolean;
  isBuiltIn: boolean;
  targetBlank: boolean;
}

export interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  fileName: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Accommodation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imagePath: string;
  location: string;
  priceRange: string;
  whatsappNumber: string;
  whatsappMessage: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imagePath: string;
  location: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imagePath: string;
  category: string;
  whatsappMessage: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
