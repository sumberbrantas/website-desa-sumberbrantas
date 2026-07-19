export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  BERITA: "/berita",
  PENGUMUMAN: "/pengumuman",
  GALERI: "/galeri",
  STRUKTUR: "/struktur",
} as const;

export const DASHBOARD_ROUTES = {
  DASHBOARD: "/dashboard",
  ARTICLES: "/dashboard/article",
  ANNOUNCEMENTS: "/dashboard/announcement",
  GALLERY: "/dashboard/gallery",
  PROFILE: "/dashboard/profile",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
} as const;

export const ANIMATION_DELAYS = {
  STAGGER_BASE: 0.1,
  HERO_CONTENT: 0.2,
  WEATHER_EFFECTS: 0.5,
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  ARTICLES_PER_PAGE: 9,
  ANNOUNCEMENTS_PER_PAGE: 6,
  GALLERY_PER_PAGE: 12,
} as const;

export const VALIDATION_RULES = {
  TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 200,
  },
  CONTENT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 5000,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
  },
} as const;

export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
} as const;

export const PRIORITY_LEVELS = {
  NORMAL: "normal",
  IMPORTANT: "penting",
  URGENT: "urgent",
} as const;

