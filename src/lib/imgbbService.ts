/**
 * imgbb Image Upload Service
 *
 * imgbb is a free image hosting service
 * Free tier: 1GB storage, 1000 files per month
 * No credit card required
 *
 * Sign up: https://imgbb.com
 */

// imgbb API endpoint
const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

export interface ImgbbResponse {
  success: boolean;
  data: {
    url: string;
    display_url: string;
    thumb: {
      url: string;
    };
    delete_url: string;
    width: number;
    height: number;
    size: number;
    time: string;
    expiration: string | null;
  };
  status: number;
  status_text: string;
}

/**
 * Upload image to imgbb
 *
 * @param file - File object to upload
 * @param apiKey - imgbb API key
 * @returns Promise with image URL
 */
export const uploadToImgbb = async (file: File, apiKey?: string): Promise<{ url: string; path: string }> => {
  const key = apiKey || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!key) {
    throw new Error("imgbb API key is required. Please set NEXT_PUBLIC_IMGBB_API_KEY in .env.local");
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.");
  }

  // Validate file size (max 32MB for imgbb)
  const maxSize = 32 * 1024 * 1024; // 32MB
  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 32MB.");
  }

  try {
    // Create form data
    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", key);

    // Make request to imgbb API
    const response = await fetch(IMGBB_API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`imgbb API error: ${response.status}`);
    }

    const result: ImgbbResponse = await response.json();

    if (!result.success) {
      throw new Error(result.status_text || "Failed to upload image");
    }

    return {
      url: result.data.url,
      path: result.data.display_url, // Using display_url for consistency
    };
  } catch (error) {
    console.error("Error uploading to imgbb:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image to imgbb");
  }
};

/**
 * Generate a placeholder image URL
 * Uses placehold.co for development/testing
 */
export const getPlaceholderImage = (width: number = 600, height: number = 400, text?: string): string => {
  const placeholderText = text || "No Image";
  return `https://placehold.co/${width}x${height}/556846/ffffff?text=${encodeURIComponent(placeholderText)}`;
};

/**
 * Check if a URL is a valid image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  if (url.startsWith("blob:")) return true; // Local blob URL
  if (url.startsWith("data:")) return true; // Base64 data URL
  if (url.includes("placehold.co")) return true; // Placeholder
  if (url.includes("imgbb.com")) return true; // imgbb URL
  if (url.includes("imgur.com")) return true; // imgur URL
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) return true; // Common image extensions

  return false;
};
